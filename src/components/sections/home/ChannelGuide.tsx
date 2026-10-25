"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/config/site";
import { gsap } from "@/lib/gsap";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";
import { ChannelLabel, LiveBadge } from "@/components/ui/Badges";
import { Button } from "@/components/ui/Button";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { ServiceVisual } from "./ServiceVisual";

/**
 * Services as a broadcast "channel guide". On desktop a live preview card
 * follows the cursor and switches channel as you move between rows.
 */
export function ChannelGuide() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const preview = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);
  const services = site.services;

  useEffect(() => {
    const el = preview.current;
    if (!el || !fine) return;
    gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0, rotation: -8 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });
    const rTo = gsap.quickTo(el, "rotation", { duration: 0.9, ease: "power3.out" });
    let lastX = 0;
    const onMove = (e: PointerEvent) => {
      xTo(e.clientX + 40);
      yTo(e.clientY);
      rTo(reduced ? 0 : Math.max(-14, Math.min(14, (e.clientX - lastX) * 0.6)));
      lastX = e.clientX;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [fine, reduced]);

  useEffect(() => {
    const el = preview.current;
    if (!el || !fine) return;
    gsap.to(el, { scale: active >= 0 ? 1 : 0, duration: 0.6, ease: active >= 0 ? "back.out(1.6)" : "power3.in" });
    if (active >= 0 && track.current) {
      gsap.to(track.current, { yPercent: -100 * active, duration: 0.7, ease: "expo.out" });
    }
  }, [active, fine]);

  return (
    <section data-scene="rings" data-scene-dim="0.4" className="relative py-(--section-y)">
      <div className="container-site">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <ChannelLabel channel="02" data-reveal>
              Channel guide
            </ChannelLabel>
            <h2 className="mt-8 text-d1 uppercase" data-reveal style={{ ["--d" as string]: "0.05s" }}>
              Six channels.
              <br />
              <span className="accent normal-case text-beam">One network.</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9" data-reveal style={{ ["--d" as string]: "0.1s" }}>
            <p className="text-lead text-muted">
              Everything a live community needs to run well — from the first audio room to long-term partnerships.
            </p>
            <div className="mt-6">
              <Button href="/services" variant="link">
                Full programme
              </Button>
            </div>
          </div>
        </div>

        <ul className="mt-16 border-t border-line md:mt-24" onPointerLeave={() => setActive(-1)}>
          {services.map((s, i) => (
            <li key={s.slug} className="border-b border-line" data-reveal style={{ ["--d" as string]: `${i * 0.05}s` }}>
              <TransitionLink
                href={`/services#${s.slug}`}
                data-cursor={fine ? "Watch" : undefined}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(-1)}
                className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-4 py-6 md:gap-8 md:py-9 lg:grid-cols-[6rem_1fr_minmax(0,22rem)_3.5rem]"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 bg-[linear-gradient(90deg,rgb(124_92_255/0.16),rgb(61_139_255/0.06)_60%,transparent)] transition-transform duration-700 ease-(--ease-signal) group-hover:scale-y-100"
                />
                <span className="eyebrow relative self-start pt-2 text-cyan md:pt-4">CH.{String(i + 1).padStart(2, "0")}</span>
                <span className="relative min-w-0">
                  <span className="block text-[clamp(1.55rem,0.8rem+2.9vw,4.4rem)] leading-[0.98] transition-transform duration-700 ease-(--ease-signal) group-hover:translate-x-3 lg:group-hover:translate-x-6">
                    <span className="roll">
                      <span className="font-display font-semibold tracking-[-0.03em] uppercase">{s.title}</span>
                      <span className="accent text-beam" aria-hidden>
                        {s.title}
                      </span>
                    </span>
                  </span>
                  <span className="mt-3 block max-w-md text-sm text-muted lg:hidden">{s.short}</span>
                </span>
                <span className="relative hidden text-muted lg:block">{s.short}</span>
                <span className="relative grid size-12 place-items-center rounded-full border border-line transition-all duration-500 ease-(--ease-signal) group-hover:rotate-45 group-hover:border-transparent group-hover:bg-cyan group-hover:text-bg md:size-14">
                  <ArrowUpRight className="size-5" aria-hidden />
                </span>
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Cursor-following live preview (desktop) */}
      {fine && (
        <div
          ref={preview}
          aria-hidden
          className="pointer-events-none fixed top-0 left-0 z-40 hidden w-[22rem] overflow-hidden rounded-[1.6rem] border border-line-strong bg-surface/90 shadow-[0_30px_100px_-20px_rgb(124_92_255/0.6)] backdrop-blur-md lg:block"
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <LiveBadge>Live</LiveBadge>
            <span className="eyebrow text-muted">
              CH.{String(Math.max(0, active) + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="relative h-60 overflow-hidden">
            <div ref={track} className="absolute inset-0">
              {services.map((s) => (
                <div key={s.slug} className="grid h-60 place-items-center bg-[radial-gradient(60%_60%_at_50%_50%,rgb(124_92_255/0.25),transparent_70%)]">
                  <ServiceVisual kind={s.icon} className="w-40" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
