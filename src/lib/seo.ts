import type { Metadata } from "next";
import { site } from "@/config/site";

/** The default social preview image (src/app/opengraph-image.tsx). */
export const OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: site.seo.title };

/**
 * Complete search + social metadata for one public page: title,
 * description, keywords, canonical URL, Open Graph and Twitter cards.
 * (Each page sets its own Open Graph block, because Next replaces — not
 * merges — nested metadata from the layout.)
 */
export function pageMeta({
  title,
  description,
  path,
  keywords = [],
  absoluteTitle = false,
  type = "website",
  images,
}: {
  title: string;
  description: string;
  /** e.g. "/about" — becomes the canonical URL */
  path: string;
  keywords?: string[];
  /** use `title` as-is instead of "title | Park Live Network" */
  absoluteTitle?: boolean;
  type?: "website" | "article";
  images?: { url: string; width?: number; height?: number; alt?: string }[];
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  const og = images?.length ? images : [OG_IMAGE];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: [...new Set([...keywords, ...site.seo.keywords])],
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName: site.name,
      locale: site.locale,
      title: fullTitle,
      description,
      images: og,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: og.map((i) => i.url) },
  };
}

/** Breadcrumb trail for structured data: Home › … › page */
export function breadcrumbs(...trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${site.url}${t.path === "/" ? "" : t.path}`,
    })),
  };
}
