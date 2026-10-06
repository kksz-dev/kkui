import * as React from "react";
import { cn } from "@/lib/utils";

export interface MasonryBreakpoints {
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

export interface MasonryProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Fixed column count, or a count per container-width breakpoint. */
  columns?: number | MasonryBreakpoints;
  /** Pixel gutter between items, both axes. */
  gap?: number;
  /** Keep the source order column by column instead of filling the shortest column. */
  sequential?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** Breakpoints are measured against the container, not the window. */
const BREAKPOINTS: [keyof MasonryBreakpoints, number][] = [
  ["xl", 1280],
  ["lg", 1024],
  ["md", 768],
  ["sm", 0],
];

function resolveColumns(columns: number | MasonryBreakpoints, width: number | null): number {
  if (typeof columns === "number") return Math.max(1, columns);
  if (width === null) return Math.max(1, columns.lg ?? columns.md ?? columns.sm ?? 1);
  for (const [key, min] of BREAKPOINTS) {
    if (width >= min && columns[key]) return Math.max(1, columns[key]!);
  }
  return Math.max(1, columns.sm ?? 1);
}

/**
 * Distribute items into the column that is currently shortest — the property that
 * makes a masonry a masonry. Column height counts the gutter under every item, so
 * three short cards do not beat one tall one on measured height alone. Heights arrive
 * from the measuring pass; until then every height is 0, so ties break on item count
 * and the items fall back to round-robin.
 */
function assign(count: number, heights: number[], columnCount: number, gap: number, sequential: boolean): number[][] {
  const buckets: number[][] = Array.from({ length: columnCount }, () => []);
  if (sequential) {
    // spread the remainder over the leading columns (5 items / 4 columns → 2,1,1,1 — never an empty trailing column)
    const base = Math.floor(count / columnCount);
    const extra = count % columnCount;
    let next = 0;
    for (let c = 0; c < columnCount; c++) {
      for (let k = base + (c < extra ? 1 : 0); k > 0; k--) buckets[c].push(next++);
    }
    return buckets;
  }
  const totals = new Array(columnCount).fill(0);
  for (let i = 0; i < count; i++) {
    let target = 0;
    for (let c = 1; c < columnCount; c++) {
      if (totals[c] < totals[target] || (totals[c] === totals[target] && buckets[c].length < buckets[target].length)) target = c;
    }
    buckets[target].push(i);
    totals[target] += (heights[i] || 0) + gap;
  }
  return buckets;
}

export function Masonry({
  columns = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 16,
  sequential = false,
  className,
  style,
  children,
  ...props
}: MasonryProps) {
  const items = React.Children.toArray(children);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const [width, setWidth] = React.useState<number | null>(null);
  const [heights, setHeights] = React.useState<number[]>([]);

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    // measure synchronously so the first paint already uses the real container width
    setWidth(root.getBoundingClientRect().width);
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect.width;
      if (next !== undefined) setWidth(next);
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  const colCount = resolveColumns(columns, width);

  const buckets = React.useMemo(
    () => assign(items.length, heights, colCount, gap, sequential),
    [items.length, heights, colCount, gap, sequential],
  );

  // one observer for every item, so a card that grows re-balances the columns.
  // Re-attached whenever the buckets change: an item that moves to another column
  // gets a new wrapper node, and observing the detached one would read back 0.
  React.useLayoutEffect(() => {
    if (typeof ResizeObserver === "undefined") return;
    const nodes = itemRefs.current.slice(0, items.length);
    const read = () => {
      const next = nodes.map((n) => n?.offsetHeight ?? 0);
      setHeights((prev) => (prev.length === next.length && prev.every((h, i) => h === next[i]) ? prev : next));
    };
    const ro = new ResizeObserver(read);
    nodes.forEach((n) => n && ro.observe(n));
    read();
    return () => ro.disconnect();
  }, [items.length, buckets]);

  return (
    <div
      ref={rootRef}
      data-slot="masonry"
      className={cn("flex w-full items-start", className)}
      style={{ gap, ...style }}
      {...props}
    >
      {buckets.map((bucket, colIdx) => (
        <div key={colIdx} data-slot="masonry-column" className="flex min-w-0 flex-1 flex-col" style={{ gap }}>
          {bucket.map((itemIdx) => (
            <div
              key={(items[itemIdx] as React.ReactElement)?.key ?? itemIdx}
              ref={(node) => {
                itemRefs.current[itemIdx] = node;
              }}
              data-slot="masonry-item"
              className="w-full"
            >
              {items[itemIdx]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
