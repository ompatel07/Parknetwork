"use client";

import { useState } from "react";
import { site } from "@/config/site";
import { media } from "@/config/media";
import { ChannelLabel } from "@/components/ui/Badges";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { Photo } from "@/components/ui/Photo";
import { cn } from "@/lib/cn";

/**
 * Why choose us — five photo panels; the active one expands to tell its
 * story. Desktop: side by side (hover). Mobile: stacked (tap).
 */
export function WhyChoose({ channel = "04" }: { channel?: string }) {
  const items = site.whyChoose;
  const [active, setActive] = useState(0);

  return (
    <section data-scene="dust" data-scene-dim="0.2" className="relative py-(--section-y)">
      <div className="container-site">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <ChannelLabel channel={channel} data-reveal>
              Why choose us
            </ChannelLabel>
            <RevealHeading title="Why platforms" accent="choose Park Live." breakAccent delay={0.05} className="mt-8 text-d1 uppercase" />
          </div>
          <p className="max-w-md text-lead text-muted lg:col-span-4 lg:col-start-9" data-reveal style={{ ["--d" as string]: "0.1s" }}>
            {site.about.commitment}
          </p>
        </div>

        <ul
          className="mt-14 flex h-[42rem] flex-col gap-2 md:mt-20 lg:h-[min(76svh,42rem)] lg:flex-row lg:gap-3"
          data-reveal
          style={{ ["--d" as string]: "0.1s" }}
        >
          {items.map((it, i) => {
            const on = active === i;
            return (
              <li
                key={it.title}
                className={cn(
                  "relative min-h-0 min-w-0 transition-[flex-grow,flex-basis] duration-700 ease-(--ease-signal)",
                  on ? "flex-[1_1_0%] lg:flex-[5_1_0%]" : "flex-[0_0_4.75rem] lg:flex-[1_1_0%]",
                )}
              >
                <button
                  type="button"
                  aria-expanded={on}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="group relative block size-full overflow-hidden rounded-[1.4rem] bg-surface text-left md:rounded-[1.75rem]"
                >
                  <Photo
                    k={media.why[i] ?? "team-table"}
                    sizes="(min-width: 1024px) 60vw, 94vw"
                    className={cn("transition-[filter,transform] duration-1000 ease-(--ease-signal)", on ? "scale-100" : "scale-110 grayscale brightness-[0.45]")}
                  />
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-0 transition-opacity duration-700",
                      "bg-[linear-gradient(to_top,rgb(7_6_13/0.92),rgb(7_6_13/0.25)_55%,rgb(7_6_13/0.35))]",
                    )}
                  />

                  <span className="absolute top-4 left-5 flex items-center gap-3 md:top-6 md:left-6">
                    <span className={cn("eyebrow transition-colors", on ? "text-cyan" : "text-white/70")}>0{i + 1}</span>
                    {on && <span className="size-1.5 rounded-full bg-live animate-live-pulse" />}
                  </span>

                  {/* collapsed title: horizontal on phones, vertical on desktop */}
                  <span
                    className={cn(
                      "absolute font-display font-semibold text-white uppercase transition-opacity duration-500",
                      "top-1/2 right-5 left-14 -translate-y-1/2 line-clamp-2 text-[0.95rem] leading-tight sm:text-base",
                      "lg:top-auto lg:right-auto lg:bottom-6 lg:left-1/2 lg:-translate-x-1/2 lg:translate-y-0 lg:text-lg lg:[writing-mode:vertical-rl] lg:rotate-180",
                      on ? "opacity-0" : "opacity-100",
                    )}
                  >
                    {it.title}
                  </span>

                  {/* expanded story */}
                  <span
                    className={cn(
                      "absolute inset-x-5 bottom-5 block transition-[opacity,transform] duration-700 ease-(--ease-signal) md:inset-x-8 md:bottom-8",
                      on ? "translate-y-0 opacity-100 delay-200" : "pointer-events-none translate-y-6 opacity-0",
                    )}
                  >
                    <span className="block max-w-xl font-display text-[clamp(1.6rem,1rem+2vw,3rem)] leading-[0.95] font-semibold tracking-[-0.02em] uppercase">
                      {it.title}
                    </span>
                    <span className="mt-3 block max-w-md text-white/80">{it.text}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
