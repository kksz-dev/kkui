import * as React from "react";
import { cn } from "@/lib/utils";
import { useBreakpoint, responsiveArray, responsiveMap, type ScreenMap } from "@/hooks/use-breakpoint";

export { responsiveArray, responsiveMap };
export type { ScreenMap };

/**
 * Grid — KKUI 24-column flex grid: `Row` (gutter / justify / align / wrap)
 * + `Col` (span / offset / order / push / pull / flex + xs..xxl responsive props),
 * driven by inline percentages and a `useBreakpoint()` hook (window.matchMedia).
 */
export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

/* ---------------------------------- Row ---------------------------------- */

type Gutter = number | Partial<Record<Breakpoint, number>>;

export type RowJustify = "start" | "end" | "center" | "space-around" | "space-between" | "space-evenly";
export type RowAlign = "top" | "middle" | "bottom" | "stretch";
/** A plain value, or one value per breakpoint (largest matching wins) */
export type Responsive<T> = T | Partial<Record<Breakpoint, T>>;

export interface RowProps extends React.ComponentProps<"div"> {
  /** Spacing between columns: number, `[horizontal, vertical]`, or responsive object(s) */
  gutter?: Gutter | [Gutter, Gutter];
  /** Horizontal arrangement (flex `justify-content`), per breakpoint too */
  justify?: Responsive<RowJustify>;
  /** Vertical alignment (flex `align-items`), per breakpoint too */
  align?: Responsive<RowAlign>;
  /** Auto wrap line */
  wrap?: boolean;
}

interface RowContextValue {
  gutter: [number, number];
  wrap: boolean;
}
const RowContext = React.createContext<RowContextValue>({ gutter: [0, 0], wrap: true });

const justifyMap = {
  start: "justify-start",
  end: "justify-end",
  center: "justify-center",
  "space-around": "justify-around",
  "space-between": "justify-between",
  "space-evenly": "justify-evenly",
} as const;
const alignMap = { top: "items-start", middle: "items-center", bottom: "items-end", stretch: "items-stretch" } as const;

function resolveGutter(g: Gutter | undefined, screens: ScreenMap): number {
  if (g == null) return 0;
  if (typeof g === "number") return g;
  for (const bp of responsiveArray) {
    if (screens[bp] && g[bp] != null) return g[bp] as number;
  }
  return 0;
}

/** `justify` / `align` accept a plain value or a `{ xs, md, … }` map — largest match wins. */
function resolveResponsive<T extends string>(value: Responsive<T> | undefined, screens: ScreenMap, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === "string") return value;
  for (const bp of responsiveArray) {
    if (screens[bp] && value[bp] != null) return value[bp] as T;
  }
  return fallback;
}

function Row({ className, style, gutter = 0, justify, align, wrap = true, children, ...props }: RowProps) {
  const screens = useBreakpoint();
  const [gh, gv] = Array.isArray(gutter) ? gutter : [gutter, 0];
  const h = resolveGutter(gh, screens);
  const v = resolveGutter(gv, screens);
  const justifyValue = resolveResponsive(justify, screens, "start");
  const alignValue = resolveResponsive(align, screens, "top");
  const ctx = React.useMemo<RowContextValue>(() => ({ gutter: [h, v], wrap }), [h, v, wrap]);
  const rowStyle: React.CSSProperties = { ...style };
  if (h > 0) {
    rowStyle.marginLeft = -h / 2;
    rowStyle.marginRight = -h / 2;
  }
  if (v > 0) rowStyle.rowGap = v;
  return (
    <RowContext.Provider value={ctx}>
      <div
        data-slot="row"
        className={cn("flex min-w-0 flex-row", wrap ? "flex-wrap" : "flex-nowrap", justifyMap[justifyValue], alignMap[alignValue], className)}
        style={rowStyle}
        {...props}
      >
        {children}
      </div>
    </RowContext.Provider>
  );
}

/* ---------------------------------- Col ---------------------------------- */

export interface ColSize {
  span?: number;
  offset?: number;
  order?: number;
  push?: number;
  pull?: number;
  flex?: string | number;
}

export interface ColProps extends React.ComponentProps<"div">, ColSize {
  xs?: number | ColSize;
  sm?: number | ColSize;
  md?: number | ColSize;
  lg?: number | ColSize;
  xl?: number | ColSize;
  xxl?: number | ColSize;
}

const pct = (n: number) => `${(n / 24) * 100}%`;

function parseFlex(flex: string | number): string {
  if (typeof flex === "number") return `${flex} ${flex} auto`;
  if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(flex)) return `0 0 ${flex}`;
  return flex;
}

function Col({ className, style, span, offset, order, push, pull, flex, xs, sm, md, lg, xl, xxl, children, ...props }: ColProps) {
  const { gutter, wrap } = React.useContext(RowContext);
  const screens = useBreakpoint();

  // Merge base + the largest matching breakpoint(s), mobile-first (xs → xxl).
  const size: ColSize = { span, offset, order, push, pull, flex };
  const bpProps: [Breakpoint, number | ColSize | undefined][] = [
    ["xs", xs],
    ["sm", sm],
    ["md", md],
    ["lg", lg],
    ["xl", xl],
    ["xxl", xxl],
  ];
  for (const [bp, val] of bpProps) {
    if (val == null) continue;
    // `xs` is the default setting (applies everywhere); larger breakpoints override it while matched.
    if (bp !== "xs" && !screens[bp]) continue;
    if (typeof val === "number") size.span = val;
    else Object.assign(size, val);
  }

  const colStyle: React.CSSProperties = { ...style };
  const [h] = gutter;
  if (h > 0) {
    colStyle.paddingLeft = h / 2;
    colStyle.paddingRight = h / 2;
  }
  if (size.flex != null) {
    colStyle.flex = parseFlex(size.flex);
    if (!wrap) colStyle.minWidth = 0;
  } else if (size.span != null) {
    if (size.span === 0) colStyle.display = "none";
    else {
      colStyle.flex = `0 0 ${pct(size.span)}`;
      colStyle.maxWidth = pct(size.span);
    }
  } else {
    colStyle.flex = "0 0 auto";
    colStyle.maxWidth = "100%";
  }
  if (size.offset) colStyle.marginInlineStart = pct(size.offset);
  if (size.order != null) colStyle.order = size.order;
  if (size.push) colStyle.insetInlineStart = pct(size.push);
  if (size.pull) colStyle.insetInlineEnd = pct(size.pull);

  return (
    <div data-slot="col" className={cn("relative box-border min-h-px max-w-full", className)} style={colStyle} {...props}>
      {children}
    </div>
  );
}

export { Row, Col, useBreakpoint };
