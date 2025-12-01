import { supabaseAuth } from "@/lib/supabaseAuth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const { data, error } = await supabaseAuth.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, session: data.session });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
