"use client";

import { useEffect, type RefObject } from "react";
import { useLenis } from "@/components/motion/SmoothScroll";

/**
 * Modal behaviour for overlays: locks page scroll, closes on Escape,
 * keeps Tab focus inside `ref`, and returns focus to the opener on close.
 */
export function useDialog(open: boolean, onClose: () => void, ref: RefObject<HTMLElement | null>) {
  const lenis = useLenis();

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const opener = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => {
      ref.current?.querySelector<HTMLElement>("[data-autofocus], button, a, input, select, textarea")?.focus();
    }, 300);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !ref.current) return;
      const items = ref.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex='-1'])",
      );
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      lenis?.start();
      opener?.focus?.({ preventScroll: true });
    };
  }, [open, onClose, lenis, ref]);
}
