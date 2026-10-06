import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title?: React.ReactNode;
  /** Semantic heading level for the title. */
  titleLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  subTitle?: React.ReactNode;
  /** Rendered above the title — pass a Breadcrumb. */
  breadcrumb?: React.ReactNode;
  /** Buttons on the right. */
  extra?: React.ReactNode;
  /** Tags beside the title. */
  tags?: React.ReactNode;
  avatar?: React.ReactNode;
  /** Show a back arrow. */
  onBack?: (event: React.MouseEvent<HTMLElement>) => void;
  /** Native destination for the back control. */
  backHref?: string;
  /** Render a router link around the back glyph. Must return one interactive element. */
  backRender?: (children: React.ReactNode) => React.ReactElement;
  backIcon?: React.ReactNode;
  backAriaLabel?: string;
  /** Full-width slot below the header body, e.g. Tabs. */
  footer?: React.ReactNode;
  /** Description, stats, or any block under the title row. */
  children?: React.ReactNode;
  /** Transparent instead of a raised surface. */
  ghost?: boolean;
  bordered?: boolean;
  className?: string;
}

const headingByLevel = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
} as const;

export function PageHeader({
  title,
  titleLevel = 1,
  subTitle,
  breadcrumb,
  extra,
  tags,
  avatar,
  onBack,
  backHref,
  backRender,
  backIcon,
  backAriaLabel = "Back",
  footer,
  ghost = true,
  bordered = true,
  children,
  className,
  ...props
}: PageHeaderProps) {
  const Heading = headingByLevel[titleLevel];
  const backContent = backIcon ?? <ArrowLeft className="size-4" />;
  const backClassName =
    "kk-press flex size-8 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-fill-tertiary hover:text-text outline-none focus-visible:ring-[3px] focus-visible:ring-primary/30";
  let backControl: React.ReactNode;

  if (backRender) {
    const rendered = backRender(backContent);
    if (React.isValidElement<React.HTMLAttributes<HTMLElement>>(rendered) && rendered.type !== React.Fragment) {
      const originalOnClick = rendered.props.onClick;
      backControl = React.cloneElement(rendered, {
        "data-slot": "page-header-back",
        "aria-label": backAriaLabel,
        className: cn(backClassName, rendered.props.className),
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          originalOnClick?.(event);
          if (!event.defaultPrevented) onBack?.(event);
        },
      } as React.HTMLAttributes<HTMLElement>);
    } else {
      backControl = rendered;
    }
  } else if (backHref) {
    backControl = (
      <a
        data-slot="page-header-back"
        href={backHref}
        aria-label={backAriaLabel}
        onClick={(event) => onBack?.(event)}
        className={backClassName}
      >
        {backContent}
      </a>
    );
  } else if (onBack) {
    backControl = (
      <button
        type="button"
        data-slot="page-header-back"
        aria-label={backAriaLabel}
        onClick={onBack}
        className={backClassName}
      >
        {backContent}
      </button>
    );
  }

  return (
    <header
      {...props}
      data-slot="page-header"
      className={cn(
        "flex flex-col gap-3 px-6 py-4",
        !ghost && "rounded-xl bg-bg-container shadow-xs",
        bordered && (ghost ? "border-b border-border-secondary" : "border border-border-secondary"),
        className,
      )}
    >
      {breadcrumb}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {backControl}
          {avatar && <span className="shrink-0">{avatar}</span>}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {title && <Heading className="truncate text-h4 font-semibold text-text-heading">{title}</Heading>}
              {tags}
            </div>
            {subTitle && <div className="mt-0.5 truncate text-sm text-text-secondary">{subTitle}</div>}
          </div>
        </div>

        {extra && <div data-slot="page-header-extra" className="flex shrink-0 flex-wrap items-center gap-2">{extra}</div>}
      </div>

      {children && <div className="text-sm text-text-secondary">{children}</div>}
      {footer && <div data-slot="page-header-footer">{footer}</div>}
    </header>
  );
}
