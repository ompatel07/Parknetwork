"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { usePageTransition } from "./PageTransition";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

const prefetched = new Set<string>();

/**
 * Drop-in replacement for next/link that plays the signal-wipe page
 * transition. Prefetches on intent (hover / touch / focus) instead of when
 * the link scrolls into view — viewport prefetching parsed ~430 KB of route
 * data on the main thread while scrolling, which made phones stutter.
 */
export function TransitionLink({ href, onClick, onPointerEnter, onFocus, onTouchStart, target, prefetch = false, ...rest }: Props) {
  const transition = usePageTransition();
  const router = useRouter();

  const warm = () => {
    if (!href.startsWith("/") || href.startsWith("//")) return;
    const path = href.split("#")[0] || "/";
    if (prefetched.has(path)) return;
    prefetched.add(path);
    router.prefetch(path);
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (
      e.defaultPrevented ||
      !transition ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      (target && target !== "_self") ||
      !href.startsWith("/")
    ) {
      return;
    }
    e.preventDefault();
    transition.navigate(href);
  };

  return (
    <Link
      href={href}
      target={target}
      prefetch={prefetch}
      onClick={handleClick}
      onPointerEnter={(e) => {
        warm();
        onPointerEnter?.(e);
      }}
      onTouchStart={(e) => {
        warm();
        onTouchStart?.(e);
      }}
      onFocus={(e) => {
        warm();
        onFocus?.(e);
      }}
      {...rest}
    />
  );
}
