import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * The broadcast mark from the Park Live Network logo, redrawn as vector:
 * a play triangle inside two pairs of signal arcs.
 * `animated` makes the arcs pulse outward like a live signal.
 */
export function SignalMark({ className, animated = false }: { className?: string; animated?: boolean }) {
  const id = useId().replace(/:/g, "");
  const grad = `sm-${id}`;
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      className={cn("shrink-0 overflow-visible", animated && "signal-animated", className)}
    >
      <defs>
        <linearGradient id={grad} x1="4" y1="6" x2="44" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3D8BFF" />
          <stop offset="1" stopColor="#4FE3FF" />
        </linearGradient>
      </defs>
      <g stroke={`url(#${grad})`} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path className="signal-arc signal-arc--outer" d="M12.43 10.21 A18 18 0 0 0 12.43 37.79" />
        <path className="signal-arc signal-arc--outer" d="M35.57 10.21 A18 18 0 0 1 35.57 37.79" />
        <path className="signal-arc signal-arc--inner" d="M15.83 16.64 A11 11 0 0 0 15.83 31.36" />
        <path className="signal-arc signal-arc--inner" d="M32.17 16.64 A11 11 0 0 1 32.17 31.36" />
        <path d="M21 18.6 L29.4 24 L21 29.4 Z" />
      </g>
    </svg>
  );
}
