import * as React from "react";
import { ChevronDown, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Portal } from "@/components/ui/portal";
import { Tooltip } from "@/components/ui/tooltip";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { computeFloatingPosition, measureFloating } from "@/lib/floating-position";

export interface AppSidebarContentItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  href?: string;
  badge?: React.ReactNode;
  disabled?: boolean;
  children?: AppSidebarItem[];
  type?: "item" | "group";
}

export type AppSidebarItem =
  | AppSidebarContentItem
  | {
      /** A divider has no selectable content, so neither key nor label is required. */
      type: "divider";
      key?: string;
      label?: React.ReactNode;
    };

export interface AppSidebarProps extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  items: AppSidebarItem[];
  /** Selected item key. */
  activeKey?: string;
  defaultActiveKey?: string;
  onSelect?: (key: string, item: AppSidebarContentItem) => void;
  /** Rail mode: icons only. */
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Show the collapse control at the bottom. */
  collapsible?: boolean;
  /** Rendering mode. Defaults to the mode inferred from the initial `open` prop. */
  mode?: "inline" | "drawer";
  /** Open state for drawer mode. The caller owns any responsive breakpoint. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
  collapsedWidth?: number;
  /** Render a row with your router link. Only used for leaf items with `href`. */
  linkRender?: (
    item: AppSidebarContentItem,
    children: React.ReactNode,
    anchorProps: React.AnchorHTMLAttributes<HTMLAnchorElement>,
  ) => React.ReactNode;
  className?: string;
}

type AppSidebarLinkElementProps = React.HTMLAttributes<HTMLElement> & {
  "data-slot"?: string;
  "data-active"?: boolean;
};

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** Keys of every ancestor of `key`, so the tree can open itself to the selection. */
function pathTo(items: AppSidebarItem[], key: string, trail: string[] = []): string[] | null {
  for (const item of items) {
    if (item.type === "divider") continue;
    if (item.key === key) return trail;
    if (item.children) {
      const found = pathTo(item.children, key, [...trail, item.key]);
      if (found) return found;
    }
  }
  return null;
}

function findItem(items: AppSidebarItem[], key: string): AppSidebarContentItem | null {
  for (const item of items) {
    if (item.type === "divider") continue;
    if (item.key === key) return item;
    const found = item.children ? findItem(item.children, key) : null;
    if (found) return found;
  }
  return null;
}

function keyId(key: string): string {
  return encodeURIComponent(key);
}

export function AppSidebar({
  items,
  activeKey: activeKeyProp,
  defaultActiveKey,
  onSelect,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  collapsible = true,
  mode,
  open,
  onOpenChange,
  header,
  footer,
  width = 248,
  collapsedWidth = 64,
  linkRender,
  className,
  style,
  ...props
}: AppSidebarProps) {
  const [innerActive, setInnerActive] = React.useState(defaultActiveKey);
  const isActiveControlled = React.useRef(activeKeyProp !== undefined).current;
  const activeKey = isActiveControlled ? activeKeyProp : innerActive;

  const [innerCollapsed, setInnerCollapsed] = React.useState(defaultCollapsed);
  const isCollapsedControlled = React.useRef(collapsedProp !== undefined).current;
  const collapsed = isCollapsedControlled ? (collapsedProp ?? false) : innerCollapsed;

  const inferredMode = React.useRef<"inline" | "drawer">(open === undefined ? "inline" : "drawer").current;
  const resolvedMode = mode ?? inferredMode;
  const drawerOpen = resolvedMode === "drawer" && Boolean(open);
  const sidebarId = React.useId();
  const panelRef = React.useRef<HTMLDivElement>(null);
  const lastActive = React.useRef<HTMLElement | null>(null);
  const onOpenChangeRef = React.useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  const [railPopupKey, setRailPopupKey] = React.useState<string | null>(null);
  const [railPopupPosition, setRailPopupPosition] = React.useState<{ top: number; left: number } | null>(null);
  const railAnchorRefs = React.useRef(new Map<string, HTMLButtonElement>());
  const railPopupRef = React.useRef<HTMLDivElement>(null);
  const railPopupItem = React.useMemo(
    () => (railPopupKey ? findItem(items, railPopupKey) : null),
    [items, railPopupKey],
  );

  const activePath = React.useMemo(
    () => (activeKey ? pathTo(items, activeKey) : null),
    [items, activeKey],
  );
  const activeTrail = React.useMemo(() => new Set(activePath ?? []), [activePath]);

  const [expanded, setExpanded] = React.useState<Set<string>>(() => new Set(activeKey ? (pathTo(items, activeKey) ?? []) : []));

  // keep the branch containing the selection open
  const expandedForActive = React.useRef<string | undefined>(undefined);
  React.useEffect(() => {
    if (!activeKey) {
      expandedForActive.current = undefined;
      return;
    }
    if (expandedForActive.current === activeKey || activePath === null) return;
    expandedForActive.current = activeKey;
    if (!activePath.length) return;
    setExpanded((prev) => {
      const missing = activePath.filter((key) => !prev.has(key));
      return missing.length ? new Set([...prev, ...missing]) : prev;
    });
  }, [activeKey, activePath]);

  const setCollapsed = (next: boolean) => {
    if (!isCollapsedControlled) setInnerCollapsed(next);
    onCollapsedChange?.(next);
  };

  const select = (item: AppSidebarContentItem) => {
    if (item.disabled) return;
    if (!isActiveControlled) setInnerActive(item.key);
    onSelect?.(item.key, item);
    setRailPopupKey(null);
    if (resolvedMode === "drawer") onOpenChange?.(false);
  };

  const toggle = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  React.useEffect(() => {
    if (!railPopupKey) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (railPopupRef.current?.contains(target) || railAnchorRefs.current.get(railPopupKey)?.contains(target)) return;
      setRailPopupKey(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [railPopupKey]);

  React.useEffect(() => {
    if (!collapsed) setRailPopupKey(null);
  }, [collapsed]);

  const updateRailPopupPosition = React.useCallback(() => {
    if (!railPopupKey || !railPopupRef.current) return;
    const anchor = railAnchorRefs.current.get(railPopupKey);
    if (!anchor) return;
    setRailPopupPosition(
      computeFloatingPosition(anchor.getBoundingClientRect(), measureFloating(railPopupRef.current), "rightTop", 4),
    );
  }, [railPopupKey]);

  React.useLayoutEffect(() => {
    if (!railPopupKey) return;
    updateRailPopupPosition();
    const update = () => updateRailPopupPosition();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [railPopupKey, railPopupItem, updateRailPopupPosition]);

  React.useEffect(() => {
    if (!drawerOpen && !railPopupKey) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      if (railPopupKey) {
        const anchor = railAnchorRefs.current.get(railPopupKey);
        setRailPopupKey(null);
        anchor?.focus();
      } else {
        onOpenChangeRef.current?.(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen, railPopupKey]);

  useScrollLock(drawerOpen);

  React.useEffect(() => {
    if (!drawerOpen) return;
    lastActive.current = document.activeElement as HTMLElement | null;
    const frame = requestAnimationFrame(() => panelRef.current?.focus());
    return () => {
      cancelAnimationFrame(frame);
      lastActive.current?.focus?.();
    };
  }, [drawerOpen]);

  const trapFocus = (event: React.KeyboardEvent) => {
    if (event.key !== "Tab") return;
    const roots = [panelRef.current, railPopupRef.current].filter(
      (node): node is HTMLDivElement => node !== null,
    );
    const nodes = roots.flatMap((root) =>
      Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (node) => node.offsetParent !== null && node.tabIndex >= 0,
      ),
    );
    if (!nodes.length) {
      event.preventDefault();
      panelRef.current?.focus();
      return;
    }
    const first = nodes[0]!;
    const last = nodes[nodes.length - 1]!;
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === panelRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const renderRow = (item: AppSidebarItem, depth: number, path: string, railMode = collapsed): React.ReactNode => {
    if (item.type === "divider") {
      return <li key={item.key ?? `divider-${path}`} role="separator" className="my-2 border-t border-sidebar-border" />;
    }

    if (item.type === "group") {
      return (
        <li key={item.key} className="mt-4 first:mt-0">
          {!railMode && (
            <div className="px-3 pb-1 text-xs font-medium text-sidebar-text/50">{item.label}</div>
          )}
          {item.children && (
            <ul className="space-y-0.5">
              {item.children.map((child, index) => renderRow(child, depth, `${path}-${index}`, railMode))}
            </ul>
          )}
        </li>
      );
    }

    const hasChildren = Boolean(item.children?.length);
    const isOpen = railMode ? railPopupKey === item.key : expanded.has(item.key);
    const isActive = item.key === activeKey;
    const activeInside = hasChildren && activeTrail.has(item.key);
    const submenuId = `${sidebarId}-${railMode ? "rail" : "submenu"}-${keyId(item.key)}`;
    const rowClassName = cn(
      "kk-press group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-mid",
      "text-sidebar-text/85 hover:bg-sidebar-hover hover:text-sidebar-text",
      (isActive || (activeInside && !isOpen)) && "bg-sidebar-active font-medium text-sidebar-active-text",
      item.disabled && "cursor-not-allowed opacity-40 hover:bg-transparent",
      railMode && "justify-center px-0",
    );
    const rowStyle = !railMode && depth > 0 ? { paddingLeft: 12 + depth * 14 } : undefined;
    const rowContent = (
      <>
        {isActive && (
          <span aria-hidden className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-sidebar-active-text" />
        )}
        {item.icon ? (
          <span className="flex size-5 shrink-0 items-center justify-center [&_svg]:size-4.5">{item.icon}</span>
        ) : railMode ? (
          <span aria-hidden className="flex size-5 shrink-0 items-center justify-center rounded bg-sidebar-hover text-xs font-semibold">
            {typeof item.label === "string" ? (item.label.trim().charAt(0).toUpperCase() || "•") : "•"}
          </span>
        ) : null}
        {!railMode && <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>}
        {!railMode && item.badge != null && <span className="shrink-0 text-xs text-sidebar-text/60">{item.badge}</span>}
        {!railMode && hasChildren && (
          <ChevronDown className={cn("size-4 shrink-0 transition-transform duration-mid", isOpen && "rotate-180")} />
        )}
      </>
    );

    const buttonRow = (
      <button
        ref={(node) => {
          if (!hasChildren) return;
          if (node) railAnchorRefs.current.set(item.key, node);
          else railAnchorRefs.current.delete(item.key);
        }}
        type="button"
        data-slot="app-sidebar-item"
        data-active={isActive || undefined}
        data-disabled={item.disabled || undefined}
        disabled={item.disabled}
        aria-disabled={item.disabled || undefined}
        aria-label={railMode && typeof item.label === "string" ? item.label : undefined}
        aria-current={isActive ? "page" : undefined}
        aria-expanded={hasChildren ? isOpen : undefined}
        aria-controls={hasChildren ? submenuId : undefined}
        onClick={(event) => {
          if (!hasChildren) select(item);
          else if (railMode) {
            const opening = railPopupKey !== item.key;
            setRailPopupKey(opening ? item.key : null);
            if (opening && event.detail === 0) {
              requestAnimationFrame(() =>
                railPopupRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus(),
              );
            }
          } else toggle(item.key);
        }}
        onKeyDown={(event) => {
          if (!railMode || !hasChildren || event.key !== "ArrowRight") return;
          event.preventDefault();
          setRailPopupKey(item.key);
          requestAnimationFrame(() =>
            railPopupRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus(),
          );
        }}
        className={rowClassName}
        style={rowStyle}
      >
        {rowContent}
      </button>
    );

    let row: React.ReactNode = buttonRow;
    if (!hasChildren && item.href && !item.disabled) {
      const anchorProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
        href: item.href,
        "aria-current": isActive ? "page" : undefined,
        "aria-label": railMode && typeof item.label === "string" ? item.label : undefined,
        className: rowClassName,
        style: rowStyle,
      };
      if (linkRender) {
        const rendered = linkRender(item, rowContent, { ...anchorProps, children: rowContent });
        if (React.isValidElement<AppSidebarLinkElementProps>(rendered) && rendered.type !== React.Fragment) {
          const renderedProps = rendered.props;
          row = React.cloneElement(rendered, {
            "data-slot": "app-sidebar-item",
            "data-active": isActive || undefined,
            "aria-current": renderedProps["aria-current"] ?? anchorProps["aria-current"],
            "aria-label": renderedProps["aria-label"] ?? anchorProps["aria-label"],
            className: cn(rowClassName, renderedProps.className),
            style: { ...rowStyle, ...renderedProps.style },
            onClick: (event: React.MouseEvent<HTMLElement>) => {
              renderedProps.onClick?.(event);
              if (!event.defaultPrevented) select(item);
            },
          });
        } else {
          row = rendered;
        }
      } else {
        row = (
          <a
            {...anchorProps}
            data-slot="app-sidebar-item"
            data-active={isActive || undefined}
            onClick={() => select(item)}
          >
            {rowContent}
          </a>
        );
      }
    }

    return (
      <li key={item.key}>
        {railMode ? (
          <Tooltip title={item.label} placement="right" className="block w-full">
            {row}
          </Tooltip>
        ) : (
          row
        )}

        {hasChildren && !railMode && (
          <div
            className={cn(
              "grid transition-[grid-template-rows] duration-mid ease-kk-spring-soft",
              isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <ul
              id={submenuId}
              inert={!isOpen}
              aria-hidden={!isOpen || undefined}
              className="space-y-0.5 overflow-hidden"
            >
              {item.children!.map((child, index) => renderRow(child, depth + 1, `${path}-${index}`, false))}
            </ul>
          </div>
        )}
      </li>
    );
  };

  const body = (
    <nav
      data-slot="app-sidebar"
      data-collapsed={collapsed || undefined}
      {...props}
      aria-label={props["aria-label"] ?? "Sidebar"}
      className={cn(
        "flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-text",
        "transition-[width] duration-mid ease-kk-spring-soft",
        className,
      )}
      style={{ width: collapsed ? collapsedWidth : width, ...style }}
    >
      {header && (
        <div data-slot="app-sidebar-header" className={cn("flex h-14 shrink-0 items-center gap-2 px-3", collapsed && "justify-center px-0")}>
          {header}
        </div>
      )}

      <div className="kk-scrollbar min-h-0 flex-1 overflow-y-auto p-2">
        <ul className="space-y-0.5">{items.map((item, index) => renderRow(item, 0, String(index)))}</ul>
      </div>

      {footer && <div data-slot="app-sidebar-footer" className="shrink-0 border-t border-sidebar-border p-2">{footer}</div>}

      {collapsible && (!isCollapsedControlled || onCollapsedChange) && (
        <button
          type="button"
          data-slot="app-sidebar-trigger"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed(!collapsed)}
          className="kk-press flex h-10 shrink-0 items-center justify-center border-t border-sidebar-border text-sidebar-text/60 transition-colors hover:bg-sidebar-hover hover:text-sidebar-text"
        >
          {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
        </button>
      )}
    </nav>
  );

  const railPopup = railPopupItem?.children?.length ? (
    <Portal>
      <div
        ref={railPopupRef}
        id={`${sidebarId}-rail-${keyId(railPopupItem.key)}`}
        data-slot="app-sidebar-popup"
        role="navigation"
        aria-label={typeof railPopupItem.label === "string" ? railPopupItem.label : "Sidebar submenu"}
        onKeyDown={trapFocus}
        className="z-1050 min-w-44 rounded-lg border border-border bg-sidebar p-1 text-sidebar-text shadow-kk-secondary outline-none"
        style={{
          position: "absolute",
          top: railPopupPosition?.top ?? -9999,
          left: railPopupPosition?.left ?? -9999,
        }}
      >
        <ul className="space-y-0.5">
          {railPopupItem.children.map((item, index) => renderRow(item, 1, `rail-${index}`, false))}
        </ul>
      </div>
    </Portal>
  ) : null;

  if (resolvedMode === "inline") {
    return (
      <>
        {body}
        {railPopup}
      </>
    );
  }

  return (
    <>
      <Portal>
        <div
          data-slot="app-sidebar-overlay"
          inert={!drawerOpen}
          className={cn(
            "fixed inset-0 z-1040 transition-opacity duration-mid",
            drawerOpen ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <div
            data-slot="app-sidebar-mask"
            aria-hidden="true"
            className="absolute inset-0 bg-bg-mask"
            onClick={() => onOpenChange?.(false)}
          />
          <div
            ref={panelRef}
            data-slot="app-sidebar-panel"
            role="dialog"
            aria-modal="true"
            aria-label={props["aria-label"] ?? "Sidebar"}
            tabIndex={-1}
            onKeyDown={trapFocus}
            className={cn(
              "absolute inset-y-0 left-0 outline-none transition-transform duration-mid ease-kk-spring-soft",
              drawerOpen ? "translate-x-0" : "-translate-x-full",
            )}
          >
            {body}
          </div>
        </div>
      </Portal>
      {railPopup}
    </>
  );
}
