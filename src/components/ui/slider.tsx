import * as React from "react";
import { cn } from "@/lib/utils";
import { Portal } from "@/components/ui/portal";
import { computeFloatingPosition, measureFloating } from "@/lib/floating-position";

export interface SliderMarkObject {
  style?: React.CSSProperties;
  label?: React.ReactNode;
}

export interface SliderMarks {
  [key: number]: React.ReactNode | SliderMarkObject;
}

export type SliderTooltipPlacement = "top" | "bottom" | "left" | "right";

export interface SliderTooltipProps {
  /** Force the tooltip visible (`true`) or hidden (`false`); leave undefined for hover/drag. */
  open?: boolean;
  /** Format the tooltip content; `null` removes the tooltip entirely. */
  formatter?: null | ((value?: number) => React.ReactNode);
  placement?: SliderTooltipPlacement;
  /** Flip/clamp the tooltip when it would overflow the viewport. */
  autoAdjustOverflow?: boolean;
}

/** Semantic parts that accept `classNames` / `styles`. */
export type SliderSemantic = "root" | "rail" | "tracks" | "track" | "handle";

export interface SliderBaseProps {
  min?: number;
  max?: number;
  /** Granularity; `null` restricts the value to `marks` only. */
  step?: number | null;
  disabled?: boolean;
  vertical?: boolean;
  reverse?: boolean;
  /** Render the filled track (and treat marks below the handle as active). */
  included?: boolean;
  marks?: SliderMarks;
  /** Render a dot for every step point on the rail. */
  dots?: boolean;
  tooltip?: SliderTooltipProps;
  /** Arrow / PageUp / PageDown / Home / End control. */
  keyboard?: boolean;
  autoFocus?: boolean;
  className?: string;
  style?: React.CSSProperties;
  classNames?: Partial<Record<SliderSemantic, string>>;
  styles?: Partial<Record<SliderSemantic, React.CSSProperties>>;
  id?: string;
  onFocus?: (e: React.FocusEvent<HTMLDivElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void;
}

export interface SliderSingleProps extends SliderBaseProps {
  range?: false;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  onChangeComplete?: (value: number) => void;
}

export interface SliderRangeProps extends SliderBaseProps {
  range: true | { draggableTrack?: boolean };
  value?: number[];
  defaultValue?: number[];
  onChange?: (value: number[]) => void;
  onChangeComplete?: (value: number[]) => void;
}

export type SliderProps = SliderSingleProps | SliderRangeProps;

type ChangeCallback = ((value: number) => void) | ((value: number[]) => void) | undefined;

type DragState =
  | { kind: "handle"; index: number }
  | { kind: "track"; startValue: number; startValues: number[] }
  | null;

const isMarkObject = (m: React.ReactNode | SliderMarkObject): m is SliderMarkObject =>
  typeof m === "object" && m !== null && !React.isValidElement(m) && ("label" in m || "style" in m);

/** Tooltip bubble anchored to a handle element. */
function SliderTooltip({
  target,
  open,
  placement,
  autoAdjustOverflow,
  children,
}: {
  target: HTMLElement | null;
  open: boolean;
  placement: SliderTooltipPlacement;
  autoAdjustOverflow: boolean;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState<{ top: number; left: number } | null>(null);

  React.useLayoutEffect(() => {
    if (!open || !target) return;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const t = target.getBoundingClientRect();
      const c = measureFloating(el);
      if (autoAdjustOverflow) {
        setPos(computeFloatingPosition(t, c, placement, 6));
        return;
      }
      const top =
        placement === "top"
          ? t.top - c.height - 6
          : placement === "bottom"
            ? t.bottom + 6
            : t.top + (t.height - c.height) / 2;
      const left =
        placement === "left"
          ? t.left - c.width - 6
          : placement === "right"
            ? t.right + 6
            : t.left + (t.width - c.width) / 2;
      setPos({ top: top + window.scrollY, left: left + window.scrollX });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, target, placement, autoAdjustOverflow, children]);

  if (!open || !target) return null;

  return (
    <Portal>
      <div
        ref={ref}
        role="tooltip"
        style={{ position: "absolute", top: pos?.top ?? -9999, left: pos?.left ?? -9999, zIndex: 1060 }}
        className="pointer-events-none rounded-md bg-bg-spotlight px-2 py-0.5 text-xs whitespace-nowrap text-text-light-solid shadow-kk-secondary animate-in fade-in-0 zoom-in-95 duration-150"
      >
        {children}
      </div>
    </Portal>
  );
}

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  vertical = false,
  reverse = false,
  included = true,
  marks,
  dots = false,
  tooltip,
  keyboard = true,
  autoFocus = false,
  range = false,
  value: valueProp,
  defaultValue,
  onChange,
  onChangeComplete,
  className,
  style,
  classNames,
  styles,
  id,
  onFocus,
  onBlur,
}: SliderProps) {
  const isRange = Boolean(range);
  const draggableTrack = typeof range === "object" && range !== null ? Boolean(range.draggableTrack) : false;
  const span = max - min || 1;

  /* ---------------- value helpers ---------------- */

  const markValues = React.useMemo(
    () =>
      marks
        ? Object.keys(marks)
            .map(Number)
            .filter((n) => !Number.isNaN(n) && n >= min && n <= max)
            .sort((a, b) => a - b)
        : [],
    [marks, min, max],
  );

  const decimals = React.useMemo(() => {
    const text = String(step ?? 1);
    const dot = text.indexOf(".");
    return dot === -1 ? 0 : Math.min(text.length - dot - 1, 8);
  }, [step]);

  const fix = React.useCallback((v: number) => Number(v.toFixed(decimals)), [decimals]);

  /** Clamp to [min,max] then snap to the closest step point or mark. */
  const align = React.useCallback(
    (raw: number) => {
      const clamped = Math.min(max, Math.max(min, raw));
      const candidates: number[] = [];
      if (step !== null && step > 0) {
        candidates.push(Math.min(max, Math.max(min, fix(min + Math.round((clamped - min) / step) * step))));
      } else if (markValues.length === 0) {
        return fix(clamped);
      }
      candidates.push(...markValues);
      let best = candidates[0] ?? clamped;
      for (const c of candidates) {
        if (Math.abs(c - clamped) < Math.abs(best - clamped)) best = c;
      }
      return fix(best);
    },
    [min, max, step, markValues, fix],
  );

  const normalize = React.useCallback(
    (list: number[]) => list.map((v) => Math.min(max, Math.max(min, v))).sort((a, b) => a - b),
    [min, max],
  );

  const toArray = (v: number | number[] | undefined) =>
    v === undefined ? undefined : Array.isArray(v) ? v : [v];

  const controlled = toArray(valueProp);
  const [internal, setInternal] = React.useState<number[]>(() => {
    const dv = toArray(defaultValue);
    if (dv && dv.length) return normalize(dv);
    return isRange ? [min, min] : [min];
  });

  const values = React.useMemo(
    () => (controlled && controlled.length ? normalize(controlled) : internal),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [controlled?.join(","), internal, normalize],
  );

  const valuesRef = React.useRef(values);
  valuesRef.current = values;

  const emit = (cb: ChangeCallback, next: number[]) => {
    if (!cb) return;
    if (isRange) (cb as (v: number[]) => void)(next);
    else (cb as (v: number) => void)(next[0]);
  };

  const commit = (next: number[]) => {
    const prev = valuesRef.current;
    if (next.length === prev.length && next.every((v, i) => v === prev[i])) return;
    valuesRef.current = next;
    if (valueProp === undefined) setInternal(next);
    emit(onChange, next);
  };

  const complete = () => emit(onChangeComplete, valuesRef.current);

  /* ---------------- geometry ---------------- */

  const railRef = React.useRef<HTMLDivElement>(null);
  const [handleEls, setHandleEls] = React.useState<(HTMLDivElement | null)[]>([]);
  /** Stable ref callback per handle index (a new identity would re-fire every render). */
  const refSetters = React.useRef<((el: HTMLDivElement | null) => void)[]>([]);
  const setHandleEl = (index: number) => {
    if (!refSetters.current[index]) {
      refSetters.current[index] = (el: HTMLDivElement | null) => {
        setHandleEls((prev) => {
          if (prev[index] === el) return prev;
          const next = prev.slice();
          next[index] = el;
          return next;
        });
      };
    }
    return refSetters.current[index];
  };

  /** value → distance from the rail start, in percent (already reverse-aware). */
  const offsetOf = React.useCallback(
    (v: number) => {
      const pct = ((v - min) / span) * 100;
      return reverse ? 100 - pct : pct;
    },
    [min, span, reverse],
  );

  const valueFromPointer = (clientX: number, clientY: number) => {
    const rail = railRef.current;
    if (!rail) return min;
    const rect = rail.getBoundingClientRect();
    let ratio = vertical
      ? (rect.bottom - clientY) / (rect.height || 1)
      : (clientX - rect.left) / (rect.width || 1);
    if (reverse) ratio = 1 - ratio;
    return align(min + Math.min(1, Math.max(0, ratio)) * span);
  };

  /* ---------------- interaction ---------------- */

  const dragRef = React.useRef<DragState>(null);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
  const [focusIndex, setFocusIndex] = React.useState<number | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const keyChangedRef = React.useRef(false);

  React.useEffect(() => {
    if (autoFocus && !disabled) handleEls[0]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFocus, disabled, handleEls[0]]);

  /** Move one handle, letting it cross its neighbours (values stay sorted). */
  const moveHandle = (index: number, raw: number) => {
    const next = valuesRef.current.slice();
    next[index] = align(raw);
    const tagged = next.map((val, i) => ({ val, i }));
    tagged.sort((a, b) => a.val - b.val || a.i - b.i);
    const newIndex = tagged.findIndex((t) => t.i === index);
    if (dragRef.current?.kind === "handle" && newIndex !== index) {
      dragRef.current = { kind: "handle", index: newIndex };
      setActiveIndex(newIndex);
      handleEls[newIndex]?.focus();
    }
    commit(tagged.map((t) => t.val));
    return newIndex;
  };

  const nearestIndex = (v: number) => {
    let best = 0;
    valuesRef.current.forEach((val, i) => {
      if (Math.abs(val - v) < Math.abs(valuesRef.current[best] - v)) best = i;
    });
    return best;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || e.button !== 0) return;
    const root = e.currentTarget;
    const target = e.target as HTMLElement;
    const handleNode = target.closest<HTMLElement>("[data-handle-index]");
    const trackNode = target.closest<HTMLElement>("[data-slider-tracks]");
    const pointerValue = valueFromPointer(e.clientX, e.clientY);

    e.preventDefault();
    root.setPointerCapture(e.pointerId);
    setDragging(true);

    if (handleNode) {
      const index = Number(handleNode.dataset.handleIndex);
      dragRef.current = { kind: "handle", index };
      setActiveIndex(index);
      handleNode.focus();
      return;
    }
    if (draggableTrack && trackNode) {
      dragRef.current = { kind: "track", startValue: pointerValue, startValues: valuesRef.current.slice() };
      return;
    }
    const index = nearestIndex(pointerValue);
    dragRef.current = { kind: "handle", index };
    setActiveIndex(index);
    handleEls[index]?.focus();
    moveHandle(index, pointerValue);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || disabled) return;
    const pointerValue = valueFromPointer(e.clientX, e.clientY);
    if (drag.kind === "handle") {
      moveHandle(drag.index, pointerValue);
      return;
    }
    const rawDelta = pointerValue - drag.startValue;
    const stepped = step ? Math.round(rawDelta / step) * step : rawDelta;
    const lowest = Math.min(...drag.startValues);
    const highest = Math.max(...drag.startValues);
    const delta = Math.min(max - highest, Math.max(min - lowest, stepped));
    commit(drag.startValues.map((v) => fix(v + delta)));
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setDragging(false);
    setActiveIndex(null);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    complete();
  };

  /** Direction of an arrow key in value space (+1 increases). */
  const arrowDirection = (key: string): number => {
    if (vertical) {
      if (key === "ArrowUp") return reverse ? -1 : 1;
      if (key === "ArrowDown") return reverse ? 1 : -1;
    } else {
      if (key === "ArrowRight") return reverse ? -1 : 1;
      if (key === "ArrowLeft") return reverse ? 1 : -1;
    }
    if (key === "ArrowUp" || key === "ArrowRight") return 1;
    if (key === "ArrowDown" || key === "ArrowLeft") return -1;
    return 0;
  };

  /** Next allowed value from `current` in direction `dir`, `jump` steps at a time. */
  const shiftValue = (current: number, dir: number, jump: number) => {
    if (step === null) {
      if (!markValues.length) return current;
      const sorted = markValues;
      let index = sorted.findIndex((v) => v === current);
      if (index === -1) {
        index = 0;
        sorted.forEach((v, i) => {
          if (Math.abs(v - current) < Math.abs(sorted[index] - current)) index = i;
        });
      }
      const target = Math.min(sorted.length - 1, Math.max(0, index + dir * jump));
      return sorted[target];
    }
    return align(current + dir * (step || 1) * jump);
  };

  const handleKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled || !keyboard) return;
    const current = valuesRef.current[index];
    let next: number | null = null;
    switch (e.key) {
      case "ArrowUp":
      case "ArrowDown":
      case "ArrowLeft":
      case "ArrowRight": {
        const dir = arrowDirection(e.key);
        if (dir !== 0) next = shiftValue(current, dir, 1);
        break;
      }
      case "PageUp":
        next = shiftValue(current, 1, 10);
        break;
      case "PageDown":
        next = shiftValue(current, -1, 10);
        break;
      case "Home":
        next = step === null && markValues.length ? markValues[0] : min;
        break;
      case "End":
        next = step === null && markValues.length ? markValues[markValues.length - 1] : max;
        break;
      default:
        return;
    }
    if (next === null || next === current) return;
    e.preventDefault();
    keyChangedRef.current = true;
    const newIndex = moveHandle(index, next);
    if (newIndex !== index) handleEls[newIndex]?.focus();
  };

  const handleKeyUp = () => {
    if (!keyChangedRef.current) return;
    keyChangedRef.current = false;
    complete();
  };

  /* ---------------- rendering ---------------- */

  const tooltipFormatter = tooltip?.formatter;
  const tooltipEnabled = tooltipFormatter !== null;
  const tooltipPlacement = tooltip?.placement ?? (vertical ? "right" : "top");
  const tooltipAdjust = tooltip?.autoAdjustOverflow ?? true;
  const formatTooltip = (v: number) => (tooltipFormatter ? tooltipFormatter(v) : v);

  const trackLow = isRange ? Math.min(...values) : min;
  const trackHigh = isRange ? Math.max(...values) : values[0];

  const isActiveValue = (v: number) => {
    if (!included) return values.includes(v);
    return v >= trackLow && v <= trackHigh;
  };

  const positionStyle = (v: number): React.CSSProperties =>
    vertical ? { bottom: `${offsetOf(v)}%` } : { left: `${offsetOf(v)}%` };

  const spanStyle = (a: number, b: number): React.CSSProperties => {
    const from = Math.min(offsetOf(a), offsetOf(b));
    const size = Math.abs(offsetOf(a) - offsetOf(b));
    return vertical ? { bottom: `${from}%`, height: `${size}%` } : { left: `${from}%`, width: `${size}%` };
  };

  const spanMotion = dragging ? "" : "transition-[left,bottom,width,height] duration-mid ease-kk-out";
  const handleMotion = dragging
    ? "transition-[border-color,box-shadow,scale] duration-fast ease-kk-out"
    : "transition-[left,bottom,border-color,box-shadow,scale] duration-mid ease-kk-out";

  /** Position of a segment inside the `tracks` wrapper, in percent of the wrapper. */
  const segmentStyle = (a: number, b: number): React.CSSProperties => {
    const total = trackHigh - trackLow || 1;
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    const from = ((reverse ? trackHigh - hi : lo - trackLow) / total) * 100;
    const size = ((hi - lo) / total) * 100;
    return vertical
      ? { bottom: `${from}%`, height: `${size}%`, left: 0, width: "100%" }
      : { left: `${from}%`, width: `${size}%`, top: 0, height: "100%" };
  };

  const trackNodes = included ? (
    isRange ? (
      <div
        data-slider-tracks
        style={{ ...spanStyle(trackLow, trackHigh), ...styles?.tracks }}
        className={cn(
          "absolute rounded-full",
          vertical ? "left-0 w-full" : "top-0 h-full",
          draggableTrack && !disabled && "cursor-grab",
          spanMotion,
          classNames?.tracks,
        )}
      >
        {values.slice(0, -1).map((v, i) => (
          <div
            key={i}
            style={{ ...segmentStyle(v, values[i + 1]), ...styles?.track }}
            className={cn("absolute rounded-full", disabled ? "bg-fill-secondary" : "bg-primary", classNames?.track)}
          />
        ))}
      </div>
    ) : (
      <div
        style={{ ...spanStyle(min, values[0]), ...styles?.track }}
        className={cn(
          "absolute rounded-full",
          vertical ? "left-0 w-full" : "top-0 h-full",
          disabled ? "bg-fill-secondary" : "bg-primary",
          spanMotion,
          classNames?.track,
        )}
      />
    )
  ) : null;

  const dotValues = React.useMemo(() => {
    if (!dots || step === null || !step) return [];
    const count = Math.floor(span / step);
    if (count > 200) return [];
    const list: number[] = [];
    for (let i = 0; i <= count; i++) list.push(fix(min + i * step));
    return list;
  }, [dots, step, span, min, fix]);

  return (
    <div
      id={id}
      data-slot="slider"
      data-disabled={disabled || undefined}
      onFocus={onFocus}
      onBlur={onBlur}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      style={{ ...style, ...styles?.root }}
      className={cn(
        "relative touch-none select-none",
        vertical ? "inline-flex h-full min-h-24 justify-center px-2" : "flex w-full items-center py-2",
        marks && (vertical ? "mr-12" : "mb-7"),
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className,
        classNames?.root,
      )}
    >
      <div
        ref={railRef}
        style={styles?.rail}
        className={cn(
          "relative rounded-full bg-fill-tertiary",
          vertical ? "h-full w-1.5" : "h-1.5 w-full",
          classNames?.rail,
        )}
      >
        {trackNodes}

        {dotValues.map((v) => (
          <span
            key={v}
            style={positionStyle(v)}
            className={cn(
              "absolute size-1.5 rounded-full border-2 bg-bg-container transition-colors duration-mid",
              vertical ? "left-1/2 -translate-x-1/2 translate-y-1/2" : "top-1/2 -translate-x-1/2 -translate-y-1/2",
              isActiveValue(v) && !disabled ? "border-primary" : "border-border",
            )}
          />
        ))}

        {values.map((v, i) => {
          const showTooltip =
            tooltipEnabled &&
            (tooltip?.open === true ||
              (tooltip?.open === undefined && !disabled && (activeIndex === i || hoverIndex === i || focusIndex === i)));
          return (
            <React.Fragment key={i}>
              <div
                ref={setHandleEl(i)}
                data-handle-index={i}
                role="slider"
                tabIndex={disabled ? -1 : 0}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={v}
                aria-orientation={vertical ? "vertical" : "horizontal"}
                aria-disabled={disabled || undefined}
                onKeyDown={handleKeyDown(i)}
                onKeyUp={handleKeyUp}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                onFocus={() => setFocusIndex(i)}
                onBlur={() => setFocusIndex(null)}
                style={{
                  ...positionStyle(v),
                  ...(vertical
                    ? { left: "50%", transform: "translate(-50%, 50%)" }
                    : { top: "50%", transform: "translate(-50%, -50%)" }),
                  ...styles?.handle,
                }}
                className={cn(
                  "absolute z-10 size-3.5 rounded-full border-2 bg-bg-container shadow-xs outline-none",
                  handleMotion,
                  disabled
                    ? "cursor-not-allowed border-text-disabled"
                    : "cursor-grab border-primary hover:scale-110 hover:border-primary-hover focus-visible:ring-[3px] focus-visible:ring-primary/30",
                  activeIndex === i && !disabled && "scale-110 cursor-grabbing ring-[3px] ring-primary/30",
                  classNames?.handle,
                )}
              />
              <SliderTooltip
                target={handleEls[i] ?? null}
                open={showTooltip}
                placement={tooltipPlacement}
                autoAdjustOverflow={tooltipAdjust}
              >
                {formatTooltip(v)}
              </SliderTooltip>
            </React.Fragment>
          );
        })}
      </div>

      {marks && (
        <div
          className={cn(
            "pointer-events-none absolute text-xs",
            vertical ? "top-0 bottom-0 left-full ml-3 w-0" : "top-full right-0 left-0 mt-2 h-0",
          )}
        >
          {markValues.map((v) => {
            const mark = marks[v];
            const asObject = isMarkObject(mark);
            const label = asObject ? mark.label : (mark as React.ReactNode);
            const active = isActiveValue(v);
            return (
              <button
                key={v}
                type="button"
                tabIndex={-1}
                disabled={disabled}
                onClick={() => {
                  if (disabled) return;
                  moveHandle(nearestIndex(v), v);
                  complete();
                }}
                style={{ ...positionStyle(v), ...(asObject ? mark.style : undefined) }}
                className={cn(
                  "pointer-events-auto absolute whitespace-nowrap transition-colors duration-mid",
                  vertical ? "translate-y-1/2 text-left" : "-translate-x-1/2 text-center",
                  disabled
                    ? "cursor-not-allowed text-text-disabled"
                    : active
                      ? "cursor-pointer text-text"
                      : "cursor-pointer text-text-tertiary hover:text-text",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
