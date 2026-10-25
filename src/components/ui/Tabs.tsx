"use client";

import { motion } from "motion/react";
import { useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tab = { id: string; label: string; content: ReactNode };

/** Accessible tabs (arrow-key navigation) with a sliding pill indicator. */
export function Tabs({ tabs, className }: { tabs: Tab[]; className?: string }) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (i + dir + tabs.length) % tabs.length;
    const t = tabs[next];
    if (!t) return;
    setActive(t.id);
    refs.current[next]?.focus();
  };

  return (
    <div className={className}>
      <div role="tablist" className="glass inline-flex max-w-full gap-1 overflow-x-auto rounded-full p-1.5 no-scrollbar">
        {tabs.map((t, i) => {
          const on = t.id === active;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              id={`${base}-t-${t.id}`}
              role="tab"
              type="button"
              aria-selected={on}
              aria-controls={`${base}-p-${t.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(t.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={cn(
                "relative rounded-full px-5 py-2.5 text-sm whitespace-nowrap transition-colors md:px-6 md:text-[0.95rem]",
                on ? "text-white" : "text-muted hover:text-ink",
              )}
            >
              {on && (
                <motion.span
                  layoutId={`${base}-pill`}
                  className="absolute inset-0 rounded-full bg-[linear-gradient(110deg,var(--color-violet),var(--color-signal))]"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              <span className="relative">{t.label}</span>
            </button>
          );
        })}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          id={`${base}-p-${t.id}`}
          role="tabpanel"
          aria-labelledby={`${base}-t-${t.id}`}
          hidden={t.id !== active}
          className="mt-8"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
