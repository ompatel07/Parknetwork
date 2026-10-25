"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Two cheap, site-wide observers:
 *  1. Adds `.is-in` to every `[data-reveal]` element as it scrolls into view
 *     (CSS does the animating — effects.css).
 *  2. Marks every section `data-inview="1|0"` so CSS can pause all of its
 *     looping animations while it's off-screen (saves CPU on phones).
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => el.classList.add("is-in"));
      return;
    }

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            reveal.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    );
    document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)").forEach((el) => reveal.observe(el));

    const inview = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) (entry.target as HTMLElement).dataset.inview = entry.isIntersecting ? "1" : "0";
      },
      { rootMargin: "120px 0px" },
    );
    document.querySelectorAll<HTMLElement>("main section, footer").forEach((el) => inview.observe(el));

    return () => {
      reveal.disconnect();
      inview.disconnect();
    };
  }, [pathname]);

  return null;
}
