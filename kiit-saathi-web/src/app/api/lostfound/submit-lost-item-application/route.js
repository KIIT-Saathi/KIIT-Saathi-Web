import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { authenticateToken } from "@/lib/auth"; // your JWT verifier

export async function POST(req) {
  try {
    // Authenticate user (returns user_id)
    const applicantUserId = await authenticateToken(req);

    // Parse JSON body
    const body = await req.json();

    const {
      lostItemId,
      lostItemTitle,
      lostItemOwnerEmail,
      applicantName,
      applicantEmail,
      applicantPhone,
      foundPhotoUrl,
      foundDescription,
      foundLocation,
      foundDate,
    } = body;

    console.log("Application submission data:", {
      applicantUserId,
      lostItemId,
      applicantName,
      applicantEmail,
      applicantPhone,
      foundPhotoUrl: foundPhotoUrl ? "provided" : "missing",
      foundDescription: foundDescription ? "provided" : "missing",
      foundLocation,
      foundDate,
    });

    // Validate required fields
    if (
      !lostItemId ||
      !lostItemOwnerEmail ||
      !applicantName ||
      !applicantEmail ||
      !applicantPhone ||
      !foundPhotoUrl ||
      !foundDescription ||
      !foundLocation ||
      !foundDate
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { data: applicationData, error: insertError } = await supabase
      .from("lost_found_applications")
      .insert({
        lost_item_id: lostItemId,
        applicant_user_id: applicantUserId || null,
        applicant_name: applicantName,
        applicant_email: applicantEmail,
        applicant_phone: applicantPhone,
        found_photo_url: foundPhotoUrl,
        found_description: foundDescription,
        found_location: foundLocation,
        found_date: foundDate,
        status: "pending",
      })
      .select()
      .single();

    // Handle database insert errors
    if (insertError) {
      console.error("Database insert error:", {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
      });

      // Handle unique constraint violation (duplicate application)
      if (
        insertError.code === "23505" ||
        `${insertError.message}`.includes("unique_application_per_user_per_item")
      ) {
        return NextResponse.json(
          {
            error: "You have already applied for this lost item.",
            type: "duplicate",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          error: "Failed to save application",
          details: insertError.message,
        },
        { status: 500 }
      );
    }

    console.log("Application submitted successfully:", applicationData.id);

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      applicationId: applicationData.id,
    });
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      {
        error: "Failed to submit application",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
