import * as React from "react";
import { Portal } from "@/components/ui/portal";
import { computeFloatingPosition, measureFloating } from "@/lib/floating-position";
import { cn } from "@/lib/utils";

/**
 * Small SVG charts driven by the --kk-chart-* tokens.
 *
 * Deliberately not a charting library: five shapes that cover dashboards, with
 * no dependency and no canvas. Anything more specialised is better served by a
 * real charting package.
 */

export interface ChartSeries {
  key: string;
  name?: string;
  /** Any CSS colour; defaults to the chart palette in order. */
  color?: string;
}

export type ChartDatum = Record<string, string | number | null | undefined>;

export interface ChartPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ChartBaseProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  data: ChartDatum[];
  series: ChartSeries[];
  /** Field holding the category name. */
  xKey?: string;
  height?: number;
  /** Show the horizontal grid. */
  grid?: boolean;
  /** Show the value-axis labels (bottom axis for horizontal bars). */
  yAxis?: boolean;
  /** Show the category-axis labels (left axis for horizontal bars). */
  xAxis?: boolean;
  legend?: boolean;
  /** Format a value for the axis and tooltip. */
  valueFormatter?: (value: number) => string;
  /** Fix the value axis instead of deriving it from the data. */
  domain?: [number, number];
  /** Override the plot gutters. Horizontal bars use a wider left gutter by default. */
  padding?: Partial<ChartPadding>;
  /** Accessible name for the chart graphic. */
  ariaLabel?: string;
  /** Controlled active datum. `null` clears the tooltip. */
  activeIndex?: number | null;
  onActiveIndexChange?: (index: number | null) => void;
  /** Called when the active datum is clicked or activated from the keyboard. */
  onDatumClick?: (datum: ChartDatum, index: number, series?: ChartSeries) => void;
}

const PALETTE = ["var(--kk-chart-1)", "var(--kk-chart-2)", "var(--kk-chart-3)", "var(--kk-chart-4)", "var(--kk-chart-5)"];

const PAD: ChartPadding = { top: 12, right: 12, bottom: 26, left: 44 };
const HORIZONTAL_BAR_PAD: ChartPadding = { ...PAD, left: 96 };

function colorOf(series: ChartSeries, index: number) {
  return series.color ?? PALETTE[index % PALETTE.length];
}

function niceTicks(min: number, max: number, count = 4): number[] {
  if (min === max) return [min];
  const span = max - min;
  const step = Math.pow(10, Math.floor(Math.log10(span / count)));
  const err = (span / count) / step;
  const factor = err >= 7.5 ? 10 : err >= 3 ? 5 : err >= 1.5 ? 2 : 1;
  const nice = step * factor;
  const start = Math.floor(min / nice) * nice;
  const end = Math.ceil(max / nice) * nice;
  const ticks: number[] = [];
  for (let v = start; v <= end + nice / 2; v += nice) ticks.push(+v.toFixed(10));
  return ticks;
}

function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) ref.current = value;
}

function useComposedRef<T>(innerRef: React.RefObject<T | null>, forwardedRef: React.ForwardedRef<T>) {
  return React.useCallback(
    (node: T | null) => {
      innerRef.current = node;
      setRef(forwardedRef, node);
    },
    [forwardedRef, innerRef],
  );
}

function useActiveIndex(controlled: number | null | undefined, onChange?: (index: number | null) => void) {
  const [internal, setInternal] = React.useState<number | null>(null);
  const isControlled = controlled !== undefined;
  const active = isControlled ? controlled : internal;
  const activeRef = React.useRef(active);
  activeRef.current = active;

  const setActive = React.useCallback(
    (next: number | null) => {
      if (activeRef.current === next) return;
      activeRef.current = next;
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [active, setActive] as const;
}

function handleIndexKey(
  event: React.KeyboardEvent,
  length: number,
  activeIndex: number | null,
  setActiveIndex: (index: number | null) => void,
  onActivate: (index: number) => void,
) {
  if (!length) return;

  let next: number | null | undefined;
  switch (event.key) {
    case "ArrowLeft":
      next = activeIndex === null ? length - 1 : Math.max(0, activeIndex - 1);
      break;
    case "ArrowRight":
      next = activeIndex === null ? 0 : Math.min(length - 1, activeIndex + 1);
      break;
    case "Home":
      next = 0;
      break;
    case "End":
      next = length - 1;
      break;
    case "Escape":
      next = null;
      break;
    case "Enter":
    case " ":
      if (activeIndex !== null) onActivate(activeIndex);
      event.preventDefault();
      return;
    default:
      return;
  }

  event.preventDefault();
  setActiveIndex(next);
}

/** Width from the element, so the chart reflows without a resize listener each. */
function useMeasuredWidth<T extends HTMLElement>(fallback = 480) {
  const ref = React.useRef<T>(null);
  const [width, setWidth] = React.useState(fallback);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect.width;
      if (next) setWidth(next);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, width] as const;
}

interface HoverState {
  index: number;
  x: number;
  y: number;
}

function ChartTooltip({
  hover,
  data,
  series,
  xKey,
  format,
  svgRef,
}: {
  hover: HoverState;
  data: ChartDatum[];
  series: ChartSeries[];
  xKey: string;
  format: (v: number) => string;
  svgRef: React.RefObject<SVGSVGElement | null>;
}) {
  const row = data[hover.index];
  if (!row) return null;

  return <PositionedChartTooltip hover={hover} row={row} series={series} xKey={xKey} format={format} svgRef={svgRef} />;
}

function PositionedChartTooltip({
  hover,
  row,
  series,
  xKey,
  format,
  svgRef,
}: {
  hover: HoverState;
  row: ChartDatum;
  series: ChartSeries[];
  xKey: string;
  format: (v: number) => string;
  svgRef: React.RefObject<SVGSVGElement | null>;
}) {
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState<{ top: number; left: number } | null>(null);

  const updatePosition = React.useCallback(() => {
    const svg = svgRef.current;
    const tooltip = tooltipRef.current;
    if (!svg || !tooltip) return;
    const svgRect = svg.getBoundingClientRect();
    const left = svgRect.left + hover.x;
    const top = svgRect.top + hover.y;
    const anchorRect = {
      x: left,
      y: top,
      top,
      right: left,
      bottom: top,
      left,
      width: 0,
      height: 0,
      toJSON: () => ({}),
    } as DOMRect;
    const next = computeFloatingPosition(anchorRect, measureFloating(tooltip), "top", 8, { autoAdjustOverflow: true });
    setPosition((prev) => (prev?.top === next.top && prev.left === next.left ? prev : next));
  }, [hover.index, hover.x, hover.y, svgRef]);

  React.useLayoutEffect(() => {
    updatePosition();
    const update = () => updatePosition();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [updatePosition]);

  return (
    <Portal>
      <div
        ref={tooltipRef}
        role="tooltip"
        data-slot="chart-tooltip"
        className="pointer-events-none absolute min-w-32 rounded-lg border border-border bg-bg-elevated px-2.5 py-2 text-xs shadow-kk"
        style={{ left: position?.left ?? -9999, top: position?.top ?? -9999, zIndex: 1070, visibility: position ? undefined : "hidden" }}
      >
        <div className="mb-1 font-medium text-text-heading">{String(row[xKey] ?? "")}</div>
        {series.map((s, i) => (
          <div key={s.key} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-text-secondary">
              <span className="size-2 rounded-full" style={{ backgroundColor: colorOf(s, i) }} />
              {s.name ?? s.key}
            </span>
            <span className="font-mono text-text">{format(Number(row[s.key] ?? 0))}</span>
          </div>
        ))}
      </div>
    </Portal>
  );
}

function AccessibleChartTable({
  label,
  data,
  series,
  xKey,
  format,
}: {
  label?: string;
  data: ChartDatum[];
  series: ChartSeries[];
  xKey: string;
  format: (value: number) => string;
}) {
  return (
    <table className="sr-only">
      <caption>{label ?? "Chart data"}</caption>
      <thead>
        <tr>
          <th scope="col">{xKey}</th>
          {series.map((item) => (
            <th key={item.key} scope="col">
              {item.name ?? item.key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <th scope="row">{String(row[xKey] ?? "")}</th>
            {series.map((item) => (
              <td key={item.key}>{format(Number(row[item.key] ?? 0))}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function datumAnnouncement(row: ChartDatum | undefined, series: ChartSeries[], xKey: string, format: (value: number) => string) {
  if (!row) return "";
  const values = series.map((item) => `${item.name ?? item.key}: ${format(Number(row[item.key] ?? 0))}`).join(", ");
  return `${String(row[xKey] ?? "")}${values ? `, ${values}` : ""}`;
}

function mergePadding(padding: Partial<ChartPadding> | undefined, horizontal = false): ChartPadding {
  return {
    ...(horizontal ? HORIZONTAL_BAR_PAD : PAD),
    ...padding,
  };
}

function isFocusLeaving(event: React.FocusEvent<HTMLDivElement>) {
  return !event.currentTarget.contains(event.relatedTarget as Node | null);
}

function chartRootLabel(ariaLabel: string | undefined) {
  return ariaLabel ? undefined : "Chart data";
}

function chartSvgA11y(ariaLabel: string | undefined) {
  return ariaLabel
    ? { role: "img" as const, "aria-label": ariaLabel, "aria-hidden": undefined }
    : { role: undefined, "aria-label": undefined, "aria-hidden": true as const };
}

function DonutDataTable({ label, data, total, format }: { label?: string; data: DonutSlice[]; total: number; format: (value: number) => string }) {
  return (
    <table className="sr-only">
      <caption>{label ?? "Chart data"}</caption>
      <thead>
        <tr>
          <th scope="col">Category</th>
          <th scope="col">Value</th>
          <th scope="col">Percentage</th>
        </tr>
      </thead>
      <tbody>
        {data.map((slice) => (
          <tr key={slice.key}>
            <th scope="row">{slice.label ?? slice.key}</th>
            <td>{format(slice.value)}</td>
            <td>{Math.round((slice.value / total) * 100)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Legend({ series }: { series: ChartSeries[] }) {
  return (
    <div data-slot="chart-legend" className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary">
      {series.map((s, i) => (
        <span key={s.key} className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm" style={{ backgroundColor: colorOf(s, i) }} />
          {s.name ?? s.key}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Line / Area                                                         */
/* ------------------------------------------------------------------ */

export interface LineChartProps extends ChartBaseProps {
  /** Fill the area under each line. */
  area?: boolean;
  /** Round the joins between points. */
  curve?: boolean;
  /** Dots at every point, not only on hover. */
  dots?: boolean;
}

export const LineChart = React.forwardRef<HTMLDivElement, LineChartProps>(function LineChart(
  {
    data,
    series,
    xKey = "label",
    height = 220,
    grid = true,
    yAxis = true,
    xAxis = true,
    legend = true,
    valueFormatter = (v) => v.toLocaleString(),
    domain,
    padding,
    ariaLabel,
    activeIndex: controlledActiveIndex,
    onActiveIndexChange,
    onDatumClick,
    area = false,
    curve = true,
    dots = false,
    className,
    "aria-label": domAriaLabel,
    onKeyDown,
    onBlur,
    tabIndex,
    role,
    ...props
  },
  forwardedRef,
) {
  const [measuredRef, width] = useMeasuredWidth<HTMLDivElement>();
  const rootRef = useComposedRef(measuredRef, forwardedRef);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const plotRectRef = React.useRef<DOMRect | null>(null);
  const [rawActiveIndex, setActiveIndex] = useActiveIndex(controlledActiveIndex, onActiveIndexChange);
  const activeIndex = rawActiveIndex !== null && rawActiveIndex >= 0 && rawActiveIndex < data.length ? rawActiveIndex : null;
  const accessibleLabel = ariaLabel ?? domAriaLabel;
  const pad = React.useMemo(() => mergePadding(padding), [padding]);

  const geometry = React.useMemo(() => {
    const values = data.flatMap((datum) => series.map((item) => Number(datum[item.key] ?? 0)));
    const [min, max] = domain ?? [Math.min(0, ...values), Math.max(...values, 0)];
    const ticks = niceTicks(min, max);
    const lo = Math.min(...ticks, min);
    const hi = Math.max(...ticks, max);
    const innerW = Math.max(0, width - pad.left - pad.right);
    const innerH = Math.max(0, height - pad.top - pad.bottom);
    const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;
    const scaleY = (value: number) => pad.top + innerH - ((value - lo) / (hi - lo || 1)) * innerH;
    const pointX = (index: number) => pad.left + index * stepX;
    const path = (key: string) => {
      const points = data.map((datum, index) => [pointX(index), scaleY(Number(datum[key] ?? 0))] as const);
      if (!points.length) return "";
      if (!curve || points.length < 3) return points.map(([x, y], index) => `${index ? "L" : "M"} ${x} ${y}`).join(" ");
      // Catmull-Rom to bezier, so the line bends without overshooting.
      let out = `M ${points[0][0]} ${points[0][1]}`;
      for (let index = 0; index < points.length - 1; index++) {
        const p0 = points[index - 1] ?? points[index];
        const p1 = points[index];
        const p2 = points[index + 1];
        const p3 = points[index + 2] ?? p2;
        const c1x = p1[0] + (p2[0] - p0[0]) / 6;
        const c1y = p1[1] + (p2[1] - p0[1]) / 6;
        const c2x = p2[0] - (p3[0] - p1[0]) / 6;
        const c2y = p2[1] - (p3[1] - p1[1]) / 6;
        out += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
      }
      return out;
    };

    return {
      ticks,
      lo,
      innerW,
      innerH,
      stepX,
      scaleY,
      pointX,
      xLabelGap: Math.ceil(data.length / Math.max(1, Math.floor(innerW / 56))),
      paths: series.map((item) => path(item.key)),
    };
  }, [curve, data, domain, height, pad, series, width]);

  React.useLayoutEffect(() => {
    plotRectRef.current = null;
  }, [height, width]);

  const activateDatum = React.useCallback(
    (index: number) => {
      const datum = data[index];
      if (datum) onDatumClick?.(datum, index);
    },
    [data, onDatumClick],
  );

  const onMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!data.length || !series.length) return;
    const rect = plotRectRef.current ?? event.currentTarget.getBoundingClientRect();
    plotRectRef.current = rect;
    const localX = rect.width ? (event.clientX - rect.left) * (width / rect.width) : 0;
    const index = Math.max(0, Math.min(data.length - 1, Math.round((localX - pad.left) / (geometry.stepX || 1))));
    setActiveIndex(index);
  };

  const hover =
    activeIndex !== null && series.length
      ? {
          index: activeIndex,
          x: geometry.pointX(activeIndex),
          y: geometry.scaleY(Number(data[activeIndex]?.[series[0]?.key] ?? 0)),
        }
      : null;

  return (
    <div
      {...props}
      ref={rootRef}
      data-slot="chart"
      data-type={area ? "area" : "line"}
      role={role ?? (accessibleLabel ? undefined : "group")}
      aria-label={chartRootLabel(accessibleLabel)}
      tabIndex={accessibleLabel ? tabIndex : (tabIndex ?? 0)}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (!event.defaultPrevented && (event.target === event.currentTarget || event.target === svgRef.current)) {
          handleIndexKey(event, data.length, activeIndex, setActiveIndex, activateDatum);
        }
      }}
      onBlur={(event) => {
        onBlur?.(event);
        if (!event.defaultPrevented && isFocusLeaving(event)) setActiveIndex(null);
      }}
      className={cn("relative w-full outline-none focus-visible:ring-2 focus-visible:ring-primary/30", className)}
    >
      <svg
        ref={svgRef}
        data-slot="chart-plot"
        width="100%"
        height={height}
        {...chartSvgA11y(accessibleLabel)}
        tabIndex={accessibleLabel ? 0 : -1}
        onPointerEnter={(event) => {
          plotRectRef.current = event.currentTarget.getBoundingClientRect();
          onMove(event);
        }}
        onPointerMove={onMove}
        onPointerDown={onMove}
        onPointerLeave={() => {
          plotRectRef.current = null;
          setActiveIndex(null);
        }}
        onClick={() => activeIndex !== null && activateDatum(activeIndex)}
        className="overflow-visible outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        {accessibleLabel && <title>{accessibleLabel}</title>}
        {grid &&
          geometry.ticks.map((tick) => (
            <line
              key={tick}
              x1={pad.left}
              x2={width - pad.right}
              y1={geometry.scaleY(tick)}
              y2={geometry.scaleY(tick)}
              className="stroke-border-secondary"
              strokeWidth={1}
            />
          ))}

        {yAxis &&
          geometry.ticks.map((tick) => (
            <text
              key={tick}
              x={pad.left - 8}
              y={geometry.scaleY(tick)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-text-quaternary text-[10px]"
            >
              {valueFormatter(tick)}
            </text>
          ))}

        {xAxis &&
          data.map((datum, index) =>
            index % geometry.xLabelGap === 0 ? (
              <text
                key={index}
                x={geometry.pointX(index)}
                y={height - 8}
                textAnchor="middle"
                className="fill-text-quaternary text-[10px]"
              >
                {String(datum[xKey] ?? "")}
              </text>
            ) : null,
          )}

        {series.map((item, seriesIndex) => {
          const d = geometry.paths[seriesIndex];
          return (
            <g key={item.key}>
              {area && d && (
                <path
                  d={`${d} L ${geometry.pointX(data.length - 1)} ${geometry.scaleY(geometry.lo)} L ${geometry.pointX(0)} ${geometry.scaleY(geometry.lo)} Z`}
                  fill={colorOf(item, seriesIndex)}
                  opacity={0.12}
                />
              )}
              <path d={d} fill="none" stroke={colorOf(item, seriesIndex)} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              {(dots || hover) &&
                data.map((datum, datumIndex) =>
                  dots || hover?.index === datumIndex ? (
                    <circle
                      key={datumIndex}
                      cx={geometry.pointX(datumIndex)}
                      cy={geometry.scaleY(Number(datum[item.key] ?? 0))}
                      r={hover?.index === datumIndex ? 4 : 2.5}
                      fill="var(--kk-bg-elevated)"
                      stroke={colorOf(item, seriesIndex)}
                      strokeWidth={2}
                    />
                  ) : null,
                )}
            </g>
          );
        })}

        {hover && (
          <line
            x1={hover.x}
            x2={hover.x}
            y1={pad.top}
            y2={pad.top + geometry.innerH}
            className="stroke-border"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        )}
      </svg>

      {hover && <ChartTooltip hover={hover} data={data} series={series} xKey={xKey} format={valueFormatter} svgRef={svgRef} />}
      {legend && <Legend series={series} />}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {activeIndex !== null ? datumAnnouncement(data[activeIndex], series, xKey, valueFormatter) : ""}
      </div>
      <AccessibleChartTable label={accessibleLabel} data={data} series={series} xKey={xKey} format={valueFormatter} />
    </div>
  );
});

export const AreaChart = React.forwardRef<HTMLDivElement, Omit<LineChartProps, "area">>(function AreaChart(props, ref) {
  return <LineChart {...props} ref={ref} area />;
});

/* ------------------------------------------------------------------ */
/* Bar                                                                 */
/* ------------------------------------------------------------------ */

export interface BarChartProps extends ChartBaseProps {
  /** Stack the series instead of placing them side by side. */
  stacked?: boolean;
  /** Bars run left to right. */
  horizontal?: boolean;
  radius?: number;
}

export const BarChart = React.forwardRef<HTMLDivElement, BarChartProps>(function BarChart(
  {
    data,
    series,
    xKey = "label",
    height = 220,
    grid = true,
    yAxis = true,
    xAxis = true,
    legend = true,
    valueFormatter = (v) => v.toLocaleString(),
    domain,
    padding,
    ariaLabel,
    activeIndex: controlledActiveIndex,
    onActiveIndexChange,
    onDatumClick,
    stacked = false,
    horizontal = false,
    radius = 4,
    className,
    "aria-label": domAriaLabel,
    onKeyDown,
    onBlur,
    tabIndex,
    role,
    ...props
  },
  forwardedRef,
) {
  const [measuredRef, width] = useMeasuredWidth<HTMLDivElement>();
  const rootRef = useComposedRef(measuredRef, forwardedRef);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [rawActiveIndex, setActiveIndex] = useActiveIndex(controlledActiveIndex, onActiveIndexChange);
  const activeIndex = rawActiveIndex !== null && rawActiveIndex >= 0 && rawActiveIndex < data.length ? rawActiveIndex : null;
  const accessibleLabel = ariaLabel ?? domAriaLabel;
  const pad = React.useMemo(() => mergePadding(padding, horizontal), [horizontal, padding]);

  const geometry = React.useMemo(() => {
    const valuesByDatum = data.map((datum) => series.map((item) => Number(datum[item.key] ?? 0)));
    const positiveExtents = valuesByDatum.map((values) =>
      stacked ? values.reduce((sum, value) => sum + Math.max(0, value), 0) : Math.max(0, ...values),
    );
    const negativeExtents = valuesByDatum.map((values) =>
      stacked ? values.reduce((sum, value) => sum + Math.min(0, value), 0) : Math.min(0, ...values),
    );
    const [min, max] = domain ?? [Math.min(0, ...negativeExtents), Math.max(0, ...positiveExtents)];
    const ticks = niceTicks(min, max);
    const lo = Math.min(...ticks, min);
    const hi = Math.max(...ticks, max);
    const innerW = Math.max(0, width - pad.left - pad.right);
    const innerH = Math.max(0, height - pad.top - pad.bottom);
    const axisLength = horizontal ? innerW : innerH;
    const band = data.length ? (horizontal ? innerH : innerW) / data.length : 0;
    const barGroup = band * 0.62;
    const barW = stacked ? barGroup : barGroup / Math.max(1, series.length);
    const crossSize = stacked ? Math.max(1, barGroup) : Math.max(1, barW - 2);
    const scale = (value: number) => ((value - lo) / (hi - lo || 1)) * axisLength;
    const plotScale = (value: number) => Math.max(0, Math.min(axisLength, scale(value)));
    const base = plotScale(0);
    const anchors = data.map((_, index) => {
      const anchorValue = positiveExtents[index] > 0 ? positiveExtents[index] : negativeExtents[index];
      const groupCenter = (horizontal ? pad.top : pad.left) + index * band + band / 2;
      return horizontal
        ? { x: pad.left + plotScale(anchorValue), y: groupCenter }
        : { x: groupCenter, y: pad.top + innerH - plotScale(anchorValue) };
    });

    return { ticks, lo, hi, innerW, innerH, band, barGroup, barW, crossSize, scale, plotScale, base, anchors };
  }, [data, domain, height, horizontal, pad, series, stacked, width]);

  const activateDatum = React.useCallback(
    (index: number) => {
      const datum = data[index];
      if (datum) onDatumClick?.(datum, index);
    },
    [data, onDatumClick],
  );
  const hover = activeIndex !== null ? { index: activeIndex, ...geometry.anchors[activeIndex] } : null;
  const hasZeroBaseline = geometry.lo <= 0 && geometry.hi >= 0;

  return (
    <div
      {...props}
      ref={rootRef}
      data-slot="chart"
      data-type="bar"
      role={role ?? (accessibleLabel ? undefined : "group")}
      aria-label={chartRootLabel(accessibleLabel)}
      tabIndex={accessibleLabel ? tabIndex : (tabIndex ?? 0)}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (!event.defaultPrevented && (event.target === event.currentTarget || event.target === svgRef.current)) {
          handleIndexKey(event, data.length, activeIndex, setActiveIndex, activateDatum);
        }
      }}
      onBlur={(event) => {
        onBlur?.(event);
        if (!event.defaultPrevented && isFocusLeaving(event)) setActiveIndex(null);
      }}
      className={cn("relative w-full outline-none focus-visible:ring-2 focus-visible:ring-primary/30", className)}
    >
      <svg
        ref={svgRef}
        data-slot="chart-plot"
        width="100%"
        height={height}
        {...chartSvgA11y(accessibleLabel)}
        tabIndex={accessibleLabel ? 0 : -1}
        onPointerLeave={() => setActiveIndex(null)}
        className="overflow-visible outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        {accessibleLabel && <title>{accessibleLabel}</title>}
        {grid &&
          geometry.ticks
            .filter((tick) => tick !== 0)
            .map((tick) =>
              horizontal ? (
                <line
                  key={tick}
                  y1={pad.top}
                  y2={pad.top + geometry.innerH}
                  x1={pad.left + geometry.scale(tick)}
                  x2={pad.left + geometry.scale(tick)}
                  className="stroke-border-secondary"
                />
              ) : (
                <line
                  key={tick}
                  x1={pad.left}
                  x2={width - pad.right}
                  y1={pad.top + geometry.innerH - geometry.scale(tick)}
                  y2={pad.top + geometry.innerH - geometry.scale(tick)}
                  className="stroke-border-secondary"
                />
              ),
            )}

        {grid && hasZeroBaseline &&
          (horizontal ? (
            <line
              x1={pad.left + geometry.base}
              x2={pad.left + geometry.base}
              y1={pad.top}
              y2={pad.top + geometry.innerH}
              className="stroke-border"
              strokeWidth={1}
            />
          ) : (
            <line
              x1={pad.left}
              x2={width - pad.right}
              y1={pad.top + geometry.innerH - geometry.base}
              y2={pad.top + geometry.innerH - geometry.base}
              className="stroke-border"
              strokeWidth={1}
            />
          ))}

        {yAxis &&
          geometry.ticks.map((tick) =>
            horizontal ? (
              <text
                key={tick}
                x={pad.left + geometry.scale(tick)}
                y={height - 8}
                textAnchor="middle"
                className="fill-text-quaternary text-[10px]"
              >
                {valueFormatter(tick)}
              </text>
            ) : (
              <text
                key={tick}
                x={pad.left - 8}
                y={pad.top + geometry.innerH - geometry.scale(tick)}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-text-quaternary text-[10px]"
              >
                {valueFormatter(tick)}
              </text>
            ),
          )}

        {data.map((datum, index) => {
          const groupStart = (horizontal ? pad.top : pad.left) + index * geometry.band + (geometry.band - geometry.barGroup) / 2;
          let positiveStack = 0;
          let negativeStack = 0;

          return (
            <g
              key={index}
              onPointerEnter={() => setActiveIndex(index)}
              onPointerDown={() => setActiveIndex(index)}
              onPointerLeave={() => setActiveIndex(null)}
              onClick={() => activateDatum(index)}
            >
              <rect
                x={horizontal ? pad.left : pad.left + index * geometry.band}
                y={horizontal ? pad.top + index * geometry.band : pad.top}
                width={horizontal ? geometry.innerW : geometry.band}
                height={horizontal ? geometry.band : geometry.innerH}
                fill="transparent"
              />

              {series.map((item, seriesIndex) => {
                const value = Number(datum[item.key] ?? 0);
                const startValue = stacked ? (value >= 0 ? positiveStack : negativeStack) : 0;
                const endValue = startValue + value;
                if (stacked) {
                  if (value >= 0) positiveStack = endValue;
                  else negativeStack = endValue;
                }
                const start = stacked ? geometry.plotScale(startValue) : geometry.base;
                const end = geometry.plotScale(endValue);
                const offset = stacked ? 0 : seriesIndex * geometry.barW;
                const valueStart = Math.min(start, end);
                const valueSize = Math.abs(end - start);

                return horizontal ? (
                  <rect
                    key={item.key}
                    x={pad.left + valueStart}
                    y={groupStart + offset}
                    width={valueSize}
                    height={geometry.crossSize}
                    rx={radius}
                    fill={colorOf(item, seriesIndex)}
                    className="transition-opacity duration-fast"
                    opacity={hover && hover.index !== index ? 0.45 : 1}
                  />
                ) : (
                  <rect
                    key={item.key}
                    x={groupStart + offset}
                    y={pad.top + geometry.innerH - Math.max(start, end)}
                    width={geometry.crossSize}
                    height={valueSize}
                    rx={radius}
                    fill={colorOf(item, seriesIndex)}
                    className="transition-opacity duration-fast"
                    opacity={hover && hover.index !== index ? 0.45 : 1}
                  />
                );
              })}

              {xAxis && (
                <text
                  x={horizontal ? pad.left - 8 : groupStart + geometry.barGroup / 2}
                  y={horizontal ? groupStart + geometry.barGroup / 2 : height - 8}
                  textAnchor={horizontal ? "end" : "middle"}
                  dominantBaseline={horizontal ? "middle" : undefined}
                  className="fill-text-quaternary text-[10px]"
                >
                  {String(datum[xKey] ?? "")}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {hover && <ChartTooltip hover={hover} data={data} series={series} xKey={xKey} format={valueFormatter} svgRef={svgRef} />}
      {legend && <Legend series={series} />}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {activeIndex !== null ? datumAnnouncement(data[activeIndex], series, xKey, valueFormatter) : ""}
      </div>
      <AccessibleChartTable label={accessibleLabel} data={data} series={series} xKey={xKey} format={valueFormatter} />
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* Donut / Pie                                                         */
/* ------------------------------------------------------------------ */

export interface DonutSlice {
  key: string;
  label?: React.ReactNode;
  value: number;
  color?: string;
}

export interface DonutChartProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  data: DonutSlice[];
  size?: number;
  /** 0 makes it a pie. */
  thickness?: number;
  legend?: boolean;
  /** Content in the middle, e.g. a total. */
  center?: React.ReactNode;
  valueFormatter?: (value: number) => string;
  /** Accessible name for the chart graphic. */
  ariaLabel?: string;
  /** Controlled active slice. `null` clears the centre readout. */
  activeIndex?: number | null;
  onActiveIndexChange?: (index: number | null) => void;
  onDatumClick?: (slice: DonutSlice, index: number) => void;
}

export const DonutChart = React.forwardRef<HTMLDivElement, DonutChartProps>(function DonutChart(
  {
    data,
    size = 180,
    thickness = 28,
    legend = true,
    center,
    valueFormatter = (v) => v.toLocaleString(),
    ariaLabel,
    activeIndex: controlledActiveIndex,
    onActiveIndexChange,
    onDatumClick,
    className,
    "aria-label": domAriaLabel,
    onKeyDown,
    onBlur,
    tabIndex,
    role,
    ...props
  },
  ref,
) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [rawActiveIndex, setActiveIndex] = useActiveIndex(controlledActiveIndex, onActiveIndexChange);
  const activeIndex = rawActiveIndex !== null && rawActiveIndex >= 0 && rawActiveIndex < data.length ? rawActiveIndex : null;
  const accessibleLabel = ariaLabel ?? domAriaLabel;
  const total = React.useMemo(() => data.reduce((sum, datum) => sum + datum.value, 0) || 1, [data]);
  const radius = size / 2;
  const inner = thickness <= 0 ? 0 : Math.max(0, radius - thickness);

  const arcs = React.useMemo(() => {
    let angle = -Math.PI / 2;
    return data.map((slice, index) => {
      const portion = slice.value / total;
      const start = angle;
      const end = angle + portion * Math.PI * 2;
      angle = end;
      const point = (r: number, a: number) => `${radius + r * Math.cos(a)} ${radius + r * Math.sin(a)}`;
      let d: string;

      if (portion >= 1) {
        const middle = start + Math.PI;
        const fullEnd = start + Math.PI * 2;
        d =
          inner > 0
            ? `M ${point(radius, start)} A ${radius} ${radius} 0 1 1 ${point(radius, middle)} A ${radius} ${radius} 0 1 1 ${point(radius, fullEnd)} L ${point(inner, fullEnd)} A ${inner} ${inner} 0 1 0 ${point(inner, middle)} A ${inner} ${inner} 0 1 0 ${point(inner, start)} Z`
            : `M ${radius} ${radius} L ${point(radius, start)} A ${radius} ${radius} 0 1 1 ${point(radius, middle)} A ${radius} ${radius} 0 1 1 ${point(radius, fullEnd)} Z`;
      } else {
        const large = end - start > Math.PI ? 1 : 0;
        d =
          inner > 0
            ? `M ${point(radius, start)} A ${radius} ${radius} 0 ${large} 1 ${point(radius, end)} L ${point(inner, end)} A ${inner} ${inner} 0 ${large} 0 ${point(inner, start)} Z`
            : `M ${radius} ${radius} L ${point(radius, start)} A ${radius} ${radius} 0 ${large} 1 ${point(radius, end)} Z`;
      }

      return { d, slice, index, portion };
    });
  }, [data, inner, radius, total]);

  const activateDatum = React.useCallback(
    (index: number) => {
      const slice = data[index];
      if (slice) onDatumClick?.(slice, index);
    },
    [data, onDatumClick],
  );
  const activeSlice = activeIndex !== null ? data[activeIndex] : undefined;

  return (
    <div
      {...props}
      ref={ref}
      data-slot="chart"
      data-type="donut"
      role={role ?? (accessibleLabel ? undefined : "group")}
      aria-label={chartRootLabel(accessibleLabel)}
      tabIndex={accessibleLabel ? tabIndex : (tabIndex ?? 0)}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (!event.defaultPrevented && (event.target === event.currentTarget || event.target === svgRef.current)) {
          handleIndexKey(event, data.length, activeIndex, setActiveIndex, activateDatum);
        }
      }}
      onBlur={(event) => {
        onBlur?.(event);
        if (!event.defaultPrevented && isFocusLeaving(event)) setActiveIndex(null);
      }}
      className={cn("flex flex-wrap items-center gap-6 outline-none focus-visible:ring-2 focus-visible:ring-primary/30", className)}
    >
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          ref={svgRef}
          data-slot="chart-plot"
          width={size}
          height={size}
          {...chartSvgA11y(accessibleLabel)}
          tabIndex={accessibleLabel ? 0 : -1}
          className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          {accessibleLabel && <title>{accessibleLabel}</title>}
          {arcs.map(({ d, slice, index }) => (
            <path
              key={slice.key}
              d={d}
              fill={slice.color ?? PALETTE[index % PALETTE.length]}
              opacity={activeIndex !== null && activeIndex !== index ? 0.45 : 1}
              className="transition-opacity duration-fast"
              onPointerEnter={() => setActiveIndex(index)}
              onPointerDown={() => setActiveIndex(index)}
              onPointerLeave={() => setActiveIndex(null)}
              onClick={() => activateDatum(index)}
            />
          ))}
        </svg>

        {(center || activeSlice) && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            {activeSlice ? (
              <>
                <span className="text-xs text-text-tertiary">{activeSlice.label ?? activeSlice.key}</span>
                <span className="text-lg font-semibold text-text-heading">{valueFormatter(activeSlice.value)}</span>
                <span className="text-xs text-text-tertiary">{Math.round((activeSlice.value / total) * 100)}%</span>
              </>
            ) : (
              center
            )}
          </div>
        )}
      </div>

      {legend && (
        <div className="flex min-w-0 flex-col gap-1.5 text-sm">
          {data.map((slice, i) => (
            <button
              key={slice.key}
              type="button"
              aria-pressed={activeIndex === i}
              onPointerEnter={() => setActiveIndex(i)}
              onPointerLeave={() => setActiveIndex(null)}
              onFocus={() => setActiveIndex(i)}
              onBlur={() => setActiveIndex(null)}
              onClick={() => {
                setActiveIndex(i);
                activateDatum(i);
              }}
              className="flex items-center gap-2 text-left text-text-secondary transition-colors hover:text-text"
            >
              <span className="size-2.5 shrink-0 rounded-sm" style={{ backgroundColor: slice.color ?? PALETTE[i % PALETTE.length] }} />
              <span className="min-w-0 flex-1 truncate">{slice.label ?? slice.key}</span>
              <span className="shrink-0 font-mono text-xs text-text">{valueFormatter(slice.value)}</span>
            </button>
          ))}
        </div>
      )}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {activeSlice
          ? `${typeof activeSlice.label === "string" || typeof activeSlice.label === "number" ? activeSlice.label : activeSlice.key}, ${valueFormatter(activeSlice.value)}, ${Math.round((activeSlice.value / total) * 100)}%`
          : ""}
      </div>
      <DonutDataTable label={accessibleLabel} data={data} total={total} format={valueFormatter} />
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* Sparkline                                                           */
/* ------------------------------------------------------------------ */

export interface SparklineProps
  extends Omit<React.ComponentPropsWithoutRef<"svg">, "children" | "color" | "height" | "width"> {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  /** Fill under the line. */
  area?: boolean;
  /** Dot on the last point. */
  showLast?: boolean;
  /** Accessible name. Without one the decorative sparkline is hidden from assistive technology. */
  ariaLabel?: string;
}

export const Sparkline = React.forwardRef<SVGSVGElement, SparklineProps>(function Sparkline(
  {
    data,
    width = 96,
    height = 32,
    color,
    area = true,
    showLast = true,
    ariaLabel,
    className,
    "aria-label": domAriaLabel,
    role,
    ...props
  },
  ref,
) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stroke = color ?? "var(--kk-chart-1)";
  const accessibleLabel = ariaLabel ?? domAriaLabel;

  const points = data.map((value, index) => [
    (index / (data.length - 1)) * width,
    height - ((value - min) / range) * (height - 4) - 2,
  ] as const);
  const line = points.map(([x, y], index) => `${index ? "L" : "M"} ${x} ${y}`).join(" ");

  return (
    <svg
      {...props}
      ref={ref}
      data-slot="sparkline"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role={accessibleLabel ? (role ?? "img") : undefined}
      aria-label={accessibleLabel}
      aria-hidden={accessibleLabel ? undefined : true}
      className={cn("overflow-visible", className)}
    >
      {accessibleLabel && <title>{accessibleLabel}</title>}
      {area && <path d={`${line} L ${width} ${height} L 0 ${height} Z`} fill={stroke} opacity={0.12} />}
      <path d={line} fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {showLast && <circle cx={points.at(-1)![0]} cy={points.at(-1)![1]} r={2.5} fill={stroke} />}
    </svg>
  );
});
