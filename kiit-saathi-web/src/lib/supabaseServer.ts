// lib/supabaseServer.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export function createServerClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY; // service role key

  if (!url || !key) {
    throw new Error("Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, key);
}

// Backwards-compatible export (optional). Consumers should call `createServerClient()` to get a client.

