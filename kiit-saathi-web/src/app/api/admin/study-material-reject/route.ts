// src/app/api/admin/study-material-reject/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { request_id, folder_type, admin_comment } = body;

    const validTypes = ["pyqs", "notes", "ebooks", "ppts"];
    if (!request_id || !folder_type || !validTypes.includes(folder_type)) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    const tableName = folder_type;

    const { data: requestRow, error: fetchError } = await supabaseAdmin
      .from(tableName)
      .select("pdf_url")
      .eq("id", request_id)
      .single();

    if (fetchError || !requestRow) {
      throw new Error("Request not found");
    }

    const storagePath = `${folder_type}/pending/${requestRow.pdf_url}`;

    const { error: removeError } = await supabaseAdmin.storage
      .from("study-materials")
      .remove([storagePath]);

    if (removeError) throw removeError;

    const { error: updateError } = await supabaseAdmin
      .from(tableName)
      .update({
        status: "rejected",
        admin_comment,
        updated_at: new Date().toISOString(),
      })
      .eq("id", request_id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error rejecting material:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reject material" },
      { status: 500 }
    );
  }
}
