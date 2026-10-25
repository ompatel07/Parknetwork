"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { motionOff } from "@/lib/motion";

/**
 * Liquid hover: when the mouse enters any `[data-liquid]` element, its photo
 * ripples through a shared SVG displacement filter, then settles.
 * One filter, one active element at a time; mouse + motion-on only.
 */
export function LiquidController() {
  useEffect(() => {
    if (motionOff() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const turb = document.getElementById("liquid-turb");
    const disp = document.getElementById("liquid-disp");
    if (!turb || !disp) return;

    const state = { scale: 0, freq: 0.01 };
    let host: Element | null = null;
    let img: HTMLElement | null = null;
    let tl: gsap.core.Timeline | null = null;

    const apply = () => {
      disp.setAttribute("scale", state.scale.toFixed(1));
      turb.setAttribute("baseFrequency", `${state.freq.toFixed(4)} ${(state.freq * 2.6).toFixed(4)}`);
    };
    const release = () => {
      if (img) img.style.filter = "";
      img = null;
    };

    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const next = (e.target as Element | null)?.closest?.("[data-liquid]") ?? null;
      if (next === host) return;
      host = next;
      tl?.kill();
      release();
      if (!next) return;
      if (next.getBoundingClientRect().width > 760) return;
      img = next.querySelector<HTMLElement>("img");
      if (!img) return;
      img.style.filter = "url(#liquid)";
      tl = gsap
        .timeline({ onUpdate: apply, onComplete: release })
        .fromTo(state, { scale: 0, freq: 0.022 }, { scale: 38, freq: 0.009, duration: 0.45, ease: "power2.out" })
        .to(state, { scale: 0, freq: 0.004, duration: 1.2, ease: "power3.out" });
    };

    document.addEventListener("pointerover", onOver, { passive: true });
    return () => {
      document.removeEventListener("pointerover", onOver);
      tl?.kill();
      release();
    };
  }, []);

  return (
    <svg aria-hidden width="0" height="0" className="pointer-events-none absolute">
      <filter id="liquid" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
        <feTurbulence id="liquid-turb" type="fractalNoise" baseFrequency="0.01 0.026" numOctaves="2" seed="7" result="noise" />
        <feDisplacementMap id="liquid-disp" in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}
