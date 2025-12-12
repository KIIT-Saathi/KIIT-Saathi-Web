import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const body = await req.json();

    const { 
      amount, 
      itemId, 
      itemTitle, 
      itemPosterEmail, 
      payerUserId, 
      receipt 
    } = body;

    // Validate required fields
    if (!amount || !itemId || !itemTitle || !payerUserId) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: ["amount", "itemId", "itemTitle", "payerUserId"],
        },
        { status: 400 }
      );
    }

    // Razorpay order options
    const options = {
      amount: amount, // paise
      currency: "INR",
      receipt,
      notes: {
        item_id: itemId,
        item_title: itemTitle,
        service: "lost_found_contact",
        payer_user_id: payerUserId,
        poster_email: itemPosterEmail || null,
      },
    };

    // Create Razorpay order
    const order = await razorpay.orders.create(options);

    // Store order in database
    const { error: dbError } = await supabase
      .from("payment_orders")
      .insert({
        order_id: order.id,
        amount: amount / 100, // convert paise → ₹
        currency: "INR",
        status: "created",
        service_type: "lost_found_contact",
        user_id: payerUserId,
        metadata: {
          item_id: itemId,
          item_title: itemTitle,
          poster_email: itemPosterEmail,
        },
      });

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Database error while storing order" },
        { status: 500 }
      );
    }

    console.log("Lost & Found order created:", order);

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating Lost & Found order:", error);
    return NextResponse.json(
      { error: "Failed to create order", details: error.message },
      { status: 500 }
    );
  }
}
