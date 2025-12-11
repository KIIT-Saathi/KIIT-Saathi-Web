// src/app/api/faculty/upload-photo/route.ts

import { NextResponse } from "next/server"; // Use NextResponse instead of NextApiResponse
import formidable, { File } from "formidable";
import fs from "fs";
import { supabase } from "@/lib/supabaseServer";

// Since we are now in the App Router, 'config' with 'api' is NOT used.
// The equivalent for 'bodyParser: false' is to use the standard 'Request' object,
// which is already handled by formidable when passing the 'req' stream.

// Extend Formidable `File` (keep this type definition)
type FormidableFile = File & { mimetype?: string; type?: string; mime?: string };

// Helper function to parse formidable in the App Router format
const parseForm = (req: Request): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm({
      multiples: false,
      maxFileSize: 2 * 1024 * 1024, // 2MB
    });

    // We must pass the raw request stream to formidable
    // @ts-ignore - 'req' is a standard Web Request in App Router
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      resolve({ fields, files });
    });
  });
};

// Use POST function instead of default handler
export async function POST(req: Request) {
  try {
    const { fields, files } = await parseForm(req);

    const facultyId = String(fields?.facultyId?.[0] || "").trim(); // formidable fields are now arrays
    if (!facultyId) {
      return NextResponse.json({ error: "Missing facultyId in form data" }, { status: 400 });
    }

    // Expect field name 'photo'
    const file = files?.photo?.[0] as FormidableFile | undefined; // formidable files are now arrays
    if (!file) {
      return NextResponse.json({ error: "No file uploaded (expected field name 'photo')" }, { status: 400 });
    }

    // ... (Keep file validation and Supabase logic, replacing res.status(X).json with NextResponse.json) ...

    // Validate mime — prefer `mimetype`, fall back to `type` or `mime`.
    const mime = file.mimetype ?? file.type ?? file.mime ?? (file as any).mime ?? null;
    if (!mime || !/^image\/(jpeg|jpg|png)$/.test(mime)) {
      return NextResponse.json({ error: "Only JPG and PNG files are allowed" }, { status: 400 });
    }

    // Validate size (formidable already enforces but double-check)
    if (file.size && file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 2MB" }, { status: 400 });
    }

    const fileName = `${facultyId}.jpg`;

    // read file buffer
    const buffer = fs.readFileSync(file.filepath);

    // remove existing file (optional)
    await supabase.storage.from("faculty-photos").remove([fileName]).catch(() => {
      // ignore errors from remove
    });

    // upload - upsert to replace existing
    const { error: uploadError } = await supabase.storage
      .from("faculty-photos")
      .upload(fileName, buffer, {
        contentType: mime,
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json({ error: "Failed to upload to storage" }, { status: 500 });
    }

    // get public url
    const { data } = supabase.storage.from("faculty-photos").getPublicUrl(fileName);
    const publicUrl = (data && (data.publicUrl || (data as any).publicURL)) || null;

    // cleanup temp file
    try {
      if (file && file.filepath && fs.existsSync(file.filepath)) {
        fs.unlinkSync(file.filepath);
      }
    } catch (e) {
      // ignore cleanup errors
    }

    return NextResponse.json({ photoUrl: publicUrl });

  } catch (err) {
    console.error("Upload handler error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}