"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { site } from "@/config/site";
import { Sheet } from "@/components/ui/Sheet";
import { SmartForm } from "@/components/forms/SmartForm";

/** Application panel for a role. Open state lives in the URL (?apply=slug), so links can be shared. */
export function RoleSheet() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const role = site.roles.find((r) => r.slug === params.get("apply"));

  const close = useCallback(() => router.replace(pathname, { scroll: false }), [router, pathname]);

  return (
    <Sheet open={!!role} onClose={close} title={role ? role.title : ""} eyebrow="Apply · Free · 18+">
      {role && (
        <>
          <p className="text-muted">{role.summary}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {role.eligibility.map((e) => (
              <li key={e} className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-ink/85">
                <Check className="size-3.5 text-cyan" aria-hidden />
                {e}
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-line pt-8">
            <SmartForm key={role.slug} type={role.form} hidden={role.form === "team" ? { role: role.title } : undefined} />
          </div>
        </>
      )}
    </Sheet>
  );
}
