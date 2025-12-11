import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      itemId,
      itemTitle,
      itemPosterEmail,
      payerUserId,
      splitDetails
    } = body;

    //
    // -----------------------------------------
    // 1️⃣ VERIFY SIGNATURE
    // -----------------------------------------
    //
    const toHash = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(toHash)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 }
      );
    }

    //
    // -----------------------------------------
    // 2️⃣ VERIFY PAYMENT CAPTURED
    // -----------------------------------------
    //
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.status !== "captured") {
      return NextResponse.json(
        { success: false, message: "Payment not captured" },
        { status: 400 }
      );
    }

    //
    // -----------------------------------------
    // 3️⃣ UPDATE ORDER RECORD IN DB
    // -----------------------------------------
    //
    const { error: updateError } = await supabase
      .from("payment_orders")
      .update({
        status: "completed",
        payment_id: razorpay_payment_id,
        completed_at: new Date().toISOString(),
      })
      .eq("order_id", razorpay_order_id);

    if (updateError) {
      console.error("Error updating order:", updateError);
    }

    //
    // -----------------------------------------
    // 4️⃣ RECORD UNLOCK TRANSACTION
    // -----------------------------------------
    //
    const { error: unlockError } = await supabase
      .from("lost_found_contact_unlocks")
      .insert({
        item_id: itemId,
        payer_user_id: payerUserId,
        amount_paid: splitDetails.totalAmount,
        platform_fee: splitDetails.platformFee,
        poster_reward: splitDetails.posterAmount,
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
      });

    if (unlockError) {
      console.error("Error recording unlock:", unlockError);
      // DO NOT FAIL THE REQUEST — payment is successful
    }

    //
    // -----------------------------------------
    // 5️⃣ OPTIONAL POSTER PAYOUT (NON-CRITICAL)
    // -----------------------------------------
    //
    try {
      const payout = await razorpay.payouts.create({
        account_number: process.env.RAZORPAY_ACCOUNT_NUMBER,
        fund_account_id: "fa_poster_account_id", // dynamic in real use
        amount: splitDetails.posterAmount * 100,
        currency: "INR",
        mode: "IMPS",
        purpose: "payout",
        queue_if_low_balance: true,
        reference_id: `lf_reward_${itemId}_${Date.now()}`,
        narration: `Reward for helping with item: ${itemTitle}`,
      });

      console.log("Poster payout triggered:", payout);
    } catch (payoutError) {
      console.error("Payout failed (NON-CRITICAL):", payoutError?.message);
    }

    //
    // -----------------------------------------
    // 6️⃣ SEND CONTACT DETAILS EMAIL (INTERNAL API CALL)
    // Must use ABSOLUTE URL in Next.js
    // -----------------------------------------
    //
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      await fetch(`${baseUrl}/api/payments/send-contact-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId,
          itemTitle,
          payerUserId,
          posterContactDetails: { email: itemPosterEmail },
        }),
      });
    } catch (emailError) {
      console.error("Email sending failed (NON-CRITICAL):", emailError);
    }

    //
    // -----------------------------------------
    // 7️⃣ FINAL RESPONSE
    // -----------------------------------------
    //
    return NextResponse.json({
      success: true,
      message: "Payment verified and contact details unlocked",
      paymentId: razorpay_payment_id,
      splitProcessed: true,
    });

  } catch (error) {
    console.error("Error verifying Lost & Found payment:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Payment verification failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
