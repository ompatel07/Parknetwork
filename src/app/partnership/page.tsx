import type { Metadata } from "next";
import { Check, FileText, Handshake, Info, Rocket, UserRoundCheck } from "lucide-react";
import { site } from "@/config/site";
import { PageHero } from "@/components/sections/shared/PageHero";
import { StepsRow } from "@/components/sections/shared/StepsRow";
import { GoLive } from "@/components/sections/home/GoLive";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { SmartForm } from "@/components/forms/SmartForm";
import { Ecosystem } from "@/components/sections/shared/Ecosystem";
import { media } from "@/config/media";
import { Frame } from "@/components/ui/Photo";

export const metadata: Metadata = {
  title: "Agency & Partnerships",
  description: "Partnership opportunities with Park Live Network for application owners, agencies, investors and creators. Transparent terms and structured onboarding.",
  alternates: { canonical: "/partnership" },
};

/* PLACEHOLDER copy — client to confirm */
const BENEFITS = [
  { icon: Rocket, title: "Structured onboarding", text: "A clear, written onboarding plan so your team knows exactly what happens and when." },
  { icon: FileText, title: "Transparent terms", text: "Every rule, fee or commercial term agreed in writing before anything starts." },
  { icon: UserRoundCheck, title: "Dedicated contact", text: "One named person on our side who knows your agency and answers quickly." },
  { icon: Handshake, title: "Shared standards", text: "Safety, verification and community guidelines we uphold together." },
];

const STEPS = [
  { title: "Enquire", text: "Send the registration or partnership form below. It takes about five minutes." },
  { title: "Review", text: "Our team reviews your details and arranges a call to understand your goals." },
  { title: "Agreement", text: "We agree on guidelines, responsibilities and any terms — in writing." },
  { title: "Launch", text: "Onboarding, training and a dedicated contact as you go live with us." },
];

const ELIGIBLE = [
  "Registered or established agencies and teams",
  "Members and staff aged 18 or older",
  "Commitment to our community and safety guidelines",
  "Operating in a country we currently support",
];
const COMMITMENTS = [
  "Clear written terms before anything starts",
  "Timely, honest communication",
  "Fair treatment of every host and agency",
  "Protection of the personal data you share",
];

export default function PartnershipPage() {
  return (
    <>
      <PageHero
        channel="04"
        label="Agency & partnerships"
        title="Partner"
        accent="with us."
        lead="For application owners, platform operators, agencies, investors and creators — transparent terms, structured onboarding and a dedicated contact."
        scene="rings"
        align="left"
        dim={0.5}
        photos={["handshake", "team-meeting"]}
      >
        <div className="flex flex-wrap gap-3">
          <Button href="#apply" size="lg" magnetic>
            Propose a partnership
          </Button>
          <Button href="#apply" size="lg" variant="ghost">
            Register your agency
          </Button>
        </div>
      </PageHero>

      {/* Partnership opportunities */}
      <section data-scene="dust" data-scene-dim="0.3" className="relative py-(--section-y)">
        <div className="container-site">
          <SectionHeading
            channel="01"
            label="Partnership opportunities"
            title="Who we"
            accent="partner with."
            lead="Long-term relationships with the people who build, run and grow digital platforms."
          />
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {site.audiences.map((au, i) => (
              <li key={au.title} className="group rounded-[1.9rem] border border-line bg-surface/80 p-2.5 transition-colors duration-500 hover:border-line-strong">
                <Frame k={media.audiences[i] ?? "team-table"} sizes="(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 94vw" className="aspect-[4/3] rounded-[1.5rem]" delay={i * 0.08}>
                  <span className="eyebrow absolute top-4 left-4 rounded-md bg-bg/60 px-2 py-1 text-white/90">0{i + 1}</span>
                </Frame>
                <div className="p-5">
                  <h3 className="text-h4 font-semibold">{au.title}</h3>
                  <p className="mt-2 text-muted">{au.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <ul className="mt-4 grid gap-px overflow-hidden rounded-[1.75rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((bn, i) => (
              <li key={bn.title} className="flex gap-4 bg-bg/90 p-6" data-reveal style={{ ["--d" as string]: `${i * 0.06}s` }}>
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,rgb(124_92_255/0.35),rgb(79_227_255/0.1))]">
                  <bn.icon className="size-5 text-cyan" aria-hidden />
                </span>
                <span>
                  <span className="block font-semibold">{bn.title}</span>
                  <span className="mt-1 block text-sm text-muted">{bn.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Ecosystem channel="02" />

      <section className="relative bg-bg py-(--section-y)">
        <div className="container-site">
          <SectionHeading channel="03" label="The process" title="From hello" accent="to launch." />
          <StepsRow steps={STEPS} className="mt-16" />
        </div>
      </section>

      <section className="relative bg-bg pb-(--section-y)">
        <div className="container-site grid gap-4 lg:grid-cols-2">
          {[
            { k: "Who we partner with", items: ELIGIBLE },
            { k: "What we commit to", items: COMMITMENTS },
          ].map((col, i) => (
            <div key={col.k} className="rounded-[2rem] border border-line bg-surface p-8 md:p-12" data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
              <p className="eyebrow text-cyan">0{i + 1}</p>
              <h3 className="mt-6 text-d3 uppercase">{col.k}</h3>
              <ul className="mt-8 space-y-4">
                {col.items.map((x) => (
                  <li key={x} className="flex items-start gap-3 border-b border-line pb-4 last:border-0">
                    <Check className="mt-0.5 size-5 shrink-0 text-cyan" aria-hidden />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="flex items-start gap-3 rounded-2xl border border-line bg-white/[0.02] px-6 py-5 text-sm text-muted lg:col-span-2" data-reveal>
            <Info className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden />
            We never promise guaranteed earnings, income or outcomes. Any fees, commissions or payout terms are shared in
            writing before you agree to anything.
          </p>
        </div>
      </section>

      <section id="apply" data-scene="rings" data-scene-dim="0.3" className="relative scroll-mt-24 py-(--section-y)">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <SectionHeading
                channel="04"
                label="Start here"
                title="Tell us"
                accent="about you."
                lead="Choose the form that fits. We reply through the contact details you share — usually within a few working days."
              />
            </div>
          </div>
          <div className="lg:col-span-8" data-reveal>
            <div className="rounded-[2rem] border border-line-strong bg-surface/90 p-6 md:p-10">
              <Tabs
                tabs={[
                  { id: "agency", label: "Agency registration", content: <SmartForm type="agency" /> },
                  { id: "partnership", label: "Business partnership", content: <SmartForm type="partnership" /> },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-bg py-(--section-y)">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading channel="05" label="Partner FAQ" title="Fair" accent="questions." />
          </div>
          <div className="lg:col-span-7 lg:col-start-6" data-reveal>
            <Accordion items={site.faqs.filter((f) => f.category === "Agencies & partners")} />
          </div>
        </div>
      </section>

      <GoLive title="Let's" accent="build" lead="Prefer to talk first? Message us on WhatsApp and we'll set up a call." channel="06" />
    </>
  );
}
