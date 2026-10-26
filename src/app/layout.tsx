import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@/styles/globals.css";
import { clash, general, mono, serif } from "@/lib/fonts";
import { site } from "@/config/site";
import { preloaderScript } from "@/lib/boot";
import { motionScript } from "@/lib/motion";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#07060D",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: site.name,
              url: site.url,
              logo: `${site.url}/brand/logo.png`,
              description: site.description,
              email: site.contact.email,
              telephone: site.contact.phone.href.replace("tel:", ""),
              contactPoint: [
                { "@type": "ContactPoint", telephone: site.contact.phone.href.replace("tel:", ""), contactType: "customer support" },
                ...site.contact.lines.map((l) => ({ "@type": "ContactPoint", telephone: `+${l.number}`, contactType: l.role })),
              ],
              founder: { "@type": "Person", name: site.team[0]?.name },
              slogan: site.slogan,
              sameAs: site.socials.map((s) => s.href),
              areaServed: "Worldwide",
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
