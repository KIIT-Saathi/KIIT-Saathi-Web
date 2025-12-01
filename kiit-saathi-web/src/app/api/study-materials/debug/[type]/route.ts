// src/app/api/study-materials/debug/[type]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  const { type } = params;

  try {
    console.log(`🔍 Debug: Testing access to ${type} table`);

    const { data, error, count } = await supabaseAdmin
      .from(type)
      .select("*", { count: "exact" })
      .limit(5);

    if (error) {
      console.error("❌ Debug error:", error);
      return NextResponse.json({
        success: false,
        table: type,
        error: error.message,
        details: error,
      });
    }

    console.log(`✅ Debug: Found ${count} total rows, returning first 5`);

    return NextResponse.json({
      success: true,
      table: type,
      totalCount: count,
      sampleData: data,
      columns: data && data.length > 0 ? Object.keys(data[0]) : [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
