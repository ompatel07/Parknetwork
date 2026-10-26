import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/**
 * Production: every public page may be crawled; the admin panel and the
 * internal design page may not. Preview deployments are never indexed.
 */
export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true;
  return {
    rules: isProd ? [{ userAgent: "*", allow: "/", disallow: ["/admin", "/styleguide"] }] : [{ userAgent: "*", disallow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
