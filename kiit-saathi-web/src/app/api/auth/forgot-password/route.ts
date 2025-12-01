import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!email.endsWith("@kiit.ac.in")) {
      return NextResponse.json(
        { error: "Only KIIT College Email IDs (@kiit.ac.in) are allowed" },
        { status: 400 }
      );
    }

    const redirect = `${process.env.FRONTEND_URL || "https://ksaathi.vercel.app"}/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirect
    });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Password reset email sent"
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to send reset email" },
      { status: 400 }
    );
  }
}
