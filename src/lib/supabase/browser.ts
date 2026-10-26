"use client";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { supabasePublishableKey, supabaseUrl } from "./env";
import type { Database } from "./types";

/**
 * Browser client used only to upload images to one-time signed URLs.
 * It never reads or stores the login session (those cookies are httpOnly).
 */
export function createClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
