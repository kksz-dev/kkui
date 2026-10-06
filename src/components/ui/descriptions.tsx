import * as React from "react";
import { cn } from "@/lib/utils";

export type DescriptionsSize = "default" | "middle" | "small";
export type DescriptionsLayout = "horizontal" | "vertical";

export interface ResponsiveBreakpointConfig {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
}

export type DescriptionsColumn = number | ResponsiveBreakpointConfig;

export interface DescriptionsItemType {
  key?: React.Key;
  label?: React.ReactNode;
  children?: React.ReactNode;
  span?: number | "filled" | ResponsiveBreakpointConfig;
  className?: string;
  style?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
}

export interface DescriptionsItemProps extends DescriptionsItemType {}

export interface DescriptionsClassNames {
  root?: string;
  header?: string;
  title?: string;
  extra?: string;
  label?: string;
  content?: string;
}

export interface DescriptionsStyles {
  root?: React.CSSProperties;
  header?: React.CSSProperties;
  title?: React.CSSProperties;
  extra?: React.CSSProperties;
  label?: React.CSSProperties;
  content?: React.CSSProperties;
}

export interface DescriptionsProps extends Omit<React.ComponentProps<"div">, "title"> {
  title?: React.ReactNode;
  extra?: React.ReactNode;
  bordered?: boolean;
  column?: DescriptionsColumn;
  size?: DescriptionsSize;
  layout?: DescriptionsLayout;
  colon?: boolean;
  labelStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  items?: DescriptionsItemType[];
  classNames?: DescriptionsClassNames;
  styles?: DescriptionsStyles;
}

function DescriptionsItem(_props: DescriptionsItemProps) {
  return null;
}

const DEFAULT_BREAKPOINTS: Record<string, number> = {
  xxl: 1600,
  xl: 1200,
  lg: 992,
  md: 768,
  sm: 576,
  xs: 0,
};

function useResponsiveColumn(column: DescriptionsColumn = 3): number {
  const [activeColumn, setActiveColumn] = React.useState<number>(() => {
    if (typeof column === "number") return column;
    return column.md ?? column.sm ?? column.xs ?? 3;
  });

  React.useEffect(() => {
    if (typeof column === "number") {
      setActiveColumn(column);
      return;
    }

    const calcColumn = () => {
      const width = window.innerWidth;
      if (width >= DEFAULT_BREAKPOINTS.xxl && column.xxl !== undefined) return column.xxl;
      if (width >= DEFAULT_BREAKPOINTS.xl && column.xl !== undefined) return column.xl;
      if (width >= DEFAULT_BREAKPOINTS.lg && column.lg !== undefined) return column.lg;
      if (width >= DEFAULT_BREAKPOINTS.md && column.md !== undefined) return column.md;
      if (width >= DEFAULT_BREAKPOINTS.sm && column.sm !== undefined) return column.sm;
      if (column.xs !== undefined) return column.xs;
      return column.md ?? 3;
    };

    const update = () => setActiveColumn(calcColumn());
    update();

    // a single shared listener would be nicer still, but the column map is
    // width-based rather than breakpoint-based, so this stays local — it is one
    // listener per Descriptions, released on unmount
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [column]);

  return activeColumn;
}

function getItemSpan(
  itemSpan: DescriptionsItemType["span"],
  remaining: number,
  _totalColumn: number
): number {
  if (itemSpan === "filled") {
    return remaining;
  }
  if (typeof itemSpan === "number") {
    return Math.min(itemSpan, remaining);
  }
  if (typeof itemSpan === "object" && itemSpan !== null) {
    const width = typeof window !== "undefined" ? window.innerWidth : 1024;
    let s: number | undefined;
    if (width >= DEFAULT_BREAKPOINTS.xxl && itemSpan.xxl !== undefined) s = itemSpan.xxl;
    else if (width >= DEFAULT_BREAKPOINTS.xl && itemSpan.xl !== undefined) s = itemSpan.xl;
    else if (width >= DEFAULT_BREAKPOINTS.lg && itemSpan.lg !== undefined) s = itemSpan.lg;
    else if (width >= DEFAULT_BREAKPOINTS.md && itemSpan.md !== undefined) s = itemSpan.md;
    else if (width >= DEFAULT_BREAKPOINTS.sm && itemSpan.sm !== undefined) s = itemSpan.sm;
    else if (itemSpan.xs !== undefined) s = itemSpan.xs;
    if (s !== undefined) return Math.min(s, remaining);
  }
  return 1;
}

interface ComputedRowItem {
  item: DescriptionsItemType;
  span: number;
}

function getRows(items: DescriptionsItemType[], columnCount: number): ComputedRowItem[][] {
  const rows: ComputedRowItem[][] = [];
  let currentRow: ComputedRowItem[] = [];
  let currentSpanSum = 0;

  items.forEach((item, index) => {
    const isLast = index === items.length - 1;
    const remaining = columnCount - currentSpanSum;
    let span = getItemSpan(item.span, remaining, columnCount);

    if (isLast && (item.span === undefined || item.span === "filled")) {
      span = remaining;
    }

    if (span <= 0) {
      // Start a new row
      rows.push(currentRow);
      currentRow = [];
      currentSpanSum = 0;
      span = getItemSpan(item.span, columnCount, columnCount);
    }

    currentRow.push({ item, span });
    currentSpanSum += span;

    if (currentSpanSum >= columnCount) {
      rows.push(currentRow);
      currentRow = [];
      currentSpanSum = 0;
    }
  });

  if (currentRow.length > 0) {
    // Fill the remaining gap of the last row
    const lastItem = currentRow[currentRow.length - 1];
    const remaining = columnCount - currentSpanSum;
    if (remaining > 0) {
      lastItem.span += remaining;
    }
    rows.push(currentRow);
  }

  return rows;
}

function Descriptions({
  title,
  extra,
  bordered = false,
  column = 3,
  size = "default",
  layout = "horizontal",
  colon = true,
  labelStyle,
  contentStyle,
  items: itemsProp,
  classNames,
  styles,
  className,
  style,
  children,
  ...props
}: DescriptionsProps) {
  const activeColumns = useResponsiveColumn(column);

  // Extract items from children if not provided in itemsProp
  const mergedItems = React.useMemo<DescriptionsItemType[]>(() => {
    if (itemsProp) return itemsProp;
    const list: DescriptionsItemType[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement<DescriptionsItemProps>(child)) {
        list.push({
          key: child.key ?? undefined,
          label: child.props.label,
          children: child.props.children,
          span: child.props.span,
          className: child.props.className,
          style: child.props.style,
          labelStyle: child.props.labelStyle,
          contentStyle: child.props.contentStyle,
        });
      }
    });
    return list;
  }, [itemsProp, children]);

  const rows = React.useMemo(() => {
    return getRows(mergedItems, activeColumns);
  }, [mergedItems, activeColumns]);

  const hasHeader = title != null || extra != null;

  // Cell padding based on size
  const borderedCellPadding =
    size === "small"
      ? "py-2 px-3 text-xs"
      : size === "middle"
      ? "py-3 px-4 text-sm"
      : "py-4 px-6 text-sm";

  return (
    <div
      data-slot="descriptions"
      data-bordered={bordered || undefined}
      data-size={size}
      style={{ ...styles?.root, ...style }}
      className={cn("w-full text-text text-sm", classNames?.root, className)}
      {...props}
    >
      {/* Header */}
      {hasHeader && (
        <div
          data-slot="descriptions-header"
          style={styles?.header}
          className={cn(
            "flex items-center justify-between mb-5",
            classNames?.header
          )}
        >
          {title != null && (
            <div
              data-slot="descriptions-title"
              style={styles?.title}
              className={cn(
                "text-base font-semibold text-text-heading truncate",
                classNames?.title
              )}
            >
              {title}
            </div>
          )}
          {extra != null && (
            <div
              data-slot="descriptions-extra"
              style={styles?.extra}
              className={cn("text-sm text-text", classNames?.extra)}
            >
              {extra}
            </div>
          )}
        </div>
      )}

      {/* Bordered Table View */}
      {bordered ? (
        <div
          className={cn(
            "w-full overflow-hidden rounded-lg border border-border-secondary bg-bg-container"
          )}
        >
          <table className="w-full border-collapse">
            <tbody>
              {rows.map((row, rowIndex) => {
                if (layout === "vertical") {
                  return (
                    <React.Fragment key={rowIndex}>
                      {/* Label Row */}
                      <tr className="border-b border-border-secondary bg-fill-alter">
                        {row.map(({ item, span }, colIndex) => (
                          <th
                            key={item.key ?? colIndex}
                            colSpan={span}
                            style={{ ...labelStyle, ...styles?.label, ...item.labelStyle }}
                            className={cn(
                              "text-left font-medium text-text-secondary border-r border-border-secondary last:border-r-0",
                              borderedCellPadding,
                              classNames?.label,
                              item.className
                            )}
                          >
                            {item.label}
                          </th>
                        ))}
                      </tr>
                      {/* Content Row */}
                      <tr
                        className={cn(
                          "border-b border-border-secondary last:border-b-0"
                        )}
                      >
                        {row.map(({ item, span }, colIndex) => (
                          <td
                            key={item.key ?? colIndex}
                            colSpan={span}
                            style={{ ...contentStyle, ...styles?.content, ...item.contentStyle }}
                            className={cn(
                              "text-left font-normal text-text border-r border-border-secondary last:border-r-0",
                              borderedCellPadding,
                              classNames?.content
                            )}
                          >
                            {item.children}
                          </td>
                        ))}
                      </tr>
                    </React.Fragment>
                  );
                }

                // Horizontal bordered
                return (
                  <tr
                    key={rowIndex}
                    className="border-b border-border-secondary last:border-b-0"
                  >
                    {row.map(({ item, span }, colIndex) => (
                      <React.Fragment key={item.key ?? colIndex}>
                        <th
                          style={{ ...labelStyle, ...styles?.label, ...item.labelStyle }}
                          className={cn(
                            "bg-fill-alter text-left font-medium text-text-secondary border-r border-border-secondary",
                            borderedCellPadding,
                            classNames?.label,
                            item.className
                          )}
                        >
                          {item.label}
                        </th>
                        <td
                          colSpan={span * 2 - 1}
                          style={{ ...contentStyle, ...styles?.content, ...item.contentStyle }}
                          className={cn(
                            "text-left font-normal text-text border-r border-border-secondary last:border-r-0",
                            borderedCellPadding,
                            classNames?.content
                          )}
                        >
                          {item.children}
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Non-Bordered Flex / Grid View */
        <div className="w-full space-y-4">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-wrap items-start -mx-3">
              {row.map(({ item, span }, colIndex) => {
                const widthPercent = (span / activeColumns) * 100;
                return (
                  <div
                    key={item.key ?? colIndex}
                    style={{
                      width: `${widthPercent}%`,
                      ...item.style,
                    }}
                    className={cn(
                      "px-3 pb-2 min-w-0",
                      layout === "vertical" ? "flex flex-col" : "flex items-baseline",
                      item.className
                    )}
                  >
                    {item.label != null && (
                      <div
                        data-slot="descriptions-item-label"
                        style={{ ...labelStyle, ...styles?.label, ...item.labelStyle }}
                        className={cn(
                          "shrink-0 text-text-tertiary font-normal",
                          layout === "vertical" ? "mb-1" : "mr-2",
                          classNames?.label
                        )}
                      >
                        {item.label}
                        {colon && layout === "horizontal" && ":"}
                      </div>
                    )}
                    <div
                      data-slot="descriptions-item-content"
                      style={{ ...contentStyle, ...styles?.content, ...item.contentStyle }}
                      className={cn(
                        "flex-1 min-w-0 text-text break-words font-normal",
                        classNames?.content
                      )}
                    >
                      {item.children}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

Descriptions.Item = DescriptionsItem;

export { Descriptions, DescriptionsItem };
