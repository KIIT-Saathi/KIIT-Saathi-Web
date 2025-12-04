import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("lost_and_found_items")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Convert file names → public URLs
    const itemsWithImages = (data || []).map((item) => {
      if (item.image_url && !item.image_url.startsWith("http")) {
        const { data: urlData } = supabase.storage
          .from("lost-and-found-images")
          .getPublicUrl(item.image_url);

        return { ...item, image_url: urlData.publicUrl };
      }
      return item;
    });

    return NextResponse.json({ items: itemsWithImages });
  } catch (err) {
    console.error("Error fetching lost & found items:", err);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}
