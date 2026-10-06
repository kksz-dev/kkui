import * as React from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Ellipsis, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useConfig, type DirectionType } from "@/components/ui/config-provider";

export type TabPosition = "top" | "bottom" | "left" | "right";
export type TabType = "line" | "card" | "editable-card";
export type TabSize = "sm" | "md" | "lg" | "small" | "middle" | "large";
export type TabEditAction = "add" | "remove";
export type TabEditTarget = string | React.MouseEvent | React.KeyboardEvent;

export interface TabsIndicator {
  /** Ink bar length: a fixed px value, or a function of the tab length. */
  size?: number | ((origin: number) => number);
  /** Where the ink bar sits inside the tab when it is shorter than the tab. */
  align?: "start" | "center" | "end";
}

export interface TabItem {
  key: string;
  label?: React.ReactNode;
  children?: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  closable?: boolean;
  closeIcon?: React.ReactNode;
  /** Mount the pane immediately instead of on first activation. */
  forceRender?: boolean;
  destroyOnHidden?: boolean;
  className?: string;
}

export interface TabPaneProps extends Omit<TabItem, "label"> {
  tab?: React.ReactNode;
  children?: React.ReactNode;
}

/** Declarative alternative to `items` — collected by <Tabs>, never rendered itself. */
function TabPane(_props: TabPaneProps) {
  return null;
}

/** Everything the tab bar needs. Also the argument handed to `renderTabBar`. */
export interface TabBarProps {
  items: TabItem[];
  activeKey: string;
  onTabClick: (key: string, e: React.MouseEvent) => void;
  type: TabType;
  tabPosition: TabPosition;
  size: "sm" | "md" | "lg";
  centered: boolean;
  direction: DirectionType;
  /** Whether the ink bar transitions between tabs. */
  animated: boolean;
  indicator?: TabsIndicator;
  tabBarGutter?: number;
  hideAdd: boolean;
  addIcon?: React.ReactNode;
  removeIcon?: React.ReactNode;
  moreIcon?: React.ReactNode;
  popupClassName?: string;
  onEdit?: (target: TabEditTarget, action: TabEditAction) => void;
  extraLeft?: React.ReactNode;
  extraRight?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  items?: TabItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (activeKey: string) => void;
  onTabClick?: (key: string, e: React.MouseEvent) => void;
  type?: TabType;
  tabPosition?: TabPosition;
  size?: TabSize;
  centered?: boolean;
  animated?: boolean | { inkBar?: boolean; tabPane?: boolean };
  tabBarExtraContent?: React.ReactNode | { left?: React.ReactNode; right?: React.ReactNode };
  tabBarGutter?: number;
  tabBarStyle?: React.CSSProperties;
  indicator?: TabsIndicator;
  destroyOnHidden?: boolean;
  hideAdd?: boolean;
  addIcon?: React.ReactNode;
  /** Close icon of every closable tab (a tab's own `closeIcon` wins). */
  removeIcon?: React.ReactNode;
  /** Icon of the button that opens the hidden-tabs dropdown. */
  moreIcon?: React.ReactNode;
  /** Extra classes on the hidden-tabs dropdown. */
  popupClassName?: string;
  /** Replace the whole tab bar. Receives the resolved bar props and the default bar. */
  renderTabBar?: (props: TabBarProps, DefaultTabBar: React.ComponentType<TabBarProps>) => React.ReactNode;
  /** Writing direction. Defaults to the nearest ConfigProvider. */
  direction?: DirectionType;
  onEdit?: (target: TabEditTarget, action: TabEditAction) => void;
  children?: React.ReactNode;
}

function normalizeSize(size: TabSize = "md"): "sm" | "md" | "lg" {
  if (size === "small") return "sm";
  if (size === "large") return "lg";
  if (size === "middle") return "md";
  return size;
}

const SIZE_CLASS = {
  sm: "text-xs py-1.5 px-3",
  md: "text-sm py-2 px-4",
  lg: "text-base py-3 px-5",
} as const;

/* ------------------------------------------------------------------ */
/* Tab bar                                                             */
/* ------------------------------------------------------------------ */

/**
 * The default tab bar: a single measured ink bar that translates/resizes,
 * arrow scrolling and a dropdown listing the tabs scrolled out of view.
 */
function TabBar({
  items,
  activeKey,
  onTabClick,
  type,
  tabPosition,
  size,
  centered,
  direction,
  animated,
  indicator,
  tabBarGutter,
  hideAdd,
  addIcon,
  removeIcon,
  moreIcon,
  popupClassName,
  onEdit,
  extraLeft,
  extraRight,
  style,
  className,
}: TabBarProps) {
  const vertical = tabPosition === "left" || tabPosition === "right";
  const isCard = type === "card" || type === "editable-card";
  const isEditable = type === "editable-card";

  const wrapRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const moreRef = React.useRef<HTMLDivElement>(null);
  const tabRefs = React.useRef(new Map<string, HTMLButtonElement>());

  const [ink, setInk] = React.useState({ offset: 0, length: 0 });
  const [edges, setEdges] = React.useState({ overflow: false, atStart: true, atEnd: true });
  const [hiddenKeys, setHiddenKeys] = React.useState<string[]>([]);
  const [moreOpen, setMoreOpen] = React.useState(false);

  const closeMore = React.useCallback(() => setMoreOpen(false), []);
  useClickOutside(moreRef, closeMore, moreOpen);

  const measure = React.useCallback(() => {
    const wrap = wrapRef.current;
    const list = listRef.current;
    if (!wrap || !list) return;

    const viewport = vertical ? wrap.clientHeight : wrap.clientWidth;
    const content = vertical ? list.scrollHeight : list.scrollWidth;
    const scroll = vertical ? wrap.scrollTop : wrap.scrollLeft;
    const overflow = content - viewport > 1;
    setEdges({ overflow, atStart: scroll <= 1, atEnd: scroll + viewport >= content - 1 });

    const active = tabRefs.current.get(activeKey);
    if (active) {
      const origin = vertical ? active.offsetHeight : active.offsetWidth;
      const start = vertical ? active.offsetTop : active.offsetLeft;
      let length = origin;
      if (indicator?.size !== undefined) {
        length = typeof indicator.size === "function" ? indicator.size(origin) : indicator.size;
      }
      length = Math.max(0, length);
      let offset = start;
      if (indicator?.align === "center") offset = start + (origin - length) / 2;
      else if (indicator?.align === "end") offset = start + origin - length;
      setInk({ offset, length });
    } else {
      setInk({ offset: 0, length: 0 });
    }

    if (!overflow) {
      setHiddenKeys((prev) => (prev.length ? [] : prev));
      return;
    }
    const viewStart = scroll;
    const viewEnd = scroll + viewport;
    const hidden = items
      .filter((item) => {
        const el = tabRefs.current.get(item.key);
        if (!el) return false;
        const s = vertical ? el.offsetTop : el.offsetLeft;
        const e = s + (vertical ? el.offsetHeight : el.offsetWidth);
        return s < viewStart - 1 || e > viewEnd + 1;
      })
      .map((item) => item.key);
    setHiddenKeys((prev) => (prev.length === hidden.length && prev.every((k, i) => k === hidden[i]) ? prev : hidden));
  }, [activeKey, indicator, items, vertical]);

  React.useLayoutEffect(() => {
    measure();
  }, [measure, size, type, tabBarGutter, centered, direction]);

  React.useEffect(() => {
    const wrap = wrapRef.current;
    const list = listRef.current;
    if (!wrap || !list || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(wrap);
    observer.observe(list);
    return () => observer.disconnect();
  }, [measure]);

  /** Keep the active tab inside the scroll viewport. */
  React.useEffect(() => {
    const wrap = wrapRef.current;
    const el = tabRefs.current.get(activeKey);
    if (!wrap || !el) return;
    const start = vertical ? el.offsetTop : el.offsetLeft;
    const end = start + (vertical ? el.offsetHeight : el.offsetWidth);
    const scroll = vertical ? wrap.scrollTop : wrap.scrollLeft;
    const viewport = vertical ? wrap.clientHeight : wrap.clientWidth;
    let next = scroll;
    if (start < scroll) next = start;
    else if (end > scroll + viewport) next = end - viewport;
    if (next !== scroll) wrap.scrollTo(vertical ? { top: next, behavior: "smooth" } : { left: next, behavior: "smooth" });
  }, [activeKey, vertical]);

  const scrollBy = (dir: 1 | -1) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const step = (vertical ? wrap.clientHeight : wrap.clientWidth) * 0.8 * dir;
    wrap.scrollBy(vertical ? { top: step, behavior: "smooth" } : { left: step, behavior: "smooth" });
  };

  const arrowClass =
    "kk-press flex size-7 shrink-0 items-center justify-center self-center rounded-md text-text-tertiary transition-colors duration-fast hover:bg-fill-tertiary hover:text-text disabled:cursor-not-allowed disabled:text-text-disabled disabled:hover:bg-transparent";

  const PrevIcon = vertical ? ChevronUp : ChevronLeft;
  const NextIcon = vertical ? ChevronDown : ChevronRight;

  return (
    <div
      data-slot="tabs-nav"
      className={cn(
        "relative flex",
        vertical ? "flex-col items-stretch" : "flex-row items-stretch",
        tabPosition === "bottom" && "order-last",
        tabPosition === "right" && "order-last",
        className,
      )}
      style={style}
    >
      {/* Separator that the active card tab paints over. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute z-0 bg-border-secondary",
          !vertical && "inset-x-0 h-px",
          !vertical && (tabPosition === "bottom" ? "top-0" : "bottom-0"),
          vertical && "inset-y-0 w-px",
          vertical && (tabPosition === "right" ? "start-0" : "end-0"),
        )}
      />

      {extraLeft != null && <div className="z-10 shrink-0 self-center pe-2">{extraLeft}</div>}

      {edges.overflow && (
        <button type="button" aria-label="Scroll tabs backward" className={cn(arrowClass, "z-10")} disabled={edges.atStart} onClick={() => scrollBy(-1)}>
          <PrevIcon className="size-4" />
        </button>
      )}

      <div ref={wrapRef} onScroll={measure} className={cn("relative z-10 min-w-0 flex-1 overflow-hidden", vertical && "min-h-0")}>
        <div
          ref={listRef}
          role="tablist"
          aria-orientation={vertical ? "vertical" : "horizontal"}
          className={cn(
            "relative flex",
            vertical ? "min-h-full flex-col" : "w-max min-w-full flex-row",
            centered && "justify-center",
          )}
          style={{ gap: tabBarGutter }}
        >
          {items.map((item) => {
            const active = item.key === activeKey;
            const closable = item.closable ?? isEditable;
            return (
              <button
                key={item.key}
                ref={(el) => {
                  if (el) tabRefs.current.set(item.key, el);
                  else tabRefs.current.delete(item.key);
                }}
                role="tab"
                data-slot="tabs-tab"
                type="button"
                aria-selected={active}
                tabIndex={active ? 0 : -1}
                disabled={item.disabled}
                onClick={(e) => !item.disabled && onTabClick(item.key, e)}
                className={cn(
                  "relative flex shrink-0 cursor-pointer items-center gap-2 font-medium transition-colors duration-fast outline-none select-none focus-visible:ring-[3px] focus-visible:ring-primary/30",
                  SIZE_CLASS[size],
                  !isCard && (active ? "font-semibold text-primary" : "text-text-secondary hover:text-text"),
                  isCard && "border border-transparent",
                  isCard &&
                    (active
                      ? "border-border bg-bg-container font-semibold text-primary"
                      : "bg-fill-quaternary text-text hover:text-primary"),
                  isCard && tabPosition === "top" && "rounded-t-md",
                  isCard && tabPosition === "top" && active && "border-b-bg-container",
                  isCard && tabPosition === "bottom" && "rounded-b-md",
                  isCard && tabPosition === "bottom" && active && "border-t-bg-container",
                  isCard && tabPosition === "left" && "rounded-s-md",
                  isCard && tabPosition === "left" && active && "border-e-bg-container",
                  isCard && tabPosition === "right" && "rounded-e-md",
                  isCard && tabPosition === "right" && active && "border-s-bg-container",
                  item.disabled && "cursor-not-allowed text-text-disabled opacity-40",
                  item.className,
                )}
              >
                {item.icon}
                <span>{item.label}</span>
                {isEditable && closable && (
                  <span
                    role="button"
                    aria-label="Remove tab"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(item.key, "remove");
                    }}
                    className="ms-1 rounded-sm p-0.5 text-text-tertiary transition-colors duration-fast hover:bg-fill-tertiary hover:text-text"
                  >
                    {item.closeIcon ?? removeIcon ?? <X className="size-3" />}
                  </span>
                )}
              </button>
            );
          })}

          {!isCard && (
            <span
              data-slot="tabs-ink-bar"
              aria-hidden
              className={cn(
                "pointer-events-none absolute rounded-full bg-primary",
                !vertical && "left-0 h-0.5",
                !vertical && (tabPosition === "bottom" ? "top-0" : "bottom-0"),
                vertical && "top-0 w-0.5",
                vertical && (tabPosition === "right" ? "start-0" : "end-0"),
                animated && "transition-[transform,width,height] duration-mid ease-kk-in-out",
                ink.length === 0 && "opacity-0",
              )}
              style={
                vertical
                  ? { transform: `translateY(${ink.offset}px)`, height: ink.length }
                  : { transform: `translateX(${ink.offset}px)`, width: ink.length }
              }
            />
          )}
        </div>
      </div>

      {edges.overflow && (
        <button type="button" aria-label="Scroll tabs forward" className={cn(arrowClass, "z-10")} disabled={edges.atEnd} onClick={() => scrollBy(1)}>
          <NextIcon className="size-4" />
        </button>
      )}

      {hiddenKeys.length > 0 && (
        <div ref={moreRef} className="relative z-20 shrink-0 self-center">
          <button
            type="button"
            aria-label="More tabs"
            aria-expanded={moreOpen}
            className={cn(arrowClass, moreOpen && "bg-fill-tertiary text-text")}
            onClick={() => setMoreOpen((v) => !v)}
          >
            {moreIcon ?? <Ellipsis className="size-4" />}
          </button>
          {moreOpen && (
            <div
              className={cn(
                "kk-in kk-in-up absolute z-50 max-h-60 min-w-32 overflow-y-auto rounded-md border border-border-secondary bg-bg-elevated p-1 shadow-kk kk-scrollbar",
                vertical ? "start-full top-0 ms-1" : "end-0 top-full mt-1",
                popupClassName,
              )}
            >
              {items
                .filter((item) => hiddenKeys.includes(item.key))
                .map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    disabled={item.disabled}
                    onClick={(e) => {
                      if (item.disabled) return;
                      onTabClick(item.key, e);
                      setMoreOpen(false);
                    }}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-2 rounded-sm px-3 py-1.5 text-start text-sm transition-colors duration-fast hover:bg-fill-tertiary",
                      item.key === activeKey ? "bg-primary-bg font-medium text-primary" : "text-text",
                      item.disabled && "cursor-not-allowed text-text-disabled hover:bg-transparent",
                    )}
                  >
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
            </div>
          )}
        </div>
      )}

      {isEditable && !hideAdd && (
        <button
          type="button"
          aria-label="Add tab"
          onClick={(e) => onEdit?.(e, "add")}
          className="kk-press z-10 ms-1 flex size-7 shrink-0 items-center justify-center self-center rounded-md border border-dashed border-border text-text-tertiary transition-colors duration-fast hover:border-primary hover:text-primary"
        >
          {addIcon ?? <Plus className="size-3.5" />}
        </button>
      )}

      {extraRight != null && <div className="z-10 shrink-0 self-center ps-2">{extraRight}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tabs                                                                */
/* ------------------------------------------------------------------ */

function Tabs({
  items: itemsProp,
  activeKey: controlledKey,
  defaultActiveKey,
  onChange,
  onTabClick,
  type = "line",
  tabPosition = "top",
  size: sizeProp = "md",
  centered = false,
  animated = true,
  tabBarExtraContent,
  tabBarGutter,
  tabBarStyle,
  indicator,
  destroyOnHidden = false,
  hideAdd = false,
  addIcon,
  removeIcon,
  moreIcon,
  popupClassName,
  renderTabBar,
  direction: directionProp,
  onEdit,
  children,
  className,
  ...props
}: TabsProps) {
  const size = normalizeSize(sizeProp);
  const { direction: configDirection } = useConfig();
  const direction = directionProp ?? configDirection;

  const items: TabItem[] = React.useMemo(() => {
    if (itemsProp) return itemsProp;
    const derived: TabItem[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement<TabPaneProps>(child)) {
        const key = child.key != null ? String(child.key) : String(derived.length);
        derived.push({
          key,
          label: child.props.tab,
          children: child.props.children,
          disabled: child.props.disabled,
          icon: child.props.icon,
          closable: child.props.closable,
          closeIcon: child.props.closeIcon,
          forceRender: child.props.forceRender,
          destroyOnHidden: child.props.destroyOnHidden,
          className: child.props.className,
        });
      }
    });
    return derived;
  }, [itemsProp, children]);

  const firstValidKey = items.find((i) => !i.disabled)?.key ?? items[0]?.key ?? "";
  const [internalKey, setInternalKey] = React.useState<string>(defaultActiveKey ?? firstValidKey);
  const isControlled = controlledKey !== undefined;
  const currentKey = isControlled ? controlledKey : internalKey;

  const handleTabClick = (key: string, e: React.MouseEvent) => {
    onTabClick?.(key, e);
    if (key === currentKey) return;
    if (!isControlled) setInternalKey(key);
    onChange?.(key);
  };

  const inkBarAnimated = typeof animated === "boolean" ? animated : (animated.inkBar ?? true);
  const tabPaneAnimated = typeof animated === "boolean" ? animated : (animated.tabPane ?? true);

  const isExtraObject = typeof tabBarExtraContent === "object" && tabBarExtraContent !== null && !React.isValidElement(tabBarExtraContent);
  const extraLeft = isExtraObject ? (tabBarExtraContent as { left?: React.ReactNode }).left : null;
  const extraRight = isExtraObject ? (tabBarExtraContent as { right?: React.ReactNode }).right : tabBarExtraContent;

  const barProps: TabBarProps = {
    items,
    activeKey: currentKey,
    onTabClick: handleTabClick,
    type,
    tabPosition,
    size,
    centered,
    direction,
    animated: inkBarAnimated,
    indicator,
    tabBarGutter,
    hideAdd,
    addIcon,
    removeIcon,
    moreIcon,
    popupClassName,
    onEdit,
    extraLeft,
    extraRight,
    style: tabBarStyle,
  };

  /** Panes mount on first activation unless `forceRender` is enabled. */
  const mounted = React.useRef(new Set<string>());
  const isVertical = tabPosition === "left" || tabPosition === "right";
  const hasContent = items.some((item) => item.children != null);

  return (
    <div
      data-slot="tabs"
      data-position={tabPosition}
      data-type={type}
      data-size={size}
      dir={direction}
      className={cn("w-full text-text", className)}
      {...props}
    >
      <div className={cn("flex w-full", isVertical ? "flex-row gap-6" : "flex-col")}>
        {renderTabBar ? renderTabBar(barProps, TabBar) : <TabBar {...barProps} />}

        {hasContent && (
          <div
            className={cn(
              "min-w-0 flex-1",
              tabPosition === "top" && "pt-4",
              tabPosition === "bottom" && "pb-4",
            )}
          >
            {items.map((item) => {
              const active = item.key === currentKey;
              const destroy = item.destroyOnHidden ?? destroyOnHidden;
              if (active) mounted.current.add(item.key);
              else if (destroy) mounted.current.delete(item.key);
              if (!active && !item.forceRender && !mounted.current.has(item.key)) return null;
              return (
                <div
                  key={item.key}
                  role="tabpanel"
                  data-slot="tabs-panel"
                  aria-hidden={!active}
                  className={cn("outline-none", !active && "hidden", active && tabPaneAnimated && "kk-in kk-in-up")}
                >
                  {item.children}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

Tabs.TabPane = TabPane;

export { Tabs, TabPane, TabBar };
