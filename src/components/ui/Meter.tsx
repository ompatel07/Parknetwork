import { cn } from "@/lib/cn";

/** Little broadcast audio meter (CSS animated). */
export function Meter({ bars = 6, className }: { bars?: number; className?: string }) {
  return (
    <span aria-hidden className={cn("meter flex h-6 items-end gap-[3px]", className)}>
      {Array.from({ length: bars }, (_, i) => (
        <span key={i} className="h-full" style={{ ["--i" as string]: i }} />
      ))}
    </span>
  );
}
