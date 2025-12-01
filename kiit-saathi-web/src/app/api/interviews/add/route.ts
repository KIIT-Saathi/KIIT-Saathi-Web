import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();

    const authHeader = request.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token as any);
    if (userError || !userData?.user) return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });

    const body = await request.json();
    const formData = body?.formData;
    if (!formData?.interview_name || !formData?.interview_date) return NextResponse.json({ success: false, message: "Interview name and date are required" }, { status: 400 });

    const reqs = formData.requirements
      ? (Array.isArray(formData.requirements) ? formData.requirements : String(formData.requirements).split(",").map(r => r.trim()).filter(Boolean))
      : [];

    // Get user profile (scoped to current user)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", userData.user.id)
      .single();

    if (profileError) throw profileError;

    if (profile?.is_admin) {
      const { data, error } = await supabase
        .from("interview_events")
        .insert([{ ...formData, requirements: reqs, validation: true }])
        .select();

      if (error) return NextResponse.json({ success: false, message: error.message }, { status: 500 });

      return NextResponse.json({ success: true, message: "Interview added successfully", data });
    } else {
      const { error } = await supabase
        .from("interview_events")
        .insert({ ...formData, requirements: reqs });

      if (error) return NextResponse.json({ success: false, message: error.message }, { status: 500 });

      return NextResponse.json({ success: true, message: "Interview submitted for review! You'll be notified once it's approved" });
    }
  } catch (err: any) {
    console.error("POST /api/interviews/add error:", err);
    return NextResponse.json({ success: false, message: err.message || "Failed to submit interview" }, { status: 500 });
  }
}
