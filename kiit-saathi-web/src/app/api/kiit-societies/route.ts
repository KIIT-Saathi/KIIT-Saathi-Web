// app/api/kiit-societies/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer"; // create a server client when needed

export async function GET() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("calendar_events")
      .select("*")
      .eq("validation", true)
      .order("event_date", { ascending: true });

    if (error) throw error;
    console.log(data)
    return NextResponse.json({ events: data || [] }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/kiit-societies error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch societies" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, section, brief, category, members, gradient, website, instagram, upcomingEvent, logoPlaceholder } = body;

    if (!name || !section) {
      return NextResponse.json({ success: false, message: "name and section required" }, { status: 400 });
    }

    const supabase = createServerClient();

    // Optional: check admin via auth token passed from client in Authorization header
    const authHeader = request.headers.get("authorization") || "";
    let isAdmin = false;
    if (authHeader.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const { data: userData } = await supabase.auth.getUser(token as any);
      // fetch profile to check is_admin flag
      if (userData?.user?.id) {
        const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", userData.user.id).single();
        isAdmin = !!profile?.is_admin;
      }
    }

    // If you want only admin to insert, enforce:
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("societies")
      .insert([
        {
          name,
          section,
          brief,
          category,
          members,
          gradient,
          website,
          instagram,
          upcomingEvent,
          logoPlaceholder,
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/kiit-societies error:", err);
    return NextResponse.json({ success: false, message: err.message || "Failed to create society" }, { status: 500 });
  }
}
