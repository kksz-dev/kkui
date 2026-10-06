import * as React from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RibbonItem {
  key: string;
  icon?: React.ReactNode;
  label?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  /** Render the item large, the way a primary command sits in a real ribbon. */
  size?: "sm" | "lg";
}

export interface RibbonGroup {
  key: string;
  title?: React.ReactNode;
  /** Ready-made commands, or any node when a group needs a custom control. */
  items: (RibbonItem | React.ReactNode)[];
}

export interface RibbonTab {
  key: string;
  label: React.ReactNode;
  groups: RibbonGroup[];
  /** A contextual tab only shows while its feature is selected, and is tinted. */
  contextual?: boolean;
  /** Heading printed above a contextual tab. */
  contextualLabel?: React.ReactNode;
}

export interface RibbonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  tabs: RibbonTab[];
  defaultActiveKey?: string;
  activeKey?: string;
  onChange?: (key: string) => void;
  /** Commands pinned to the header, left of the tabs. */
  quickAccess?: React.ReactNode;
  /** Allow the command bar to be folded away. */
  collapsible?: boolean;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  className?: string;
}

function isRibbonItem(node: RibbonItem | React.ReactNode): node is RibbonItem {
  return Boolean(node) && typeof node === "object" && !React.isValidElement(node) && "key" in (node as RibbonItem);
}

function RibbonCommand({ item }: { item: RibbonItem }) {
  const large = item.size === "lg";
  return (
    <button
      type="button"
      disabled={item.disabled}
      aria-pressed={item.active}
      onClick={item.onClick}
      className={cn(
        "kk-press flex items-center justify-center rounded-md text-text transition-colors duration-fast",
        "hover:bg-fill-tertiary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        large ? "h-full w-16 flex-col gap-1 px-2 py-1 text-[11px]" : "h-8 gap-1.5 px-2 text-xs",
        item.active && "bg-primary-bg text-primary",
        item.disabled && "cursor-not-allowed text-text-disabled hover:bg-transparent",
      )}
    >
      {item.icon && <span className={cn("shrink-0", large && "text-lg")}>{item.icon}</span>}
      {item.label && <span className={cn(large && "leading-tight")}>{item.label}</span>}
    </button>
  );
}

export function Ribbon({
  tabs,
  defaultActiveKey,
  activeKey: controlledKey,
  onChange,
  quickAccess,
  collapsible = false,
  collapsed: controlledCollapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  className,
  ...props
}: RibbonProps) {
  const [innerKey, setInnerKey] = React.useState(defaultActiveKey ?? tabs[0]?.key);
  const requestedKey = controlledKey ?? innerKey;
  const [innerCollapsed, setInnerCollapsed] = React.useState(defaultCollapsed);
  const collapsed = controlledCollapsed ?? innerCollapsed;

  const uid = React.useId();
  const tabRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  // Fall back to the first tab when the requested key is gone (e.g. a contextual tab was removed).
  const currentTab = tabs.find((t) => t.key === requestedKey) ?? tabs[0];
  const activeKey = currentTab?.key;

  const handleTabChange = (key: string) => {
    if (controlledKey === undefined) setInnerKey(key);
    if (key !== activeKey) onChange?.(key);
    if (collapsed) setCollapsed(false);
  };

  const setCollapsed = (next: boolean) => {
    if (controlledCollapsed === undefined) setInnerCollapsed(next);
    onCollapsedChange?.(next);
  };

  const onTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    const last = tabs.length - 1;
    let nextIndex: number;
    if (e.key === "ArrowRight") nextIndex = index === last ? 0 : index + 1;
    else if (e.key === "ArrowLeft") nextIndex = index === 0 ? last : index - 1;
    else if (e.key === "Home") nextIndex = 0;
    else if (e.key === "End") nextIndex = last;
    else return;
    e.preventDefault();
    const next = tabs[nextIndex];
    handleTabChange(next.key);
    tabRefs.current[next.key]?.focus();
  };

  return (
    <div
      data-slot="ribbon"
      data-collapsed={collapsed || undefined}
      className={cn(
        "flex select-none flex-col overflow-hidden rounded-xl border border-border bg-bg-container shadow-xs",
        className,
      )}
      {...props}
    >
      <div className={cn("flex items-center gap-1 border-b border-border bg-bg-layout px-3 pt-1.5", collapsed && "border-b-0")}>
        {quickAccess && (
          <div data-slot="ribbon-quick-access" className="mr-2 flex items-center gap-1 pb-1.5">
            {quickAccess}
          </div>
        )}

        <div role="tablist" aria-label="Ribbon tabs" className="flex items-end gap-1">
          {tabs.map((tab, index) => {
            const isActive = tab.key === activeKey;
            return (
              <div key={tab.key} className="flex flex-col items-center">
                {tab.contextual && tab.contextualLabel && (
                  <span className="whitespace-nowrap px-2 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    {tab.contextualLabel}
                  </span>
                )}
                <button
                  ref={(node) => {
                    tabRefs.current[tab.key] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`${uid}-tab-${tab.key}`}
                  aria-selected={isActive}
                  aria-controls={isActive && !collapsed ? `${uid}-panel-${tab.key}` : undefined}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => (isActive && collapsible ? setCollapsed(!collapsed) : handleTabChange(tab.key))}
                  onKeyDown={(e) => onTabKeyDown(e, index)}
                  className={cn(
                    "relative whitespace-nowrap rounded-t-md px-3.5 py-1.5 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/40",
                    isActive
                      ? "bg-bg-container font-semibold text-primary shadow-xs"
                      : "text-text-secondary hover:bg-fill-tertiary hover:text-text",
                    tab.contextual && "text-primary",
                  )}
                >
                  {tab.label}
                  {isActive && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />}
                </button>
              </div>
            );
          })}
        </div>

        {collapsible && (
          <button
            type="button"
            aria-label={collapsed ? "Expand ribbon" : "Collapse ribbon"}
            aria-expanded={!collapsed}
            onClick={() => setCollapsed(!collapsed)}
            className="kk-press mb-1.5 ml-auto flex size-6 shrink-0 items-center justify-center rounded-md text-text-tertiary outline-none transition-colors hover:bg-fill-tertiary hover:text-text focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <ChevronUp className={cn("size-3.5 transition-transform duration-mid", collapsed && "rotate-180")} />
          </button>
        )}
      </div>

      {currentTab && !collapsed && (
        <div
          role="tabpanel"
          id={`${uid}-panel-${currentTab.key}`}
          aria-labelledby={`${uid}-tab-${currentTab.key}`}
          className="kk-scrollbar flex items-stretch gap-3 overflow-x-auto bg-bg-container p-2.5"
        >
          {currentTab.groups.map((group) => (
            <div
              key={group.key}
              data-slot="ribbon-group"
              role="group"
              aria-labelledby={group.title ? `${uid}-group-${group.key}` : undefined}
              className="flex flex-col justify-between border-r border-border-secondary pr-3 last:border-r-0"
            >
              <div className="flex flex-1 items-stretch gap-1.5">
                {group.items.map((item, idx) =>
                  isRibbonItem(item) ? <RibbonCommand key={item.key} item={item} /> : (
                    <React.Fragment key={idx}>{item}</React.Fragment>
                  ),
                )}
              </div>
              {group.title && (
                <span
                  id={`${uid}-group-${group.key}`}
                  className="mt-1 text-center text-[10px] font-medium uppercase tracking-wider text-text-quaternary"
                >
                  {group.title}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
