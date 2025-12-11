import { createClient } from "@supabase/supabase-js";

export const supabaseAuth = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Extracts and validates the Supabase JWT token from request headers
 * Returns userId if valid, otherwise throws an error
 */
export async function authenticateToken(req: Request): Promise<string> {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing or invalid authorization header");
  }

  const token = authHeader.replace("Bearer ", "").trim();

  // Validate token using Supabase auth
  const { data, error } = await supabaseAuth.auth.getUser(token);

  if (error || !data?.user) {
    throw new Error("Invalid or expired token");
  }

  return data.user.id; // return authenticated user ID
}
