import * as React from "react";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Portal } from "@/components/ui/portal";
import { useClickOutside } from "@/hooks/use-click-outside";
import { computeFloatingPosition, measureFloating, toContainerCoords } from "@/lib/floating-position";

export interface ComboboxOption {
  value: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  group?: string;
  disabled?: boolean;
}

export interface ComboboxProps
  extends Omit<
    React.ComponentPropsWithoutRef<"button">,
    "defaultValue" | "onChange" | "size" | "value"
  > {
  options: ComboboxOption[];
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null, option?: ComboboxOption) => void;
  /** Let the user commit a value that is not in the list. */
  allowCreate?: boolean;
  onCreate?: (value: string) => void;
  createLabel?: (value: string) => React.ReactNode;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: React.ReactNode;
  disabled?: boolean;
  allowClear?: boolean;
  size?: "sm" | "md" | "lg";
  status?: "error" | "warning";
  /** Match the trigger width (default), or set a fixed popup width. */
  popupWidth?: number | "trigger";
  listHeight?: number;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
}

const SIZE: Record<NonNullable<ComboboxProps["size"]>, string> = {
  sm: "h-control-sm px-2 text-xs",
  md: "h-control px-3 text-sm",
  lg: "h-control-lg px-3.5 text-base",
};

function textOf(option: ComboboxOption): string {
  if (typeof option.label === "string") return option.label;
  return option.value;
}

/**
 * A single-select box that searches inside its own popup — the shape people
 * reach for when Select feels too rigid and AutoComplete too free.
 */
export const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(function Combobox(props, forwardedRef) {
  const isControlled = React.useRef(Object.prototype.hasOwnProperty.call(props, "value")).current;
  const {
    options,
    value: valueProp,
    defaultValue = null,
    onChange,
    allowCreate = false,
    onCreate,
    createLabel,
    placeholder = "Select…",
    searchPlaceholder = "Search…",
    emptyText = "No matches",
    disabled = false,
    allowClear = false,
    size = "md",
    status,
    popupWidth = "trigger",
    listHeight = 280,
    getPopupContainer,
    className,
    id: idProp,
    name,
    style,
    onClick,
    onKeyDown: onTriggerKeyDown,
    ...rest
  } = props;
  const [innerValue, setInnerValue] = React.useState<string | null>(defaultValue);
  const value = isControlled ? (valueProp ?? null) : innerValue;

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const popupRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [pos, setPos] = React.useState<{ top: number; left: number; width: number } | null>(null);
  const posRef = React.useRef<typeof pos>(null);
  const moveFrameRef = React.useRef<number | null>(null);
  const generatedId = React.useId();
  const id = idProp ?? `kk-combobox-${generatedId}`;
  const listId = `${id}-list`;

  const setTriggerRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    },
    [forwardedRef],
  );

  const container = React.useMemo(
    () => (open && getPopupContainer && triggerRef.current ? getPopupContainer(triggerRef.current) : undefined),
    [getPopupContainer, open],
  );

  const close = React.useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const handleOutside = React.useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (triggerRef.current?.contains(event.target as Node)) return;
      const target = event.target instanceof Element ? event.target : null;
      const focusable = target?.closest(
        'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),label,[contenteditable="true"],[tabindex]:not([tabindex="-1"])',
      );
      close(!focusable);
    },
    [close],
  );

  useClickOutside(popupRef, handleOutside, open);

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current || !popupRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const width = popupWidth === "trigger" ? rect.width : popupWidth;
    const targetWidth = `${width}px`;
    if (popupRef.current.style.width !== targetWidth) {
      popupRef.current.style.width = targetWidth;
    }
    const placed = toContainerCoords(
      computeFloatingPosition(rect, measureFloating(popupRef.current), "bottomLeft", 4),
      container,
    );
    const next = { ...placed, width };
    const previous = posRef.current;
    if (previous && previous.top === next.top && previous.left === next.left && previous.width === next.width) return;
    posRef.current = next;
    setPos(next);
  }, [container, popupWidth]);

  React.useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    const schedulePosition = () => {
      if (moveFrameRef.current !== null) return;
      moveFrameRef.current = requestAnimationFrame(() => {
        moveFrameRef.current = null;
        updatePosition();
      });
    };
    const onMove = (event: Event) => {
      if (popupRef.current?.contains(event.target as Node)) return;
      schedulePosition();
    };
    const resizeObserver =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedulePosition);
    if (popupRef.current) resizeObserver?.observe(popupRef.current);
    if (triggerRef.current) resizeObserver?.observe(triggerRef.current);
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
      if (moveFrameRef.current !== null) cancelAnimationFrame(moveFrameRef.current);
      moveFrameRef.current = null;
    };
  }, [open, updatePosition]);

  React.useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    setActive(0);
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [open]);

  const selected = options.find((o) => o.value === value) ?? null;

  const matches = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => `${textOf(o)} ${o.value} ${o.group ?? ""}`.toLowerCase().includes(q));
  }, [options, query]);

  const normalizedQuery = query.trim().toLowerCase();
  const canCreate =
    allowCreate &&
    normalizedQuery.length > 0 &&
    !options.some((option) => textOf(option).toLowerCase() === normalizedQuery || option.value.toLowerCase() === normalizedQuery);

  const groups = React.useMemo(() => {
    const map = new Map<string, ComboboxOption[]>();
    for (const option of matches) {
      const key = option.group ?? "";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(option);
    }
    return [...map.entries()];
  }, [matches]);

  const flat = React.useMemo(() => groups.flatMap(([, list]) => list), [groups]);
  const optionCount = flat.length + (canCreate ? 1 : 0);

  React.useEffect(() => {
    if (!open || optionCount === 0) return;
    setActive((current) => {
      if (current < optionCount && (current >= flat.length || !flat[current]?.disabled)) return current;
      const firstEnabled = flat.findIndex((option) => !option.disabled);
      return firstEnabled >= 0 ? firstEnabled : canCreate ? flat.length : 0;
    });
  }, [canCreate, flat, open, optionCount]);

  React.useEffect(() => {
    if (!open) return;
    popupRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const commit = (option: ComboboxOption | null) => {
    if (option?.disabled) return;
    const next = option?.value ?? null;
    if (!isControlled) setInnerValue(next);
    onChange?.(next, option ?? undefined);
    close();
  };

  const create = () => {
    const text = query.trim();
    const normalized = text.toLowerCase();
    if (
      !text ||
      options.some((option) => textOf(option).toLowerCase() === normalized || option.value.toLowerCase() === normalized)
    ) return;
    onCreate?.(text);
    if (!isControlled) setInnerValue(text);
    onChange?.(text);
    close();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!optionCount) return;
      const delta = e.key === "ArrowDown" ? 1 : -1;
      let next = active;
      for (let i = 0; i < optionCount; i++) {
        next = (next + delta + optionCount) % optionCount;
        if (next >= flat.length || !flat[next]?.disabled) break;
      }
      setActive(next);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active < flat.length) commit(flat[active] ?? null);
      else if (canCreate) create();
    } else if (e.key === "Tab") {
      triggerRef.current?.focus();
      close(false);
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      close();
    }
  };

  let index = -1;

  return (
    <>
      <button
        {...rest}
        ref={setTriggerRef}
        type="button"
        id={id}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        aria-invalid={status === "error" || rest["aria-invalid"] || undefined}
        disabled={disabled}
        data-slot="combobox"
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented && !disabled) setOpen((current) => !current);
        }}
        onKeyDown={(e) => {
          onTriggerKeyDown?.(e);
          if (e.defaultPrevented) return;
          if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={cn(
          "inline-flex w-full items-center justify-between gap-2 rounded-md border border-border bg-bg-container text-text",
          "transition-[border-color,box-shadow] duration-mid ease-kk-in-out outline-none",
          "hover:border-primary-hover focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20",
          SIZE[size],
          status === "error" && "border-error focus-visible:border-error focus-visible:ring-error/20",
          status === "warning" && "border-warning focus-visible:border-warning focus-visible:ring-warning/20",
          disabled && "cursor-not-allowed bg-bg-container-disabled text-text-disabled hover:border-border",
          className,
        )}
        style={style}
      >
        {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
        <span className="flex min-w-0 items-center gap-2">
          {selected?.icon}
          <span className={cn("truncate", !selected && !value && "text-text-placeholder")}>
            {selected ? (selected.label ?? selected.value) : value || placeholder}
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-1 text-text-quaternary">
          {allowClear && value && !disabled && (
            <span
              data-slot="combobox-clear"
              role="button"
              tabIndex={-1}
              aria-label="Clear"
              onClick={(e) => {
                e.stopPropagation();
                commit(null);
              }}
              className="rounded-full p-0.5 hover:bg-fill-tertiary hover:text-text"
            >
              <X className="size-3.5" />
            </span>
          )}
          <ChevronsUpDown className="size-3.5" />
        </span>
      </button>

      {open && (
        <Portal container={container}>
          <div
            ref={popupRef}
            data-slot="combobox-popup"
            onKeyDown={onKeyDown}
            style={{
              position: "absolute",
              top: pos?.top ?? 0,
              left: pos?.left ?? 0,
              width: pos?.width,
              zIndex: 1050,
              visibility: pos ? "visible" : "hidden",
            }}
            className="animate-in fade-in-0 zoom-in-95 duration-200 ease-kk-spring-soft overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-kk"
          >
            <div data-slot="combobox-input-wrapper" className="border-b border-border-secondary px-3">
              <input
                ref={inputRef}
                data-slot="combobox-input"
                role="combobox"
                aria-expanded={open}
                aria-autocomplete="list"
                aria-controls={listId}
                aria-activedescendant={optionCount > 0 ? `${listId}-opt-${active}` : undefined}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="h-9 w-full bg-transparent text-sm text-text outline-none placeholder:text-text-placeholder"
              />
            </div>

            <div
              id={listId}
              role="listbox"
              aria-label={searchPlaceholder}
              className="kk-scrollbar overflow-y-auto p-1"
              style={{ maxHeight: listHeight }}
            >
              {flat.length === 0 && !canCreate && (
                <div data-slot="combobox-empty" className="px-3 py-6 text-center text-sm text-text-tertiary">{emptyText}</div>
              )}

              {groups.map(([group, list]) => (
                <div key={group || "_"} role={group ? "group" : "presentation"} aria-label={group || undefined}>
                  {group && <div aria-hidden="true" className="px-2 py-1 text-xs text-text-tertiary">{group}</div>}
                  {list.map((option) => {
                    index += 1;
                    const myIndex = index;
                    const isSelected = option.value === value;
                    return (
                      <button
                        key={option.value}
                        id={`${listId}-opt-${myIndex}`}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        aria-disabled={option.disabled || undefined}
                        tabIndex={-1}
                        data-index={myIndex}
                        data-slot="combobox-option"
                        onMouseDown={(event) => event.preventDefault()}
                        onMouseMove={() => !option.disabled && setActive(myIndex)}
                        onClick={() => commit(option)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-sm px-2.5 py-1.5 text-left text-sm transition-colors duration-fast",
                          myIndex === active && !option.disabled && "bg-fill-tertiary",
                          isSelected && "font-medium text-primary",
                          option.disabled && "cursor-not-allowed text-text-disabled",
                        )}
                      >
                        {option.icon && <span className="shrink-0 [&_svg]:size-4">{option.icon}</span>}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate">{option.label ?? option.value}</span>
                          {option.description && (
                            <span className="block truncate text-xs text-text-tertiary">{option.description}</span>
                          )}
                        </span>
                        {isSelected && <Check className="size-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              ))}

              {canCreate && (
                <button
                  id={`${listId}-opt-${flat.length}`}
                  type="button"
                  role="option"
                  aria-selected={false}
                  tabIndex={-1}
                  data-index={flat.length}
                  data-slot="combobox-create"
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseMove={() => setActive(flat.length)}
                  onClick={create}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-sm px-2.5 py-1.5 text-left text-sm text-primary transition-colors duration-fast",
                    active === flat.length && "bg-primary-bg",
                  )}
                >
                  <Plus className="size-3.5 shrink-0" />
                  {createLabel ? createLabel(query.trim()) : <span className="truncate">Create “{query.trim()}”</span>}
                </button>
              )}
            </div>
          </div>
        </Portal>
      )}
    </>
  );
});
