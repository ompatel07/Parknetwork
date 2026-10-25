import Image from "next/image";
import { photo, type PhotoKey } from "@/config/media";
import { cn } from "@/lib/cn";

/**
 * A photo from the media registry, filling its parent.
 * Blur placeholder + responsive sizes come for free.
 */
export function Photo({
  k,
  sizes,
  priority = false,
  eager = false,
  className,
  position,
}: {
  k: PhotoKey;
  /** Load immediately without a preload hint (e.g. slides that appear soon) */
  eager?: boolean;
  /** e.g. "(min-width: 1024px) 40vw, 90vw" */
  sizes: string;
  /** Above-the-fold image: load immediately at high priority */
  priority?: boolean;
  className?: string;
  /** object-position, e.g. "50% 30%" */
  position?: string;
}) {
  const p = photo(k);
  return (
    <Image
      src={p.src}
      alt={p.alt}
      fill
      sizes={sizes}
      loading={priority || eager ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      placeholder="blur"
      blurDataURL={p.blur}
      className={cn("object-cover", className)}
      style={position ? { objectPosition: position } : undefined}
    />
  );
}

/**
 * Framed photo that wipes open when scrolled into view (clip-path) and
 * drifts slightly against the scroll (parallax). Pure CSS + one shared
 * scroll controller — no per-image JS.
 */
export function Frame({
  k,
  sizes,
  className,
  imgClassName,
  priority,
  position,
  parallax = true,
  delay = 0,
  children,
}: {
  k: PhotoKey;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  position?: string;
  parallax?: boolean;
  delay?: number;
  children?: React.ReactNode;
}) {
  return (
    // The outer box is what the reveal observer watches (a fully clipped
    // element never counts as "visible"), the inner layer does the wipe.
    <div data-reveal="frame" data-liquid data-vskew className={cn("frame relative overflow-hidden", className)} style={{ ["--d" as string]: `${delay}s` }}>
      <div className="frame-clip absolute inset-0 overflow-hidden rounded-[inherit] bg-surface-2">
        <div className="frame-img absolute inset-x-0" {...(parallax ? { "data-parallax": "" } : {})}>
          <Photo k={k} sizes={sizes} priority={priority} position={position} className={imgClassName} />
        </div>
        {children}
      </div>
    </div>
  );
}
