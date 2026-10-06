import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type CollapseSize = "sm" | "md" | "lg" | "small" | "middle" | "large";
export type CollapseCollapsible = "header" | "icon" | "disabled";

export interface CollapseItem {
  key: string | number;
  label?: React.ReactNode;
  children?: React.ReactNode;
  extra?: React.ReactNode;
  showArrow?: boolean;
  collapsible?: CollapseCollapsible;
  forceRender?: boolean;
  destroyOnHidden?: boolean;
  headerClass?: string;
  className?: string;
  styles?: {
    header?: React.CSSProperties;
    body?: React.CSSProperties;
  };
}

export interface CollapsePanelProps extends Omit<CollapseItem, "key"> {
  key?: string | number;
  header?: React.ReactNode;
}

function CollapsePanel(_props: CollapsePanelProps) {
  return null;
}

export interface CollapseProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  items?: CollapseItem[];
  activeKey?: (string | number)[] | string | number;
  defaultActiveKey?: (string | number)[] | string | number;
  onChange?: (keys: string[] | string) => void;
  accordion?: boolean;
  bordered?: boolean;
  ghost?: boolean;
  size?: CollapseSize;
  expandIcon?: (panelProps: { isActive?: boolean; disabled?: boolean }) => React.ReactNode;
  expandIconPosition?: "start" | "end";
  collapsible?: CollapseCollapsible;
  destroyOnHidden?: boolean;
  children?: React.ReactNode;
}

function normalizeSize(size: CollapseSize = "md"): "sm" | "md" | "lg" {
  if (size === "small") return "sm";
  if (size === "large") return "lg";
  if (size === "middle") return "md";
  return size;
}

function normalizeKeys(keys?: (string | number)[] | string | number): string[] {
  if (keys === undefined || keys === null) return [];
  if (Array.isArray(keys)) return keys.map(String);
  return [String(keys)];
}

/** Panel body with a real height transition; honors forceRender / destroyOnHidden. */
function CollapsePanelBody({
  open,
  ghost,
  style,
  forceRender,
  destroyOnHidden,
  children,
}: {
  open: boolean;
  ghost: boolean;
  style?: React.CSSProperties;
  forceRender?: boolean;
  destroyOnHidden?: boolean;
  children?: React.ReactNode;
}) {
  const [rendered, setRendered] = React.useState(open || Boolean(forceRender));

  React.useEffect(() => {
    if (open) setRendered(true);
    else if (destroyOnHidden && !forceRender) {
      // wait for the collapse transition before unmounting
      const timer = setTimeout(() => setRendered(false), 220);
      return () => clearTimeout(timer);
    }
  }, [open, destroyOnHidden, forceRender]);

  if (!rendered && !forceRender) return null;

  return (
    <div
      data-slot="collapse-body"
      aria-hidden={!open}
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-mid ease-kk-in-out",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      )}
    >
      <div className="overflow-hidden">
        <div
          style={style}
          className={cn(
            "bg-bg-container p-4 text-sm text-text-secondary",
            !ghost && "border-t border-border-secondary",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function Collapse({
  items: itemsProp,
  activeKey: controlledKeys,
  defaultActiveKey,
  onChange,
  accordion = false,
  bordered = true,
  ghost = false,
  size: sizeProp = "md",
  expandIcon,
  expandIconPosition = "start",
  collapsible: rootCollapsible,
  destroyOnHidden = false,
  children,
  className,
  ...props
}: CollapseProps) {
  const size = normalizeSize(sizeProp);

  const items: CollapseItem[] = React.useMemo(() => {
    if (itemsProp) return itemsProp;
    const derived: CollapseItem[] = [];
    React.Children.forEach(children, (child, idx) => {
      if (React.isValidElement<CollapsePanelProps>(child)) {
        const key = child.key != null ? String(child.key) : String(idx);
        derived.push({
          key,
          label: child.props.header,
          children: child.props.children,
          extra: child.props.extra,
          showArrow: child.props.showArrow,
          collapsible: child.props.collapsible,
          forceRender: child.props.forceRender,
          destroyOnHidden: child.props.destroyOnHidden,
          headerClass: child.props.headerClass,
          className: child.props.className,
          styles: child.props.styles,
        });
      }
    });
    return derived;
  }, [itemsProp, children]);

  const [internalKeys, setInternalKeys] = React.useState<string[]>(() =>
    normalizeKeys(defaultActiveKey),
  );
  const isControlled = controlledKeys !== undefined;
  const currentKeys = isControlled ? normalizeKeys(controlledKeys) : internalKeys;

  const toggle = (key: string) => {
    let next: string[];
    if (accordion) {
      next = currentKeys.includes(key) ? [] : [key];
    } else {
      next = currentKeys.includes(key)
        ? currentKeys.filter((k) => k !== key)
        : [...currentKeys, key];
    }
    if (!isControlled) setInternalKeys(next);
    onChange?.(accordion ? next[0] ?? "" : next);
  };

  const sizeClasses = {
    sm: "text-xs py-2 px-3",
    md: "text-sm py-3 px-4",
    lg: "text-base py-4 px-5",
  };

  return (
    <div
      data-slot="collapse"
      data-size={size}
      className={cn(
        "w-full overflow-hidden text-text",
        !ghost && bordered && "rounded-lg border border-border-secondary bg-bg-container",
        ghost && "bg-transparent",
        className,
      )}
      {...props}
    >
      {items.map((item, index) => {
        const key = String(item.key);
        const isOpen = currentKeys.includes(key);
        const collapsible = item.collapsible ?? rootCollapsible;
        const isDisabled = collapsible === "disabled";
        const iconOnly = collapsible === "icon";

        const iconNode = expandIcon ? (
          expandIcon({ isActive: isOpen, disabled: isDisabled })
        ) : (
          <ChevronRight
            className={cn(
              "size-4 shrink-0 text-text-tertiary transition-transform duration-200",
              isOpen && "rotate-90 text-text",
            )}
          />
        );

        return (
          <div
            key={key}
            className={cn(
              "border-border-secondary",
              index > 0 && !ghost && "border-t",
              item.className,
            )}
          >
            {/* Header */}
            <div
              role="button"
              data-slot="collapse-header"
              tabIndex={isDisabled ? -1 : 0}
              aria-expanded={isOpen}
              aria-disabled={isDisabled || undefined}
              onClick={() => !isDisabled && iconOnly === false && toggle(key)}
              onKeyDown={(e) => {
                if (isDisabled || iconOnly) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle(key);
                }
              }}
              style={item.styles?.header}
              className={cn(
                "flex select-none items-center justify-between transition-colors duration-fast",
                "outline-none focus-visible:ring-[3px] focus-visible:ring-primary/30",
                !ghost && "bg-fill-quaternary/40",
                !isDisabled && !iconOnly && "cursor-pointer hover:bg-fill-quaternary",
                iconOnly && "cursor-default",
                sizeClasses[size],
                isDisabled && "cursor-not-allowed opacity-40 hover:bg-transparent",
                item.headerClass,
              )}
            >
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                {expandIconPosition === "start" && item.showArrow !== false && (
                  <span
                    onClick={(e) => {
                      if (!iconOnly || isDisabled) return;
                      e.stopPropagation();
                      toggle(key);
                    }}
                    className={cn("inline-flex", iconOnly && !isDisabled && "cursor-pointer")}
                  >
                    {iconNode}
                  </span>
                )}
                <span className="truncate font-medium">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.extra && <div onClick={(e) => e.stopPropagation()}>{item.extra}</div>}
                {expandIconPosition === "end" && item.showArrow !== false && (
                  <span
                    onClick={(e) => {
                      if (!iconOnly || isDisabled) return;
                      e.stopPropagation();
                      toggle(key);
                    }}
                    className={cn("inline-flex", iconOnly && !isDisabled && "cursor-pointer")}
                  >
                    {iconNode}
                  </span>
                )}
              </div>
            </div>

            {/* Body — grid-rows trick gives a real height transition */}
            <CollapsePanelBody
              open={isOpen}
              ghost={ghost}
              style={item.styles?.body}
              forceRender={item.forceRender}
              destroyOnHidden={item.destroyOnHidden ?? destroyOnHidden}
            >
              {item.children}
            </CollapsePanelBody>
          </div>
        );
      })}
    </div>
  );
}

Collapse.Panel = CollapsePanel;

export { Collapse, CollapsePanel };
