"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { site } from "@/config/site";
import { media } from "@/config/media";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks";
import { Button } from "@/components/ui/Button";
import { LiveBadge } from "@/components/ui/Badges";
import { Photo } from "@/components/ui/Photo";
import { Meter } from "@/components/ui/Meter";
import { SplitChars } from "@/components/ui/SplitChars";
import { Timecode } from "@/components/motion/Timecode";

const FEEDS = media.heroFeeds;

/**
 * Hero = a live "program monitor". Feeds cut like a vision mixer while the
 * giant PARK / LIVE wordmark inverts over the picture. Scrolling opens the
 * monitor to full screen and pushes the words apart.
 */
export function Hero() {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [cut, setCut] = useState({ cur: 0, prev: -1, n: 0 });

  // Cut to the next camera every few seconds while the hero is visible
  useEffect(() => {
    const el = section.current;
    if (!el || reduced) return;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = !!e?.isIntersecting));
    io.observe(el);
    const t = window.setInterval(() => {
      if (!visible || document.hidden) return;
      setCut((c) => ({ cur: (c.cur + 1) % FEEDS.length, prev: c.cur, n: c.n + 1 }));
    }, 3600);
    return () => {
      window.clearInterval(t);
      io.disconnect();
    };
  }, [reduced]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: section.current, start: "top top", end: "bottom bottom", scrub: 0.9 },
        });
        tl.to(".hero-frame", { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.inOut", duration: 1 }, 0)
          .to(".hero-ui", { top: 0, right: 0, bottom: 0, left: 0, borderRadius: 0, ease: "power2.inOut", duration: 1 }, 0)
          .to(".hero-feeds", { scale: 1, ease: "power2.inOut", duration: 1 }, 0)
          .to(".hero-word-l", { xPercent: -120, opacity: 0, ease: "power2.in", duration: 0.75 }, 0)
          .to(".hero-word-r", { xPercent: 120, opacity: 0, ease: "power2.in", duration: 0.75 }, 0)
          .to(".hero-fade", { opacity: 0, y: 40, ease: "power1.in", duration: 0.3 }, 0)
          .to({}, { duration: 0.35 });
      });
    },
    { scope: section },
  );

  const feed = FEEDS[cut.cur] ?? FEEDS[0]!;

  return (
    <section ref={section} data-scene="rings" data-scene-dim="0.45" className="relative h-[240svh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* The program monitor */}
        <div className="hero-frame absolute inset-0 overflow-hidden bg-surface">
          <div className="hero-feeds absolute inset-0" style={{ transform: "scale(1.18)" }}>
            {FEEDS.map((f, i) => (
              <div
                key={f.key}
                className="feed-layer absolute inset-0"
                data-state={i === cut.cur ? "on" : i === cut.prev ? "prev" : undefined}
              >
                <Photo k={f.key} sizes="100vw" priority={i === 0} eager />
              </div>
            ))}
            <div
              key={cut.n}
              aria-hidden
              data-cut={cut.n > 0 ? "" : undefined}
              className="feed-glitch absolute inset-0 z-10 bg-[linear-gradient(90deg,rgb(79_227_255/0.5),rgb(255_61_110/0.45))] mix-blend-screen"
            />
          </div>
          <div aria-hidden className="scanlines absolute inset-0 z-10" />
          <div aria-hidden className="absolute inset-0 z-10 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_55%,rgb(7_6_13/0.55))]" />
        </div>

        {/* Monitor overlay UI — tracks the frame as it opens */}
        <div aria-hidden className="hero-ui pointer-events-none absolute z-20 rounded-[22px] ring-2 ring-live/70 md:rounded-[28px]">
          <div className="viewfinder absolute inset-3 md:inset-4" />
          <div className="absolute top-4 left-5 flex items-center gap-2.5 md:top-5 md:left-6">
            <span className="rounded-md bg-live px-2 py-1 font-mono text-[0.62rem] font-semibold tracking-wider text-white">PGM</span>
            <span className="eyebrow text-white/90">{feed.cam}</span>
          </div>
          <div className="absolute top-4 right-5 flex items-center gap-2 md:top-5 md:right-6">
            <span className="size-2 rounded-full bg-live animate-live-pulse" />
            <Timecode className="eyebrow text-white/90" />
          </div>
          <div className="absolute bottom-4 left-5 md:bottom-5 md:left-6">
            <span className="eyebrow rounded-md bg-bg/60 px-2 py-1 text-white/90 backdrop-blur">{feed.label}</span>
          </div>
          <Meter className="absolute right-5 bottom-4 md:right-6 md:bottom-5" />
        </div>

        {/* Giant wordmark — inverts over the picture */}
        <p
          aria-hidden
          className="hero-word-l pointer-events-none absolute top-[calc(var(--header-h)+2.4rem)] left-(--gutter) z-30 font-display text-[25vw] leading-[0.8] font-bold tracking-[-0.05em] text-white mix-blend-difference md:top-1/2 md:-translate-y-1/2 md:text-[15.5vw]"
        >
          <SplitChars text="PARK" />
        </p>
        <p
          aria-hidden
          className="hero-word-r pointer-events-none absolute top-[calc(68%+0.6rem)] right-(--gutter) z-30 font-display text-[25vw] leading-[0.8] font-bold tracking-[-0.05em] text-white mix-blend-difference md:top-1/2 md:-translate-y-1/2 md:text-[15.5vw]"
        >
          <SplitChars text="LIVE" offset={4} />
        </p>

        {/* HUD */}
        <div
          className="hero-fade fade-up absolute inset-x-(--gutter) top-[calc(var(--header-h)+0.6rem)] z-30 hidden items-center justify-between text-muted md:flex lg:top-24"
          style={{ ["--d" as string]: "0.5s" }}
        >
          <span className="flex items-center gap-3">
            <LiveBadge>Live</LiveBadge>
            <span className="eyebrow">PLN / CH.00 — Now broadcasting</span>
          </span>
          <span className="eyebrow flex items-center gap-2">
            <ArrowDown className="size-3.5 animate-bounce" aria-hidden /> Scroll to go live
          </span>
        </div>

        {/* Headline + calls to action */}
        <div className="hero-fade absolute inset-x-(--gutter) bottom-5 z-30 flex flex-col gap-4 md:bottom-7 md:flex-row md:items-end md:justify-between">
          <h1 className="fade-up max-w-[22ch] font-display text-[clamp(1.05rem,0.8rem+1.1vw,1.85rem)] leading-[1.15] font-medium" style={{ ["--d" as string]: "0.35s" }}>
            {site.hero.lines.join(" ")} <span className="accent text-beam">{site.hero.tail}</span>
          </h1>
          <div className="fade-up flex gap-3" style={{ ["--d" as string]: "0.5s" }}>
            <Button href="/careers" size="lg" magnetic cursor="Apply" className="max-sm:h-12 max-sm:flex-1 max-sm:justify-between">
              Join Our Team
            </Button>
            <Button href="/partnership" size="lg" variant="ghost" magnetic className="hidden sm:inline-flex">
              Become a Partner
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
