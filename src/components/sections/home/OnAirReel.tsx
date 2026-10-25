"use client";

import { useEffect, useRef } from "react";
import { media } from "@/config/media";
import { gsap } from "@/lib/gsap";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";
import { ChannelLabel, LiveBadge } from "@/components/ui/Badges";
import { Photo } from "@/components/ui/Photo";

/**
 * A reel of tall photo cards. Mouse: drag with momentum (cards skew with
 * speed). Touch: native swipe with snap.
 */
export function OnAirReel({ channel = "05" }: { channel?: string }) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const items = media.reel;

  useEffect(() => {
    const vp = viewport.current;
    const tr = track.current;
    if (!vp || !tr || !fine) return;
    let draggable: { kill: () => void } | null = null;
    let cancelled = false;

    (async () => {
      const [{ Draggable }, { InertiaPlugin }] = await Promise.all([import("gsap/Draggable"), import("gsap/InertiaPlugin")]);
      if (cancelled) return;
      gsap.registerPlugin(Draggable, InertiaPlugin);
      const cards = gsap.utils.toArray<HTMLElement>(".reel-card", tr);
      const skewTo = gsap.quickTo(cards, "skewX", { duration: 0.5, ease: "power3.out" });

      const update = function (this: { x: number; minX: number }) {
        const p = this.minX ? this.x / this.minX : 0;
        if (bar.current) bar.current.style.transform = `scaleX(${Math.max(0.06, Math.min(1, p))})`;
        if (!reduced) {
          const v = InertiaPlugin.getVelocity(tr, "x");
          skewTo(Math.max(-9, Math.min(9, v / -180)));
        }
      };

      draggable =
        Draggable.create(tr, {
        type: "x",
        bounds: vp,
        inertia: true,
        edgeResistance: 0.85,
        dragClickables: true,
        onDrag: update,
        onThrowUpdate: update,
        onThrowComplete: () => skewTo(0),
        onRelease: () => skewTo(0),
      })[0] ?? null;
    })();

    return () => {
      cancelled = true;
      draggable?.kill();
      gsap.set(tr, { clearProps: "transform" });
    };
  }, [fine, reduced]);

  return (
    <section data-scene="dust" data-scene-dim="0.3" className="relative overflow-hidden py-(--section-y)">
      <div className="container-site flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <ChannelLabel channel={channel} data-reveal>
            On air
          </ChannelLabel>
          <h2 className="mt-8 text-d1 uppercase" data-reveal style={{ ["--d" as string]: "0.05s" }}>
            Moments <span className="accent normal-case text-beam">on air.</span>
          </h2>
        </div>
        <div className="flex items-center gap-4 md:w-80" data-reveal style={{ ["--d" as string]: "0.1s" }}>
          <span className="eyebrow text-muted">{fine ? "Drag" : "Swipe"}</span>
          <div className="h-px flex-1 bg-line">
            <div ref={bar} className="h-px origin-left scale-x-[0.06] bg-[linear-gradient(90deg,var(--color-violet),var(--color-cyan))]" />
          </div>
          <span className="eyebrow text-muted">{String(items.length).padStart(2, "0")}</span>
        </div>
      </div>

      <div
        ref={viewport}
        data-cursor={fine ? "Drag" : undefined}
        className="no-scrollbar mt-12 overflow-x-auto overscroll-x-contain md:mt-16 [@media(pointer:fine)]:cursor-grab [@media(pointer:fine)]:overflow-visible"
      >
        <div ref={track} className="flex w-max snap-x snap-mandatory gap-3 px-(--gutter) md:gap-5">
          {items.map((it, i) => (
            <figure
              key={it.key}
              className="reel-card group relative aspect-[3/4] w-[72vw] shrink-0 snap-start overflow-hidden rounded-[1.4rem] bg-surface select-none sm:w-[44vw] md:rounded-[1.75rem] lg:w-[clamp(16rem,23vw,24rem)]"
              data-reveal="scale"
              style={{ ["--d" as string]: `${Math.min(i, 4) * 0.06}s` }}
            >
              <Photo
                k={it.key}
                sizes="(min-width: 1024px) 24vw, (min-width: 640px) 44vw, 72vw"
                className="pointer-events-none transition-transform duration-[1.4s] ease-(--ease-signal) group-hover:scale-[1.07]"
              />
              <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgb(7_6_13/0.85),transparent_50%)]" />
              {i % 3 === 0 && <LiveBadge className="absolute top-4 left-4 bg-bg/60 backdrop-blur">Live</LiveBadge>}
              <figcaption className="absolute inset-x-5 bottom-5">
                <span className="eyebrow text-white/70">0{i + 1}</span>
                <span className="mt-2 block translate-y-1 font-display text-[clamp(1.25rem,1rem+0.8vw,1.75rem)] leading-tight font-semibold uppercase transition-transform duration-700 ease-(--ease-signal) group-hover:translate-y-0">
                  {it.label}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
