import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Card — content container: bordered by default, optional hoverable shadow,
 * `size="small"`, title/extra head, actions footer, cover, inner/grid/meta helpers.
 */
export interface CardTabItem {
  key: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export type CardVariant = "outlined" | "borderless";

export interface CardSlots<V> {
  head?: V;
  body?: V;
  actions?: V;
  cover?: V;
  tabs?: V;
}

export interface CardProps extends Omit<React.ComponentProps<"div">, "title"> {
  title?: React.ReactNode;
  extra?: React.ReactNode;
  cover?: React.ReactNode;
  actions?: React.ReactNode[];
  /** @deprecated use `variant` */
  bordered?: boolean;
  variant?: CardVariant;
  hoverable?: boolean;
  loading?: boolean;
  size?: "default" | "small";
  /** Inner card style: grey head, used when nesting */
  type?: "inner";
  /** Tabs rendered under the head. */
  tabList?: CardTabItem[];
  activeTabKey?: string;
  defaultActiveTabKey?: string;
  onTabChange?: (key: string) => void;
  tabBarExtraContent?: React.ReactNode;
  classNames?: CardSlots<string>;
  styles?: CardSlots<React.CSSProperties>;
}

const CardSizeContext = React.createContext<"default" | "small">("default");

/** True when the card's children are Card.Grid tiles, which need a flush body. */
function hasGridChildren(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && (child.type as { displayName?: string })?.displayName === "CardGrid",
  );
}

function Card({
  className,
  title,
  extra,
  cover,
  actions,
  bordered,
  variant,
  hoverable = false,
  loading = false,
  size = "default",
  type,
  tabList,
  activeTabKey,
  defaultActiveTabKey,
  onTabChange,
  tabBarExtraContent,
  classNames,
  styles,
  children,
  ...props
}: CardProps) {
  const hasHead = title != null || extra != null;
  const isBordered = variant ? variant === "outlined" : bordered !== false;
  // Card.Grid tiles draw their own separators, so the body must not add padding
  const gridBody = React.useMemo(() => hasGridChildren(children), [children]);

  const [innerTabKey, setInnerTabKey] = React.useState(defaultActiveTabKey ?? tabList?.[0]?.key);
  const currentTabKey = activeTabKey ?? innerTabKey;

  const selectTab = (key: string) => {
    if (activeTabKey === undefined) setInnerTabKey(key);
    onTabChange?.(key);
  };
  return (
    <CardSizeContext.Provider value={size}>
    <div
      data-slot="card"
      className={cn(
        "relative rounded-lg bg-bg-container text-text",
        isBordered && "border border-border-secondary",
        hoverable && "kk-lift cursor-pointer",
        hoverable && isBordered && "hover:border-transparent",
        className,
      )}
      {...props}
    >
      {cover && (
        <div
          data-slot="card-cover"
          style={styles?.cover}
          className={cn("overflow-hidden rounded-t-lg [&>*]:block [&>*]:w-full", classNames?.cover)}
        >
          {cover}
        </div>
      )}
      {hasHead && (
        <div
          data-slot="card-head"
          style={styles?.head}
          className={cn(
            "flex items-center border-b border-border-secondary font-semibold text-text-heading",
            size === "small" ? "min-h-[38px] px-3 py-1 text-sm" : "min-h-14 px-6 py-2 text-base",
            type === "inner" && "bg-fill-alter",
            tabList && tabList.length > 0 && "border-b-0 pb-0",
            classNames?.head,
          )}
        >
          <div className="min-w-0 flex-1 truncate">{title}</div>
          {extra != null && <div className="ml-auto shrink-0 text-sm font-normal text-text">{extra}</div>}
        </div>
      )}
      {tabList && tabList.length > 0 && (
        <div
          data-slot="card-tabs"
          style={styles?.tabs}
          className={cn(
            "flex items-center gap-4 border-b border-border-secondary",
            size === "small" ? "px-3" : "px-6",
            classNames?.tabs,
          )}
          role="tablist"
        >
          <div className="flex flex-1 gap-4 overflow-x-auto">
            {tabList.map((tab) => {
              const active = tab.key === currentTabKey;
              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  disabled={tab.disabled}
                  onClick={() => selectTab(tab.key)}
                  className={cn(
                    "relative whitespace-nowrap py-3 text-sm font-medium transition-colors",
                    active ? "text-primary" : "text-text-secondary hover:text-text",
                    tab.disabled && "cursor-not-allowed text-text-disabled hover:text-text-disabled",
                  )}
                >
                  {tab.label}
                  {active && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" />}
                </button>
              );
            })}
          </div>
          {tabBarExtraContent && <div className="shrink-0 text-sm">{tabBarExtraContent}</div>}
        </div>
      )}

      <div
        data-slot="card-body"
        style={styles?.body}
        className={cn(
          gridBody ? "flex flex-wrap p-0" : size === "small" ? "p-3" : "p-6",
          classNames?.body,
        )}
      >
        {loading ? <CardSkeleton /> : children}
      </div>
      {actions && actions.length > 0 && (
        <ul
          data-slot="card-actions"
          style={styles?.actions}
          className={cn("flex border-t border-border-secondary", classNames?.actions)}
        >
          {actions.map((a, i) => (
            <li
              key={i}
              className="flex flex-1 items-center justify-center py-3 text-text-tertiary transition-colors hover:text-primary [&:not(:last-child)]:border-r [&:not(:last-child)]:border-border-secondary [&_svg]:size-4"
            >
              {a}
            </li>
          ))}
        </ul>
      )}
    </div>
    </CardSizeContext.Provider>
  );
}

function CardSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-4 w-11/12 rounded bg-fill-secondary" />
      <div className="h-4 w-full rounded bg-fill-secondary" />
      <div className="h-4 w-8/12 rounded bg-fill-secondary" />
    </div>
  );
}

export interface CardGridProps extends React.ComponentProps<"div"> {
  hoverable?: boolean;
  /** Tiles per row; the width is derived from it. Defaults to 3. */
  columns?: number;
}

/** Card.Grid — tiles inside a card, hover raises the tile. */
function CardGrid({ className, hoverable = true, columns = 3, style, ...props }: CardGridProps) {
  const size = React.useContext(CardSizeContext);
  return (
    <div
      data-slot="card-grid"
      style={{ width: `${100 / Math.max(1, columns)}%`, ...style }}
      className={cn(
        "shadow-[1px_0_0_0_var(--kk-border-secondary),0_1px_0_0_var(--kk-border-secondary),1px_1px_0_0_var(--kk-border-secondary),1px_0_0_0_var(--kk-border-secondary)_inset,0_1px_0_0_var(--kk-border-secondary)_inset]",
        size === "small" ? "p-3" : "p-6",
        hoverable && "transition-shadow duration-mid ease-kk-in-out hover:relative hover:z-10 hover:shadow-kk-card",
        className,
      )}
      {...props}
    />
  );
}

CardGrid.displayName = "CardGrid";

/** Card.Meta — avatar + title + description row. */
function CardMeta({
  avatar,
  title,
  description,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & { avatar?: React.ReactNode; title?: React.ReactNode; description?: React.ReactNode }) {
  return (
    <div data-slot="card-meta" className={cn("flex gap-4", className)} {...props}>
      {avatar && <div className="shrink-0">{avatar}</div>}
      <div className="min-w-0 flex-1">
        {title && <div className="truncate font-semibold text-text-heading">{title}</div>}
        {description && <div className="text-text-description">{description}</div>}
      </div>
    </div>
  );
}

Card.Grid = CardGrid;
Card.Meta = CardMeta;

export { Card, CardGrid, CardMeta };
