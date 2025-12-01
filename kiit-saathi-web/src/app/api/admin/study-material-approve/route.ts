// src/app/api/admin/study-material-approve/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { request_id } = body;

    if (!request_id) {
      return NextResponse.json(
        { error: "request_id is required" },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("authorization") || "";

    const { data, error } = await supabaseAdmin.functions.invoke(
      "admin-approve-study-material",
      {
        body: { request_id },
        headers: { Authorization: authHeader },
      }
    );

    if (error) {
      console.error("Edge function error:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Approval function failed",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error invoking approval function:", error);
    return NextResponse.json(
      { success: false, error: "Failed to approve material" },
      { status: 500 }
    );
  }
}
