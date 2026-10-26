import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getPublishedPosts } from "@/lib/blog";

const PAGES: { path: string; priority: number; freq: "weekly" | "monthly" | "yearly" }[] = [
  { path: "", priority: 1, freq: "weekly" },
  { path: "/services", priority: 0.9, freq: "monthly" },
  { path: "/careers", priority: 0.9, freq: "weekly" },
  { path: "/about", priority: 0.8, freq: "monthly" },
  { path: "/partnership", priority: 0.8, freq: "monthly" },
  { path: "/blog", priority: 0.8, freq: "weekly" },
  { path: "/contact", priority: 0.7, freq: "monthly" },
  { path: "/faq", priority: 0.6, freq: "monthly" },
  { path: "/privacy", priority: 0.2, freq: "yearly" },
  { path: "/terms", priority: 0.2, freq: "yearly" },
];

/**
 * Built fresh on every request (one small database query), so published,
 * edited and deleted posts show up for search engines straight away.
 * Static pages use the last content-update date (site.seo.updated) — a
 * stable "last modified" Google can trust.
 */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const updated = new Date(site.seo.updated);
  const posts = await getPublishedPosts(500);
  const newestPost = posts[0] ? new Date(posts[0].updated_at) : null;

  const pages: MetadataRoute.Sitemap = PAGES.map((p) => ({
    url: `${site.url}${p.path}`,
    lastModified: p.path === "/blog" && newestPost && newestPost > updated ? newestPost : updated,
    changeFrequency: p.freq,
    priority: p.priority,
  }));
  const articles: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "monthly",
    priority: 0.6,
    ...(p.cover_url ? { images: [p.cover_url] } : {}),
  }));
  return [...pages, ...articles];
}
