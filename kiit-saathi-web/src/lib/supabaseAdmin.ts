// src/lib/supabaseAdmin.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-side only

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing SUPABASE env vars for admin client");
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
