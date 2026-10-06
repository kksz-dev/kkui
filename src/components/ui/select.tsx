import * as React from "react";
import { Portal } from "@/components/ui/portal";
import { useClickOutside } from "@/hooks/use-click-outside";
import { computeFloatingPosition, measureFloating, toContainerCoords } from "@/lib/floating-position";
import { Check, ChevronDown, Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ClearIcon,
  inputWrapperVariants,
  useControlled,
  type InputSize,
  type InputStatus,
  type InputVariant,
} from "@/components/ui/input";

/**
 * Select — KKUI Select (single / multiple / tags, search, groups, custom renders)
 * built on the KKUI popover primitive + our own list, so every KKUI feature (chips, tokenization,
 * maxTagCount, popupRender…) works. `SelectTrigger`, `SelectPopup`, `SelectMenu` and
 * `SelectEmpty` are the building blocks reused by AutoComplete / TreeSelect / Cascader.
 */

/* ------------------------------------------------------------------ */
/* shared types & helpers                                              */
/* ------------------------------------------------------------------ */

export type SelectSize = InputSize;
export type SelectStatus = InputStatus;
export type SelectVariant = InputVariant;
export type RawValue = string | number;
export type SelectPlacement = "bottomLeft" | "bottomRight" | "topLeft" | "topRight";

export interface LabeledValue {
  value: RawValue;
  label?: React.ReactNode;
  key?: RawValue;
}

export interface SelectOptionType {
  label?: React.ReactNode;
  value?: RawValue;
  disabled?: boolean;
  title?: string;
  className?: string;
  /** Group: nested options */
  options?: SelectOptionType[];
  [name: string]: unknown;
}

export interface SelectFieldNames {
  label?: string;
  value?: string;
  options?: string;
  groupLabel?: string;
}

/** Flattened option (groups + options in render order). */
export interface FlatOption<O = SelectOptionType> {
  key: string;
  type: "option" | "group";
  option: O;
  value: RawValue;
  label: React.ReactNode;
  disabled: boolean;
  grouped: boolean;
  /** Key of the enclosing group (when grouped) */
  groupKey?: string;
}

/** value | value[] | LabeledValue | LabeledValue[] | null → RawValue[] */
export function toRawValues(v: unknown): RawValue[] {
  if (v == null) return [];
  const arr: unknown[] = Array.isArray(v) ? v : [v];
  return arr
    .filter((x) => x != null)
    .map((x) => (typeof x === "object" ? (x as LabeledValue).value : (x as RawValue)));
}

export function flattenOptions<O extends SelectOptionType>(options: readonly O[], fieldNames?: SelectFieldNames): FlatOption<O>[] {
  const f = { label: "label", value: "value", options: "options", groupLabel: fieldNames?.label ?? "label", ...fieldNames };
  const out: FlatOption<O>[] = [];
  const walk = (list: readonly O[], groupKey: string | undefined) => {
    list.forEach((opt, i) => {
      const children = opt[f.options] as O[] | undefined;
      if (Array.isArray(children)) {
        const key = `${groupKey ?? ""}g${i}`;
        const label = opt[f.groupLabel] as React.ReactNode;
        out.push({ key, type: "group", option: opt, value: key, label, disabled: true, grouped: false });
        walk(children, key);
        return;
      }
      const value = opt[f.value] as RawValue;
      const label = (opt[f.label] as React.ReactNode) ?? value;
      out.push({ key: `${groupKey ?? ""}${String(value)}`, type: "option", option: opt, value, label, disabled: !!opt.disabled, grouped: groupKey !== undefined, groupKey });
    });
  };
  walk(options, undefined);
  return out;
}

export function defaultFilterOption(input: string, option: SelectOptionType, prop = "value"): boolean {
  const raw = option[prop];
  const text = typeof raw === "string" || typeof raw === "number" ? String(raw) : "";
  return text.toLowerCase().includes(input.toLowerCase());
}

/* ------------------------------------------------------------------ */
/* SelectEmpty — inline "No data" (KKUI Empty simple)                  */
/* ------------------------------------------------------------------ */

export function SelectEmpty({ children = "No data", className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div data-slot="select-empty" className={cn("flex flex-col items-center py-2 text-sm text-text-quaternary", className)}>
      <svg width="64" height="41" viewBox="0 0 64 41" aria-hidden className="mb-1">
        <g transform="translate(0 1)" fill="none" fillRule="evenodd">
          <ellipse fill="var(--kk-fill-tertiary)" cx="32" cy="33" rx="32" ry="7" />
          <g fillRule="nonzero" stroke="var(--kk-border)">
            <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z" />
            <path
              d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
              fill="var(--kk-fill-quaternary)"
            />
          </g>
        </g>
      </svg>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SelectTrigger — the Input-looking selector box                      */
/* ------------------------------------------------------------------ */

export interface SelectTriggerProps extends Omit<React.ComponentProps<"div">, "prefix"> {
  size?: SelectSize;
  variant?: SelectVariant;
  status?: SelectStatus;
  disabled?: boolean;
  open?: boolean;
  /** Multiple/tags layout: auto height + wrap */
  multiple?: boolean;
  prefix?: React.ReactNode;
  /** Arrow area; `null` hides it */
  suffixIcon?: React.ReactNode;
  loading?: boolean;
  /** Show the clear icon on hover */
  showClear?: boolean;
  clearIcon?: React.ReactNode;
  onClear?: () => void;
  /** Cursor hint: text when searchable */
  searchable?: boolean;
}

const triggerPad: Record<SelectSize, { single: string; multiple: string }> = {
  sm: { single: "h-control-sm px-[7px]", multiple: "min-h-control-sm px-1 py-[3px]" },
  md: { single: "h-control px-[11px]", multiple: "min-h-control px-1 py-[3px]" },
  lg: { single: "h-control-lg px-[11px]", multiple: "min-h-control-lg px-1 py-[3px]" },
};

export function SelectTrigger({
  className,
  size = "md",
  variant = "outlined",
  status,
  disabled = false,
  open = false,
  multiple = false,
  prefix,
  suffixIcon,
  loading = false,
  showClear = false,
  clearIcon,
  onClear,
  searchable = false,
  children,
  ...props
}: SelectTriggerProps) {
  const arrow = loading ? (
    <Loader2 className="animate-spin" />
  ) : suffixIcon !== undefined ? (
    suffixIcon
  ) : searchable && open ? (
    <Search />
  ) : (
    <ChevronDown />
  );
  return (
    <div
      data-slot="select-trigger"
      data-state={open ? "open" : "closed"}
      data-disabled={disabled || undefined}
      data-status={status}
      aria-disabled={disabled || undefined}
      className={cn(
        "group",
        inputWrapperVariants({ variant, size, status: status ?? "default", disabled }),
        multiple ? triggerPad[size].multiple : triggerPad[size].single,
        !disabled && (searchable ? "cursor-text" : "cursor-pointer"),
        className,
      )}
      {...props}
    >
      {prefix != null && <span data-slot="select-prefix" className="flex shrink-0 items-center [&_svg]:size-4">{prefix}</span>}
      {children}
      {(arrow != null || showClear) && (
        <span data-slot="select-suffix" className="relative flex shrink-0 items-center self-center text-text-quaternary [&_svg]:size-3">
          <span className={cn("flex items-center transition-opacity duration-mid", showClear && "group-hover:opacity-0")}>{arrow}</span>
          {showClear && (
            <span
              role="button"
              tabIndex={-1}
              aria-label="clear"
              data-slot="select-clear"
              className="absolute inset-0 flex cursor-pointer items-center justify-center opacity-0 transition-opacity duration-mid group-hover:opacity-100"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
                onClear?.();
              }}
            >
              {clearIcon ?? <ClearIcon />}
            </span>
          )}
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SelectPopup — KKUI popover anchored to the trigger                  */
/* ------------------------------------------------------------------ */

export interface SelectPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The trigger element (receives the Popover anchor via Slot) */
  anchor: React.ReactElement;
  /** Ref of the trigger root — clicks inside it never dismiss the popup */
  anchorRef: React.RefObject<HTMLElement | null>;
  placement?: SelectPlacement;
  /** true: same width as trigger · false: min-width trigger · number: fixed px */
  popupMatchSelectWidth?: boolean | number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  /** Called on blur that leaves both trigger and popup */
  onOutsideBlur?: () => void;
  /** Mount the popup somewhere other than <body>, e.g. inside a scrolling panel. */
  getPopupContainer?: (triggerNode: HTMLElement | null) => HTMLElement;
}

export function SelectPopup({
  open,
  onOpenChange,
  anchor,
  anchorRef,
  placement = "bottomLeft",
  popupMatchSelectWidth = true,
  className,
  style,
  children,
  onOutsideBlur,
  getPopupContainer,
}: SelectPopupProps) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const container = React.useMemo(
    () => (getPopupContainer ? getPopupContainer(anchorRef.current) : undefined),
    [getPopupContainer, open], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const [pos, setPos] = React.useState<{ top: number; left: number; width?: number } | null>(null);

  useClickOutside(contentRef, (e) => {
    if (anchorRef.current?.contains(e.target as Node)) return;
    onOpenChange?.(false);
    onOutsideBlur?.();
  }, open);

  const updatePosition = React.useCallback(() => {
    if (!anchorRef.current || !contentRef.current) return;
    const tRect = anchorRef.current.getBoundingClientRect();
    const cRect = measureFloating(contentRef.current);
    const floating = toContainerCoords(computeFloatingPosition(tRect, cRect, placement, 4), container);
    setPos({
      top: floating.top,
      left: floating.left,
      width: typeof popupMatchSelectWidth === "number" ? popupMatchSelectWidth : popupMatchSelectWidth ? tRect.width : undefined,
    });
  }, [anchorRef, placement, popupMatchSelectWidth, container]);

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

  return (
    <>
      {anchor}
      {open && (
        <Portal container={container}>
          <div
            ref={contentRef}
            data-slot="select-popup"
            style={{
              position: "absolute",
              top: pos?.top ?? -9999,
              left: pos?.left ?? -9999,
              width: pos?.width,
              minWidth: typeof popupMatchSelectWidth === "number" ? popupMatchSelectWidth : !popupMatchSelectWidth ? anchorRef.current?.offsetWidth : undefined,
              zIndex: 1050,
              ...style,
            }}
            className={cn(
              "z-50 rounded-lg bg-bg-elevated p-1 text-sm text-text shadow-kk-secondary border border-border outline-none animate-in fade-in-0 zoom-in-95 duration-200 ease-kk-spring-soft",
              className,
            )}
          >
            {children}
          </div>
        </Portal>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* SelectMenu — flat option list                                        */
/* ------------------------------------------------------------------ */

export interface SelectMenuProps<O extends SelectOptionType = SelectOptionType> {
  /** Window long lists instead of mounting every option. Default: on past 60 items. */
  virtual?: boolean;
  /** Row height used by the windowed renderer. */
  optionHeight?: number;
  items: FlatOption<O>[];
  selected: ReadonlySet<RawValue>;
  active: number;
  onActive: (index: number) => void;
  onSelect: (item: FlatOption<O>) => void;
  multiple?: boolean;
  listHeight?: number;
  notFoundContent?: React.ReactNode;
  optionRender?: (option: O, info: { index: number }) => React.ReactNode;
  menuItemSelectedIcon?: React.ReactNode;
  id?: string;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
  className?: string;
}

export function SelectMenu<O extends SelectOptionType = SelectOptionType>({
  items,
  selected,
  active,
  onActive,
  onSelect,
  multiple = false,
  listHeight = 256,
  notFoundContent,
  optionRender,
  menuItemSelectedIcon,
  id,
  onScroll,
  virtual,
  optionHeight = 32,
  className,
}: SelectMenuProps<O>) {
  const listRef = React.useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = React.useState(0);

  // long lists are windowed; the caller can force it either way
  const windowed = virtual ?? items.length > 60;
  const overscan = 8;
  const start = windowed ? Math.max(0, Math.floor(scrollTop / optionHeight) - overscan) : 0;
  const end = windowed
    ? Math.min(items.length, start + Math.ceil(listHeight / optionHeight) + overscan * 2)
    : items.length;
  const slice = windowed ? items.slice(start, end) : items;

  React.useEffect(() => {
    if (active < 0) return;
    if (windowed) {
      const target = active * optionHeight;
      const el = listRef.current;
      if (el) {
        if (target < el.scrollTop) el.scrollTop = target;
        else if (target + optionHeight > el.scrollTop + listHeight) el.scrollTop = target + optionHeight - listHeight;
      }
      return;
    }
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active, windowed, optionHeight, listHeight]);

  if (items.length === 0) {
    return <div className={className}>{notFoundContent === undefined ? <SelectEmpty /> : notFoundContent}</div>;
  }
  return (
    <div
      ref={listRef}
      id={id}
      role="listbox"
      aria-multiselectable={multiple || undefined}
      data-slot="select-menu"
      className={cn("kk-scrollbar overflow-y-auto overscroll-contain", className)}
      style={{ maxHeight: listHeight }}
      onScroll={(e) => {
        if (windowed) setScrollTop((e.target as HTMLDivElement).scrollTop);
        onScroll?.(e);
      }}
    >
      {windowed && start > 0 && <div aria-hidden style={{ height: start * optionHeight }} />}
      {slice.map((item, sliceIndex) => {
        const index = start + sliceIndex;
        if (item.type === "group") {
          return (
            <div key={item.key} role="presentation" data-slot="select-group" className="cursor-default px-3 py-[5px] text-xs text-text-tertiary">
              {item.label}
            </div>
          );
        }
        const isSelected = selected.has(item.value);
        const isActive = index === active;
        return (
          <div
            key={item.key}
            role="option"
            aria-selected={isSelected}
            aria-disabled={item.disabled || undefined}
            data-index={index}
            data-slot="select-option"
            data-active={isActive || undefined}
            data-selected={isSelected || undefined}
            style={windowed ? { height: optionHeight } : undefined}
            title={item.option.title ?? (typeof item.label === "string" ? item.label : undefined)}
            className={cn(
              "relative flex min-h-8 cursor-pointer items-center gap-2 rounded-sm px-3 py-[5px] text-sm text-text transition-colors duration-mid",
              windowed && "min-h-0",
              item.grouped && "ps-6",
              isActive && !item.disabled && "bg-fill-tertiary",
              isSelected && "bg-control-item-bg-active font-semibold",
              item.disabled && "cursor-not-allowed text-text-disabled",
              item.option.className,
            )}
            onMouseMove={() => {
              if (!item.disabled && !isActive) onActive(index);
            }}
            onClick={() => {
              if (!item.disabled) onSelect(item);
            }}
          >
            <span className="min-w-0 flex-1 truncate">{optionRender ? optionRender(item.option, { index }) : item.label}</span>
            {multiple && isSelected && (
              <span className="flex shrink-0 items-center text-primary [&_svg]:size-3.5">{menuItemSelectedIcon ?? <Check />}</span>
            )}
          </div>
        );
      })}
      {windowed && end < items.length && <div aria-hidden style={{ height: (items.length - end) * optionHeight }} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SelectTag — chip in multiple mode                                    */
/* ------------------------------------------------------------------ */

export interface SelectTagProps {
  size?: SelectSize;
  disabled?: boolean;
  closable?: boolean;
  onClose?: (e: React.MouseEvent) => void;
  removeIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const tagHeight: Record<SelectSize, string> = { sm: "h-4", md: "h-6", lg: "h-8" };

export function SelectTag({ size = "md", disabled, closable = true, onClose, removeIcon, children, className, title }: SelectTagProps) {
  return (
    <span
      data-slot="select-tag"
      title={title}
      className={cn(
        "inline-flex max-w-full items-center rounded-sm border border-transparent bg-fill-secondary ps-2 pe-1 text-sm leading-none text-text select-none",
        tagHeight[size],
        size === "lg" && "text-base",
        disabled && "bg-bg-container-disabled text-text-disabled",
        className,
      )}
    >
      <span className="truncate">{children}</span>
      {closable && !disabled && (
        <span
          role="button"
          tabIndex={-1}
          aria-label="remove"
          className="ms-1 inline-flex cursor-pointer items-center text-text-tertiary transition-colors hover:text-text [&_svg]:size-2.5"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClose?.(e);
          }}
        >
          {removeIcon ?? <X strokeWidth={3} />}
        </span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* useSelectOverflow — maxTagCount="responsive"                         */
/* ------------------------------------------------------------------ */

/**
 * Measures how many chips fit on one line. Renders a hidden mirror row of all chips,
 * compares against the container width (minus room for the "+N" chip and the input).
 */
export function useResponsiveTagCount(enabled: boolean, count: number) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mirrorRef = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(count);

  const measure = React.useCallback(() => {
    const c = containerRef.current;
    const m = mirrorRef.current;
    if (!c || !m) return;
    const restWidth = 56; // "+ N ..." chip + input min width
    const limit = c.clientWidth - restWidth;
    const chips = Array.from(m.children) as HTMLElement[];
    let used = 0;
    let n = 0;
    for (const chip of chips) {
      const w = chip.offsetWidth + 4;
      if (used + w > limit) break;
      used += w;
      n += 1;
    }
    setVisible(n >= chips.length ? chips.length : Math.max(n, 0));
  }, []);

  React.useLayoutEffect(() => {
    if (!enabled) return;
    measure();
    const c = containerRef.current;
    if (!c) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(c);
    return () => ro.disconnect();
  }, [enabled, measure, count]);

  return { containerRef, mirrorRef, visible: enabled ? visible : count };
}

/* ------------------------------------------------------------------ */
/* SelectSelector — tags / display value / search input inside trigger  */
/* ------------------------------------------------------------------ */

export interface SelectSelectorItem {
  value: RawValue;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SelectTagRenderProps {
  label: React.ReactNode;
  value: RawValue;
  disabled: boolean;
  closable: boolean;
  onClose: (e?: React.MouseEvent) => void;
}

export interface SelectSelectorProps {
  multiple: boolean;
  /** Selected items with their display labels */
  items: SelectSelectorItem[];
  size?: SelectSize;
  open?: boolean;
  showSearch?: boolean;
  search: string;
  placeholder?: React.ReactNode;
  maxTagCount?: number | "responsive";
  maxTagPlaceholder?: React.ReactNode | ((omitted: LabeledValue[]) => React.ReactNode);
  tagRender?: (props: SelectTagRenderProps) => React.ReactNode;
  removeIcon?: React.ReactNode;
  onRemove: (value: RawValue) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  /** id / aria / handlers for the (always present) combobox input */
  inputProps?: React.ComponentProps<"input">;
}

export function SelectSelector({
  multiple,
  items,
  size = "md",
  open = false,
  showSearch = false,
  search,
  placeholder,
  maxTagCount,
  maxTagPlaceholder,
  tagRender,
  removeIcon,
  onRemove,
  inputRef,
  inputProps,
}: SelectSelectorProps) {
  const overflow = useResponsiveTagCount(multiple && maxTagCount === "responsive", items.length);
  const visibleCount = maxTagCount === "responsive" ? overflow.visible : typeof maxTagCount === "number" ? maxTagCount : items.length;
  const shown = items.slice(0, visibleCount);
  const omitted = items.slice(visibleCount);
  const showPlaceholder = items.length === 0 && !search;

  const renderTag = (it: SelectSelectorItem) => {
    const tagDisabled = !!it.disabled;
    if (tagRender) {
      return (
        <React.Fragment key={String(it.value)}>
          {tagRender({ label: it.label, value: it.value, disabled: tagDisabled, closable: !tagDisabled, onClose: () => onRemove(it.value) })}
        </React.Fragment>
      );
    }
    return (
      <SelectTag key={String(it.value)} size={size} disabled={tagDisabled} onClose={() => onRemove(it.value)} removeIcon={removeIcon} title={typeof it.label === "string" ? it.label : undefined}>
        {it.label}
      </SelectTag>
    );
  };

  const input = (
    <input
      ref={inputRef}
      role="combobox"
      aria-expanded={open}
      aria-autocomplete={showSearch ? "list" : undefined}
      aria-haspopup="listbox"
      autoComplete="off"
      readOnly={!showSearch}
      value={search}
      {...inputProps}
      className={cn(
        "absolute inset-0 h-full w-full bg-transparent p-0 text-inherit outline-none",
        !showSearch && "cursor-pointer caret-transparent",
        !showSearch && multiple && "opacity-0",
        inputProps?.className,
      )}
    />
  );

  if (!multiple) {
    return (
      <div data-slot="select-selector" className="relative flex min-w-0 flex-1 items-center self-stretch">
        {items.length > 0 && !search && (
          <span className={cn("min-w-0 flex-1 truncate", open && showSearch && "text-text-tertiary")}>{items[0].label}</span>
        )}
        {showPlaceholder && placeholder != null && <span className="pointer-events-none min-w-0 flex-1 truncate text-text-placeholder">{placeholder}</span>}
        {input}
      </div>
    );
  }
  return (
    <div ref={overflow.containerRef} data-slot="select-selector" className="relative flex min-w-0 flex-1 flex-wrap items-center gap-1 self-stretch">
      {maxTagCount === "responsive" && (
        <div ref={overflow.mirrorRef} aria-hidden className="pointer-events-none invisible absolute inset-x-0 top-0 flex flex-nowrap items-center gap-1 overflow-hidden whitespace-nowrap">
          {items.map(renderTag)}
        </div>
      )}
      {shown.map(renderTag)}
      {omitted.length > 0 && (
        <SelectTag size={size} closable={false}>
          {typeof maxTagPlaceholder === "function" ? maxTagPlaceholder(omitted.map((it) => ({ value: it.value, label: it.label }))) : (maxTagPlaceholder ?? `+ ${omitted.length} ...`)}
        </SelectTag>
      )}
      <span className={cn("relative inline-flex max-w-full items-center", tagHeight[size])} style={{ minWidth: 4 }}>
        <span aria-hidden className="invisible whitespace-pre px-px">{search}</span>
        {input}
      </span>
      {showPlaceholder && placeholder != null && (
        <span className="pointer-events-none absolute start-[7px] top-1/2 -translate-y-1/2 truncate text-text-placeholder">{placeholder}</span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Select                                                               */
/* ------------------------------------------------------------------ */

export type SelectMode = "multiple" | "tags";

export interface SelectOptionProps {
  value: RawValue;
  disabled?: boolean;
  title?: string;
  className?: string;
  children?: React.ReactNode;
}
/** Declarative option (alternative to `options`). Renders nothing itself. */
function SelectOption(_props: SelectOptionProps): null {
  return null;
}
export interface SelectOptGroupProps {
  label?: React.ReactNode;
  children?: React.ReactNode;
}
/** Declarative option group. Renders nothing itself. */
function SelectOptGroup(_props: SelectOptGroupProps): null {
  return null;
}

function optionsFromChildren(children: React.ReactNode): SelectOptionType[] {
  const out: SelectOptionType[] = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    if (child.type === SelectOptGroup) {
      const p = child.props as SelectOptGroupProps;
      out.push({ label: p.label, options: optionsFromChildren(p.children) });
    } else if (child.type === SelectOption) {
      const p = child.props as SelectOptionProps;
      out.push({ value: p.value, label: p.children ?? String(p.value), disabled: p.disabled, title: p.title, className: p.className });
    }
  });
  return out;
}

export interface SelectProps<T = RawValue, O extends SelectOptionType = SelectOptionType>
  extends Omit<React.ComponentProps<"div">, "value" | "defaultValue" | "onChange" | "onSelect" | "prefix" | "onBlur" | "onFocus" | "children"> {
  /** Window long option lists. Defaults to on past 60 options. */
  virtual?: boolean;
  /** Row height used by the windowed list. */
  optionHeight?: number;
  /** Mount the popup inside another element instead of <body>. */
  getPopupContainer?: (triggerNode: HTMLElement | null) => HTMLElement;
  options?: O[];
  /** `<SelectOption>` / `<SelectOptGroup>` children (alternative to `options`) */
  children?: React.ReactNode;
  fieldNames?: SelectFieldNames;
  value?: T | null;
  defaultValue?: T | null;
  onChange?: (value: T, option: O | O[]) => void;
  mode?: SelectMode;
  /** Wrap value as `{ value, label }` */
  labelInValue?: boolean;
  placeholder?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  size?: SelectSize;
  status?: SelectStatus;
  variant?: SelectVariant;
  allowClear?: boolean | { clearIcon?: React.ReactNode };
  showSearch?: boolean;
  searchValue?: string;
  onSearch?: (value: string) => void;
  /** false = no client filtering (async search); function = custom predicate */
  filterOption?: boolean | ((input: string, option: O) => boolean);
  /** Which option field is filtered by the default filter */
  optionFilterProp?: string;
  /** Which option field is shown in the trigger for the selected value */
  optionLabelProp?: string;
  filterSort?: (a: O, b: O, info: { searchValue: string }) => number;
  autoClearSearchValue?: boolean;
  defaultActiveFirstOption?: boolean;
  notFoundContent?: React.ReactNode;
  optionRender?: (option: O, info: { index: number }) => React.ReactNode;
  labelRender?: (props: LabeledValue) => React.ReactNode;
  tagRender?: (props: SelectTagRenderProps) => React.ReactNode;
  popupRender?: (menu: React.ReactElement) => React.ReactNode;
  /** @deprecated use popupRender */
  dropdownRender?: (menu: React.ReactElement) => React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** @deprecated use onOpenChange */
  onDropdownVisibleChange?: (open: boolean) => void;
  listHeight?: number;
  placement?: SelectPlacement;
  popupMatchSelectWidth?: boolean | number;
  popupClassName?: string;
  popupStyle?: React.CSSProperties;
  /** @deprecated use popupStyle */
  dropdownStyle?: React.CSSProperties;
  prefix?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  removeIcon?: React.ReactNode;
  menuItemSelectedIcon?: React.ReactNode;
  /** Max tags shown; the rest collapse into "+ N ..." */
  maxTagCount?: number | "responsive";
  maxTagPlaceholder?: React.ReactNode | ((omitted: LabeledValue[]) => React.ReactNode);
  maxTagTextLength?: number;
  /** Max number of selected items (multiple / tags) */
  maxCount?: number;
  /** Characters that split typed text into tags */
  tokenSeparators?: string[];
  autoFocus?: boolean;
  onSelect?: (value: RawValue, option: O) => void;
  onDeselect?: (value: RawValue, option: O) => void;
  onClear?: () => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onInputKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onPopupScroll?: React.UIEventHandler<HTMLDivElement>;
}

let uid = 0;

function Select<T = RawValue, O extends SelectOptionType = SelectOptionType>({
  className,
  style,
  options,
  children,
  fieldNames,
  value,
  defaultValue,
  onChange,
  mode,
  labelInValue = false,
  placeholder,
  disabled = false,
  loading = false,
  size = "md",
  status,
  variant = "outlined",
  allowClear = false,
  showSearch: showSearchProp,
  searchValue: searchValueProp,
  onSearch,
  filterOption = true,
  optionFilterProp = "value",
  optionLabelProp = "label",
  filterSort,
  autoClearSearchValue = true,
  defaultActiveFirstOption = true,
  notFoundContent,
  optionRender,
  labelRender,
  tagRender,
  popupRender,
  dropdownRender,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onDropdownVisibleChange,
  listHeight = 256,
  placement = "bottomLeft",
  popupMatchSelectWidth = true,
  popupClassName,
  popupStyle,
  dropdownStyle,
  prefix,
  suffixIcon,
  removeIcon,
  menuItemSelectedIcon,
  maxTagCount,
  maxTagPlaceholder,
  maxTagTextLength,
  maxCount,
  tokenSeparators,
  autoFocus,
  onSelect,
  onDeselect,
  onClear,
  onBlur,
  onFocus,
  onInputKeyDown,
  onPopupScroll,
  getPopupContainer,
  virtual,
  optionHeight,
  ...rest
}: SelectProps<T, O>) {
  const multiple = mode === "multiple" || mode === "tags";
  const isTags = mode === "tags";
  const showSearch = showSearchProp ?? multiple;
  const [id] = React.useState(() => `kk-select-${++uid}`);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const labelCache = React.useRef(new Map<RawValue, React.ReactNode>());

  /* ---- data ---- */
  const mergedOptions = React.useMemo(() => options ?? (optionsFromChildren(children) as O[]), [options, children]);
  const flat = React.useMemo(() => flattenOptions(mergedOptions, fieldNames), [mergedOptions, fieldNames]);
  const optionMap = React.useMemo(() => {
    const m = new Map<RawValue, FlatOption<O>>();
    for (const f of flat) if (f.type === "option" && !m.has(f.value)) m.set(f.value, f);
    return m;
  }, [flat]);

  /* ---- state ---- */
  const [rawValues, setRawValues] = useControlled<RawValue[]>(value === undefined ? undefined : toRawValues(value), toRawValues(defaultValue));
  const [search, setSearchInner] = useControlled(searchValueProp, "");
  const [open, setOpenInner] = useControlled(openProp, defaultOpen);
  const [active, setActive] = React.useState(-1);
  const [focused, setFocused] = React.useState(false);
  const popupMouseDown = React.useRef(false);

  // remember labels for labelInValue input
  React.useEffect(() => {
    const collect = (v: unknown) => {
      const arr: unknown[] = Array.isArray(v) ? v : [v];
      for (const x of arr) if (x && typeof x === "object") labelCache.current.set((x as LabeledValue).value, (x as LabeledValue).label);
    };
    collect(value);
    collect(defaultValue);
  }, [value, defaultValue]);

  const setOpen = (next: boolean) => {
    if (disabled) return;
    if (next === open) return;
    setOpenInner(next);
    onOpenChange?.(next);
    onDropdownVisibleChange?.(next);
  };
  const setSearch = (next: string) => {
    setSearchInner(next);
    onSearch?.(next);
  };

  /* ---- filtered items ---- */
  const items = React.useMemo<FlatOption<O>[]>(() => {
    let list = flat;
    if (showSearch && search && filterOption !== false) {
      const fn = typeof filterOption === "function" ? filterOption : (input: string, o: O) => defaultFilterOption(input, o, optionFilterProp);
      const keep = new Set<string>();
      for (const f of flat) {
        if (f.type === "option" && fn(search, f.option)) {
          keep.add(f.key);
          if (f.groupKey) keep.add(f.groupKey);
        }
      }
      list = flat.filter((f) => keep.has(f.key));
    }
    if (filterSort) {
      list = [...list.filter((f) => f.type === "option")].sort((a, b) => filterSort(a.option, b.option, { searchValue: search }));
    }
    if (isTags && search && !flat.some((f) => f.type === "option" && String(f.value) === search)) {
      const created = { value: search, label: search } as unknown as O;
      list = [{ key: `__tag_${search}`, type: "option", option: created, value: search, label: search, disabled: false, grouped: false }, ...list];
    }
    if (multiple && maxCount !== undefined && rawValues.length >= maxCount) {
      list = list.map((f) => (f.type === "option" && !rawValues.includes(f.value) ? { ...f, disabled: true } : f));
    }
    return list;
  }, [flat, showSearch, search, filterOption, optionFilterProp, filterSort, isTags, multiple, maxCount, rawValues]);

  const selectedSet = React.useMemo(() => new Set(rawValues), [rawValues]);

  const firstEnabled = React.useCallback(
    (from = 0, dir: 1 | -1 = 1) => {
      const n = items.length;
      for (let step = 0; step < n; step++) {
        const i = (((from + step * dir) % n) + n) % n;
        const it = items[i];
        if (it.type === "option" && !it.disabled) return i;
      }
      return -1;
    },
    [items],
  );

  // reset active option when the popup opens or the list changes
  const itemsLen = items.length;
  React.useEffect(() => {
    if (!open) return;
    const selectedIdx = search ? -1 : items.findIndex((f) => f.type === "option" && selectedSet.has(f.value));
    setActive(selectedIdx >= 0 ? selectedIdx : defaultActiveFirstOption ? firstEnabled(0) : -1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, search, itemsLen]);

  /* ---- emit ---- */
  const optionOf = (v: RawValue): O => optionMap.get(v)?.option ?? ({ value: v, label: labelCache.current.get(v) ?? v } as unknown as O);
  /** Label from options or from a previously seen labeled value; undefined when unknown. */
  const labelOf = (v: RawValue): React.ReactNode => {
    const opt = optionMap.get(v);
    if (opt) return (opt.option[optionLabelProp] as React.ReactNode) ?? opt.label;
    return labelCache.current.get(v);
  };
  const emit = (next: RawValue[]) => {
    setRawValues(next);
    if (!onChange) return;
    const opts = next.map(optionOf);
    if (multiple) {
      const v = labelInValue ? next.map((x) => ({ value: x, label: labelOf(x) ?? x })) : next;
      onChange(v as T, opts);
    } else {
      const x = next[0];
      const v = x === undefined ? undefined : labelInValue ? { value: x, label: labelOf(x) ?? x } : x;
      onChange(v as T, opts[0]);
    }
  };

  const selectValue = (v: RawValue, opt: O) => {
    if (multiple) {
      if (rawValues.includes(v)) {
        emit(rawValues.filter((x) => x !== v));
        onDeselect?.(v, opt);
      } else {
        if (maxCount !== undefined && rawValues.length >= maxCount) return;
        labelCache.current.set(v, (opt.label as React.ReactNode) ?? v);
        emit([...rawValues, v]);
        onSelect?.(v, opt);
      }
      if (autoClearSearchValue && search) setSearch("");
    } else {
      labelCache.current.set(v, (opt.label as React.ReactNode) ?? v);
      if (rawValues[0] !== v) emit([v]);
      onSelect?.(v, opt);
      setSearch("");
      setOpen(false);
    }
  };
  const removeValue = (v: RawValue) => {
    if (disabled) return;
    emit(rawValues.filter((x) => x !== v));
    onDeselect?.(v, optionOf(v));
  };
  const clearAll = () => {
    emit([]);
    setSearch("");
    onClear?.();
    inputRef.current?.focus();
  };
  const commitTags = (text: string) => {
    if (!isTags) return false;
    const t = text.trim();
    if (!t || rawValues.includes(t)) return false;
    if (maxCount !== undefined && rawValues.length >= maxCount) return false;
    labelCache.current.set(t, t);
    emit([...rawValues, t]);
    onSelect?.(t, optionOf(t));
    return true;
  };

  /* ---- input events ---- */
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    if (multiple && tokenSeparators?.length && tokenSeparators.some((s) => text.includes(s))) {
      const re = new RegExp(tokenSeparators.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"));
      const parts = text.split(re).map((p) => p.trim()).filter(Boolean);
      const next = [...rawValues];
      for (const p of parts) {
        if (maxCount !== undefined && next.length >= maxCount) break;
        const match = flat.find((f) => f.type === "option" && (String(f.value) === p || (typeof f.label === "string" && f.label === p)));
        const v = match ? match.value : isTags ? p : undefined;
        if (v === undefined || next.includes(v)) continue;
        next.push(v);
        labelCache.current.set(v, match?.label ?? v);
      }
      if (next.length !== rawValues.length) emit(next);
      setSearch("");
      return;
    }
    if (!showSearch) return;
    setSearch(text);
    if (!open) setOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onInputKeyDown?.(e);
    if (e.defaultPrevented || disabled) return;
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp": {
        e.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        const dir = e.key === "ArrowDown" ? 1 : -1;
        setActive(firstEnabled(active + dir, dir));
        break;
      }
      case "Enter": {
        if (!open) {
          setOpen(true);
          return;
        }
        e.preventDefault();
        const it = items[active];
        if (it && it.type === "option" && !it.disabled) selectValue(it.value, it.option);
        else if (isTags && search && commitTags(search)) setSearch("");
        break;
      }
      case "Escape":
        if (open) {
          e.stopPropagation();
          setOpen(false);
        }
        break;
      case "Tab":
        setOpen(false);
        break;
      case "Backspace":
        if (multiple && !search && rawValues.length) {
          const last = rawValues[rawValues.length - 1];
          const opt = optionMap.get(last);
          if (!opt || !opt.disabled) removeValue(last);
        }
        break;
      case " ":
        if (!showSearch && !open) {
          e.preventDefault();
          setOpen(true);
        }
        break;
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (popupMouseDown.current) return;
    setFocused(false);
    if (isTags && search) commitTags(search);
    if (search && searchValueProp === undefined) setSearch("");
    setOpen(false);
    onBlur?.(e);
  };

  const handleTriggerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const onInput = e.target === inputRef.current;
    if (!onInput) e.preventDefault();
    inputRef.current?.focus();
    if (e.button !== 0) return;
    if (open && onInput && showSearch) return;
    setOpen(!open);
  };

  /* ---- display ---- */
  const displayLabel = (v: RawValue) => {
    let label = labelOf(v);
    if (maxTagTextLength && typeof label === "string" && label.length > maxTagTextLength) label = `${label.slice(0, maxTagTextLength)}...`;
    return labelRender ? labelRender({ value: v, label }) : (label ?? String(v));
  };

  const hasValue = rawValues.length > 0;
  const menu = (
    <SelectMenu<O>
      id={`${id}-list`}
      items={items}
      selected={selectedSet}
      active={active}
      onActive={setActive}
      onSelect={(it) => selectValue(it.value, it.option)}
      multiple={multiple}
      listHeight={listHeight}
      notFoundContent={notFoundContent}
      optionRender={optionRender}
      menuItemSelectedIcon={menuItemSelectedIcon}
      virtual={virtual}
      optionHeight={optionHeight}
      onScroll={onPopupScroll}
    />
  );
  const render = popupRender ?? dropdownRender;

  const trigger = (
    <SelectTrigger
      ref={rootRef}
      size={size}
      variant={variant}
      status={status}
      disabled={disabled}
      open={open}
      multiple={multiple}
      prefix={prefix}
      suffixIcon={suffixIcon}
      loading={loading}
      searchable={showSearch}
      showClear={!!allowClear && !disabled && (hasValue || !!search)}
      clearIcon={typeof allowClear === "object" ? allowClear.clearIcon : undefined}
      onClear={clearAll}
      className={cn("inline-flex", className)}
      style={style}
      data-slot="select"
      data-focused={focused || undefined}
      {...rest}
      onMouseDown={(e) => {
        // spread first, then merge: a caller's own onMouseDown used to replace this
        // one outright and the popup would never open
        rest.onMouseDown?.(e);
        handleTriggerMouseDown(e);
      }}
    >
      <SelectSelector
        multiple={multiple}
        items={rawValues.map((v) => ({ value: v, label: displayLabel(v), disabled: disabled || !!optionMap.get(v)?.disabled }))}
        size={size}
        open={open}
        showSearch={showSearch}
        search={search}
        placeholder={placeholder}
        maxTagCount={maxTagCount}
        maxTagPlaceholder={maxTagPlaceholder}
        tagRender={tagRender}
        removeIcon={removeIcon}
        onRemove={removeValue}
        inputRef={inputRef}
        inputProps={{
          id,
          "aria-controls": `${id}-list`,
          autoFocus,
          disabled,
          onChange: handleInput,
          onKeyDown: handleKeyDown,
          onFocus: (e) => {
            setFocused(true);
            onFocus?.(e);
          },
          onBlur: handleBlur,
        }}
      />
    </SelectTrigger>
  );

  return (
    <SelectPopup
      getPopupContainer={getPopupContainer}
      open={open && !disabled}
      onOpenChange={setOpen}
      anchor={trigger}
      anchorRef={rootRef}
      placement={placement}
      popupMatchSelectWidth={popupMatchSelectWidth}
      className={popupClassName}
      style={popupStyle ?? dropdownStyle}
      onOutsideBlur={() => setOpen(false)}
    >
      <div
        onMouseDownCapture={() => {
          popupMouseDown.current = true;
          window.setTimeout(() => {
            popupMouseDown.current = false;
          }, 0);
        }}
      >
        {render ? render(menu) : menu}
      </div>
    </SelectPopup>
  );
}

export { Select, SelectOption, SelectOptGroup };
