import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("service_visibility")
      .select("*");

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch service visibility" },
        { status: 500 }
      );
    }

    return NextResponse.json({ services: data || [] });
  } catch (err) {
    console.error("Route error:", err);
    return NextResponse.json(
      { error: "Failed to fetch service visibility" },
      { status: 500 }
    );
  }
}
