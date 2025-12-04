import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";
import { authenticateToken } from "@/lib/authServer";

export async function GET(req) {
  try {
    const supabase = createServerClient();
    const user_id = await authenticateToken(req);

    const { searchParams } = new URL(req.url);
    const item_id = searchParams.get("item_id");

    const { data, error } = await supabase
      .from("orders")
      .select("id")
      .eq("user_id", user_id)
      .eq("service_name", "LostAndFoundContact")
      .eq("payment_status", "completed")
      .contains("booking_details", { item_id })
      .limit(1);

    return NextResponse.json({ paid: !!(data?.length) });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to verify payment", details: error.message },
      { status: 500 }
    );
  }
}
