import type { Metadata } from "next";
import { Check } from "lucide-react";
import { site, type Service } from "@/config/site";
import { PageHero } from "@/components/sections/shared/PageHero";
import { Countdown } from "@/components/sections/home/Countdown";
import { GoLive } from "@/components/sections/home/GoLive";
import { ServiceVisual } from "@/components/sections/home/ServiceVisual";
import { LiveRoom } from "@/components/sections/home/LiveRoom";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { TiltCard } from "@/components/motion/TiltCard";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Audio chat rooms, live streaming management, agency management, host recruitment, coin seller services and BD partnerships.",
  alternates: { canonical: "/services" },
};

/** Where each service's main call-to-action should lead */
const NEXT: Record<string, { label: string; href: string }> = {
  "audio-chat-rooms": { label: "Become a host", href: "/careers?apply=live-host" },
  "live-streaming-management": { label: "Become a host", href: "/careers?apply=live-host" },
  "agency-management": { label: "Register your agency", href: "/partnership" },
  "host-recruitment": { label: "Apply as a host", href: "/careers?apply=live-host" },
  "coin-seller-services": { label: "Coin seller enquiry", href: "/careers?apply=coin-seller" },
  "bd-partnerships": { label: "Propose a partnership", href: "/partnership" },
};

const MESH = [
  "radial-gradient(70% 70% at 80% 10%, rgb(124 92 255 / 0.4), transparent 70%)",
  "radial-gradient(70% 70% at 20% 90%, rgb(61 139 255 / 0.38), transparent 70%)",
  "radial-gradient(70% 70% at 50% 0%, rgb(79 227 255 / 0.22), transparent 70%)",
];

function ServiceBlock({ s, i }: { s: Service; i: number }) {
  const flip = i % 2 === 1;
  const next = NEXT[s.slug] ?? { label: "Get in touch", href: "/contact" };
  return (
    <section id={s.slug} className="scroll-mt-28 border-t border-line py-16 md:py-28">
      <div className="container-site grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className={cn("lg:col-span-6", flip && "lg:order-2 lg:col-start-7")} data-reveal="scale">
          {s.icon === "audio" ? (
            <LiveRoom className="mx-auto max-w-lg" />
          ) : (
            <TiltCard
              max={4}
              className="overflow-hidden rounded-[2rem] border border-line-strong bg-surface"
              style={{ backgroundImage: MESH[i % MESH.length] }}
            >
              <svg aria-hidden className="absolute inset-0 size-full opacity-40" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" fill="none">
                {[40, 80, 120, 160, 200].map((r) => (
                  <circle key={r} cx="200" cy="150" r={r} stroke="white" strokeOpacity="0.08" />
                ))}
              </svg>
              <div className="relative grid aspect-[4/3] place-items-center p-8">
                <ServiceVisual kind={s.icon} className="w-[min(18rem,60%)]" />
              </div>
              <span className="eyebrow absolute top-6 left-6 text-ink/70">CH.{String(i + 1).padStart(2, "0")}</span>
              <span className="eyebrow absolute right-6 bottom-6 flex items-center gap-2 text-ink/70">
                <span className="size-1.5 rounded-full bg-live animate-live-pulse" /> On air
              </span>
            </TiltCard>
          )}
        </div>

        <div className={cn("lg:col-span-5", flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-8")}>
          <div className="flex items-center gap-3" data-reveal>
            <span className="grid size-11 place-items-center rounded-full border border-line bg-white/[0.03]">
              <Icon name={s.icon} className="size-5" />
            </span>
            <span className="eyebrow text-cyan">Channel {String(i + 1).padStart(2, "0")}</span>
          </div>
          <h2 className="mt-7 text-d1 uppercase" data-reveal style={{ ["--d" as string]: "0.05s" }}>
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
      <PageHero
        channel="02"
        label="Services"
        title="What we"
        accent="put on air."
        lead="From audio chat rooms to agency coordination — the structure and support that keep live communities running smoothly."
        scene="rings"
        align="right"
      >
        <nav aria-label="Jump to a service">
          <ul className="flex flex-wrap gap-2 lg:justify-end">
            {site.services.map((s, i) => (
              <li key={s.slug}>
                <a
                  href={`#${s.slug}`}
                  className="flex items-center gap-2 rounded-full border border-line bg-bg/50 px-4 py-2 text-sm text-muted backdrop-blur transition-colors hover:border-cyan/40 hover:text-ink"
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

      <Countdown channel="03" />
      <GoLive title="Need" accent="more" lead="Tell us what your community needs and we'll tell you honestly how we can help." channel="04" />
    </>
  );
}
