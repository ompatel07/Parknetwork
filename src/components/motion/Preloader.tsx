"use client";

import { useEffect, useRef } from "react";
import { media } from "@/config/media";
import { PHOTOS } from "@/data/photos";
import { SignalMark } from "@/components/ui/SignalMark";

/** Key used to show the preloader on the first visit only. */
export const PRELOADER_KEY = "pln:preloaded";

/**
 * Runs in <head> before paint. Returning visitors get `data-preloaded`
 * on <html>, which hides the preloader via CSS with no flash.
 */
export const preloaderScript = `document.documentElement.classList.add("js");try{if(localStorage.getItem("${PRELOADER_KEY}")){document.documentElement.setAttribute("data-preloaded","")}else{localStorage.setItem("${PRELOADER_KEY}","1")}}catch(e){}`;

/* Flicker through the feeds, ending on the hero's first feed so the hand-off is seamless */
const FLICKER = [...media.reel.slice(0, 4).map((r) => r.key), media.heroFeeds[0]!.key];

/**
 * First-visit intro: a monitor (in the exact spot of the hero monitor)
 * flickers through feeds while a counter runs to 100, then fades into the
 * live hero. Pure CSS timing (globals.css) — this only adds click/key skip.
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
      <div className="preloader__curtain" />
      <div className="preloader__frame">
        {/* CSS backgrounds: never downloaded when the preloader is hidden for returning visitors */}
        {FLICKER.map((k, i) => (
          <div
            key={k + i}
            className="pl-img absolute inset-0 bg-cover bg-center"
            style={{
              ["--i" as string]: i,
              backgroundImage: `url(/_next/image?url=${encodeURIComponent(PHOTOS[k].src)}&w=828&q=75), url(${PHOTOS[k].blur})`,
            }}
          />
        ))}
        <div className="scanlines absolute inset-0" />
        <span className="absolute top-4 left-5 rounded-md bg-live px-2 py-1 font-mono text-[0.62rem] font-semibold tracking-wider text-white">
          SIGNAL
        </span>
      </div>
      <div className="preloader__meta">
        <SignalMark className="size-9" animated />
        <span className="eyebrow flex items-center gap-2 text-muted">
          <span className="size-1.5 rounded-full bg-live" /> Tuning in
        </span>
      </div>
      <div className="preloader__count font-display" />
    </div>
  );
}
