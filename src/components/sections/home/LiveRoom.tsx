import { Hand, MessageSquare, Mic, MicOff, Users } from "lucide-react";
import { AudioVisualizer } from "@/components/motion/AudioVisualizer";
import { LiveBadge } from "@/components/ui/Badges";
import { cn } from "@/lib/cn";

/* Illustrative audio room — fictional seats, no real people or platform. */
const SEATS = [
  { label: "Host", initial: "H", speaking: true, hue: "from-violet to-signal" },
  { label: "Co-host", initial: "C", speaking: false, hue: "from-signal to-cyan" },
  { label: "Guest", initial: "G", speaking: true, hue: "from-cyan to-violet" },
  { label: "Guest", initial: "A", speaking: false, muted: true, hue: "from-violet to-cyan" },
  { label: "Guest", initial: "R", speaking: false, hue: "from-signal to-violet" },
  { label: "Open", initial: "+", empty: true, hue: "" },
  { label: "Guest", initial: "M", speaking: false, muted: true, hue: "from-cyan to-signal" },
  { label: "Open", initial: "+", empty: true, hue: "" },
];

export function LiveRoom({ className }: { className?: string }) {
  return (
    <figure
      className={cn(
        "relative overflow-hidden rounded-panel border border-line bg-surface/80 p-5 shadow-[0_40px_120px_-40px_rgb(124_92_255/0.55)] md:p-7",
        className,
      )}
    >
      <div aria-hidden className="glow-orb -top-24 -right-16 size-64 bg-violet/40" />
      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <LiveBadge />
          <span className="eyebrow text-muted">Audio room</span>
        </div>
        <span className="eyebrow flex items-center gap-1.5 text-muted">
          <Users className="size-3.5" aria-hidden /> Room 07
        </span>
      </div>
      <p className="relative mt-5 font-display text-h4 font-medium">Late night conversations</p>
      <p className="relative mt-1 text-sm text-muted">Friendly talk · All welcome</p>

      <ul className="relative mt-6 grid grid-cols-4 gap-x-3 gap-y-5">
        {SEATS.map((s, i) => (
          <li key={i} className="flex flex-col items-center gap-2">
            <span
              className={cn(
                "relative grid size-12 place-items-center rounded-full font-display text-lg font-semibold md:size-14",
                s.empty ? "border border-dashed border-line-strong text-muted" : `bg-gradient-to-br ${s.hue} text-white`,
                s.speaking && "speaking",
              )}
            >
              {s.initial}
              {s.muted && (
                <span className="absolute -right-0.5 -bottom-0.5 grid size-5 place-items-center rounded-full bg-surface-2 ring-2 ring-surface">
                  <MicOff className="size-3 text-muted" aria-hidden />
                </span>
              )}
            </span>
            <span className="text-[0.7rem] text-muted">{s.label}</span>
          </li>
        ))}
      </ul>

      <div className="relative mt-6 h-16 rounded-card border border-line bg-bg/60 px-3 py-2 md:h-20">
        <AudioVisualizer bars={40} />
      </div>

      <div aria-hidden className="relative mt-5 flex items-center gap-2">
        <span className="grid size-10 place-items-center rounded-full bg-[linear-gradient(135deg,var(--color-violet),var(--color-signal))]">
          <Mic className="size-4" />
        </span>
        <span className="grid size-10 place-items-center rounded-full border border-line">
          <Hand className="size-4 text-muted" />
        </span>
        <span className="grid size-10 place-items-center rounded-full border border-line">
          <MessageSquare className="size-4 text-muted" />
        </span>
        <span className="ml-auto rounded-full border border-line px-4 py-2 text-xs text-muted">Leave quietly</span>
      </div>
      <figcaption className="sr-only">Illustration of an audio chat room with a host, co-host and guests.</figcaption>
    </figure>
  );
}
