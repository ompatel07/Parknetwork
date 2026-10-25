import { site } from "@/config/site";
import { Counter } from "@/components/motion/Counter";
import { cn } from "@/lib/cn";

/** "Company at a glance" — client-reported figures with a short note under each. */
export function GlanceStats({ className }: { className?: string }) {
  if (!site.stats.show) return null;
  return (
    <dl
      data-reveal
      className={cn("grid grid-cols-2 gap-px overflow-hidden rounded-panel border border-line bg-line lg:grid-cols-4", className)}
    >
      {site.stats.items.map((s, i) => (
        <div key={s.label} className="group relative flex flex-col gap-5 bg-bg/85 p-5 backdrop-blur-sm md:p-8">
          <span aria-hidden className="eyebrow order-1 flex items-center gap-3 text-cyan/80">
            0{i + 1}
            <span className="h-px flex-1 bg-line" />
          </span>
          <dt className="order-3">
            <span className="block font-medium text-ink">{s.label}</span>
            <span className="mt-1 block text-sm text-muted">{s.note}</span>
          </dt>
          <dd className="order-2 font-display text-[clamp(2.4rem,1.2rem+3.6vw,5.4rem)] leading-none font-semibold tracking-[-0.03em]">
            {s.text ? (
              <span className="accent text-beam">{s.text}</span>
            ) : (
              <>
                <Counter value={s.value} />
                <span className="accent text-beam">{s.suffix}</span>
              </>
            )}
          </dd>
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[linear-gradient(90deg,var(--color-violet),var(--color-cyan))] transition-transform duration-700 ease-(--ease-signal) group-hover:scale-x-100"
          />
        </div>
      ))}
    </dl>
  );
}
