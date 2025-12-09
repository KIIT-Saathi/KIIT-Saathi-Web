import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { createServerClient } from "@/lib/supabaseServer";

export async function GET() {
  try {
const supabase = createServerClient();

    const { data, error } = await supabase
      .from("calendar_events")
      .select("*")
      .order("event_date", { ascending: true });

    if (error) {
      console.error("Supabase DB Error:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: any) {
    console.error("GET /api/events ERROR:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
