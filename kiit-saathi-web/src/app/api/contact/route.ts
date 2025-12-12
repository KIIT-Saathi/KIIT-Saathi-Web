import { NextResponse } from "next/server";

// OPTIONAL: If you want emails, you can integrate Resend / SMTP here.
// For now, it simply logs & returns a success response.

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { fullName, email, phone, subject, message } = body;

    // Basic validation (extra safety)
    if (!fullName || !email || !subject || !message) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    // Log to server console (you can store in DB or send email)
    console.log("📩 New Contact Form Submission:");
    console.log({
      fullName,
      email,
      phone,
      subject,
      message,
      receivedAt: new Date().toISOString(),
    });

    // TODO: Save to Supabase OR Send Email via Resend
    // await resend.emails.send({ ... })

    return NextResponse.json(
      { message: "Message received successfully!" },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ Contact API Error:", error);
    return NextResponse.json(
      { message: "Something went wrong while submitting your message." },
      { status: 500 }
    );
  }
}
