import { ArrowUpRight } from "lucide-react";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { formatDate, type PublicPost } from "@/lib/blog";
import { cn } from "@/lib/cn";
import { Cover } from "./Cover";

function Meta({ post }: { post: PublicPost }) {
  return (
    <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
      <time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at)}</time>
      {post.tags.slice(0, 2).map((t) => (
        <span key={t} className="text-cyan">
          #{t}
        </span>
      ))}
    </p>
  );
}

/** Grid card for a post. */
export function PostCard({ post, className }: { post: PublicPost; className?: string }) {
  return (
    <TransitionLink
      href={`/blog/${post.slug}`}
      data-cursor="Read"
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-surface transition-colors duration-500 hover:border-cyan/40",
        className,
      )}
    >
      <Cover src={post.cover_url} alt={post.cover_alt || post.title} sizes="(min-width: 1024px) 31vw, (min-width: 768px) 47vw, 94vw" className="aspect-[16/10]" />
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <Meta post={post} />
        <h3 className="mt-3 font-display text-[1.35rem] leading-[1.15] font-semibold tracking-[-0.02em] md:text-[1.5rem]">{post.title}</h3>
        {post.excerpt && <p className="mt-3 line-clamp-3 text-muted">{post.excerpt}</p>}
        <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-medium text-ink/85">
          Read article
          <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" aria-hidden />
        </span>
      </div>
    </TransitionLink>
  );
}

/** Wide card for the newest post. */
export function FeaturedPost({ post }: { post: PublicPost }) {
  return (
    <TransitionLink
      href={`/blog/${post.slug}`}
      data-cursor="Read"
      className="group grid overflow-hidden rounded-[2rem] border border-line-strong bg-surface transition-colors duration-500 hover:border-cyan/40 lg:grid-cols-12"
    >
      <Cover
        src={post.cover_url}
        alt={post.cover_alt || post.title}
        sizes="(min-width: 1024px) 58vw, 94vw"
        priority
        className="aspect-[16/10] lg:col-span-7 lg:aspect-auto lg:min-h-[26rem]"
      />
      <div className="flex flex-col justify-between gap-8 p-7 md:p-10 lg:col-span-5">
        <div>
          <p className="eyebrow flex items-center gap-2 text-live">
            <span className="size-1.5 rounded-full bg-live animate-live-pulse" /> Latest
          </p>
          <h2 className="mt-5 font-display text-[clamp(1.8rem,1.1rem+2vw,3rem)] leading-[1.02] font-semibold tracking-[-0.03em]">{post.title}</h2>
          {post.excerpt && <p className="mt-4 text-lead text-muted">{post.excerpt}</p>}
        </div>
        <div className="flex items-end justify-between gap-4">
          <Meta post={post} />
          <span className="grid size-12 shrink-0 place-items-center rounded-full border border-line-strong transition-all duration-500 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-white group-hover:text-bg">
            <ArrowUpRight className="size-5" aria-hidden />
          </span>
        </div>
      </div>
    </TransitionLink>
  );
}
