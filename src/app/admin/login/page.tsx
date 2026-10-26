import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAccess } from "@/lib/admin/auth";
import { LoginForm } from "./LoginForm";
import { LogoBadge } from "@/components/ui/Logo";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Sign in" };

type Props = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const access = await getAccess();
  if (access.kind === "ok") redirect("/admin");
  const { next } = await searchParams;

  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 size-[min(90vw,46rem)] -translate-1/2 rounded-full bg-[radial-gradient(circle,rgb(124_92_255/0.28),rgb(61_139_255/0.08)_45%,transparent_70%)]"
      />
      <div className="relative w-full max-w-[25rem]">
        <div className="mb-8 flex flex-col items-center text-center">
          <LogoBadge className="size-16" sizes="64px" priority />
          <h1 className="mt-5 font-display text-2xl font-semibold tracking-[-0.02em]">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted">{site.name} control room</p>
        </div>
        <div className="rounded-2xl border border-line-strong bg-surface/95 p-6 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)] sm:p-7">
          {access.kind === "setup" && (
            <p className="mb-5 rounded-xl border border-[#ffd23f]/30 bg-[#ffd23f]/[0.08] px-4 py-3 text-sm text-[#ffecaa]">
              {access.reason === "env"
                ? "Supabase isn't connected yet. Add the keys from README → Admin panel."
                : "The database isn't set up yet. Run supabase/schema.sql in the Supabase SQL Editor."}
            </p>
          )}
          {access.kind === "inactive" && (
            <p className="mb-5 rounded-xl border border-live/40 bg-live/10 px-4 py-3 text-sm text-[#ffc2d1]">
              {access.email || "This account"} doesn&apos;t have access. Ask an admin to enable it.
            </p>
          )}
          <LoginForm next={next ?? ""} />
        </div>
        <p className="mt-6 text-center text-xs text-muted">
          Forgot your password? Ask an admin to reset it from the Users page.
          <br />
          <Link href="/" className="mt-2 inline-block text-ink/80 underline-offset-4 hover:underline">
            ← Back to the website
          </Link>
        </p>
      </div>
    </main>
  );
}
