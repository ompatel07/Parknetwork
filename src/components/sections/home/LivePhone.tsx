"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, Gift, Heart, Send } from "lucide-react";
import { media } from "@/config/media";
import { Photo } from "@/components/ui/Photo";
import { SignalMark } from "@/components/ui/SignalMark";
import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";

/* Illustrative chat — fictional handles, no real people or platform */
const COMMENTS = [
  ["aarav_k", "Joined from Mumbai 👋"],
  ["meera.live", "This room is 🔥"],
  ["sana_22", "Hi everyone!"],
  ["rohan.v", "Sending love ❤️"],
  ["ayesha", "First time here, love it"],
  ["kabir_07", "Great vibes tonight"],
  ["nisha.r", "Hello from Dubai ✨"],
  ["arjun.s", "Can't stop watching"],
  ["zara.m", "🎉🎉🎉"],
  ["ishaan", "Where's the next show?"],
] as const;
const GIFTS = ["Rocket", "Crown", "Rose", "Galaxy"];
const HUES = ["from-violet to-signal", "from-signal to-cyan", "from-live to-violet", "from-cyan to-violet"];
const HEART_COLOURS = ["#FF3D6E", "#7C5CFF", "#4FE3FF", "#FF7AA2", "#3D8BFF"];

/**
 * A phone running a live stream: ticking viewers, scrolling chat,
 * floating hearts and gift pop-ups. Sized with container units (cqw), so
 * the whole UI scales with the phone. Purely decorative.
 */
export function LivePhone({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const hearts = useRef<HTMLDivElement>(null);
  const [viewers, setViewers] = useState(12486);
  const [chat, setChat] = useState({ start: 0, n: 0 });
  const [gift, setGift] = useState<{ who: string; what: string } | null>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = !!e?.isIntersecting));
    if (root.current) io.observe(root.current);

    const v = window.setInterval(() => {
      if (visible) setViewers((x) => Math.max(9000, x + Math.round((Math.random() - 0.35) * 60)));
    }, 1100);
    const c = window.setInterval(() => {
      if (visible) setChat((s) => ({ start: s.start + 1, n: s.n + 1 }));
    }, 1700);
    let g = 0;
    const gt = window.setInterval(() => {
      if (!visible) return;
      g += 1;
      const who = COMMENTS[(g * 3) % COMMENTS.length]![0];
      setGift({ who, what: GIFTS[g % GIFTS.length]! });
      window.setTimeout(() => setGift(null), 2600);
    }, 6500);

    // Hearts: imperative DOM so React doesn't re-render for each one
    const h = window.setInterval(() => {
      const layer = hearts.current;
      if (!layer || !visible || document.hidden) return;
      const el = document.createElement("span");
      el.className = "heart-float";
      el.style.setProperty("--x", `${(Math.random() - 0.5) * 60}px`);
      el.style.setProperty("--r", `${(Math.random() - 0.5) * 40}deg`);
      el.style.setProperty("--s", `${0.7 + Math.random() * 0.6}`);
      el.style.color = HEART_COLOURS[Math.floor(Math.random() * HEART_COLOURS.length)]!;
      el.innerHTML =
        '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M12 21s-7.5-4.6-10-9.3C.3 8.4 2.2 4.5 6 4.5c2.2 0 3.6 1.2 4.5 2.5h3c.9-1.3 2.3-2.5 4.5-2.5 3.8 0 5.7 3.9 4 7.2C19.5 16.4 12 21 12 21Z"/></svg>';
      el.addEventListener("animationend", () => el.remove(), { once: true });
      layer.appendChild(el);
    }, 420);

    return () => {
      io.disconnect();
      [v, c, gt, h].forEach((t) => window.clearInterval(t));
    };
  }, [reduced]);

  // Last 4 comments, newest at the bottom
  const visibleComments = Array.from({ length: 4 }, (_, i) => {
    const idx = (chat.start + i) % COMMENTS.length;
    return { key: chat.start + i, idx, c: COMMENTS[idx]! };
  });

  return (
    <div ref={root} aria-hidden className={cn("phone-device relative size-full", className)}>
      {/* side buttons */}
      <span className="absolute top-[22%] -left-[1.1cqw] h-[9%] w-[1.4cqw] rounded-l-full bg-[#2a2638]" />
      <span className="absolute top-[34%] -left-[1.1cqw] h-[13%] w-[1.4cqw] rounded-l-full bg-[#2a2638]" />
      <span className="absolute top-[28%] -right-[1.1cqw] h-[16%] w-[1.4cqw] rounded-r-full bg-[#2a2638]" />

      <div className="relative size-full rounded-[14cqw] bg-[linear-gradient(145deg,#2c2840,#0b0a12_40%,#1d1a2b)] p-[2.8cqw] shadow-[0_60px_120px_-30px_rgb(0_0_0/0.9),0_0_0_1px_rgb(255_255_255/0.08),inset_0_0_0_1px_rgb(255_255_255/0.06)]">
        <div className="relative size-full overflow-hidden rounded-[11.4cqw] bg-surface">
          {/* the "stream" */}
          <div className="live-feed absolute inset-0">
            <Photo k={media.hero.stream} sizes="(min-width: 1024px) 360px, 60vw" priority position="50% 35%" />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(0_0_0/0.55),transparent_22%,transparent_50%,rgb(0_0_0/0.75))]" />

          {/* notch */}
          <span className="absolute top-[2.4cqw] left-1/2 h-[7cqw] w-[28cqw] -translate-x-1/2 rounded-full bg-black" />

          {/* top bar */}
          <div className="absolute inset-x-[4.5cqw] top-[12cqw] flex items-center gap-[2.4cqw]">
            <span className="flex items-center gap-[2cqw] rounded-full bg-black/45 py-[1.2cqw] pr-[1.4cqw] pl-[1.2cqw] backdrop-blur-sm">
              <span className="grid size-[8.5cqw] place-items-center rounded-full bg-bg">
                <SignalMark className="size-[6.5cqw]" />
              </span>
              <span className="leading-tight">
                <span className="block text-[3.6cqw] font-semibold text-white">parklive.host</span>
                <span className="block text-[2.8cqw] text-white/70">Audio & live</span>
              </span>
              <span className="rounded-full bg-cyan px-[2.4cqw] py-[0.9cqw] text-[2.9cqw] font-semibold text-bg">Follow</span>
            </span>
            <span className="ml-auto flex items-center gap-[1.4cqw]">
              <span className="rounded-[1.4cqw] bg-live px-[1.8cqw] py-[0.6cqw] font-mono text-[2.9cqw] font-semibold text-white">LIVE</span>
              <span className="flex items-center gap-[1cqw] rounded-[1.4cqw] bg-black/45 px-[1.8cqw] py-[0.6cqw] font-mono text-[2.9cqw] text-white tabular-nums">
                <Eye className="size-[3.2cqw]" />
                {viewers.toLocaleString("en-IN")}
              </span>
            </span>
          </div>

          {/* gift pop-up */}
          <div
            className={cn(
              "absolute top-[30cqw] left-[4.5cqw] flex items-center gap-[2cqw] rounded-full bg-[linear-gradient(90deg,rgb(255_61_110/0.9),rgb(124_92_255/0.85))] py-[1.4cqw] pr-[3.4cqw] pl-[1.4cqw] text-white shadow-lg transition-all duration-500 ease-(--ease-signal)",
              gift ? "translate-x-0 opacity-100" : "-translate-x-[110%] opacity-0",
            )}
          >
            <span className="grid size-[7cqw] place-items-center rounded-full bg-white/20">
              <Gift className="size-[4cqw]" />
            </span>
            <span className="text-[3.1cqw] leading-tight">
              <span className="font-semibold">{gift?.who ?? COMMENTS[0][0]}</span> sent a {gift?.what ?? GIFTS[0]}
            </span>
          </div>

          {/* chat */}
          <ul className="absolute bottom-[19cqw] left-[4.5cqw] w-[68%] space-y-[1.6cqw]">
            {visibleComments.map(({ key, idx, c }, i) => (
              <li
                key={key}
                className="chat-line flex items-start gap-[1.8cqw] rounded-[3cqw] bg-black/35 px-[2cqw] py-[1.3cqw] backdrop-blur-[2px]"
                style={{ opacity: 0.45 + i * 0.18 }}
              >
                <span className={cn("mt-[0.3cqw] grid size-[5.6cqw] shrink-0 place-items-center rounded-full bg-gradient-to-br text-[2.6cqw] font-semibold text-white", HUES[idx % HUES.length])}>
                  {c[0][0]?.toUpperCase()}
                </span>
                <span className="text-[3.15cqw] leading-snug text-white">
                  <span className="font-semibold text-cyan">{c[0]}</span> {c[1]}
                </span>
              </li>
            ))}
          </ul>

          {/* hearts */}
          <div ref={hearts} className="absolute right-[5cqw] bottom-[18cqw] h-[70%] w-[18cqw]" />

          {/* bottom bar */}
          <div className="absolute inset-x-[4.5cqw] bottom-[5cqw] flex items-center gap-[2cqw]">
            <span className="flex flex-1 items-center justify-between rounded-full bg-black/45 px-[3.4cqw] py-[2.4cqw] text-[3.1cqw] text-white/65 backdrop-blur-sm">
              Say something…
              <Send className="size-[3.6cqw]" />
            </span>
            <span className="grid size-[10cqw] place-items-center rounded-full bg-[linear-gradient(135deg,var(--color-violet),var(--color-live))] text-white">
              <Gift className="size-[4.6cqw]" />
            </span>
            <span className="grid size-[10cqw] place-items-center rounded-full bg-black/45 text-live">
              <Heart className="size-[4.6cqw]" fill="currentColor" />
            </span>
          </div>
          <div className="scanlines pointer-events-none absolute inset-0 opacity-40" />
        </div>
      </div>
    </div>
  );
}
