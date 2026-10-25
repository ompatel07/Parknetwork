"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { site } from "@/config/site";
import { media, type PhotoKey } from "@/config/media";
import { gsap, motionQuery, useGSAP } from "@/lib/gsap";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { Meter } from "@/components/ui/Meter";
import { SplitChars } from "@/components/ui/SplitChars";
import { Timecode } from "@/components/motion/Timecode";
import { cn } from "@/lib/cn";

const FEEDS = media.heroFeeds;

/** 5 × 3 wall of camera feeds; null = the program monitor's slot (centre). Phones show the middle 3 columns. */
const WALL: (PhotoKey | null)[][] = [
  ["mixer-dark", "on-air", "neon-face", "ringlight-phone", "team-table"],
  ["concert-phone", "mic-pink", null, "headphones-night", "on-air-side"],
  ["phone-stand", "crowd-lights", "ringlight-man", "mixer-colour", "india-phone"],
];
const REC = new Set(["on-air", "headphones-night", "crowd-lights"]);

/**
 * Hero: a wall of live camera feeds with the program monitor in the middle.
 * Scrolling zooms into the monitor (it opens to full screen) while the wall
 * flies outward and the headline splits apart. The monitor cuts between
 * cameras like a vision mixer.
 */
export function Hero() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const probe = useRef<HTMLDivElement>(null);
  const wall = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const [cut, setCut] = useState({ cur: 0, prev: -1 });

  // Cut to the next camera while the hero is on screen
  useEffect(() => {
    const el = section.current;
    if (!el || reduced) return;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = !!e?.isIntersecting));
    io.observe(el);
    const t = window.setInterval(() => {
      if (visible && !document.hidden) setCut((c) => ({ cur: (c.cur + 1) % FEEDS.length, prev: c.cur }));
    }, 3400);
    return () => {
      window.clearInterval(t);
      io.disconnect();
    };
  }, [reduced]);

  // Mouse parallax: the wall drifts against the pointer for depth
  useEffect(() => {
    const w = wall.current;
    if (!w || reduced || !fine) return;
    const xTo = gsap.quickTo(w, "x", { duration: 1.2, ease: "power3.out" });
    const yTo = gsap.quickTo(w, "y", { duration: 1.2, ease: "power3.out" });
    const onMove = (e: PointerEvent) => {
      xTo((0.5 - e.clientX / window.innerWidth) * window.innerWidth * 0.025);
      yTo((0.5 - e.clientY / window.innerHeight) * window.innerHeight * 0.03);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, fine]);

  // Scroll: zoom into the program monitor
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(motionQuery(), () => {
        const box = () => {
          const s = stage.current;
          const p = probe.current;
          const W = s?.clientWidth ?? window.innerWidth;
          const H = s?.clientHeight ?? window.innerHeight;
          const tw = p?.offsetWidth ?? W * 0.26;
          const th = p?.offsetHeight ?? H * 0.26;
          return { x: (W - tw) / 2, y: (H - th) / 2, k: Math.max(W / tw, H / th) };
        };
        const rad = () => (window.innerWidth < 768 ? 16 : 22);

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: section.current, start: "top top", end: "bottom bottom", scrub: 0.8, invalidateOnRefresh: true },
          })
          .fromTo(
            ".hero-monitor",
            { clipPath: () => `inset(${box().y}px ${box().x}px ${box().y}px ${box().x}px round ${rad()}px)` },
            { clipPath: "inset(0px 0px 0px 0px round 0px)", ease: "power2.inOut", duration: 1 },
            0,
          )
          .fromTo(
            ".hero-ui",
            { top: () => box().y, bottom: () => box().y, left: () => box().x, right: () => box().x },
            { top: 0, bottom: 0, left: 0, right: 0, ease: "power2.inOut", duration: 1 },
            0,
          )
          .fromTo(".hero-feeds", { scale: 1.25 }, { scale: 1, ease: "power2.inOut", duration: 1 }, 0)
          .fromTo(".hero-wall-scale", { scale: 1 }, { scale: () => box().k, ease: "power2.inOut", duration: 1 }, 0)
          .to(".hero-wall-scale", { opacity: 0, duration: 0.45 }, 0.45)
          .to(".hero-l1", { yPercent: -160, opacity: 0, ease: "power2.in", duration: 0.5 }, 0)
          .to(".hero-l2", { yPercent: 140, opacity: 0, ease: "power2.in", duration: 0.5 }, 0)
          .to(".hero-bar", { opacity: 0, y: 40, duration: 0.25 }, 0)
          .fromTo(".hero-onair", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.2, ease: "power2.out" }, 0.82)
          .to({}, { duration: 0.3 });
      });
    },
    { scope: section },
  );

  const feed = FEEDS[cut.cur] ?? FEEDS[0]!;
  const [l1 = "", l2 = ""] = site.hero.lines;

  return (
    <section
      ref={section}
      data-scene="dust"
      data-scene-dim="0.25"
      className="hero relative h-[290svh] motion-off:h-svh motion-off:min-h-[40rem]"
    >
      <h1 className="sr-only">{site.tagline}</h1>
      <div ref={stage} className="sticky top-0 h-svh overflow-hidden bg-bg motion-off:relative motion-off:h-full">
        <div ref={probe} aria-hidden className="pointer-events-none invisible absolute h-(--th) w-(--tw)" />

        {/* The wall of feeds */}
        <div aria-hidden className="hero-wall-scale absolute inset-0 origin-center">
          <div ref={wall} className="absolute inset-0">
            <div className="hero-wall absolute top-1/2 left-1/2 grid -translate-1/2 grid-cols-[repeat(3,var(--tw))] grid-rows-[repeat(3,var(--th))] gap-(--tg) md:grid-cols-[repeat(5,var(--tw))]">
              {WALL.flatMap((row, r) =>
                row.map((k, c) =>
                  k === null ? (
                    <div key={`${r}-${c}`} />
                  ) : (
                    <div
                      key={k}
                      className={cn(
                        "hero-tile group relative overflow-hidden rounded-[14px] bg-surface md:rounded-[18px]",
                        (c === 0 || c === 4) && "max-md:hidden",
                      )}
                      style={{ ["--d" as string]: `${(Math.abs(r - 1) + Math.abs(c - 2)) * 0.09}s` }}
                    >
                      <Photo k={k} sizes="(min-width: 768px) 26vw, 56vw" className="hero-tile-img" />
                      <span className="eyebrow absolute top-2.5 left-3 text-[0.6rem] text-white/60 md:top-3.5 md:left-4">
                        CAM {String(r * 5 + c + 1).padStart(2, "0")}
                      </span>
                      {REC.has(k) && (
                        <span className="absolute top-3 right-3 flex items-center gap-1.5 md:top-3.5 md:right-4">
                          <span className="size-1.5 rounded-full bg-live animate-live-pulse" />
                          <span className="eyebrow text-[0.6rem] text-white/70">REC</span>
                        </span>
                      )}
                    </div>
                  ),
                ),
              )}
            </div>
          </div>
        </div>
        {/* legibility: darken the wall toward the edges and under the header */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_50%,transparent_30%,rgb(7_6_13/0.75)_100%)]" />
        <div aria-hidden className="hero-bar pointer-events-none absolute inset-x-0 top-0 h-36 bg-[linear-gradient(to_bottom,var(--color-bg)_10%,rgb(7_6_13/0.6)_50%,transparent)]" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_top,var(--color-bg),transparent)]" />

        {/* The program monitor (full-screen layer, clipped to the centre slot) */}
        <div className="hero-monitor absolute inset-0 z-10 overflow-hidden bg-surface">
          <div className="hero-monitor-in absolute inset-0">
            <div className="hero-feeds absolute inset-0">
              {FEEDS.map((f, i) => (
                <div
                  key={f.key}
                  className="feed-layer absolute inset-0"
                  data-state={i === cut.cur ? "on" : i === cut.prev ? "prev" : undefined}
                >
                  <Photo k={f.key} sizes="100vw" priority={i === 0} eager />
                </div>
              ))}
            </div>
          </div>
          <div aria-hidden className="scanlines absolute inset-0" />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgb(7_6_13/0.55),transparent_35%)]" />
          <div aria-hidden className="hero-onair pointer-events-none absolute inset-0 grid place-items-center opacity-0">
            <span className="neon rounded-xl border-2 px-6 py-3 font-display text-[clamp(1.4rem,1rem+2vw,3rem)] font-bold tracking-[0.18em]" data-on="">
              ON AIR
            </span>
          </div>
        </div>

        {/* Monitor HUD — tracks the monitor as it opens */}
        <div aria-hidden className="hero-ui pointer-events-none absolute z-20 rounded-[16px] ring-2 ring-live/80 md:rounded-[22px]">
          <div className="viewfinder absolute inset-2.5 md:inset-3.5" />
          <div className="absolute top-3 left-3.5 flex items-center gap-2 md:top-4 md:left-5">
            <span className="rounded-md bg-live px-1.5 py-0.5 font-mono text-[0.58rem] font-semibold tracking-wider text-white md:px-2 md:py-1 md:text-[0.62rem]">
              PGM
            </span>
            <span className="eyebrow text-[0.62rem] text-white/90">{feed.cam}</span>
          </div>
          <div className="absolute top-3 right-3.5 hidden items-center gap-2 sm:flex md:top-4 md:right-5">
            <span className="size-1.5 rounded-full bg-live animate-live-pulse" />
            <Timecode className="eyebrow text-[0.62rem] text-white/90" />
          </div>
          <span className="eyebrow absolute bottom-3 left-3.5 rounded-md bg-bg/60 px-2 py-1 text-[0.6rem] text-white/90 backdrop-blur md:bottom-4 md:left-5">
            {feed.label}
          </span>
          <Meter bars={5} className="absolute right-3.5 bottom-3 h-5 md:right-5 md:bottom-4" />
        </div>

        {/* Headline — splits apart as you zoom in */}
        <p
          aria-hidden
          className="hero-l1 pointer-events-none absolute inset-x-0 bottom-[calc(50%+var(--th)/2+var(--tg))] z-30 text-center font-display text-[min(12.4vw,15svh)] leading-[0.8] font-semibold tracking-[-0.045em] uppercase [text-shadow:0_10px_60px_rgb(7_6_13/0.9)] md:text-[min(10.6vw,15svh)]"
        >
          <SplitChars text={l1} />
        </p>
        <p
          aria-hidden
          className="hero-l2 pointer-events-none absolute inset-x-0 top-[calc(50%+var(--th)/2+var(--tg)*0.2)] z-30 text-center"
        >
          <span className="accent text-[min(14vw,16svh)] leading-[0.95] [text-shadow:0_10px_60px_rgb(7_6_13/0.9)] md:text-[min(11.4vw,16.5svh)]">
            <SplitChars text={l2} offset={l1.length} className="text-beam" />
          </span>
        </p>

        {/* Bottom bar */}
        <div className="hero-bar absolute inset-x-(--gutter) bottom-4 z-30 flex items-end justify-between gap-6 md:bottom-6">
          <div className="fade-up hidden max-w-sm lg:block" style={{ ["--d" as string]: "0.5s" }}>
            <p className="text-sm text-ink/80">{site.hero.tail.replace(/^./, (m) => m.toUpperCase())}</p>
            <p className="eyebrow mt-3 flex items-center gap-2 text-muted motion-off:hidden">
              <ArrowDown className="size-3.5 animate-bounce" aria-hidden /> Scroll to zoom in
            </p>
          </div>
          <div className="fade-up flex w-full gap-3 lg:w-auto" style={{ ["--d" as string]: "0.6s" }}>
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
