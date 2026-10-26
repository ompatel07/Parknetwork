"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { btn } from "./ui";

/** Submit button that shows a spinner while its form's action runs. */
export function SubmitButton({
  children,
  variant = "primary",
  className,
  name,
  value,
  disabled,
  pendingText,
}: {
  children: ReactNode;
  variant?: "primary" | "ghost" | "danger";
  className?: string;
  name?: string;
  value?: string;
  disabled?: boolean;
  pendingText?: string;
}) {
  const { pending, data } = useFormStatus();
  // Only the button that was pressed shows the spinner
  const mine = pending && (!name || data?.get(name) === value);
  return (
    <button type="submit" name={name} value={value} disabled={disabled || pending} className={cn(btn.base, btn[variant], className)}>
      {mine && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {mine && pendingText ? pendingText : children}
    </button>
  );
}

const subscribeNoop = () => () => {};
/** False during server render and hydration, true afterwards. */
export const useIsClient = () => useSyncExternalStore(subscribeNoop, () => true, () => false);

function formatTime(iso: string, mode: "datetime" | "date" | "relative") {
  const d = new Date(iso);
  if (mode === "relative") {
    const s = Math.round((Date.now() - d.getTime()) / 1000);
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
    if (Math.abs(s) < 60) return rtf.format(-s, "second");
    if (Math.abs(s) < 3600) return rtf.format(-Math.round(s / 60), "minute");
    if (Math.abs(s) < 86400) return rtf.format(-Math.round(s / 3600), "hour");
    if (Math.abs(s) < 86400 * 7) return rtf.format(-Math.round(s / 86400), "day");
  }
  return new Intl.DateTimeFormat(undefined, mode === "date" ? { dateStyle: "medium" } : { dateStyle: "medium", timeStyle: "short" }).format(d);
}

/** Formats a timestamp in the viewer's own time zone (the server shows the plain date). */
export function LocalTime({ iso, mode = "datetime", className }: { iso: string | null | undefined; mode?: "datetime" | "date" | "relative"; className?: string }) {
  const isClient = useIsClient();
  const text = !iso ? "—" : isClient ? formatTime(iso, mode) : iso.slice(0, 10);
  return (
    <time dateTime={iso ?? undefined} title={iso ?? undefined} className={className}>
      {text}
    </time>
  );
}

/**
 * A button that asks "are you sure?" in a proper dialog before running a
 * server action (deletes, disabling accounts…).
 */
export function ConfirmAction({
  action,
  fields,
  trigger,
  title,
  body,
  confirmLabel = "Confirm",
  tone = "danger",
  triggerClassName,
}: {
  action: (formData: FormData) => void | Promise<void>;
  fields: Record<string, string>;
  trigger: ReactNode;
  title: string;
  body?: ReactNode;
  confirmLabel?: string;
  tone?: "danger" | "primary";
  triggerClassName?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button type="button" className={triggerClassName ?? cn(btn.base, btn.danger)} onClick={() => ref.current?.showModal()}>
        {trigger}
      </button>
      <dialog
        ref={ref}
        className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-2xl border border-line-strong bg-surface p-0 text-ink shadow-2xl backdrop:bg-black/70"
        onClick={(e) => e.target === ref.current && ref.current?.close()}
      >
        <form
          action={action}
          // Close this (and any dialog behind it) right away, so the result
          // message on the page isn't hidden under an open dialog
          onSubmit={() => document.querySelectorAll("dialog[open]").forEach((d) => (d as HTMLDialogElement).close())}
          className="p-6"
        >
          {Object.entries(fields).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v} />
          ))}
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          {body && <div className="mt-2 text-sm text-muted">{body}</div>}
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" className={cn(btn.base, btn.ghost)} onClick={() => ref.current?.close()}>
              Cancel
            </button>
            <SubmitButton variant={tone}>{confirmLabel}</SubmitButton>
          </div>
        </form>
      </dialog>
    </>
  );
}

/** Opens children in a modal dialog from a trigger button. */
export function Modal({
  trigger,
  title,
  children,
  triggerClassName,
  onOpenChange,
}: {
  trigger: ReactNode;
  title: string;
  children: ReactNode | ((close: () => void) => ReactNode);
  triggerClassName?: string;
  onOpenChange?: (open: boolean) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const change = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };
  // Keep the native <dialog> in sync with our state (no state set here)
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  const close = () => change(false);

  return (
    <>
      <button type="button" className={triggerClassName ?? cn(btn.base, btn.ghost)} onClick={() => change(true)}>
        {trigger}
      </button>
      <dialog
        ref={ref}
        onClose={() => open && change(false)}
        className="m-auto max-h-[calc(100svh-2rem)] w-[min(32rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-line-strong bg-surface p-0 text-ink shadow-2xl backdrop:bg-black/70"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          <button type="button" onClick={close} className={cn(btn.base, btn.quiet, btn.sm)} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="p-6">{typeof children === "function" ? children(close) : children}</div>
      </dialog>
    </>
  );
}
