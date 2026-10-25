"use client";

import { useRef } from "react";
import { Check } from "lucide-react";
import { site } from "@/config/site";
import { gsap, motionQuery, useGSAP } from "@/lib/gsap";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { ChannelLabel } from "@/components/ui/Badges";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SignalMark } from "@/components/ui/SignalMark";
import { Photo } from "@/components/ui/Photo";
import { media } from "@/config/media";

const MESH = [
  "radial-gradient(60% 70% at 85% 15%, rgb(124 92 255 / 0.5), transparent 70%), radial-gradient(50% 60% at 5% 95%, rgb(61 139 255 / 0.28), transparent 70%)",
  "radial-gradient(55% 65% at 15% 10%, rgb(79 227 255 / 0.28), transparent 70%), radial-gradient(60% 70% at 95% 85%, rgb(124 92 255 / 0.45), transparent 70%)",
  "radial-gradient(60% 70% at 75% 90%, rgb(61 139 255 / 0.45), transparent 70%), radial-gradient(50% 60% at 5% 5%, rgb(124 92 255 / 0.35), transparent 70%)",
  "radial-gradient(55% 60% at 50% 0%, rgb(255 61 110 / 0.28), transparent 70%), radial-gradient(60% 70% at 100% 100%, rgb(124 92 255 / 0.45), transparent 70%)",
];

/** Roles as full-height cards that stack on top of each other while scrolling. */
export function RolesStack() {
  const root = useRef<HTMLElement>(null);
  const roles = site.roles;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(motionQuery(), () => {
        const cards = gsap.utils.toArray<HTMLElement>(".role-card");
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          gsap.to(card.querySelector(".role-inner"), {
            scale: 0.9,
            opacity: 0.35,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top 20%", scrub: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-scene="dust" data-scene-dim="0.3" className="relative py-(--section-y)">
      <div className="container-site">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <ChannelLabel channel="03" data-reveal>
              Join the team
            </ChannelLabel>
            <RevealHeading title="Find your seat" accent="in the control room." breakAccent delay={0.05} className="mt-8 text-d1 uppercase" />
          </div>
          <p className="text-muted lg:col-span-4" data-reveal style={{ ["--d" as string]: "0.1s" }}>
            Four ways to work with us. Every role is for adults aged 18+, and applying is always free.
          </p>
        </div>

        <div className="mt-16 md:mt-24">
          {roles.map((r, i) => (
            <article
              key={r.slug}
              className="role-card group/role sticky mb-[6vh] last:mb-0"
              style={{ top: `calc(var(--header-h) + 1rem + ${i * 1.1}rem)` }}
            >
              <div
                className="role-inner relative isolate grid min-h-[min(82svh,48rem)] origin-top overflow-hidden rounded-[1.75rem] border border-line-strong bg-surface p-2.5 md:rounded-[2.5rem] md:p-3.5 lg:grid-cols-12 lg:gap-4"
                style={{ backgroundImage: MESH[i % MESH.length] }}
              >
                {/* Photo */}
                <div data-liquid className="relative overflow-hidden rounded-[1.4rem] max-lg:aspect-[16/9] md:rounded-[2rem] lg:order-2 lg:col-span-5">
                  <Photo
                    k={media.roles[r.slug as keyof typeof media.roles]}
                    sizes="(min-width: 1024px) 38vw, 94vw"
                    position={r.slug === "coin-seller" ? "30% 40%" : undefined}
                    className="transition-transform duration-[1.6s] ease-(--ease-signal) group-hover/role:scale-105"
                  />
                  <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgb(7_6_13/0.55),transparent_45%)]" />
                  <span className="eyebrow absolute top-4 left-4 rounded-md bg-bg/60 px-2 py-1 text-white/90 backdrop-blur md:top-5 md:left-5">
                    Role {String(i + 1).padStart(2, "0")} / {String(roles.length).padStart(2, "0")}
                  </span>
                  <span className="eyebrow absolute top-4 right-4 rounded-md bg-live px-2 py-1 text-white md:top-5 md:right-5">18+</span>
                </div>

                {/* Content */}
                <div className="relative flex flex-col p-4 md:p-8 lg:col-span-7 lg:p-10">
                  {/* giant ghost number */}
                  <span
                    aria-hidden
                    className="text-outline pointer-events-none absolute -right-2 -bottom-[0.2em] -z-10 font-display text-[clamp(10rem,24vw,24rem)] leading-none font-bold"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="hidden items-center gap-3 md:flex">
                    <span className="grid size-12 place-items-center rounded-2xl border border-line-strong bg-bg/40 backdrop-blur">
                      <Icon name={r.icon} className="size-5" />
                    </span>
                    <SignalMark className="size-8 opacity-70" animated />
                  </div>

                  <div className="mt-2 md:mt-8 lg:mt-auto">
                    <h3 className="font-display text-[clamp(2.1rem,1rem+5vw,6.5rem)] leading-[0.86] font-semibold tracking-[-0.04em] uppercase">
                      {r.title}
                    </h3>
                    <p className="mt-5 max-w-lg text-lead text-ink/80">{r.summary}</p>
                  </div>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <div className="hidden rounded-2xl border border-line bg-bg/50 p-5 backdrop-blur-md sm:block">
                      <p className="eyebrow text-muted">You&apos;ll</p>
                      <ul className="mt-3 space-y-2">
                        {r.responsibilities.map((x) => (
                          <li key={x} className="flex gap-2.5 text-sm">
                            <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-cyan" />
                            {x}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-line bg-bg/50 p-5 backdrop-blur-md">
                      <p className="eyebrow text-muted">You need</p>
                      <ul className="mt-3 space-y-2">
                        {r.eligibility.map((x) => (
                          <li key={x} className="flex gap-2.5 text-sm">
                            <Check className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden />
                            {x}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-8">
                    <Button href={`/careers?apply=${r.slug}`} size="lg" magnetic cursor="Apply">
                      Apply for this role
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
