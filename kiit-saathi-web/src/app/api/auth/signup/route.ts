import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, password, fullName } = await req.json();

    if (!email.endsWith("@kiit.ac.in")) {
      return NextResponse.json(
        { error: "Only KIIT College Email IDs (@kiit.ac.in) are allowed." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://ksaathi.vercel.app/auth/callback",
        data: { full_name: fullName }
      }
    });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
      message: data?.user && !data.session
        ? "Check your email for the confirmation link"
        : "Account created successfully"
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Sign up failed" },
      { status: 400 }
    );
  }
}
