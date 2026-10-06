import * as React from "react";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Layout — KKUI page scaffolding: Layout / LayoutHeader / LayoutSider /
 * LayoutContent / LayoutFooter. `Layout` detects a `LayoutSider` child and switches
 * to a row direction. Sider supports collapsible / breakpoint / theme / trigger.
 *
 * Dark sider/header colour is KKUI's #001529, exposed as `--kk-layout-sider-bg`
 * so consumers can retheme it with a single CSS variable.
 */

const LAYOUT_DARK_BG = "var(--kk-layout-sider-bg, #001529)";
const LAYOUT_TRIGGER_BG = "var(--kk-layout-trigger-bg, #002140)";

/* --------------------------------- context -------------------------------- */

interface LayoutContextValue {
  siderHook: {
    addSider: (id: string) => void;
    removeSider: (id: string) => void;
  };
}
const LayoutContext = React.createContext<LayoutContextValue | null>(null);

/* --------------------------------- Layout --------------------------------- */

export interface LayoutProps extends React.ComponentProps<"section"> {
  /** Force row direction (auto-detected when a `LayoutSider` child exists) */
  hasSider?: boolean;
}

function Layout({ className, hasSider, children, ...props }: LayoutProps) {
  const [siders, setSiders] = React.useState<string[]>([]);
  const ctx = React.useMemo<LayoutContextValue>(
    () => ({
      siderHook: {
        addSider: (id) => setSiders((prev) => (prev.includes(id) ? prev : [...prev, id])),
        removeSider: (id) => setSiders((prev) => prev.filter((s) => s !== id)),
      },
    }),
    [],
  );
  const isRow = hasSider ?? siders.length > 0;
  return (
    <LayoutContext.Provider value={ctx}>
      <section
        data-slot="layout"
        data-has-sider={isRow || undefined}
        className={cn("flex min-h-0 flex-auto bg-bg-layout text-text", isRow ? "flex-row" : "flex-col", className)}
        {...props}
      >
        {children}
      </section>
    </LayoutContext.Provider>
  );
}

/* --------------------------------- Header --------------------------------- */

function LayoutHeader({ className, style, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="layout-header"
      className={cn("flex h-16 shrink-0 items-center px-12 leading-[64px] text-white", className)}
      style={{ background: LAYOUT_DARK_BG, ...style }}
      {...props}
    />
  );
}

/* --------------------------------- Content -------------------------------- */

function LayoutContent({ className, ...props }: React.ComponentProps<"main">) {
  return <main data-slot="layout-content" className={cn("min-h-0 flex-auto", className)} {...props} />;
}

/* --------------------------------- Footer --------------------------------- */

function LayoutFooter({ className, ...props }: React.ComponentProps<"footer">) {
  return <footer data-slot="layout-footer" className={cn("shrink-0 bg-bg-layout px-12 py-6 text-sm text-text", className)} {...props} />;
}

/* ---------------------------------- Sider --------------------------------- */

export type SiderTheme = "light" | "dark";
export type SiderBreakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

const breakpointMap: Record<SiderBreakpoint, string> = {
  xs: "479.98px",
  sm: "575.98px",
  md: "767.98px",
  lg: "991.98px",
  xl: "1199.98px",
  xxl: "1599.98px",
};

export interface LayoutSiderProps extends React.ComponentProps<"aside"> {
  /** Breakpoint at which the sider collapses (with `zeroWidth` behaviour when collapsedWidth = 0) */
  breakpoint?: SiderBreakpoint;
  /** Whether the sider can be collapsed */
  collapsible?: boolean;
  /** Controlled collapsed state */
  collapsed?: boolean;
  /** Initial collapsed state (uncontrolled) */
  defaultCollapsed?: boolean;
  /** Width when collapsed; 0 renders a special zero-width trigger */
  collapsedWidth?: number | string;
  /** Direction of the trigger arrow (place sider on the right) */
  reverseArrow?: boolean;
  /** Custom trigger element; `null` hides the default trigger */
  trigger?: React.ReactNode;
  /** Sider width */
  width?: number | string;
  /** Color theme */
  theme?: SiderTheme;
  /** Style of the zero-width trigger */
  zeroWidthTriggerStyle?: React.CSSProperties;
  onCollapse?: (collapsed: boolean, type: "clickTrigger" | "responsive") => void;
  onBreakpoint?: (broken: boolean) => void;
}

function LayoutSider({
  className,
  style,
  breakpoint,
  collapsible = false,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  collapsedWidth = 80,
  reverseArrow = false,
  trigger,
  width = 200,
  theme = "dark",
  zeroWidthTriggerStyle,
  onCollapse,
  onBreakpoint,
  children,
  ...props
}: LayoutSiderProps) {
  const layoutCtx = React.useContext(LayoutContext);
  const id = React.useId();
  const [inner, setInner] = React.useState(defaultCollapsed);
  const collapsed = collapsedProp ?? inner;
  const [below, setBelow] = React.useState(false);

  React.useEffect(() => {
    if (!layoutCtx) return;
    layoutCtx.siderHook.addSider(id);
    return () => layoutCtx.siderHook.removeSider(id);
  }, [layoutCtx, id]);

  const handleSetCollapsed = React.useCallback(
    (value: boolean, type: "clickTrigger" | "responsive") => {
      if (collapsedProp === undefined) setInner(value);
      onCollapse?.(value, type);
    },
    [collapsedProp, onCollapse],
  );

  const responsiveRef = React.useRef(handleSetCollapsed);
  responsiveRef.current = handleSetCollapsed;
  const onBreakpointRef = React.useRef(onBreakpoint);
  onBreakpointRef.current = onBreakpoint;

  React.useEffect(() => {
    if (!breakpoint || typeof window === "undefined") return;
    const mql = window.matchMedia(`(max-width: ${breakpointMap[breakpoint]})`);
    const handle = (e: MediaQueryList | MediaQueryListEvent) => {
      setBelow(e.matches);
      onBreakpointRef.current?.(e.matches);
      responsiveRef.current(e.matches, "responsive");
    };
    handle(mql);
    mql.addEventListener("change", handle);
    return () => mql.removeEventListener("change", handle);
  }, [breakpoint]);

  const toggle = () => handleSetCollapsed(!collapsed, "clickTrigger");

  const rawWidth = collapsed ? collapsedWidth : width;
  const siderWidth = typeof rawWidth === "number" ? `${rawWidth}px` : rawWidth;
  const isZeroWidth = parseFloat(String(collapsedWidth || 0)) === 0;
  const isDark = theme === "dark";

  const iconOpen = reverseArrow ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />;
  const iconClosed = reverseArrow ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />;

  let triggerNode: React.ReactNode = null;
  if (isZeroWidth) {
    // The zero-width trigger is the only way back once the sider is 0px wide, so
    // `trigger={null}` (which hides the bottom trigger) must not remove it.
    if (collapsible || below) {
      triggerNode = (
        <button
          type="button"
          data-slot="layout-sider-zero-width-trigger"
          aria-label={collapsed ? "Expand sider" : "Collapse sider"}
          onClick={toggle}
          className={cn(
            "absolute top-16 z-10 flex size-10 items-center justify-center text-lg transition-colors duration-mid",
            reverseArrow ? "-left-10 rounded-l-md" : "-right-10 rounded-r-md",
            isDark ? "text-white" : "border border-l-0 border-border-secondary bg-bg-container text-text",
          )}
          style={isDark ? { background: LAYOUT_DARK_BG, ...zeroWidthTriggerStyle } : zeroWidthTriggerStyle}
        >
          {trigger ?? <Menu className="size-4" />}
        </button>
      );
    }
  } else if (collapsible && trigger !== null) {
    triggerNode = (
      <button
        type="button"
        data-slot="layout-sider-trigger"
        aria-label={collapsed ? "Expand sider" : "Collapse sider"}
        onClick={toggle}
        className={cn(
          "absolute bottom-0 left-0 z-10 flex h-12 cursor-pointer items-center justify-center text-center transition-all duration-mid ease-kk-in-out",
          isDark ? "text-white" : "border-t border-border-secondary bg-bg-container text-text",
        )}
        style={{ width: siderWidth, ...(isDark ? { background: LAYOUT_TRIGGER_BG } : null) }}
      >
        {trigger ?? (collapsed ? iconClosed : iconOpen)}
      </button>
    );
  }

  const hasTrigger = triggerNode != null && !isZeroWidth;

  return (
    <aside
      data-slot="layout-sider"
      data-collapsed={collapsed || undefined}
      data-theme={theme}
      data-below-breakpoint={below || undefined}
      className={cn(
        "relative min-w-0 transition-all duration-mid ease-kk-in-out",
        isDark ? "text-white" : "bg-bg-container text-text",
        hasTrigger && "pb-12",
        className,
      )}
      style={{
        flex: `0 0 ${siderWidth}`,
        maxWidth: siderWidth,
        minWidth: siderWidth,
        width: siderWidth,
        ...(isDark ? { background: LAYOUT_DARK_BG } : null),
        ...style,
      }}
      {...props}
    >
      <div data-slot="layout-sider-children" className={cn("h-full", isZeroWidth && collapsed && "overflow-hidden")}>
        {children}
      </div>
      {triggerNode}
    </aside>
  );
}

/** Flat exports stay the primary API; the statics mirror `Layout.Header` & co. */
const LayoutRoot = Object.assign(Layout, {
  Header: LayoutHeader,
  Sider: LayoutSider,
  Content: LayoutContent,
  Footer: LayoutFooter,
});

export { LayoutRoot as Layout, LayoutHeader, LayoutSider, LayoutContent, LayoutFooter };
