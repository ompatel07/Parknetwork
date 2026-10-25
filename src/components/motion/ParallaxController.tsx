"use client";

import { motionOff } from "@/lib/motion";
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
    if (motionOff()) return;
    let tweens: gsap.core.Tween[] = [];
    let skewEls: HTMLElement[] = [];
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
      skewEls = Array.from(document.querySelectorAll<HTMLElement>("main [data-vskew]"));
    });

    // Scroll-velocity skew: [data-vskew] elements lean with scroll speed, then spring back
    let lastY = window.scrollY;
    let skew = 0;
    const tick = () => {
      const y = window.scrollY;
      const v = y - lastY;
      lastY = y;
      const target = Math.max(-4, Math.min(4, v * 0.14));
      skew += (target - skew) * 0.12;
      if (Math.abs(skew) < 0.01 && Math.abs(target) < 0.01) {
        if (skew !== 0) {
          skew = 0;
          skewEls.forEach((el) => (el.style.transform = ""));
        }
        return;
      }
      const t = `skewY(${skew.toFixed(2)}deg)`;
      skewEls.forEach((el) => (el.style.transform = t));
    };
    gsap.ticker.add(tick);

    return () => {
      cancelAnimationFrame(raf);
      gsap.ticker.remove(tick);
      skewEls.forEach((el) => (el.style.transform = ""));
      tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    };
  }, [pathname]);

  return null;
}
