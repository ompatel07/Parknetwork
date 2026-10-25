import { Fragment } from "react";

/**
 * Splits text into masked words that rise in (CSS animation, server-rendered —
 * no layout shift, no JS needed). `offset` continues the stagger across lines.
 */
export function SplitWords({ text, offset = 0, className }: { text: string; offset?: number; className?: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <span className="rise-line">
            <span className={className ? `rise-word ${className}` : "rise-word"} style={{ ["--i" as string]: offset + i }}>
              {w}
            </span>
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </>
  );
}
