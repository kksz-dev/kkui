import * as React from "react";
import { cn } from "@/lib/utils";

export interface BottomNavItem {
  key: string;
  label?: React.ReactNode;
  icon: React.ReactNode;
  /** Icon swapped in while the item is active. */
  activeIcon?: React.ReactNode;
  badge?: React.ReactNode;
  /** Accessible text for the badge, e.g. "9 unread messages". */
  badgeLabel?: string;
  /** Accessible item name when the label is hidden or omitted. */
  ariaLabel?: string;
  href?: string;
  disabled?: boolean;
}

export interface BottomNavProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  items: BottomNavItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string, item: BottomNavItem) => void;
  /** Pin to the bottom of the viewport. */
  fixed?: boolean;
  /** Pad for the home indicator on iOS. */
  safeArea?: boolean;
  /** Hide the labels and show icons only. */
  iconOnly?: boolean;
  linkRender?: (item: BottomNavItem, children: React.ReactNode) => React.ReactNode;
  className?: string;
}

export interface BottomNavSpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Include room for the iOS home indicator. */
  safeArea?: boolean;
}

export function BottomNavSpacer({ safeArea = true, className, style, ...props }: BottomNavSpacerProps) {
  return (
    <div
      {...props}
      data-slot="bottom-nav-spacer"
      aria-hidden="true"
      className={cn("shrink-0", className)}
      style={{
        height: safeArea ? "calc(3.5rem + 1px + env(safe-area-inset-bottom))" : "calc(3.5rem + 1px)",
        ...style,
      }}
    />
  );
}

export function BottomNav(bottomNavProps: BottomNavProps) {
  const {
    items = [],
    activeKey: activeKeyProp,
    defaultActiveKey,
    onChange,
    fixed = true,
    safeArea = true,
    iconOnly = false,
    linkRender,
    className,
    style,
    "aria-label": ariaLabel = "Bottom navigation",
    ...props
  } = bottomNavProps;
  const [innerActive, setInnerActive] = React.useState(defaultActiveKey);
  const isControlled = React.useRef(Object.prototype.hasOwnProperty.call(bottomNavProps, "activeKey")).current;
  const validInnerActive = items.some((item) => item.key === innerActive && !item.disabled);
  const activeKey = isControlled
    ? activeKeyProp
    : validInnerActive
      ? innerActive
      : items.find((item) => !item.disabled)?.key;
  const badgeIdPrefix = React.useId();

  const select = (item: BottomNavItem) => {
    if (item.disabled) return;
    if (!isControlled) setInnerActive(item.key);
    onChange?.(item.key, item);
  };

  return (
    <nav
      {...props}
      data-slot="bottom-nav"
      aria-label={ariaLabel}
      className={cn(
        "z-30 flex w-full items-stretch border-t border-border-secondary bg-bg-container",
        fixed && "fixed inset-x-0 bottom-0",
        className,
      )}
      style={{
        ...(safeArea ? { paddingBottom: "env(safe-area-inset-bottom)" } : undefined),
        ...style,
      }}
    >
      {items.map((item, index) => {
        const isActive = item.key === activeKey;
        const badgeId = item.badge != null ? `${badgeIdPrefix}-${index}-badge` : undefined;
        const badgeLabel = item.badgeLabel
          ?? (typeof item.badge === "string" || typeof item.badge === "number"
            ? `${item.badge} notifications`
            : "Notifications");
        const itemClassName = cn(
          "kk-press relative flex h-14 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 py-1 text-[11px] transition-colors duration-mid",
          "outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-primary/30",
          isActive ? "text-primary" : item.disabled ? "text-text-tertiary" : "text-text-tertiary hover:text-text",
          item.disabled && "cursor-not-allowed opacity-40",
        );
        const content = (
          <>
            <span
              className={cn(
                "relative flex size-6 items-center justify-center transition-transform duration-mid ease-kk-spring-snap [&_svg]:size-5",
                isActive && "-translate-y-0.5 scale-110",
              )}
            >
              {isActive ? (item.activeIcon ?? item.icon) : item.icon}
              {item.badge != null && (
                <span
                  aria-hidden="true"
                  className="absolute -top-1 -right-1.5 min-w-4 rounded-full bg-error px-1 text-[10px] leading-4 text-white"
                >
                  {item.badge}
                </span>
              )}
            </span>
            {iconOnly
              ? item.label != null && <span className="sr-only">{item.label}</span>
              : item.label != null && <span className="max-w-full truncate">{item.label}</span>}
            {badgeId && (
              <span id={badgeId} className="sr-only" aria-live="polite">
                {badgeLabel}
              </span>
            )}
          </>
        );
        const itemAriaLabel = item.ariaLabel ?? (item.label == null ? item.key : undefined);
        const commonProps = {
          "data-slot": "bottom-nav-item",
          "data-active": isActive || undefined,
          "data-disabled": item.disabled || undefined,
          "aria-current": isActive ? ("page" as const) : undefined,
          "aria-label": itemAriaLabel,
          // Without an explicit name the sr-only badge text is already part of the
          // accessible name, so describing with it again would announce it twice.
          "aria-describedby": itemAriaLabel != null ? badgeId : undefined,
          className: itemClassName,
        };
        const row = (
          <button
            key={item.key}
            type="button"
            {...commonProps}
            disabled={item.disabled}
            onClick={() => select(item)}
          >
            {content}
          </button>
        );

        if (item.disabled) return row;
        if (linkRender && item.href) {
          const linked = linkRender(item, content);
          if (!React.isValidElement<React.HTMLAttributes<HTMLElement>>(linked) || linked.type === React.Fragment) {
            return <React.Fragment key={item.key}>{linked}</React.Fragment>;
          }
          const originalOnClick = linked.props.onClick;
          return (
            <React.Fragment key={item.key}>
              {React.cloneElement(linked, {
                ...commonProps,
                className: cn(itemClassName, linked.props.className),
                onClick: (event: React.MouseEvent<HTMLElement>) => {
                  originalOnClick?.(event);
                  if (!event.defaultPrevented) select(item);
                },
              } as React.HTMLAttributes<HTMLElement>)}
            </React.Fragment>
          );
        }
        if (item.href) {
          return (
            <a key={item.key} {...commonProps} href={item.href} onClick={() => select(item)}>
              {content}
            </a>
          );
        }
        return row;
      })}
    </nav>
  );
}
