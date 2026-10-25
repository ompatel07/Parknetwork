import type { Metadata } from "next";
import { ArrowUpRight, Clock, LifeBuoy, Mail, MapPin, MessageCircle, ShieldAlert } from "lucide-react";
import { mailHref, site, whatsappHref } from "@/config/site";
import { PageHero } from "@/components/sections/shared/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { TiltCard } from "@/components/motion/TiltCard";
import { SmartForm } from "@/components/forms/SmartForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact ${site.name} on WhatsApp, by email or through our support form.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const c = site.contact;
  return (
    <>
      <PageHero
        channel="05"
        label="Contact"
        title="Let's get"
        accent="you on air."
        lead="Message us on WhatsApp, send an email or use the support form. Real people read every message."
        scene="wave"
        align="center"
        dim={0.9}
      />

      <section className="relative bg-bg py-(--section-y)">
        <div className="container-site grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* WhatsApp — primary */}
          <div className="md:col-span-2 lg:row-span-2" data-reveal>
            <TiltCard max={3} className="h-full overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,var(--color-violet),var(--color-signal)_60%,var(--color-cyan))]">
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="Chat"
                className="group relative flex h-full min-h-[22rem] flex-col justify-between p-8 text-white md:p-12"
              >
                <div className="flex items-center justify-between">
                  <span className="eyebrow flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-white animate-live-pulse" /> Fastest reply
                  </span>
                  <ArrowUpRight className="size-8 transition-transform duration-700 ease-(--ease-signal) group-hover:rotate-45" aria-hidden />
                </div>
                <div>
                  <MessageCircle className="size-10" aria-hidden />
                  <p className="mt-6 font-display text-[clamp(2.6rem,1.4rem+4vw,5.5rem)] leading-[0.9] font-semibold tracking-[-0.04em] uppercase">
                    WhatsApp
                  </p>
                  <p className="mt-3 text-lead text-white/85">{c.whatsapp.display}</p>
                </div>
              </a>
            </TiltCard>
          </div>

          {[
            { icon: Mail, label: "General enquiries", value: c.email, href: mailHref(c.email), cursor: "Write" },
            { icon: LifeBuoy, label: "Support", value: c.supportEmail, href: mailHref(c.supportEmail, "Support request"), cursor: "Write" },
            { icon: Clock, label: "Support hours", value: c.supportHours, note: c.responseTime },
            ...(c.address ? [{ icon: MapPin, label: "Office", value: c.address }] : []),
          ].map((t, i) => (
            <div key={t.label} data-reveal style={{ ["--d" as string]: `${0.06 + i * 0.06}s` }} className={c.address ? "" : i === 2 ? "md:col-span-2" : ""}>
              {"href" in t && t.href ? (
                <a
                  href={t.href}
                  data-cursor={t.cursor}
                  className="group flex h-full min-h-[10.5rem] flex-col justify-between rounded-[2rem] border border-line bg-surface p-7 transition-colors duration-500 hover:border-cyan/40"
                >
                  <div className="flex items-center justify-between">
                    <t.icon className="size-5 text-cyan" aria-hidden />
                    <ArrowUpRight className="size-5 text-muted transition-all duration-500 group-hover:rotate-45 group-hover:text-cyan" aria-hidden />
                  </div>
                  <div>
                    <p className="eyebrow text-muted">{t.label}</p>
                    <p className="mt-2 font-display text-base font-medium [overflow-wrap:anywhere] xl:text-lg">{t.value}</p>
                  </div>
                </a>
              ) : (
                <div className="flex h-full min-h-[10.5rem] flex-col justify-between rounded-[2rem] border border-line bg-surface p-7">
                  <t.icon className="size-5 text-cyan" aria-hidden />
                  <div>
                    <p className="eyebrow text-muted">{t.label}</p>
                    <p className="mt-2 font-display text-lg font-medium">{t.value}</p>
                    {"note" in t && t.note && <p className="mt-1 text-sm text-muted">{t.note}</p>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="container-site mt-4" data-reveal>
          <div className="flex flex-col gap-6 rounded-[2rem] border border-line bg-surface p-7 md:flex-row md:items-center md:justify-between">
            <p className="eyebrow text-muted">Follow the signal</p>
            <ul className="flex flex-wrap gap-2">
              {site.socials.map((s) => (
                <li key={s.platform}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 rounded-full border border-line px-4 py-2.5 text-sm text-muted transition-colors hover:border-cyan/40 hover:text-ink"
                  >
                    <SocialIcon platform={s.platform} className="size-4" />
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="support" data-scene="wave" data-scene-dim="0.3" className="relative scroll-mt-24 py-(--section-y)">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <SectionHeading
                channel="01"
                label="Support"
                title="How can"
                accent="we help?"
                lead="Questions about an application, your agency or something that went wrong — tell us here."
              />
              <div className="mt-8 flex items-start gap-3 rounded-2xl border border-live/30 bg-live/10 p-5 text-sm" data-reveal>
                <ShieldAlert className="mt-0.5 size-5 shrink-0 text-[#ff8aa8]" aria-hidden />
                <p className="text-ink/85">
                  Stay safe: we will <strong>never</strong> ask for your password, OTP or card details. If someone does,
                  report it to us right away.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-8" data-reveal>
            <div className="rounded-[2rem] border border-line-strong bg-surface/90 p-6 backdrop-blur-md md:p-10">
              <SmartForm type="support" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-bg py-(--section-y)">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading channel="02" label="Help & safety" title="Quick" accent="answers." />
          </div>
          <div className="lg:col-span-7 lg:col-start-6" data-reveal>
            <Accordion items={site.faqs.filter((f) => f.category === "Support & safety" || f.category === "General")} />
          </div>
        </div>
      </section>
    </>
  );
}
