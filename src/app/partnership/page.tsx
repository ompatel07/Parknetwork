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
import { TiltCard } from "@/components/motion/TiltCard";
import { SmartForm } from "@/components/forms/SmartForm";

export const metadata: Metadata = {
  title: "Agency & Partnerships",
  description: "Register your agency or propose a business partnership with Park Live Network. Transparent terms and structured onboarding.",
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
        title="Build it"
        accent="together."
        lead="Register your agency or propose a business partnership. Transparent terms, structured onboarding and a dedicated contact."
        scene="rings"
        align="right"
      >
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Button href="#apply" size="lg" magnetic>
            Register your agency
          </Button>
          <Button href="#apply" size="lg" variant="ghost">
            Propose a partnership
          </Button>
        </div>
      </PageHero>

      <section data-scene="dust" data-scene-dim="0.3" className="relative py-(--section-y)">
        <div className="container-site">
          <SectionHeading channel="01" label="Why partner with us" title="Less chaos," accent="more signal." />
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b, i) => (
              <li key={b.title} data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
                <TiltCard max={5} className="h-full rounded-[1.75rem] border border-line bg-surface/80 p-7 backdrop-blur-sm md:p-8">
                  <span className="eyebrow text-cyan">0{i + 1}</span>
                  <span className="mt-10 grid size-14 place-items-center rounded-2xl bg-[linear-gradient(135deg,rgb(124_92_255/0.35),rgb(79_227_255/0.1))]">
                    <b.icon className="size-6 text-cyan" aria-hidden />
                  </span>
                  <h3 className="mt-8 text-h4 font-semibold">{b.title}</h3>
                  <p className="mt-3 text-muted">{b.text}</p>
                </TiltCard>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative bg-bg py-(--section-y)">
        <div className="container-site">
          <SectionHeading channel="02" label="The process" title="From hello" accent="to launch." />
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
                channel="03"
                label="Start here"
                title="Tell us"
                accent="about you."
                lead="Choose the form that fits. We reply through the contact details you share — usually within a few working days."
              />
            </div>
          </div>
          <div className="lg:col-span-8" data-reveal>
            <div className="rounded-[2rem] border border-line-strong bg-surface/90 p-6 backdrop-blur-md md:p-10">
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
            <SectionHeading channel="04" label="Partner FAQ" title="Fair" accent="questions." />
          </div>
          <div className="lg:col-span-7 lg:col-start-6" data-reveal>
            <Accordion items={site.faqs.filter((f) => f.category === "Agencies & partners")} />
          </div>
        </div>
      </section>

      <GoLive title="Let's" accent="build" lead="Prefer to talk first? Message us on WhatsApp and we'll set up a call." channel="05" />
    </>
  );
}
