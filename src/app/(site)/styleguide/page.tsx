import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { ChannelLabel, Chip, LiveBadge } from "@/components/ui/Badges";
import { SignalMark } from "@/components/ui/SignalMark";

export const metadata: Metadata = { title: "Design system", robots: { index: false, follow: false } };

const colors = [
  ["bg", "#07060D", "bg-bg"],
  ["surface", "#100E1A", "bg-surface"],
  ["surface-2", "#18152A", "bg-surface-2"],
  ["violet", "#7C5CFF", "bg-violet"],
  ["signal", "#3D8BFF", "bg-signal"],
  ["cyan", "#4FE3FF", "bg-cyan"],
  ["live", "#FF3D6E", "bg-live"],
  ["ink", "#F5F4FA", "bg-ink"],
  ["muted", "#A09CB5", "bg-muted"],
] as const;

const type = [
  ["hero", "text-hero", "On air"],
  ["d1", "text-d1", "Go live today"],
  ["d2", "text-d2", "Built for live communities"],
  ["d3", "text-d3", "Audio chat rooms that feel alive"],
  ["h4", "text-h4", "Agency management, done properly"],
] as const;

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-14 md:py-20">
      <ChannelLabel className="mb-10">{title}</ChannelLabel>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <div className="container-site pt-36 pb-24 md:pt-44">
      <LiveBadge>Internal</LiveBadge>
      <h1 className="mt-6 text-d1">
        Design <span className="text-beam">system</span>
      </h1>
      <p className="mt-6 max-w-xl text-lead text-muted">Tokens, type and components for Park Live Network. Not linked from the site.</p>

      <Block title="Colour">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-9">
          {colors.map(([name, hex, cls]) => (
            <div key={name} className="rounded-card border border-line p-2">
              <div className={`${cls} aspect-square rounded-chip border border-line`} />
              <p className="mt-3 px-1 text-sm">{name}</p>
              <p className="px-1 pb-1 text-xs text-muted">{hex}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Type — Clash Display / General Sans">
        <div className="space-y-8">
          {type.map(([name, cls, sample]) => (
            <div key={name} className="grid gap-2 md:grid-cols-[6rem_1fr] md:items-baseline">
              <p className="eyebrow text-muted">{name}</p>
              <p className={`${cls} font-display font-semibold`}>{sample}</p>
            </div>
          ))}
          <div className="grid gap-2 md:grid-cols-[6rem_1fr]">
            <p className="eyebrow text-muted">lead</p>
            <p className="max-w-2xl text-lead text-muted">
              We help hosts, agencies and partners run professional live communities with clear processes and responsive support.
            </p>
          </div>
          <div className="grid gap-2 md:grid-cols-[6rem_1fr]">
            <p className="eyebrow text-muted">gradient</p>
            <p className="text-d2 font-display font-semibold">
              <span className="text-gradient">Signal</span> <span className="text-beam">strength</span>{" "}
              <span className="text-outline">echo</span>
            </p>
          </div>
        </div>
      </Block>

      <Block title="Buttons">
        <div className="flex flex-wrap items-center gap-4">
          <Button magnetic cursor="Apply">Join Our Team</Button>
          <Button variant="ghost" magnetic>Become a Partner</Button>
          <Button size="lg" magnetic>Explore Services</Button>
          <Button size="lg" variant="ghost">Contact Support</Button>
          <Button variant="link" href="/about">Read our story</Button>
        </div>
      </Block>

      <Block title="Badges & labels">
        <div className="flex flex-wrap items-center gap-4">
          <LiveBadge />
          <LiveBadge>On air</LiveBadge>
          <Chip>India</Chip>
          <Chip>18+ only</Chip>
          <ChannelLabel channel="02">Services</ChannelLabel>
          <SignalMark className="size-12" animated />
        </div>
      </Block>

      <Block title="Surfaces & cursor labels">
        <div className="grid gap-4 md:grid-cols-3">
          {["View", "Apply", "Drag"].map((label) => (
            <div
              key={label}
              data-cursor={label}
              className="glass relative overflow-hidden rounded-panel p-8"
            >
              <div className="glow-orb -top-16 -right-16 size-40 bg-violet/50" />
              <p className="eyebrow text-cyan">Hover me</p>
              <p className="mt-16 font-display text-d3">Cursor: “{label}”</p>
            </div>
          ))}
        </div>
      </Block>
    </div>
  );
}
