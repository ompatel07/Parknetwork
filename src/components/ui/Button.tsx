import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { Magnetic } from "@/components/motion/Magnetic";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "link";
type Size = "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  /** Icon on the right. Pass `false` to hide; defaults to an arrow. */
  icon?: ReactNode | false;
  magnetic?: boolean;
  /** Label for the custom cursor, e.g. "Apply" */
  cursor?: string;
  className?: string;
  children: ReactNode;
};

type AsLink = CommonProps & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">;
type AsButton = CommonProps & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;
export type ButtonProps = AsLink | AsButton;

const base =
  "group/btn relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full font-medium tracking-[-0.005em] whitespace-nowrap transition-[box-shadow,background-color,border-color,color] duration-500 ease-(--ease-signal) disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "text-white bg-[linear-gradient(110deg,var(--color-violet),var(--color-signal))] shadow-[inset_0_1px_0_rgb(255_255_255/0.28),0_12px_40px_-12px_rgb(124_92_255/0.8)] hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_18px_60px_-10px_rgb(79_227_255/0.55)] before:absolute before:inset-0 before:-translate-x-full before:bg-[linear-gradient(100deg,transparent_20%,rgb(255_255_255/0.28)_50%,transparent_80%)] before:transition-transform before:duration-700 before:ease-(--ease-signal) hover:before:translate-x-full",
  ghost:
    "text-ink border border-line-strong bg-white/[0.03] backdrop-blur-md hover:border-cyan/50 hover:bg-white/[0.06]",
  link: "text-ink rounded-none px-0! py-0! h-auto! gap-2",
};

const sizes: Record<Size, string> = {
  md: "h-11 pl-5 pr-1.5 text-[0.95rem]",
  lg: "h-14 pl-7 pr-2 text-base md:h-[3.75rem] md:text-[1.05rem]",
};

function Inner({ children, icon, variant, size }: Pick<CommonProps, "children" | "icon"> & { variant: Variant; size: Size }) {
  const showIcon = icon !== false;
  return (
    <>
      {/* Rolling label */}
      <span className="relative z-[1] block overflow-hidden">
        <span className="block transition-transform duration-500 ease-(--ease-signal) group-hover/btn:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-(--ease-signal) group-hover/btn:translate-y-0"
        >
          {children}
        </span>
      </span>
      {showIcon && (
        <span
          className={cn(
            "relative z-[1] grid shrink-0 place-items-center overflow-hidden rounded-full transition-colors duration-500",
            variant === "link" ? "size-6 text-cyan" : size === "lg" ? "size-10 md:size-11" : "size-8",
            variant === "primary" && "bg-white/15 group-hover/btn:bg-white group-hover/btn:text-violet",
            variant === "ghost" && "bg-white/[0.06] group-hover/btn:bg-cyan group-hover/btn:text-bg",
          )}
        >
          <span className="relative block size-[18px] overflow-hidden">
            <span className="absolute inset-0 transition-transform duration-500 ease-(--ease-signal) group-hover/btn:translate-x-full group-hover/btn:-translate-y-full">
              {icon ?? <ArrowUpRight className="size-[18px]" strokeWidth={2} />}
            </span>
            <span className="absolute inset-0 -translate-x-full translate-y-full transition-transform duration-500 ease-(--ease-signal) group-hover/btn:translate-0">
              {icon ?? <ArrowUpRight className="size-[18px]" strokeWidth={2} />}
            </span>
          </span>
        </span>
      )}
      {variant === "link" && (
        <span
          aria-hidden
          className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-cyan transition-transform duration-500 ease-(--ease-signal) group-hover/btn:origin-left group-hover/btn:scale-x-100"
        />
      )}
    </>
  );
}

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", icon, magnetic = false, cursor, className, children } = props;
  const classes = cn(base, variants[variant], variant !== "link" && sizes[size], icon === false && "px-6", className);
  const inner = (
    <Inner icon={icon} variant={variant} size={size}>
      {children}
    </Inner>
  );

  let el: ReactNode;
  if (props.href !== undefined) {
    const { href, variant: _v, size: _s, icon: _i, magnetic: _m, cursor: _c, className: _cl, children: _ch, ...rest } = props;
    const isInternal = href.startsWith("/") && !href.startsWith("//");
    el = isInternal ? (
      <TransitionLink href={href} className={classes} data-cursor={cursor} {...rest}>
        {inner}
      </TransitionLink>
    ) : (
      <a
        href={href}
        className={classes}
        data-cursor={cursor}
        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {inner}
      </a>
    );
  } else {
    const { href: _h, variant: _v, size: _s, icon: _i, magnetic: _m, cursor: _c, className: _cl, children: _ch, type = "button", ...rest } = props;
    el = (
      <button type={type} className={classes} data-cursor={cursor} {...rest}>
        {inner}
      </button>
    );
  }

  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}
