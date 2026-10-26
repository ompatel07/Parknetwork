import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabasePublishableKey, supabaseUrl } from "./env";
import type { Database } from "./types";

let client: SupabaseClient<Database> | null = null;

/**
 * Cookie-free client with the publishable key, for public data (published
 * blog posts). No user session, so pages using it can be cached.
 */
export function createPublicClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured) return null;
  client ??= createClient<Database>(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return client;
}
