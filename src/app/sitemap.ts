import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getPublishedPosts } from "@/lib/blog";

const ROUTES = ["", "/about", "/services", "/careers", "/partnership", "/blog", "/contact", "/faq", "/privacy", "/terms"];

/**
 * Built fresh on every request (one small database query), so published,
 * edited and deleted posts show up for search engines straight away.
 */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = ROUTES.map((r) => ({
    url: `${site.url}${r}`,
    lastModified: now,
    changeFrequency: r === "" || r === "/blog" ? "weekly" : "monthly",
    priority: r === "" ? 1 : r === "/privacy" || r === "/terms" ? 0.3 : 0.8,
  }));
  const posts = (await getPublishedPosts(500)).map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...pages, ...posts];
}
