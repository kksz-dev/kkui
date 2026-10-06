import * as React from "react";
import { cn } from "@/lib/utils";
import { useComponentDisabled, useComponentSize, type ComponentSize } from "@/components/ui/config-provider";

export type SegmentedValue = string | number;
/** `small | middle | large` are accepted as aliases of `sm | md | lg`. */
export type SegmentedSize = ComponentSize | "small" | "middle" | "large";

export interface SegmentedLabeledOption<V extends SegmentedValue = SegmentedValue> {
  label?: React.ReactNode;
  value: V;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  title?: string;
  /** Arbitrary data handed back through `onChange`'s second argument. */
  payload?: unknown;
}

export type SegmentedOption<V extends SegmentedValue = SegmentedValue> = V | SegmentedLabeledOption<V>;

export interface SegmentedProps<V extends SegmentedValue = SegmentedValue>
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue" | "value" | "dir"> {
  options: SegmentedOption<V>[];
  value?: V;
  defaultValue?: V;
  onChange?: (value: V, option: SegmentedLabeledOption<V>) => void;
  size?: SegmentedSize;
  /** Stretch every item to fill the row. Off by default — items size to their content. */
  block?: boolean;
  disabled?: boolean;
  shape?: "default" | "round";
  vertical?: boolean;
  name?: string;
}

const SIZE_CLASSES = {
  sm: { root: "rounded-sm text-xs p-0.5", item: "min-h-[22px] px-2 text-xs" },
  md: { root: "rounded-md text-sm p-1", item: "min-h-[28px] px-3 text-sm" },
  lg: { root: "rounded-lg text-base p-1", item: "min-h-9 px-4 text-base" },
} as const;

function normalizeSize(size: SegmentedSize): ComponentSize {
  if (size === "small") return "sm";
  if (size === "middle") return "md";
  if (size === "large") return "lg";
  return size;
}

function normalize<V extends SegmentedValue>(options: SegmentedOption<V>[]): SegmentedLabeledOption<V>[] {
  return options.map((o) => (typeof o === "object" ? o : { label: String(o), value: o }));
}

export function Segmented<V extends SegmentedValue = SegmentedValue>({
  className,
  options,
  value: valueProp,
  defaultValue,
  onChange,
  size,
  block = false,
  disabled,
  shape = "default",
  vertical = false,
  name,
  ...props
}: SegmentedProps<V>) {
  const contextSize = useComponentSize();
  const resolvedSize = normalizeSize(size ?? contextSize);
  const isDisabledAll = useComponentDisabled(disabled);

  const normalized = React.useMemo(() => normalize(options), [options]);
  const firstVal = normalized[0]?.value;

  const [inner, setInner] = React.useState<V | undefined>(defaultValue ?? firstVal);
  const isControlled = valueProp !== undefined;
  const current = isControlled ? valueProp : inner;

  const listRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef(new Map<string, HTMLButtonElement>());
  const [thumb, setThumb] = React.useState<{ offset: number; length: number } | null>(null);
  const [ready, setReady] = React.useState(false);

  // Measure the active item so the thumb can translate to it instead of re-mounting.
  React.useLayoutEffect(() => {
    const node = current !== undefined ? itemRefs.current.get(String(current)) : undefined;
    const list = listRef.current;
    if (!node || !list) {
      setThumb(null);
      return;
    }
    const measure = () => {
      const nodeRect = node.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();
      setThumb(
        vertical
          ? { offset: nodeRect.top - listRect.top, length: nodeRect.height }
          : { offset: nodeRect.left - listRect.left, length: nodeRect.width },
      );
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    observer.observe(list);
    return () => observer.disconnect();
  }, [current, vertical, normalized, resolvedSize, block]);

  // Skip the slide on first paint — the thumb should appear in place, not fly in.
  React.useEffect(() => {
    if (thumb && !ready) {
      const id = requestAnimationFrame(() => setReady(true));
      return () => cancelAnimationFrame(id);
    }
  }, [thumb, ready]);

  const handleSelect = (opt: SegmentedLabeledOption<V>) => {
    if (!isControlled) setInner(opt.value);
    onChange?.(opt.value, opt);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const nextKey = vertical ? "ArrowDown" : "ArrowRight";
    const prevKey = vertical ? "ArrowUp" : "ArrowLeft";
    if (e.key !== nextKey && e.key !== prevKey) return;
    e.preventDefault();

    const step = e.key === nextKey ? 1 : -1;
    for (let i = 1; i <= normalized.length; i++) {
      const candidate = normalized[(index + step * i + normalized.length * i) % normalized.length];
      if (candidate && !candidate.disabled && !isDisabledAll) {
        handleSelect(candidate);
        itemRefs.current.get(String(candidate.value))?.focus();
        return;
      }
    }
  };

  const sz = SIZE_CLASSES[resolvedSize];
  const radius = shape === "round" ? "rounded-full" : resolvedSize === "lg" ? "rounded-md" : "rounded-sm";

  return (
    <div
      ref={listRef}
      data-slot="segmented"
      role="radiogroup"
      aria-disabled={isDisabledAll || undefined}
      className={cn(
        "relative isolate inline-flex select-none bg-fill-tertiary text-text",
        sz.root,
        shape === "round" && "rounded-full p-1",
        vertical ? "flex-col" : "flex-row",
        block && "flex w-full",
        isDisabledAll && "cursor-not-allowed opacity-50",
        className,
      )}
      {...props}
    >
      {name ? <input type="hidden" name={name} value={current === undefined ? "" : String(current)} /> : null}

      {thumb && (
        <span
          aria-hidden
          data-slot="segmented-thumb"
          className={cn(
            "pointer-events-none absolute z-0 bg-bg-container shadow-xs",
            radius,
            ready && "transition-[transform,width,height] duration-mid ease-kk-in-out",
          )}
          style={
            vertical
              ? {
                  top: 0,
                  left: sz.root.includes("p-1") ? 4 : 2,
                  right: sz.root.includes("p-1") ? 4 : 2,
                  height: thumb.length,
                  transform: `translateY(${thumb.offset}px)`,
                }
              : {
                  top: sz.root.includes("p-1") ? 4 : 2,
                  bottom: sz.root.includes("p-1") ? 4 : 2,
                  left: 0,
                  width: thumb.length,
                  transform: `translateX(${thumb.offset}px)`,
                }
          }
        />
      )}

      {normalized.map((opt, index) => {
        const isSelected = opt.value === current;
        const itemDisabled = isDisabledAll || opt.disabled;

        return (
          <button
            key={String(opt.value)}
            ref={(node) => {
              if (node) itemRefs.current.set(String(opt.value), node);
              else itemRefs.current.delete(String(opt.value));
            }}
            type="button"
            role="radio"
            data-slot="segmented-item"
            aria-checked={isSelected}
            title={opt.title}
            disabled={itemDisabled}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => !itemDisabled && handleSelect(opt)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              "relative z-10 flex items-center justify-center gap-1.5 font-medium outline-none transition-colors duration-mid ease-kk-in-out",
              "focus-visible:ring-[3px] focus-visible:ring-primary/30",
              sz.item,
              radius,
              block && "flex-1",
              isSelected ? "font-semibold text-text" : "text-text-secondary hover:text-text",
              itemDisabled && "cursor-not-allowed text-text-disabled hover:text-text-disabled",
              opt.className,
            )}
          >
            {opt.icon}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
