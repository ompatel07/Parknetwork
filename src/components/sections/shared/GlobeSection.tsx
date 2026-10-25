"use client";

import { useState } from "react";
import { site } from "@/config/site";
import { signal } from "@/components/world/store";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { ChannelLabel } from "@/components/ui/Badges";
import { cn } from "@/lib/cn";

/**
 * Country list beside the particle globe. Hovering or focusing a country
 * spins the globe to it.
 */
export function GlobeSection({
  channel = "05",
  title = "Broadcasting",
  accent = "across borders.",
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
      <div aria-hidden className="h-[52svh] lg:hidden" />
      <div className="container-site grid lg:min-h-[80svh] lg:grid-cols-12 lg:items-center">
        <div className="rounded-panel bg-bg/70 p-6 backdrop-blur-sm md:p-10 lg:col-span-5 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <ChannelLabel channel={channel} data-reveal>
            Global reach
          </ChannelLabel>
          <RevealHeading title={title} accent={accent} delay={0.05} className="mt-8 text-d1 uppercase" />
          <p className="mt-6 max-w-md text-lead text-muted" data-reveal style={{ ["--d" as string]: "0.1s" }}>
            {lead ??
              `Our team supports hosts, agencies and partners across ${regions.length} countries — with local understanding and one consistent standard.`}
          </p>
          <ul className="mt-10 grid grid-cols-2 gap-x-6 border-t border-line" data-reveal style={{ ["--d" as string]: "0.15s" }}>
            {regions.map((r, i) => (
              <li key={r.code} className="border-b border-line">
                <button
                  type="button"
                  onPointerEnter={() => focus(i)}
                  onFocus={() => focus(i)}
                  onClick={() => focus(i)}
                  data-cursor="Locate"
                  className={cn(
                    "group flex w-full items-center gap-3 py-3 text-left transition-colors duration-300",
                    active === i ? "text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  <span
                    className={cn(
                      "eyebrow w-7 transition-colors",
                      i === 0 ? "text-live" : active === i ? "text-cyan" : "text-muted/60",
                    )}
                  >
                    {r.code}
                  </span>
                  <span className="truncate text-sm md:text-base">{r.name}</span>
                  {active === i && <span aria-hidden className="ml-auto size-1.5 shrink-0 rounded-full bg-cyan shadow-[0_0_8px_var(--color-cyan)]" />}
                </button>
              </li>
            ))}
          </ul>
          <p className="eyebrow mt-4 flex items-center gap-2 text-muted">
            <span className="size-1.5 rounded-full bg-live" /> {regions[0]?.name} — headquarters
          </p>
        </div>
      </div>
    </section>
  );
}
