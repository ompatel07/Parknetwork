"use client";

import { useRef, type ReactNode } from "react";
import { site } from "@/config/site";
import { media, type PhotoKey } from "@/config/media";
import { Photo } from "@/components/ui/Photo";
import { gsap, motionQuery, useGSAP } from "@/lib/gsap";
import { ChannelLabel } from "@/components/ui/Badges";
import { Button } from "@/components/ui/Button";
import { GlanceStats } from "@/components/sections/shared/GlanceStats";

/* Real photos that sit inside the sentence like words, and widen on hover */
function PhotoPill({ k, live = false }: { k: PhotoKey; live?: boolean }) {
  return (
    <span
      aria-hidden
      className="mf-w group/pill relative mx-[0.12em] inline-block h-[0.84em] w-[1.75em] -translate-y-[0.07em] overflow-hidden rounded-full align-middle ring-1 ring-white/15 transition-[width] duration-700 ease-(--ease-signal) hover:w-[2.7em]"
    >
      <Photo k={k} sizes="220px" className="transition-transform duration-700 ease-(--ease-signal) group-hover/pill:scale-110" />
      {live && (
        <span className="absolute top-[0.12em] left-[0.18em] flex items-center gap-[0.05em] rounded-full bg-live-deep px-[0.12em] py-[0.02em] font-mono text-[0.16em] font-semibold text-white">
          ● LIVE
        </span>
      )}
    </span>
  );
}

type Part = string | ReactNode;

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const m = media.manifesto;

  const parts: Part[] = [
    "We manage", <PhotoPill key="a" k={m.apps} live />,
    <span key="n1" className="mf-w accent text-beam">70+ apps</span>,
    "across live streaming, audio chat, dating and short video — connecting", <PhotoPill key="u" k={m.users} />,
    <span key="n2" className="mf-w accent text-beam">500,000+ users</span>,
    "with a", <PhotoPill key="t" k={m.team} />, "network of 5,000 professionals worldwide.",
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
          We manage 70+ apps across live streaming, audio chat, dating and short video — connecting 500,000+ users with a
          network of 5,000 professionals worldwide.
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

        <div className="mt-12 grid gap-8 md:mt-16 lg:grid-cols-12">
          <p className="max-w-xl text-lead text-muted lg:col-span-6" data-reveal>
            {site.about.paragraphs[1]}
          </p>
          <div className="flex flex-wrap items-start gap-6 lg:col-span-5 lg:col-start-8 lg:justify-end" data-reveal style={{ ["--d" as string]: "0.1s" }}>
            <Button href="/about" variant="ghost">
              About Park Live
            </Button>
            <Button href="/services" variant="link">
              Our services
            </Button>
          </div>
        </div>
        <GlanceStats className="mt-16 md:mt-24" />
      </div>
    </section>
  );
}
