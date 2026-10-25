"use client";

import Lenis from "lenis";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks";

/* A tiny store so any component can reach the Lenis instance without prop drilling. */
let instance: Lenis | null = null;
const listeners = new Set<() => void>();
const setInstance = (l: Lenis | null) => {
  instance = l;
  listeners.forEach((fn) => fn());
};

export function useLenis() {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => instance,
    () => null,
  );
}

/** Scroll helper that works with or without Lenis (reduced motion). */
export function scrollToTarget(target: number | string | HTMLElement, opts: { immediate?: boolean; offset?: number } = {}) {
  if (instance) {
    instance.scrollTo(target, { immediate: opts.immediate, offset: opts.offset ?? 0, force: true, duration: 1.4 });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "auto" });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (el instanceof HTMLElement) {
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + (opts.offset ?? 0) });
  }
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      anchors: { offset: -80 },
      autoRaf: false,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setInstance(lenis);
    // Web fonts change text heights — re-measure scroll animations once they load
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setInstance(null);
    };
  }, [reduced]);

  return <>{children}</>;
}
