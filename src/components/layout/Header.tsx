"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { LayoutGroup, motion } from "motion/react";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { isActivePath } from "@/lib/nav";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // The menu belongs to the page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const close = useCallback(() => setOpenOn(null), []);
  const [hovered, setHovered] = useState<string | null>(null);
  const lastY = useRef(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;
        setScrolled(y > 24);
        if (Math.abs(delta) > 6) setHidden(delta > 0 && y > 160);
        lastY.current = y;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Show the header again after each navigation
  useEffect(() => {
    const show = () => setHidden(false);
    window.addEventListener("page:enter", show);
    return () => window.removeEventListener("page:enter", show);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-transform duration-700 ease-(--ease-signal)",
          hidden && !open && "-translate-y-[120%]",
        )}
      >
        {/* soft fade so content never collides with the bar */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(to_bottom,rgb(7_6_13/0.9),rgb(7_6_13/0))] transition-opacity duration-500",
            scrolled && !open ? "opacity-100" : "opacity-0",
          )}
        />
        <div className="container-site relative grid h-(--header-h) grid-cols-[1fr_auto] items-center gap-4 lg:h-20 lg:grid-cols-[1fr_auto_1fr]">
          <Logo />

          <LayoutGroup>
            <nav aria-label="Main" className="hidden lg:block">
              <ul
                className="glass flex items-center gap-0.5 rounded-full p-1.5"
                onPointerLeave={() => setHovered(null)}
              >
                {site.nav.map((item) => {
                  const active = isActivePath(pathname, item.href);
                  return (
                    <li key={item.href} className="relative">
                      <TransitionLink
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onPointerEnter={() => setHovered(item.href)}
                        onFocus={() => setHovered(item.href)}
                        onBlur={() => setHovered(null)}
                        className={cn(
                          "relative block rounded-full px-4 py-2 text-[0.92rem] transition-colors duration-300",
                          active ? "text-ink" : "text-muted hover:text-ink",
                        )}
                      >
                        {hovered === item.href && (
                          <motion.span
                            layoutId="nav-hover"
                            className="absolute inset-0 rounded-full bg-white/[0.07]"
                            transition={{ type: "spring", stiffness: 420, damping: 34 }}
                          />
                        )}
                        <span className="relative">{item.label}</span>
                        {active && (
                          <motion.span
                            layoutId="nav-active"
                            className="absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-cyan shadow-[0_0_10px_var(--color-cyan)]"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                      </TransitionLink>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </LayoutGroup>

          <div className="flex items-center justify-end gap-2.5">
            <Button href="/careers" magnetic className="hidden sm:inline-flex" cursor="Join">
              Join Now
            </Button>
            <button
              type="button"
              onClick={() => setOpenOn(open ? null : pathname)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="glass relative grid size-11 place-items-center rounded-full lg:hidden"
            >
              <span
                className={cn(
                  "absolute h-[1.5px] w-[18px] rounded-full bg-ink transition-transform duration-500 ease-(--ease-signal)",
                  open ? "rotate-45" : "-translate-y-[4px]",
                )}
              />
              <span
                className={cn(
                  "absolute h-[1.5px] rounded-full bg-ink transition-[transform,width] duration-500 ease-(--ease-signal)",
                  open ? "w-[18px] -rotate-45" : "w-3 translate-x-[3px] translate-y-[4px]",
                )}
              />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={open} onClose={close} pathname={pathname} />
    </>
  );
}
