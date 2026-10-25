"use client";

import { useEffect, useRef } from "react";
import { SignalMark } from "@/components/ui/SignalMark";

/** Key used to show the preloader on the first visit only. */
export const PRELOADER_KEY = "pln:preloaded";

/**
 * Runs in <head> before paint. Returning visitors get `data-preloaded`
 * on <html>, which hides the preloader via CSS with no flash.
 */
export const preloaderScript = `document.documentElement.classList.add("js");try{if(localStorage.getItem("${PRELOADER_KEY}")){document.documentElement.setAttribute("data-preloaded","")}else{localStorage.setItem("${PRELOADER_KEY}","1")}}catch(e){}`;

/**
 * The animation itself is pure CSS (see globals.css) so it starts on first
 * paint. This component only adds "skip on click / key" and cleans up.
 */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || document.documentElement.hasAttribute("data-preloaded")) return;
    const skip = () => el.setAttribute("data-skip", "");
    const done = (e: AnimationEvent) => {
      if (e.target !== el) return;
      el.style.display = "none";
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
      <div className="preloader__curtain" />
      <div className="preloader__wave" />
      <div className="preloader__content">
        <div className="relative grid place-items-center">
          <span className="preloader__ring" />
          <span className="preloader__ring" />
          <span className="preloader__ring" />
          <SignalMark className="preloader__mark relative size-16" />
        </div>
        <p className="preloader__label eyebrow mt-10 flex items-center gap-2 text-muted">
          <span className="size-1.5 rounded-full bg-live" />
          Tuning in
        </p>
      </div>
    </div>
  );
}
