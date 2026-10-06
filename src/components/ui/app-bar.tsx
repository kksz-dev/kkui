import * as React from "react";
import { Menu as MenuIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AppBarItem {
  key: string;
  label: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface AppBarProps extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect" | "title"> {
  logo?: React.ReactNode;
  title?: React.ReactNode;
  items?: AppBarItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onSelect?: (key: string, item: AppBarItem) => void;
  /** Right-hand slot: search, theme switch, avatar. */
  actions?: React.ReactNode;
  /** Hamburger on the left; omit the handler to hide it. */
  onMenuClick?: () => void;
  menuIcon?: React.ReactNode;
  /** Controlled open state of the navigation disclosed by the hamburger. */
  menuOpen?: boolean;
  /** Accessible label for the hamburger. Defaults to an open/close label. */
  menuLabel?: string;
  /** Id of the navigation controlled by the hamburger. */
  menuId?: string;
  /** Render a caller-owned mobile menu with the same items and selection logic. */
  renderMobileMenu?: (
    items: AppBarItem[],
    activeKey: string | undefined,
    select: (item: AppBarItem) => void,
  ) => React.ReactNode;
  sticky?: boolean;
  bordered?: boolean;
  /** Transparent until the page scrolls, then it fills in. */
  transparent?: boolean;
  /** Scroll source used by a transparent bar. Defaults to `window`. */
  scrollTarget?: () => Window | HTMLElement;
  /** Frost the bar once it has a background. */
  blur?: boolean;
  height?: number;
  linkRender?: (item: AppBarItem, children: React.ReactNode) => React.ReactNode;
  className?: string;
}

export function AppBar(appBarProps: AppBarProps) {
  const {
    logo,
    title,
    items = [],
    activeKey: activeKeyProp,
    defaultActiveKey,
    onSelect,
    actions,
    onMenuClick,
    menuIcon,
    menuOpen,
    menuLabel,
    menuId,
    renderMobileMenu,
    sticky = true,
    bordered = true,
    transparent = false,
    scrollTarget,
    blur = true,
    height = 56,
    linkRender,
    className,
    style,
    ...props
  } = appBarProps;
  const [innerActive, setInnerActive] = React.useState(defaultActiveKey);
  const isControlled = React.useRef(Object.prototype.hasOwnProperty.call(appBarProps, "activeKey")).current;
  const activeKey = isControlled ? activeKeyProp : innerActive;
  const [scrolled, setScrolled] = React.useState(false);
  const scrolledRef = React.useRef(false);

  React.useEffect(() => {
    if (!transparent) return;
    const rawTarget = scrollTarget?.();
    const target = rawTarget && "addEventListener" in rawTarget ? rawTarget : window;
    let frame: number | undefined;

    const update = () => {
      frame = undefined;
      const next = "scrollTop" in target ? target.scrollTop > 8 : window.scrollY > 8;
      if (next === scrolledRef.current) return;
      scrolledRef.current = next;
      setScrolled(next);
    };
    const onScroll = () => {
      if (frame === undefined) frame = window.requestAnimationFrame(update);
    };

    update();
    target.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      target.removeEventListener("scroll", onScroll, true);
      if (frame !== undefined) window.cancelAnimationFrame(frame);
    };
  }, [scrollTarget, transparent]);

  const filled = !transparent || scrolled;

  const select = (item: AppBarItem) => {
    if (item.disabled) return;
    if (!isControlled) setInnerActive(item.key);
    onSelect?.(item.key, item);
  };

  return (
    <>
      <header
        {...props}
        data-slot="app-bar"
        data-filled={filled || undefined}
        className={cn(
          "top-0 z-30 flex w-full items-center gap-3 px-4 transition-colors duration-mid",
          sticky && "sticky",
          filled ? "bg-bg-container/95 text-text" : "bg-transparent",
          filled && blur && "supports-[backdrop-filter]:bg-bg-container/80 supports-[backdrop-filter]:backdrop-blur",
          filled && bordered && "border-b border-border-secondary",
          className,
        )}
        style={{ height, ...style }}
      >
        {onMenuClick && (
          <button
            type="button"
            data-slot="app-bar-menu"
            aria-label={menuLabel ?? (menuOpen ? "Close navigation" : "Open navigation")}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={onMenuClick}
            className="kk-press -ml-1 flex size-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-fill-tertiary hover:text-text outline-none focus-visible:ring-[3px] focus-visible:ring-primary/30"
          >
            {menuIcon ?? <MenuIcon className="size-5" />}
          </button>
        )}

        {(logo || title) && (
          <div data-slot="app-bar-brand" className="flex min-w-0 shrink-0 items-center gap-2">
            {logo}
            {title && <span className="truncate text-base font-semibold text-text-heading">{title}</span>}
          </div>
        )}

        {items.length > 0 && (
          <nav
            data-slot="app-bar-nav"
            aria-label="Primary"
            className="kk-scrollbar ml-2 hidden min-w-0 flex-1 items-center gap-1 self-stretch overflow-x-auto md:flex"
          >
            {items.map((item) => {
              const isActive = item.key === activeKey;
              const itemClassName = cn(
                "kk-press relative flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition-colors duration-mid",
                "outline-none focus-visible:ring-[3px] focus-visible:ring-primary/30",
                isActive ? "text-primary" : "text-text-secondary hover:bg-fill-tertiary hover:text-text",
                item.disabled && "cursor-not-allowed opacity-40 hover:bg-transparent hover:text-text-secondary",
              );
              const content = (
                <>
                  {item.icon}
                  {item.label}
                  {isActive && (
                    <span aria-hidden className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary" />
                  )}
                </>
              );
              const row = (
                <button
                  key={item.key}
                  type="button"
                  data-slot="app-bar-item"
                  data-active={isActive || undefined}
                  data-disabled={item.disabled || undefined}
                  disabled={item.disabled}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => select(item)}
                  className={itemClassName}
                >
                  {content}
                </button>
              );

              if (!linkRender || !item.href || item.disabled) return row;
              const linked = linkRender(item, content);
              if (!React.isValidElement<React.HTMLAttributes<HTMLElement>>(linked) || linked.type === React.Fragment) {
                return <React.Fragment key={item.key}>{linked}</React.Fragment>;
              }
              const originalOnClick = linked.props.onClick;
              return (
                <React.Fragment key={item.key}>
                  {React.cloneElement(linked, {
                    "data-slot": "app-bar-item",
                    "data-active": isActive || undefined,
                    "aria-current": isActive ? "page" : undefined,
                    className: cn(itemClassName, linked.props.className),
                    onClick: (event: React.MouseEvent<HTMLElement>) => {
                      originalOnClick?.(event);
                      if (!event.defaultPrevented) select(item);
                    },
                  } as React.HTMLAttributes<HTMLElement>)}
                </React.Fragment>
              );
            })}
          </nav>
        )}

        <div data-slot="app-bar-actions" className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>
      </header>
      {renderMobileMenu?.(items, activeKey, select)}
    </>
  );
}
