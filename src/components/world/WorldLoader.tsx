"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const SignalWorld = dynamic(() => import("./SignalWorld"), { ssr: false });

type Nav = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

/** Picks a particle budget for this device, then loads the world once the page is idle. */
function particleBudget() {
  const nav = navigator as Nav;
  const lowEnd = !!nav.connection?.saveData || (nav.hardwareConcurrency ?? 8) < 4 || (nav.deviceMemory ?? 8) < 4;
  const w = window.innerWidth;
  if (lowEnd) return 4000;
  if (w < 768) return 6500;
  if (w < 1280) return 11000;
  return 15000;
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

const START_EVENTS = ["pointerdown", "touchstart", "wheel", "scroll", "keydown"] as const;

/**
 * Desktop: the world loads as soon as the page is idle.
 * Phones/tablets: it loads on the first touch or scroll — the 3D engine is
 * big, so this keeps the first seconds smooth while the page comes to life,
 * and the particles fade in just as the visitor starts exploring.
 */
export function WorldLoader() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      let off = false;
      try {
        off = localStorage.getItem("pln:noworld") === "1";
      } catch {
        /* ignore */
      }
      if (!off && hasWebGL()) setCount(particleBudget());
    };
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const whenIdle = (timeout: number) => (w.requestIdleCallback ? w.requestIdleCallback(go, { timeout }) : window.setTimeout(go, 300));

    const touch = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    if (!touch) {
      const id = whenIdle(1200);
      return () => {
        window.cancelIdleCallback?.(id);
        window.clearTimeout(id);
      };
    }

    const start = () => {
      START_EVENTS.forEach((e) => window.removeEventListener(e, start));
      whenIdle(600);
    };
    START_EVENTS.forEach((e) => window.addEventListener(e, start, { passive: true, once: true }));
    return () => START_EVENTS.forEach((e) => window.removeEventListener(e, start));
  }, []);

  return (
    <div aria-hidden className={cn("pointer-events-none fixed inset-0 z-[1]", !count && "hidden")}>
      {count > 0 && <SignalWorld count={count} />}
    </div>
  );
}
