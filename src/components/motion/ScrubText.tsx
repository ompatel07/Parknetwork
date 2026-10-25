"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/** Paragraph whose words light up one by one as you scroll through it. */
export function ScrubText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".scrub-word",
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: ref.current, start: "top 82%", end: "bottom 45%", scrub: true },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <p ref={ref} className={cn(className)}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="scrub-word">
          {w}{" "}
        </span>
      ))}
    </p>
  );
}
