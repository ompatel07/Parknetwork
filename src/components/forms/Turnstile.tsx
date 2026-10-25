"use client";

import { useEffect, useRef } from "react";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

function loadScript() {
  if (document.querySelector(`script[src="${SRC}"]`)) return;
  const s = document.createElement("script");
  s.src = SRC;
  s.async = true;
  s.defer = true;
  document.head.appendChild(s);
}

/** Cloudflare Turnstile spam check. Renders nothing until a site key is configured. */
export function Turnstile({ onToken }: { onToken: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const cb = useRef(onToken);
  useEffect(() => {
    cb.current = onToken;
  });

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !ref.current) return;
    loadScript();
    let id = "";
    const timer = window.setInterval(() => {
      if (!window.turnstile || !ref.current) return;
      window.clearInterval(timer);
      id = window.turnstile.render(ref.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: "dark",
        callback: (t: string) => cb.current(t),
        "expired-callback": () => cb.current(""),
      });
    }, 200);
    return () => {
      window.clearInterval(timer);
      if (id && window.turnstile) window.turnstile.remove(id);
    };
  }, []);

  if (!TURNSTILE_SITE_KEY) return null;
  return <div ref={ref} className="min-h-[65px]" />;
}
