import type { Metadata } from "next";
import Image from "next/image";
import { HeartHandshake, MessagesSquare, ShieldCheck, Workflow } from "lucide-react";
import { site } from "@/config/site";
import { PageHero } from "@/components/sections/shared/PageHero";
import { GlobeSection } from "@/components/sections/shared/GlobeSection";
import { GoLive } from "@/components/sections/home/GoLive";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ChannelLabel, LiveBadge } from "@/components/ui/Badges";
import { TiltCard } from "@/components/motion/TiltCard";
import { ScrubText } from "@/components/motion/ScrubText";

export const metadata: Metadata = {
  title: "About Us",
  description: `Who we are, what we do and where we operate — the team behind ${site.name}.`,
  alternates: { canonical: "/about" },
};

/* PLACEHOLDER copy — client to confirm before launch */
const PRINCIPLES = [
  { icon: HeartHandshake, title: "People first", text: "Every host, agency and partner has a named contact — not a ticket number." },
  { icon: Workflow, title: "Clear processes", text: "Applications, onboarding and reviews follow written steps, so everyone knows what happens next." },
  { icon: ShieldCheck, title: "Verified & safe", text: "Age and identity checks, community guidelines and active moderation protect every room." },
  { icon: MessagesSquare, title: "Always reachable", text: "WhatsApp, email and support forms — with replies from real people on our team." },
];

const VALUES = [
  { title: "Transparency", text: "Terms in writing, no hidden fees and no promises we can't keep." },
  { title: "Respect", text: "Every voice in every room deserves a respectful, welcoming space." },
  { title: "Safety", text: "Verified adults only, clear rules and fast action on reports." },
  { title: "Reliability", text: "We show up, follow through and keep communities running." },
  { title: "Growth", text: "Training and support so people can build on their skills." },
];

const MESH = [
  "radial-gradient(70% 80% at 90% 0%, rgb(124 92 255 / 0.45), transparent 70%), radial-gradient(60% 60% at 0% 100%, rgb(61 139 255 / 0.25), transparent 70%)",
  "radial-gradient(70% 80% at 10% 0%, rgb(79 227 255 / 0.25), transparent 70%), radial-gradient(60% 60% at 100% 100%, rgb(124 92 255 / 0.4), transparent 70%)",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        channel="01"
        label="About us"
        title="The team"
        accent="behind the signal."
        lead={`${site.name} supports hosts, agencies and partners across live streaming and audio chat — with clear processes and real people behind every step.`}
        scene="mark"
        align="right"
      />

      {/* Story + brand mark */}
      <section data-scene="dust" data-scene-dim="0.3" className="relative py-(--section-y)">
        <div className="container-site grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <ChannelLabel data-reveal>Who we are</ChannelLabel>
            <ScrubText
              className="mt-8 font-display text-[clamp(1.8rem,1rem+2.6vw,3.6rem)] leading-[1.08] font-medium tracking-[-0.02em]"
              text="We're the people behind the scenes — recruiting and supporting hosts, coordinating agencies, working with approved coin sellers and building partnerships that help live communities grow responsibly."
            />
          </div>
          <div className="lg:col-span-5" data-reveal="scale">
            <div className="relative mx-auto aspect-square w-[min(26rem,82vw)]">
              <svg aria-hidden viewBox="0 0 200 200" fill="none" className="viz absolute inset-0 size-full">
                <g className="spin">
                  <circle cx="100" cy="100" r="98" stroke="#7C5CFF" strokeOpacity="0.5" strokeWidth="0.4" strokeDasharray="1 5" />
                  <circle cx="198" cy="100" r="2.5" fill="#4FE3FF" />
                </g>
                <g className="spin-rev">
                  <circle cx="100" cy="100" r="88" stroke="#3D8BFF" strokeOpacity="0.35" strokeWidth="0.4" />
                  <circle cx="12" cy="100" r="2" fill="#7C5CFF" />
                </g>
              </svg>
              <div className="absolute inset-[13%] overflow-hidden rounded-full shadow-[0_0_90px_-10px_rgb(124_92_255/0.6)] ring-1 ring-white/10">
                <Image
                  src="/brand/logo-badge.jpeg"
                  alt={`${site.name} logo`}
                  fill
                  sizes="(min-width: 1024px) 22rem, 70vw"
                  className="scale-[1.02] object-cover"
                />
              </div>
              <LiveBadge className="absolute bottom-[6%] left-1/2 -translate-x-1/2 bg-bg/80 backdrop-blur">Our mark</LiveBadge>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & vision */}
      <section className="relative pb-(--section-y)">
        <div className="container-site grid gap-4 md:grid-cols-2">
          {[
            { k: "Mission", t: "To give every live community the people, structure and support it needs to thrive — safely and transparently." },
            { k: "Vision", t: "A trusted network where hosts, agencies and partners across borders grow together with confidence." },
          ].map((m, i) => (
            <div key={m.k} data-reveal style={{ ["--d" as string]: `${i * 0.1}s` }}>
              <TiltCard
                max={3}
                className="flex h-full min-h-[24rem] flex-col justify-between overflow-hidden rounded-[2rem] border border-line-strong bg-surface p-8 md:min-h-[30rem] md:p-12"
                style={{ backgroundImage: MESH[i] }}
              >
                <p className="eyebrow relative text-ink/80">0{i + 1} — Our {m.k.toLowerCase()}</p>
                <div className="relative">
                  <p className="font-display text-[clamp(3rem,1.6rem+4vw,6rem)] leading-none font-semibold tracking-[-0.04em] uppercase">
                    {m.k}
                  </p>
                  <p className="mt-6 max-w-md text-lead text-ink/85">{m.t}</p>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      </section>

      {/* How we operate */}
      <section className="relative border-y border-line bg-bg py-(--section-y)">
        <div className="container-site">
          <SectionHeading
            channel="02"
            label="How we operate"
            title="Simple promises,"
            accent="kept daily."
            lead="Our operating model is built on four principles that guide every application, onboarding and support request."
          />
          <ul className="mt-16 grid gap-px overflow-hidden rounded-[2rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p, i) => (
              <li
                key={p.title}
                className="group relative bg-bg p-7 transition-colors duration-500 hover:bg-surface md:p-9"
                data-reveal
                style={{ ["--d" as string]: `${i * 0.08}s` }}
              >
                <span className="eyebrow text-cyan">0{i + 1}</span>
                <span className="mt-10 grid size-14 place-items-center rounded-2xl bg-[linear-gradient(135deg,rgb(124_92_255/0.3),rgb(79_227_255/0.08))] transition-transform duration-700 ease-(--ease-signal) group-hover:-rotate-6 group-hover:scale-110">
                  <p.icon className="size-6 text-cyan" aria-hidden />
                </span>
                <h3 className="mt-8 text-h4 font-semibold">{p.title}</h3>
                <p className="mt-3 text-muted">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <GlobeSection
        channel="03"
        title="Where we"
        accent="operate."
        lead="We currently support communities in these countries. Not listed? Get in touch — we may still be able to help."
      />

      {/* Values */}
      <section data-scene="dust" data-scene-dim="0.25" className="relative bg-bg py-(--section-y)">
        <div className="container-site">
          <SectionHeading channel="04" label="Our values" title="What we" accent="stand for." />
          <ul className="mt-14 border-t border-line">
            {VALUES.map((v, i) => (
              <li key={v.title} data-reveal style={{ ["--d" as string]: `${i * 0.06}s` }}>
                <div className="group relative grid gap-3 border-b border-line py-8 md:grid-cols-12 md:items-center md:py-10">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-[linear-gradient(90deg,rgb(124_92_255/0.14),transparent)] transition-transform duration-700 ease-(--ease-signal) group-hover:scale-x-100"
                  />
                  <span className="eyebrow relative text-cyan md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="relative text-[clamp(2.4rem,1.2rem+4vw,6rem)] leading-none md:col-span-6">
                    <span className="roll">
                      <span className="font-display font-semibold tracking-[-0.035em] uppercase">{v.title}</span>
                      <span className="accent text-beam" aria-hidden>
                        {v.title}
                      </span>
                    </span>
                  </h3>
                  <p className="relative max-w-md text-muted md:col-span-5">{v.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <GoLive title="Let's" accent="talk" lead="Whether you're a host, an agency or a business — we'd love to hear from you." channel="05" />
    </>
  );
}
