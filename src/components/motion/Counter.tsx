"use client";

import { useEffect, useRef } from "react";

/**
 * Counts up when scrolled into view. Server-renders the final value,
 * so search engines, no-JS and reduced-motion users see the real number.
 */
export function Counter({ value, suffix = "", duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fmt = (n: number) => `${Math.round(n).toLocaleString("en-IN")}${suffix}`;

    // Only animate if it starts off-screen (avoids a visible jump to 0)
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    el.textContent = fmt(0);

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / (duration * 1000));
          const eased = 1 - Math.pow(1 - t, 4);
          el.textContent = fmt(value * eased);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, suffix, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {value.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}
