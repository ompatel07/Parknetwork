"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";

type Item = { q: string; a: string };

/** Accessible accordion — one panel open at a time, CSS grid-row animation. */
export function Accordion({ items, defaultOpen = 0, className }: { items: Item[]; defaultOpen?: number | null; className?: string }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const base = useId();

  return (
    <div className={cn("border-t border-line", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const btn = `${base}-b${i}`;
        const panel = `${base}-p${i}`;
        return (
          <div key={item.q} className="border-b border-line">
            <h3>
              <button
                id={btn}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center gap-4 py-6 text-left md:gap-8 md:py-8"
              >
                <span className={cn("eyebrow w-8 shrink-0 transition-colors", isOpen ? "text-cyan" : "text-muted")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "flex-1 font-display text-h4 font-medium transition-[color,transform] duration-500 ease-(--ease-signal) group-hover:translate-x-1.5",
                    isOpen ? "text-ink" : "text-ink/75 group-hover:text-ink",
                  )}
                >
                  {item.q}
                </span>
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-(--ease-signal)",
                    isOpen ? "rotate-45 border-transparent bg-cyan text-bg" : "border-line group-hover:border-cyan/50",
                  )}
                >
                  <Plus className="size-4" aria-hidden />
                </span>
              </button>
            </h3>
            <div id={panel} role="region" aria-labelledby={btn} className="acc-panel" data-open={isOpen || undefined}>
              <div className="overflow-hidden">
                <p className="max-w-2xl pr-14 pb-8 pl-12 text-muted md:pl-16">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
