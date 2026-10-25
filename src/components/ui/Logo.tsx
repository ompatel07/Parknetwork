import Image from "next/image";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";

/** The official round badge, as an image. */
export function LogoBadge({ className, priority = false, sizes = "48px" }: { className?: string; priority?: boolean; sizes?: string }) {
  return (
    <span className={cn("relative block shrink-0 overflow-hidden rounded-full", className)}>
      <Image src="/brand/logo.png" alt="" fill sizes={sizes} priority={priority} className="object-contain" />
    </span>
  );
}

/** Logo lockup: official badge + "PARK / LIVE NETWORK" wordmark (light, for dark backgrounds). */
export function Logo({ className, compact = false, priority = false }: { className?: string; compact?: boolean; priority?: boolean }) {
  return (
    <TransitionLink href="/" aria-label={`${site.name} — home`} className={cn("group inline-flex items-center gap-2.5 rounded-full", className)}>
      <LogoBadge
        priority={priority}
        className="size-10 shadow-[0_0_0_1px_rgb(255_255_255/0.12),0_8px_24px_-8px_rgb(61_139_255/0.6)] transition-transform duration-500 ease-(--ease-signal) group-hover:scale-110 group-hover:rotate-[-8deg] md:size-11"
      />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[1.3rem] font-bold tracking-[-0.02em] md:text-[1.45rem]">
            P<span className="text-signal">A</span>RK
          </span>
          <span className="mt-0.5 text-[0.55rem] font-semibold tracking-[0.3em] text-muted md:text-[0.6rem]">LIVE NETWORK</span>
        </span>
      )}
    </TransitionLink>
  );
}
