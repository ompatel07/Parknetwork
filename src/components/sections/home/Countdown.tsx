"use client";

import { useRef } from "react";
import { site } from "@/config/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { ChannelLabel } from "@/components/ui/Badges";
import { Photo } from "@/components/ui/Photo";
import { media } from "@/config/media";

/**
 * "How it works" as a broadcast countdown: the section pins, the counter
 * rolls 04 → 01 through the steps, then the ON AIR sign flickers on.
 */
export function Countdown({ channel = "04" }: { channel?: string }) {
  const section = useRef<HTMLElement>(null);
  const digits = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const sign = useRef<HTMLDivElement>(null);
  const steps = site.steps;
  const n = steps.length;

  useGSAP(
    () => {
      const el = section.current;
      if (!el) return;
      const items = gsap.utils.toArray<HTMLElement>(".cd-step", el);
      const ticks = gsap.utils.toArray<HTMLElement>(".cd-tick", el);

      const render = (p: number) => {
        const idx = Math.min(n - 1, Math.floor(p * (n + 0.6)));
        const live = p > 0.9;
        items.forEach((s, i) => (i === idx ? s.setAttribute("data-on", "") : s.removeAttribute("data-on")));
        ticks.forEach((s, i) => (i <= idx ? s.setAttribute("data-on", "") : s.removeAttribute("data-on")));
        if (digits.current) digits.current.style.transform = `translateY(${-idx}em)`;
        if (fill.current) fill.current.style.transform = `scaleX(${p})`;
        if (live) {
          sign.current?.setAttribute("data-on", "");
          el.setAttribute("data-live", "");
        } else {
          sign.current?.removeAttribute("data-on");
          el.removeAttribute("data-live");
        }
      };

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        render(0);
        const st = ScrollTrigger.create({
          trigger: el,
          pin: true,
          start: "top top",
          end: `+=${n * 75}%`,
          onUpdate: (self) => render(self.progress),
        });
        return () => st.kill();
      });
      mm.add("(prefers-reduced-motion: reduce)", () => render(1));
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      data-scene="dust"
      data-scene-dim="0"
      className="group/cd relative h-svh min-h-[40rem] overflow-hidden bg-bg"
    >
      {/* ambient red wash when live */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_70%_0%,rgb(255_61_110/0.22),transparent_70%)] opacity-0 transition-opacity duration-1000 group-data-[live]/cd:opacity-100"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_20%_60%,rgb(124_92_255/0.16),transparent_70%)]"
      />

      <div className="container-site relative flex h-full flex-col pt-[calc(var(--header-h)+1.5rem)] pb-6 md:pb-10 lg:pt-32">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <ChannelLabel channel={channel}>How it works</ChannelLabel>
            <h2 className="mt-5 text-d2 uppercase md:mt-7">
              Countdown to <span className="accent normal-case text-beam">on air.</span>
            </h2>
          </div>
          <div
            ref={sign}
            className="neon self-start rounded-xl border-2 px-5 py-2.5 font-display text-[clamp(1.2rem,0.9rem+1.4vw,2.4rem)] font-bold tracking-[0.16em] md:px-7 md:py-3.5"
          >
            ON AIR
          </div>
        </div>

        <div className="grid flex-1 items-center gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow text-muted">T – minus</p>
            <span
              aria-hidden
              className="mt-2 block h-[0.8em] overflow-hidden font-display text-[clamp(8.5rem,30vw,28rem)] leading-[0.8] font-semibold tracking-[-0.06em]"
            >
              <span ref={digits} className="block transition-transform duration-700 ease-(--ease-signal)">
                {steps.map((_, i) => (
                  <span key={i} className="block h-[1em] text-gradient">
                    {String(n - i).padStart(2, "0")}
                  </span>
                ))}
              </span>
            </span>
          </div>
          <ol className="relative min-h-[11rem] md:min-h-[13rem] lg:col-span-5 lg:min-h-[min(34rem,58svh)]">
            {steps.map((s, i) => (
              <li
                key={s.title}
                className="cd-step group/step absolute inset-0 translate-y-6 opacity-0 transition-[opacity,transform] duration-700 ease-(--ease-signal) data-[on]:translate-y-0 data-[on]:opacity-100 lg:flex lg:flex-col lg:justify-end"
              >
                <div className="relative mb-7 hidden aspect-[16/10] overflow-hidden rounded-[1.5rem] ring-1 ring-white/10 [clip-path:inset(0_0_100%_0)] transition-[clip-path] duration-1000 ease-(--ease-swift) group-data-[on]/step:[clip-path:inset(0_0_0_0)] lg:block">
                  <Photo k={media.steps[i] ?? "on-air"} sizes="(min-width: 1024px) 36vw, 1px" />
                  <span className="eyebrow absolute top-4 left-4 rounded-md bg-bg/60 px-2 py-1 text-white/90 backdrop-blur">
                    T – {String(n - i).padStart(2, "0")}
                  </span>
                </div>
                <p className="eyebrow text-cyan">Step {String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-d2">{s.title}</h3>
                <p className="mt-4 max-w-md text-lead text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* progress */}
        <div aria-hidden>
          <div className="h-px w-full bg-line">
            <div
              ref={fill}
              className="h-px origin-left scale-x-0 bg-[linear-gradient(90deg,var(--color-violet),var(--color-cyan),var(--color-live))] shadow-[0_0_10px_var(--color-cyan)]"
            />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {steps.map((s, i) => (
              <span
                key={s.title}
                className="cd-tick eyebrow truncate text-muted/50 transition-colors duration-500 data-[on]:text-ink"
              >
                {String(n - i).padStart(2, "0")} · {s.title}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
