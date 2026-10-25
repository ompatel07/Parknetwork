import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Scramble } from "@/components/motion/Scramble";

/** The signature red LIVE indicator. Use sparingly. */
export function LiveBadge({ children = "Live", className }: { children?: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "eyebrow inline-flex items-center gap-2 rounded-full border border-live/35 bg-live/10 px-2.5 py-1.5 text-[0.66rem] text-[#ff8aa8]",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-live animate-live-pulse" />
      {children}
    </span>
  );
}

/** Broadcast-style section label: "CH.02 —— Services" */
export function ChannelLabel({
  channel,
  children,
  className,
  ...rest
}: {
  channel?: string;
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("eyebrow flex items-center gap-3 text-muted", className)} {...rest}>
      {channel && <span className="text-cyan">CH.{channel}</span>}
      <span aria-hidden className="h-px w-8 bg-line-strong" />
      {typeof children === "string" ? <Scramble text={children} /> : <span>{children}</span>}
    </p>
  );
}

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-line bg-white/[0.03] px-3 py-1 text-sm text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
