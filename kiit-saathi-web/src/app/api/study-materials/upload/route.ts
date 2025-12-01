// src/app/api/study-materials/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;
    const subject = formData.get("subject") as string | null;
    const semester = formData.get("semester") as string | null;
    const branch = (formData.get("branch") as string | null) || null;
    const year = (formData.get("year") as string | null) || null;
    const folder_type = formData.get("folder_type") as string | null;
    const uploader_name = formData.get("uploader_name") as string | null;

    const validTypes = ["pyqs", "notes", "ebooks", "ppts"];
    if (
      !file ||
      !title ||
      !subject ||
      !semester ||
      !folder_type ||
      !uploader_name ||
      !validTypes.includes(folder_type)
    ) {
      return NextResponse.json(
        { error: "Missing or invalid required fields", success: false },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type", success: false },
        { status: 400 }
      );
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 50MB limit", success: false },
        { status: 400 }
      );
    }

    // NOTE: you were using req.user in Express.
    // Here you need to integrate your auth system if you want real user ID.
    const userId = null;

    const timestamp = Date.now();
    const filename = `${userId ? userId : "guest"}_${timestamp}_${file.name}`;
    const storagePath = `${folder_type}/pending/${filename}`;

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabaseAdmin.storage
      .from("study-materials")
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload file", success: false },
        { status: 500 }
      );
    }

    const { error: insertError } = await supabaseAdmin
      .from("study_material_requests")
      .insert({
        title,
        subject,
        semester,
        branch,
        year,
        folder_type,
        uploader_name,
        uploader_id: userId,
        filename,
        storage_path: storagePath,
        filesize: file.size,
        mime_type: file.type,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (insertError) {
      await supabaseAdmin.storage
        .from("study-materials")
        .remove([storagePath]);
      console.error("Insert error:", insertError);
      throw insertError;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Study material upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload material", success: false },
      { status: 500 }
    );
  }
}
