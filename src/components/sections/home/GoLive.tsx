import { Mail, MessageCircle } from "lucide-react";
import { mailHref, site, whatsappHref } from "@/config/site";
import { ChannelLabel } from "@/components/ui/Badges";
import { OrbitButton } from "@/components/ui/OrbitButton";
import { Button } from "@/components/ui/Button";

/** Closing call to action: giant "GO LIVE" over the reassembled particle logo. */
export function GoLive({
  title = "Go",
  accent = "live",
  lead = "Apply for a role, register your agency or just say hello. Real people reply.",
  channel = "07",
}: {
  title?: string;
  accent?: string;
  lead?: string;
  channel?: string;
}) {
  return (
    <section
      data-scene="mark"
      data-scene-align="center"
      data-scene-dim="0.55"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden py-(--section-y)"
    >
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_50%,rgb(7_6_13/0.55),transparent_80%)]" />
      <div className="container-site relative flex flex-col items-center text-center">
        <ChannelLabel channel={channel} data-reveal>
          Your move
        </ChannelLabel>
        <h2
          className="mt-8 font-display text-[clamp(5rem,1rem+19vw,22rem)] leading-[0.78] font-semibold tracking-[-0.05em] uppercase"
          data-reveal="scale"
        >
          {title} <span className="accent normal-case text-beam">{accent}</span>
          <span aria-hidden className="ml-[0.04em] inline-block size-[0.13em] rounded-full bg-live align-baseline shadow-[0_0_0.2em_var(--color-live)]" />
        </h2>
        <p className="mt-8 max-w-md text-lead text-muted" data-reveal style={{ ["--d" as string]: "0.1s" }}>
          {lead}
        </p>
        <div className="mt-12" data-reveal style={{ ["--d" as string]: "0.15s" }}>
          <OrbitButton href="/careers" label="Join our team" />
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-3" data-reveal style={{ ["--d" as string]: "0.2s" }}>
          <Button href="/partnership" variant="ghost">
            Become a partner
          </Button>
          <Button href={whatsappHref()} variant="ghost" icon={<MessageCircle className="size-[18px]" />}>
            WhatsApp
          </Button>
          <Button href={mailHref()} variant="ghost" icon={<Mail className="size-[18px]" />}>
            {site.contact.email}
          </Button>
        </div>
      </div>
    </section>
  );
}
