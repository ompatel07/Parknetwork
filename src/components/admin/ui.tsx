import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { PostStatus, Role, SubmissionStatus } from "@/lib/supabase/types";

/* Shared admin styles — one place to keep the panel consistent. */
export const btn = {
  base: "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium whitespace-nowrap transition-[background-color,border-color,color,filter,opacity] duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan",
  primary: "bg-[linear-gradient(110deg,var(--color-violet),var(--color-signal))] px-5 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_8px_24px_-10px_rgb(124_92_255/0.8)] hover:brightness-110",
  ghost: "border border-line-strong bg-white/[0.03] text-ink hover:border-cyan/50 hover:bg-white/[0.06]",
  danger: "border border-live/40 bg-live/[0.06] text-[#ff9db5] hover:bg-live/15",
  quiet: "px-3 text-muted hover:bg-white/[0.05] hover:text-ink",
  sm: "h-8 px-3 text-[0.8rem]",
};
export const input =
  "w-full rounded-xl border border-line-strong bg-bg/70 px-3.5 py-2.5 text-[0.95rem] text-ink placeholder:text-muted/50 transition-[border-color,box-shadow] focus:border-cyan/60 focus:shadow-[0_0_0_3px_rgb(79_227_255/0.15)] focus:outline-none disabled:opacity-60";
export const labelCls = "mb-1.5 block text-sm font-medium text-ink/85";

export function PageHeader({ title, lead, actions, eyebrow }: { title: string; lead?: ReactNode; actions?: ReactNode; eyebrow?: string }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-2 text-cyan">{eyebrow}</p>}
        <h1 className="font-display text-[clamp(1.7rem,1.3rem+1.4vw,2.4rem)] leading-tight font-semibold tracking-[-0.03em]">{title}</h1>
        {lead && <p className="mt-1.5 text-muted">{lead}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className, title, action }: { children: ReactNode; className?: string; title?: string; action?: ReactNode }) {
  return (
    <section className={cn("rounded-2xl border border-line bg-surface", className)}>
      {title && (
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <h2 className="text-[0.95rem] font-semibold">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

const TONES = {
  green: "border-[#3ddc84]/30 bg-[#3ddc84]/10 text-[#7ef0b0]",
  pink: "border-live/35 bg-live/10 text-[#ff9db5]",
  violet: "border-violet/40 bg-violet/15 text-[#b9a8ff]",
  cyan: "border-cyan/30 bg-cyan/10 text-cyan",
  amber: "border-[#ffd23f]/30 bg-[#ffd23f]/10 text-[#ffe07a]",
  muted: "border-line-strong bg-white/[0.04] text-muted",
} as const;

export function Badge({ tone = "muted", children, dot }: { tone?: keyof typeof TONES; children: ReactNode; dot?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap", TONES[tone])}>
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export const SUBMISSION_STATUS: Record<SubmissionStatus, { label: string; tone: keyof typeof TONES }> = {
  new: { label: "New", tone: "pink" },
  in_progress: { label: "In progress", tone: "amber" },
  replied: { label: "Replied", tone: "green" },
  closed: { label: "Closed", tone: "muted" },
};

export function SubmissionBadge({ status }: { status: SubmissionStatus }) {
  const s = SUBMISSION_STATUS[status] ?? SUBMISSION_STATUS.new;
  return (
    <Badge tone={s.tone} dot>
      {s.label}
    </Badge>
  );
}

export function PostBadge({ status, scheduled }: { status: PostStatus; scheduled?: boolean }) {
  if (status === "published" && scheduled) return <Badge tone="cyan" dot>Scheduled</Badge>;
  return status === "published" ? (
    <Badge tone="green" dot>
      Published
    </Badge>
  ) : (
    <Badge tone="muted" dot>
      Draft
    </Badge>
  );
}

export function RoleBadge({ role }: { role: Role }) {
  const tone = role === "admin" ? "violet" : role === "manager" ? "cyan" : "muted";
  return <Badge tone={tone}>{role === "admin" ? "Admin" : role === "manager" ? "Manager" : "Editor"}</Badge>;
}

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <p className="font-display text-lg font-semibold">{title}</p>
      {children && <p className="mt-1.5 max-w-sm text-sm text-muted">{children}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "success" | "error" | "warn"; children: ReactNode }) {
  const cls = {
    info: "border-cyan/30 bg-cyan/[0.07] text-ink/90",
    success: "border-[#3ddc84]/30 bg-[#3ddc84]/[0.08] text-[#c9f7dc]",
    error: "border-live/40 bg-live/10 text-[#ffc2d1]",
    warn: "border-[#ffd23f]/30 bg-[#ffd23f]/[0.08] text-[#ffecaa]",
  }[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn("rounded-xl border px-4 py-3 text-sm", cls)}>
      {children}
    </div>
  );
}

/** Small table helpers */
export const th = "px-3 py-3 text-left text-xs font-medium tracking-wide text-muted uppercase whitespace-nowrap first:pl-4 last:pr-4 sm:px-4";
export const td = "px-3 py-3.5 align-middle first:pl-4 last:pr-4 sm:px-4";
