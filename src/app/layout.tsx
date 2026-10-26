import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@/styles/globals.css";
import { clash, general, mono, serif } from "@/lib/fonts";
import { site } from "@/config/site";
import { OG_IMAGE } from "@/lib/seo";
import { preloaderScript } from "@/lib/boot";
import { motionScript } from "@/lib/motion";
import { JsonLd } from "@/components/seo/JsonLd";

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.seo.title, template: `%s | ${site.name}` },
  description: site.description,
  keywords: site.seo.keywords,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "Digital entertainment",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: "/",
    title: site.seo.title,
    description: site.description,
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", title: site.seo.title, description: site.description, images: [OG_IMAGE.url] },
  formatDetection: { telephone: false, email: false, address: false },
  // Google Search Console / Bing Webmaster "HTML tag" verification (optional — DNS verification works too)
  verification: {
    ...(googleVerification ? { google: googleVerification } : {}),
    ...(bingVerification ? { other: { "msvalidate.01": bingVerification } } : {}),
  },
};

export const viewport: Viewport = {
  themeColor: "#07060D",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Who we are, for search engines (shown on every page). */
const organization = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      alternateName: [site.shortName, "ParkLive Network"],
      url: site.url,
      logo: { "@type": "ImageObject", url: `${site.url}/brand/logo.png`, width: 800, height: 800 },
      image: `${site.url}/opengraph-image`,
      description: site.description,
      slogan: site.slogan,
      founder: site.team[0] ? { "@type": "Person", name: site.team[0].name } : undefined,
      areaServed: "Worldwide",
      knowsAbout: site.seo.keywords.slice(1, 5),
      telephone: site.contact.phone.href.replace("tel:", ""),
      contactPoint: [
        { "@type": "ContactPoint", telephone: site.contact.phone.href.replace("tel:", ""), contactType: "customer support", areaServed: "Worldwide", availableLanguage: ["English", "Hindi"] },
        ...site.contact.lines.map((l) => ({ "@type": "ContactPoint", telephone: `+${l.number}`, contactType: l.role })),
      ],
      sameAs: site.socials.map((s) => s.href),
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      alternateName: site.shortName,
      description: site.description,
      inLanguage: "en",
      publisher: { "@id": `${site.url}/#organization` },
    },
  ],
};

/**
 * Root layout shared by the public site and the admin panel: fonts, the
 * motion switch and structured data. The site's header, footer, particle
 * world and cursor live in `(site)/layout.tsx`; the admin has its own shell.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={site.language} className={`${clash.variable} ${general.variable} ${serif.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript + preloaderScript }} />
        <JsonLd data={organization} />
      </head>
      <body>{children}</body>
    </html>
  );
}
