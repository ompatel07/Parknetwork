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

export function WorldLoader() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const go = () => {
      let off = false;
      try {
        off = localStorage.getItem("pln:noworld") === "1";
      } catch {
        /* ignore */
      }
      if (!off && hasWebGL()) setCount(particleBudget());
    };
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(go, { timeout: 1200 });
      return () => window.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(go, 600);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div aria-hidden className={cn("pointer-events-none fixed inset-0 z-[1]", !count && "hidden")}>
      {count > 0 && <SignalWorld count={count} />}
    </div>
  );
}
