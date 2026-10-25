import { useId } from "react";
import { ArrowUpRight } from "lucide-react";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { Magnetic } from "@/components/motion/Magnetic";
import { cn } from "@/lib/cn";

/** Big circular CTA with text orbiting around it. */
export function OrbitButton({
  href,
  label,
  orbit = "Apply now · Join the network · ",
  className,
}: {
  href: string;
  label: string;
  orbit?: string;
  className?: string;
}) {
  const pathId = `orbit-${useId().replace(/:/g, "")}`;
  return (
    <Magnetic strength={0.25}>
      <TransitionLink
        href={href}
        aria-label={label}
        data-cursor="Go"
        className={cn("group relative grid size-40 place-items-center md:size-52", className)}
      >
        <svg viewBox="0 0 200 200" aria-hidden className="orbit-text absolute inset-0 size-full">
          <defs>
            <path id={pathId} d="M100 100 m-82 0 a82 82 0 1 1 164 0 a82 82 0 1 1 -164 0" />
          </defs>
          <text className="fill-ink font-mono text-[13px] tracking-[0.32em] uppercase">
            <textPath href={`#${pathId}`}>{orbit.repeat(2)}</textPath>
          </text>
        </svg>
        <span className="grid size-[58%] place-items-center rounded-full bg-[linear-gradient(135deg,var(--color-violet),var(--color-signal)_55%,var(--color-cyan))] shadow-[0_20px_60px_-10px_rgb(124_92_255/0.8)] transition-transform duration-700 ease-(--ease-signal) group-hover:scale-110">
          <ArrowUpRight className="size-8 text-white transition-transform duration-700 ease-(--ease-signal) group-hover:rotate-45 md:size-10" />
        </span>
      </TransitionLink>
    </Magnetic>
  );
}
