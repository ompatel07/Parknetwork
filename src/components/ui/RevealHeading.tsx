import { Fragment, type ElementType } from "react";
import { cn } from "@/lib/cn";

function Words({ text, start, className }: { text: string; start: number; className?: string }) {
  const words = text.split(" ").filter(Boolean);
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <span className="rl">
            <span className={cn("rw", className)} style={{ ["--i" as string]: start + i }}>
              {w}
            </span>
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </>
  );
}

/**
 * Heading whose words rise out of masks when scrolled into view.
 * `accent` renders in the serif italic gradient, optionally on its own line.
 */
export function RevealHeading({
  title,
  accent,
  as: Tag = "h2",
  breakAccent = false,
  className,
  delay = 0,
}: {
  title: string;
  accent?: string;
  as?: ElementType;
  breakAccent?: boolean;
  className?: string;
  delay?: number;
}) {
  const n = title.split(" ").filter(Boolean).length;
  return (
    <Tag data-reveal="words" className={className} style={{ ["--d" as string]: `${delay}s` }}>
      <Words text={title} start={0} />
      {accent && (
        <>
          {breakAccent ? <br /> : " "}
          <span className="accent normal-case">
            <Words text={accent} start={n} className="text-beam" />
          </span>
        </>
      )}
    </Tag>
  );
}
