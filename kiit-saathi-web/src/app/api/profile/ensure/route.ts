// src/app/api/profile/ensure/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer"; // adjust path if needed

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { user_id, email, full_name } = body || {};

    if (!user_id || !email) {
      return NextResponse.json(
        { success: false, error: "Missing user_id or email" },
        { status: 400 }
      );
    }

    // Check if profile exists
    const { data: existing, error: selectError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user_id)
      .maybeSingle();

    if (selectError) {
      console.error("profiles select error:", selectError);
      return NextResponse.json({ success: false, error: selectError.message }, { status: 500 });
    }

    // If not exists, insert
    if (!existing) {
      const { error: insertError } = await supabase.from("profiles").insert([
        { id: user_id, email, full_name: full_name || email },
      ]);
      if (insertError) {
        console.error("profiles insert error:", insertError);
        return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("profile ensure exception:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
