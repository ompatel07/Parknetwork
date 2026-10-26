"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/config/site";
import { media } from "@/config/media";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { ChannelLabel } from "@/components/ui/Badges";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { Meter } from "@/components/ui/Meter";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { Timecode } from "@/components/motion/Timecode";
import { cn } from "@/lib/cn";

/**
 * Services as a broadcast multiview wall. One feed is LIVE at a time
 * (red tally, full colour); the others sit in preview. Mouse: hover takes
 * control. Touch: the feed in the middle of the screen goes live.
 */
export function Multiview() {
  const services = site.services;
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const [auto, setAuto] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const wall = useRef<HTMLDivElement>(null);
  const active = hover ?? auto;

  // Desktop: cycle the live feed when nobody is hovering
  useEffect(() => {
    if (!fine || reduced || hover !== null) return;
    const t = window.setInterval(() => setAuto((a) => (a + 1) % services.length), 2800);
    return () => window.clearInterval(t);
  }, [fine, reduced, hover, services.length]);

  // Touch: whichever tile crosses the middle of the screen goes live
  useEffect(() => {
    if (fine || !wall.current) return;
    const tiles = Array.from(wall.current.querySelectorAll<HTMLElement>("[data-tile]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setAuto(Number((e.target as HTMLElement).dataset.tile));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    tiles.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [fine]);

  return (
    <section data-scene="rings" data-scene-dim="0.35" className="relative py-(--section-y)">
      <div className="container-site">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <ChannelLabel channel="02" data-reveal>
              Multiview
            </ChannelLabel>
            <RevealHeading title="Five channels." accent="One network." breakAccent delay={0.05} className="mt-8 text-d1 uppercase" />
          </div>
          <div className="lg:col-span-4 lg:col-start-9" data-reveal style={{ ["--d" as string]: "0.1s" }}>
            <p className="text-lead text-muted">
              Live streaming management, audio chat room management, agency and host recruitment — the networks and growth
              strategies digital entertainment platforms need.
            </p>
            <div className="mt-6">
              <Button href="/services" variant="link">
                Full programme
              </Button>
            </div>
          </div>
        </div>

        {/* The monitor wall */}
        <div
          ref={wall}
          className="mt-14 rounded-[1.6rem] border border-line-strong bg-[#050409] p-2 shadow-[0_40px_120px_-40px_rgb(124_92_255/0.45)] md:mt-20 md:rounded-[2rem] md:p-3"
          data-reveal="scale"
          data-world-rest
          onPointerLeave={() => setHover(null)}
        >
          <div className="flex items-center justify-between px-3 pt-2 pb-3 md:px-4">
            <span className="eyebrow flex items-center gap-2 text-muted">
              <span className="size-1.5 rounded-full bg-[#3ddc84]" /> Multiview · {services.length} sources
            </span>
            <span className="eyebrow flex items-center gap-3 text-muted">
              <span className="hidden sm:inline">
                PGM <span className="text-live">CH.{String(active + 1).padStart(2, "0")}</span>
              </span>
              <Timecode className="text-ink/80" />
            </span>
          </div>
          <ul className="grid gap-2 md:grid-cols-2 md:gap-2.5 lg:grid-cols-6">
            {services.map((s, i) => {
              const live = i === active;
              return (
                <li key={s.slug} className={cn(i < 2 ? "lg:col-span-3" : "lg:col-span-2", i === 4 && "md:col-span-2 lg:col-span-2")}>
                  <TransitionLink
                    href={`/services#${s.slug}`}
                    data-tile={i}
                    data-live={live || undefined}
                    data-cursor={fine ? "Watch" : undefined}
                    onPointerEnter={() => fine && setHover(i)}
                    onFocus={() => setHover(i)}
                    onBlur={() => setHover(null)}
                    className={cn("group relative block overflow-hidden rounded-[1.1rem] bg-surface md:rounded-[1.25rem]", i < 2 ? "aspect-[16/10] lg:aspect-[16/9]" : i === 4 ? "aspect-[16/10] md:aspect-[16/7] lg:aspect-[4/3.1]" : "aspect-[16/10] lg:aspect-[4/3.1]")}
                  >
                    <div className="absolute inset-0">
                      <Photo k={media.services[s.slug as keyof typeof media.services]} sizes={i < 2 ? "(min-width: 1024px) 47vw, (min-width: 768px) 48vw, 94vw" : "(min-width: 1024px) 31vw, (min-width: 768px) 48vw, 94vw"} />
                    </div>
                    {/* preview feeds sit dimmed; the live one lights up */}
                    <div aria-hidden className="tile-dim absolute inset-0" />
                    {/* scanlines + bottom shade in one layer (fewer layers = smoother) */}
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-[linear-gradient(to_top,rgb(5_4_9/0.92),rgb(5_4_9/0.15)_55%,rgb(5_4_9/0.35)),repeating-linear-gradient(to_bottom,rgb(0_0_0/0.16)_0_1px,transparent_1px_3px)]"
                    />
                    <div aria-hidden className="tile-ring pointer-events-none absolute inset-0 rounded-[inherit]" />

                    <div className="absolute top-3.5 left-4 flex items-center gap-2 md:top-4 md:left-5">
                      <span className="tally size-2 rounded-full transition-colors duration-300" />
                      <span className="eyebrow text-white/85">CH.{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <span
                      className={cn(
                        "absolute top-3 right-4 rounded-md px-2 py-1 font-mono text-[0.62rem] font-semibold tracking-wider transition-colors duration-300 md:top-3.5 md:right-5",
                        live ? "bg-live-deep text-white" : "bg-white/10 text-white/70",
                      )}
                    >
                      {live ? "LIVE" : "PVW"}
                    </span>
                    {live && <Meter bars={5} className="absolute top-1/2 right-4 -translate-y-1/2 md:right-5" />}

                    <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 md:inset-x-5 md:bottom-5">
                      {/* The two-line summary always takes its space (h-10 + mt-2 =
                          3rem); preview tiles slide the block down by exactly that,
                          so switching only moves/fades — no layout animation. */}
                      <div
                        className={cn(
                          "min-w-0 transition-transform duration-500 ease-(--ease-signal)",
                          live ? "translate-y-0" : "translate-y-12",
                        )}
                      >
                        <h3 className="font-display text-[clamp(1.3rem,1rem+1.1vw,2.1rem)] leading-[0.95] font-semibold tracking-[-0.02em] uppercase">
                          {s.title}
                        </h3>
                        <p
                          className={cn(
                            "mt-2 line-clamp-2 h-10 max-w-xs text-sm leading-5 text-white/75 transition-opacity duration-500",
                            live ? "opacity-100" : "opacity-0",
                          )}
                        >
                          {s.short}
                        </p>
                      </div>
                      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/25 bg-bg/40 transition-[rotate,transform,background-color,border-color,color] duration-500 ease-(--ease-signal) group-hover:rotate-45 group-hover:border-transparent group-hover:bg-white group-hover:text-bg">
                        <ArrowUpRight className="size-[18px]" aria-hidden />
                      </span>
                    </div>
                  </TransitionLink>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
