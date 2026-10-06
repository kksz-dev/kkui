import * as React from "react";
import { ChevronRight, Ellipsis } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, ButtonGroup, type ButtonType } from "@/components/ui/button";
import { Portal } from "@/components/ui/portal";
import { useClickOutside } from "@/hooks/use-click-outside";
import {
  computeFloatingPosition,
  measureFloating,
  type FloatingPlacement,
  type FloatingSize,
} from "@/lib/floating-position";

/**
 * Dropdown — items model menu in a popup, with hover / click / context-menu triggers,
 * nested submenus, selection state and an optional arrow that points at the trigger.
 */
export type DropdownPlacement = "bottomLeft" | "bottom" | "bottomRight" | "topLeft" | "top" | "topRight";
export type DropdownTrigger = "click" | "hover" | "contextMenu";

export interface DropdownMenuInfo {
  key: string;
  keyPath: string[];
  domEvent: React.MouseEvent;
}
export interface DropdownSelectInfo extends DropdownMenuInfo {
  selectedKeys: string[];
}

export interface DropdownItem {
  key: string;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  /** Node rendered at the end of the row (shortcut hint …) */
  extra?: React.ReactNode;
  /** Native title attribute of the row */
  title?: string;
  /** Turns the item into a submenu */
  children?: DropdownItemType[];
  type?: "item" | "submenu";
  onClick?: (info: DropdownMenuInfo) => void;
  className?: string;
  /** Extra classes on the popup of this submenu */
  popupClassName?: string;
}

export interface DropdownDivider {
  type: "divider";
  key?: string;
  dashed?: boolean;
}

export interface DropdownGroup {
  type: "group";
  key?: string;
  label?: React.ReactNode;
  children?: DropdownItemType[];
}

export type DropdownItemType = DropdownItem | DropdownDivider | DropdownGroup | null;

export interface DropdownMenuProps {
  items: DropdownItemType[];
  onClick?: (info: DropdownMenuInfo) => void;
  selectable?: boolean;
  multiple?: boolean;
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  onSelect?: (info: DropdownSelectInfo) => void;
  onDeselect?: (info: DropdownSelectInfo) => void;
  /** Icon at the end of a submenu row */
  expandIcon?: React.ReactNode;
  /** Class of the menu panel */
  className?: string;
  /** Style of the menu panel */
  style?: React.CSSProperties;
}

export interface DropdownProps {
  menu?: DropdownMenuProps;
  placement?: DropdownPlacement;
  trigger?: DropdownTrigger | DropdownTrigger[];
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, info?: { source: "trigger" | "menu" }) => void;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  arrow?: boolean | { pointAtCenter?: boolean };
  /** Keep the popup inside the viewport (flip / shift when it would overflow) */
  autoAdjustOverflow?: boolean;
  /** Focus the first menu item when the popup opens */
  autoFocus?: boolean;
  /** Unmount the popup once it is closed instead of keeping it hidden */
  destroyOnHidden?: boolean;
  /** Render the popup inside another element (must be positioned) */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  /** Extra classes on the trigger while the popup is open */
  openClassName?: string;
  /** Extra pixel offset [x, y] applied to the computed position */
  align?: { offset?: [number, number] };
  popupRender?: (menu: React.ReactNode) => React.ReactNode;
  overlayClassName?: string;
  overlayStyle?: React.CSSProperties;
  zIndex?: number;
  className?: string;
  children: React.ReactNode;
}

/* ------------------------------------------------------------------ */
/* positioning                                                         */
/* ------------------------------------------------------------------ */

/** Same geometry as computeFloatingPosition but without the viewport containment. */
function rawPosition(t: DOMRect, c: FloatingSize, placement: FloatingPlacement, offset: number) {
  const top = placement.startsWith("top")
    ? t.top - c.height - offset
    : placement.startsWith("bottom")
      ? t.bottom + offset
      : placement.endsWith("Top")
        ? t.top
        : placement.endsWith("Bottom")
          ? t.bottom - c.height
          : t.top + (t.height - c.height) / 2;
  const left = placement.startsWith("left")
    ? t.left - c.width - offset
    : placement.startsWith("right")
      ? t.right + offset
      : placement.endsWith("Left")
        ? t.left
        : placement.endsWith("Right")
          ? t.right - c.width
          : t.left + (t.width - c.width) / 2;
  return { top: top + window.scrollY, left: left + window.scrollX };
}

/** Document coordinates → coordinates inside a custom (positioned) popup container. */
function toContainer(pos: { top: number; left: number }, container?: HTMLElement) {
  if (!container || container === document.body) return pos;
  const r = container.getBoundingClientRect();
  return {
    top: pos.top - (r.top + window.scrollY) + container.scrollTop,
    left: pos.left - (r.left + window.scrollX) + container.scrollLeft,
  };
}

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

interface PopupPos {
  top: number;
  left: number;
  /** distance from the popup's left edge to the arrow tip */
  arrow: number;
}

interface PositionOptions {
  open: boolean;
  getTriggerRect: () => DOMRect | null;
  popupRef: React.RefObject<HTMLDivElement | null>;
  placement: FloatingPlacement;
  offset: number;
  adjust: boolean;
  container?: HTMLElement;
  alignOffset?: [number, number];
  pointAtCenter?: boolean;
  /** flip to the other side when there is no room on the right (submenus) */
  flip?: boolean;
}

function usePopupPosition({
  open,
  getTriggerRect,
  popupRef,
  placement,
  offset,
  adjust,
  container,
  alignOffset,
  pointAtCenter,
  flip,
}: PositionOptions) {
  const [pos, setPos] = React.useState<PopupPos | null>(null);

  const update = React.useCallback(() => {
    const popup = popupRef.current;
    const t = getTriggerRect();
    if (!popup || !t) return;
    const c = measureFloating(popup);

    let p = placement;
    if (adjust && flip && p.startsWith("right") && t.right + c.width + offset > window.innerWidth - 8) {
      p = p.replace("right", "left") as FloatingPlacement;
    }

    const base = adjust ? computeFloatingPosition(t, c, p, offset) : rawPosition(t, c, p, offset);
    const doc = { top: base.top + (alignOffset?.[1] ?? 0), left: base.left + (alignOffset?.[0] ?? 0) };
    const arrow = clamp(
      pointAtCenter
        ? t.left + t.width / 2 - (doc.left - window.scrollX)
        : p.endsWith("Right")
          ? c.width - 16
          : p.endsWith("Left")
            ? 16
            : c.width / 2,
      12,
      Math.max(12, c.width - 12),
    );
    const next = { ...toContainer(doc, container), arrow };
    setPos((prev) => (prev && prev.top === next.top && prev.left === next.left && prev.arrow === next.arrow ? prev : next));
  }, [popupRef, getTriggerRect, placement, offset, adjust, container, alignOffset, pointAtCenter, flip]);

  React.useLayoutEffect(() => {
    if (!open) return;
    update();
    const onMove = () => update();
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
  }, [open, update]);

  return pos;
}

/* ------------------------------------------------------------------ */
/* menu rendering                                                      */
/* ------------------------------------------------------------------ */

interface MenuCtxValue {
  popupId: string;
  /** open state of the root popup — submenus fold back when it closes */
  rootOpen: boolean;
  zIndex: number;
  container?: HTMLElement;
  adjust: boolean;
  expandIcon: React.ReactNode;
  selectable: boolean;
  selectedKeys: string[];
  openDelay: number;
  closeDelay: number;
  clickItem: (item: DropdownItem, keyPath: string[], e: React.MouseEvent) => void;
  popupEnter: () => void;
  popupLeave: () => void;
  popupKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

const MenuCtx = React.createContext<MenuCtxValue | null>(null);
const useMenuCtx = () => {
  const ctx = React.useContext(MenuCtx);
  if (!ctx) throw new Error("Dropdown menu items must be rendered inside <Dropdown>");
  return ctx;
};

const panelClass =
  "min-w-40 rounded-lg border border-border bg-bg-elevated p-1 text-sm text-text shadow-kk-secondary outline-none";

function rowClass(o: { disabled?: boolean; danger?: boolean; selected?: boolean; active?: boolean }) {
  return cn(
    "relative flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-1.5 outline-none select-none",
    "transition-colors duration-mid ease-kk-in-out focus-visible:ring-[3px] focus-visible:ring-primary/30",
    o.danger ? "text-error hover:bg-error-bg" : "text-text hover:bg-fill-tertiary",
    o.active && (o.danger ? "bg-error-bg" : "bg-fill-tertiary"),
    o.selected && !o.danger && "bg-control-item-bg-active font-medium text-primary",
    o.disabled && "cursor-not-allowed hover:bg-transparent",
    o.disabled && (o.danger ? "text-error/40" : "text-text-disabled"),
  );
}

function ItemLabel({ item }: { item: DropdownItem }) {
  return (
    <>
      <span className="flex min-w-0 items-center gap-2 [&>svg]:size-4 [&>svg]:shrink-0">
        {item.icon}
        <span className="truncate">{item.label}</span>
      </span>
      {item.extra != null && <span className="text-xs text-text-tertiary">{item.extra}</span>}
    </>
  );
}

function ItemRow({ item, keyPath }: { item: DropdownItem; keyPath: string[] }) {
  const ctx = useMenuCtx();
  const selected = ctx.selectable && ctx.selectedKeys.includes(item.key);
  return (
    <div
      role="menuitem"
      data-slot="dropdown-item"
      data-selected={selected || undefined}
      aria-disabled={item.disabled || undefined}
      aria-checked={ctx.selectable ? selected : undefined}
      tabIndex={-1}
      title={item.title}
      className={cn(rowClass({ disabled: item.disabled, danger: item.danger, selected }), item.className)}
      onClick={(e) => ctx.clickItem(item, [item.key, ...keyPath], e)}
    >
      <ItemLabel item={item} />
    </div>
  );
}

function SubMenuRow({ item, keyPath }: { item: DropdownItem; keyPath: string[] }) {
  const ctx = useMenuCtx();
  const [open, setOpen] = React.useState(false);
  const rowRef = React.useRef<HTMLDivElement>(null);
  const popupRef = React.useRef<HTMLDivElement>(null);
  const timer = React.useRef<number | undefined>(undefined);
  const path = [item.key, ...keyPath];

  const schedule = (next: boolean, delay: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(next), delay * 1000);
  };
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  React.useEffect(() => {
    if (!ctx.rootOpen) setOpen(false);
  }, [ctx.rootOpen]);

  const getTriggerRect = React.useCallback(() => rowRef.current?.getBoundingClientRect() ?? null, []);
  const pos = usePopupPosition({
    open,
    getTriggerRect,
    popupRef,
    placement: "rightTop",
    offset: 4,
    adjust: ctx.adjust,
    container: ctx.container,
    flip: true,
  });

  // Entering this popup keeps every ancestor popup open; leaving it closes the chain.
  const chainEnter = () => {
    window.clearTimeout(timer.current);
    ctx.popupEnter();
  };
  const chainLeave = () => {
    schedule(false, ctx.closeDelay);
    ctx.popupLeave();
  };

  return (
    <>
      <div
        ref={rowRef}
        role="menuitem"
        data-slot="dropdown-submenu"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-disabled={item.disabled || undefined}
        tabIndex={-1}
        title={item.title}
        className={cn(rowClass({ disabled: item.disabled, danger: item.danger, active: open }), item.className)}
        onMouseEnter={() => !item.disabled && schedule(true, ctx.openDelay)}
        onMouseLeave={() => schedule(false, ctx.closeDelay)}
        onClick={() => !item.disabled && setOpen(!open)}
      >
        <ItemLabel item={item} />
        <span className="-mr-1 inline-flex shrink-0 text-text-tertiary [&>svg]:size-3.5">{ctx.expandIcon}</span>
      </div>

      {open && !item.disabled && (
        <Portal container={ctx.container}>
          <div
            ref={popupRef}
            data-dropdown-id={ctx.popupId}
            style={{ position: "absolute", top: pos?.top ?? -9999, left: pos?.left ?? -9999, zIndex: ctx.zIndex }}
            className="animate-in fade-in-0 zoom-in-95 duration-200 ease-kk-spring-soft"
            onMouseEnter={chainEnter}
            onMouseLeave={chainLeave}
            onKeyDown={ctx.popupKeyDown}
          >
            <div role="menu" data-slot="dropdown-menu" className={cn(panelClass, item.popupClassName)}>
              <MenuCtx.Provider value={{ ...ctx, popupEnter: chainEnter, popupLeave: chainLeave }}>
                <MenuItems items={item.children ?? []} keyPath={path} />
              </MenuCtx.Provider>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}

function MenuItems({ items, keyPath }: { items: DropdownItemType[]; keyPath: string[] }) {
  return (
    <>
      {items.map((it, idx) => {
        if (!it) return null;
        if (it.type === "divider") {
          return <div key={it.key ?? `divider-${idx}`} className={cn("my-1 border-t border-split", it.dashed && "border-dashed")} />;
        }
        if (it.type === "group") {
          return (
            <div key={it.key ?? `group-${idx}`} role="group" className="py-1">
              {it.label != null && <div className="px-3 py-1 text-xs text-text-tertiary">{it.label}</div>}
              <MenuItems items={it.children ?? []} keyPath={keyPath} />
            </div>
          );
        }
        return it.children?.length ? (
          <SubMenuRow key={it.key} item={it} keyPath={keyPath} />
        ) : (
          <ItemRow key={it.key} item={it} keyPath={keyPath} />
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Dropdown                                                            */
/* ------------------------------------------------------------------ */

export function Dropdown({
  menu,
  placement = "bottomLeft",
  trigger = ["hover"],
  disabled = false,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  mouseEnterDelay = 0.1,
  mouseLeaveDelay = 0.1,
  arrow = false,
  autoAdjustOverflow = true,
  autoFocus = false,
  destroyOnHidden = false,
  getPopupContainer,
  openClassName,
  align,
  popupRender,
  overlayClassName,
  overlayStyle,
  zIndex = 1050,
  className,
  children,
}: DropdownProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const popupId = React.useId();

  const triggerRef = React.useRef<HTMLDivElement>(null);
  const popupRef = React.useRef<HTMLDivElement>(null);
  /** document coordinates of the last contextMenu open, null for the other triggers */
  const [pointer, setPointer] = React.useState<{ x: number; y: number } | null>(null);

  const enterTimer = React.useRef<number | undefined>(undefined);
  const leaveTimer = React.useRef<number | undefined>(undefined);
  React.useEffect(
    () => () => {
      window.clearTimeout(enterTimer.current);
      window.clearTimeout(leaveTimer.current);
    },
    [],
  );

  const triggers = Array.isArray(trigger) ? trigger : [trigger];
  const showArrow = arrow !== false && arrow !== undefined;
  const pointAtCenter = typeof arrow === "object" && arrow.pointAtCenter === true;

  const setOpen = (v: boolean, info: { source: "trigger" | "menu" }) => {
    if (disabled || v === open) return;
    if (!isControlled) setUncontrolledOpen(v);
    onOpenChange?.(v, info);
  };

  /* ---- popup container ---- */
  const [container, setContainer] = React.useState<HTMLElement | undefined>(undefined);
  React.useLayoutEffect(() => {
    if (!triggerRef.current) return;
    setContainer(getPopupContainer?.(triggerRef.current));
  }, [getPopupContainer, open]);

  /* ---- keep mounted / destroy ---- */
  const [everOpen, setEverOpen] = React.useState(open);
  React.useEffect(() => {
    if (open) setEverOpen(true);
  }, [open]);
  const mounted = open || (everOpen && !destroyOnHidden);

  useClickOutside(
    popupRef,
    (e) => {
      const el = e.target as Element | null;
      if (triggerRef.current?.contains(el as Node)) return;
      // submenu popups live in their own portals
      if (el?.closest?.(`[data-dropdown-id="${popupId}"]`)) return;
      setOpen(false, { source: "trigger" });
    },
    open,
  );

  const getTriggerRect = React.useCallback(
    () =>
      pointer
        ? new DOMRect(pointer.x - window.scrollX, pointer.y - window.scrollY, 0, 0)
        : (triggerRef.current?.getBoundingClientRect() ?? null),
    [pointer],
  );

  const pos = usePopupPosition({
    open,
    getTriggerRect,
    popupRef,
    placement,
    offset: showArrow ? 8 : 4,
    adjust: autoAdjustOverflow,
    container,
    alignOffset: align?.offset,
    pointAtCenter,
  });

  /* ---- selection ---- */
  const [innerSelected, setInnerSelected] = React.useState<string[]>(menu?.defaultSelectedKeys ?? []);
  const selectable = menu?.selectable ?? false;
  const multiple = menu?.multiple ?? false;
  const selectedKeys = menu?.selectedKeys ?? innerSelected;

  const clickItem = (item: DropdownItem, keyPath: string[], e: React.MouseEvent) => {
    if (item.disabled) return;
    const info: DropdownMenuInfo = { key: item.key, keyPath, domEvent: e };
    item.onClick?.(info);
    menu?.onClick?.(info);

    if (selectable) {
      const wasSelected = selectedKeys.includes(item.key);
      const next = multiple
        ? wasSelected
          ? selectedKeys.filter((k) => k !== item.key)
          : [...selectedKeys, item.key]
        : [item.key];
      if (menu?.selectedKeys === undefined) setInnerSelected(next);
      const selectInfo: DropdownSelectInfo = { ...info, selectedKeys: next };
      if (wasSelected && multiple) menu?.onDeselect?.(selectInfo);
      else menu?.onSelect?.(selectInfo);
    }

    // a multiple-select menu stays open so several items can be toggled
    if (!(selectable && multiple)) setOpen(false, { source: "menu" });
  };

  /* ---- hover / click / context menu ---- */
  const handleMouseEnter = () => {
    if (!triggers.includes("hover") || disabled) return;
    window.clearTimeout(leaveTimer.current);
    enterTimer.current = window.setTimeout(() => {
      setPointer(null);
      setOpen(true, { source: "trigger" });
    }, mouseEnterDelay * 1000);
  };

  const handleMouseLeave = () => {
    if (!triggers.includes("hover") || disabled) return;
    window.clearTimeout(enterTimer.current);
    leaveTimer.current = window.setTimeout(() => setOpen(false, { source: "trigger" }), mouseLeaveDelay * 1000);
  };

  const handleClick = () => {
    if (!triggers.includes("click") || disabled) return;
    setPointer(null);
    setOpen(!open, { source: "trigger" });
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (!triggers.includes("contextMenu") || disabled) return;
    e.preventDefault();
    setPointer({ x: e.clientX + window.scrollX, y: e.clientY + window.scrollY });
    setOpen(true, { source: "trigger" });
  };

  /* ---- keyboard ---- */
  const popupKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      setOpen(false, { source: "trigger" });
      return;
    }
    const rows = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])'));
    const i = rows.indexOf(e.target as HTMLElement);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = (e.key === "ArrowDown" ? i + 1 : i - 1 + rows.length) % rows.length;
      rows[next]?.focus();
    } else if ((e.key === "Enter" || e.key === " ") && i >= 0) {
      e.preventDefault();
      rows[i].click();
    }
  };

  React.useEffect(() => {
    if (!open || !autoFocus) return;
    popupRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])')?.focus();
  }, [open, autoFocus]);

  /* ---- render ---- */
  const ctx: MenuCtxValue = {
    popupId,
    rootOpen: open,
    zIndex,
    container,
    adjust: autoAdjustOverflow,
    expandIcon: menu?.expandIcon ?? <ChevronRight />,
    selectable,
    selectedKeys,
    openDelay: mouseEnterDelay,
    closeDelay: mouseLeaveDelay,
    clickItem,
    popupEnter: () => window.clearTimeout(leaveTimer.current),
    popupLeave: handleMouseLeave,
    popupKeyDown,
  };

  const menuNode = menu ? (
    <div role="menu" data-slot="dropdown-menu" className={cn(panelClass, menu.className)} style={menu.style}>
      <MenuItems items={menu.items} keyPath={[]} />
    </div>
  ) : null;

  const isTop = placement.startsWith("top");
  const arrowStyle: React.CSSProperties = {
    left: pos?.arrow ?? 0,
    transform: "translateX(-50%) rotate(45deg)",
    ...(isTop ? { bottom: -4.5 } : { top: -4.5 }),
  };

  return (
    <MenuCtx.Provider value={ctx}>
      <div
        ref={triggerRef}
        data-slot="dropdown-trigger"
        className={cn("inline-block", className, open && openClassName)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        {children}
      </div>

      {mounted && (menuNode || popupRender) && (
        <Portal container={container}>
          <div
            ref={popupRef}
            data-dropdown-id={popupId}
            data-slot="dropdown-popup"
            hidden={!open}
            inert={!open}
            style={{
              position: "absolute",
              top: pos?.top ?? -9999,
              left: pos?.left ?? -9999,
              zIndex,
              ...overlayStyle,
            }}
            className={cn("animate-in fade-in-0 zoom-in-95 duration-200 ease-kk-spring-soft", overlayClassName)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onKeyDown={popupKeyDown}
          >
            {popupRender ? popupRender(menuNode) : menuNode}
            {showArrow && (
              <span
                data-slot="dropdown-arrow"
                aria-hidden
                className={cn(
                  "absolute size-2 border border-border bg-bg-elevated",
                  isTop ? "border-t-0 border-l-0" : "border-r-0 border-b-0",
                )}
                style={arrowStyle}
              />
            )}
          </div>
        </Portal>
      )}
    </MenuCtx.Provider>
  );
}

/* ---------------- Dropdown.Button ---------------- */

export interface DropdownButtonProps extends Omit<DropdownProps, "children"> {
  type?: ButtonType;
  size?: "sm" | "md" | "lg";
  htmlType?: "button" | "submit" | "reset";
  danger?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  buttonsRender?: (buttons: [React.ReactNode, React.ReactNode]) => React.ReactNode[];
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
}

export function DropdownButton({
  type = "default",
  size = "md",
  htmlType = "button",
  danger,
  disabled,
  loading,
  onClick,
  icon = <Ellipsis className="size-4" />,
  children,
  buttonsRender,
  ...dropdownProps
}: DropdownButtonProps) {
  const leftButton = (
    <Button type={type} size={size} htmlType={htmlType} danger={danger} disabled={disabled} loading={loading} onClick={onClick}>
      {children}
    </Button>
  );

  const rightButton = (
    <Dropdown {...dropdownProps} disabled={disabled}>
      <Button type={type} size={size} danger={danger} disabled={disabled} icon={icon} className="px-2!" />
    </Dropdown>
  );

  if (buttonsRender) {
    const [l, r] = buttonsRender([leftButton, rightButton]);
    return (
      <ButtonGroup>
        {l}
        {r}
      </ButtonGroup>
    );
  }

  return (
    <ButtonGroup>
      {leftButton}
      {rightButton}
    </ButtonGroup>
  );
}

Dropdown.Button = DropdownButton;
