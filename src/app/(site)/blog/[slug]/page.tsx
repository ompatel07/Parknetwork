import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { site } from "@/config/site";
import { formatDate, getPublishedPost, getPublishedPosts, readingMinutes } from "@/lib/blog";
import { Markdown } from "@/components/blog/Markdown";
import { Cover } from "@/components/blog/Cover";
import { PostCard } from "@/components/blog/PostCard";
import { ShareRow } from "@/components/blog/ShareRow";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { Button } from "@/components/ui/Button";

/** Re-checked at most once a minute; editing in the admin refreshes it instantly. */
export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPublishedPosts(200);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: "Post not found", robots: { index: false } };
  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt || undefined,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      tags: post.tags,
      images: post.cover_url ? [{ url: post.cover_url, alt: post.cover_alt || post.title }] : undefined,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const more = (await getPublishedPosts(4)).filter((p) => p.slug !== post.slug).slice(0, 3);
  const url = `${site.url}/blog/${post.slug}`;
  const author = post.author_name || site.name;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            image: post.cover_url ?? undefined,
            datePublished: post.published_at,
            dateModified: post.updated_at,
            author: { "@type": post.author_name ? "Person" : "Organization", name: author },
            publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: `${site.url}/brand/logo.png` } },
            mainEntityOfPage: url,
            keywords: post.tags.join(", "),
          }).replace(/</g, "\\u003c"),
        }}
      />

      <article data-scene="dust" data-scene-dim="0.35" className="relative pt-[calc(var(--header-h)+3rem)] pb-(--section-y) md:pt-[calc(var(--header-h)+4.5rem)]">
        <header className="container-site">
          <div className="mx-auto max-w-3xl">
            <TransitionLink href="/blog" className="eyebrow inline-flex items-center gap-2 text-muted transition-colors hover:text-ink">
              <ArrowLeft className="size-4" aria-hidden /> All posts
            </TransitionLink>
            {post.tags.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <li key={t} className="rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-xs text-cyan">
                    #{t}
                  </li>
                ))}
              </ul>
            )}
            <h1 className="mt-5 font-display text-[clamp(2.1rem,1.2rem+3.4vw,4.4rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance">
              {post.title}
            </h1>
            {post.excerpt && <p className="mt-6 text-lead text-muted">{post.excerpt}</p>}
            <p className="eyebrow mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 border-y border-line py-4 text-muted">
              <span className="text-ink/85">{author}</span>
              <span aria-hidden>·</span>
              <time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at)}</time>
              <span aria-hidden>·</span>
              <span>{readingMinutes(post.content)} min read</span>
            </p>
          </div>
        </header>

        {post.cover_url && (
          <div className="container-site mt-10">
            <Cover
              src={post.cover_url}
              alt={post.cover_alt || post.title}
              sizes="(min-width: 1280px) 1100px, 94vw"
              priority
              className="mx-auto aspect-[16/9] max-w-5xl rounded-[2rem] border border-line"
            />
          </div>
        )}

        <div className="container-site mt-12 md:mt-16">
          <div className="mx-auto max-w-3xl">
            <Markdown>{post.content}</Markdown>

            <div className="mt-14 border-t border-line pt-8">
              <ShareRow url={url} title={post.title} />
            </div>

            <div className="mt-10 flex flex-col gap-6 rounded-[2rem] border border-line-strong bg-surface p-7 md:flex-row md:items-center md:justify-between md:p-9">
              <div>
                <p className="font-display text-xl font-semibold">Work with {site.name}</p>
                <p className="mt-1 text-muted">Platforms, agencies, hosts and creators — let&apos;s talk.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button href="/partnership">Partner with us</Button>
                <Button href="/careers" variant="ghost">
                  Join the team
                </Button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <section className="relative bg-bg py-(--section-y)">
          <div className="container-site">
            <div className="flex items-end justify-between gap-6">
              <h2 className="font-display text-d3 uppercase">
                More <span className="accent normal-case text-beam">notes.</span>
              </h2>
              <Button href="/blog" variant="link">
                All posts
              </Button>
            </div>
            <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {more.map((p) => (
                <li key={p.id}>
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
