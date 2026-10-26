import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/cn";

const components: Components = {
  a: ({ href = "", children }) => {
    const external = /^https?:\/\//.test(href);
    return (
      <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    );
  },
  // eslint-disable-next-line @next/next/no-img-element -- images can come from any host the author links
  img: ({ src, alt }) => <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} loading="lazy" decoding="async" />,
  table: ({ children }) => (
    <div className="prose-table">
      <table>{children}</table>
    </div>
  ),
};

/**
 * Renders a post's Markdown (GitHub style: tables, task lists, links).
 * Raw HTML is never rendered and unsafe link targets are stripped, so
 * post content can't inject scripts into the site.
 */
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn("prose-pl", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
