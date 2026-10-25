import type { ReactNode } from "react";
import type { SceneAlign, SceneName } from "@/components/world/store";
import { ChannelLabel, LiveBadge } from "@/components/ui/Badges";
import { SplitChars } from "@/components/ui/SplitChars";
import { Timecode } from "@/components/motion/Timecode";

/**
 * Inner-page hero: giant grotesk title + serif italic accent line,
 * over a particle scene chosen per page.
 */
export function PageHero({
  channel,
  label,
  title,
  accent,
  lead,
  scene = "dust",
  align = "right",
  dim = 1,
  children,
}: {
  channel: string;
  label: string;
  title: string;
  accent?: string;
  lead?: string;
  scene?: SceneName;
  align?: SceneAlign;
  dim?: number;
  children?: ReactNode;
}) {
  return (
    <section
      data-scene={scene}
      data-scene-align={align}
      data-scene-dim={dim}
      className="relative flex min-h-[94svh] flex-col justify-end overflow-hidden pt-[calc(var(--header-h)+7rem)] pb-12 md:min-h-[92svh] md:pb-20"
    >
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(110%_70%_at_20%_100%,rgb(7_6_13/0.9),transparent_65%)]" />

      <div
        aria-hidden
        className="fade-up absolute inset-x-(--gutter) top-[calc(var(--header-h)+0.75rem)] flex items-center justify-between text-muted lg:top-28"
        style={{ ["--d" as string]: "0.4s" }}
      >
        <LiveBadge>Live</LiveBadge>
        <Timecode className="eyebrow text-ink/70" />
      </div>

      <div className="container-site relative">
        <ChannelLabel channel={channel} className="fade-up">
          {label}
        </ChannelLabel>
        <h1 className="mt-8 font-display text-[clamp(2.9rem,0.4rem+8.6vw,10rem)] leading-[0.86] font-semibold tracking-[-0.045em] uppercase md:mt-10">
          <span className="block">
            <SplitChars text={title} />
          </span>
          {accent && (
            <span className="accent block text-[1.06em] leading-[0.95] normal-case">
              <SplitChars text={accent} offset={title.length} className="text-beam" />
            </span>
          )}
        </h1>
        {(lead || children) && (
          <div className="mt-10 grid gap-8 md:mt-14 lg:grid-cols-12">
            {lead && (
              <p className="fade-up max-w-xl text-lead text-muted lg:col-span-6" style={{ ["--d" as string]: "0.35s" }}>
                {lead}
              </p>
            )}
            {children && (
              <div className="fade-up lg:col-span-6 lg:flex lg:justify-end" style={{ ["--d" as string]: "0.5s" }}>
                {children}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
