"use client";

import { motionOff } from "@/lib/motion";
import { useRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** Max tilt in degrees */
  max?: number;
};

/**
 * Card that tilts toward the pointer with a glow + lit border following it.
 * Pure CSS variables — no React re-renders while moving. Mouse only.
 */
export function TiltCard({ children, className, max = 6, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useRef<boolean | null>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    reduced.current ??= motionOff();
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    el.style.setProperty("--glow", "1");
    if (!reduced.current) {
      el.style.setProperty("--rx", `${(0.5 - y) * max}deg`);
      el.style.setProperty("--ry", `${(x - 0.5) * max}deg`);
    }
    el.dataset.active = "";
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--glow", "0");
    delete el.dataset.active;
  };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={cn("tilt relative", className)} {...rest}>
      <div aria-hidden className="tilt-glow" />
      <div aria-hidden className="tilt-border" />
      {children}
    </div>
  );
}
