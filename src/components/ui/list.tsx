import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBreakpoint, type Breakpoint } from "@/hooks/use-breakpoint";
import { Pagination, type PaginationProps } from "@/components/ui/pagination";

export type ListItemLayout = "horizontal" | "vertical";
export type ListSize = "small" | "default" | "large";

export interface ListGridType {
  gutter?: number;
  column?: number;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
}

export interface ListLocale {
  emptyText?: React.ReactNode;
}

export interface ListPaginationConfig extends Omit<PaginationProps, "position"> {
  position?: "top" | "bottom" | "both";
  align?: "start" | "center" | "end";
}

export interface ListProps<T = unknown>
  extends Omit<React.ComponentProps<"div">, "children"> {
  dataSource?: T[];
  renderItem?: (item: T, index: number) => React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  bordered?: boolean;
  split?: boolean;
  size?: ListSize;
  loading?: boolean | { spinning?: boolean; indicator?: React.ReactNode; tip?: React.ReactNode };
  loadMore?: React.ReactNode;
  pagination?: boolean | ListPaginationConfig;
  grid?: ListGridType;
  itemLayout?: ListItemLayout;
  locale?: ListLocale;
  rowKey?: ((item: T) => string | number) | keyof T;
  children?: React.ReactNode;
}

export interface ListItemProps extends React.ComponentProps<"li"> {
  actions?: React.ReactNode[];
  extra?: React.ReactNode;
  colStyle?: React.CSSProperties;
}

export interface ListItemMetaProps extends Omit<React.ComponentProps<"div">, "title"> {
  avatar?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

interface ListContextValue {
  itemLayout?: ListItemLayout;
  size?: ListSize;
  bordered?: boolean;
  grid?: ListGridType;
}

const ListContext = React.createContext<ListContextValue>({});

function ListItemMeta({
  avatar,
  title,
  description,
  className,
  ...props
}: ListItemMetaProps) {
  return (
    <div
      data-slot="list-item-meta"
      className={cn("flex flex-1 items-start gap-4 min-w-0", className)}
      {...props}
    >
      {avatar && <div className="shrink-0">{avatar}</div>}
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="mb-1 text-sm font-semibold text-text-heading leading-snug">
            {title}
          </h4>
        )}
        {description && (
          <div className="text-sm text-text-description leading-normal">
            {description}
          </div>
        )}
      </div>
    </div>
  );
}

function ListItem({
  actions,
  extra,
  colStyle,
  className,
  style,
  children,
  ...props
}: ListItemProps) {
  const { itemLayout = "horizontal", size = "default", bordered = false, grid } =
    React.useContext(ListContext);

  const paddingClass =
    size === "small"
      ? bordered ? "py-2 px-4" : "py-2 px-0"
      : size === "large"
      ? bordered ? "py-4 px-6" : "py-4 px-0"
      : bordered ? "py-3 px-6" : "py-3 px-0";

  const actionsNode = actions && actions.length > 0 && (
    <ul
      data-slot="list-item-actions"
      className={cn(
        "flex shrink-0 items-center text-sm text-text-tertiary",
        itemLayout === "vertical" ? "mt-4" : "ml-4"
      )}
    >
      {actions.map((act, i) => (
        <li
          key={i}
          className="inline-flex items-center gap-1 transition-colors hover:text-text [&:not(:last-child)]:after:mx-2 [&:not(:last-child)]:after:inline-block [&:not(:last-child)]:after:h-3.5 [&:not(:last-child)]:after:w-px [&:not(:last-child)]:after:bg-border-secondary"
        >
          {act}
        </li>
      ))}
    </ul>
  );

  if (grid) {
    return (
      <div
        data-slot="list-item"
        style={{ ...colStyle, ...style }}
        className={cn("flex min-w-0 flex-col", className)}
        {...(props as React.HTMLAttributes<HTMLDivElement>)}
      >
        {children}
        {extra && (
          <div data-slot="list-item-extra" className="mt-2">
            {extra}
          </div>
        )}
        {actionsNode}
      </div>
    );
  }

  if (itemLayout === "vertical") {
    return (
      <li
        data-slot="list-item"
        style={style}
        className={cn(
          "flex flex-col md:flex-row items-start justify-between gap-6 transition-colors",
          paddingClass,
          className
        )}
        {...props}
      >
        <div className="flex-1 min-w-0 w-full">
          {children}
          {actionsNode}
        </div>
        {extra && (
          <div data-slot="list-item-extra" className="shrink-0 self-center md:self-start">
            {extra}
          </div>
        )}
      </li>
    );
  }

  return (
    <li
      data-slot="list-item"
      style={style}
      className={cn(
        "flex items-center justify-between gap-4 transition-colors",
        paddingClass,
        className
      )}
      {...props}
    >
      <div className="flex flex-1 items-center gap-4 min-w-0">{children}</div>
      {actionsNode}
      {extra && (
        <div data-slot="list-item-extra" className="shrink-0">
          {extra}
        </div>
      )}
    </li>
  );
}

/** Viewport widths the grid breakpoints switch on, largest first. */
const GRID_BREAKPOINTS: [keyof ListGridType, number][] = [
  ["xxl", 1600],
  ["xl", 1200],
  ["lg", 992],
  ["md", 768],
  ["sm", 576],
  ["xs", 0],
];

/**
 * Column counts cannot be Tailwind classes: `grid-cols-${n}` is a string the
 * compiler never sees, so nothing is generated for it. The grid is sized inline
 * from the current viewport instead.
 */
function useGridColumns(grid?: ListGridType): number {
  // the shared breakpoint store, so a page of lists does not add a resize
  // listener each
  const screens = useBreakpoint();
  if (!grid) return 1;
  for (const [key] of GRID_BREAKPOINTS) {
    const value = grid[key] as number | undefined;
    if (value && screens[key as Breakpoint]) return value;
  }
  return grid.column ?? 1;
}

function gridStyle(grid: ListGridType, columns: number): React.CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: `repeat(${Math.max(1, columns)}, minmax(0, 1fr))`,
    gap: grid.gutter ?? 16,
  };
}

function List<T = unknown>({
  dataSource,
  renderItem,
  header,
  footer,
  bordered = false,
  split = true,
  size = "default",
  loading = false,
  loadMore,
  pagination = false,
  grid,
  itemLayout = "horizontal",
  locale,
  rowKey,
  children,
  className,
  style,
  ...props
}: ListProps<T>) {
  const isLoading = typeof loading === "object" ? !!loading.spinning : !!loading;
  const loadingIndicator =
    typeof loading === "object" && loading.indicator ? (
      loading.indicator
    ) : (
      <Loader2 className="size-6 animate-spin text-primary" />
    );
  const loadingTip = typeof loading === "object" ? loading.tip : null;

  // Pagination state
  const isPaginationEnabled = !!pagination;
  const paginationConfig: ListPaginationConfig = typeof pagination === "object" ? pagination : {};
  const [innerPage, setInnerPage] = React.useState(paginationConfig.defaultCurrent ?? 1);
  const [innerPageSize, setInnerPageSize] = React.useState(paginationConfig.defaultPageSize ?? 10);

  const currentPage = paginationConfig.current ?? innerPage;
  const pageSize = paginationConfig.pageSize ?? innerPageSize;
  const total = paginationConfig.total ?? (dataSource ? dataSource.length : 0);

  const paginationPosition = paginationConfig.position ?? "bottom";
  const paginationAlign = paginationConfig.align ?? "end";

  // Paginated items
  const paginatedData = React.useMemo(() => {
    if (!dataSource) return [];
    if (!isPaginationEnabled || paginationConfig.total !== undefined) {
      // server-side or no pagination
      return dataSource;
    }
    const start = (currentPage - 1) * pageSize;
    return dataSource.slice(start, start + pageSize);
  }, [dataSource, isPaginationEnabled, paginationConfig.total, currentPage, pageSize]);

  const ctxValue = React.useMemo<ListContextValue>(
    () => ({ itemLayout, size, bordered, grid }),
    [itemLayout, size, bordered, grid]
  );

  const headerFooterPadding =
    size === "small"
      ? bordered ? "py-2 px-4" : "py-2 px-0"
      : size === "large"
      ? bordered ? "py-4 px-6" : "py-4 px-0"
      : bordered ? "py-3 px-6" : "py-3 px-0";

  const renderPagination = () => {
    if (!isPaginationEnabled) return null;
    return (
      <div
        data-slot="list-pagination"
        className={cn(
          "flex py-4",
          paginationAlign === "start"
            ? "justify-start"
            : paginationAlign === "center"
            ? "justify-center"
            : "justify-end"
        )}
      >
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={(page, size) => {
            if (paginationConfig.current === undefined) setInnerPage(page);
            if (paginationConfig.pageSize === undefined) setInnerPageSize(size);
            paginationConfig.onChange?.(page, size);
          }}
          {...paginationConfig}
        />
      </div>
    );
  };

  const showTopPagination =
    isPaginationEnabled && (paginationPosition === "top" || paginationPosition === "both");
  const showBottomPagination =
    isPaginationEnabled && (paginationPosition === "bottom" || paginationPosition === "both");

  const getItemKey = (item: T, index: number): string | number => {
    if (typeof rowKey === "function") return rowKey(item);
    if (rowKey && typeof item === "object" && item !== null) {
      return (item as Record<string, unknown>)[rowKey as string] as string | number;
    }
    if (typeof item === "object" && item !== null && "key" in item) {
      return (item as { key: string | number }).key;
    }
    return index;
  };

  const gridColumns = useGridColumns(grid);

  let content: React.ReactNode = null;

  if (dataSource && renderItem) {
    if (paginatedData.length === 0) {
      content = (
        <div className="py-8 text-center text-sm text-text-quaternary">
          {locale?.emptyText ?? "No Data"}
        </div>
      );
    } else if (grid) {
      // Grid container
      content = (
        <div data-slot="list-grid" style={gridStyle(grid, gridColumns)}>
          {paginatedData.map((item, index) => (
            <React.Fragment key={getItemKey(item, index)}>
              {renderItem(item, index)}
            </React.Fragment>
          ))}
        </div>
      );
    } else {
      content = (
        <ul
          data-slot="list-items"
          className={cn(
            split && "[&>li:not(:last-child)]:border-b [&>li:not(:last-child)]:border-border-secondary"
          )}
        >
          {paginatedData.map((item, index) => (
            <React.Fragment key={getItemKey(item, index)}>
              {renderItem(item, index)}
            </React.Fragment>
          ))}
        </ul>
      );
    }
  } else {
    content = grid ? (
      <div data-slot="list-grid" style={gridStyle(grid, gridColumns)}>
        {children}
      </div>
    ) : (
      <ul
        data-slot="list-items"
        className={cn(
          split && "[&>li:not(:last-child)]:border-b [&>li:not(:last-child)]:border-border-secondary"
        )}
      >
        {children}
      </ul>
    );
  }

  return (
    <ListContext.Provider value={ctxValue}>
      <div
        data-slot="list"
        data-bordered={bordered || undefined}
        data-size={size}
        style={style}
        className={cn(
          "relative text-sm text-text transition-colors",
          bordered && "rounded-lg border border-border bg-bg-container",
          className
        )}
        {...props}
      >
        {/* Top pagination */}
        {showTopPagination && renderPagination()}

        {/* Header */}
        {header && (
          <div
            data-slot="list-header"
            className={cn(
              "font-medium text-text-heading",
              bordered && "border-b border-border-secondary",
              headerFooterPadding
            )}
          >
            {header}
          </div>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-bg-container/60 backdrop-blur-[1px]">
            {loadingIndicator}
            {loadingTip && <span className="mt-2 text-xs text-text-secondary">{loadingTip}</span>}
          </div>
        )}

        {/* Body content */}
        <div data-slot="list-body" className={cn(bordered && !grid ? "" : "")}>
          {content}
        </div>

        {/* Load More */}
        {loadMore && (
          <div data-slot="list-load-more" className="py-3 text-center">
            {loadMore}
          </div>
        )}

        {/* Footer */}
        {footer && (
          <div
            data-slot="list-footer"
            className={cn(
              "text-text-secondary",
              bordered && "border-t border-border-secondary",
              headerFooterPadding
            )}
          >
            {footer}
          </div>
        )}

        {/* Bottom pagination */}
        {showBottomPagination && renderPagination()}
      </div>
    </ListContext.Provider>
  );
}

ListItem.Meta = ListItemMeta;
List.Item = ListItem;

export { List, ListItem, ListItemMeta };
