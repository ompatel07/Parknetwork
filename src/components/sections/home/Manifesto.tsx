"use client";

import { useRef, type ReactNode } from "react";
import { Mic } from "lucide-react";
import { site } from "@/config/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { ChannelLabel } from "@/components/ui/Badges";
import { Counter } from "@/components/motion/Counter";

/* Inline media "pills" that sit inside the sentence like words */
function Pill({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      aria-hidden
      className={`mf-w mx-[0.12em] inline-flex h-[0.86em] -translate-y-[0.06em] items-center gap-[0.14em] rounded-full px-[0.28em] align-middle ${className}`}
    >
      {children}
    </span>
  );
}

const MicPill = () => (
  <Pill className="bg-[linear-gradient(110deg,var(--color-violet),var(--color-signal))]">
    <Mic className="size-[0.42em] text-white" strokeWidth={2.2} />
    <span className="pill-eq flex h-[0.42em] items-center gap-[0.06em]">
      {[0.5, 1, 0.7, 0.9, 0.4].map((h, i) => (
        <span key={i} style={{ height: `${h * 100}%`, ["--i" as string]: i }} />
      ))}
    </span>
  </Pill>
);

const AgencyPill = () => (
  <Pill className="border border-line-strong bg-surface-2 pl-[0.12em]">
    {["from-violet to-signal", "from-signal to-cyan", "from-cyan to-violet"].map((g, i) => (
      <span
        key={g}
        className={`grid size-[0.6em] place-items-center rounded-full bg-gradient-to-br ${g} ring-[0.04em] ring-surface-2 ${i ? "-ml-[0.22em]" : ""}`}
      >
        <span className="text-[0.26em] leading-none font-semibold text-white">{["A", "G", "Y"][i]}</span>
      </span>
    ))}
  </Pill>
);

const GlobePill = () => (
  <Pill className="border border-cyan/40 bg-cyan/10 pr-[0.32em]">
    <svg viewBox="0 0 24 24" className="spin-slow size-[0.56em]" fill="none" stroke="#4FE3FF" strokeWidth="1.4">
      <circle cx="12" cy="12" r="10" />
      <ellipse cx="12" cy="12" rx="4.5" ry="10" />
      <path d="M2 12h20M4 7h16M4 17h16" />
    </svg>
    <span className="font-mono text-[0.26em] tracking-wider text-cyan">LIVE</span>
  </Pill>
);

type Part = string | ReactNode;

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const n = site.regions.length;

  const parts: Part[] = [
    "We put", <MicPill key="m" />, "hosts on air, give", <AgencyPill key="a" />,
    "agencies a structure that works, and connect", <GlobePill key="g" />, "communities across",
    <span key="n" className="mf-w accent text-beam">{n} countries</span>,
    "— one signal at a time.",
  ];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
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
