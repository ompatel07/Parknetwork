"use client";

import { useEffect, useRef } from "react";
import { site } from "@/config/site";
import { SignalMark } from "@/components/ui/SignalMark";

/**
 * First-visit intro: the signal mark pulses while a counter runs to 100%,
 * then the whole curtain lifts to reveal the hero. Pure CSS timing
 * (globals.css) so it starts on first paint; this only adds click/key skip.
 */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || document.documentElement.hasAttribute("data-preloaded")) return;
    const skip = () => el.setAttribute("data-skip", "");
    const done = (e: AnimationEvent) => {
      if (e.target === el) el.style.display = "none";
    };
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("keydown", skip, { once: true });
    el.addEventListener("animationend", done);
    return () => {
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      el.removeEventListener("animationend", done);
    };
  }, []);

  return (
    <div ref={ref} className="preloader" aria-hidden>
      <div className="preloader__curtain">
        <div className="preloader__center">
          <span className="preloader__ring" />
          <span className="preloader__ring" />
          <span className="preloader__ring" />
          <SignalMark className="relative size-16 md:size-20" animated />
        </div>
        <p className="preloader__label eyebrow text-muted">
          <span className="size-1.5 rounded-full bg-live" /> Connecting {site.platforms.total}+ platforms
        </p>
        <p className="preloader__brand eyebrow text-muted">{site.name}</p>
        <div className="preloader__count font-display" />
        <div className="preloader__bar" />
      </div>
    </div>
  );
}
