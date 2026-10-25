import { site } from "@/config/site";
import { ChannelLabel } from "@/components/ui/Badges";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";

export function FaqTeaser({ channel = "06" }: { channel?: string }) {
  return (
    <section data-scene="dust" data-scene-dim="0.25" className="relative py-(--section-y)">
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <ChannelLabel channel={channel} data-reveal>
              Frequently asked
            </ChannelLabel>
            <h2 className="mt-8 text-d1 uppercase" data-reveal style={{ ["--d" as string]: "0.05s" }}>
              Good <span className="accent normal-case text-beam">questions.</span>
            </h2>
            <p className="mt-6 max-w-sm text-muted" data-reveal style={{ ["--d" as string]: "0.1s" }}>
              The things people ask us most. Can&apos;t find yours? Our support team is a message away.
            </p>
            <div className="mt-8 flex flex-wrap gap-6" data-reveal style={{ ["--d" as string]: "0.15s" }}>
              <Button href="/faq" variant="ghost">
                All questions
              </Button>
              <Button href="/contact" variant="link">
                Ask support
              </Button>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7 lg:col-start-6" data-reveal style={{ ["--d" as string]: "0.1s" }}>
          <Accordion items={site.faqs.slice(0, 5)} />
        </div>
      </div>
    </section>
  );
}
