import type { MetadataRoute } from "next";
import { site } from "@/config/site";

const ROUTES = ["", "/about", "/services", "/careers", "/partnership", "/contact", "/faq", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((r) => ({
    url: `${site.url}${r}`,
    lastModified: now,
    changeFrequency: r === "" ? "weekly" : "monthly",
    priority: r === "" ? 1 : r === "/privacy" || r === "/terms" ? 0.3 : 0.8,
  }));
}
