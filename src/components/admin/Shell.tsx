"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { ExternalLink, FileText, Inbox, LayoutDashboard, LogOut, Menu, UserRound, Users, X } from "lucide-react";
import { signOut } from "@/app/admin/actions";
import { LogoBadge } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";
import type { Role } from "@/lib/supabase/types";

type Item = { href: string; label: string; icon: typeof Inbox; roles?: Role[]; badge?: number };

export function Shell({
  children,
  name,
  email,
  role,
  newSubmissions,
}: {
  children: ReactNode;
  name: string;
  email: string;
  role: Role;
  newSubmissions: number;
}) {
  const pathname = usePathname();
  // The menu belongs to the page it was opened on, so navigating closes it
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (o: boolean) => setOpenOn(o ? pathname : null);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const all: Item[] = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/posts", label: "Blog posts", icon: FileText },
    { href: "/admin/submissions", label: "Submissions", icon: Inbox, roles: ["admin", "manager"], badge: newSubmissions },
    { href: "/admin/users", label: "Users", icon: Users, roles: ["admin"] },
    { href: "/admin/account", label: "My account", icon: UserRound },
  ];
  const items = all.filter((i) => !i.roles || i.roles.includes(role));

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  const roleLabel = role === "admin" ? "Admin" : role === "manager" ? "Manager" : "Editor";

  const nav = (
    <nav className="flex h-full flex-col">
      <Link href="/admin" className="flex items-center gap-3 px-5 py-5">
        <LogoBadge className="size-9" sizes="36px" />
        <span className="leading-tight">
          <span className="block font-display text-[0.95rem] font-semibold">Park Live</span>
          <span className="block text-xs text-muted">Admin panel</span>
        </span>
      </Link>
      <ul className="flex-1 space-y-1 px-3 py-2">
        {items.map((i) => {
          const active = isActive(i.href);
          return (
            <li key={i.href}>
              <Link
                href={i.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.92rem] transition-colors",
                  active ? "bg-white/[0.07] text-ink" : "text-muted hover:bg-white/[0.04] hover:text-ink",
                )}
              >
                <i.icon className={cn("size-[18px]", active ? "text-cyan" : "")} aria-hidden />
                <span className="flex-1">{i.label}</span>
                {!!i.badge && (
                  <span className="grid min-w-5 place-items-center rounded-full bg-live-deep px-1.5 text-[0.7rem] leading-5 font-semibold text-white">
                    {i.badge > 99 ? "99+" : i.badge}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="space-y-1 border-t border-line px-3 py-3">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.92rem] text-muted hover:bg-white/[0.04] hover:text-ink">
          <ExternalLink className="size-[18px]" aria-hidden /> View website
        </a>
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,var(--color-violet),var(--color-signal))] text-xs font-semibold text-white">
            {(name || email).charAt(0).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-sm">{name || email}</span>
            <span className="block text-xs text-muted">{roleLabel}</span>
          </span>
          <form action={signOut}>
            <button type="submit" className="grid size-8 place-items-center rounded-lg text-muted hover:bg-white/[0.06] hover:text-ink" aria-label="Sign out" title="Sign out">
              <LogOut className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="lg:grid lg:grid-cols-[15.5rem_1fr]">
      {/* desktop sidebar */}
      <aside className="sticky top-0 hidden h-svh border-r border-line bg-surface/80 lg:block">{nav}</aside>

      {/* phone / tablet top bar + drawer */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-bg/95 px-4 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2.5">
          <LogoBadge className="size-8" sizes="32px" />
          <span className="font-display text-sm font-semibold">Admin</span>
        </Link>
        <button type="button" onClick={() => setOpen(true)} className="relative grid size-10 place-items-center rounded-xl border border-line-strong" aria-label="Open menu">
          <Menu className="size-5" />
          {newSubmissions > 0 && role !== "editor" && <span className="absolute top-1.5 right-1.5 size-2.5 rounded-full bg-live" />}
        </button>
      </header>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" className="absolute inset-0 bg-black/70" aria-label="Close menu" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[min(18rem,85vw)] border-r border-line bg-surface">
            <button type="button" onClick={() => setOpen(false)} className="absolute top-4 right-3 grid size-9 place-items-center rounded-lg text-muted hover:text-ink" aria-label="Close menu">
              <X className="size-5" />
            </button>
            {nav}
          </aside>
        </div>
      )}

      <main className="min-w-0 px-4 py-6 sm:px-6 md:px-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
