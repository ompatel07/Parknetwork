"use client";

import { motionOff } from "@/lib/motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { getScrollY } from "@/lib/scroll";

/**
 * Marquee that speeds up, reverses and skews with your scroll velocity.
 * Reduced motion: a static, wrapping row.
 */
export function VelocityMarquee({
  items,
  speed = 60,
  outline = false,
  className,
}: {
  items: string[];
  /** base speed in px/s; negative scrolls the other way */
  speed?: number;
  outline?: boolean;
  className?: string;
}) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el || motionOff()) return;
    let x = 0;
    let raf = 0;
    let prev = 0;
    let lastY = getScrollY();
    let vel = 0;
    let dir = 1;
    // Width is cached (reading it every frame would force a page layout)
    let half = el.scrollWidth / 2;
    const ro = new ResizeObserver(() => (half = el.scrollWidth / 2));
    ro.observe(el);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = prev ? Math.min(0.05, (now - prev) / 1000) : 0;
      prev = now;
      const y = getScrollY();
      const dy = y - lastY;
      lastY = y;
      if (Math.abs(dy) > 0.5) dir = dy > 0 ? 1 : -1;
      vel += (Math.min(40, Math.abs(dy)) - vel) * 0.1;
      x -= (speed + Math.sign(speed) * vel * 22) * dir * dt;
      if (half > 0) {
        if (x <= -half) x += half;
        if (x > 0) x -= half;
      }
      const skew = Math.max(-12, Math.min(12, vel * 0.5 * dir * Math.sign(speed)));
      el.style.transform = `translate3d(${x.toFixed(2)}px,0,0) skewX(${(-skew).toFixed(2)}deg)`;
    };

    // Only animate while on screen
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e?.isIntersecting) {
        prev = 0;
        lastY = getScrollY();
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [speed]);

  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="flex items-center">
          <span
            className={cn(
              "px-5 font-display text-[clamp(2.4rem,1.2rem+5vw,7rem)] leading-[1.1] font-semibold tracking-[-0.03em] whitespace-nowrap uppercase md:px-10",
              outline ? "text-outline" : "text-ink",
            )}
          >
            {item}
          </span>
          <span aria-hidden className="accent text-[clamp(2rem,1rem+4vw,5.5rem)] text-beam">
            ✶
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={cn("relative overflow-hidden py-2", className)}>
      <div ref={track} className="flex w-max will-change-transform motion-off:w-auto motion-off:flex-wrap">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
