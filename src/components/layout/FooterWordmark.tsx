"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const WORD = ["P", "A", "R", "K", " ", "L", "I", "V", "E"];

/** Giant "PARK LIVE" that rises letter by letter as the footer scrolls in. */
export function FooterWordmark() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const main = document.getElementById("main");
        const footer = root.current?.closest("footer");
        if (!main || !footer) return;
        gsap.fromTo(
          ".wm-letter",
          { yPercent: 105, rotate: 6 },
          {
            yPercent: 0,
            rotate: 0,
            ease: "none",
            stagger: 0.06,
            scrollTrigger: {
              trigger: main,
              start: "bottom bottom",
              end: () => `bottom bottom-=${footer.offsetHeight * 0.95}`,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        );
        gsap.fromTo(
          ".wm-dot",
          { scale: 0 },
          {
            scale: 1,
            ease: "back.out(3)",
            scrollTrigger: {
              trigger: main,
              start: () => `bottom bottom-=${footer.offsetHeight * 0.85}`,
              end: () => `bottom bottom-=${footer.offsetHeight * 0.95}`,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden className="relative select-none [container-type:inline-size]">
      <div className="flex items-end justify-between overflow-hidden pt-[0.06em] font-display text-[17.6cqi] leading-[0.82] font-bold tracking-[-0.02em]">
        {WORD.map((ch, i) =>
          ch === " " ? (
            <span key={i} className="w-[0.22em]" />
          ) : (
            <span
              key={i}
              className="wm-letter inline-block origin-bottom-left bg-[linear-gradient(180deg,#f5f4fa_8%,rgb(160_140_255/0.75)_52%,rgb(61_139_255/0.05)_96%)] bg-clip-text pb-[0.04em] text-transparent will-change-transform"
            >
              {ch}
            </span>
          ),
        )}
        <span className="wm-dot mb-[0.6em] ml-[0.06em] inline-block size-[0.085em] shrink-0 rounded-full bg-live shadow-[0_0_0.12em_var(--color-live)]" />
      </div>
    </div>
  );
}
