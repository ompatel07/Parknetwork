"use client";

import { motionOff } from "@/lib/motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Decorative audio bars (no real audio). Canvas, mirrored around the centre
 * line, paused when off-screen. Reduced motion draws one still frame.
 */
export function AudioVisualizer({ bars = 48, className }: { bars?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = motionOff();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    let grad: CanvasGradient | null = null;
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, "#7C5CFF");
      grad.addColorStop(0.55, "#3D8BFF");
      grad.addColorStop(1, "#4FE3FF");
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const seeds = Array.from({ length: bars }, (_, i) => ({
      a: 0.6 + Math.random() * 1.6,
      b: Math.random() * Math.PI * 2,
      c: 2 + Math.random() * 3,
      env: Math.sin((i / (bars - 1)) * Math.PI) ** 0.7,
    }));

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      if (!grad) return;
      ctx.fillStyle = grad;
      const gap = w / bars;
      const bw = Math.max(2, gap * 0.48);
      // "Speech" envelope: bursts and pauses
      const speech = 0.35 + 0.65 * Math.abs(Math.sin(t * 0.0011) * Math.sin(t * 0.0023 + 1));
      seeds.forEach((s, i) => {
        const v =
          (0.5 + 0.5 * Math.sin(t * 0.004 * s.a + s.b)) * 0.6 +
          (0.5 + 0.5 * Math.sin(t * 0.009 * s.c + i)) * 0.4;
        const bh = Math.max(bw, v * s.env * speech * h * 0.92);
        const x = i * gap + (gap - bw) / 2;
        const y = (h - bh) / 2;
        ctx.globalAlpha = 0.45 + 0.55 * v;
        ctx.beginPath();
        ctx.roundRect(x, y, bw, bh, bw / 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    if (reduced) {
      draw(1800);
      return () => ro.disconnect();
    }

    let raf = 0;
    let visible = false;
    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(loop);
    });
    const loop = (t: number) => {
      draw(t);
      if (visible) raf = requestAnimationFrame(loop);
    };
    io.observe(canvas);
    draw(0);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [bars]);

  return <canvas ref={ref} aria-hidden className={cn("block h-full w-full", className)} />;
}
