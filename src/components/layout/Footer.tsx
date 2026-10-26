import { Mail, MessageCircle, Phone } from "lucide-react";
import { mailHref, site, whatsappHref } from "@/config/site";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { Logo } from "@/components/ui/Logo";
import { LiveBadge } from "@/components/ui/Badges";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { FooterWordmark } from "./FooterWordmark";
import { BackToTop } from "./BackToTop";
import { MotionSwitch } from "@/components/motion/MotionControls";

function LinkList({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="eyebrow mb-5 text-muted">{title}</p>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.href}>
            <TransitionLink
              href={l.href}
              className="group relative inline-block text-[0.98rem] text-ink/85 transition-colors hover:text-ink"
            >
              {l.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-cyan transition-transform duration-500 ease-(--ease-signal) group-hover:origin-left group-hover:scale-x-100" />
            </TransitionLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-[2] overflow-hidden rounded-t-[2rem] border-t border-line bg-surface md:rounded-t-[3rem]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="glow-orb -bottom-1/3 left-1/2 h-[30rem] w-[60rem] -translate-x-1/2 bg-violet/25" />
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgb(79_227_255/0.4),transparent)]" />
      </div>

      <div className="container-site relative pt-16 md:pt-24">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5 lg:col-span-4">
            <Logo />
            <p className="mt-6 max-w-sm text-muted">{site.tagline}</p>
            <p className="mt-3 max-w-sm text-sm text-muted">
              Live streaming management, audio chat room management, agency and host recruitment and digital entertainment
              platform management — worldwide.
            </p>
            <LiveBadge className="mt-6">70+ apps · 500K+ users · Global</LiveBadge>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-7 lg:col-span-4 lg:col-start-6">
            <LinkList title="Explore" links={site.footerNav.explore} />
            <LinkList title="Support" links={site.footerNav.support} />
          </div>

          <div className="md:col-span-12 lg:col-span-3 lg:col-start-10">
            <p className="eyebrow mb-5 text-muted">Talk to us</p>
            <a
              href={mailHref()}
              className="group flex items-center gap-3 font-display text-[1.2rem] font-medium [overflow-wrap:anywhere] transition-colors hover:text-cyan"
            >
              <Mail className="size-5 shrink-0 text-cyan" aria-hidden />
              {site.contact.email}
            </a>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center gap-3 text-ink/85 transition-colors hover:text-ink"
            >
              <MessageCircle className="size-5 shrink-0 text-cyan" aria-hidden />
              WhatsApp {site.contact.whatsapp.display}
            </a>
            <a href={site.contact.phone.href} className="mt-3 flex items-center gap-3 text-ink/85 transition-colors hover:text-ink">
              <Phone className="size-5 shrink-0 text-cyan" aria-hidden />
              Support {site.contact.phone.display}
            </a>
            {site.contact.lines.map((l) => (
              <a
                key={l.number}
                href={whatsappHref(`Hi ${site.shortName}, `, l.number)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-start gap-3 text-ink/85 transition-colors hover:text-ink"
              >
                <Phone className="mt-0.5 size-5 shrink-0 text-cyan" aria-hidden />
                <span>
                  {l.display}
                  <span className="block text-sm text-muted">{l.role}</span>
                </span>
              </a>
            ))}
            <p className="mt-3 text-sm text-muted">{site.contact.supportHours}</p>
            <ul className="mt-6 flex gap-2">
              {site.socials.map((s) => (
                <li key={s.platform}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid size-11 place-items-center rounded-full border border-line text-muted transition-[color,border-color,background-color] duration-300 hover:border-cyan/50 hover:bg-cyan/10 hover:text-ink"
                  >
                    <SocialIcon platform={s.platform} className="size-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 md:mt-24">
          <FooterWordmark />
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legal.companyName}. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <MotionSwitch />
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
