"use client";

import Image from "next/image";
import { useState } from "react";
import { site } from "@/config/site";
import { ChannelLabel } from "@/components/ui/Badges";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { SignalMark } from "@/components/ui/SignalMark";
import { cn } from "@/lib/cn";

/**
 * Platform ecosystem: the client's platform logos orbit a giant "70+".
 * Hovering a row in the list (or a tile) lights that platform up.
 */
export function Ecosystem({ channel = "03" }: { channel?: string }) {
  const p = site.platforms;
  const [active, setActive] = useState<number | null>(null);
  if (!p.show) return null;
  const more = Math.max(0, p.total - p.items.length);
  const slots = [...p.items.map((it) => ({ ...it, more: false })), { name: `+${more} more`, category: "Across six categories", logo: "", more: true }];

  return (
    <section data-scene="dust" data-scene-dim="0.3" data-active={active !== null || undefined} className="eco relative overflow-hidden py-(--section-y)">
      <div className="container-site grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <ChannelLabel channel={channel} data-reveal>
            Platform ecosystem
          </ChannelLabel>
          <RevealHeading title="Platforms" accent="we've powered." delay={0.05} className="mt-8 text-d1 uppercase" />
          <p className="mt-6 max-w-md text-lead text-muted" data-reveal style={{ ["--d" as string]: "0.1s" }}>
            Our teams have managed and supported more than {p.total} applications across live streaming, audio chat,
            social networking, dating and short video.
          </p>

          <ul className="mt-10 border-t border-line" data-reveal style={{ ["--d" as string]: "0.15s" }} onPointerLeave={() => setActive(null)}>
            {p.items.map((it, i) => (
              <li key={it.name} className="border-b border-line">
                <button
                  type="button"
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className={cn("group flex w-full items-center gap-4 py-3.5 text-left transition-colors", active === i ? "text-ink" : "text-ink/75 hover:text-ink")}
                >
                  <span className="relative size-10 shrink-0 overflow-hidden rounded-[28%] ring-1 ring-white/10">
                    <Image src={it.logo} alt="" fill sizes="40px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg font-semibold">{it.name}</span>
                    <span className="block text-sm text-muted">{it.category}</span>
                  </span>
                  <span className={cn("eyebrow transition-colors", active === i ? "text-cyan" : "text-muted/50")}>0{i + 1}</span>
                </button>
              </li>
            ))}
          </ul>
          <ul className="mt-8 flex flex-wrap gap-2" data-reveal style={{ ["--d" as string]: "0.2s" }}>
            {p.categories.map((c) => (
              <li key={c} className="rounded-full border border-line px-3 py-1.5 text-xs text-muted">
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* Orbit */}
        <div className="lg:col-span-7" data-reveal="scale">
          <div className="eco-stage relative mx-auto aspect-square w-[min(40rem,92vw)]">
            <svg aria-hidden viewBox="0 0 200 200" fill="none" className="absolute inset-0 size-full">
              <circle cx="100" cy="100" r="80" stroke="white" strokeOpacity="0.1" strokeDasharray="1 4" />
              <circle cx="100" cy="100" r="58" stroke="#7C5CFF" strokeOpacity="0.25" />
              <circle cx="100" cy="100" r="99" stroke="white" strokeOpacity="0.05" />
            </svg>
            <div aria-hidden className="absolute inset-[22%] rounded-full bg-[radial-gradient(circle,rgb(124_92_255/0.35),transparent_70%)] blur-2xl" />

            {/* centre */}
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <SignalMark className="mx-auto size-10 md:size-12" animated />
                <p className="mt-2 font-display text-[clamp(4.5rem,2rem+9vw,9.5rem)] leading-[0.85] font-semibold tracking-[-0.05em]">
                  <span className="text-gradient">{p.total}</span>
                  <span className="accent text-beam">+</span>
                </p>
                <p className="eyebrow mt-3 text-muted">Applications managed</p>
              </div>
            </div>

            {/* orbiting tiles */}
            <div className="eco-orbit absolute inset-0">
              {slots.map((it, i) => {
                const angle = (360 / slots.length) * i - 90;
                const on = active === i;
                return (
                  <div
                    key={it.name}
                    className="eco-slot absolute top-1/2 left-1/2"
                    style={{ transform: `rotate(${angle}deg) translateX(calc(var(--eco-r))) rotate(${-angle}deg)` }}
                  >
                    <div className="eco-upright">
                      <div
                        onPointerEnter={() => !it.more && setActive(i)}
                        onPointerLeave={() => setActive(null)}
                        className={cn(
                          "group relative -translate-1/2 transition-transform duration-500 ease-(--ease-signal)",
                          on ? "scale-115" : active !== null ? "scale-90 opacity-60" : "",
                        )}
                      >
                        {it.more ? (
                          <span className="grid size-(--eco-tile) place-items-center rounded-[26%] border border-dashed border-line-strong bg-bg/60 text-center">
                            <span className="font-display text-[calc(var(--eco-tile)*0.22)] leading-none font-semibold">{it.name.split(" ")[0]}</span>
                          </span>
                        ) : (
                          <span
                            className={cn(
                              "relative block size-(--eco-tile) overflow-hidden rounded-[26%] shadow-[0_20px_50px_-15px_rgb(0_0_0/0.8)] ring-1 ring-white/15 transition-shadow duration-500",
                              on && "shadow-[0_0_0_3px_var(--color-cyan),0_20px_60px_-10px_rgb(79_227_255/0.6)]",
                            )}
                          >
                            <Image src={it.logo} alt={it.name} fill sizes="128px" className="object-cover" />
                          </span>
                        )}
                        <span
                          className={cn(
                            "eyebrow pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 whitespace-nowrap transition-opacity duration-300",
                            on || it.more ? "opacity-100" : "opacity-0",
                            it.more ? "text-muted" : "text-ink",
                          )}
                        >
                          {it.more ? "More apps" : it.name}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <p className="mx-auto mt-6 max-w-md text-center text-xs text-muted">{p.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}
