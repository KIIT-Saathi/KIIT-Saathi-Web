// app/api/split-saathi/group/[groupId]/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in env");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function getUserFromAuthHeader(authHeader?: string) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

export async function GET(request: Request, { params }: { params: { groupID: string } }) {
  const groupId = params.groupID;
  try {
    const authHeader = request.headers.get("authorization") || "";
    const user = await getUserFromAuthHeader(authHeader);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user_id = user.id;

    // Fetch group
    const { data: group, error: groupError } = await supabase
      .from("groups")
      .select("*")
      .eq("id", groupId)
      .single();

    if (groupError) throw groupError;

    // Fetch members
    const { data: members, error: membersError } = await supabase
      .from("group_members")
      .select("*")
      .eq("group_id", groupId);

    if (membersError) throw membersError;

    // Fetch expenses with joined paid_by_member
    const { data: expenses, error: expensesError } = await supabase
      .from("expenses")
      .select(`
        *,
        paid_by_member:group_members(*)
      `)
      .eq("group_id", groupId)
      .order("date", { ascending: false });

    if (expensesError) throw expensesError;

    return NextResponse.json({ group, members, expenses }, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching group data:", err?.message || err);
    return NextResponse.json({ error: "Failed to fetch group data" }, { status: 500 });
  }
}
