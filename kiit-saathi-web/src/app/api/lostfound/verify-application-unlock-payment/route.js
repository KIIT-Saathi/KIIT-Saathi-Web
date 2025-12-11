import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";
import { authenticateToken } from "@/lib/supabaseAuth"; // your Next.js version of token validator
import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    // Authenticate user
    const ownerUserId = await authenticateToken(req);

    // Read JSON body
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      applicationId,
    } = body;

    // Check required fields
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !applicationId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate Razorpay signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Verify payment status from Razorpay
    try {
      const payment = await razorpay.payments.fetch(razorpay_payment_id);
      if (payment.status !== "captured") {
        return NextResponse.json(
          { error: "Payment not captured" },
          { status: 400 }
        );
      }
    } catch (e) {
      console.warn("Razorpay fetch warning:", e?.message);
    }

    // Update application status
    const { error: updateError } = await supabase
      .from("lost_found_applications")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
        payment_id: razorpay_payment_id,
      })
      .eq("id", applicationId);

    if (updateError) {
      console.error("Error updating application:", updateError);
      return NextResponse.json(
        { error: "Failed to unlock application" },
        { status: 500 }
      );
    }

    // Create an order entry (non-blocking)
    const { error: orderError } = await supabase.from("orders").insert({
      user_id: ownerUserId,
      service_name: "ApplicationContactUnlock",
      subservice_name: `Application ${applicationId}`,
      amount: null,
      payment_method: "razorpay",
      payment_status: "completed",
      transaction_id: razorpay_payment_id,
      booking_details: {
        application_id: applicationId,
        razorpay_order_id,
      },
    });

    if (orderError) {
      console.error("Error storing order:", orderError);
    }

    // Success response
    return NextResponse.json({
      success: true,
      message: "Contact details unlocked successfully",
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error("Error verifying application unlock payment:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
    