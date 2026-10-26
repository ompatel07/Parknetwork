import type { ReactNode } from "react";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { PageTransitionProvider } from "@/components/motion/PageTransition";
import { Cursor } from "@/components/motion/Cursor";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { ParallaxController } from "@/components/motion/ParallaxController";
import { WorldLoader } from "@/components/world/WorldLoader";
import { SceneDirector } from "@/components/world/SceneDirector";
import { Preloader } from "@/components/motion/Preloader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { MotionNotice } from "@/components/motion/MotionControls";

/** The public website: header, footer, particle world, cursor and page transitions. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
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
          <ParallaxController />
          <MotionNotice />
          <WhatsAppFloat />
        </PageTransitionProvider>
      </SmoothScroll>
    </>
  );
}
