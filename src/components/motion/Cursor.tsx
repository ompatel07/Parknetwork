"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";
import { onScrollY } from "@/lib/scroll";

const INTERACTIVE = "a, button, [role='button'], summary, label, select";
const TEXT = "input:not([type='checkbox']):not([type='radio']):not([type='submit']), textarea";

/**
 * Dot + trailing ring. Add `data-cursor="View"` to any element to show a label.
 * Only mounts on mouse/trackpad devices with motion allowed.
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  if (!fine || reduced) return null;
  return <CursorInner />;
}

function CursorInner() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const d = dot.current;
    const r = ring.current;
    const b = bubble.current;
    const l = label.current;
    if (!d || !r || !b || !l) return;

    const root = document.documentElement;
    root.classList.add("has-cursor");
    gsap.set([d, r, b], { xPercent: -50, yPercent: -50, x: -100, y: -100 });

    const dx = gsap.quickTo(d, "x", { duration: 0.06, ease: "power3.out" });
    const dy = gsap.quickTo(d, "y", { duration: 0.06, ease: "power3.out" });
    // Ring trails a touch; the label bubble stays close so it never feels laggy
    const rx = gsap.quickTo(r, "x", { duration: 0.22, ease: "power3.out" });
    const ry = gsap.quickTo(r, "y", { duration: 0.22, ease: "power3.out" });
    const bx = gsap.quickTo(b, "x", { duration: 0.12, ease: "power3.out" });
    const by = gsap.quickTo(b, "y", { duration: 0.12, ease: "power3.out" });

    let visible = false;
    let state = "";
    let mx = -100;
    let my = -100;

    const setState = (next: string, text = "") => {
      if (next === state && text === l.textContent) return;
      // The bubble appears right under the pointer, not where it last was
      if (next === "label" && state !== "label") {
        bx(mx, mx);
        by(my, my);
      }
      state = next;
      r.dataset.state = next;
      d.dataset.state = next;
      if (next === "label") l.textContent = text;
      // "auto" only replaces the old scale tween. (`true` would also kill the
      // x/y follow tweens above and leave the bubble stuck in one place.)
      gsap.to(b, { scale: next === "label" ? 1 : 0, duration: 0.35, ease: "expo.out", overwrite: "auto" });
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX;
      my = e.clientY;
      if (!visible) {
        visible = true;
        gsap.set([d, r, b], { x: mx, y: my });
        gsap.to([d, r], { opacity: 1, duration: 0.3 });
      }
      dx(mx);
      dy(my);
      rx(mx);
      ry(my);
      bx(mx);
      by(my);
    };

    const evaluate = (t: Element | null) => {
      if (!t?.closest) return setState("default");
      const labelled = t.closest<HTMLElement>("[data-cursor]");
      if (labelled?.dataset.cursor) return setState("label", labelled.dataset.cursor);
      if (t.closest(TEXT)) return setState("text");
      if (t.closest(INTERACTIVE)) return setState("hover");
      setState("default");
    };
    const onOver = (e: PointerEvent) => evaluate(e.target as Element | null);

    // Scrolling moves the page under a still mouse without any pointer
    // event, so re-check what's under it (otherwise "Watch" would stay up
    // after the tile has scrolled away).
    let scrollTimer = 0;
    const offScroll = onScrollY(() => {
      if (!visible || scrollTimer) return;
      scrollTimer = window.setTimeout(() => {
        scrollTimer = 0;
        evaluate(document.elementFromPoint(mx, my));
      }, 120);
    });

    const onLeave = () => {
      visible = false;
      gsap.to([d, r], { opacity: 0, duration: 0.3 });
      setState("default");
    };
    const onDown = () => gsap.to(r, { scale: 0.8, duration: 0.2 });
    const onUp = () => gsap.to(r, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      offScroll();
      window.clearTimeout(scrollTimer);
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[95]">
      <div
        ref={ring}
        data-state="default"
        className="fixed top-0 left-0 size-9 rounded-full border border-ink/40 opacity-0 will-change-transform transition-[width,height,border-color,background-color] duration-300 ease-(--ease-signal) data-[state=hover]:size-16 data-[state=hover]:border-cyan/70 data-[state=hover]:bg-cyan/5 data-[state=label]:border-transparent data-[state=text]:size-1 data-[state=text]:border-transparent"
      />
      <div
        ref={dot}
        data-state="default"
        className="fixed top-0 left-0 size-1.5 rounded-full bg-ink opacity-0 mix-blend-difference will-change-transform transition-[width,height] duration-200 data-[state=label]:size-0 data-[state=text]:h-5 data-[state=text]:w-0.5 data-[state=text]:rounded-sm"
      />
      <div
        ref={bubble}
        className="fixed top-0 left-0 grid size-20 scale-0 place-items-center rounded-full will-change-transform bg-[linear-gradient(135deg,var(--color-violet),var(--color-signal))] shadow-[0_10px_50px_-5px_rgb(124_92_255/0.6)]"
      >
        <span ref={label} className="eyebrow text-[0.68rem] text-white" />
      </div>
    </div>
  );
}
