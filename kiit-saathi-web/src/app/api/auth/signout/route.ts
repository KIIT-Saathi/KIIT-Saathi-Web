import { supabaseAuth } from "@/lib/supabaseAuth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password, fullName } = await req.json();

  const { data, error } = await supabaseAuth.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "https://ksaathi.vercel.app/auth/callback",
      data: { full_name: fullName }
    }
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({
    success: true,
    user: data.user,
    session: data.session
  });
}
