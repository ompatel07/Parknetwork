import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { GraduationCap, Headphones, ShieldCheck } from "lucide-react";
import { site } from "@/config/site";
import { PageHero } from "@/components/sections/shared/PageHero";
import { StepsRow } from "@/components/sections/shared/StepsRow";
import { RoleSwitcher } from "@/components/sections/shared/RoleSwitcher";
import { GoLive } from "@/components/sections/home/GoLive";
import { RoleSheet } from "@/components/sections/careers/RoleSheet";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { Frame } from "@/components/ui/Photo";
import type { PhotoKey } from "@/config/media";

export const metadata: Metadata = {
  title: "Careers — Join Our Team",
  description: "Open roles at Park Live Network: Super Admin, Admin, Manager, BD, Agency, Coin Seller and Live Host. Free to apply, 18+ only.",
  alternates: { canonical: "/careers" },
};

/* PLACEHOLDER copy — client to confirm */
const WHY: { icon: typeof ShieldCheck; title: string; text: string; photo: PhotoKey }[] = [
  { icon: ShieldCheck, title: "A safe, verified community", text: "Every member is a verified adult, with clear guidelines and active moderation.", photo: "neon-laptop" },
  { icon: Headphones, title: "Real people behind you", text: "A dedicated contact who answers your questions — on WhatsApp, email or call.", photo: "phone-stand" },
  { icon: GraduationCap, title: "Training & clear rules", text: "Onboarding, written guidelines and feedback so you always know where you stand.", photo: "stage-speaker" },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        channel="03"
        label="Join our team"
        title="Your voice,"
        accent="our network."
        lead="Join a network of 5,000 professionals. Seven roles — from Live Host and Agency to BD, Manager, Admin and Super Admin. Choose yours, check the requirements and apply in minutes. Applying is always free."
        scene="dust"
        dim={0.6}
        photos={["ringlight-man", "headphones-night"]}
      >
        <ul className="flex flex-wrap gap-2">
          {site.roles.map((r) => (
            <li key={r.slug}>
              <Link
                href={`?apply=${r.slug}`}
                prefetch={false}
                scroll={false}
                data-cursor="Apply"
                className="block rounded-full border border-line bg-bg/50 px-4 py-2 text-sm text-muted transition-colors hover:border-cyan/40 hover:text-ink"
              >
                Apply · {r.title}
              </Link>
            </li>
          ))}
        </ul>
      </PageHero>

      <section data-scene="dust" data-scene-dim="0.3" className="relative py-(--section-y)">
        <div className="container-site">
          <SectionHeading channel="01" label="Why join" title="Built for" accent="real people." />
          <ul className="mt-14 grid gap-4 md:grid-cols-3">
            {WHY.map((w, i) => (
              <li
                key={w.title}
                className="group rounded-[2rem] border border-line bg-surface/70 p-2.5 transition-colors duration-500 hover:border-line-strong"
              >
                <Frame k={w.photo} sizes="(min-width: 768px) 31vw, 94vw" className="aspect-[4/3] rounded-[1.5rem]" delay={i * 0.1} />
                <div className="p-5 md:p-7">
                <div className="flex items-center justify-between">
                  <span className="grid size-14 place-items-center rounded-2xl bg-[linear-gradient(135deg,rgb(124_92_255/0.35),rgb(79_227_255/0.1))] transition-transform duration-700 ease-(--ease-signal) group-hover:scale-110 group-hover:-rotate-6">
                    <w.icon className="size-6 text-cyan" aria-hidden />
                  </span>
                  <span className="eyebrow text-muted">0{i + 1}</span>
                </div>
                <h3 className="mt-8 text-h4 font-semibold">{w.title}</h3>
                <p className="mt-3 text-muted">{w.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <RoleSwitcher channel="02" />

      <section className="relative bg-bg py-(--section-y)">
        <div className="container-site">
          <SectionHeading channel="04" label="How applying works" title="Four steps" accent="to air." />
          <StepsRow steps={site.steps} className="mt-16" />
        </div>
      </section>

      <section className="relative bg-bg pb-(--section-y)">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading channel="05" label="Applying" title="Before" accent="you apply." />
          </div>
          <div className="lg:col-span-7 lg:col-start-6" data-reveal>
            <Accordion items={site.faqs.filter((f) => f.category === "Applying")} />
          </div>
        </div>
      </section>

      <GoLive title="Take your" accent="seat" lead="Not sure which role fits? Message us and we'll help you choose." channel="06" />

      <Suspense fallback={null}>
        <RoleSheet />
      </Suspense>
    </>
  );
}
