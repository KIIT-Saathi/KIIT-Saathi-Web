// src/app/api/admin/study-material-preview-url/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const path = url.searchParams.get("path");

    if (!path) {
      return NextResponse.json(
        { error: "Missing path" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin.storage
      .from("study-material-pending") // same as your Express code
      .createSignedUrl(path, 300);

    if (error) {
      throw error;
    }

    return NextResponse.json({ signedUrl: data?.signedUrl });
  } catch (error: any) {
    console.error("Error creating signed URL:", error);
    return NextResponse.json(
      { error: "Failed to create signed URL" },
      { status: 500 }
    );
  }
}
