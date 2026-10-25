/**
 * Splits text into masked characters that rise in one after another
 * (CSS animation, server-rendered — no JS needed, no layout shift).
 */
export function SplitChars({ text, offset = 0, className }: { text: string; offset?: number; className?: string }) {
  const words = text.split(" ");
  let n = offset;
  return (
    <>
      {words.map((w, wi) => (
        <span key={wi} className="rise-line whitespace-nowrap">
          {Array.from(w).map((ch, ci) => (
            <span key={ci} className={className ? `rise-char ${className}` : "rise-char"} style={{ ["--i" as string]: n++ }}>
              {ch}
            </span>
          ))}
          {wi < words.length - 1 && <span className="inline-block w-[0.25em]" />}
        </span>
      ))}
    </>
  );
}
