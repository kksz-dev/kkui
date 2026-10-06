import * as React from "react";
import { Search, CornerDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Portal } from "@/components/ui/portal";
import { useScrollLock } from "@/hooks/use-scroll-lock";

export interface CommandItem {
  key: string;
  label: React.ReactNode;
  /** Text the filter matches against; defaults to `label` when it is a string. */
  value?: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  /** Right-hand hint, e.g. a keyboard shortcut. */
  shortcut?: React.ReactNode;
  group?: string;
  keywords?: string[];
  disabled?: boolean;
  /** Override whether this command closes the palette after selection. */
  closeOnSelect?: boolean;
  onSelect?: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandItem[];
  /** Controlled query; pair with `onValueChange`. */
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyText?: React.ReactNode;
  /** Hint bar rendered under the list. */
  footer?: React.ReactNode;
  /** Replace the built-in matcher. */
  filter?: (item: CommandItem, query: string) => boolean;
  /** Open on this key with the platform's modifier. Default "k"; false disables it. */
  shortcutKey?: string | false;
  /** Close after a command runs. Individual items can override this. */
  closeOnSelect?: boolean;
  maxHeight?: number;
  /** Portal target; `false` renders in place. */
  getContainer?: HTMLElement | (() => HTMLElement) | false;
  zIndex?: number;
  className?: string;
}

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

function defaultText(item: CommandItem): string {
  if (item.value) return item.value;
  return typeof item.label === "string" ? item.label : item.key;
}

function defaultFilter(item: CommandItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [defaultText(item), ...(item.keywords ?? []), item.group ?? ""].join(" ").toLowerCase();
  // every word must appear somewhere, in any order
  return q.split(/\s+/).every((word) => haystack.includes(word));
}

export function CommandPalette({
  open,
  onOpenChange,
  items,
  value,
  onValueChange,
  placeholder = "Type a command or search…",
  emptyText = "No results",
  footer,
  filter = defaultFilter,
  shortcutKey = "k",
  closeOnSelect = true,
  maxHeight = 360,
  getContainer,
  zIndex = 1050,
  className,
}: CommandPaletteProps) {
  const [innerQuery, setInnerQuery] = React.useState("");
  const query = value ?? innerQuery;
  const [active, setActive] = React.useState(0);
  const listRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const lastActive = React.useRef<HTMLElement | null>(null);
  const activeRef = React.useRef(active);
  activeRef.current = active;
  const paletteId = React.useId();
  const listId = `${paletteId}-list`;
  const warnedControlledValue = React.useRef(false);
  const onOpenChangeRef = React.useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  useScrollLock(open);

  const setQuery = (next: string) => {
    if (value === undefined) setInnerQuery(next);
    onValueChange?.(next);
  };

  React.useEffect(() => {
    if (
      import.meta.env?.DEV &&
      value !== undefined &&
      !onValueChange &&
      !warnedControlledValue.current
    ) {
      warnedControlledValue.current = true;
      console.warn("CommandPalette: `value` requires `onValueChange` in controlled mode.");
    }
  }, [value, onValueChange]);

  // the global shortcut, so a host app only has to render the palette
  React.useEffect(() => {
    if (!shortcutKey) return;
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === String(shortcutKey).toLowerCase() &&
        (e.metaKey || e.ctrlKey) &&
        !e.altKey &&
        !e.shiftKey
      ) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcutKey, open, onOpenChange]);

  React.useEffect(() => {
    if (!open) return;
    lastActive.current = document.activeElement as HTMLElement | null;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      cancelAnimationFrame(frame);
      lastActive.current?.focus?.();
    };
  }, [open]);

  React.useEffect(() => {
    if (value === undefined) setInnerQuery("");
  }, [open, value]);

  React.useEffect(() => {
    if (!open) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      onOpenChangeRef.current(false);
    };
    window.addEventListener("keydown", onEscape, true);
    return () => window.removeEventListener("keydown", onEscape, true);
  }, [open]);

  const matches = React.useMemo(() => items.filter((item) => filter(item, query)), [items, query, filter]);

  /** Flat order for the keyboard, grouped order for the eye. */
  const groups = React.useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const item of matches) {
      const key = item.group ?? "";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return [...map.entries()];
  }, [matches]);

  const flat = React.useMemo(() => groups.flatMap(([, list]) => list), [groups]);
  const firstEnabled = React.useMemo(() => {
    const index = flat.findIndex((item) => !item.disabled);
    return index === -1 ? 0 : index;
  }, [flat]);
  const flatState = React.useMemo(
    () => JSON.stringify(flat.map((item) => [item.key, Boolean(item.disabled)])),
    [flat],
  );

  React.useLayoutEffect(() => {
    if (open) setActive(firstEnabled);
  }, [open, query, flatState, firstEnabled]);

  const choose = (item: CommandItem) => {
    if (item.disabled) return;
    item.onSelect?.();
    if (item.closeOnSelect ?? closeOnSelect) onOpenChange(false);
  };

  const move = (delta: number) => {
    if (!flat.length) return;
    setActive((prev) => {
      let next = prev >= 0 && prev < flat.length ? prev : delta > 0 ? -1 : 0;
      for (let i = 0; i < flat.length; i++) {
        next = (next + delta + flat.length) % flat.length;
        if (!flat[next].disabled) break;
      }
      return next;
    });
  };

  React.useLayoutEffect(() => {
    if (!open || !flat.length) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active, flatState, open, flat.length]);

  const trapFocus = (event: React.KeyboardEvent) => {
    if (event.key !== "Tab" || !dialogRef.current) return false;
    const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (node) => node.offsetParent !== null && node.tabIndex >= 0,
    );
    if (!nodes.length) {
      event.preventDefault();
      dialogRef.current.focus();
      return true;
    }
    const first = nodes[0]!;
    const last = nodes[nodes.length - 1]!;
    const focused = document.activeElement;
    if (event.shiftKey && (focused === first || focused === dialogRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && focused === last) {
      event.preventDefault();
      first.focus();
    }
    return true;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (trapFocus(e)) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      const item = flat[active];
      if (item) choose(item);
    }
  };

  const onListPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const option = (event.target as HTMLElement).closest<HTMLElement>("[data-index]");
    if (!option || !event.currentTarget.contains(option) || option.dataset.disabled === "true") return;
    const next = Number(option.dataset.index);
    if (!Number.isInteger(next) || next === activeRef.current) return;
    setActive(next);
  };

  if (!open) return null;

  let index = -1;
  const activeOptionId = flat[active] ? `${paletteId}-option-${active}` : undefined;
  const inline = getContainer === false;
  const position = inline ? "absolute" : "fixed";

  const palette = (
    <div
      data-slot="command-palette"
      className={cn(position, "inset-0 flex items-start justify-center p-4 pt-[12vh]")}
      style={{ zIndex }}
    >
        <div
          data-slot="command-palette-mask"
          aria-hidden="true"
          className="absolute inset-0 bg-bg-mask animate-in fade-in-0 duration-150"
          onClick={() => onOpenChange(false)}
        />

        <div
          ref={dialogRef}
          data-slot="command-palette-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          tabIndex={-1}
          onKeyDown={onKeyDown}
          className={cn(
            "kk-spring-in relative w-full max-w-xl overflow-hidden rounded-xl border border-border bg-bg-elevated shadow-kk",
            className,
          )}
        >
          <div className="flex items-center gap-2 border-b border-border-secondary px-4">
            <Search className="size-4 shrink-0 text-text-quaternary" />
            <input
              ref={inputRef}
              data-slot="command-palette-input"
              role="combobox"
              aria-expanded={true}
              aria-autocomplete="list"
              aria-haspopup="listbox"
              aria-controls={listId}
              aria-activedescendant={activeOptionId}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              aria-label={placeholder}
              className="h-12 min-w-0 flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text-placeholder"
            />
            <kbd className="hidden shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-text-tertiary sm:block">
              ESC
            </kbd>
          </div>

          <div
            ref={listRef}
            id={listId}
            data-slot="command-palette-list"
            role="listbox"
            className="kk-scrollbar overflow-y-auto p-2"
            style={{ maxHeight }}
            onPointerMove={onListPointerMove}
          >
            {flat.length === 0 ? (
              <div data-slot="command-palette-empty" className="px-3 py-10 text-center text-sm text-text-tertiary">{emptyText}</div>
            ) : (
              groups.map(([group, list]) => (
                <div
                  key={group || "_"}
                  data-slot="command-palette-group"
                  role={group ? "group" : "presentation"}
                  aria-label={group || undefined}
                  className="mb-1 last:mb-0"
                >
                  {group && (
                    <div role="presentation" className="px-2 py-1 text-xs font-medium text-text-tertiary">{group}</div>
                  )}
                  {list.map((item) => {
                    index += 1;
                    const isActive = index === active;
                    const myIndex = index;
                    return (
                      <button
                        key={item.key}
                        id={`${paletteId}-option-${myIndex}`}
                        type="button"
                        data-slot="command-palette-item"
                        data-index={myIndex}
                        data-active={isActive || undefined}
                        data-disabled={item.disabled || undefined}
                        role="option"
                        aria-selected={isActive}
                        aria-disabled={item.disabled || undefined}
                        tabIndex={-1}
                        disabled={item.disabled}
                        onClick={() => choose(item)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors duration-fast",
                          isActive ? "bg-fill-tertiary text-text" : "text-text-secondary",
                          item.disabled && "cursor-not-allowed opacity-40",
                        )}
                      >
                        {item.icon && <span className="flex size-5 shrink-0 items-center justify-center text-text-tertiary [&_svg]:size-4">{item.icon}</span>}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-text">{item.label}</span>
                          {item.description && <span className="block truncate text-xs text-text-tertiary">{item.description}</span>}
                        </span>
                        {item.shortcut && <span className="shrink-0 font-mono text-[11px] text-text-quaternary">{item.shortcut}</span>}
                        {isActive && !item.shortcut && <CornerDownLeft className="size-3.5 shrink-0 text-text-quaternary" />}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {footer && <div data-slot="command-palette-footer" className="border-t border-border-secondary px-4 py-2 text-xs text-text-tertiary">{footer}</div>}
        </div>
      </div>
  );

  if (inline) return palette;
  const container = typeof getContainer === "function" ? getContainer() : getContainer;
  return <Portal container={container || undefined}>{palette}</Portal>;
}
