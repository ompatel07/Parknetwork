import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@/styles/globals.css";
import { clash, general, mono, serif } from "@/lib/fonts";
import { site } from "@/config/site";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { PageTransitionProvider } from "@/components/motion/PageTransition";
import { Cursor } from "@/components/motion/Cursor";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { WorldLoader } from "@/components/world/WorldLoader";
import { SceneDirector } from "@/components/world/SceneDirector";
import { Preloader, preloaderScript } from "@/components/motion/Preloader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={site.language} className={`${clash.variable} ${general.variable} ${serif.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preloaderScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: site.name,
              url: site.url,
              logo: `${site.url}/brand/logo-badge.jpeg`,
              description: site.description,
              email: site.contact.email,
              sameAs: site.socials.map((s) => s.href),
              areaServed: site.regions.map((r) => r.name),
            }),
          }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="fixed top-3 left-3 z-[200] -translate-y-24 rounded-full bg-ink px-5 py-3 font-medium text-bg transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <Preloader />
        <SmoothScroll>
          <PageTransitionProvider>
            {/* The Signal — one persistent particle world behind every page */}
            <WorldLoader />
            <SceneDirector />
            <Header />
            <main id="main" tabIndex={-1} className="relative z-[2] min-h-svh outline-none">
              {children}
            </main>
            <Footer />
            <Cursor />
            <RevealObserver />
          </PageTransitionProvider>
        </SmoothScroll>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
