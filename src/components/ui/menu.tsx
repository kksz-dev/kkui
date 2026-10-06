import * as React from "react";
import { Portal } from "@/components/ui/portal";
import { useClickOutside } from "@/hooks/use-click-outside";
import { computeFloatingPosition, measureFloating, toContainerCoords } from "@/lib/floating-position";
import { ChevronDown, ChevronRight, Ellipsis } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Menu — KKUI items model with vertical / horizontal / inline modes, light / dark theme,
 * inline collapse, controlled selection and open keys. Popup submenus use KKUI's popover primitive
 * for positioning; hover intent, keyboard basics and inline height animation are handled here.
 */
export type MenuMode = "vertical" | "horizontal" | "inline";
export type MenuTheme = "light" | "dark";

export interface MenuInfo {
  key: string;
  keyPath: string[];
  domEvent: React.MouseEvent | React.KeyboardEvent;
}
export interface MenuSelectInfo extends MenuInfo {
  selectedKeys: string[];
}

export interface MenuItemType {
  key: string;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  /** Tooltip (title attribute) — defaults to the label when collapsed */
  title?: string;
  /** Node rendered at the end of the row */
  extra?: React.ReactNode;
  className?: string;
  type?: "item";
  onClick?: (info: MenuInfo) => void;
}
export interface SubMenuType {
  key: string;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  children: ItemType[];
  disabled?: boolean;
  title?: string;
  className?: string;
  popupClassName?: string;
  /** Theme of the popup / inline body of this submenu */
  theme?: MenuTheme;
  type?: "submenu";
  onTitleClick?: (info: { key: string; domEvent: React.MouseEvent | React.KeyboardEvent }) => void;
}
export interface MenuItemGroupType {
  type: "group";
  key?: string;
  label?: React.ReactNode;
  children: ItemType[];
  className?: string;
}
export interface MenuDividerType {
  type: "divider";
  key?: string;
  dashed?: boolean;
  className?: string;
}
export type ItemType = MenuItemType | SubMenuType | MenuItemGroupType | MenuDividerType | null;

export type MenuExpandIcon = React.ReactNode | ((info: { isOpen: boolean; isSubMenu: true; level: number }) => React.ReactNode);

export interface MenuProps extends Omit<React.ComponentProps<"ul">, "onClick" | "onSelect"> {
  /** Mount submenu popups inside another element instead of <body>. */
  getPopupContainer?: (triggerNode: HTMLElement | null) => HTMLElement;
  items: ItemType[];
  mode?: MenuMode;
  theme?: MenuTheme;
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  openKeys?: string[];
  defaultOpenKeys?: string[];
  onSelect?: (info: MenuSelectInfo) => void;
  onDeselect?: (info: MenuSelectInfo) => void;
  onClick?: (info: MenuInfo) => void;
  onOpenChange?: (openKeys: string[]) => void;
  /** Collapse the inline menu to icons (width 80px); submenus turn into popups */
  inlineCollapsed?: boolean;
  /** Indent (px) per level of inline items */
  inlineIndent?: number;
  multiple?: boolean;
  selectable?: boolean;
  /** Delay in seconds before a popup submenu opens on hover */
  subMenuOpenDelay?: number;
  /** Delay in seconds before a popup submenu closes on hover out */
  subMenuCloseDelay?: number;
  triggerSubMenuAction?: "hover" | "click";
  expandIcon?: MenuExpandIcon;
  /** Node of the "..." item that collects overflowed horizontal items */
  overflowedIndicator?: React.ReactNode;
}

/* ------------------------------------------------------------------ */
/* internal context                                                    */
/* ------------------------------------------------------------------ */

interface Ctx {
  mode: MenuMode;
  theme: MenuTheme;
  collapsed: boolean;
  popupMode: boolean;
  inlineIndent: number;
  selectedKeys: string[];
  openKeys: string[];
  firstKey?: string;
  hasSelectedDescendant: (key: string) => boolean;
  clickItem: (item: MenuItemType, keyPath: string[], e: React.MouseEvent | React.KeyboardEvent) => void;
  toggleKey: (key: string, keyPath: string[], force?: boolean) => void;
  closeKey: (key: string) => void;
  hover: {
    enabled: boolean;
    enterTitle: (key: string, keyPath: string[]) => void;
    leaveTitle: (key: string) => void;
    enterPopup: (keyPath: string[]) => void;
    leavePopup: (keyPath: string[]) => void;
  };
  triggerAction: "hover" | "click";
  expandIcon?: MenuExpandIcon;
  getPopupContainer?: (triggerNode: HTMLElement | null) => HTMLElement;
}
const MenuContext = React.createContext<Ctx | null>(null);
const useMenu = () => {
  const ctx = React.useContext(MenuContext);
  if (!ctx) throw new Error("Menu items must be rendered inside <Menu>");
  return ctx;
};

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

type KeyMeta = { keyPath: string[]; leaf: boolean };
/** key → keyPath (self first, then ancestors) for every item / submenu */
function collectKeys(items: ItemType[], parentPath: string[], out: Map<string, KeyMeta>) {
  for (const item of items) {
    if (!item || item.type === "divider") continue;
    if (item.type === "group") {
      collectKeys(item.children, parentPath, out);
      continue;
    }
    const keyPath = [item.key, ...parentPath];
    const sub = isSubMenu(item);
    out.set(item.key, { keyPath, leaf: !sub });
    if (sub) collectKeys(item.children, keyPath, out);
  }
}

const isSubMenu = (item: MenuItemType | SubMenuType): item is SubMenuType => Array.isArray((item as SubMenuType).children);

function sameKeys(a: string[], b: string[]) {
  return a.length === b.length && a.every((k, i) => k === b[i]);
}

/** Arrow keys / Home / End move focus between visible menu items inside `container`; Enter / Space click. */
function handleMenuKeyDown(e: React.KeyboardEvent<HTMLElement>, horizontal: boolean) {
  const container = e.currentTarget;
  const target = e.target as HTMLElement;
  if (!target.matches("[role=menuitem]")) return;
  const items = Array.from(container.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])')).filter(
    (el) => el.offsetParent !== null && !el.closest("[data-probe]") && el.closest("[data-slot=menu],[data-slot=menu-popup]") === container,
  );
  const i = items.indexOf(target);
  if (i === -1) return;
  const next = horizontal ? "ArrowRight" : "ArrowDown";
  const prev = horizontal ? "ArrowLeft" : "ArrowUp";
  let to: number | undefined;
  if (e.key === next) to = (i + 1) % items.length;
  else if (e.key === prev) to = (i - 1 + items.length) % items.length;
  else if (e.key === "Home") to = 0;
  else if (e.key === "End") to = items.length - 1;
  else if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    target.click();
    return;
  }
  if (to !== undefined) {
    e.preventDefault();
    items[to]?.focus();
  }
}

interface RowStyle {
  horizontal: boolean;
  dark: boolean;
  selected: boolean;
  disabled: boolean;
  danger: boolean;
  collapsed: boolean;
}
function rowClass({ horizontal, dark, selected, disabled, danger, collapsed }: RowStyle) {
  return cn(
    "relative flex cursor-pointer select-none items-center gap-2.5 whitespace-nowrap text-sm outline-none",
    "transition-[color,background-color,border-color] duration-mid ease-kk-in-out focus-visible:ring-[3px] focus-visible:ring-primary/30",
    "[&>svg]:size-4 [&>svg]:shrink-0",
    horizontal
      ? cn(
          "h-[46px] px-4",
          dark
            ? cn("text-white/65 hover:text-white", selected && "bg-primary text-white hover:text-white")
            : cn(
                "text-text after:pointer-events-none after:absolute after:inset-x-4 after:bottom-0 after:border-b-2 after:border-transparent after:transition-colors after:duration-mid after:content-['']",
                selected ? "text-primary after:border-primary" : "hover:text-primary hover:after:border-primary",
              ),
        )
      : cn(
          "mx-1 my-1 h-10 w-[calc(100%-8px)] rounded-md px-4",
          collapsed && "justify-center px-0",
          dark
            ? cn("text-white/65 hover:text-white", selected && "bg-primary text-white hover:text-white")
            : cn("text-text", selected ? "bg-control-item-bg-active text-primary" : "hover:bg-bg-text-hover"),
          danger && (dark ? "text-error-hover hover:text-error-hover" : "text-error hover:text-error"),
          danger && selected && !dark && "bg-error-bg",
        ),
    disabled && "cursor-not-allowed hover:bg-transparent hover:after:border-transparent",
    disabled && (dark ? "text-white/25 hover:text-white/25" : "text-text-disabled hover:text-text-disabled"),
  );
}

/* ------------------------------------------------------------------ */
/* items                                                               */
/* ------------------------------------------------------------------ */

interface ListProps {
  items: ItemType[];
  level: number;
  keyPath: string[];
  inPopup: boolean;
  theme: MenuTheme;
  /** invisible measuring copy (horizontal overflow) — no popups, not focusable */
  probe?: boolean;
}

function MenuList({ items, level, keyPath, inPopup, theme, probe }: ListProps) {
  return (
    <>
      {items.map((item, index) => {
        if (!item) return null;
        if (item.type === "divider") {
          return (
            <li
              key={item.key ?? `divider-${index}`}
              role="separator"
              className={cn("my-1 border-t", theme === "dark" ? "border-white/15" : "border-split", item.dashed && "border-dashed", item.className)}
            />
          );
        }
        if (item.type === "group") {
          return <MenuGroup key={item.key ?? `group-${index}`} item={item} level={level} keyPath={keyPath} inPopup={inPopup} theme={theme} probe={probe} />;
        }
        if (isSubMenu(item)) {
          return <SubMenu key={item.key} item={item} level={level} keyPath={keyPath} inPopup={inPopup} theme={theme} probe={probe} />;
        }
        return <MenuItem key={item.key} item={item} level={level} keyPath={keyPath} inPopup={inPopup} theme={theme} probe={probe} />;
      })}
    </>
  );
}

function MenuGroup({ item, level, keyPath, inPopup, theme, probe }: { item: MenuItemGroupType } & Omit<ListProps, "items">) {
  const { mode, collapsed, inlineIndent } = useMenu();
  const inline = mode === "inline" && !collapsed && !inPopup;
  return (
    <li role="presentation" className={item.className}>
      {item.label != null && !collapsed && (
        <div
          role="presentation"
          className={cn("px-4 py-2 text-sm", theme === "dark" ? "text-white/45" : "text-text-description")}
          style={inline ? { paddingInlineStart: inlineIndent * level } : undefined}
        >
          {item.label}
        </div>
      )}
      <ul role="group" className="m-0 list-none p-0">
        <MenuList items={item.children} level={level} keyPath={keyPath} inPopup={inPopup} theme={theme} probe={probe} />
      </ul>
    </li>
  );
}

function MenuItem({ item, level, keyPath: parentPath, inPopup, theme, probe }: { item: MenuItemType } & Omit<ListProps, "items">) {
  const { mode, collapsed, inlineIndent, selectedKeys, firstKey, clickItem } = useMenu();
  const keyPath = [item.key, ...parentPath];
  const horizontal = mode === "horizontal" && !inPopup;
  const inline = mode === "inline" && !collapsed && !inPopup;
  const isCollapsedRoot = collapsed && !inPopup;
  const selected = selectedKeys.includes(item.key);
  const title = item.title ?? (isCollapsedRoot && typeof item.label === "string" ? item.label : undefined);
  return (
    <li role="none" className={item.className}>
      <div
        role="menuitem"
        data-slot="menu-item"
        data-selected={selected || undefined}
        aria-disabled={item.disabled || undefined}
        tabIndex={item.disabled || probe ? -1 : selected || (selectedKeys.length === 0 && item.key === firstKey) ? 0 : -1}
        title={title}
        className={rowClass({ horizontal, dark: theme === "dark", selected, disabled: !!item.disabled, danger: !!item.danger, collapsed: isCollapsedRoot })}
        style={inline ? { paddingInlineStart: inlineIndent * level } : undefined}
        onClick={(e) => !item.disabled && clickItem(item, keyPath, e)}
      >
        {item.icon}
        <span className={cn("min-w-0 flex-1 truncate", isCollapsedRoot && "hidden")}>{item.label}</span>
        {item.extra != null && !isCollapsedRoot && <span className={cn("ml-auto text-xs", theme === "dark" ? "text-white/45" : "text-text-description")}>{item.extra}</span>}
      </div>
    </li>
  );
}

function SubMenu({ item, level, keyPath: parentPath, inPopup, theme, probe }: { item: SubMenuType } & Omit<ListProps, "items">) {
  const ctx = useMenu();
  const { mode, collapsed, inlineIndent, openKeys, hasSelectedDescendant, toggleKey, closeKey, hover, triggerAction, expandIcon } = ctx;
  const keyPath = [item.key, ...parentPath];
  const open = openKeys.includes(item.key);
  const horizontalRoot = mode === "horizontal" && !inPopup;
  const inline = mode === "inline" && !collapsed && !inPopup;
  const isCollapsedRoot = collapsed && !inPopup;
  const childSelected = hasSelectedDescendant(item.key);
  const dark = theme === "dark";
  const bodyTheme = item.theme ?? theme;
  const titleRef = React.useRef<HTMLDivElement>(null);
  const title = item.title ?? (isCollapsedRoot && typeof item.label === "string" ? item.label : undefined);

  const arrow = (() => {
    if (horizontalRoot || isCollapsedRoot) return null;
    if (typeof expandIcon === "function") return expandIcon({ isOpen: open, isSubMenu: true, level });
    if (expandIcon !== undefined) return expandIcon;
    return inline ? <ChevronDown className={cn("transition-transform duration-mid ease-kk-in-out", open && "rotate-180")} /> : <ChevronRight />;
  })();

  const titleClass = cn(
    rowClass({ horizontal: horizontalRoot, dark, selected: false, disabled: !!item.disabled, danger: false, collapsed: isCollapsedRoot }),
    childSelected && !item.disabled && (horizontalRoot ? (dark ? "bg-primary text-white" : "text-primary after:border-primary") : dark ? "text-white" : "text-primary"),
    open && !inline && !item.disabled && (horizontalRoot ? (dark ? "text-white" : "text-primary after:border-primary") : dark ? "text-white" : "bg-bg-text-hover"),
  );
  const popupRef = React.useRef<HTMLDivElement>(null);

  const onTitleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (item.disabled) return;
    item.onTitleClick?.({ key: item.key, domEvent: e });
    if (inline || triggerAction === "click") toggleKey(item.key, keyPath);
    else toggleKey(item.key, keyPath, true);
  };

  const titleNode = (
    <div
      ref={titleRef}
      role="menuitem"
      data-slot="menu-submenu-title"
      aria-haspopup="menu"
      aria-expanded={open}
      aria-disabled={item.disabled || undefined}
      tabIndex={item.disabled || probe ? -1 : 0}
      title={title}
      className={titleClass}
      style={inline ? { paddingInlineStart: inlineIndent * level } : undefined}
      onClick={onTitleClick}
      onKeyDown={(e) => {
        // move into an open popup with the arrow key that points at it
        if (inline || !open || e.key !== (horizontalRoot ? "ArrowDown" : "ArrowRight")) return;
        const first = popupRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])');
        if (first) {
          e.preventDefault();
          e.stopPropagation();
          first.focus();
        }
      }}
      onPointerEnter={!inline && !probe && hover.enabled && !item.disabled ? () => hover.enterTitle(item.key, keyPath) : undefined}
      onPointerLeave={!inline && !probe && hover.enabled && !item.disabled ? () => hover.leaveTitle(item.key) : undefined}
    >
      {item.icon}
      <span className={cn("min-w-0 flex-1 truncate", isCollapsedRoot && "hidden")}>{item.label}</span>
      {arrow != null && <span className="ml-auto inline-flex shrink-0 [&>svg]:size-3">{arrow}</span>}
    </div>
  );

  const placement = horizontalRoot ? "bottomLeft" : "rightTop";
  const [pos, setPos] = React.useState<{ top: number; left: number } | null>(null);

  useClickOutside(popupRef, (e) => {
    if (titleRef.current?.contains(e.target as Node)) return;
    closeKey(item.key);
  }, open);

  const popupContainer = React.useMemo(
    () => (ctx.getPopupContainer ? ctx.getPopupContainer(titleRef.current) : undefined),
    [ctx, open], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const updatePosition = React.useCallback(() => {
    if (!titleRef.current || !popupRef.current) return;
    const tRect = titleRef.current.getBoundingClientRect();
    const cRect = measureFloating(popupRef.current);
    setPos(toContainerCoords(computeFloatingPosition(tRect, cRect, placement, 4), popupContainer));
  }, [placement, popupContainer]);

  React.useLayoutEffect(() => {
    if (open) {
      updatePosition();
      const onScrollOrResize = () => updatePosition();
      window.addEventListener("scroll", onScrollOrResize, true);
      window.addEventListener("resize", onScrollOrResize);
      return () => {
        window.removeEventListener("scroll", onScrollOrResize, true);
        window.removeEventListener("resize", onScrollOrResize);
      };
    }
  }, [open, updatePosition]);

  if (probe) return <li role="none">{titleNode}</li>;

  if (inline) {
    return (
      <li role="none" className={item.className} data-open={open || undefined}>
        {titleNode}
        <div
          className="grid transition-[grid-template-rows] duration-slow ease-kk-in-out"
          style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
          aria-hidden={!open}
        >
          <ul role="menu" className={cn("m-0 min-h-0 list-none overflow-hidden p-0", bodyTheme === "dark" && "bg-[#000c17]", item.popupClassName)} inert={!open}>
            <MenuList items={item.children} level={level + 1} keyPath={keyPath} inPopup={false} theme={bodyTheme} probe={probe} />
          </ul>
        </div>
      </li>
    );
  }

  return (
    <>
      <li role="none" className={item.className} data-open={open || undefined}>
        {titleNode}
      </li>
      {open && (
        <Portal container={popupContainer}>
          <div
            ref={popupRef}
            style={{
              position: "absolute",
              top: pos?.top ?? -9999,
              left: pos?.left ?? -9999,
              zIndex: 1050,
            }}
            data-slot="menu-popup"
            onPointerEnter={hover.enabled ? () => hover.enterPopup(keyPath) : undefined}
            onPointerLeave={hover.enabled ? () => hover.leavePopup(keyPath) : undefined}
            onKeyDown={(e) => handleMenuKeyDown(e, false)}
            className={cn(
              "z-50 outline-none animate-in fade-in-0 zoom-in-95 duration-200 ease-kk-spring-soft",
            )}
          >
            <ul
              role="menu"
              data-theme={bodyTheme}
              className={cn(
                "m-0 min-w-40 list-none rounded-lg p-1 text-sm shadow-kk-secondary border border-border",
                bodyTheme === "dark" ? "bg-[#001529] text-white/65 border-white/10" : "bg-bg-elevated text-text",
                item.popupClassName,
              )}
            >
              <MenuList items={item.children} level={level + 1} keyPath={keyPath} inPopup theme={bodyTheme} />
            </ul>
          </div>
        </Portal>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Menu root                                                           */
/* ------------------------------------------------------------------ */

function Menu({
  items,
  mode = "vertical",
  theme = "light",
  selectedKeys: selectedKeysProp,
  defaultSelectedKeys = [],
  openKeys: openKeysProp,
  defaultOpenKeys = [],
  onSelect,
  onDeselect,
  onClick,
  onOpenChange,
  inlineCollapsed = false,
  inlineIndent = 24,
  multiple = false,
  selectable = true,
  subMenuOpenDelay = 0.1,
  subMenuCloseDelay = 0.1,
  triggerSubMenuAction = "hover",
  expandIcon,
  overflowedIndicator = <Ellipsis />,
  className,
  style,
  getPopupContainer,
  ...props
}: MenuProps) {
  const collapsed = mode === "inline" && inlineCollapsed;
  const popupMode = mode !== "inline" || collapsed;
  const horizontal = mode === "horizontal";

  const keyMap = React.useMemo(() => {
    const m = new Map<string, KeyMeta>();
    collectKeys(items, [], m);
    return m;
  }, [items]);
  const firstKey = React.useMemo(() => {
    for (const [k, v] of keyMap) if (v.leaf) return k;
    return undefined;
  }, [keyMap]);

  // ---- selection
  const [innerSelected, setInnerSelected] = React.useState(defaultSelectedKeys);
  const selectedKeys = selectedKeysProp ?? innerSelected;

  // ---- open keys (popup mode ignores inline-only open keys but shares the state)
  const [innerOpen, setInnerOpen] = React.useState(defaultOpenKeys);
  const openKeys = openKeysProp ?? innerOpen;
  const openKeysRef = React.useRef(openKeys);
  openKeysRef.current = openKeys;
  const setOpenKeys = React.useCallback(
    (next: string[]) => {
      if (sameKeys(next, openKeysRef.current)) return;
      openKeysRef.current = next;
      if (openKeysProp === undefined) setInnerOpen(next);
      onOpenChange?.(next);
    },
    [openKeysProp, onOpenChange],
  );

  const closeKey = React.useCallback(
    (key: string) => setOpenKeys(openKeysRef.current.filter((k) => !(keyMap.get(k)?.keyPath ?? [k]).includes(key))),
    [keyMap, setOpenKeys],
  );
  const openKey = React.useCallback(
    (key: string, keyPath: string[]) => {
      if (openKeysRef.current.includes(key)) return;
      // popup mode: one open branch at a time; inline: accumulate
      setOpenKeys(popupMode ? [...keyPath].reverse() : [...openKeysRef.current, key]);
    },
    [popupMode, setOpenKeys],
  );
  const toggleKey = React.useCallback(
    (key: string, keyPath: string[], force?: boolean) => {
      if (force) openKey(key, keyPath);
      else if (openKeysRef.current.includes(key)) closeKey(key);
      else openKey(key, keyPath);
    },
    [openKey, closeKey],
  );

  // ---- hover intent timers (per key)
  const timers = React.useRef(new Map<string, number>());
  const clearTimer = (id: string) => {
    const t = timers.current.get(id);
    if (t !== undefined) window.clearTimeout(t);
    timers.current.delete(id);
  };
  const cancelClose = (keys: string[]) => keys.forEach((k) => clearTimer(`close:${k}`));
  const scheduleClose = (keys: string[]) =>
    keys.forEach((k) => {
      clearTimer(`close:${k}`);
      timers.current.set(`close:${k}`, window.setTimeout(() => closeKey(k), subMenuCloseDelay * 1000));
    });
  React.useEffect(() => {
    const map = timers.current;
    return () => map.forEach((t) => window.clearTimeout(t));
  }, []);

  const hover: Ctx["hover"] = {
    enabled: popupMode && triggerSubMenuAction === "hover",
    enterTitle: (key, keyPath) => {
      cancelClose(keyPath);
      clearTimer("open");
      timers.current.set("open", window.setTimeout(() => openKey(key, keyPath), subMenuOpenDelay * 1000));
    },
    leaveTitle: (key) => {
      clearTimer("open");
      scheduleClose([key]);
    },
    enterPopup: (keyPath) => cancelClose(keyPath),
    leavePopup: (keyPath) => scheduleClose(keyPath),
  };

  // ---- click
  const clickItem: Ctx["clickItem"] = (item, keyPath, e) => {
    const info: MenuInfo = { key: item.key, keyPath, domEvent: e };
    item.onClick?.(info);
    onClick?.(info);
    if (selectable) {
      const isSelected = selectedKeys.includes(item.key);
      let next = selectedKeys;
      if (multiple) next = isSelected ? selectedKeys.filter((k) => k !== item.key) : [...selectedKeys, item.key];
      else if (!isSelected) next = [item.key];
      if (next !== selectedKeys) {
        if (selectedKeysProp === undefined) setInnerSelected(next);
        const sInfo: MenuSelectInfo = { ...info, selectedKeys: next };
        if (isSelected) onDeselect?.(sInfo);
        else onSelect?.(sInfo);
      }
    }
    if (popupMode) {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current.clear();
      setOpenKeys([]);
    }
  };

  const hasSelectedDescendant = React.useCallback(
    (key: string) => selectedKeys.some((s) => (keyMap.get(s)?.keyPath ?? []).slice(1).includes(key)),
    [selectedKeys, keyMap],
  );

  const ctx: Ctx = {
    mode,
    theme,
    collapsed,
    popupMode,
    inlineIndent,
    selectedKeys,
    openKeys,
    firstKey,
    hasSelectedDescendant,
    clickItem,
    toggleKey,
    closeKey,
    hover,
    triggerAction: triggerSubMenuAction,
    expandIcon,
    getPopupContainer,
  };

  const overflow = useHorizontalOverflow(horizontal, items.length);
  const visibleItems = horizontal && overflow.count < items.length ? items.slice(0, overflow.count) : items;
  const overflowedItems = horizontal && overflow.count < items.length ? items.slice(overflow.count) : [];

  return (
    <MenuContext.Provider value={ctx}>
      <ul
        ref={overflow.ref}
        role="menu"
        data-slot="menu"
        data-mode={mode}
        data-theme={theme}
        aria-orientation={horizontal ? "horizontal" : "vertical"}
        className={cn(
          "group/menu m-0 list-none p-0 text-sm outline-none",
          horizontal ? "relative flex items-center overflow-hidden whitespace-nowrap" : "flex w-full flex-col py-1",
          theme === "dark" ? "bg-[#001529] text-white/65" : cn("bg-bg-container text-text", horizontal ? "border-b border-split" : "border-r border-split"),
          collapsed && "w-20",
          className,
        )}
        style={style}
        onKeyDown={(e) => handleMenuKeyDown(e, horizontal)}
        {...props}
      >
        <MenuList items={visibleItems} level={1} keyPath={[]} inPopup={false} theme={theme} />
        {horizontal && overflowedItems.length > 0 && (
          <SubMenu item={{ key: "__overflow__", label: overflowedIndicator, children: overflowedItems }} level={1} keyPath={[]} inPopup={false} theme={theme} />
        )}
        {horizontal && overflow.measuring && (
          // hidden copy used to measure natural item widths
          <li aria-hidden data-probe className="pointer-events-none invisible absolute top-0 left-0 flex items-center" ref={overflow.probeRef}>
            <ul role="presentation" className="m-0 flex list-none items-center p-0">
              <MenuList items={items} level={1} keyPath={[]} inPopup={false} theme={theme} probe />
            </ul>
          </li>
        )}
      </ul>
    </MenuContext.Provider>
  );
}

/** Horizontal overflow: measure the natural width of every root item and count how many fit next to a "..." trigger. */
function useHorizontalOverflow(enabled: boolean, total: number) {
  const ref = React.useRef<HTMLUListElement>(null);
  const probeRef = React.useRef<HTMLLIElement>(null);
  const [count, setCount] = React.useState(total);
  const widths = React.useRef<number[]>([]);

  React.useLayoutEffect(() => {
    if (!enabled) return;
    const probe = probeRef.current;
    const list = probe?.firstElementChild;
    if (list) widths.current = Array.from(list.children).map((el) => (el as HTMLElement).getBoundingClientRect().width);
  });

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    const measure = () => {
      const available = el.clientWidth;
      const ws = widths.current;
      if (ws.length !== total || available === 0) return;
      const totalWidth = ws.reduce((a, b) => a + b, 0);
      if (totalWidth <= available) {
        setCount(total);
        return;
      }
      const reserve = 56; // width of the "..." trigger
      let used = 0;
      let n = 0;
      for (const w of ws) {
        if (used + w + reserve > available) break;
        used += w;
        n++;
      }
      setCount(n);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [enabled, total]);

  return { ref, probeRef, count: enabled ? count : total, measuring: enabled };
}

export { Menu };
