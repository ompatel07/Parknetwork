"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { mailHref, site, whatsappHref } from "@/config/site";
import { cn } from "@/lib/cn";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { useLenis } from "@/components/motion/SmoothScroll";
import { Button } from "@/components/ui/Button";
import { LiveBadge } from "@/components/ui/Badges";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { isActivePath } from "@/lib/nav";

const ORIGIN = "calc(100% - var(--gutter) - 22px) calc(var(--header-h) / 2)";
const EASE = [0.22, 1, 0.36, 1] as const;

export function MobileMenu({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const lenis = useLenis();
  const reduced = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);

  // Lock scroll, close on Escape, keep focus inside while open
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const opener = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => panel.current?.querySelector<HTMLElement>("a")?.focus(), 350);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panel.current) return;
      const items = panel.current.querySelectorAll<HTMLElement>("a, button");
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      lenis?.start();
      opener?.focus?.();
    };
  }, [open, onClose, lenis]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-bg lg:hidden"
          initial={reduced ? { opacity: 0 } : { clipPath: `circle(0% at ${ORIGIN})` }}
          animate={reduced ? { opacity: 1 } : { clipPath: `circle(150% at ${ORIGIN})` }}
          exit={reduced ? { opacity: 0 } : { clipPath: `circle(0% at ${ORIGIN})` }}
          transition={{ duration: reduced ? 0.2 : 0.8, ease: EASE }}
        >
          {/* atmosphere */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="glow-orb -top-32 -right-24 size-[28rem] bg-violet/50" />
            <div className="glow-orb -bottom-40 -left-32 size-[24rem] bg-signal/30" />
            <svg className="absolute -right-40 top-24 size-[36rem] opacity-[0.07]" viewBox="0 0 200 200" fill="none">
              {[20, 40, 60, 80, 98].map((r) => (
                <circle key={r} cx="100" cy="100" r={r} stroke="white" strokeWidth="0.5" />
              ))}
            </svg>
          </div>

          <nav aria-label="Mobile" className="container-site relative flex-1 pt-[calc(var(--header-h)+2rem)]">
            <ul>
              {site.nav.map((item, i) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href} className="overflow-hidden border-b border-line">
                    <motion.div
                      initial={reduced ? false : { y: "110%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.9, ease: EASE, delay: 0.18 + i * 0.055 }}
                    >
                      <TransitionLink
                        href={item.href}
                        onClick={onClose}
                        aria-current={active ? "page" : undefined}
                        className="group flex items-center gap-4 py-4"
                      >
                        <span className="eyebrow w-6 text-cyan/80">{String(i + 1).padStart(2, "0")}</span>
                        <span
                          className={cn(
                            "font-display text-[clamp(2.1rem,9vw,3.25rem)] leading-none font-semibold tracking-[-0.03em]",
                            active ? "text-gradient" : "text-ink",
                          )}
                        >
                          {item.label}
                        </span>
                        {active ? (
                          <span className="ml-auto size-2 rounded-full bg-live animate-live-pulse" aria-hidden />
                        ) : (
                          <ArrowUpRight className="ml-auto size-6 text-muted transition-transform duration-500 group-hover:rotate-45" aria-hidden />
                        )}
                      </TransitionLink>
                    </motion.div>
                  </li>
                );
              })}
            </ul>
          </nav>

          <motion.div
            className="container-site relative pt-8 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
          >
            <Button href="/careers" size="lg" className="w-full justify-between" onClick={onClose}>
              Join Our Team
            </Button>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="glass flex items-center gap-2.5 rounded-card px-4 py-3.5 text-sm"
              >
                <MessageCircle className="size-4 text-cyan" aria-hidden />
                WhatsApp
              </a>
              <a href={mailHref()} className="glass flex items-center gap-2.5 rounded-card px-4 py-3.5 text-sm">
                <Mail className="size-4 text-cyan" aria-hidden />
                Email us
              </a>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <LiveBadge>On air</LiveBadge>
              <ul className="flex gap-1">
                {site.socials.map((s) => (
                  <li key={s.platform}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="grid size-10 place-items-center rounded-full text-muted transition-colors hover:text-ink"
                    >
                      <SocialIcon platform={s.platform} className="size-[18px]" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
