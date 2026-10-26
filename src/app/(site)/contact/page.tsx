import type { Metadata } from "next";
import { ArrowUpRight, Clock, LifeBuoy, Mail, MapPin, MessageCircle, Phone, ShieldAlert } from "lucide-react";
import { mailHref, site, whatsappHref } from "@/config/site";
import { PageHero } from "@/components/sections/shared/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { TiltCard } from "@/components/motion/TiltCard";
import { SmartForm } from "@/components/forms/SmartForm";
import { Frame } from "@/components/ui/Photo";

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
        lead="Call or WhatsApp our customer support team, send an email or use the support form. Real people read every message."
        scene="wave"
        align="center"
        dim={0.7}
        photos={["india-phone", "mic-podcast"]}
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
                    <span className="size-1.5 rounded-full bg-white animate-live-pulse" /> Customer support · Fastest reply
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
            { icon: Phone, label: "Call support", value: c.phone.display, href: c.phone.href, cursor: "Call" },
            { icon: Mail, label: "General enquiries", value: c.email, href: mailHref(c.email), cursor: "Write" },
            { icon: LifeBuoy, label: "Support email", value: c.supportEmail, href: mailHref(c.supportEmail, "Support request"), cursor: "Write" },
            { icon: Clock, label: "Support hours", value: c.supportHours, note: c.responseTime },
            ...(c.address ? [{ icon: MapPin, label: "Office", value: c.address }] : []),
          ].map((t, i) => (
            <div key={t.label} data-reveal style={{ ["--d" as string]: `${0.06 + i * 0.06}s` }} className="">
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
                    <p className="mt-2 font-display text-[0.95rem] font-medium [overflow-wrap:anywhere] 2xl:text-lg">{t.value}</p>
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

        {/* Direct lines to named team members + the Telegram channel */}
        <div className="container-site mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {c.lines.map((l, i) => (
            <div
              key={l.number}
              data-reveal
              style={{ ["--d" as string]: `${0.06 + i * 0.06}s` }}
              className="flex flex-col justify-between gap-6 rounded-[2rem] border border-line bg-surface p-7"
            >
              <div>
                <p className="eyebrow flex items-center gap-2 text-muted">
                  <Phone className="size-4 text-cyan" aria-hidden /> Direct line
                </p>
                <p className="mt-4 font-display text-xl font-semibold">{l.role}</p>
                <p className="mt-1 font-mono text-[0.95rem] tracking-wide text-ink/85">{l.display}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={whatsappHref(`Hi ${site.shortName} ${l.role.toLowerCase()}, `, l.number)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="Chat"
                  className="flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-[#062b14] transition-transform hover:-translate-y-0.5"
                >
                  <MessageCircle className="size-4" aria-hidden /> WhatsApp
                </a>
                <a
                  href={`tel:+${l.number}`}
                  data-cursor="Call"
                  className="flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm text-ink/85 transition-colors hover:border-cyan/40 hover:text-ink"
                >
                  <Phone className="size-4" aria-hidden /> Call
                </a>
              </div>
            </div>
          ))}
          {site.socials
            .filter((s) => s.platform === "telegram")
            .map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="Join"
                data-reveal
                style={{ ["--d" as string]: "0.18s" }}
                className="group flex flex-col justify-between gap-6 rounded-[2rem] bg-[linear-gradient(135deg,#229ED9,#1c7fc0)] p-7 text-white md:col-span-2 lg:col-span-1"
              >
                <div className="flex items-center justify-between">
                  <p className="eyebrow flex items-center gap-2 text-white/85">
                    <SocialIcon platform="telegram" className="size-4" /> Telegram channel
                  </p>
                  <ArrowUpRight className="size-6 transition-transform duration-500 group-hover:rotate-45" aria-hidden />
                </div>
                <div>
                  <p className="font-display text-xl font-semibold">Join our Telegram</p>
                  <p className="mt-1 text-white/85">{s.handle} · news, openings and updates</p>
                </div>
              </a>
            ))}
        </div>

        <div className="container-site mt-4" data-reveal>
          <div className="flex flex-col gap-6 rounded-[2rem] border border-line bg-surface p-7 md:flex-row md:items-center md:justify-between">
            <p className="eyebrow text-muted">Official social accounts</p>
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
                    <span>
                      {s.label} <span className="text-muted/70">{s.handle}</span>
                    </span>
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
              <Frame k="neon-laptop" sizes="(min-width: 1024px) 30vw, 94vw" className="mt-6 hidden aspect-[4/3] rounded-[1.75rem] lg:block">
                <span className="eyebrow absolute bottom-4 left-4 rounded-md bg-bg/60 px-2 py-1 text-white/90">
                  Real people read every message
                </span>
              </Frame>
            </div>
          </div>
          <div className="lg:col-span-8" data-reveal>
            <div className="rounded-[2rem] border border-line-strong bg-surface/90 p-6 md:p-10">
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
