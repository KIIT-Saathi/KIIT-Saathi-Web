// app/api/split-saathi/user-groups/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in env");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Helper: get user from Bearer token
async function getUserFromAuthHeader(authHeader?: string) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const user = await getUserFromAuthHeader(authHeader);

    // Fallback: if client posted userId/email in body (keeps compatibility)
    const body = await request.json().catch(() => ({}));
    const postedUserId = body?.userId;
    const postedEmail = body?.email;

    // prefer token-derived user
    const userId = user?.id || postedUserId;
    const email = user?.email || postedEmail;

    if (!userId || !email) {
      return NextResponse.json({ error: "Missing user information" }, { status: 400 });
    }

    // extract roll number from email, e.g., "2105555@kiit.ac.in"
    const rollNumberMatch = email.match(/^(\d+)@/);
    const rollNumber = rollNumberMatch?.[1];

    // groups created by user
    const { data: createdGroups, error: createdError } = await supabase
      .from("groups")
      .select("*")
      .eq("created_by", userId)
      .order("created_at", { ascending: false });

    if (createdError) throw createdError;

    let linkedGroups: any[] = [];

    if (rollNumber) {
      const { data: memberRecords, error: memberError } = await supabase
        .from("group_members")
        .select("group_id, groups!inner(*)")
        .eq("roll_number", rollNumber);

      if (memberError) throw memberError;

      linkedGroups = (memberRecords || [])
        .map((record: any) => record.groups)
        .filter((group: any) => group?.created_by !== userId);
    }

    const allGroups = [...(createdGroups || []), ...linkedGroups];
    const uniqueGroups = Array.from(new Map(allGroups.map((g: any) => [g.id, g])).values());

    return NextResponse.json(uniqueGroups, { status: 200 });
  } catch (err: any) {
    console.error("Error loading user groups:", err?.message || err);
    return NextResponse.json({ error: "Failed to load user groups" }, { status: 500 });
  }
}
