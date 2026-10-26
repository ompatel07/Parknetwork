import type { Metadata } from "next";
import type { ReactNode } from "react";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: { default: "Admin", template: `%s · Admin · ${site.name}` },
  robots: { index: false, follow: false },
};

/** The admin panel: no marketing chrome (header, particles, cursor). */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-svh text-ink">{children}</div>;
}
