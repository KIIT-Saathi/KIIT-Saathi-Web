import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const access_token = searchParams.get("access_token");

    if (!access_token) {
      return NextResponse.json({ error: "Missing access token" }, { status: 400 });
    }

    const { data: user, error } = await supabase.auth.getUser(access_token);

    if (error || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (user.user?.email_confirmed_at) {
      return NextResponse.json({ success: true, message: "Email confirmed" });
    } else {
      return NextResponse.json(
        { success: false, message: "Email not confirmed yet" },
        { status: 403 }
      );
    }
  } catch (err) {
    console.error("Auth callback failed:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
