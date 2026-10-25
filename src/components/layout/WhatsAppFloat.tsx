"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { site, whatsappHref } from "@/config/site";
import { cn } from "@/lib/cn";
import { getScrollY, onScrollY } from "@/lib/scroll";

/** Floating "Chat on WhatsApp" button: shows after the first screen, hides over the footer. */
export function WhatsAppFloat() {
  const [scrolled, setScrolled] = useState(false);
  const [footer, setFooter] = useState(false);

  useEffect(() => {
    let last: boolean | null = null;
    const onScroll = (y: number) => {
      const next = y > window.innerHeight * 0.6;
      if (next !== last) {
        last = next;
        setScrolled(next);
      }
    };
    onScroll(getScrollY());
    const off = onScrollY(onScroll);
    const f = document.querySelector("footer");
    const io = f ? new IntersectionObserver(([e]) => setFooter(!!e?.isIntersecting), { rootMargin: "0px 0px -80px 0px" }) : null;
    if (f && io) io.observe(f);
    return () => {
      off();
      io?.disconnect();
    };
  }, []);

  const show = scrolled && !footer;

  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${site.name} on WhatsApp`}
      data-cursor="Chat"
      tabIndex={show ? 0 : -1}
      className={cn(
        "group fixed right-4 bottom-4 z-[65] flex items-center gap-3 rounded-full bg-[#25D366] p-3.5 text-[#062b14] shadow-[0_18px_40px_-10px_rgb(37_211_102/0.55)] transition-[transform,opacity] duration-500 ease-(--ease-signal) md:right-6 md:bottom-6 md:py-3 md:pr-5 md:pl-3.5",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
      )}
    >
      <span className="relative grid size-6 place-items-center">
        {/* the ping only runs while the button is showing */}
        {show && <span aria-hidden className="absolute inset-0 rounded-full bg-white/50 animate-ping [animation-duration:2.4s]" />}
        <MessageCircle className="relative size-6" strokeWidth={2.2} aria-hidden />
      </span>
      <span className="hidden text-sm font-semibold md:inline">Chat on WhatsApp</span>
    </a>
  );
}
