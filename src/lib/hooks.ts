"use client";

import { useSyncExternalStore } from "react";

function subscribeMedia(query: string) {
  return (onChange: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  };
}

/** SSR-safe media query. Returns `serverValue` until hydrated. */
export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    subscribeMedia(query),
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)", false);

/** True on mouse / trackpad devices — gates the custom cursor and magnetic effects. */
export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)", false);

export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)", false);

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

const noopSubscribe = () => () => {};

/** Rough capability check used to decide whether to load heavy effects (WebGL). */
export function useIsCapableDevice() {
  return useSyncExternalStore(
    noopSubscribe,
    () => {
      const nav = navigator as NavigatorWithHints;
      if (nav.connection?.saveData) return false;
      if ((nav.hardwareConcurrency ?? 8) < 4) return false;
      if ((nav.deviceMemory ?? 8) < 4) return false;
      return true;
    },
    () => false,
  );
}
