import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const facultyId = String(url.searchParams.get("facultyId") ?? "").trim();
    if (!facultyId) {
      return NextResponse.json({ error: "Missing facultyId parameter" }, { status: 400 });
    }

    const fileName = `${facultyId}.jpg`;

    // Supabase JS v2: getPublicUrl returns { data: { publicUrl } }
    const { data } = supabase.storage.from("faculty-photos").getPublicUrl(fileName);
    const publicUrl = (data && (data.publicUrl || (data as any).publicURL)) || null;

    if (!publicUrl) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    return NextResponse.json({ photoUrl: publicUrl });
  } catch (err) {
    console.error("Error fetching faculty photo URL:", err);
    return NextResponse.json({ error: "Failed to fetch photo URL" }, { status: 500 });
  }
}
