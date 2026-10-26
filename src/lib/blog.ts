import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import type { Post } from "@/lib/supabase/types";

export type PublicPost = Pick<
  Post,
  "id" | "slug" | "title" | "excerpt" | "cover_url" | "cover_alt" | "tags" | "published_at" | "updated_at" | "author_name"
>;

const LIST_COLUMNS = "id, slug, title, excerpt, cover_url, cover_alt, tags, published_at, updated_at, author_name";

/**
 * Published posts, newest first. Never throws: if Supabase isn't set up or
 * is unreachable, the blog simply shows no posts.
 */
export async function getPublishedPosts(limit = 60): Promise<PublicPost[]> {
  const db = createPublicClient();
  if (!db) return [];
  try {
    const { data, error } = await db
      .from("posts")
      .select(LIST_COLUMNS)
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

export const getPublishedPost = cache(async (slug: string): Promise<(PublicPost & { content: string }) | null> => {
  const db = createPublicClient();
  if (!db || !/^[a-z0-9-]{1,120}$/.test(slug)) return null;
  try {
    const { data, error } = await db
      .from("posts")
      .select(`${LIST_COLUMNS}, content`)
      .eq("slug", slug)
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .maybeSingle();
    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
});

/** About 220 words a minute; at least 1. */
export function readingMinutes(markdown: string) {
  const words = markdown.replace(/[#>*_`\-[\]()!]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function formatDate(iso: string | null | undefined) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
}
