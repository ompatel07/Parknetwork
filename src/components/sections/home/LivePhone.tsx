"use client";

import { useEffect, useRef } from "react";
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
const HUE_COUNT = 4;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)"; // --ease-signal
const HEART_EASE = "cubic-bezier(0.25, 0.6, 0.35, 1)";
const HEART_COLOURS = ["#FF3D6E", "#7C5CFF", "#4FE3FF", "#FF7AA2", "#3D8BFF"];
const HEART_SVG =
  '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M12 21s-7.5-4.6-10-9.3C.3 8.4 2.2 4.5 6 4.5c2.2 0 3.6 1.2 4.5 2.5h3c.9-1.3 2.3-2.5 4.5-2.5 3.8 0 5.7 3.9 4 7.2C19.5 16.4 12 21 12 21Z"/></svg>';

/**
 * A phone running a live stream: ticking viewers, scrolling chat,
 * floating hearts and gift pop-ups. Sized with container units (cqw), so
 * the whole UI scales with the phone. Purely decorative.
 *
 * Every live update writes to the DOM directly (no React state), so the
 * hero never re-renders while it animates — smooth even on slow phones.
 */
export function LivePhone({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const hearts = useRef<HTMLDivElement>(null);
  const viewersEl = useRef<HTMLSpanElement>(null);
  const giftEl = useRef<HTMLDivElement>(null);
  const chatEl = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (reduced) return;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = !!e?.isIntersecting));
    if (root.current) io.observe(root.current);

    let viewers = 12486;
    const v = window.setInterval(() => {
      if (!visible || !viewersEl.current) return;
      viewers = Math.max(9000, viewers + Math.round((Math.random() - 0.35) * 60));
      viewersEl.current.textContent = viewers.toLocaleString("en-IN");
    }, 1100);

    let start = 0;
    const c = window.setInterval(() => {
      const list = chatEl.current;
      if (!visible || !list) return;
      start += 1;
      Array.from(list.children).forEach((li, i) => {
        const idx = (start + i) % COMMENTS.length;
        const [name, text] = COMMENTS[idx]!;
        const avatar = li.querySelector<HTMLElement>("[data-avatar]");
        const nameEl = li.querySelector("[data-name]");
        const textEl = li.querySelector("[data-text]");
        if (avatar) {
          avatar.textContent = name.charAt(0).toUpperCase();
          avatar.dataset.hue = String(idx % HUE_COUNT);
        }
        if (nameEl) nameEl.textContent = name;
        if (textEl) textEl.textContent = ` ${text}`;
      });
      // slide the list up and fade the newest line in (Web Animations —
      // restarting a CSS class would force a layout every time)
      const opts = { duration: 550, easing: EASE };
      list.animate([{ transform: "translateY(14%)" }, { transform: "none" }], opts);
      list.lastElementChild?.animate([{ opacity: 0, transform: "translateY(60%)" }, { opacity: 1, transform: "none" }], opts);
    }, 1700);

    let g = 0;
    let hideGift = 0;
    const gt = window.setInterval(() => {
      const el = giftEl.current;
      if (!visible || !el) return;
      g += 1;
      const who = el.querySelector("[data-who]");
      const what = el.querySelector("[data-what]");
      if (who) who.textContent = COMMENTS[(g * 3) % COMMENTS.length]![0];
      if (what) what.textContent = GIFTS[g % GIFTS.length]!;
      el.dataset.show = "";
      hideGift = window.setTimeout(() => delete el.dataset.show, 2600);
    }, 6500);

    // Phone width in px per 1% (= 1cqw), cached so spawning never measures
    let cq = (root.current?.clientWidth ?? 300) / 100;
    const ro = new ResizeObserver(([e]) => {
      if (e) cq = e.contentRect.width / 100;
    });
    if (root.current) ro.observe(root.current);

    // Hearts use the Web Animations API with plain px values, so the
    // browser runs them on the GPU (CSS vars / container units in
    // keyframes would keep them on the main thread every frame).
    const h = window.setInterval(() => {
      const layer = hearts.current;
      if (!layer || !visible || document.hidden || layer.childElementCount > 7) return;
      const x = (Math.random() - 0.5) * 60;
      const r = (Math.random() - 0.5) * 40;
      const s = 0.7 + Math.random() * 0.6;
      const el = document.createElement("span");
      el.className = "heart-float";
      el.style.color = HEART_COLOURS[Math.floor(Math.random() * HEART_COLOURS.length)]!;
      el.innerHTML = HEART_SVG;
      layer.appendChild(el);
      const anim = el.animate(
        [
          { transform: "translate(0,0) scale(0.2)", opacity: 0, easing: HEART_EASE },
          { transform: `translate(0,${-6 * cq}px) scale(${s})`, opacity: 1, offset: 0.12, easing: HEART_EASE },
          { transform: `translate(${-0.6 * x}px,${-50 * cq}px) rotate(${-r}deg) scale(${s})`, opacity: 0.95, offset: 0.55, easing: HEART_EASE },
          { transform: `translate(${x}px,${-100 * cq}px) rotate(${r}deg) scale(${s * 0.8})`, opacity: 0 },
        ],
        { duration: 2800, fill: "forwards" },
      );
      anim.onfinish = () => el.remove();
    }, 560);

    return () => {
      io.disconnect();
      ro.disconnect();
      [v, c, gt, h].forEach((t) => window.clearInterval(t));
      window.clearTimeout(hideGift);
    };
  }, [reduced]);

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
            <span className="flex items-center gap-[2cqw] rounded-full bg-black/45 py-[1.2cqw] pr-[1.4cqw] pl-[1.2cqw]">
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
                <span ref={viewersEl}>12,486</span>
              </span>
            </span>
          </div>

          {/* gift pop-up */}
          <div
            ref={giftEl}
            className="absolute top-[30cqw] left-[4.5cqw] flex -translate-x-[110%] items-center gap-[2cqw] rounded-full bg-[linear-gradient(90deg,rgb(255_61_110/0.9),rgb(124_92_255/0.85))] py-[1.4cqw] pr-[3.4cqw] pl-[1.4cqw] text-white opacity-0 shadow-lg transition-[translate,opacity] duration-500 ease-(--ease-signal) data-[show]:translate-x-0 data-[show]:opacity-100"
          >
            <span className="grid size-[7cqw] place-items-center rounded-full bg-white/20">
              <Gift className="size-[4cqw]" />
            </span>
            <span className="text-[3.1cqw] leading-tight">
              <span data-who className="font-semibold">
                {COMMENTS[0][0]}
              </span>{" "}
              sent a <span data-what>{GIFTS[0]}</span>
            </span>
          </div>

          {/* chat */}
          <ul ref={chatEl} className="absolute bottom-[19cqw] left-[4.5cqw] w-[68%] space-y-[1.6cqw]">
            {COMMENTS.slice(0, 4).map((c, i) => (
              <li
                key={i}
                className="flex items-start gap-[1.8cqw] rounded-[3cqw] bg-black/55 px-[2cqw] py-[1.3cqw]"
                style={{ opacity: 0.45 + i * 0.18 }}
              >
                <span
                  data-avatar
                  data-hue={i % HUE_COUNT}
                  className="chat-avatar mt-[0.3cqw] grid size-[5.6cqw] shrink-0 place-items-center rounded-full text-[2.6cqw] font-semibold text-white"
                >
                  {c[0].charAt(0).toUpperCase()}
                </span>
                <span className="text-[3.15cqw] leading-snug text-white">
                  <span data-name className="font-semibold text-cyan">
                    {c[0]}
                  </span>
                  <span data-text> {c[1]}</span>
                </span>
              </li>
            ))}
          </ul>

          {/* hearts */}
          <div ref={hearts} className="absolute right-[5cqw] bottom-[18cqw] h-[70%] w-[18cqw]" />

          {/* bottom bar */}
          <div className="absolute inset-x-[4.5cqw] bottom-[5cqw] flex items-center gap-[2cqw]">
            <span className="flex flex-1 items-center justify-between rounded-full bg-black/45 px-[3.4cqw] py-[2.4cqw] text-[3.1cqw] text-white/65">
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
        </div>
      </div>
    </div>
  );
}
