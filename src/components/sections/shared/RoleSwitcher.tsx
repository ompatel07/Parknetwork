"use client";

import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { site, type Role } from "@/config/site";
import { media } from "@/config/media";
import { ChannelLabel } from "@/components/ui/Badges";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/ui/Photo";
import { cn } from "@/lib/cn";

const photoFor = (r: Role) => media.roles[r.slug as keyof typeof media.roles] ?? "team-table";

function Details({ r, compact = false }: { r: Role; compact?: boolean }) {
  return (
    <div className={cn(compact ? "pb-7" : "")}>
      <p className={cn("text-ink/85", compact ? "" : "text-lead")}>{r.summary}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-bg/60 p-4">
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
        <div className="rounded-2xl border border-line bg-bg/60 p-4">
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
      <div className="mt-6">
        <Button href={`/careers?apply=${r.slug}`} magnetic={!compact} cursor="Apply">
          Apply as {r.title}
        </Button>
      </div>
    </div>
  );
}

/**
 * Roles: a list of every role with a live preview. Desktop: hover/focus a
 * role and the panel on the right switches. Phones: tap to expand.
 */
export function RoleSwitcher({ channel = "06" }: { channel?: string }) {
  const roles = site.roles;
  const [active, setActive] = useState(0);
  const current = roles[active] ?? roles[0]!;

  return (
    <section data-scene="dust" data-scene-dim="0.3" className="relative py-(--section-y)">
      <div className="container-site">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <ChannelLabel channel={channel} data-reveal>
              Join our network
            </ChannelLabel>
            <RevealHeading title="Find your seat" accent="in the control room." breakAccent delay={0.05} className="mt-8 text-d1 uppercase" />
          </div>
          <p className="max-w-md text-muted lg:col-span-4 lg:col-start-9" data-reveal style={{ ["--d" as string]: "0.1s" }}>
            {roles.length} roles in a network of 5,000 professionals. Every role is for adults aged 18+, and applying is
            always free.
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-12 lg:gap-12">
          {/* role list */}
          <ul className="border-t border-line lg:col-span-6" data-reveal>
            {roles.map((r, i) => {
              const on = active === i;
              return (
                <li key={r.slug} className="border-b border-line">
                  <button
                    type="button"
                    aria-expanded={on}
                    onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className="group relative flex w-full items-center gap-4 py-4 text-left md:gap-6 md:py-5"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-y-0 left-0 w-0.5 origin-top bg-[linear-gradient(to_bottom,var(--color-violet),var(--color-cyan))] transition-transform duration-500 ease-(--ease-signal)",
                        on ? "scale-y-100" : "scale-y-0",
                      )}
                    />
                    <span className={cn("eyebrow w-8 shrink-0 pl-3 transition-colors", on ? "text-cyan" : "text-muted/60")}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block font-display text-[clamp(1.6rem,1rem+2.2vw,3.2rem)] leading-[0.95] font-semibold tracking-[-0.03em] uppercase transition-[color,transform] duration-500 ease-(--ease-signal)",
                          on ? "translate-x-1 text-ink" : "text-ink/45 group-hover:text-ink/80",
                        )}
                      >
                        {r.title}
                      </span>
                      <span className={cn("eyebrow mt-1.5 block transition-colors", on ? "text-cyan" : "text-muted/70")}>{r.subtitle}</span>
                    </span>
                    <span
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-(--ease-signal)",
                        on ? "rotate-45 border-transparent bg-cyan text-bg" : "border-line text-muted",
                      )}
                    >
                      <ArrowUpRight className="size-[18px]" aria-hidden />
                    </span>
                  </button>

                  {/* phones / tablets: details expand inline */}
                  <div className="lg:hidden">
                  <div className="acc-panel" data-open={on || undefined}>
                    <div className="overflow-hidden">
                      <div className="relative mb-5 aspect-[16/9] overflow-hidden rounded-[1.25rem]">
                        <Photo k={photoFor(r)} sizes="94vw" />
                        <span className="eyebrow absolute top-3 left-3 rounded-md bg-live-deep px-2 py-1 text-white">18+</span>
                      </div>
                      <Details r={r} compact />
                    </div>
                  </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* desktop preview panel */}
          <div className="hidden lg:col-span-6 lg:block">
            <div className="sticky top-28 overflow-hidden rounded-[2rem] border border-line-strong bg-surface" data-reveal="scale">
              <div className="relative aspect-[16/10] overflow-hidden">
                {roles.map((r, i) => (
                  <div
                    key={r.slug}
                    aria-hidden={active !== i}
                    className={cn("absolute inset-0 transition-opacity duration-700 ease-out", active === i ? "opacity-100" : "opacity-0")}
                  >
                    <Photo k={photoFor(r)} sizes="(min-width: 1024px) 44vw, 1px" />
                  </div>
                ))}
                <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgb(16_14_26/0.95),transparent_55%)]" />
                <span className="eyebrow absolute top-4 left-4 rounded-md bg-bg/70 px-2 py-1 text-white/90">
                  Role {String(active + 1).padStart(2, "0")} / {String(roles.length).padStart(2, "0")}
                </span>
                <span className="eyebrow absolute top-4 right-4 rounded-md bg-live-deep px-2 py-1 text-white">18+</span>
                <div className="absolute inset-x-6 bottom-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="eyebrow text-cyan">{current.subtitle}</p>
                    <p key={current.slug} className="role-swap mt-2 font-display text-[clamp(2.4rem,1.2rem+2.6vw,4.2rem)] leading-[0.9] font-semibold tracking-[-0.04em] uppercase">
                      {current.title}
                    </p>
                  </div>
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-line-strong bg-bg/60">
                    <Icon name={current.icon} className="size-5" />
                  </span>
                </div>
              </div>
              <div key={current.slug} className="role-swap p-6 md:p-8">
                <Details r={current} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
