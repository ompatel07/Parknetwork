import type { Metadata } from "next";
import { site, type FaqCategory } from "@/config/site";
import { PageHero } from "@/components/sections/shared/PageHero";
import { GoLive } from "@/components/sections/home/GoLive";
import { Accordion } from "@/components/ui/Accordion";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about applying, verification, agencies, coin sellers, support and safety at Park Live Network.",
  alternates: { canonical: "/faq" },
};

const ORDER: FaqCategory[] = ["General", "Applying", "Agencies & partners", "Support & safety"];
const slug = (c: string) => c.toLowerCase().replace(/[^a-z]+/g, "-");

export default function FaqPage() {
  const groups = ORDER.map((c) => ({ c, items: site.faqs.filter((f) => f.category === c) })).filter((g) => g.items.length);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: site.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        channel="06"
        label="FAQ"
        title="Questions,"
        accent="answered."
        lead="Everything you might want to know about applying, verification, agencies and support."
        scene="dust"
        dim={0.6}
        photos={["mic-pink", "on-air-side"]}
      />

      <section className="relative bg-bg py-(--section-y)">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <nav aria-label="FAQ categories" className="lg:col-span-3">
            <ul className="no-scrollbar -mx-(--gutter) flex gap-2 overflow-x-auto px-(--gutter) lg:sticky lg:top-32 lg:mx-0 lg:flex-col lg:px-0">
              {groups.map((g, i) => (
                <li key={g.c}>
                  <a
                    href={`#${slug(g.c)}`}
                    className="group flex items-center gap-3 rounded-full border border-line px-4 py-2.5 text-sm whitespace-nowrap text-muted transition-colors hover:border-cyan/40 hover:text-ink lg:rounded-none lg:border-0 lg:border-b lg:px-0 lg:py-4"
                  >
                    <span className="eyebrow text-cyan">0{i + 1}</span>
                    {g.c}
                    <span className="eyebrow ml-auto hidden text-muted/60 lg:inline">{g.items.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-20 lg:col-span-8 lg:col-start-5">
            {groups.map((g) => (
              <div key={g.c} id={slug(g.c)} className="scroll-mt-28" data-reveal>
                <h2 className="text-d3 uppercase">{g.c}</h2>
                <Accordion items={g.items} defaultOpen={null} className="mt-6" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <GoLive title="Still" accent="curious" lead="Our team is happy to answer anything else — message us any time." channel="07" />
    </>
  );
}
