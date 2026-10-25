import { Heart, Play, Users } from "lucide-react";
import { media } from "@/config/media";
import { Photo } from "@/components/ui/Photo";
import { Meter } from "@/components/ui/Meter";

/* Floating UI cards that orbit the hero phone — one per app category.
   All sizes are in cqw (percent of the phone's width) so they scale with it. */

const card =
  "rounded-[5cqw] border border-white/12 bg-[rgb(16_14_26/0.78)] shadow-[0_30px_70px_-20px_rgb(0_0_0/0.85)] backdrop-blur-xl";

export function AudioRoomCard() {
  const seats = [
    { i: "H", g: "from-violet to-signal", speak: true },
    { i: "M", g: "from-signal to-cyan", speak: false },
    { i: "S", g: "from-live to-violet", speak: true },
    { i: "A", g: "from-cyan to-violet", speak: false },
  ];
  return (
    <div className={`${card} w-[78cqw] p-[4.4cqw]`}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[3.2cqw] tracking-wider text-muted uppercase">Audio room</span>
        <span className="flex items-center gap-[1.2cqw] font-mono text-[3cqw] text-[#ff8aa8]">
          <span className="size-[1.8cqw] rounded-full bg-live animate-live-pulse" /> LIVE
        </span>
      </div>
      <p className="mt-[2cqw] font-display text-[5.2cqw] leading-tight font-semibold text-ink">Late night talks</p>
      <div className="mt-[3.4cqw] flex gap-[2.6cqw]">
        {seats.map((s) => (
          <span key={s.i} className={`relative grid size-[11.5cqw] place-items-center rounded-full bg-gradient-to-br ${s.g} text-[4cqw] font-semibold text-white ${s.speak ? "speaking" : ""}`}>
            {s.i}
          </span>
        ))}
      </div>
      <div className="mt-[3.4cqw] flex items-center justify-between text-[3.2cqw] text-muted">
        <span className="flex items-center gap-[1.4cqw]">
          <Users className="size-[3.6cqw]" /> 128 listening
        </span>
        <Meter bars={5} className="h-[5cqw]" />
      </div>
    </div>
  );
}

export function MatchCard() {
  const [a, b] = media.hero.match;
  return (
    <div className={`${card} flex w-[70cqw] items-center gap-[3.4cqw] p-[3.6cqw]`}>
      <span className="relative flex shrink-0">
        <span className="relative size-[13cqw] overflow-hidden rounded-full ring-[0.8cqw] ring-surface">
          <Photo k={a} sizes="80px" position="50% 20%" />
        </span>
        <span className="relative -ml-[4cqw] size-[13cqw] overflow-hidden rounded-full ring-[0.8cqw] ring-surface">
          <Photo k={b} sizes="80px" position="40% 30%" />
        </span>
        <span className="match-heart absolute top-1/2 left-1/2 grid size-[7.4cqw] -translate-1/2 place-items-center rounded-full bg-live text-white shadow-[0_0_20px_rgb(255_61_110/0.7)]">
          <Heart className="size-[4cqw]" fill="currentColor" />
        </span>
      </span>
      <span className="min-w-0">
        <span className="block font-display text-[4.8cqw] leading-tight font-semibold text-ink">It&apos;s a match!</span>
        <span className="block font-mono text-[2.9cqw] tracking-wide text-muted uppercase">Dating & social</span>
      </span>
    </div>
  );
}

export function ShortVideoCard() {
  return (
    <div className={`${card} w-[50cqw] p-[2.4cqw]`}>
      <div className="relative aspect-[9/13] overflow-hidden rounded-[3.6cqw]">
        <Photo k={media.hero.shortVideo} sizes="180px" position="50% 40%" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.7),transparent_45%)]" />
        <span className="absolute top-1/2 left-1/2 grid size-[11cqw] -translate-1/2 place-items-center rounded-full bg-white/25 backdrop-blur-sm">
          <Play className="ml-[0.6cqw] size-[5cqw] text-white" fill="currentColor" />
        </span>
        <span className="absolute right-[2.4cqw] bottom-[6cqw] flex flex-col items-center text-[2.8cqw] text-white">
          <Heart className="size-[4.4cqw] text-live" fill="currentColor" />
          12.8K
        </span>
        <span className="absolute bottom-[2.4cqw] left-[2.4cqw] font-mono text-[2.8cqw] text-white uppercase">Short video</span>
        <span className="absolute inset-x-0 bottom-0 h-[0.9cqw] bg-white/20">
          <span className="sv-progress block h-full bg-cyan" />
        </span>
      </div>
    </div>
  );
}
