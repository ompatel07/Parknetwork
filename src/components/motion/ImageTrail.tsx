"use client";

import { useEffect, useRef } from "react";
import { media } from "@/config/media";
import { gsap } from "@/lib/gsap";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";
import { Photo } from "@/components/ui/Photo";

/**
 * Photos pop up along the cursor path and fade away (mouse only).
 * Fills its positioned parent; put content above it with z-index.
 */
export function ImageTrail({ step = 110 }: { step?: number }) {
  const root = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const keys = media.trail;

  useEffect(() => {
    const el = root.current;
    const host = el?.parentElement;
    if (!el || !host || !fine || reduced) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>(".trail-item"));
    let last = { x: 0, y: 0 };
    let i = 0;
    let z = 1;

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (Math.hypot(x - last.x, y - last.y) < step) return;
      const dx = x - last.x;
      last = { x, y };
      const item = items[i % items.length];
      i += 1;
      if (!item) return;
      gsap.killTweensOf(item);
      gsap.set(item, { x, y, xPercent: -50, yPercent: -50, zIndex: z++, rotation: gsap.utils.clamp(-12, 12, dx * 0.08) });
      gsap
        .timeline()
        .fromTo(item, { opacity: 1, scale: 0.4 }, { scale: 1, duration: 0.5, ease: "expo.out" })
        .to(item, { opacity: 0, scale: 0.85, y: y + 40, duration: 0.7, ease: "power2.in" }, 0.55);
    };
    host.addEventListener("pointermove", onMove);
    return () => host.removeEventListener("pointermove", onMove);
  }, [fine, reduced, step]);

  if (!fine || reduced) return null;

  return (
    <div ref={root} aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {keys.map((k) => (
        <div key={k} className="trail-item absolute top-0 left-0 aspect-[3/4] w-[clamp(9rem,13vw,14rem)] overflow-hidden rounded-2xl opacity-0 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)]">
          <Photo k={k} sizes="14rem" />
        </div>
      ))}
    </div>
  );
}
