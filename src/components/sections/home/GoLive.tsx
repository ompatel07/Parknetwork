import { MessageCircle } from "lucide-react";
import { site, whatsappHref } from "@/config/site";
import { ChannelLabel } from "@/components/ui/Badges";
import { OrbitButton } from "@/components/ui/OrbitButton";
import { Button } from "@/components/ui/Button";
import { ImageTrail } from "@/components/motion/ImageTrail";
import { PHOTOS } from "@/data/photos";

/** Closing call to action: giant "GO LIVE" over the reassembled particle logo. */
export function GoLive({
  title = "Go",
  accent = "live",
  lead = `${site.slogan} Apply for a role, register your agency or partner with us — real people reply.`,
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
      <ImageTrail />
      <div className="container-site pointer-events-none relative z-10 flex flex-col items-center text-center [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
        <ChannelLabel channel={channel} data-reveal>
          Your move
        </ChannelLabel>
        <h2
          className="mt-8 font-display text-[min(clamp(5rem,1rem+19vw,22rem),38svh)] leading-[0.78] font-semibold tracking-[-0.05em] uppercase"
          data-reveal="scale"
        >
          {/* The word is filled with a live crowd photo that slowly pans inside the letters */}
          <span
            className="photo-type"
            style={{
              backgroundImage: `url(/_next/image?url=${encodeURIComponent(PHOTOS["crowd-blue"].src)}&w=1920&q=75), linear-gradient(#f5f4fa,#f5f4fa)`,
            }}
          >
            {title}
          </span>{" "}
          <span className="accent normal-case text-beam">{accent}</span>
          <span aria-hidden className="ml-[0.04em] inline-block size-[0.13em] rounded-full bg-live align-baseline shadow-[0_0_0.2em_var(--color-live)]" />
        </h2>
        <p className="mt-8 max-w-md text-lead text-muted" data-reveal style={{ ["--d" as string]: "0.1s" }}>
          {lead}
        </p>
        <div className="mt-12" data-reveal style={{ ["--d" as string]: "0.15s" }}>
          <OrbitButton href="/careers" label="Join our network" orbit="Join our network · Apply now · " />
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-3" data-reveal style={{ ["--d" as string]: "0.2s" }}>
          <Button href="/partnership" variant="ghost">
            Partner With Us
          </Button>
          <Button href="/contact" variant="ghost">
            Contact Our Team
          </Button>
          <Button href={whatsappHref()} variant="ghost" icon={<MessageCircle className="size-[18px]" />}>
            WhatsApp {site.contact.whatsapp.display}
          </Button>
        </div>
      </div>
    </section>
  );
}
