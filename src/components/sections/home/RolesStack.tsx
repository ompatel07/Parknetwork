"use client";

import { useRef } from "react";
import { Check } from "lucide-react";
import { site } from "@/config/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { ChannelLabel } from "@/components/ui/Badges";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SignalMark } from "@/components/ui/SignalMark";

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
      mm.add("(prefers-reduced-motion: no-preference)", () => {
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
            <h2 className="mt-8 text-d1 uppercase" data-reveal style={{ ["--d" as string]: "0.05s" }}>
              Find your <span className="accent normal-case text-beam">seat</span>
              <br />
              in the control room.
            </h2>
          </div>
          <p className="text-muted lg:col-span-4" data-reveal style={{ ["--d" as string]: "0.1s" }}>
            Four ways to work with us. Every role is for adults aged 18+, and applying is always free.
          </p>
        </div>

        <div className="mt-16 md:mt-24">
          {roles.map((r, i) => (
            <article
              key={r.slug}
              className="role-card sticky mb-[6vh] last:mb-0"
              style={{ top: `calc(var(--header-h) + 1rem + ${i * 1.1}rem)` }}
            >
              <div
                className="role-inner relative isolate flex min-h-[min(80svh,46rem)] origin-top flex-col overflow-hidden rounded-[1.75rem] border border-line-strong bg-surface p-6 md:rounded-[2.5rem] md:p-12"
                style={{ backgroundImage: MESH[i % MESH.length] }}
              >
                {/* giant ghost number */}
                <span
                  aria-hidden
                  className="text-outline pointer-events-none absolute -right-4 -bottom-[0.18em] -z-10 font-display text-[clamp(12rem,30vw,30rem)] leading-none font-bold"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <SignalMark className="pointer-events-none absolute top-8 right-8 -z-10 size-24 opacity-20 md:size-40" animated />

                <div className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-2xl border border-line-strong bg-bg/40 backdrop-blur">
                    <Icon name={r.icon} className="size-5" />
                  </span>
                  <span className="eyebrow text-ink/80">
                    Role {String(i + 1).padStart(2, "0")} / {String(roles.length).padStart(2, "0")}
                  </span>
                  <span className="eyebrow rounded-full border border-line-strong px-2.5 py-1 text-ink/80">18+</span>
                </div>

                <div className="mt-auto grid gap-10 pt-16 lg:grid-cols-12 lg:items-end">
                  <div className="lg:col-span-7">
                    <h3 className="font-display text-[clamp(2.6rem,1rem+6.4vw,8rem)] leading-[0.86] font-semibold tracking-[-0.04em] uppercase">
                      {r.title}
                    </h3>
                    <p className="mt-6 max-w-lg text-lead text-ink/80">{r.summary}</p>
                    <div className="mt-8">
                      <Button href={`/careers?apply=${r.slug}`} size="lg" magnetic cursor="Apply">
                        Apply for this role
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
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
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
