"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

/**
 * One controller for every `[data-parallax]` element on the page: the image
 * inside a frame drifts up while the frame scrolls past (frames are taller
 * than their image box via CSS, so edges never show).
 */
export function ParallaxController() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tweens: gsap.core.Tween[] = [];
    const raf = requestAnimationFrame(() => {
      tweens = Array.from(document.querySelectorAll<HTMLElement>("main [data-parallax]")).map((el) =>
        gsap.fromTo(
          el,
          { yPercent: -7 },
          {
            yPercent: 7,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
          },
        ),
      );
    });
    return () => {
      cancelAnimationFrame(raf);
      tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    };
  }, [pathname]);

  return null;
}
