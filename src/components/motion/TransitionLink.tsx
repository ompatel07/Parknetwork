"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { usePageTransition } from "./PageTransition";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/** Drop-in replacement for next/link that plays the signal-wipe page transition. */
export function TransitionLink({ href, onClick, target, ...rest }: Props) {
  const transition = usePageTransition();

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

  return <Link href={href} target={target} onClick={handleClick} {...rest} />;
}
