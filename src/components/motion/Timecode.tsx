"use client";

import { motionOff } from "@/lib/motion";
import { useEffect, useRef } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Broadcast timecode HH:MM:SS:FF counting from page load (25 fps base).
 * Repaints ~12× a second and only while on screen (tabular digits keep
 * its width fixed, so the text around it never shifts).
 */
export function Timecode({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || motionOff()) return;
    const start = performance.now();
    let timer = 0;

    const tick = () => {
      if (document.hidden) return;
      const frames = Math.floor(((performance.now() - start) / 1000) * 25);
      const f = frames % 25;
      const s = Math.floor(frames / 25);
      el.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f)}`;
    };

    const io = new IntersectionObserver(([e]) => {
      window.clearInterval(timer);
      if (e?.isIntersecting) timer = window.setInterval(tick, 80);
    });
    io.observe(el);

    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, []);

  return (
    <span
      ref={ref}
      className={className}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      00:00:00:00
    </span>
  );
}
