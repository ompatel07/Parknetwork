import type { ReactNode } from "react";
import { TriangleAlert } from "lucide-react";
import { site } from "@/config/site";
import { PageHero } from "./PageHero";

export type LegalSection = { id: string; title: string; body: ReactNode };

/** Readable legal layout: sticky contents on desktop, clear review banner. */
export function LegalPage({
  channel,
  title,
  accent,
  lead,
  sections,
}: {
  channel: string;
  title: string;
  accent: string;
  lead: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHero channel={channel} label="Legal" title={title} accent={accent} lead={lead} scene="dust" dim={0.5} />
      <section className="relative bg-bg pb-(--section-y)">
        <div className="container-site">
          <p className="flex items-start gap-3 rounded-2xl border border-[#ffb547]/40 bg-[#ffb547]/10 px-5 py-4 text-sm text-[#ffd79a]">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>
              <strong className="font-semibold">TO BE REVIEWED BY CLIENT/LEGAL.</strong> This is placeholder text and is
              not legal advice. It must be reviewed for every country {site.name} operates in before launch.
            </span>
          </p>
          <div className="mt-14 grid gap-12 lg:grid-cols-12">
            <nav aria-label="Contents" className="lg:col-span-3">
              <div className="lg:sticky lg:top-32">
                <p className="eyebrow text-muted">Contents</p>
                <ol className="mt-4 space-y-1 border-l border-line">
                  {sections.map((s, i) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className="block py-1.5 pl-4 text-sm text-muted transition-colors hover:text-ink">
                        <span className="eyebrow mr-2 text-cyan">{String(i + 1).padStart(2, "0")}</span>
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
                <p className="eyebrow mt-8 text-muted">Last updated · {site.legal.lastUpdated}</p>
              </div>
            </nav>
            <article className="max-w-3xl space-y-14 lg:col-span-8 lg:col-start-5">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-28">
                  <h2 className="flex items-baseline gap-4 text-d3">
                    <span className="eyebrow text-cyan">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </h2>
                  <div className="mt-5 space-y-4 leading-relaxed text-ink/80 [&_a]:text-cyan [&_a]:underline [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">
                    {s.body}
                  </div>
                </section>
              ))}
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
