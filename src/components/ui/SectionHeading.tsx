import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ChannelLabel } from "./Badges";

/** Channel label + uppercase heading with a serif italic accent + optional lead. Reveals on scroll. */
export function SectionHeading({
  channel,
  label,
  title,
  accent,
  lead,
  align = "left",
  className,
  children,
}: {
  channel?: string;
  label: string;
  title: string;
  accent?: string;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}) {
  const center = align === "center";
  return (
    <div className={cn(center && "mx-auto flex flex-col items-center text-center", className)}>
      <ChannelLabel channel={channel} data-reveal>
        {label}
      </ChannelLabel>
      <h2 className={cn("mt-8 text-d1 uppercase", center ? "max-w-[16ch]" : "max-w-[14ch]")} data-reveal style={{ ["--d" as string]: "0.05s" }}>
        {title} {accent && <span className="accent normal-case text-beam">{accent}</span>}
      </h2>
      {lead && (
        <p className="mt-6 max-w-xl text-lead text-muted" data-reveal style={{ ["--d" as string]: "0.1s" }}>
          {lead}
        </p>
      )}
      {children && (
        <div className="mt-8" data-reveal style={{ ["--d" as string]: "0.15s" }}>
          {children}
        </div>
      )}
    </div>
  );
}
