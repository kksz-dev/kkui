import * as React from "react";
import { Portal } from "@/components/ui/portal";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toContainerCoords } from "@/lib/floating-position";
import { InputTextArea, useControlled, type InputTextAreaProps } from "@/components/ui/input";

/**
 * Mentions — KKUI textarea that opens a suggestion list when a trigger prefix
 * (`@` by default) is typed. The popup is anchored at the caret (measured with a mirror
 * div) and rendered through the KKUI popover primitive so it escapes overflow containers.
 */

export interface MentionsOption {
  value: string;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export interface MentionsProps
  extends Omit<InputTextAreaProps, "value" | "defaultValue" | "onChange" | "prefix" | "onSelect"> {
  /** Mount the suggestion popup inside another element instead of <body>. */
  getPopupContainer?: (triggerNode: HTMLElement | null) => HTMLElement;
  value?: string;
  defaultValue?: string;
  /** Trigger character(s) */
  prefix?: string | string[];
  /** Character that ends a mention */
  split?: string;
  options?: MentionsOption[];
  /** `false` to disable client filtering (async search); default matches `value` (case-insensitive) */
  filterOption?: false | ((input: string, option: MentionsOption) => boolean);
  /** Where the popup opens */
  placement?: "top" | "bottom";
  notFoundContent?: React.ReactNode;
  loading?: boolean;
  /** Controlled popup visibility */
  open?: boolean;
  onChange?: (text: string) => void;
  onSelect?: (option: MentionsOption, prefix: string) => void;
  /** Called with the text typed after the trigger */
  onSearch?: (text: string, prefix: string) => void;
  popupClassName?: string;
}

interface Measure {
  prefix: string;
  text: string;
  /** index of the prefix character in the value */
  start: number;
}

/** Find an active `prefix…caret` segment (no split inside, prefix at start or after split). */
function measure(value: string, caret: number, prefixes: string[], split: string): Measure | null {
  const before = value.slice(0, caret);
  let best: Measure | null = null;
  for (const p of prefixes) {
    const idx = before.lastIndexOf(p);
    if (idx === -1) continue;
    const text = before.slice(idx + p.length);
    if (split && text.includes(split)) continue;
    if (idx > 0 && split && before[idx - 1] !== split && !/\s/.test(before[idx - 1])) continue;
    if (!best || idx > best.start) best = { prefix: p, text, start: idx };
  }
  return best;
}

/** Parse mentions out of a text: `getMentions("@a #b")` → `[{prefix:"@",value:"a"},{prefix:"#",value:"b"}]`. */
export function getMentions(value = "", config: { prefix?: string | string[]; split?: string } = {}) {
  const prefixes = Array.isArray(config.prefix) ? config.prefix : [config.prefix ?? "@"];
  const split = config.split ?? " ";
  return value
    .split(split)
    .map((word) => {
      const p = prefixes.find((x) => word.startsWith(x));
      return p ? { prefix: p, value: word.slice(p.length) } : null;
    })
    .filter((m): m is { prefix: string; value: string } => m !== null && m.value !== "");
}

const MIRROR_PROPS = [
  "boxSizing", "width", "fontFamily", "fontSize", "fontWeight", "fontStyle", "letterSpacing", "lineHeight",
  "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "borderTopWidth", "borderRightWidth",
  "borderBottomWidth", "borderLeftWidth", "textIndent", "whiteSpace", "wordBreak", "overflowWrap", "tabSize",
] as const;

/** Pixel offset of `index` inside a textarea (top-left of the character), relative to the textarea. */
function caretOffset(el: HTMLTextAreaElement, index: number) {
  const mirror = document.createElement("div");
  const cs = getComputedStyle(el);
  for (const k of MIRROR_PROPS) mirror.style[k] = cs[k];
  mirror.style.position = "absolute";
  mirror.style.visibility = "hidden";
  mirror.style.top = "0";
  mirror.style.left = "-9999px";
  mirror.style.height = "auto";
  mirror.style.whiteSpace = "pre-wrap";
  mirror.style.overflowWrap = "break-word";
  mirror.textContent = el.value.slice(0, index);
  const marker = document.createElement("span");
  marker.textContent = el.value.slice(index) || ".";
  mirror.appendChild(marker);
  document.body.appendChild(mirror);
  const top = marker.offsetTop - el.scrollTop;
  const left = marker.offsetLeft - el.scrollLeft;
  const lineHeight = parseFloat(cs.lineHeight) || 22;
  document.body.removeChild(mirror);
  return { top, left, lineHeight };
}

const defaultFilter = (input: string, option: MentionsOption) => option.value.toLowerCase().includes(input.toLowerCase());

function Mentions({
  className,
  value,
  defaultValue,
  prefix = "@",
  split = " ",
  options = [],
  filterOption = defaultFilter,
  placement = "bottom",
  notFoundContent = "Not Found",
  loading = false,
  open: openProp,
  onChange,
  onSelect,
  onSearch,
  onKeyDown,
  onBlur,
  onClick,
  onKeyUp,
  disabled,
  readOnly,
  popupClassName,
  ref,
  getPopupContainer,
  ...props
}: MentionsProps) {
  const areaRef = React.useRef<HTMLTextAreaElement>(null);
  React.useImperativeHandle(ref, () => areaRef.current as HTMLTextAreaElement);
  const [val, setVal] = useControlled(value, defaultValue ?? "");
  const [active, setActive] = React.useState<Measure | null>(null);
  const [anchor, setAnchor] = React.useState({ top: 0, left: 0, lineHeight: 22 });
  const [highlight, setHighlight] = React.useState(0);
  const listRef = React.useRef<HTMLDivElement>(null);
  const prefixes = React.useMemo(() => (Array.isArray(prefix) ? prefix : [prefix]), [prefix]);

  const filtered = React.useMemo(() => {
    if (!active) return [];
    return filterOption === false ? options : options.filter((o) => filterOption(active.text, o));
  }, [active, options, filterOption]);

  const open = openProp ?? (active !== null && !disabled && !readOnly);

  const startMeasure = React.useCallback(
    (nextValue: string) => {
      const el = areaRef.current;
      if (!el) return;
      const caret = el.selectionStart ?? nextValue.length;
      const m = measure(nextValue, caret, prefixes, split);
      if (m) {
        setAnchor(caretOffset(el, m.start));
        setActive((prev) => (prev && prev.start === m.start && prev.text === m.text ? prev : m));
        onSearch?.(m.text, m.prefix);
        if (!active || active.start !== m.start) setHighlight(0);
      } else {
        setActive(null);
      }
    },
    [prefixes, split, onSearch, active],
  );

  const change = (next: string) => {
    setVal(next);
    onChange?.(next);
  };

  const select = (option: MentionsOption) => {
    const el = areaRef.current;
    if (!active || !el || option.disabled) return;
    const caret = el.selectionStart ?? val.length;
    const insert = `${active.prefix}${option.value}${split}`;
    const next = val.slice(0, active.start) + insert + val.slice(caret);
    change(next);
    setActive(null);
    onSelect?.(option, active.prefix);
    const pos = active.start + insert.length;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(pos, pos);
    });
  };

  React.useEffect(() => {
    if (highlight >= filtered.length) setHighlight(0);
  }, [filtered.length, highlight]);

  React.useEffect(() => {
    const el = listRef.current?.children[highlight] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [highlight, open]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (open && filtered.length > 0) {
      const enabled = filtered.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);
      const move = (dir: 1 | -1) => {
        if (enabled.length === 0) return;
        const cur = enabled.indexOf(highlight);
        setHighlight(enabled[(cur + dir + enabled.length) % enabled.length]);
      };
      if (e.key === "ArrowDown") {
        e.preventDefault();
        move(1);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        move(-1);
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        const opt = filtered[highlight];
        if (opt && !opt.disabled) {
          e.preventDefault();
          select(opt);
          return;
        }
      }
    }
    if (e.key === "Escape" && open) {
      e.preventDefault();
      setActive(null);
      return;
    }
    onKeyDown?.(e);
  };

  const popupContainer = React.useMemo(
    () => (getPopupContainer ? getPopupContainer(areaRef.current) : undefined),
    [getPopupContainer, open], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <div data-slot="mentions" className={cn("relative block w-full", className)}>
      <InputTextArea
        ref={areaRef}
        data-slot="mentions-inner"
        value={val}
        disabled={disabled}
        readOnly={readOnly}
        onChange={(e) => {
          change(e.target.value);
          startMeasure(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        onKeyUp={(e) => {
          if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) startMeasure(val);
          onKeyUp?.(e);
        }}
        onClick={(e) => {
          startMeasure(val);
          onClick?.(e);
        }}
        onBlur={(e) => {
          // let a click on an option land first
          window.setTimeout(() => {
            if (!listRef.current?.contains(document.activeElement)) setActive(null);
          }, 100);
          onBlur?.(e);
        }}
        {...props}
      />
      {open && (
        <Portal container={popupContainer}>
          <div
            style={{
              position: "absolute",
              ...toContainerCoords(
                {
                  top:
                    (areaRef.current?.getBoundingClientRect().top ?? 0) +
                    window.scrollY +
                    anchor.top +
                    (placement === "bottom" ? anchor.lineHeight + 4 : -4),
                  left: (areaRef.current?.getBoundingClientRect().left ?? 0) + window.scrollX + anchor.left,
                },
                popupContainer,
              ),
              zIndex: 1050,
            }}
            data-slot="mentions-popup"
            className={cn(
              "z-50 min-w-32 rounded-lg bg-bg-elevated p-1 text-sm text-text shadow-kk-secondary border border-border outline-none animate-in fade-in-0 zoom-in-95 duration-150",
              popupClassName,
            )}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2 px-3 py-2 text-text-tertiary">
                <Loader2 className="size-4 animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="px-3 py-1.5 text-text-tertiary">{notFoundContent}</div>
            ) : (
              <div ref={listRef} role="listbox" className="max-h-64 overflow-y-auto kk-scrollbar">
                {filtered.map((o, i) => (
                  <div
                    key={o.value}
                    role="option"
                    aria-selected={i === highlight}
                    aria-disabled={o.disabled || undefined}
                    className={cn(
                      "flex min-h-8 cursor-pointer items-center rounded-sm px-3 py-1 transition-colors duration-mid",
                      i === highlight && "bg-fill-tertiary font-medium text-primary",
                      o.disabled && "cursor-not-allowed text-text-disabled",
                      o.className,
                    )}
                    onMouseEnter={() => !o.disabled && setHighlight(i)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => select(o)}
                  >
                    {o.label ?? o.value}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Portal>
      )}
    </div>
  );
}

export { Mentions };
