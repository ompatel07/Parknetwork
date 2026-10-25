import { TransitionLink } from "@/components/motion/TransitionLink";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";
import { SignalMark } from "./SignalMark";

/** Logo lockup for dark backgrounds: signal mark + "PARK / LIVE NETWORK". */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <TransitionLink
      href="/"
      aria-label={`${site.name} — home`}
      className={cn("group inline-flex items-center gap-2.5 rounded-lg", className)}
    >
      <SignalMark className="size-9 transition-transform duration-500 ease-(--ease-signal) group-hover:scale-110 md:size-10" animated />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[1.35rem] font-bold tracking-[-0.02em] md:text-[1.5rem]">
            P<span className="text-signal">A</span>RK
          </span>
          <span className="mt-0.5 text-[0.56rem] font-semibold tracking-[0.32em] text-muted md:text-[0.6rem]">
            LIVE NETWORK
          </span>
        </span>
      )}
    </TransitionLink>
  );
}
