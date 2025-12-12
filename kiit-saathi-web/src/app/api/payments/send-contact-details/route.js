import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer"; // adjust the path if needed

export async function POST(req) {
  try {
    const body = await req.json();
    const { itemId, itemTitle, payerUserId, posterContactDetails } = body;

    // Fetch payer's email from profiles table
    const { data: payerProfile, error: profileError } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", payerUserId)
      .single();

    if (profileError || !payerProfile) {
      console.error("Could not fetch payer profile:", profileError);
      return NextResponse.json(
        { error: "Could not find payer profile" },
        { status: 400 }
      );
    }

    // Here you will integrate SendGrid / Resend / Mailgun later
    console.log("Contact details to send:", {
      to: payerProfile.email,
      itemTitle,
      posterContactDetails,
    });

    return NextResponse.json({
      success: true,
      message: "Contact details sent via email",
    });
  } catch (error) {
    console.error("Error sending contact details:", error);
    return NextResponse.json(
      { error: "Failed to send contact details" },
      { status: 500 }
    );
  }
}
