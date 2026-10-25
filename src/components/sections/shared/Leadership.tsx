import Image from "next/image";
import { site } from "@/config/site";
import { TEAM_BLUR } from "@/data/team-blur";
import { ChannelLabel } from "@/components/ui/Badges";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { SignalMark } from "@/components/ui/SignalMark";

/* How far each pass hangs below the rail (rem) — staggered like real lanyards */
const DROPS = [0, 3.2, 1.2, 4.2, 2];

/** Leadership as backstage "ALL ACCESS" passes hanging on lanyards. They swing on hover. */
export function Leadership({ channel = "05" }: { channel?: string }) {
  const team = site.team;
  return (
    <section data-scene="dust" data-scene-dim="0.25" className="relative overflow-hidden py-(--section-y)">
      <div className="container-site">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <ChannelLabel channel={channel} data-reveal>
              Leadership
            </ChannelLabel>
            <RevealHeading title="The people" accent="behind the network." breakAccent delay={0.05} className="mt-8 text-d1 uppercase" />
          </div>
          <p className="max-w-md text-lead text-muted lg:col-span-4 lg:col-start-9" data-reveal style={{ ["--d" as string]: "0.1s" }}>
            A leadership team focused on professional management, international collaboration and long-term
            partnerships.
          </p>
        </div>
      </div>

      {/* rail */}
      <div className="relative mt-14 md:mt-20">
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.18),transparent)]" />
        <ul data-reveal className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-(--gutter) pb-10 lg:container-site lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:pb-0">
          {team.map((m, i) => (
            <li
              key={m.name}
              className="pass-wrap relative w-[68vw] shrink-0 snap-center pt-[calc(2.5rem+var(--drop))] sm:w-[42vw] md:w-[30vw] lg:w-auto lg:pt-[calc(4rem+var(--drop))]"
              style={{ ["--drop" as string]: `${DROPS[i % DROPS.length]}rem` }}
            >
              {/* lanyard */}
              <span
                aria-hidden
                className="absolute top-0 left-1/2 h-[calc(2.5rem+var(--drop)+0.6rem)] w-4 -translate-x-1/2 bg-[linear-gradient(90deg,#4b3bb0,#7c5cff_45%,#3d8bff)] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)] lg:h-[calc(4rem+var(--drop)+0.6rem)]"
              >
                <span className="absolute inset-0 bg-[repeating-linear-gradient(180deg,transparent_0_10px,rgb(255_255_255/0.12)_10px_12px)]" />
              </span>

              <div className="pass relative origin-[50%_-1rem]">
                {/* clip */}
                <span aria-hidden className="absolute -top-3 left-1/2 z-10 h-6 w-9 -translate-x-1/2 rounded-md bg-[linear-gradient(180deg,#e8e6f0,#8a8799)] shadow-md">
                  <span className="absolute inset-x-2 top-1.5 h-1.5 rounded-full bg-[#55526a]" />
                </span>

                <article className="relative overflow-hidden rounded-[1.4rem] border border-line-strong bg-surface shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9)]">
                  {/* header strip */}
                  <header className="relative flex items-center justify-between bg-[linear-gradient(110deg,var(--color-violet),var(--color-signal))] px-4 pt-5 pb-2.5">
                    <span aria-hidden className="absolute top-2 left-1/2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-bg/80" />
                    <span className="flex items-center gap-1.5 font-mono text-[0.62rem] font-semibold tracking-[0.18em] text-white">
                      <SignalMark className="size-4 [&_path]:stroke-white" /> ALL ACCESS
                    </span>
                    <span className="font-mono text-[0.62rem] font-semibold tracking-[0.12em] text-white/90">{m.code}</span>
                  </header>

                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={m.photo}
                      alt={`${m.name}, ${m.role} at ${site.name}`}
                      fill
                      sizes="(min-width: 1024px) 18vw, (min-width: 768px) 30vw, 68vw"
                      placeholder={TEAM_BLUR[m.photo] ? "blur" : "empty"}
                      blurDataURL={TEAM_BLUR[m.photo]}
                      className="object-cover transition-transform duration-[1.2s] ease-(--ease-signal) group-hover:scale-105"
                    />
                    <span aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgb(16_14_26/0.85),transparent_40%)]" />
                    {i === 0 && (
                      <span className="eyebrow absolute top-3 left-3 rounded-md bg-live px-2 py-1 text-white">Founder</span>
                    )}
                  </div>

                  <div className="relative -mt-10 px-4 pb-4">
                    <h3 className="font-display text-[clamp(1.2rem,0.9rem+0.9vw,1.6rem)] leading-tight font-semibold uppercase">{m.name}</h3>
                    <p className="eyebrow mt-1.5 text-cyan">{m.role}</p>
                    <div aria-hidden className="mt-4 flex items-end justify-between gap-3 border-t border-dashed border-line-strong pt-3">
                      <span className="barcode h-7 flex-1" />
                      <span className="eyebrow text-muted">PLN-{String(i + 1).padStart(3, "0")}</span>
                    </div>
                  </div>
                </article>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

