"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Sparkles, X } from "lucide-react";
import { MOTION_KEY, motionOff, setMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";

const noop = () => () => {};
const useMotionOff = () => useSyncExternalStore(noop, motionOff, () => false);

/** Footer switch: "Motion · On / Off". */
export function MotionSwitch({ className }: { className?: string }) {
  const off = useMotionOff();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={!off}
      onClick={() => setMotion(off)}
      className={cn("group inline-flex items-center gap-3 text-muted transition-colors hover:text-ink", className)}
    >
      <span className="eyebrow">Motion</span>
      <span className={cn("relative h-6 w-11 rounded-full border transition-colors", off ? "border-line-strong bg-white/5" : "border-transparent bg-[linear-gradient(110deg,var(--color-violet),var(--color-signal))]")}>
        <span className={cn("absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-white transition-[left]", off ? "left-1" : "left-[1.45rem]")} />
      </span>
      <span className="eyebrow w-7 text-left">{off ? "Off" : "On"}</span>
    </button>
  );
}

/**
 * Shown once when the device asks for reduced motion and the visitor hasn't
 * chosen yet: explains why things are still, with a one-click opt-in.
 */
export function MotionNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const d = document.documentElement;
    let stored: string | null = null;
    let dismissed = false;
    try {
      stored = localStorage.getItem(MOTION_KEY);
      dismissed = sessionStorage.getItem("pln:motion-notice") === "1";
    } catch {
      /* storage blocked */
    }
    if (d.dataset.motion === "off" && d.dataset.motionSystem === "reduce" && !stored && !dismissed) {
      const t = window.setTimeout(() => setShow(true), 900);
      return () => window.clearTimeout(t);
    }
  }, []);

  if (!show) return null;

  const dismiss = () => {
    try {
      sessionStorage.setItem("pln:motion-notice", "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  return (
    <div
      role="region"
      aria-label="Animation settings"
      className="glass fixed inset-x-3 top-[calc(var(--header-h)+0.5rem)] z-[70] mx-auto flex max-w-xl items-center gap-3 rounded-[1.4rem] bg-surface/90 p-2.5 pl-4 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)] md:gap-4 lg:top-24"
    >
      <Sparkles className="size-5 shrink-0 text-cyan" aria-hidden />
      <p className="text-sm leading-snug text-ink/85">
        Animations are off <span className="text-muted">(your device prefers reduced motion)</span>
      </p>
      <button
        type="button"
        onClick={() => setMotion(true)}
        className="shrink-0 rounded-full bg-[linear-gradient(110deg,var(--color-violet),var(--color-signal))] px-4 py-2.5 text-sm font-medium whitespace-nowrap text-white"
      >
        Enable animations
      </button>
      <button type="button" onClick={dismiss} aria-label="Keep animations off" className="grid size-9 shrink-0 place-items-center rounded-full text-muted hover:text-ink">
        <X className="size-4" aria-hidden />
      </button>
    </div>
  );
}
