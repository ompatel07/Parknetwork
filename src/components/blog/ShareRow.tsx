"use client";

import { useState } from "react";
import { Check, Link2, MessageCircle } from "lucide-react";
import { SocialIcon } from "@/components/ui/SocialIcon";

/** Share a post on WhatsApp / Telegram, or copy its link. */
export function ShareRow({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const text = `${title} — ${url}`;
  const item =
    "flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm text-ink/85 transition-colors hover:border-cyan/40 hover:text-ink";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="eyebrow mr-2 text-muted">Share</span>
      <a className={item} href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="size-4" aria-hidden /> WhatsApp
      </a>
      <a
        className={item}
        href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <SocialIcon platform="telegram" className="size-4" /> Telegram
      </a>
      <button
        type="button"
        className={item}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            window.prompt("Copy this link", url);
          }
        }}
      >
        {copied ? <Check className="size-4 text-[#3ddc84]" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
