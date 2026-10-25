"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useDialog } from "@/lib/useDialog";
import { useIsDesktop } from "@/lib/hooks";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Side panel on desktop, bottom sheet on phones. Accessible modal dialog. */
export function Sheet({
  open,
  onClose,
  title,
  eyebrow,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: ReactNode;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const desktop = useIsDesktop();
  const reduced = useReducedMotion();
  useDialog(open, onClose, ref);

  const hidden = reduced ? { opacity: 0 } : desktop ? { x: "100%" } : { y: "100%" };
  const shown = reduced ? { opacity: 1 } : desktop ? { x: 0 } : { y: 0 };
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  if (!mounted) return null;

  // Portal to <body> so the panel sits above the header and page layers
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]">
          <motion.div
            className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
          />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="absolute inset-x-0 bottom-0 flex max-h-[92svh] flex-col overflow-hidden rounded-t-[1.75rem] border border-line bg-surface shadow-[0_-30px_80px_-20px_rgb(0_0_0/0.8)] lg:inset-y-0 lg:right-0 lg:left-auto lg:max-h-none lg:w-[min(40rem,100vw)] lg:rounded-none lg:rounded-l-[2rem]"
            initial={hidden}
            animate={shown}
            exit={hidden}
            transition={{ duration: reduced ? 0.2 : 0.7, ease: EASE }}
          >
            <div aria-hidden className="glow-orb -top-32 -right-24 size-80 bg-violet/30" />
            <div className="relative flex items-start justify-between gap-6 border-b border-line px-6 pt-5 pb-5 md:px-10 md:pt-8">
              <div>
                <span aria-hidden className="mx-auto mb-4 block h-1 w-10 rounded-full bg-line-strong lg:hidden" />
                {eyebrow && <div className="eyebrow mb-3 text-cyan">{eyebrow}</div>}
                <h2 id={titleId} className="text-d3">
                  {title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid size-11 shrink-0 place-items-center rounded-full border border-line transition-colors hover:border-cyan/50 hover:bg-white/5"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <div data-lenis-prevent className="relative flex-1 overflow-y-auto overscroll-contain px-6 py-8 md:px-10">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
