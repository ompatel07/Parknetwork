"use client";

import { useRef, type ReactNode } from "react";
import { site } from "@/config/site";
import { media, type PhotoKey } from "@/config/media";
import { Photo } from "@/components/ui/Photo";
import { gsap, motionQuery, useGSAP } from "@/lib/gsap";
import { ChannelLabel } from "@/components/ui/Badges";
import { Counter } from "@/components/motion/Counter";

/* Real photos that sit inside the sentence like words, and widen on hover */
function PhotoPill({ k, live = false }: { k: PhotoKey; live?: boolean }) {
  return (
    <span
      aria-hidden
      data-liquid
      className="mf-w group/pill relative mx-[0.12em] inline-block h-[0.84em] w-[1.75em] -translate-y-[0.07em] overflow-hidden rounded-full align-middle ring-1 ring-white/15 transition-[width] duration-700 ease-(--ease-signal) hover:w-[2.7em]"
    >
      <Photo k={k} sizes="220px" className="transition-transform duration-700 ease-(--ease-signal) group-hover/pill:scale-110" />
      {live && (
        <span className="absolute top-[0.12em] left-[0.18em] flex items-center gap-[0.05em] rounded-full bg-live px-[0.12em] py-[0.02em] font-mono text-[0.16em] font-semibold text-white">
          ● LIVE
        </span>
      )}
    </span>
  );
}

type Part = string | ReactNode;

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const n = site.regions.length;
  const m = media.manifesto;

  const parts: Part[] = [
    "We put", <PhotoPill key="m" k={m.hosts} live />, "hosts on air, give", <PhotoPill key="a" k={m.agencies} />,
    "agencies a structure that works, and connect", <PhotoPill key="g" k={m.communities} />, "communities across",
    <span key="n" className="mf-w accent text-beam">{n} countries</span>,
    "— one signal at a time.",
  ];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(motionQuery(), () => {
        gsap.fromTo(
          ".mf-w",
          { opacity: 0.12 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.08,
            scrollTrigger: { trigger: ".mf-text", start: "top 78%", end: "bottom 50%", scrub: true },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <section data-scene="wave" data-scene-dim="0.85" className="relative py-(--section-y)">
      <div ref={ref} className="container-site relative">
        <ChannelLabel channel="01" data-reveal>
          Who we are
        </ChannelLabel>
        <p className="sr-only">
          We put hosts on air, give agencies a structure that works, and connect communities across {n} countries — one
          signal at a time.
        </p>
        <p
          aria-hidden
          className="mf-text mt-10 font-display text-[clamp(2.05rem,0.9rem+4.4vw,6rem)] leading-[1.04] font-medium tracking-[-0.025em] md:mt-14"
        >
          {parts.map((p, i) =>
            typeof p === "string" ? (
              <span key={i}>
                {p.split(" ").map((w, j) => (
                  <span key={j} className="mf-w">
                    {w}{" "}
                  </span>
                ))}
              </span>
            ) : (
              <span key={i}>{p} </span>
            ),
          )}
        </p>

        {site.stats.show && (
          <dl
            data-reveal
            className="mt-24 grid grid-cols-2 gap-px overflow-hidden rounded-panel border border-line bg-line md:mt-32 lg:grid-cols-4"
          >
            {site.stats.items.map((s, i) => (
              <div
                key={s.label}
                className="group relative flex flex-col-reverse gap-6 bg-bg/80 p-6 backdrop-blur-sm md:p-9"
              >
                <dt className="eyebrow flex items-center justify-between text-muted">
                  {s.label}
                  <span className="text-cyan/70">0{i + 1}</span>
                </dt>
                <dd className="font-display text-[clamp(2.6rem,1.4rem+4vw,6rem)] leading-none font-semibold tracking-[-0.03em]">
                  <Counter value={s.value} suffix="" />
                  <span className="accent text-beam">{s.suffix}</span>
                </dd>
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[linear-gradient(90deg,var(--color-violet),var(--color-cyan))] transition-transform duration-700 ease-(--ease-signal) group-hover:scale-x-100"
                />
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
