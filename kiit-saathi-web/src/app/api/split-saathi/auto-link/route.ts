// app/api/split-saathi/auto-link/route.ts
import { NextResponse } from "next/server";
import { supabase, getUserFromAuthHeader } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const tokenUser = await getUserFromAuthHeader(authHeader);

    if (!tokenUser?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user_id = tokenUser.id;

    // Fetch user email via Supabase Admin API to ensure canonical email
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(user_id);
    if (userError || !userData?.user?.email) {
      console.error("Could not fetch user email", userError);
      return NextResponse.json({ error: "Could not fetch user email" }, { status: 400 });
    }
    const email = userData.user.email;

    // Extract roll number from email (e.g., "2105555@kiit.ac.in")
    const rollMatch = email.match(/^(\d+)@/);
    if (!rollMatch) {
      return NextResponse.json({ newGroups: [] }, { status: 200 });
    }
    const rollNumber = rollMatch[1];

    // Fetch matching group_members rows with group join
    const { data: matchingMembers, error: membersError } = await supabase
      .from("group_members")
      .select(`
        id,
        roll_number,
        group_id,
        groups!inner(
          id,
          name,
          created_by
        )
      `)
      .eq("roll_number", rollNumber);

    if (membersError) throw membersError;
    if (!matchingMembers || matchingMembers.length === 0) {
      return NextResponse.json({ newGroups: [] }, { status: 200 });
    }

    const newGroups: Array<any> = [];

    for (const member of matchingMembers) {
      const group = (member as any).groups;
      if (!group) continue;

      // skip groups created by the same user
      if (group.created_by === user_id) continue;

      // check if notification already exists
      const { data: existingNotification } = await supabase
        .from("group_notifications")
        .select("id")
        .eq("user_id", user_id)
        .eq("group_id", group.id)
        .single();

      if (existingNotification) continue;

      // insert notification
      const { error: insertNotifError } = await supabase
        .from("group_notifications")
        .insert({ user_id, group_id: group.id });

      if (insertNotifError) {
        // continue — but log error
        console.error("Failed to insert notification for group", group.id, insertNotifError);
        continue;
      }

      // fetch creator profile
      const { data: creatorProfile } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", group.created_by)
        .single();

      const creatorName = creatorProfile?.full_name || "Unknown";
      const creatorEmail = creatorProfile?.email || "";
      const creatorRollNumber = creatorEmail.match(/^(\d+)@/)?.[1] || "";

      newGroups.push({
        name: group.name,
        creatorName,
        creatorRollNumber,
        rollNumber,
      });
    }

    return NextResponse.json({ newGroups }, { status: 200 });
  } catch (err: any) {
    console.error("Error auto-linking groups:", err?.message || err);
    return NextResponse.json({ error: "Failed to auto-link groups" }, { status: 500 });
  }
}
