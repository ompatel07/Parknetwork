"use client";

import { motionOff } from "@/lib/motion";
import { useEffect, useRef } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

/** Broadcast timecode HH:MM:SS:FF counting from page load (25 fps). */
export function Timecode({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || motionOff()) return;
    const start = performance.now();
    let raf = 0;
    let last = -1;
    const tick = (now: number) => {
      const frames = Math.floor(((now - start) / 1000) * 25);
      if (frames !== last) {
        last = frames;
        const f = frames % 25;
        const s = Math.floor(frames / 25);
        el.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f)}`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      00:00:00:00
    </span>
  );
}
