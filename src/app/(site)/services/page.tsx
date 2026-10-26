import type { Metadata } from "next";
import { pageMeta, breadcrumbs } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Check } from "lucide-react";
import { site, type Service } from "@/config/site";
import { PageHero } from "@/components/sections/shared/PageHero";
import { Countdown } from "@/components/sections/home/Countdown";
import { Ecosystem } from "@/components/sections/shared/Ecosystem";
import { GoLive } from "@/components/sections/home/GoLive";
import { ServiceVisual } from "@/components/sections/home/ServiceVisual";
import { LiveRoom } from "@/components/sections/home/LiveRoom";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Frame } from "@/components/ui/Photo";
import { Meter } from "@/components/ui/Meter";
import { media } from "@/config/media";
import { cn } from "@/lib/cn";

export const metadata: Metadata = pageMeta({
  title: "Live Streaming & Audio Chat Room Management Services",
  description:
    "Live streaming management, audio chat room management, dating & social apps, short-video platforms and agency network management — digital entertainment platform services worldwide.",
  path: "/services",
});

/** Where each service's main call-to-action should lead */
const NEXT: Record<string, { label: string; href: string }> = {
  "live-streaming": { label: "Partner with us", href: "/partnership" },
  "audio-chat": { label: "Become a host", href: "/careers?apply=live-host" },
  "dating-social": { label: "Partner with us", href: "/partnership" },
  "short-video": { label: "Partner with us", href: "/partnership" },
  "app-agency-network": { label: "Register your agency", href: "/partnership" },
};

function ServiceBlock({ s, i }: { s: Service; i: number }) {
  const flip = i % 2 === 1;
  const next = NEXT[s.slug] ?? { label: "Get in touch", href: "/contact" };
  return (
    <section id={s.slug} className="scroll-mt-28 border-t border-line py-16 md:py-28">
      <div className="container-site grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className={cn("relative lg:col-span-6", flip && "lg:order-2 lg:col-start-7")}>
          <Frame
            k={media.services[s.slug as keyof typeof media.services]}
            sizes="(min-width: 1024px) 46vw, 94vw"
            className="aspect-[5/4] rounded-[2rem] ring-1 ring-white/10"
          >
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgb(7_6_13/0.6),transparent_45%)]" />
            <div aria-hidden className="viewfinder absolute inset-4" />
            <span className="absolute top-6 left-6 rounded-md bg-live-deep px-2 py-1 font-mono text-[0.62rem] font-semibold tracking-wider text-white">
              LIVE · CH.{String(i + 1).padStart(2, "0")}
            </span>
            <Meter className="absolute right-6 bottom-6" />
          </Frame>
          {/* Floating detail card overlapping the photo */}
          {s.icon === "audio" ? (
            <div className={cn("absolute -bottom-14 hidden w-[min(22rem,62%)] lg:block", flip ? "-left-8" : "-right-8")} data-reveal="scale" style={{ ["--d" as string]: "0.3s" }}>
              <LiveRoom className="p-4! [&_.text-h4]:text-lg" />
            </div>
          ) : (
            <div
              className={cn(
                "glass absolute -bottom-8 flex items-center gap-4 rounded-[1.4rem] p-3 pr-6 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)]",
                flip ? "left-4 lg:-left-8" : "right-4 lg:-right-8",
              )}
              data-reveal="scale"
              style={{ ["--d" as string]: "0.3s" }}
            >
              <span className="grid size-16 place-items-center rounded-2xl bg-bg/70">
                <ServiceVisual kind={s.icon} className="w-12" />
              </span>
              <span>
                <span className="eyebrow block text-cyan">Channel {String(i + 1).padStart(2, "0")}</span>
                <span className="mt-1 block font-display font-semibold">{s.points[0]}</span>
              </span>
            </div>
          )}
        </div>

        <div className={cn("lg:col-span-5", flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-8")}>
          <div className="flex items-center gap-3" data-reveal>
            <span className="grid size-11 place-items-center rounded-full border border-line bg-white/[0.03]">
              <Icon name={s.icon} className="size-5" />
            </span>
            <span className="eyebrow text-cyan">Channel {String(i + 1).padStart(2, "0")}</span>
          </div>
          <h2 className="mt-7 font-display text-[clamp(2.1rem,1rem+3.2vw,4.3rem)] leading-[0.92] font-semibold tracking-[-0.03em] uppercase" data-reveal style={{ ["--d" as string]: "0.05s" }}>
            {s.title}
          </h2>
          <p className="mt-6 text-lead text-muted" data-reveal style={{ ["--d" as string]: "0.1s" }}>
            {s.description}
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2" data-reveal style={{ ["--d" as string]: "0.15s" }}>
            {s.points.map((p) => (
              <li key={p} className="flex items-center gap-3 rounded-xl border border-line bg-white/[0.02] px-4 py-3">
                <Check className="size-4 shrink-0 text-cyan" aria-hidden />
                <span className="text-sm">{p}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap items-center gap-6" data-reveal style={{ ["--d" as string]: "0.2s" }}>
            <Button href={next.href} magnetic>
              {next.label}
            </Button>
            <Button href="/contact" variant="link">
              Ask a question
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={[
        breadcrumbs({ name: "Services", path: "/services" }),
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Park Live Network services",
          itemListElement: site.services.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Service",
              name: s.title,
              description: s.description,
              serviceType: s.title,
              url: `${site.url}/services#${s.slug}`,
              areaServed: "Worldwide",
              provider: { "@id": `${site.url}/#organization` },
            },
          })),
        },
      ]} />
      <PageHero
        channel="02"
        label="Services"
        title="Platform"
        accent="management services."
        lead="Live streaming management, audio chat room management and agency and host recruitment for live streaming, audio chat, dating, social and short-video applications — with growth strategies that scale."
        scene="rings"
        align="left"
        dim={0.5}
        photos={["neon-studio", "mixer-dark"]}
      >
        <nav aria-label="Jump to a service">
          <ul className="flex flex-wrap gap-2">
            {site.services.map((s, i) => (
              <li key={s.slug}>
                <a
                  href={`#${s.slug}`}
                  className="flex items-center gap-2 rounded-full border border-line bg-bg/50 px-4 py-2 text-sm text-muted transition-colors hover:border-cyan/40 hover:text-ink"
                >
                  <span className="eyebrow text-cyan">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      <div data-scene="rings" data-scene-dim="0.25" className="relative bg-bg/85">
        {site.services.map((s, i) => (
          <ServiceBlock key={s.slug} s={s} i={i} />
        ))}
      </div>

      <Ecosystem channel="03" />
      <Countdown channel="04" />
      <GoLive title="Need" accent="more" lead="Tell us about your platform and goals — we'll tell you honestly how our teams can help it grow." channel="05" />
    </>
  );
}
