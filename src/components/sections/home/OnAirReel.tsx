"use client";

import { useRef } from "react";
import { media } from "@/config/media";
import { gsap, motionQuery, useGSAP } from "@/lib/gsap";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { ChannelLabel, LiveBadge } from "@/components/ui/Badges";
import { Photo } from "@/components/ui/Photo";

const ITEMS = media.reel;
const N = ITEMS.length;
const STEP = 360 / N;

/**
 * "Moments on air": photo cards on a 3D cylinder that turns as you scroll
 * (section pins). The card facing you lights up; the rest dim with angle.
 * Animations off: a plain swipeable row.
 */
export function OnAirReel({ channel = "05" }: { channel?: string }) {
  const section = useRef<HTMLElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(motionQuery(), () => {
        const cards = gsap.utils.toArray<HTMLElement>(".ring-card", ring.current);
        const state = { rot: 18, tilt: -14 };
        const paint = () => {
          if (ring.current) ring.current.style.transform = `rotateX(${state.tilt}deg) rotateY(${state.rot}deg)`;
          let best = 0;
          let bestCos = -2;
          cards.forEach((c, i) => {
            const a = ((i * STEP + state.rot) * Math.PI) / 180;
            const cos = Math.cos(a);
            if (cos > bestCos) {
              bestCos = cos;
              best = i;
            }
            c.style.setProperty("--lit", Math.max(0, cos).toFixed(3));
          });
          if (count.current) count.current.textContent = String(best + 1).padStart(2, "0");
        };
        paint();
        gsap.to(state, {
          rot: 18 - STEP * (N - 1) - 24,
          tilt: 6,
          ease: "none",
          onUpdate: paint,
          scrollTrigger: { trigger: section.current, start: "top top", end: "+=260%", pin: true, scrub: 1 },
        });
      });
    },
    { scope: section },
  );

  return (
    <>
      <section ref={section} data-scene="dust" data-scene-dim="0.35" className="relative h-svh min-h-[42rem] overflow-hidden motion-off:hidden">
        <div className="container-site relative z-20 flex items-start justify-between pt-[calc(var(--header-h)+1.5rem)] lg:pt-28">
          <div>
            <ChannelLabel channel={channel}>On air</ChannelLabel>
            <h2 className="mt-6 text-d2 uppercase">
              Moments <span className="accent normal-case text-beam">on air.</span>
            </h2>
          </div>
          <p className="eyebrow mt-1 text-muted">
            <span ref={count} className="text-ink">
              01
            </span>{" "}
            / {String(N).padStart(2, "0")}
          </p>
        </div>

        {/* giant outline word inside the cylinder */}
        <p
          aria-hidden
          className="text-outline pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 text-center font-display text-[24vw] leading-none font-bold tracking-[-0.05em] whitespace-nowrap"
        >
          ON AIR
        </p>

        <div className="ring-scene absolute inset-0 top-[8%] z-10 grid place-items-center">
          <div ref={ring} className="ring3d relative aspect-[3/4] w-(--cw)">
            {ITEMS.map((it, i) => (
              <figure
                key={it.key}
                className="ring-card absolute inset-0 overflow-hidden rounded-[1.25rem] bg-surface md:rounded-[1.6rem]"
                style={{ transform: `rotateY(${i * STEP}deg) translateZ(var(--r))` }}
              >
                <Photo k={it.key} sizes="(min-width: 768px) 20vw, 46vw" />
                <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgb(7_6_13/0.85),transparent_50%)]" />
                {i % 3 === 0 && <LiveBadge className="absolute top-3 left-3 bg-bg/60">Live</LiveBadge>}
                <figcaption className="absolute inset-x-4 bottom-4">
                  <span className="eyebrow text-white/70">0{i + 1}</span>
                  <span className="mt-1.5 block font-display text-[clamp(1rem,0.8rem+0.8vw,1.5rem)] leading-tight font-semibold uppercase">
                    {it.label}
                  </span>
                </figcaption>
                <div aria-hidden className="ring-shade pointer-events-none absolute inset-0 bg-bg" />
              </figure>
            ))}
          </div>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-1/4 bg-[linear-gradient(to_top,var(--color-bg),transparent)]" />
      </section>

      {/* Animations off: a swipeable row */}
      <section className="relative hidden py-(--section-y) motion-off:block">
        <div className="container-site">
          <ChannelLabel channel={channel}>On air</ChannelLabel>
          <RevealHeading title="Moments" accent="on air." className="mt-6 text-d1 uppercase" />
        </div>
        <div className="no-scrollbar mt-12 overflow-x-auto">
          <div className="flex w-max snap-x snap-mandatory gap-4 px-(--gutter)">
            {ITEMS.map((it, i) => (
              <figure key={it.key} className="relative aspect-[3/4] w-[70vw] shrink-0 snap-start overflow-hidden rounded-[1.4rem] sm:w-[40vw] lg:w-[22vw]">
                <Photo k={it.key} sizes="(min-width: 1024px) 22vw, 70vw" />
                <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgb(7_6_13/0.85),transparent_50%)]" />
                <figcaption className="absolute inset-x-5 bottom-5">
                  <span className="eyebrow text-white/70">0{i + 1}</span>
                  <span className="mt-2 block font-display text-xl font-semibold uppercase">{it.label}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
