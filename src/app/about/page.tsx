import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/config/site";
import { PageHero } from "@/components/sections/shared/PageHero";
import { GlobeSection } from "@/components/sections/shared/GlobeSection";
import { GlanceStats } from "@/components/sections/shared/GlanceStats";
import { Leadership } from "@/components/sections/shared/Leadership";
import { GoLive } from "@/components/sections/home/GoLive";
import { OnAirReel } from "@/components/sections/home/OnAirReel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ChannelLabel, LiveBadge } from "@/components/ui/Badges";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { Icon } from "@/components/ui/Icon";
import { Frame } from "@/components/ui/Photo";
import { TiltCard } from "@/components/motion/TiltCard";
import { ScrubText } from "@/components/motion/ScrubText";
import { PHOTOS } from "@/data/photos";

export const metadata: Metadata = {
  title: "About Us",
  description: site.about.paragraphs[0],
  alternates: { canonical: "/about" },
};

const MESH = [
  "radial-gradient(70% 80% at 90% 0%, rgb(124 92 255 / 0.45), transparent 70%), radial-gradient(60% 60% at 0% 100%, rgb(61 139 255 / 0.25), transparent 70%)",
  "radial-gradient(70% 80% at 10% 0%, rgb(79 227 255 / 0.25), transparent 70%), radial-gradient(60% 60% at 100% 100%, rgb(124 92 255 / 0.4), transparent 70%)",
];

export default function AboutPage() {
  const a = site.about;
  return (
    <>
      <PageHero
        channel="01"
        label="About Park Live Network"
        title={a.headline}
        accent={a.accent}
        lead={a.paragraphs[0]}
        compact
        scene="dust"
        dim={0.6}
        photos={["stage-speaker", "crowd-lights"]}
      />

      {/* Story + brand mark */}
      <section data-scene="dust" data-scene-dim="0.3" className="relative py-(--section-y)">
        <div className="container-site grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <ChannelLabel data-reveal>Who we are</ChannelLabel>
            <ScrubText
              className="mt-8 font-display text-[clamp(1.7rem,1rem+2.3vw,3.3rem)] leading-[1.1] font-medium tracking-[-0.02em]"
              text={a.paragraphs[1] ?? ""}
            />
            <p className="mt-8 max-w-2xl text-lead text-muted" data-reveal>
              {a.paragraphs[2]}
            </p>
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
                <Image src="/brand/logo-badge.jpeg" alt={`${site.name} logo`} fill sizes="(min-width: 1024px) 22rem, 70vw" className="scale-[1.02] object-cover" />
              </div>
              <LiveBadge className="absolute bottom-[6%] left-1/2 -translate-x-1/2 bg-bg/80 backdrop-blur">Our mark</LiveBadge>
            </div>
          </div>
        </div>
        <div className="container-site">
          <GlanceStats className="mt-20 md:mt-28" />
        </div>
      </section>

      {/* Mission & vision */}
      <section className="relative pb-(--section-y)">
        <div className="container-site grid gap-4 md:grid-cols-2">
          {[
            { k: "Vision", t: a.vision },
            { k: "Mission", t: a.mission },
          ].map((m, i) => (
            <div key={m.k} data-reveal style={{ ["--d" as string]: `${i * 0.1}s` }}>
              <TiltCard
                max={3}
                className="flex h-full min-h-[24rem] flex-col justify-between overflow-hidden rounded-[2rem] border border-line-strong bg-surface p-8 md:min-h-[30rem] md:p-12"
                style={{ backgroundImage: MESH[i] }}
              >
                <p className="eyebrow relative text-ink/80">0{i + 1} — Our {m.k.toLowerCase()}</p>
                <div className="relative">
                  <p className="font-display text-[clamp(3rem,1.6rem+4vw,6rem)] leading-none font-semibold tracking-[-0.04em] uppercase">{m.k}</p>
                  <p className="mt-6 max-w-md text-lead text-ink/85">{m.t}</p>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      </section>

      <Leadership channel="02" />

      {/* Global vision — editorial */}
      <section data-scene="globe" data-scene-align="right" data-scene-dim="0.5" className="relative overflow-hidden py-(--section-y)">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ChannelLabel channel="03" data-reveal>
              Our global vision
            </ChannelLabel>
            <RevealHeading title={a.globalVision.title} accent={a.globalVision.accent} breakAccent className="mt-8 text-d1 uppercase" />
            <div className="mt-10 space-y-5 text-lead text-muted">
              {a.globalVision.paragraphs.map((p, i) => (
                <p key={i} data-reveal style={{ ["--d" as string]: `${0.05 * i}s` }}>
                  {p}
                </p>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 lg:pt-24">
            <Frame k="night-friends" sizes="(min-width: 1024px) 38vw, 94vw" className="aspect-[4/5] rounded-[2rem]" />
          </div>
        </div>
        <div className="container-site mt-20 md:mt-28">
          <p
            className="font-display text-[clamp(2.2rem,0.8rem+5vw,7rem)] leading-[0.92] font-semibold tracking-[-0.04em] uppercase"
            data-reveal="scale"
          >
            {site.slogan.split(". ").map((part, i, arr) => (
              <span key={part} className="block">
                {i === 1 ? (
                  <span
                    className="photo-type"
                    style={{
                      backgroundImage: `url(/_next/image?url=${encodeURIComponent(PHOTOS["crowd-blue"].src)}&w=1920&q=75), linear-gradient(#f5f4fa,#f5f4fa)`,
                    }}
                  >
                    {part}.
                  </span>
                ) : (
                  <span className={i === 2 ? "accent normal-case text-beam" : undefined}>
                    {part}
                    {i < arr.length - 1 ? "." : ""}
                  </span>
                )}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* Trust & compliance */}
      <section className="relative border-y border-line bg-bg py-(--section-y)">
        <div className="container-site">
          <SectionHeading
            channel="04"
            label="Trust & compliance"
            title="Built on"
            accent="trust."
            lead="Clear standards for data, platform rules, creator safety and business transparency."
          />
          <ul className="mt-16 grid gap-px overflow-hidden rounded-[2rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {site.trust.map((t, i) => (
              <li
                key={t.title}
                className="group relative bg-bg p-7 transition-colors duration-500 hover:bg-surface md:p-9"
                data-reveal
                style={{ ["--d" as string]: `${i * 0.08}s` }}
              >
                <span className="eyebrow text-cyan">0{i + 1}</span>
                <span className="mt-10 grid size-14 place-items-center rounded-2xl bg-[linear-gradient(135deg,rgb(124_92_255/0.3),rgb(79_227_255/0.08))] transition-transform duration-700 ease-(--ease-signal) group-hover:-rotate-6 group-hover:scale-110">
                  <Icon name={t.icon} className="size-6 text-cyan" />
                </span>
                <h3 className="mt-8 text-h4 font-semibold">{t.title}</h3>
                <p className="mt-3 text-muted">{t.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Values */}
      <section data-scene="dust" data-scene-dim="0.25" className="relative bg-bg py-(--section-y)">
        <div className="container-site">
          <SectionHeading channel="05" label="What we're committed to" title="Our" accent="values." />
          <ul className="mt-14 border-t border-line">
            {site.values.map((v, i) => (
              <li key={v.title} data-reveal style={{ ["--d" as string]: `${i * 0.06}s` }}>
                <div className="group relative grid gap-3 border-b border-line py-8 md:grid-cols-12 md:items-center md:py-10">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-[linear-gradient(90deg,rgb(124_92_255/0.14),transparent)] transition-transform duration-700 ease-(--ease-signal) group-hover:scale-x-100"
                  />
                  <span className="eyebrow relative text-cyan md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="relative text-[clamp(2rem,1rem+3.4vw,5rem)] leading-none md:col-span-7">
                    <span className="roll">
                      <span className="font-display font-semibold tracking-[-0.035em] uppercase">{v.title}</span>
                      <span className="accent text-beam" aria-hidden>
                        {v.title}
                      </span>
                    </span>
                  </h3>
                  <p className="relative max-w-md text-muted md:col-span-4">{v.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <OnAirReel channel="06" />

      <GlobeSection
        channel="07"
        title="Where we"
        accent="operate."
        lead="Teams and network relationships spanning multiple countries, supporting cross-border collaboration."
      />

      <GoLive title="Let's" accent="talk" channel="08" />
    </>
  );
}
