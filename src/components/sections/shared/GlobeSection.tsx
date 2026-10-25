"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { site } from "@/config/site";
import { signal } from "@/components/world/store";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { ChannelLabel } from "@/components/ui/Badges";
import { cn } from "@/lib/cn";

/**
 * Global presence: Park Live Network serves every country. Choosing a
 * world region turns the particle globe to face it.
 */
export function GlobeSection({
  channel = "05",
  title = "Serving",
  accent = "every country.",
  lead,
}: {
  channel?: string;
  title?: string;
  accent?: string;
  lead?: string;
}) {
  const [active, setActive] = useState(0);
  const regions = site.regions;

  const focus = (i: number) => {
    const r = regions[i];
    if (!r) return;
    setActive(i);
    signal.focus(r.lat, r.lng);
  };

  return (
    <section data-scene="globe" data-scene-align="right" className="relative py-(--section-y)">
      {/* phones: leave room to see the globe above the text */}
      <div aria-hidden className="h-[48svh] lg:hidden" />
      <div className="container-site grid lg:min-h-[80svh] lg:grid-cols-12 lg:items-center">
        <div className="rounded-panel bg-bg/85 p-6 md:p-10 lg:col-span-5 lg:bg-transparent lg:p-0">
          <ChannelLabel channel={channel} data-reveal>
            Global presence
          </ChannelLabel>
          <RevealHeading title={title} accent={accent} delay={0.05} className="mt-8 text-d1 uppercase" />
          <p className="mt-6 max-w-md text-lead text-muted" data-reveal style={{ ["--d" as string]: "0.1s" }}>
            {lead ??
              "Park Live Network serves platforms, creators, agencies and communities in every country — with teams and partners across every major region and time zone."}
          </p>

          <p className="eyebrow mt-10 flex items-center gap-2 text-cyan" data-reveal style={{ ["--d" as string]: "0.12s" }}>
            <Globe className="size-4" aria-hidden /> {site.coverage} · {regions.length} regions
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 border-t border-line" data-reveal style={{ ["--d" as string]: "0.15s" }}>
            {regions.map((r, i) => (
              <li key={r.code} className="border-b border-line">
                <button
                  type="button"
                  onPointerEnter={(e) => e.pointerType === "mouse" && focus(i)}
                  onFocus={() => focus(i)}
                  onClick={() => focus(i)}
                  aria-pressed={active === i}
                  data-cursor="Locate"
                  className={cn(
                    "group flex w-full items-center gap-3 py-3 text-left transition-colors duration-300",
                    active === i ? "text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  <span className={cn("size-1.5 shrink-0 rounded-full transition-colors", active === i ? "bg-cyan shadow-[0_0_8px_var(--color-cyan)]" : "bg-white/25")} />
                  <span className="truncate text-sm md:text-base">{r.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
