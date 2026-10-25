"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#*+<>";

/**
 * "Decoding signal" text: characters cycle through random glyphs, then lock
 * in left to right. Runs when scrolled into view and again on hover.
 */
export function Scramble({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;

    const run = () => {
      cancelAnimationFrame(raf);
      const start = performance.now();
      const duration = Math.min(900, 280 + text.length * 32);
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const locked = Math.floor(p * text.length);
        let out = "";
        for (let i = 0; i < text.length; i++) {
          const ch = text[i] ?? "";
          out += i < locked || ch === " " ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        el.textContent = out;
        if (p < 1) raf = requestAnimationFrame(tick);
        else el.textContent = text;
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    const host = el.closest("a, button, [data-scramble-host]") ?? el;
    host.addEventListener("pointerenter", run);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      host.removeEventListener("pointerenter", run);
      el.textContent = text;
    };
  }, [text]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text}
    </span>
  );
}
