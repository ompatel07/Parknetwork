import { cn } from "@/lib/cn";

/** Numbered process steps: horizontal with a signal line on desktop, vertical on phones. */
export function StepsRow({ steps, className }: { steps: { title: string; text: string }[]; className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <div
        aria-hidden
        className="absolute top-[1.6rem] right-[12%] left-[1.6rem] hidden h-px bg-[linear-gradient(90deg,var(--color-violet),var(--color-cyan),transparent)] lg:block"
      />
      <div aria-hidden className="absolute top-4 bottom-4 left-[1.6rem] w-px bg-line lg:hidden" />
      <ol className="relative grid gap-10 md:gap-6 lg:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.title} className="relative flex gap-6 lg:block" data-reveal style={{ ["--d" as string]: `${i * 0.1}s` }}>
            <span className="relative z-10 grid size-[3.2rem] shrink-0 place-items-center rounded-full border border-line-strong bg-bg font-display font-semibold shadow-[0_0_0_6px_var(--color-bg)]">
              <span className="text-beam">{String(i + 1).padStart(2, "0")}</span>
            </span>
            <div className="lg:mt-8 lg:pr-6">
              <h3 className="text-h4 font-semibold">{s.title}</h3>
              <p className="mt-3 text-muted">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
