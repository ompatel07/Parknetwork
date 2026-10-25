import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { ChannelLabel } from "@/components/ui/Badges";

export const metadata: Metadata = { title: "Signal lost", robots: { index: false } };

/** 404 — "Signal lost": static-noise bars and a glitching code over scattered particles. */
export default function NotFound() {
  return (
    <section
      data-scene="dust"
      data-scene-dim="1"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-(--gutter) pt-24 pb-16 text-center"
    >
      {/* faint broadcast colour bars */}
      <div aria-hidden className="absolute inset-x-0 top-0 flex h-1.5 opacity-70">
        {["#f5f4fa", "#ffd23f", "#4fe3ff", "#3ddc84", "#7c5cff", "#ff3d6e", "#3d8bff"].map((c) => (
          <span key={c} className="flex-1" style={{ background: c }} />
        ))}
      </div>
      <ChannelLabel channel="404">No signal</ChannelLabel>
      <h1 className="glitch relative mt-8 font-display text-[clamp(7rem,30vw,22rem)] leading-[0.8] font-bold tracking-[-0.06em]" data-text="404">
        404
      </h1>
      <p className="mt-6 font-display text-d3 uppercase">
        Signal <span className="accent normal-case text-beam">lost.</span>
      </p>
      <p className="mt-4 max-w-md text-muted">
        The page you&apos;re looking for isn&apos;t broadcasting. It may have moved, or the link might be off-air.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button href="/" size="lg" magnetic>
          Back to home
        </Button>
        <Button href="/contact" size="lg" variant="ghost">
          Contact us
        </Button>
      </div>
    </section>
  );
}
