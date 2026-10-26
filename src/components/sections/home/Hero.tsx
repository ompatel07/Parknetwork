"use client";

import { useEffect, useRef } from "react";
import { site } from "@/config/site";
import { gsap, motionQuery, useGSAP } from "@/lib/gsap";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";
import { Button } from "@/components/ui/Button";
import { LiveBadge } from "@/components/ui/Badges";
import { SplitChars } from "@/components/ui/SplitChars";
import { SplitWords } from "@/components/ui/SplitWords";
import { Timecode } from "@/components/motion/Timecode";
import { LivePhone } from "./LivePhone";
import { AudioRoomCard, MatchCard, ShortVideoCard } from "./HeroCards";

const TICKER = [
  ...site.stats.items.filter((s) => !s.text).map((s) => `${s.value.toLocaleString("en-IN")}${s.suffix} ${s.label}`),
  ...site.hero.categories,
];

/**
 * Hero — a magazine cover for a live network: the giant PARK LIVE
 * masthead, a 3D phone running a live stream in front of it, floating
 * app cards (audio room, dating match, short video) and a broadcast
 * lower-third ticker. Mouse tilts the phone; scrolling lifts it away.
 */
export function Hero() {
  const section = useRef<HTMLElement>(null);
  const device = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();

  // Mouse: tilt the phone, drift the cards by depth
  useEffect(() => {
    const el = section.current;
    const d = device.current;
    if (!el || !d || reduced || !fine) return;
    const rx = gsap.quickTo(d, "rotationX", { duration: 1, ease: "power3.out" });
    const ry = gsap.quickTo(d, "rotationY", { duration: 1, ease: "power3.out" });
    const layers = gsap.utils.toArray<HTMLElement>("[data-depth]", el).map((n) => ({
      depth: Number(n.dataset.depth),
      x: gsap.quickTo(n, "x", { duration: 1.2, ease: "power3.out" }),
      y: gsap.quickTo(n, "y", { duration: 1.2, ease: "power3.out" }),
    }));
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      ry(nx * 16);
      rx(-ny * 10);
      layers.forEach((l) => {
        l.x(nx * 40 * l.depth);
        l.y(ny * 30 * l.depth);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, fine]);

  // Scroll: lift the phone away, fan the cards out
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(motionQuery(), () => {
        const st = { trigger: section.current, start: "top top", end: "bottom top", scrub: 0.6 };
        gsap.to(".hero-stage", { yPercent: -10, scale: 0.94, ease: "none", scrollTrigger: st });
        gsap.to(".hero-mast", { yPercent: 30, opacity: 0.15, ease: "none", scrollTrigger: st });
        gsap.to(".hero-card-r", { xPercent: 40, opacity: 0, ease: "none", scrollTrigger: { ...st, end: "70% top" } });
        gsap.to(".hero-card-l", {
          xPercent: () => (window.innerWidth >= 1024 ? 40 : -40),
          opacity: 0,
          ease: "none",
          scrollTrigger: { ...st, end: "70% top", invalidateOnRefresh: true },
        });
        gsap.to(".hero-copy", { y: -60, opacity: 0, ease: "none", scrollTrigger: { ...st, end: "60% top" } });
      });
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      data-scene="rings"
      data-scene-align="center"
      data-scene-dim="0.5"
      className="hero2 relative isolate overflow-hidden lg:h-svh lg:min-h-[620px]"
    >
      {/* glow behind the phone */}
      <div aria-hidden className="pointer-events-none absolute top-[38%] left-1/2 -z-10 size-[min(90vw,62rem)] -translate-1/2 rounded-full bg-[radial-gradient(circle,rgb(124_92_255/0.35),rgb(61_139_255/0.12)_45%,transparent_70%)] lg:top-[58%]" />

      {/* HUD */}
      <div
        className="fade-up container-site relative z-30 flex items-center justify-between pt-[calc(var(--header-h)+0.6rem)] text-muted lg:pt-24"
        style={{ ["--d" as string]: "0.3s" }}
      >
        <span className="flex items-center gap-3">
          <LiveBadge>Live</LiveBadge>
          <span className="eyebrow">{site.hero.eyebrow}</span>
        </span>
        <Timecode className="eyebrow hidden text-ink/70 sm:inline" />
      </div>

      {/* Stage: masthead + phone + cards */}
      <div className="hero-stage-box relative h-[calc(var(--ph)*0.94+18vw)] lg:absolute lg:inset-0 lg:h-auto">
        <p
          aria-hidden
          className="hero-mast pointer-events-none absolute inset-x-0 top-[2vw] text-center font-display text-[17.5vw] leading-[0.8] font-bold tracking-[-0.05em] whitespace-nowrap lg:top-[calc(var(--header-h)+3.4rem)] lg:text-[min(19.5vw,30svh)]"
        >
          <span className="mast-fill">
            <SplitChars text="PARK LIVE" />
          </span>
        </p>

        <div className="hero-stage absolute bottom-0 left-1/2 h-(--ph) w-(--pw) -translate-x-1/2 [perspective:1400px] lg:bottom-[calc(3rem-3svh)]">
          <div className="phone-anchor relative size-full [container-type:inline-size]">
            {/* phone */}
            <div className="hero-phone-in size-full">
              {/* tilts in 3D via the stage's perspective; no preserve-3d — it
                  would keep every animation inside the phone off the GPU */}
              <div ref={device} className="size-full">
                <LivePhone />
              </div>
            </div>

            {/* cards (positions in % of the phone) */}
            <div data-depth="1.4" className="hero-card-r pointer-events-none absolute top-[12.5%] left-[66%] z-10 lg:left-[80%]">
              <div className="hero-card-in" style={{ ["--d" as string]: "0.25s" }}><div className="float-y" style={{ ["--b" as string]: "5.5s" }}>
                <MatchCard />
              </div></div>
            </div>
            <div data-depth="0.9" className="hero-card-r pointer-events-none absolute top-[36%] left-[96%] z-10 hidden lg:block">
              <div className="hero-card-in" style={{ ["--d" as string]: "0.4s" }}><div className="float-y" style={{ ["--b" as string]: "6.5s" }}>
                <ShortVideoCard />
              </div></div>
            </div>
            <div
              data-depth="1.2"
              className="hero-card-l pointer-events-none absolute top-[58%] right-[57%] z-10 lg:top-[23%] lg:right-auto lg:left-[150%]"
            >
              <div className="hero-card-in" style={{ ["--d" as string]: "0.55s" }}><div className="float-y" style={{ ["--b" as string]: "6s" }}>
                <AudioRoomCard />
              </div></div>
            </div>
          </div>
        </div>
      </div>

      {/* Copy + calls to action */}
      <div className="hero-copy container-site relative z-30 pt-8 pb-10 lg:absolute lg:bottom-[calc(3.5rem+5svh)] lg:left-0 lg:w-auto lg:max-w-[calc(50vw-var(--pw)/2-1.5rem)] lg:pt-0 lg:pb-0">
        <h1 className="font-display text-[clamp(2rem,0.9rem+2vw,3.3rem)] leading-[1.02] font-semibold tracking-[-0.03em]">
          <SplitWords text={site.hero.title} offset={4} />{" "}
          <span className="accent text-[1.08em]">
            <SplitWords text={site.hero.accent} offset={8} className="text-beam" />
          </span>
        </h1>
        <p className="fade-up mt-5 max-w-md text-muted" style={{ ["--d" as string]: "0.5s" }}>
          {site.hero.intro}
        </p>
        <div className="fade-up mt-7 flex flex-col gap-3 sm:flex-row" style={{ ["--d" as string]: "0.65s" }}>
          <Button href="/services" size="lg" magnetic className="justify-between sm:justify-center">
            Explore Our Services
          </Button>
          <Button href="/partnership" size="lg" variant="ghost" magnetic className="justify-between sm:justify-center">
            Partner With Us
          </Button>
        </div>
      </div>

      {/* Broadcast lower-third ticker */}
      <div className="fade-up relative z-30 flex h-12 items-stretch border-y border-line bg-bg/95 lg:absolute lg:inset-x-0 lg:bottom-0 lg:border-b-0" style={{ ["--d" as string]: "0.8s" }}>
        <span className="flex shrink-0 items-center gap-2 bg-live-deep px-4 font-mono text-xs font-semibold tracking-wider text-white">
          <span className="size-1.5 rounded-full bg-white animate-live-pulse" /> ON AIR
        </span>
        <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
          <div className="flex h-full w-max animate-marquee items-center" style={{ ["--marquee-duration" as string]: "38s" }}>
            {[0, 1].map((k) => (
              <ul key={k} aria-hidden={k === 1 || undefined} className="flex items-center">
                {TICKER.map((t) => (
                  <li key={t} className="flex items-center font-mono text-xs tracking-[0.12em] text-ink/80 uppercase">
                    <span className="px-6">{t}</span>
                    <span className="text-cyan">✶</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
