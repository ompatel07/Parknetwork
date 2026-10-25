"use client";

import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { site } from "@/config/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { Button } from "@/components/ui/Button";
import { LiveBadge } from "@/components/ui/Badges";
import { SplitChars } from "@/components/ui/SplitChars";
import { SplitWords } from "@/components/ui/SplitWords";
import { Timecode } from "@/components/motion/Timecode";

const hq = site.regions[0];
const coord = hq
  ? `${Math.abs(hq.lat).toFixed(1)}°${hq.lat >= 0 ? "N" : "S"} · ${Math.abs(hq.lng).toFixed(1)}°${hq.lng >= 0 ? "E" : "W"}`
  : "";

/**
 * Editorial hero: giant grotesk + serif italic headline over the particle
 * logo (rendered by the SignalWorld behind the page), framed by a broadcast HUD.
 */
export function Hero() {
  const section = useRef<HTMLElement>(null);
  const [l1 = "", l2 = ""] = site.hero.lines;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: section.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to(".hero-l1", { xPercent: -12, ease: "none", scrollTrigger: st });
        gsap.to(".hero-l2", { xPercent: 10, ease: "none", scrollTrigger: st });
        gsap.to(".hero-fade", { opacity: 0, y: -60, ease: "none", scrollTrigger: { ...st, end: "55% top" } });
        gsap.to(".hero-hud", { opacity: 0, ease: "none", scrollTrigger: { ...st, end: "35% top" } });
      });
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      data-scene="mark"
      data-scene-align="right"
      className="hero relative h-svh min-h-[42rem] overflow-hidden lg:min-h-[48rem]"
    >
      {/* soft vignette so type stays legible over the particles */}
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_80%_at_30%_100%,rgb(7_6_13/0.85),transparent_60%)]" />

      {/* Broadcast HUD */}
      <div aria-hidden className="hero-hud pointer-events-none absolute inset-0">
        <div
          className="fade-up absolute inset-x-(--gutter) top-[calc(var(--header-h)+0.75rem)] flex items-center justify-between text-muted lg:top-28"
          style={{ ["--d" as string]: "0.5s" }}
        >
          <span className="flex items-center gap-3">
            <LiveBadge>Live</LiveBadge>
            <span className="eyebrow hidden sm:inline">PLN / CH.00 — Now broadcasting</span>
          </span>
          <span className="eyebrow flex items-center gap-5">
            <span className="hidden md:inline">1080p · 25fps</span>
            <Timecode className="text-ink/80" />
          </span>
        </div>
        <div
          className="fade-up absolute inset-x-(--gutter) bottom-5 hidden items-center justify-between text-muted md:flex"
          style={{ ["--d" as string]: "0.7s" }}
        >
          <span className="eyebrow flex items-center gap-2">
            <ArrowDown className="size-3.5 animate-bounce" /> Scroll to tune in
          </span>
          <span className="eyebrow hidden lg:inline">{coord}</span>
          <span className="eyebrow">© {new Date().getFullYear()} {site.shortName}</span>
        </div>
      </div>

      <div className="container-site relative flex h-full flex-col justify-end pb-[clamp(5rem,12vh,8.5rem)]">
        <h1 aria-label={site.tagline}>
          <span aria-hidden className="hero-l1 block font-display text-[13.2vw] leading-[0.8] font-semibold tracking-[-0.045em] uppercase lg:text-[12.6vw] 2xl:text-[11.5rem]">
            <SplitChars text={l1} />
          </span>
          <span aria-hidden className="hero-l2 mt-1 block text-right lg:-mt-[1vw]">
            <span className="accent text-[15vw] leading-[0.92] lg:text-[11.4vw] 2xl:text-[10.5rem]">
              <SplitChars text={l2} offset={l1.length} className="text-beam" />
            </span>
          </span>
        </h1>

        <div className="hero-fade mt-8 grid gap-8 md:mt-10 lg:-mt-[7.5vw] lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-display text-h4 font-medium">
              <SplitWords text={site.hero.tail} offset={14} />
            </p>
            <p className="fade-up mt-4 max-w-md text-muted" style={{ ["--d" as string]: "0.45s" }}>
              {site.hero.intro}
            </p>
            <div className="fade-up mt-8 flex flex-col gap-3 sm:flex-row" style={{ ["--d" as string]: "0.6s" }}>
              <Button href="/careers" size="lg" magnetic cursor="Apply" className="justify-between sm:justify-center">
                Join Our Team
              </Button>
              <Button href="/partnership" size="lg" variant="ghost" magnetic className="justify-between sm:justify-center">
                Become a Partner
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
