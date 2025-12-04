// src/pages/api/faculty/upload-photo.ts
import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs";
import { supabase } from "@/lib/supabaseServer"; // <-- server-side Supabase client (service role)

export const config = {
  api: {
    bodyParser: false, // required for formidable
  },
};

// Extend Formidable `File` with a few optional legacy fields that appear
// in some environments/versions (some code uses `type` or `mime`).
type FormidableFile = File & { mimetype?: string; type?: string; mime?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method not allowed" });
    }

    const form = new formidable.IncomingForm({
      multiples: false,
      maxFileSize: 2 * 1024 * 1024, // 2MB
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Form parse error:", err);
        return res.status(400).json({ error: "Error parsing the file upload" });
      }

      const facultyId = String(fields?.facultyId || "").trim();
      if (!facultyId) {
        return res.status(400).json({ error: "Missing facultyId in form data" });
      }

      // Expect field name 'photo'
      const file = files?.photo as FormidableFile | undefined;
      if (!file) {
        return res.status(400).json({ error: "No file uploaded (expected field name 'photo')" });
      }

      // Validate mime — prefer `mimetype`, fall back to `type` or `mime`.
      const mime = file.mimetype ?? file.type ?? file.mime ?? (file as any).mime ?? null;
      if (!mime || !/^image\/(jpeg|jpg|png)$/.test(mime)) {
        return res.status(400).json({ error: "Only JPG and PNG files are allowed" });
      }

      // Validate size (formidable already enforces but double-check)
      if (file.size && file.size > 2 * 1024 * 1024) {
        return res.status(400).json({ error: "File size must be less than 2MB" });
      }

      const fileName = `${facultyId}.jpg`;

      try {
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
          return res.status(500).json({ error: "Failed to upload to storage" });
        }

        // get public url
        const { data } = supabase.storage.from("faculty-photos").getPublicUrl(fileName);
        const publicUrl = (data && (data.publicUrl || (data as any).publicURL)) || null;

        return res.json({ photoUrl: publicUrl });
      } catch (uploadErr) {
        console.error("Faculty photo upload error:", uploadErr);
        return res.status(500).json({ error: "Failed to upload photo" });
      } finally {
        // cleanup temp file - formidable stores files in tmp; ensure removal
        try {
          if (file && file.filepath && fs.existsSync(file.filepath)) {
            fs.unlinkSync(file.filepath);
          }
        } catch (e) {
          // ignore cleanup errors
        }
      }
    });
  } catch (err) {
    console.error("Upload handler error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
