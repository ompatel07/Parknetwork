"use client";

import { ArrowUp } from "lucide-react";
import { scrollToTarget } from "@/components/motion/SmoothScroll";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => {
        scrollToTarget(0);
        document.getElementById("main")?.focus({ preventScroll: true });
      }}
      className="group inline-flex items-center gap-2 self-start text-muted transition-colors hover:text-ink"
    >
      Back to top
      <span className="grid size-8 place-items-center rounded-full border border-line transition-colors group-hover:border-cyan/50">
        <ArrowUp className="size-4 transition-transform duration-500 ease-(--ease-signal) group-hover:-translate-y-0.5" aria-hidden />
      </span>
    </button>
  );
}
