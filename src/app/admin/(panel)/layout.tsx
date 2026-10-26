import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { can, getAccess } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/admin/actions";
import { Shell } from "@/components/admin/Shell";
import { btn } from "@/components/admin/ui";
import { cn } from "@/lib/cn";

/**
 * Gate + shell for every admin page. (Each page and action also checks the
 * user's role itself — layouts alone aren't a security boundary.)
 */
export default async function PanelLayout({ children }: { children: ReactNode }) {
  const access = await getAccess();
  if (access.kind === "signed-out") redirect("/admin/login");
  if (access.kind === "setup") return <Setup reason={access.reason} />;
  if (access.kind === "inactive") {
    return (
      <Centered title="No access">
        <p>
          {access.email || "This account"} isn&apos;t active. Ask an admin to enable it from the Users page.
        </p>
        <form action={signOut} className="mt-6">
          <button className={cn(btn.base, btn.ghost)}>
            <LogOut className="size-4" /> Sign out
          </button>
        </form>
      </Centered>
    );
  }

  const { staff } = access;
  let newSubmissions = 0;
  if (can.handleSubmissions(staff.role)) {
    const supabase = await createClient();
    const { count } = await supabase.from("submissions").select("id", { count: "exact", head: true }).eq("status", "new");
    newSubmissions = count ?? 0;
  }

  return (
    <Shell name={staff.fullName} email={staff.email} role={staff.role} newSubmissions={newSubmissions}>
      {children}
    </Shell>
  );
}

function Centered({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="grid min-h-svh place-items-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-line-strong bg-surface p-7 text-muted">
        <h1 className="mb-3 font-display text-2xl font-semibold text-ink">{title}</h1>
        {children}
      </div>
    </main>
  );
}

function Setup({ reason }: { reason: "env" | "database" }) {
  return (
    <Centered title={reason === "env" ? "Connect Supabase" : "Set up the database"}>
      {reason === "env" ? (
        <ol className="list-decimal space-y-2 pl-5 text-sm">
          <li>Open your Supabase project → Project Settings → API Keys.</li>
          <li>
            Add <code className="text-ink">NEXT_PUBLIC_SUPABASE_URL</code>, <code className="text-ink">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> and{" "}
            <code className="text-ink">SUPABASE_SECRET_KEY</code> to <code className="text-ink">.env.local</code> (or Vercel → Settings → Environment Variables).
          </li>
          <li>Restart the site / redeploy.</li>
        </ol>
      ) : (
        <ol className="list-decimal space-y-2 pl-5 text-sm">
          <li>Open your Supabase project → SQL Editor → New query.</li>
          <li>
            Paste the whole of <code className="text-ink">supabase/schema.sql</code> and press Run.
          </li>
          <li>Reload this page.</li>
        </ol>
      )}
    </Centered>
  );
}
