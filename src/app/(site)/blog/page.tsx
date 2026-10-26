import type { Metadata } from "next";
import { pageMeta, breadcrumbs } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/config/site";
import { getPublishedPosts } from "@/lib/blog";
import { PageHero } from "@/components/sections/shared/PageHero";
import { FeaturedPost, PostCard } from "@/components/blog/PostCard";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { Button } from "@/components/ui/Button";

/** Re-checked at most once a minute; publishing in the admin refreshes it instantly. */
export const revalidate = 60;

export const metadata: Metadata = pageMeta({
  title: "Blog – Live Streaming & Entertainment Insights",
  description:
    "News and insights on live streaming management, audio chat rooms, agencies, hosts and digital entertainment platforms from Park Live Network.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const [latest, ...rest] = posts;
  const telegram = site.socials.find((s) => s.platform === "telegram");

  return (
    <>
      <JsonLd data={breadcrumbs({ name: "Blog", path: "/blog" })} />
      <PageHero
        channel="06"
        label="Blog"
        title="Signal"
        accent="notes."
        lead="News, insights and updates from across the network — platforms, creators, agencies and the people behind them."
        scene="dust"
        dim={0.8}
        compact
      />

      <section className="relative pb-(--section-y)">
        <div className="container-site">
          {latest ? (
            <>
              <div data-reveal>
                <FeaturedPost post={latest} />
              </div>
              {rest.length > 0 && (
                <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((p, i) => (
                    <li key={p.id} data-reveal style={{ ["--d" as string]: `${(i % 3) * 0.06}s` }}>
                      <PostCard post={p} />
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <div data-reveal className="rounded-[2rem] border border-dashed border-line-strong bg-surface/60 px-6 py-16 text-center md:py-24">
              <p className="eyebrow text-muted">Off air</p>
              <p className="mx-auto mt-4 max-w-lg font-display text-[clamp(1.6rem,1.1rem+1.6vw,2.6rem)] leading-tight font-semibold tracking-[-0.02em]">
                The first posts are on their way.
              </p>
              <p className="mx-auto mt-3 max-w-md text-muted">Follow us on Telegram to hear about new posts, openings and updates first.</p>
              {telegram && (
                <div className="mt-8 flex justify-center">
                  <Button href={telegram.href} target="_blank" rel="noopener noreferrer" icon={<SocialIcon platform="telegram" className="size-4" />}>
                    Join {telegram.handle}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
