import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { authenticateToken } from "@/lib/auth"; // your Next.js version of token validator
import Razorpay from "razorpay";

// Initialize Razorpay (server-side only)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    // Extract & authenticate user
    const ownerUserId = await authenticateToken(req);

    // Parse request body
    const body = await req.json();
    const { amount, applicationId, lostItemTitle, receipt } = body;

    if (!razorpay) {
      return NextResponse.json(
        { error: "Payment service not available" },
        { status: 500 }
      );
    }

    if (!amount || !applicationId) {
      return NextResponse.json(
        { error: "Missing amount or applicationId" },
        { status: 400 }
      );
    }

    // Validate application status
    const { data: existingApplication, error: checkError } = await supabase
      .from("lost_found_applications")
      .select("status")
      .eq("id", applicationId)
      .single();

    if (checkError) {
      console.error("Check application error:", checkError);
      return NextResponse.json(
        { error: "Failed to validate application" },
        { status: 500 }
      );
    }

    if (existingApplication?.status === "paid") {
      return NextResponse.json(
        { error: "Already unlocked" },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: receipt || `app_unlock_${applicationId}_${Date.now()}`,
      notes: {
        application_id: applicationId,
        service: "application_contact_unlock",
        owner_user_id: ownerUserId,
        lost_item_title: lostItemTitle || "",
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating application unlock order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
