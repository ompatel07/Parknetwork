/**
 * Supabase connection settings (Supabase dashboard → Project Settings → API Keys).
 * The publishable key is safe in the browser; the secret key lives in
 * `lib/supabase/admin.ts` and is only ever read on the server.
 */
export const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** False until the Supabase URL and publishable key are set. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

/**
 * Login session cookies: unreadable by page scripts (httpOnly — nothing in
 * the browser needs them; signing in/out happens on the server) and
 * HTTPS-only when hosted on Vercel.
 */
export const sessionCookieOptions = {
  httpOnly: true,
  secure: !!process.env.VERCEL,
  sameSite: "lax" as const,
  path: "/",
};

/** Public bucket that holds blog images (created by supabase/schema.sql). */
export const BLOG_BUCKET = "blog";

/** True for images stored in our own Supabase bucket (safe for next/image). */
export function isOwnImage(url: string | null | undefined) {
  return !!url && !!supabaseUrl && url.startsWith(`${supabaseUrl}/storage/v1/object/public/`);
}
