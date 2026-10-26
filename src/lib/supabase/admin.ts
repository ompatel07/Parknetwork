import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./env";
import type { Database } from "./types";

const secretKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

let client: SupabaseClient<Database> | null = null;

/**
 * Server-only client with the SECRET key: bypasses Row Level Security.
 * Only use it after checking the caller is allowed (see lib/admin/auth.ts),
 * and for jobs no signed-in user does: saving website form submissions,
 * managing accounts, signing image uploads.
 */
export function createAdminClient(): SupabaseClient<Database> | null {
  if (!supabaseUrl || !secretKey) return null;
  client ??= createClient<Database>(supabaseUrl, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return client;
}
