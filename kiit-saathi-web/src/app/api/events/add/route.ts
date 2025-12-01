import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();

    const authHeader = request.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ success: false, message: "Missing authorization header" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: authError } = await supabase.auth.getUser(token as any);
    if (authError || !userData?.user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const formData = body?.formData;
    if (!formData?.event_name || !formData?.event_date) return NextResponse.json({ success: false, message: "Event name and date are required" }, { status: 400 });

    // Check profile for admin flag
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_admin, email")
      .eq("id", userData.user.id)
      .single();

    if (profileError) throw profileError;

    const reqs = formData.requirements || [];

    if (profile?.is_admin) {
      // Admin → publish
      const { data, error } = await supabase
        .from("calendar_events")
        .insert([
          {
            ...formData,
            requirements: reqs,
            validation: true,
          },
        ])
        .select();

      if (error) throw error;

      return NextResponse.json({ success: true, message: "Event published successfully!", data });
    } else {
      // Regular user → create request
      const { error } = await supabase
        .from("interview_event_requests")
        .insert({
          ...formData,
          requirements: reqs,
          requester_email: userData.user.email,
          user_id: userData.user.id,
          status: "pending",
        });

      if (error) throw error;

      return NextResponse.json({ success: true, message: "Event submitted for review! You'll be notified once it's approved." });
    }
  } catch (err: any) {
    console.error("POST /api/events/add error:", err);
    return NextResponse.json({ success: false, message: err.message || "Failed to add event" }, { status: 500 });
  }
}
