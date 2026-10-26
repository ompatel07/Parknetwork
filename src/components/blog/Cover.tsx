import Image from "next/image";
import { SignalMark } from "@/components/ui/SignalMark";
import { isOwnImage } from "@/lib/supabase/env";
import { cn } from "@/lib/cn";

/**
 * A post's cover. Images in our Supabase bucket go through next/image
 * (resized, AVIF/WebP); anything else is shown as-is. No cover → a branded
 * placeholder so cards never look broken.
 */
export function Cover({
  src,
  alt,
  sizes,
  priority,
  className,
}: {
  src: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        aria-hidden
        className={cn(
          "grid place-items-center bg-[radial-gradient(circle_at_30%_20%,rgb(124_92_255/0.45),transparent_55%),radial-gradient(circle_at_80%_90%,rgb(79_227_255/0.25),transparent_50%),var(--color-surface-2)]",
          className,
        )}
      >
        <SignalMark className="size-14 opacity-80" />
      </div>
    );
  }
  return (
    <div className={cn("relative overflow-hidden bg-surface-2", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={!isOwnImage(src)}
        className="object-cover transition-transform duration-1000 ease-(--ease-signal) group-hover:scale-[1.04]"
      />
    </div>
  );
}
