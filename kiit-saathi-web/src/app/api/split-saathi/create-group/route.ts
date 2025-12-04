// app/api/split-saathi/create-group/route.ts
import { NextResponse } from "next/server";
import { supabase, getUserFromAuthHeader } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const user = await getUserFromAuthHeader(authHeader);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = user.id;

    const body = await request.json().catch(() => ({}));
    const groupForm = body?.groupForm;

    if (!groupForm?.name?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const validMembers = (groupForm.members || []).filter(
      (m: any) => m.name && m.name.trim() !== ""
    );

    if (validMembers.length === 0) {
      return NextResponse.json({ error: "At least one member with a name is required" }, { status: 400 });
    }

    // 1. create group
    const { data: group, error: groupError } = await supabase
      .from("groups")
      .insert({
        name: groupForm.name,
        description: groupForm.description,
        currency: groupForm.currency || "₹",
        created_by: userId,
      })
      .select()
      .single();

    if (groupError) throw groupError;

    // 2. insert members
    const membersToInsert = validMembers.map((member: any) => ({
      group_id: group.id,
      name: member.name.trim(),
      email_phone: "",
      roll_number: member.rollNumber?.trim() || null,
    }));

    const { error: membersError } = await supabase
      .from("group_members")
      .insert(membersToInsert);

    if (membersError) throw membersError;

    return NextResponse.json({
      message: "Group created successfully",
      group,
      memberCount: validMembers.length,
    }, { status: 200 });
  } catch (err: any) {
    console.error("❌ Error creating group:", err?.message || err);
    return NextResponse.json({ error: "Failed to create group" }, { status: 500 });
  }
}
