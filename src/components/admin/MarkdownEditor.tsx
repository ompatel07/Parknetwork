"use client";

import { useRef, useState } from "react";
import { Bold, Code, Heading2, Heading3, ImagePlus, Italic, Link2, List, ListOrdered, Loader2, Minus, Quote } from "lucide-react";
import { Markdown } from "@/components/blog/Markdown";
import { uploadImage } from "./upload";
import { cn } from "@/lib/cn";

type Mode = "write" | "preview" | "split";
type Tool = "h2" | "h3" | "bold" | "italic" | "link" | "ul" | "ol" | "quote" | "code" | "hr";

const TOOLS: { key: Tool; icon: typeof Bold; label: string }[] = [
  { key: "h2", icon: Heading2, label: "Heading" },
  { key: "h3", icon: Heading3, label: "Subheading" },
  { key: "bold", icon: Bold, label: "Bold" },
  { key: "italic", icon: Italic, label: "Italic" },
  { key: "link", icon: Link2, label: "Link" },
  { key: "ul", icon: List, label: "Bullet list" },
  { key: "ol", icon: ListOrdered, label: "Numbered list" },
  { key: "quote", icon: Quote, label: "Quote" },
  { key: "code", icon: Code, label: "Code" },
  { key: "hr", icon: Minus, label: "Divider" },
];

/**
 * Markdown writing area: formatting toolbar, image upload into the text,
 * and a live preview that looks exactly like the published post.
 */
export function MarkdownEditor({ name, value, onChange }: { name: string; value: string; onChange: (v: string) => void }) {
  const ta = useRef<HTMLTextAreaElement>(null);
  const file = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<Mode>("write");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  /** Replace the selection, keeping the cursor where the writer expects it. */
  const edit = (fn: (sel: string) => { text: string; select?: [number, number] }) => {
    const el = ta.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const { text, select } = fn(value.slice(s, e));
    const next = value.slice(0, s) + text + value.slice(e);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      const [a, b] = select ? [s + select[0], s + select[1]] : [s + text.length, s + text.length];
      el.setSelectionRange(a, b);
    });
  };
  const wrap = (mark: string, placeholder: string) =>
    edit((sel) => {
      const inner = sel || placeholder;
      return { text: `${mark}${inner}${mark}`, select: [mark.length, mark.length + inner.length] };
    });
  const line = (prefix: string, placeholder: string) =>
    edit((sel) => {
      const el = ta.current!;
      const atLineStart = el.selectionStart === 0 || value[el.selectionStart - 1] === "\n";
      const lead = atLineStart ? "" : "\n";
      const body = (sel || placeholder)
        .split("\n")
        .map((l, i) => (prefix === "1. " ? `${i + 1}. ` : prefix) + l)
        .join("\n");
      return { text: `${lead}${body}`, select: sel ? undefined : [lead.length + prefix.length, lead.length + body.length] };
    });

  /** Toolbar click → formatting (runs only in event handlers). */
  const apply = (tool: Tool) => {
    switch (tool) {
      case "h2":
        return line("## ", "Heading");
      case "h3":
        return line("### ", "Subheading");
      case "bold":
        return wrap("**", "bold text");
      case "italic":
        return wrap("_", "italic text");
      case "link":
        return edit((sel) => {
          const t = sel || "link text";
          return { text: `[${t}](https://)`, select: [t.length + 3, t.length + 11] };
        });
      case "ul":
        return line("- ", "List item");
      case "ol":
        return line("1. ", "List item");
      case "quote":
        return line("> ", "Quote");
      case "code":
        return wrap("`", "code");
      case "hr":
        return edit(() => ({ text: "\n\n---\n\n" }));
    }
  };

  const onImage = async (f: File | undefined) => {
    if (!f) return;
    setError("");
    setUploading(true);
    try {
      const url = await uploadImage(f);
      const alt = f.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
      edit(() => ({ text: `\n\n![${alt}](${url})\n\n` }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (file.current) file.current.value = "";
    }
  };

  const tab = (m: Mode, label: string, extra?: string) => (
    <button
      type="button"
      onClick={() => setMode(m)}
      aria-pressed={mode === m}
      className={cn("rounded-full px-3 py-1 text-xs transition-colors", mode === m ? "bg-white/[0.09] text-ink" : "text-muted hover:text-ink", extra)}
    >
      {label}
    </button>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-line-strong bg-bg/70 focus-within:border-cyan/50">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-2 py-1.5">
        <div className={cn("flex flex-wrap items-center gap-0.5", mode === "preview" && "invisible")}>
          {TOOLS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => apply(t.key)}
              title={t.label}
              aria-label={t.label}
              className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-white/[0.06] hover:text-ink"
            >
              <t.icon className="size-4" />
            </button>
          ))}
          <button
            type="button"
            onClick={() => file.current?.click()}
            disabled={uploading}
            title="Insert image"
            aria-label="Insert image"
            className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-white/[0.06] hover:text-ink disabled:opacity-60"
          >
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
          </button>
          <input ref={file} type="file" accept="image/*" hidden onChange={(e) => onImage(e.target.files?.[0])} />
        </div>
        <div className="flex items-center gap-1 rounded-full border border-line p-0.5">
          {tab("write", "Write")}
          {tab("preview", "Preview")}
          <span className="hidden xl:contents">{tab("split", "Side by side")}</span>
        </div>
      </div>
      {error && <p className="border-b border-line bg-live/10 px-4 py-2 text-sm text-[#ffc2d1]">{error}</p>}
      <div className={cn(mode === "split" && "xl:grid xl:grid-cols-2")}>
        <textarea
          ref={ta}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onPaste={(e) => {
            const f = Array.from(e.clipboardData.files).find((x) => x.type.startsWith("image/"));
            if (f) {
              e.preventDefault();
              onImage(f);
            }
          }}
          onDrop={(e) => {
            const f = Array.from(e.dataTransfer.files).find((x) => x.type.startsWith("image/"));
            if (f) {
              e.preventDefault();
              onImage(f);
            }
          }}
          placeholder={"Write your post here…\n\nUse ## for headings, **bold**, _italic_, - lists and [links](https://…).\nPaste or drop images straight in."}
          className={cn(
            "block min-h-[26rem] w-full resize-y bg-transparent px-4 py-4 font-mono text-[0.9rem] leading-relaxed text-ink placeholder:text-muted/45 focus:outline-none",
            mode === "preview" && "hidden",
            mode === "split" && "xl:min-h-[34rem] xl:border-r xl:border-line",
          )}
        />
        {mode !== "write" && (
          <div className={cn("max-h-[44rem] min-h-[26rem] overflow-y-auto px-5 py-5", mode === "split" && "hidden xl:block")}>
            {value.trim() ? <Markdown className="text-base!">{value}</Markdown> : <p className="text-sm text-muted">Nothing to preview yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
