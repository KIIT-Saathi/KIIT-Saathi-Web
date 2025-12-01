// src/app/api/study-materials/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const subject = url.searchParams.get("subject");
  const semester = url.searchParams.get("semester");
  const year = url.searchParams.get("year");
  const search = url.searchParams.get("search");

  try {
    console.log("📚 Study materials request received:", {
      type,
      subject,
      semester,
      year,
      search,
    });

    const validTypes = ["pyqs", "notes", "ebooks", "ppts"];
    if (!type || !validTypes.includes(type)) {
      console.error("❌ Invalid type parameter:", type);
      return NextResponse.json(
        { error: "Invalid or missing type parameter" },
        { status: 400 }
      );
    }

    const tableName = type;
    console.log(`✅ Fetching materials from table: ${tableName}`);

    let query = supabaseAdmin
      .from(tableName)
      .select("*")
      .order("created_at", { ascending: false });

    if (subject) query = query.eq("subject", subject);
    if (semester) query = query.eq("semester", semester);
    if (year) query = query.eq("year", year);
    if (search) query = query.ilike("title", `%${search}%`);

    const { data, error } = await query;

    if (error) {
      console.error("❌ Supabase query error:", error);
      throw error;
    }

    console.log(`📊 Found ${data?.length || 0} materials in ${tableName} table`);

    if (!data || data.length === 0) {
      console.log("📭 No materials found, returning empty array");
      return NextResponse.json({ data: [] });
    }

    const materialsWithPublicUrls = data.map((material: any) => {
      const filePath =
        material.storage_path ||
        material.pdf_url ||
        material.downloadUrl ||
        material.url ||
        null;

      if (!filePath) {
        console.error(
          `❌ No file path found for material ID ${material.id}:`,
          {
            id: material.id,
            title: material.title,
            storage_path: material.storage_path,
            pdf_url: material.pdf_url,
          }
        );
        return { ...material, pdf_url: null };
      }

      try {
        if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
          console.log(
            `✅ Material ${material.id} already has a full URL:`,
            filePath
          );
          return { ...material, pdf_url: filePath };
        }

        const storagePath = filePath.replace(/^\/+/, "");

        console.log(
          `🔗 Generating PUBLIC URL for material ${material.id}:`,
          {
            title: material.title,
            originalPath: filePath,
            finalStoragePath: storagePath,
            materialType: type,
          }
        );

        const { data: publicUrlData } = supabaseAdmin.storage
          .from("study-materials")
          .getPublicUrl(storagePath);

        if (!publicUrlData?.publicUrl) {
          console.error(`❌ Error creating public URL for ${storagePath}`);
          return { ...material, pdf_url: null };
        }

        console.log(
          `✅ Successfully generated public URL for material ${material.id}:`,
          publicUrlData.publicUrl
        );
        return { ...material, pdf_url: publicUrlData.publicUrl };
      } catch (error) {
        console.error(`❌ Error processing material ${material.id}:`, error);
        return { ...material, pdf_url: null };
      }
    });

    const materialsWithValidUrls = materialsWithPublicUrls.filter(
      (m: any) => m.pdf_url !== null
    );
    console.log(
      `📤 Returning ${materialsWithValidUrls.length}/${materialsWithPublicUrls.length} materials with valid URLs`
    );

    return NextResponse.json({ data: materialsWithPublicUrls });
  } catch (error: any) {
    console.error(`❌ Error fetching study materials (type: ${type}):`, error);
    return NextResponse.json(
      {
        error: "Failed to fetch study materials",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
