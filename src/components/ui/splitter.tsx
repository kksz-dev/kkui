import * as React from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Splitter — KKUI resizable panes: `Splitter` (horizontal | vertical) holding
 * `SplitterPanel`s with defaultSize / size / min / max / collapsible / resizable.
 * Sizes are tracked in px, dragging uses pointer events, collapse arrows sit on the bar.
 */

export type SplitterLayout = "horizontal" | "vertical";
export type SplitterSize = number | string;
export type SplitterCollapsible = boolean | { start?: boolean; end?: boolean };

export interface SplitterPanelProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Initial size, px number or percentage string ("30%") */
  defaultSize?: SplitterSize;
  /** Controlled size, px number or percentage string */
  size?: SplitterSize;
  /** Minimum size, px number or percentage string */
  min?: SplitterSize;
  /** Maximum size, px number or percentage string */
  max?: SplitterSize;
  /** Show collapse arrows on the bar (both sides, or per side) */
  collapsible?: SplitterCollapsible;
  /** Whether the bars around this panel can be dragged */
  resizable?: boolean;
  children?: React.ReactNode;
}

export interface SplitterProps extends Omit<React.ComponentProps<"div">, "onResize"> {
  layout?: SplitterLayout;
  /** Defer the pane resize until the drag ends; a preview bar follows the pointer meanwhile */
  lazy?: boolean;
  onResizeStart?: (sizes: number[]) => void;
  onResize?: (sizes: number[]) => void;
  onResizeEnd?: (sizes: number[]) => void;
}

/** SplitterPanel is a config holder — Splitter reads its props and renders the pane. */
function SplitterPanel(_props: SplitterPanelProps): React.ReactElement | null {
  return null;
}
SplitterPanel.displayName = "SplitterPanel";

/* -------------------------------- helpers -------------------------------- */

const toPx = (v: SplitterSize | undefined, container: number): number | undefined => {
  if (v == null) return undefined;
  if (typeof v === "number") return v;
  const s = v.trim();
  if (s.endsWith("%")) return (parseFloat(s) / 100) * container;
  return parseFloat(s);
};

const normalizeCollapsible = (c: SplitterCollapsible | undefined) =>
  typeof c === "object" ? { start: !!c.start, end: !!c.end } : { start: !!c, end: !!c };

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

/* -------------------------------- Splitter ------------------------------- */

function Splitter({ className, layout = "horizontal", lazy = false, onResizeStart, onResize, onResizeEnd, children, ...props }: SplitterProps) {
  const isVertical = layout === "vertical";
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = React.useState(0);

  const panels = React.useMemo(
    () =>
      React.Children.toArray(children).filter(
        (c): c is React.ReactElement<SplitterPanelProps> => React.isValidElement(c) && c.type === SplitterPanel,
      ),
    [children],
  );
  const count = panels.length;
  const barTotal = Math.max(count - 1, 0); // bars are 1px each, taken from the flow

  // measure container
  React.useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setContainerSize(isVertical ? el.clientHeight : el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isVertical]);

  const available = Math.max(containerSize - barTotal, 0);

  // uncontrolled sizes (px); undefined until the container has been measured
  const [innerSizes, setInnerSizes] = React.useState<number[] | null>(null);
  const prevAvailable = React.useRef(0);

  React.useLayoutEffect(() => {
    if (available <= 0) return;
    setInnerSizes((prev) => {
      if (prev && prev.length === count && prevAvailable.current > 0) {
        // container resized: scale proportionally
        const ratio = available / prevAvailable.current;
        return ratio === 1 ? prev : prev.map((s) => s * ratio);
      }
      const explicit = panels.map((p) => toPx(p.props.size ?? p.props.defaultSize, available));
      const used = explicit.reduce<number>((a, b) => a + (b ?? 0), 0);
      const autoCount = explicit.filter((v) => v == null).length;
      // every panel sized: scale so they fill the container exactly (no gap / overflow)
      if (!autoCount && used > 0) return explicit.map((v) => ((v ?? 0) * available) / used);
      const rest = Math.max(available - used, 0);
      return explicit.map((v) => v ?? (autoCount ? rest / autoCount : 0));
    });
    prevAvailable.current = available;
  }, [available, count, panels]);

  // controlled `size` on a panel overrides the inner value
  const sizes = React.useMemo(() => {
    if (!innerSizes) return null;
    return panels.map((p, i) => toPx(p.props.size, available) ?? innerSizes[i] ?? 0);
  }, [innerSizes, panels, available]);

  const limits = React.useMemo(
    () =>
      panels.map((p) => ({
        min: toPx(p.props.min, available) ?? 0,
        max: toPx(p.props.max, available) ?? Infinity,
        collapsible: normalizeCollapsible(p.props.collapsible),
        resizable: p.props.resizable !== false,
      })),
    [panels, available],
  );

  const commit = React.useCallback(
    (next: number[], cb?: (s: number[]) => void) => {
      setInnerSizes(next);
      cb?.(next);
    },
    [],
  );

  /** Effective [lo, hi] for the panel before bar `i`, from both neighbours' min / max. */
  const barBounds = (i: number, total: number): [number, number] => {
    const lp = limits[i];
    const ln = limits[i + 1];
    const lo = Math.max(lp.min, total - ln.max);
    const hi = Math.min(lp.max, total - ln.min);
    return [Math.min(lo, hi), Math.max(lo, hi)];
  };

  /* -------- drag -------- */
  const dragRef = React.useRef<{ index: number; start: number; sizes: number[] } | null>(null);
  const [dragging, setDragging] = React.useState<number | null>(null);
  // lazy mode: sizes stay untouched while dragging, only this preview offset moves
  const pendingRef = React.useRef<number[] | null>(null);
  const [previewOffset, setPreviewOffset] = React.useState(0);
  const sizesRef = React.useRef<number[] | null>(null);
  sizesRef.current = sizes;

  const onBarPointerDown = (index: number) => (e: React.PointerEvent<HTMLDivElement>) => {
    if (!sizesRef.current) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { index, start: isVertical ? e.clientY : e.clientX, sizes: [...sizesRef.current] };
    pendingRef.current = null;
    setPreviewOffset(0);
    setDragging(index);
    onResizeStart?.([...sizesRef.current]);
  };

  const onBarPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const delta = (isVertical ? e.clientY : e.clientX) - d.start;
    const i = d.index;
    const prev0 = d.sizes[i];
    const next0 = d.sizes[i + 1];
    const total = prev0 + next0;
    // clamp prev by its own limits and by the neighbour's limits
    const [lo, hi] = barBounds(i, total);
    const prev = clamp(prev0 + delta, lo, hi);
    const next = total - prev;
    const out = [...d.sizes];
    out[i] = prev;
    out[i + 1] = next;
    if (lazy) {
      pendingRef.current = out;
      setPreviewOffset(prev - prev0);
    } else {
      commit(out, onResize);
    }
  };

  /** Arrow keys move the bar; Home / End collapse it to either limit. */
  const nudgeBar = (index: number, deltaPx: number) => {
    const current = sizesRef.current;
    if (!current) return;
    const prev0 = current[index];
    const next0 = current[index + 1];
    const total = prev0 + next0;
    const [lo, hi] = barBounds(index, total);
    const prev = clamp(prev0 + deltaPx, lo, hi);
    if (prev === prev0) return;
    const out = [...current];
    out[index] = prev;
    out[index + 1] = total - prev;
    onResizeStart?.([...current]);
    commit(out, onResize);
    onResizeEnd?.(out);
  };

  const onBarKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 40 : 10;
    const forward = isVertical ? "ArrowDown" : "ArrowRight";
    const backward = isVertical ? "ArrowUp" : "ArrowLeft";
    if (e.key === forward) nudgeBar(index, step);
    else if (e.key === backward) nudgeBar(index, -step);
    else if (e.key === "Home") nudgeBar(index, -1e6);
    else if (e.key === "End") nudgeBar(index, 1e6);
    else return;
    e.preventDefault();
  };

  const onBarPointerUp = () => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setDragging(null);
    setPreviewOffset(0);
    const pending = pendingRef.current;
    pendingRef.current = null;
    if (pending) {
      commit(pending, onResize);
      onResizeEnd?.(pending);
      return;
    }
    if (sizesRef.current) onResizeEnd?.([...sizesRef.current]);
  };

  /* -------- collapse -------- */
  const cacheRef = React.useRef<Record<number, number>>({});

  const collapse = (index: number, side: "start" | "end") => {
    const cur = sizesRef.current;
    if (!cur) return;
    const out = [...cur];
    const i = index;
    const prevSize = cur[i];
    const nextSize = cur[i + 1];
    if (side === "start") {
      if (nextSize === 0 && cur[i] > 0) {
        // expand collapsed next panel
        const restore = Math.min(cacheRef.current[i + 1] ?? prevSize / 2, prevSize);
        out[i + 1] = restore;
        out[i] = prevSize - restore;
      } else {
        cacheRef.current[i] = prevSize;
        out[i] = 0;
        out[i + 1] = nextSize + prevSize;
      }
    } else if (prevSize === 0 && nextSize > 0) {
      const restore = Math.min(cacheRef.current[i] ?? nextSize / 2, nextSize);
      out[i] = restore;
      out[i + 1] = nextSize - restore;
    } else {
      cacheRef.current[i + 1] = nextSize;
      out[i + 1] = 0;
      out[i] = prevSize + nextSize;
    }
    onResizeStart?.([...cur]);
    commit(out, onResize);
    onResizeEnd?.(out);
  };

  const StartIcon = isVertical ? ChevronUp : ChevronLeft;
  const EndIcon = isVertical ? ChevronDown : ChevronRight;

  return (
    <div
      ref={containerRef}
      data-slot="splitter"
      data-layout={layout}
      className={cn("flex h-full w-full min-h-0 min-w-0 items-stretch", isVertical ? "flex-col" : "flex-row", className)}
      {...props}
    >
      {panels.map((panel, i) => {
        const { className: pClass, style: pStyle, children: pChildren, defaultSize, size, min, max, collapsible, resizable, ...rest } = panel.props;
        const px = sizes ? sizes[i] : undefined;
        const paneStyle: React.CSSProperties =
          px == null ? { flex: "1 1 0%" } : { flex: `0 0 ${px}px`, [isVertical ? "height" : "width"]: px };
        const isLast = i === count - 1;

        let bar: React.ReactNode = null;
        if (!isLast && sizes) {
          const prevSize = sizes[i];
          const nextSize = sizes[i + 1];
          const lp = limits[i];
          const ln = limits[i + 1];
          const canResize =
            lp.resizable && ln.resizable && (prevSize !== 0 || !lp.collapsible.start) && (nextSize !== 0 || !ln.collapsible.end);
          const startCollapsible = (lp.collapsible.end && prevSize > 0) || (ln.collapsible.start && nextSize === 0 && prevSize > 0);
          const endCollapsible = (ln.collapsible.start && nextSize > 0) || (lp.collapsible.end && prevSize === 0 && nextSize > 0);
          const [lo, hi] = barBounds(i, prevSize + nextSize);
          const active = dragging === i;
          bar = (
            <div
              key={`bar-${i}`}
              data-slot="splitter-bar"
              data-active={active || undefined}
              role="separator"
              aria-orientation={isVertical ? "horizontal" : "vertical"}
              aria-valuemin={Math.round(lo)}
              aria-valuemax={Math.round(hi)}
              aria-valuenow={Math.round(prevSize)}
              aria-label="Resize panels"
              tabIndex={canResize ? 0 : -1}
              onKeyDown={canResize ? onBarKeyDown(i) : undefined}
              className={cn(
                "relative z-10 flex shrink-0 items-center justify-center bg-split outline-none",
                "focus-visible:bg-primary",
                isVertical ? "h-px w-full" : "h-auto w-px",
              )}
            >
              {/* dragger */}
              <div
                data-slot="splitter-dragger"
                onPointerDown={canResize ? onBarPointerDown(i) : undefined}
                onPointerMove={onBarPointerMove}
                onPointerUp={onBarPointerUp}
                onPointerCancel={onBarPointerUp}
                className={cn(
                  "absolute touch-none transition-colors duration-mid ease-kk-in-out before:absolute before:rounded-full before:transition-[background-color,transform] before:duration-mid before:ease-kk-in-out",
                  isVertical
                    ? "inset-x-0 -top-[3px] h-[7px] before:inset-x-0 before:top-[3px] before:h-px"
                    : "inset-y-0 -left-[3px] w-[7px] before:inset-y-0 before:left-[3px] before:w-px",
                  canResize
                    ? cn(
                        isVertical ? "cursor-row-resize" : "cursor-col-resize",
                        "hover:before:bg-primary-hover",
                        isVertical ? "hover:before:scale-y-[3]" : "hover:before:scale-x-[3]",
                        active && cn("before:bg-primary", isVertical ? "before:scale-y-[3]" : "before:scale-x-[3]"),
                      )
                    : "cursor-default",
                )}
              />
              {/* lazy preview: shows where the bar will land once the pointer is released */}
              {lazy && active && (
                <div
                  data-slot="splitter-preview"
                  aria-hidden
                  className={cn("pointer-events-none absolute bg-primary", isVertical ? "inset-x-0 h-[3px]" : "inset-y-0 w-[3px]")}
                  style={{ transform: isVertical ? `translateY(${previewOffset}px)` : `translateX(${previewOffset}px)` }}
                />
              )}
              {/* collapse arrows */}
              {startCollapsible && (
                <button
                  type="button"
                  aria-label={nextSize === 0 ? "Expand toward start" : "Collapse toward start"}
                  onClick={() => collapse(i, "start")}
                  className={cn(
                    "absolute z-10 flex items-center justify-center rounded-sm bg-fill-tertiary text-text-tertiary transition-colors duration-mid hover:bg-fill-secondary hover:text-text",
                    isVertical ? "-top-[14px] left-1/2 h-3 w-6 -translate-x-1/2" : "-left-[14px] top-1/2 h-6 w-3 -translate-y-1/2",
                  )}
                >
                  <StartIcon className="size-3" />
                </button>
              )}
              {endCollapsible && (
                <button
                  type="button"
                  aria-label={prevSize === 0 ? "Expand toward end" : "Collapse toward end"}
                  onClick={() => collapse(i, "end")}
                  className={cn(
                    "absolute z-10 flex items-center justify-center rounded-sm bg-fill-tertiary text-text-tertiary transition-colors duration-mid hover:bg-fill-secondary hover:text-text",
                    isVertical ? "left-1/2 top-[3px] h-3 w-6 -translate-x-1/2" : "left-[3px] top-1/2 h-6 w-3 -translate-y-1/2",
                  )}
                >
                  <EndIcon className="size-3" />
                </button>
              )}
            </div>
          );
        }

        return (
          <React.Fragment key={panel.key ?? i}>
            <div
              data-slot="splitter-panel"
              className={cn("min-h-0 min-w-0 overflow-auto kk-scrollbar", pClass)}
              style={{ ...paneStyle, ...pStyle }}
              {...rest}
            >
              {pChildren}
            </div>
            {bar}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export { Splitter, SplitterPanel };
