"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks";
import { site } from "@/config/site";
import { scrollToTarget } from "./SmoothScroll";
import { SignalMark } from "@/components/ui/SignalMark";

type Ctx = { navigate: (href: string) => void };
const TransitionContext = createContext<Ctx | null>(null);

export function usePageTransition() {
  return useContext(TransitionContext);
}

const LABELS: Record<string, string> = {
  ...Object.fromEntries(site.nav.map((n) => [n.href, n.label])),
  "/faq": "FAQ",
  "/privacy": "Privacy",
  "/terms": "Terms",
};

const labelFor = (path: string) => LABELS[path] ?? path.replace(/^\//, "").replace(/-/g, " ");

/* Clip-path states: a dome that rises from the bottom, then leaves through the top. */
const DOME_HIDDEN_BOTTOM = "ellipse(80% 0% at 50% 100%)";
const DOME_FULL_BOTTOM = "ellipse(160% 160% at 50% 100%)";
const DOME_FULL_TOP = "ellipse(160% 160% at 50% 0%)";
const DOME_HIDDEN_TOP = "ellipse(80% 0% at 50% 0%)";

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();

  const root = useRef<HTMLDivElement>(null);
  const tint = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const labelEl = useRef<HTMLSpanElement>(null);
  const pending = useRef<string | null>(null);
  const busy = useRef(false);

  const navigate = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);
      const samePage = url.pathname === window.location.pathname;

      if (samePage) {
        // Same page, new query (e.g. ?apply=host opens the application panel)
        if (url.search !== window.location.search) {
          router.push(url.pathname + url.search + url.hash, { scroll: false });
          return;
        }
        if (url.hash) scrollToTarget(url.hash, { offset: -80 });
        else scrollToTarget(0);
        return;
      }
      if (busy.current) return;

      const r = root.current;
      if (reduced || !r || !tint.current || !panel.current || !content.current) {
        document.documentElement.setAttribute("data-preloaded", "");
        router.push(url.pathname + url.search + url.hash);
        return;
      }

      busy.current = true;
      pending.current = url.pathname;
      // New pages use the short entrance delay (preloader is finished by now)
      document.documentElement.setAttribute("data-preloaded", "");
      if (labelEl.current) labelEl.current.textContent = labelFor(url.pathname);

      gsap
        .timeline({
          onComplete: () => router.push(url.pathname + url.search + url.hash, { scroll: false }),
        })
        .set(r, { visibility: "visible" })
        .set([tint.current, panel.current], { clipPath: DOME_HIDDEN_BOTTOM })
        .set(content.current, { opacity: 0, y: 30 })
        .to(tint.current, { clipPath: DOME_FULL_BOTTOM, duration: 0.75, ease: "power3.inOut" }, 0)
        .to(panel.current, { clipPath: DOME_FULL_BOTTOM, duration: 0.75, ease: "power3.inOut" }, 0.09)
        .to(content.current, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }, 0.45);
    },
    [reduced, router],
  );

  // Any route change after the first page (incl. back/forward) uses the short entrance delay.
  const firstPath = useRef(pathname);
  useEffect(() => {
    if (pathname !== firstPath.current) document.documentElement.setAttribute("data-preloaded", "");
  }, [pathname]);

  // When the new route has rendered, jump to top and reveal it.
  useEffect(() => {
    if (!pending.current || pathname !== pending.current) return;
    pending.current = null;
    const hashTarget = window.location.hash ? document.querySelector(window.location.hash) : null;
    if (hashTarget instanceof HTMLElement) scrollToTarget(hashTarget, { immediate: true, offset: -80 });
    else scrollToTarget(0, { immediate: true });

    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        gsap
          .timeline({
            onComplete: () => {
              busy.current = false;
              gsap.set(root.current, { visibility: "hidden" });
            },
          })
          .to(content.current, { opacity: 0, y: -30, duration: 0.35, ease: "power2.in" }, 0)
          .set([panel.current, tint.current], { clipPath: DOME_FULL_TOP }, 0.3)
          .to(panel.current, { clipPath: DOME_HIDDEN_TOP, duration: 0.8, ease: "power3.inOut" }, 0.3)
          .to(tint.current, { clipPath: DOME_HIDDEN_TOP, duration: 0.8, ease: "power3.inOut" }, 0.4);
        window.dispatchEvent(new CustomEvent("page:enter"));
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div ref={root} aria-hidden className="pointer-events-none invisible fixed inset-0 z-[90]">
        <div
          ref={tint}
          className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-cyan),var(--color-signal)_35%,var(--color-violet))]"
          style={{ clipPath: DOME_HIDDEN_BOTTOM }}
        />
        <div ref={panel} className="absolute inset-0 bg-surface" style={{ clipPath: DOME_HIDDEN_BOTTOM }}>
          <div className="absolute top-1/2 left-1/2 size-[60vmax] -translate-1/2 rounded-full bg-violet/20 blur-[100px]" />
        </div>
        <div ref={content} className="absolute inset-0 grid place-items-center opacity-0">
          <div className="flex flex-col items-center gap-5 text-center">
            <SignalMark className="size-14" animated />
            <p className="eyebrow flex items-center gap-2 text-muted">
              <span className="size-1.5 rounded-full bg-live" />
              Now tuning in
            </p>
            <span ref={labelEl} className="font-display text-d1 font-semibold capitalize text-gradient" />
          </div>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
