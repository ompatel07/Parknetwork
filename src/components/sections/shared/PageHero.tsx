import type { ReactNode } from "react";
import type { SceneAlign, SceneName } from "@/components/world/store";
import type { PhotoKey } from "@/config/media";
import { ChannelLabel, LiveBadge } from "@/components/ui/Badges";
import { SplitChars } from "@/components/ui/SplitChars";
import { Frame } from "@/components/ui/Photo";
import { Meter } from "@/components/ui/Meter";
import { Timecode } from "@/components/motion/Timecode";
import { cn } from "@/lib/cn";

/** Monitor-style overlay for framed photos: corner brackets, cam label, tally. */
function MonitorUI({ cam, live = false }: { cam: string; live?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="viewfinder absolute inset-3" />
      <span
        className={cn(
          "absolute top-4 left-4 rounded-md px-2 py-1 font-mono text-[0.6rem] font-semibold tracking-wider",
          live ? "bg-live text-white" : "bg-bg/60 text-white/85",
        )}
      >
        {live ? "PGM" : "PVW"} · {cam}
      </span>
      {live && <Meter bars={5} className="absolute right-4 bottom-4" />}
    </div>
  );
}

/**
 * Inner-page hero: giant grotesk title + serif italic accent line, and
 * (optionally) a pair of framed photos styled as camera monitors.
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
  photos,
  compact = false,
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
  /** [main portrait, secondary landscape] */
  photos?: [PhotoKey, PhotoKey?];
  /** Smaller title for long headlines */
  compact?: boolean;
  children?: ReactNode;
}) {
  const [main, second] = photos ?? [];
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
        className="fade-up absolute inset-x-(--gutter) top-[calc(var(--header-h)+0.75rem)] z-10 flex items-center justify-between text-muted lg:top-28"
        style={{ ["--d" as string]: "0.4s" }}
      >
        <LiveBadge>Live</LiveBadge>
        <Timecode className="eyebrow text-ink/70" />
      </div>

      {/* Photo pair (desktop) */}
      {main && (
        <div aria-hidden className="pointer-events-none absolute top-[calc(var(--header-h)+4.5rem)] right-(--gutter) bottom-20 hidden w-[30vw] max-w-[30rem] lg:block">
          <Frame k={main} sizes="30vw" className="absolute top-0 right-0 aspect-[4/5] w-[78%] rounded-[1.75rem]" delay={0.5}>
            <MonitorUI cam="CAM 01" live />
          </Frame>
          {second && (
            <Frame k={second} sizes="20vw" className="absolute bottom-0 left-0 aspect-[16/11] w-[62%] rounded-[1.4rem] border-4 border-bg" delay={0.75}>
              <MonitorUI cam="CAM 02" />
            </Frame>
          )}
        </div>
      )}

      <div className="container-site relative">
        <ChannelLabel channel={channel} className="fade-up">
          {label}
        </ChannelLabel>
        <h1
          className={cn(
            "mt-8 font-display font-semibold tracking-[-0.045em] uppercase md:mt-10",
            compact
              ? "text-[clamp(2.3rem,0.5rem+5vw,6rem)] leading-[0.9] lg:max-w-[60vw]"
              : main
                ? "text-[clamp(2.9rem,0.4rem+7.6vw,8.6rem)] leading-[0.86] lg:max-w-[58vw]"
                : "text-[clamp(2.9rem,0.4rem+8.6vw,10rem)] leading-[0.86]",
          )}
        >
          <span className="block">
            <SplitChars text={title} />
          </span>
          {accent && (
            <span className="accent block text-[1.06em] leading-[0.95] normal-case">
              <SplitChars text={accent} offset={title.length} className="text-beam" />
            </span>
          )}
        </h1>

        {/* Photo (phones/tablets) */}
        {main && (
          <Frame k={main} sizes="94vw" className="mt-10 aspect-[16/10] rounded-[1.5rem] lg:hidden" delay={0.4}>
            <MonitorUI cam="CAM 01" live />
          </Frame>
        )}

        {(lead || children) && (
          <div className={cn("mt-10 grid gap-8 md:mt-14", main ? "lg:max-w-[58vw]" : "lg:grid-cols-12")}>
            {lead && (
              <p className={cn("fade-up max-w-xl text-lead text-muted", !main && "lg:col-span-6")} style={{ ["--d" as string]: "0.35s" }}>
                {lead}
              </p>
            )}
            {children && (
              <div className={cn("fade-up", !main && "lg:col-span-6 lg:flex lg:justify-end")} style={{ ["--d" as string]: "0.5s" }}>
                {children}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
