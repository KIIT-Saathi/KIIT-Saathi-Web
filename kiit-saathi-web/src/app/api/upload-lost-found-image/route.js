import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

export async function POST(req) {
  try {
    const form = await req.formData();

    const file = form.get("image");
    const lostItemId = form.get("lostItemId");

    if (!file) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    if (!lostItemId) {
      return NextResponse.json({ error: "Missing lostItemId" }, { status: 400 });
    }

    // Validate mime type
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG and PNG files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (<5MB)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (buffer.length > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Create unique filename
    const ext = file.name.split(".").pop();
    const fileName = `application_${lostItemId}_${Date.now()}.${ext}`;

    // Upload to Supabase
    const { error: uploadError } = await supabase.storage
      .from("lost-and-found-images")
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error(uploadError);
      return NextResponse.json(
        { error: "Upload failed" },
        { status: 500 }
      );
    }

    // Generate public URL
    const { data } = supabase.storage
      .from("lost-and-found-images")
      .getPublicUrl(fileName);

    return NextResponse.json({ publicUrl: data.publicUrl });
  } catch (error) {
    console.error("Lost & Found image upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
