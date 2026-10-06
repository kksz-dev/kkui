import * as React from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ChevronsUpDown,
  Filter,
  Loader2,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Radio } from "@/components/ui/radio";
import { Pagination, type PaginationProps } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Portal } from "@/components/ui/portal";
import { Tooltip } from "@/components/ui/tooltip";
import { Dropdown, type DropdownItemType } from "@/components/ui/dropdown";
import { Empty, EMPTY_IMAGE_SIMPLE } from "@/components/ui/empty";
import { useClickOutside } from "@/hooks/use-click-outside";
import { computeFloatingPosition, measureFloating } from "@/lib/floating-position";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type TableSize = "sm" | "md" | "lg";
export type SortOrder = "ascend" | "descend" | null;
export type SortDirection = "ascend" | "descend";
export type ColumnAlign = "left" | "center" | "right";
export type FixedSide = "left" | "right";
export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
/** A single value inside `column.filters` / the active filter list. */
export type FilterValue = React.Key | boolean;

export interface FilterItem {
  text: React.ReactNode;
  value: FilterValue;
  /** Sub items — rendered as a tree when `column.filterMode = "tree"`. */
  children?: FilterItem[];
}

export interface FilterDropdownRenderProps {
  selectedKeys: FilterValue[];
  setSelectedKeys: (keys: FilterValue[]) => void;
  confirm: (param?: { closeDropdown?: boolean }) => void;
  clearFilters: () => void;
  filters?: FilterItem[];
  close: () => void;
  visible: boolean;
}

export interface ColumnTitleProps<T = any> {
  sortOrder?: SortOrder;
  sortColumn?: ColumnType<T>;
  filters?: Record<string, FilterValue[] | null>;
}

/** Extra DOM props merged into a body cell (`onCell`). */
export type CellExtraProps = React.TdHTMLAttributes<HTMLTableCellElement> & {
  [key: string]: unknown;
};
/** Extra DOM props merged into a header cell (`onHeaderCell`). */
export type HeaderCellExtraProps = React.ThHTMLAttributes<HTMLTableCellElement> & {
  [key: string]: unknown;
};

/** `render` may return a node, or a node plus cell-merge props. */
export interface RenderedCell {
  children?: React.ReactNode;
  props?: { colSpan?: number; rowSpan?: number };
}
export type CellRenderResult = React.ReactNode | RenderedCell;

export interface ColumnType<T = any> {
  /** Unique id of the column. Falls back to `dataIndex`, then to the column position. */
  key?: React.Key;
  /** Field in the record — supports a path array for nested values. */
  dataIndex?: keyof T | string | readonly (string | number)[];
  title: React.ReactNode | ((props: ColumnTitleProps<T>) => React.ReactNode);
  render?: (value: any, record: T, index: number) => CellRenderResult;
  width?: number | string;
  minWidth?: number;
  align?: ColumnAlign;
  /** `true` = sort by `dataIndex`, or a compare function. */
  sorter?: boolean | ((a: T, b: T) => number);
  /** Controlled sort order of this column. */
  sortOrder?: SortOrder;
  defaultSortOrder?: SortOrder;
  /** Cycle of orders for this column, e.g. `["descend", "ascend"]`. */
  sortDirections?: SortDirection[];
  showSorterTooltip?: boolean | { title?: React.ReactNode };
  filters?: FilterItem[];
  onFilter?: (value: FilterValue, record: T) => boolean;
  filterMultiple?: boolean;
  filterSearch?: boolean | ((input: string, item: FilterItem) => boolean);
  /** Controlled filter value — `null` clears it. */
  filteredValue?: FilterValue[] | null;
  defaultFilteredValue?: FilterValue[];
  filterMode?: "menu" | "tree";
  /** Reset restores `defaultFilteredValue` instead of clearing. */
  filterResetToDefaultFilteredValue?: boolean;
  filterDropdown?: React.ReactNode | ((props: FilterDropdownRenderProps) => React.ReactNode);
  filterDropdownProps?: {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
    style?: React.CSSProperties;
  };
  filterIcon?: React.ReactNode | ((filtered: boolean) => React.ReactNode);
  ellipsis?: boolean | { showTitle?: boolean };
  fixed?: FixedSide;
  /** Header cell colSpan. `0` hides the header cell (merged into its neighbour). */
  colSpan?: number;
  /** Render body cells of this column as `<th scope="…">`. */
  rowScope?: "row" | "rowgroup";
  /** Only render the column while one of these breakpoints matches. */
  responsive?: Breakpoint[];
  onCell?: (record: T, index: number) => CellExtraProps;
  onHeaderCell?: (column: ColumnType<T>) => HeaderCellExtraProps;
  /** Skip re-rendering the cell when this returns `false`. */
  shouldCellUpdate?: (record: T, prevRecord: T) => boolean;
  /** Group header — nested columns. */
  children?: ColumnType<T>[];
  className?: string;
}

export type SelectionSelectFn = (changeableRowKeys: React.Key[]) => void;
export interface SelectionItem {
  key: string;
  text: React.ReactNode;
  onSelect?: SelectionSelectFn;
}
export type SelectionsType = boolean | (SelectionItem | string)[];
export type SelectionChangeType = "all" | "none" | "invert" | "single" | "multiple";

export interface TableRowSelection<T = any> {
  type?: "checkbox" | "radio";
  selectedRowKeys?: React.Key[];
  defaultSelectedRowKeys?: React.Key[];
  onChange?: (
    selectedRowKeys: React.Key[],
    selectedRows: T[],
    info: { type: SelectionChangeType },
  ) => void;
  getCheckboxProps?: (record: T) => { disabled?: boolean; name?: string };
  /** `true` shows the default all / invert / none menu, or pass your own items. */
  selections?: SelectionsType;
  hideSelectAll?: boolean;
  onSelect?: (record: T, selected: boolean, selectedRows: T[]) => void;
  onSelectAll?: (selected: boolean, selectedRows: T[], changeRows: T[]) => void;
  onSelectNone?: () => void;
  onSelectInvert?: (selectedRowKeys: React.Key[]) => void;
  /** Keep keys of records that are no longer in `dataSource` (e.g. server paging). */
  preserveSelectedRowKeys?: boolean;
  /** `false` links parent and children checkboxes in tree data. */
  checkStrictly?: boolean;
  columnWidth?: number | string;
  columnTitle?: React.ReactNode | ((originalNode: React.ReactNode) => React.ReactNode);
  fixed?: boolean | FixedSide;
  renderCell?: (
    checked: boolean,
    record: T,
    index: number,
    originNode: React.ReactNode,
  ) => React.ReactNode;
}

export interface ExpandIconProps<T = any> {
  expanded: boolean;
  expandable: boolean;
  record: T;
  onExpand: (record: T, e: React.MouseEvent) => void;
}

export interface TableExpandable<T = any> {
  expandedRowRender?: (record: T, index: number, indent: number, expanded: boolean) => React.ReactNode;
  rowExpandable?: (record: T) => boolean;
  /** Controlled expanded keys. */
  expandedRowKeys?: React.Key[];
  defaultExpandedRowKeys?: React.Key[];
  defaultExpandAllRows?: boolean;
  onExpand?: (expanded: boolean, record: T) => void;
  onExpandedRowsChange?: (expandedKeys: React.Key[]) => void;
  expandIcon?: (props: ExpandIconProps<T>) => React.ReactNode;
  indentSize?: number;
  expandRowByClick?: boolean;
  expandedRowClassName?: string | ((record: T, index: number, indent: number) => string);
  columnWidth?: number | string;
  fixed?: boolean | FixedSide;
  /** `false` hides the expand column (drive it from your own trigger). */
  showExpandColumn?: boolean;
  /** Field holding tree children. Default `"children"`. */
  childrenColumnName?: string;
}

export type PaginationPosition =
  | "topLeft"
  | "topCenter"
  | "topRight"
  | "bottomLeft"
  | "bottomCenter"
  | "bottomRight";

export interface TablePaginationConfig extends PaginationProps {
  position?: PaginationPosition[];
}

export interface SorterResult<T = any> {
  column?: ColumnType<T>;
  order?: SortOrder;
  field?: React.Key;
  columnKey?: React.Key;
}

export interface TableCurrentDataSource<T = any> {
  currentDataSource: T[];
  action: "paginate" | "sort" | "filter";
}

export interface TableLocale {
  filterTitle?: string;
  filterConfirm?: React.ReactNode;
  filterReset?: React.ReactNode;
  filterEmptyText?: React.ReactNode;
  filterCheckAll?: React.ReactNode;
  filterSearchPlaceholder?: string;
  emptyText?: React.ReactNode | (() => React.ReactNode);
  selectAll?: React.ReactNode;
  selectNone?: React.ReactNode;
  selectInvert?: React.ReactNode;
  sortTitle?: string;
  triggerAsc?: string;
  triggerDesc?: string;
  cancelSort?: string;
  expand?: string;
  collapse?: string;
}

export interface TableComponents {
  table?: React.ElementType;
  header?: { wrapper?: React.ElementType; row?: React.ElementType; cell?: React.ElementType };
  body?: { wrapper?: React.ElementType; row?: React.ElementType; cell?: React.ElementType };
}

export interface TableProps<T = any> {
  columns?: ColumnType<T>[];
  /** `<Table.Column />` / `<Table.ColumnGroup />` children — used when `columns` is omitted. */
  children?: React.ReactNode;
  dataSource?: T[];
  rowKey?: string | ((record: T) => React.Key);
  loading?: boolean | { spinning?: boolean; tip?: React.ReactNode };
  pagination?: false | TablePaginationConfig;
  bordered?: boolean;
  size?: TableSize;
  rowSelection?: TableRowSelection<T>;
  expandable?: TableExpandable<T>;
  /** Must return `<Table.Summary>` (it renders the `<tfoot>`). */
  summary?: (currentData: readonly T[]) => React.ReactNode;
  title?: (currentData: readonly T[]) => React.ReactNode;
  footer?: (currentData: readonly T[]) => React.ReactNode;
  scroll?: { x?: number | string | true; y?: number | string };
  /** Sticky header while the page scrolls. */
  sticky?: boolean | { offsetHeader?: number };
  /** Windowed rendering — needs a numeric `scroll.y`. */
  virtual?: boolean;
  showHeader?: boolean;
  rowClassName?: string | ((record: T, index: number, indent: number) => string);
  components?: TableComponents;
  tableLayout?: "auto" | "fixed";
  locale?: TableLocale;
  showSorterTooltip?: boolean | { title?: React.ReactNode };
  sortDirections?: SortDirection[];
  rowHoverable?: boolean;
  caption?: React.ReactNode;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  onChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue[] | null>,
    sorter: SorterResult<T>,
    extra: TableCurrentDataSource<T>,
  ) => void;
  onRow?: (record: T, index: number) => React.HTMLAttributes<HTMLTableRowElement>;
  onHeaderRow?: (columns: ColumnType<T>[], index: number) => React.HTMLAttributes<HTMLTableRowElement>;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

/* ------------------------------------------------------------------ */
/* Constants & helpers                                                 */
/* ------------------------------------------------------------------ */

const SELECTION_COLUMN_KEY = "__KKUI_SELECTION_COLUMN__";
const EXPAND_COLUMN_KEY = "__KKUI_EXPAND_COLUMN__";
const SELECTION_ALL = "KKUI_SELECT_ALL";
const SELECTION_INVERT = "KKUI_SELECT_INVERT";
const SELECTION_NONE = "KKUI_SELECT_NONE";

/** Place the selection column at an explicit position inside `columns`. */
const SELECTION_COLUMN: ColumnType<any> = { key: SELECTION_COLUMN_KEY, title: "" };
/** Place the expand column at an explicit position inside `columns`. */
const EXPAND_COLUMN: ColumnType<any> = { key: EXPAND_COLUMN_KEY, title: "" };

const DEFAULT_LOCALE: Required<Omit<TableLocale, "emptyText">> & { emptyText?: TableLocale["emptyText"] } = {
  filterTitle: "Filter menu",
  filterConfirm: "OK",
  filterReset: "Reset",
  filterEmptyText: "No filters",
  filterCheckAll: "Select all items",
  filterSearchPlaceholder: "Search in filters",
  selectAll: "Select all data",
  selectNone: "Clear all data",
  selectInvert: "Invert current page",
  sortTitle: "Sort",
  triggerAsc: "Click to sort ascending",
  triggerDesc: "Click to sort descending",
  cancelSort: "Click to cancel sorting",
  expand: "Expand row",
  collapse: "Collapse row",
};

const CELL_PAD: Record<TableSize, string> = {
  sm: "px-3 py-2 text-xs",
  md: "px-4 py-3 text-sm",
  lg: "px-4 py-4 text-base",
};
/** Virtual rows get an exact height, so vertical padding is dropped. */
const CELL_PAD_X: Record<TableSize, string> = {
  sm: "px-3 text-xs",
  md: "px-4 text-sm",
  lg: "px-4 text-base",
};
const VIRTUAL_ROW_HEIGHT: Record<TableSize, number> = { sm: 37, md: 49, lg: 57 };
/** Used to stack sticky header rows of grouped columns. */
const HEADER_ROW_HEIGHT: Record<TableSize, number> = { sm: 33, md: 41, lg: 49 };
const VIRTUAL_OVERSCAN = 6;
/** `scroll.y` tables switch to windowed rendering past this many rows. */
const VIRTUAL_AUTO_THRESHOLD = 100;
const DEFAULT_COL_WIDTH = 120;
const DEFAULT_CONTROL_COL_WIDTH = 48;

const BREAKPOINTS: Breakpoint[] = ["xs", "sm", "md", "lg", "xl", "xxl"];
const BREAKPOINT_QUERY: Record<Breakpoint, string> = {
  xs: "(max-width: 575px)",
  sm: "(min-width: 576px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 992px)",
  xl: "(min-width: 1200px)",
  xxl: "(min-width: 1600px)",
};

function readScreens(): Record<Breakpoint, boolean> {
  const out = {} as Record<Breakpoint, boolean>;
  const canMatch = typeof window !== "undefined" && typeof window.matchMedia === "function";
  BREAKPOINTS.forEach((bp) => {
    out[bp] = canMatch ? window.matchMedia(BREAKPOINT_QUERY[bp]).matches : true;
  });
  return out;
}

/** Live breakpoint map for `column.responsive`, from the shared store. */
function useScreens(enabled: boolean): Record<Breakpoint, boolean> {
  const shared = useBreakpoint();
  return React.useMemo(() => {
    if (!enabled) return readScreens();
    const out = {} as Record<Breakpoint, boolean>;
    BREAKPOINTS.forEach((bp) => {
      out[bp] = shared[bp] ?? true;
    });
    return out;
  }, [enabled, shared]);
}

function getPathValue(record: any, path: ColumnType["dataIndex"]): any {
  if (record == null || path == null) return undefined;
  if (Array.isArray(path)) return path.reduce((acc, k) => (acc == null ? acc : acc[k]), record);
  return record[path as string];
}

function dataIndexToKey(dataIndex: ColumnType["dataIndex"]): string | undefined {
  if (dataIndex == null) return undefined;
  return Array.isArray(dataIndex) ? dataIndex.join(".") : String(dataIndex);
}

function isRenderedCell(value: CellRenderResult): value is RenderedCell {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !React.isValidElement(value) &&
    ("children" in value || "props" in value)
  );
}

function parseWidth(width: number | string | undefined, fallback: number): number {
  if (typeof width === "number") return width;
  if (typeof width === "string") {
    const n = Number.parseFloat(width);
    if (!Number.isNaN(n) && /px|^\d/.test(width)) return n;
  }
  return fallback;
}

const alignClass = (align?: ColumnAlign) =>
  align === "center" ? "text-center" : align === "right" ? "text-right" : undefined;

/* ------------------------------------------------------------------ */
/* Filter dropdown                                                     */
/* ------------------------------------------------------------------ */

interface FilterDropdownProps<T> {
  column: ColumnType<T>;
  /** Committed filter value of the column. */
  value: FilterValue[] | null;
  onCommit: (keys: FilterValue[]) => void;
  locale: typeof DEFAULT_LOCALE;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
}

function ColumnFilterDropdown<T>({ column, value, onCommit, locale, getPopupContainer }: FilterDropdownProps<T>) {
  const controlledOpen = column.filterDropdownProps?.open;
  const [innerOpen, setInnerOpen] = React.useState(false);
  const open = controlledOpen ?? innerOpen;
  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setInnerOpen(next);
    column.filterDropdownProps?.onOpenChange?.(next);
  };

  const committed = React.useMemo(() => value ?? [], [value]);
  const committedId = committed.map(String).join(" ");
  const committedRef = React.useRef(committed);
  committedRef.current = committed;
  const [selectedKeys, setSelectedKeys] = React.useState<FilterValue[]>(committed);
  const [searchText, setSearchText] = React.useState("");
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const popupRef = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState<{ top: number; left: number } | null>(null);

  // Re-seed the draft selection from the committed value every time it opens,
  // so the panel can never drift away from the table's filter state.
  React.useEffect(() => {
    setSelectedKeys(committedRef.current);
  }, [committedId, open]);

  useClickOutside(
    popupRef,
    (e) => {
      if (triggerRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    },
    open,
  );

  const container = React.useMemo(
    () => (open && triggerRef.current && getPopupContainer ? getPopupContainer(triggerRef.current) : undefined),
    [open, getPopupContainer],
  );

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current || !popupRef.current) return;
    const tRect = triggerRef.current.getBoundingClientRect();
    const cRect = measureFloating(popupRef.current);
    const next = computeFloatingPosition(tRect, cRect, "bottomRight", 4);
    if (container && container !== document.body) {
      const base = container.getBoundingClientRect();
      next.top -= base.top + window.scrollY - container.scrollTop;
      next.left -= base.left + window.scrollX - container.scrollLeft;
    }
    setPos(next);
  }, [container]);

  React.useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    const onMove = () => updatePosition();
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
  }, [open, updatePosition]);

  const isFiltered = committed.length > 0;
  const multiple = column.filterMultiple !== false;

  const confirm = (param?: { closeDropdown?: boolean }) => {
    onCommit(selectedKeys);
    if (param?.closeDropdown !== false) setOpen(false);
  };
  const clearFilters = () => {
    const next = column.filterResetToDefaultFilteredValue ? (column.defaultFilteredValue ?? []) : [];
    setSelectedKeys(next);
    onCommit(next);
    setOpen(false);
  };

  const matches = (item: FilterItem) => {
    if (!searchText.trim()) return true;
    if (typeof column.filterSearch === "function") return column.filterSearch(searchText, item);
    return String(item.text).toLowerCase().includes(searchText.toLowerCase());
  };

  const visibleFilters = React.useMemo(() => {
    const source = column.filters ?? [];
    if (!searchText.trim()) return source;
    const walk = (items: FilterItem[]): FilterItem[] =>
      items
        .map((item) => {
          const kids = item.children ? walk(item.children) : undefined;
          if (matches(item) || (kids && kids.length)) return { ...item, children: kids };
          return null;
        })
        .filter(Boolean) as FilterItem[];
    return walk(source);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [column.filters, searchText, column.filterSearch]);

  const flatValues = React.useMemo(() => {
    const out: FilterValue[] = [];
    const walk = (items: FilterItem[]) =>
      items.forEach((i) => {
        out.push(i.value);
        if (i.children) walk(i.children);
      });
    walk(column.filters ?? []);
    return out;
  }, [column.filters]);

  const toggleValue = (item: FilterItem, checked: boolean) => {
    const affected = [item.value];
    if (column.filterMode === "tree" && item.children) {
      const walk = (items: FilterItem[]) =>
        items.forEach((i) => {
          affected.push(i.value);
          if (i.children) walk(i.children);
        });
      walk(item.children);
    }
    if (!multiple) {
      setSelectedKeys(checked ? [item.value] : []);
      return;
    }
    setSelectedKeys((prev) =>
      checked ? Array.from(new Set([...prev, ...affected])) : prev.filter((k) => !affected.includes(k)),
    );
  };

  const renderItems = (items: FilterItem[], depth = 0): React.ReactNode =>
    items.map((item) => (
      <React.Fragment key={String(item.value)}>
        <label
          style={{ paddingLeft: 8 + depth * 16 }}
          className="flex cursor-pointer items-center gap-2 rounded-sm py-1 pr-2 text-xs transition-colors duration-fast hover:bg-fill-tertiary"
        >
          {multiple ? (
            <Checkbox
              checked={selectedKeys.includes(item.value)}
              onChange={(e) => toggleValue(item, e.target.checked)}
            />
          ) : (
            <Radio
              checked={selectedKeys.includes(item.value)}
              onChange={(e) => toggleValue(item, e.target.checked)}
            />
          )}
          <span className="text-text">{item.text}</span>
        </label>
        {item.children && item.children.length > 0 && renderItems(item.children, depth + 1)}
      </React.Fragment>
    ));

  const renderProps: FilterDropdownRenderProps = {
    selectedKeys,
    setSelectedKeys,
    confirm,
    clearFilters,
    filters: column.filters,
    close: () => setOpen(false),
    visible: open,
  };

  const icon =
    typeof column.filterIcon === "function"
      ? column.filterIcon(isFiltered)
      : (column.filterIcon ?? <Filter className="size-3" />);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={locale.filterTitle}
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className={cn(
          "ml-1 inline-flex items-center justify-center rounded-sm p-1 text-text-quaternary transition-colors duration-fast ease-kk-in-out hover:bg-fill-tertiary hover:text-text",
          (isFiltered || open) && "text-primary hover:text-primary-hover",
        )}
      >
        {icon}
      </button>

      {open && (
        <Portal container={container}>
          <div
            ref={popupRef}
            style={{
              position: "absolute",
              top: pos?.top ?? -9999,
              left: pos?.left ?? -9999,
              zIndex: 1050,
              ...column.filterDropdownProps?.style,
            }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "min-w-48 rounded-lg border border-border bg-bg-elevated p-2 text-left font-normal shadow-kk kk-in kk-in-up",
              column.filterDropdownProps?.className,
            )}
          >
            {column.filterDropdown ? (
              typeof column.filterDropdown === "function" ? (
                column.filterDropdown(renderProps)
              ) : (
                column.filterDropdown
              )
            ) : (
              <div className="space-y-2">
                {column.filterSearch && (
                  <Input
                    size="sm"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder={locale.filterSearchPlaceholder}
                    prefix={<Search className="size-3 text-text-quaternary" />}
                  />
                )}
                {column.filterMode === "tree" && multiple && flatValues.length > 0 && (
                  <label className="flex cursor-pointer items-center gap-2 rounded-sm border-b border-border-secondary px-2 pb-2 text-xs">
                    <Checkbox
                      checked={flatValues.length > 0 && flatValues.every((v) => selectedKeys.includes(v))}
                      indeterminate={
                        selectedKeys.length > 0 && !flatValues.every((v) => selectedKeys.includes(v))
                      }
                      onChange={(e) => setSelectedKeys(e.target.checked ? flatValues : [])}
                    />
                    <span className="text-text">{locale.filterCheckAll}</span>
                  </label>
                )}
                <div className="kk-scrollbar max-h-52 space-y-0.5 overflow-y-auto">
                  {visibleFilters.length === 0 ? (
                    <div className="px-2 py-4 text-center text-xs text-text-tertiary">
                      {locale.filterEmptyText}
                    </div>
                  ) : (
                    renderItems(visibleFilters)
                  )}
                </div>
                <div className="flex items-center justify-between border-t border-border-secondary pt-2">
                  <Button
                    size="sm"
                    type="link"
                    disabled={selectedKeys.length === 0 && !column.filterResetToDefaultFilteredValue}
                    onClick={clearFilters}
                    className="h-6 px-1 text-[11px]"
                  >
                    {locale.filterReset}
                  </Button>
                  <Button size="sm" type="primary" onClick={() => confirm()} className="h-6 px-2 text-[11px]">
                    {locale.filterConfirm}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Portal>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Body cell (memoised for `shouldCellUpdate`)                          */
/* ------------------------------------------------------------------ */

interface BodyCellProps {
  as: React.ElementType;
  record: any;
  className?: string;
  style?: React.CSSProperties;
  cellProps?: CellExtraProps;
  title?: string;
  scope?: "row" | "rowgroup";
  colSpan?: number;
  rowSpan?: number;
  shouldCellUpdate?: (record: any, prevRecord: any) => boolean;
  children?: React.ReactNode;
}

const BodyCell = React.memo(
  function BodyCell({
    as: Cell,
    record: _record,
    className,
    style,
    cellProps,
    title,
    scope,
    colSpan,
    rowSpan,
    shouldCellUpdate: _shouldCellUpdate,
    children,
  }: BodyCellProps) {
    return (
      <Cell className={className} style={style} title={title} scope={scope} colSpan={colSpan} rowSpan={rowSpan} {...cellProps}>
        {children}
      </Cell>
    );
  },
  (prev, next) => (next.shouldCellUpdate ? !next.shouldCellUpdate(next.record, prev.record) : false),
);

/* ------------------------------------------------------------------ */
/* Internal row/column models                                          */
/* ------------------------------------------------------------------ */

interface LeafColumn<T> {
  kind: "data" | "selection" | "expand";
  colKey: React.Key;
  column?: ColumnType<T>;
  width?: number | string;
  fixed?: FixedSide;
  left?: number;
  right?: number;
}

interface HeaderCellDef<T> {
  cellKey: React.Key;
  kind: "data" | "group" | "selection" | "expand";
  column?: ColumnType<T>;
  leaf?: LeafColumn<T>;
  colSpan: number;
  rowSpan: number;
  start: number;
  count: number;
  fixed?: FixedSide;
  left?: number;
  right?: number;
}

type FlatRow<T> =
  | {
      kind: "row";
      key: React.Key;
      record: T;
      index: number;
      indent: number;
      expanded: boolean;
      hasChildren: boolean;
      canExpand: boolean;
    }
  | { kind: "expanded"; key: React.Key; record: T; index: number; indent: number };

interface SortState {
  colKey: React.Key;
  order: SortOrder;
}

/* ------------------------------------------------------------------ */
/* Table                                                               */
/* ------------------------------------------------------------------ */

export function Table<T extends Record<string, any> = Record<string, any>>({
  columns: columnsProp,
  children,
  dataSource = [],
  rowKey = "key",
  loading = false,
  pagination = {},
  bordered = false,
  size = "md",
  rowSelection,
  expandable,
  summary,
  title,
  footer,
  scroll,
  sticky = false,
  virtual = false,
  showHeader = true,
  rowClassName,
  components,
  tableLayout,
  locale: localeProp,
  showSorterTooltip = true,
  sortDirections = ["ascend", "descend"],
  rowHoverable = true,
  caption,
  getPopupContainer,
  onChange,
  onRow,
  onHeaderRow,
  className,
  style,
  id,
}: TableProps<T>) {
  const locale = React.useMemo(() => ({ ...DEFAULT_LOCALE, ...localeProp }), [localeProp]);
  const childrenColumnName = expandable?.childrenColumnName ?? "children";

  const TableTag = components?.table ?? "table";
  const HeaderWrapper = components?.header?.wrapper ?? "thead";
  const HeaderRow = components?.header?.row ?? "tr";
  const HeaderCell = components?.header?.cell ?? "th";
  const BodyWrapper = components?.body?.wrapper ?? "tbody";
  const BodyRow = components?.body?.row ?? "tr";
  const BodyCellTag = components?.body?.cell ?? "td";

  const getRowKey = React.useCallback(
    (record: T, index: number): React.Key => {
      if (typeof rowKey === "function") return rowKey(record);
      return (record[rowKey] as React.Key) ?? index;
    },
    [rowKey],
  );

  /* ---------- columns ---------- */

  const declaredColumns = React.useMemo<ColumnType<T>[]>(
    () => columnsProp ?? columnsFromChildren<T>(children),
    [columnsProp, children],
  );

  const needsResponsive = React.useMemo(() => {
    const walk = (cols: ColumnType<T>[]): boolean =>
      cols.some((c) => !!c.responsive || (c.children ? walk(c.children) : false));
    return walk(declaredColumns);
  }, [declaredColumns]);
  const screens = useScreens(needsResponsive);

  const visibleColumns = React.useMemo(() => {
    if (!needsResponsive) return declaredColumns;
    const walk = (cols: ColumnType<T>[]): ColumnType<T>[] =>
      cols
        .filter((c) => !c.responsive || c.responsive.some((bp) => screens[bp]))
        .map((c) => (c.children ? { ...c, children: walk(c.children) } : c));
    return walk(declaredColumns);
  }, [declaredColumns, needsResponsive, screens]);

  /* ---------- expansion / selection column placement ---------- */

  const treeData = React.useMemo(
    () => dataSource.some((r) => Array.isArray(r?.[childrenColumnName]) && r[childrenColumnName].length > 0),
    [dataSource, childrenColumnName],
  );
  const hasDetailRows = !!expandable?.expandedRowRender;
  const showExpandColumn = hasDetailRows && expandable?.showExpandColumn !== false;

  const { leafColumns, headerRows } = React.useMemo(() => {
    const withoutSentinels = visibleColumns.filter(
      (c) => c.key !== SELECTION_COLUMN_KEY && c.key !== EXPAND_COLUMN_KEY,
    );
    const expandIdx = visibleColumns.findIndex((c) => c.key === EXPAND_COLUMN_KEY);
    const selectionIdx = visibleColumns.findIndex((c) => c.key === SELECTION_COLUMN_KEY);

    const expandPseudo: ColumnType<T> | null = showExpandColumn
      ? { key: EXPAND_COLUMN_KEY, title: "", width: expandable?.columnWidth ?? DEFAULT_CONTROL_COL_WIDTH }
      : null;
    const selectionPseudo: ColumnType<T> | null = rowSelection
      ? {
          key: SELECTION_COLUMN_KEY,
          title: "",
          width: rowSelection.columnWidth ?? DEFAULT_CONTROL_COL_WIDTH,
        }
      : null;

    // Sentinels keep their position; otherwise expand column first, then selection.
    const ordered: ColumnType<T>[] = [...withoutSentinels];
    const inserts: { at: number; col: ColumnType<T> }[] = [];
    if (selectionPseudo) inserts.push({ at: selectionIdx >= 0 ? selectionIdx : 0, col: selectionPseudo });
    if (expandPseudo) inserts.push({ at: expandIdx >= 0 ? expandIdx : 0, col: expandPseudo });
    inserts
      .sort((a, b) => b.at - a.at)
      .forEach(({ at, col }) => ordered.splice(Math.min(at, ordered.length), 0, col));

    const depth = (cols: ColumnType<T>[]): number =>
      cols.reduce((max, c) => Math.max(max, c.children?.length ? 1 + depth(c.children) : 1), 1);
    const maxDepth = depth(ordered);

    const leaves: LeafColumn<T>[] = [];
    const rows: HeaderCellDef<T>[][] = Array.from({ length: maxDepth }, () => []);

    const walk = (cols: ColumnType<T>[], level: number, path: string) => {
      cols.forEach((col, i) => {
        const nodePath = `${path}-${i}`;
        const cellKey =
          col.key ?? dataIndexToKey(col.dataIndex) ?? `__kkui_col${nodePath}`;
        if (col.children && col.children.length > 0) {
          const start = leaves.length;
          walk(col.children, level + 1, nodePath);
          const count = leaves.length - start;
          rows[level].push({
            cellKey,
            kind: "group",
            column: col,
            colSpan: count,
            rowSpan: 1,
            start,
            count,
          });
          return;
        }
        const kind: LeafColumn<T>["kind"] =
          col.key === SELECTION_COLUMN_KEY ? "selection" : col.key === EXPAND_COLUMN_KEY ? "expand" : "data";
        const leaf: LeafColumn<T> = {
          kind,
          colKey: cellKey,
          column: kind === "data" ? col : undefined,
          width: col.width,
          fixed:
            kind === "selection"
              ? normalizeFixed(rowSelection?.fixed)
              : kind === "expand"
                ? normalizeFixed(expandable?.fixed)
                : col.fixed,
        };
        const start = leaves.length;
        leaves.push(leaf);
        rows[level].push({
          cellKey,
          kind,
          column: kind === "data" ? col : undefined,
          leaf,
          colSpan: kind === "data" ? (col.colSpan ?? 1) : 1,
          rowSpan: maxDepth - level,
          start,
          count: 1,
        });
      });
    };
    walk(ordered, 0, "");

    // sticky offsets
    let left = 0;
    leaves.forEach((leaf) => {
      if (leaf.fixed === "left") {
        leaf.left = left;
        left += parseWidth(
          leaf.width,
          leaf.kind === "data" ? DEFAULT_COL_WIDTH : DEFAULT_CONTROL_COL_WIDTH,
        );
      }
    });
    let right = 0;
    for (let i = leaves.length - 1; i >= 0; i--) {
      const leaf = leaves[i];
      if (leaf.fixed === "right") {
        leaf.right = right;
        right += parseWidth(
          leaf.width,
          leaf.kind === "data" ? DEFAULT_COL_WIDTH : DEFAULT_CONTROL_COL_WIDTH,
        );
      }
    }
    rows.forEach((row) =>
      row.forEach((cell) => {
        const span = leaves.slice(cell.start, cell.start + cell.count);
        if (span.length && span.every((l) => l.fixed === "left")) {
          cell.fixed = "left";
          cell.left = span[0].left;
        } else if (span.length && span.every((l) => l.fixed === "right")) {
          cell.fixed = "right";
          cell.right = span[span.length - 1].right;
        }
      }),
    );

    return { leafColumns: leaves, headerRows: rows };
  }, [visibleColumns, rowSelection, expandable, showExpandColumn]);

  const dataLeafColumns = React.useMemo(
    () => leafColumns.filter((l) => l.kind === "data"),
    [leafColumns],
  );
  const totalColSpan = leafColumns.length;

  /* ---------- sorting ---------- */

  const [innerSort, setInnerSort] = React.useState<SortState | null>(() => {
    const walk = (cols: ColumnType<T>[], path: string): SortState | null => {
      for (let i = 0; i < cols.length; i++) {
        const col = cols[i];
        const nodePath = `${path}-${i}`;
        if (col.children?.length) {
          const found = walk(col.children, nodePath);
          if (found) return found;
        } else if (col.defaultSortOrder) {
          return {
            colKey: col.key ?? dataIndexToKey(col.dataIndex) ?? `__kkui_col${nodePath}`,
            order: col.defaultSortOrder,
          };
        }
      }
      return null;
    };
    return walk(declaredColumns, "");
  });

  const sortControlled = dataLeafColumns.some((l) => l.column?.sortOrder !== undefined);
  const sortState: SortState | null = React.useMemo(() => {
    if (sortControlled) {
      const active = dataLeafColumns.find((l) => !!l.column?.sortOrder);
      return active ? { colKey: active.colKey, order: active.column!.sortOrder! } : null;
    }
    return innerSort;
  }, [sortControlled, dataLeafColumns, innerSort]);

  /* ---------- filtering ---------- */

  const [innerFilters, setInnerFilters] = React.useState<Record<string, FilterValue[] | null>>(() => {
    const out: Record<string, FilterValue[] | null> = {};
    const walk = (cols: ColumnType<T>[], path: string) =>
      cols.forEach((col, i) => {
        const nodePath = `${path}-${i}`;
        if (col.children?.length) return walk(col.children, nodePath);
        if (col.defaultFilteredValue) {
          out[String(col.key ?? dataIndexToKey(col.dataIndex) ?? `__kkui_col${nodePath}`)] =
            col.defaultFilteredValue;
        }
      });
    walk(declaredColumns, "");
    return out;
  });

  const mergedFilters = React.useMemo(() => {
    const out: Record<string, FilterValue[] | null> = {};
    dataLeafColumns.forEach((leaf) => {
      const key = String(leaf.colKey);
      out[key] =
        leaf.column?.filteredValue !== undefined
          ? leaf.column.filteredValue
          : (innerFilters[key] ?? null);
    });
    return out;
  }, [dataLeafColumns, innerFilters]);

  /* ---------- data pipeline ---------- */

  const applyPipeline = React.useCallback(
    (source: T[], filters: Record<string, FilterValue[] | null>, sorted: SortState | null): T[] => {
      let list = source;
      dataLeafColumns.forEach((leaf) => {
        const active = filters[String(leaf.colKey)];
        const onFilter = leaf.column?.onFilter;
        if (!active || active.length === 0 || !onFilter) return;
        list = list.filter((record) => active.some((v) => onFilter(v, record)));
      });

      if (sorted?.order) {
        const leaf = dataLeafColumns.find((l) => l.colKey === sorted.colKey);
        const col = leaf?.column;
        if (col?.sorter) {
          const dir = sorted.order === "ascend" ? 1 : -1;
          const compare =
            typeof col.sorter === "function"
              ? col.sorter
              : (a: T, b: T) => {
                  const va = getPathValue(a, col.dataIndex);
                  const vb = getPathValue(b, col.dataIndex);
                  if (va === vb) return 0;
                  if (va == null) return -1;
                  if (vb == null) return 1;
                  return va > vb ? 1 : -1;
                };
          list = [...list].sort((a, b) => compare(a, b) * dir);
        }
      }
      return list === source ? [...source] : list;
    },
    [dataLeafColumns],
  );

  const processedData = React.useMemo(
    () => applyPipeline(dataSource, mergedFilters, sortState),
    [applyPipeline, dataSource, mergedFilters, sortState],
  );

  /* ---------- pagination ---------- */

  const paginationConfig = pagination === false ? null : pagination;
  const [innerCurrent, setInnerCurrent] = React.useState(paginationConfig?.defaultCurrent ?? 1);
  const [innerPageSize, setInnerPageSize] = React.useState(paginationConfig?.defaultPageSize ?? 10);

  const pageSize = paginationConfig?.pageSize ?? innerPageSize;
  const total = paginationConfig?.total ?? processedData.length;
  const maxPage = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
  const current = Math.min(paginationConfig?.current ?? innerCurrent, maxPage);

  const pageData = React.useMemo(() => {
    if (!paginationConfig) return processedData;
    // A shorter dataSource than `total` means the caller is paging on the server.
    if (processedData.length < total && processedData.length <= pageSize) return processedData;
    return processedData.slice((current - 1) * pageSize, current * pageSize);
  }, [paginationConfig, processedData, total, pageSize, current]);

  /* ---------- onChange plumbing ---------- */

  const buildSorter = React.useCallback(
    (state: SortState | null): SorterResult<T> => {
      if (!state?.order) return { order: null };
      const leaf = dataLeafColumns.find((l) => l.colKey === state.colKey);
      return {
        column: leaf?.column,
        order: state.order,
        field: dataIndexToKey(leaf?.column?.dataIndex),
        columnKey: state.colKey,
      };
    },
    [dataLeafColumns],
  );

  const triggerChange = React.useCallback(
    (next: {
      action: TableCurrentDataSource<T>["action"];
      filters?: Record<string, FilterValue[] | null>;
      sorter?: SortState | null;
      current?: number;
      pageSize?: number;
    }) => {
      if (!onChange) return;
      const nextFilters = next.filters ?? mergedFilters;
      const nextSort = next.sorter !== undefined ? next.sorter : sortState;
      const nextData = applyPipeline(dataSource, nextFilters, nextSort);
      onChange(
        {
          ...(paginationConfig ?? {}),
          current: next.current ?? current,
          pageSize: next.pageSize ?? pageSize,
          total: paginationConfig?.total ?? nextData.length,
        },
        nextFilters,
        buildSorter(nextSort),
        { currentDataSource: nextData, action: next.action },
      );
    },
    [
      onChange,
      mergedFilters,
      sortState,
      applyPipeline,
      dataSource,
      paginationConfig,
      current,
      pageSize,
      buildSorter,
    ],
  );

  const handlePageChange = (page: number, nextSize: number) => {
    if (paginationConfig?.current === undefined) setInnerCurrent(page);
    if (paginationConfig?.pageSize === undefined) setInnerPageSize(nextSize);
    paginationConfig?.onChange?.(page, nextSize);
    triggerChange({ action: "paginate", current: page, pageSize: nextSize });
  };

  const toggleSort = (leaf: LeafColumn<T>) => {
    const col = leaf.column;
    if (!col?.sorter) return;
    const dirs = col.sortDirections ?? sortDirections;
    const currentOrder = sortState?.colKey === leaf.colKey ? sortState.order : null;
    const idx = currentOrder ? dirs.indexOf(currentOrder) : -1;
    const nextOrder: SortOrder = idx === -1 ? dirs[0] : (dirs[idx + 1] ?? null);
    const nextState: SortState | null = nextOrder ? { colKey: leaf.colKey, order: nextOrder } : null;
    if (!sortControlled) setInnerSort(nextState);
    triggerChange({ action: "sort", sorter: nextState });
  };

  const commitFilter = (leaf: LeafColumn<T>, values: FilterValue[]) => {
    const key = String(leaf.colKey);
    const value = values.length ? values : null;
    if (leaf.column?.filteredValue === undefined) {
      setInnerFilters((prev) => ({ ...prev, [key]: value }));
    }
    if (paginationConfig?.current === undefined) setInnerCurrent(1);
    triggerChange({ action: "filter", filters: { ...mergedFilters, [key]: value }, current: 1 });
  };

  /* ---------- key / tree maps ---------- */

  const { keyRecordMap, parentMap, childrenMap } = React.useMemo(() => {
    const records = new Map<React.Key, T>();
    const parents = new Map<React.Key, React.Key>();
    const kids = new Map<React.Key, React.Key[]>();
    const walk = (list: T[], parent?: React.Key) => {
      list.forEach((record, index) => {
        const key = getRowKey(record, index);
        records.set(key, record);
        if (parent !== undefined) {
          parents.set(key, parent);
          kids.set(parent, [...(kids.get(parent) ?? []), key]);
        }
        const sub = record?.[childrenColumnName];
        if (Array.isArray(sub) && sub.length) walk(sub as T[], key);
      });
    };
    walk(dataSource);
    return { keyRecordMap: records, parentMap: parents, childrenMap: kids };
  }, [dataSource, getRowKey, childrenColumnName]);

  const recordCache = React.useRef(new Map<React.Key, T>());
  keyRecordMap.forEach((record, key) => recordCache.current.set(key, record));

  /* ---------- selection ---------- */

  const [innerSelectedKeys, setInnerSelectedKeys] = React.useState<React.Key[]>(
    rowSelection?.defaultSelectedRowKeys ?? [],
  );
  const selectedKeys = rowSelection?.selectedRowKeys ?? innerSelectedKeys;
  const selectedKeySet = React.useMemo(() => new Set(selectedKeys), [selectedKeys]);
  const checkStrictly = rowSelection?.checkStrictly !== false;

  const isRowDisabled = (record: T) => !!rowSelection?.getCheckboxProps?.(record)?.disabled;

  const pageRowKeys = React.useMemo(() => {
    const out: { key: React.Key; record: T }[] = [];
    const walk = (list: T[]) =>
      list.forEach((record, index) => {
        out.push({ key: getRowKey(record, index), record });
        const sub = record?.[childrenColumnName];
        if (Array.isArray(sub) && sub.length) walk(sub as T[]);
      });
    walk(pageData);
    return out;
  }, [pageData, getRowKey, childrenColumnName]);

  const selectableKeys = React.useMemo(
    () => pageRowKeys.filter(({ record }) => !isRowDisabled(record)).map(({ key }) => key),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageRowKeys, rowSelection],
  );

  /** Every selectable key in the whole dataSource (used by "select all data"). */
  const allSelectableKeys = React.useMemo(
    () =>
      Array.from(keyRecordMap.entries())
        .filter(([, record]) => !isRowDisabled(record))
        .map(([key]) => key),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [keyRecordMap, rowSelection],
  );

  const emitSelection = (keys: React.Key[], type: SelectionChangeType) => {
    if (!rowSelection) return;
    const finalKeys = rowSelection.preserveSelectedRowKeys
      ? keys
      : keys.filter((k) => keyRecordMap.has(k));
    const rows = finalKeys
      .map((k) => keyRecordMap.get(k) ?? recordCache.current.get(k))
      .filter((r): r is T => r !== undefined);
    if (rowSelection.selectedRowKeys === undefined) setInnerSelectedKeys(finalKeys);
    rowSelection.onChange?.(finalKeys, rows, { type });
  };

  const collectDescendants = React.useCallback(
    (key: React.Key): React.Key[] => {
      const out: React.Key[] = [];
      const walk = (k: React.Key) =>
        (childrenMap.get(k) ?? []).forEach((child) => {
          out.push(child);
          walk(child);
        });
      walk(key);
      return out;
    },
    [childrenMap],
  );

  const syncAncestors = React.useCallback(
    (set: Set<React.Key>, key: React.Key) => {
      let parent = parentMap.get(key);
      while (parent !== undefined) {
        const kids = childrenMap.get(parent) ?? [];
        const selectable = kids.filter((k) => {
          const record = keyRecordMap.get(k);
          return record ? !isRowDisabled(record) : true;
        });
        if (selectable.length > 0 && selectable.every((k) => set.has(k))) set.add(parent);
        else set.delete(parent);
        parent = parentMap.get(parent);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [parentMap, childrenMap, keyRecordMap, rowSelection],
  );

  const handleSelectRow = (key: React.Key, record: T, checked: boolean) => {
    if (!rowSelection) return;
    if (rowSelection.type === "radio") {
      emitSelection([key], "single");
      rowSelection.onSelect?.(record, checked, [record]);
      return;
    }
    const set = new Set(selectedKeys);
    const affected = checkStrictly ? [key] : [key, ...collectDescendants(key)];
    affected.forEach((k) => {
      const target = keyRecordMap.get(k);
      if (k !== key && target && isRowDisabled(target)) return;
      if (checked) set.add(k);
      else set.delete(k);
    });
    if (!checkStrictly) syncAncestors(set, key);
    const nextKeys = Array.from(set);
    emitSelection(nextKeys, "multiple");
    const rows = nextKeys
      .map((k) => keyRecordMap.get(k) ?? recordCache.current.get(k))
      .filter((r): r is T => r !== undefined);
    rowSelection.onSelect?.(record, checked, rows);
  };

  const handleSelectAll = (checked: boolean) => {
    if (!rowSelection) return;
    const set = new Set(selectedKeys);
    const changeRows: T[] = [];
    selectableKeys.forEach((k) => {
      const wasSelected = set.has(k);
      if (checked && !wasSelected) {
        set.add(k);
        const record = keyRecordMap.get(k);
        if (record) changeRows.push(record);
      } else if (!checked && wasSelected) {
        set.delete(k);
        const record = keyRecordMap.get(k);
        if (record) changeRows.push(record);
      }
    });
    const nextKeys = Array.from(set);
    emitSelection(nextKeys, checked ? "all" : "none");
    const rows = nextKeys
      .map((k) => keyRecordMap.get(k) ?? recordCache.current.get(k))
      .filter((r): r is T => r !== undefined);
    rowSelection.onSelectAll?.(checked, rows, changeRows);
  };

  const runSelection = (item: SelectionItem | string) => {
    if (!rowSelection) return;
    const key = typeof item === "string" ? item : item.key;
    if (typeof item !== "string" && item.onSelect) {
      item.onSelect(selectableKeys);
      return;
    }
    if (key === SELECTION_ALL) {
      const nextKeys = Array.from(new Set([...selectedKeys, ...allSelectableKeys]));
      emitSelection(nextKeys, "all");
      return;
    }
    if (key === SELECTION_NONE) {
      emitSelection([], "none");
      rowSelection.onSelectNone?.();
      return;
    }
    if (key === SELECTION_INVERT) {
      const set = new Set(selectedKeys);
      selectableKeys.forEach((k) => (set.has(k) ? set.delete(k) : set.add(k)));
      const nextKeys = Array.from(set);
      emitSelection(nextKeys, "invert");
      rowSelection.onSelectInvert?.(nextKeys);
    }
  };

  const allPageSelected =
    selectableKeys.length > 0 && selectableKeys.every((k) => selectedKeySet.has(k));
  const somePageSelected = selectableKeys.some((k) => selectedKeySet.has(k));

  /* ---------- expansion ---------- */

  const allExpandableKeys = React.useMemo(() => {
    const out: React.Key[] = [];
    const walk = (list: T[]) =>
      list.forEach((record, index) => {
        const sub = record?.[childrenColumnName];
        const isTreeParent = Array.isArray(sub) && sub.length > 0;
        if (isTreeParent || hasDetailRows) out.push(getRowKey(record, index));
        if (isTreeParent) walk(sub as T[]);
      });
    walk(dataSource);
    return out;
  }, [dataSource, childrenColumnName, hasDetailRows, getRowKey]);

  const [innerExpandedKeys, setInnerExpandedKeys] = React.useState<React.Key[]>(() =>
    expandable?.defaultExpandAllRows ? [] : (expandable?.defaultExpandedRowKeys ?? []),
  );
  const didExpandAll = React.useRef(false);
  React.useEffect(() => {
    if (!expandable?.defaultExpandAllRows || didExpandAll.current || allExpandableKeys.length === 0) return;
    didExpandAll.current = true;
    setInnerExpandedKeys(allExpandableKeys);
  }, [expandable?.defaultExpandAllRows, allExpandableKeys]);

  const expandedKeys = expandable?.expandedRowKeys ?? innerExpandedKeys;
  const expandedKeySet = React.useMemo(() => new Set(expandedKeys), [expandedKeys]);

  const toggleExpand = (record: T, e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const key = getRowKey(record, index);
    const willExpand = !expandedKeySet.has(key);
    const next = willExpand ? [...expandedKeys, key] : expandedKeys.filter((k) => k !== key);
    if (expandable?.expandedRowKeys === undefined) setInnerExpandedKeys(next);
    expandable?.onExpand?.(willExpand, record);
    expandable?.onExpandedRowsChange?.(next);
  };

  /* ---------- flat render rows ---------- */

  const flatRows = React.useMemo(() => {
    const out: FlatRow<T>[] = [];
    const walk = (list: T[], indent: number) => {
      list.forEach((record, index) => {
        const key = getRowKey(record, index);
        const sub = record?.[childrenColumnName];
        const hasChildren = Array.isArray(sub) && sub.length > 0;
        const rowExpandable = expandable?.rowExpandable ? expandable.rowExpandable(record) : true;
        const canExpand = hasChildren || (hasDetailRows && rowExpandable);
        const expanded = expandedKeySet.has(key) && canExpand;
        out.push({ kind: "row", key, record, index, indent, expanded, hasChildren, canExpand });
        if (!expanded) return;
        if (hasChildren) walk(sub as T[], indent + 1);
        else if (hasDetailRows) out.push({ kind: "expanded", key: `${key}__expanded`, record, index, indent });
      });
    };
    walk(pageData, 0);
    return out;
  }, [pageData, getRowKey, childrenColumnName, expandable, hasDetailRows, expandedKeySet]);

  /* ---------- virtual window ---------- */

  const scrollY = scroll?.y;
  const scrollYPx = typeof scrollY === "number" ? scrollY : undefined;
  const hasExpandedDetail = flatRows.some((r) => r.kind === "expanded");
  const virtualEnabled =
    !!scrollYPx &&
    !hasExpandedDetail &&
    (virtual || flatRows.length > VIRTUAL_AUTO_THRESHOLD);
  const rowHeight = VIRTUAL_ROW_HEIGHT[size];
  const [scrollTop, setScrollTop] = React.useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const rafRef = React.useRef<number | undefined>(undefined);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!virtualEnabled) return;
    const top = e.currentTarget.scrollTop;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => setScrollTop(top));
  };
  React.useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const windowStart = virtualEnabled
    ? Math.max(0, Math.floor(scrollTop / rowHeight) - VIRTUAL_OVERSCAN)
    : 0;
  const windowEnd = virtualEnabled
    ? Math.min(flatRows.length, Math.ceil((scrollTop + (scrollYPx ?? 0)) / rowHeight) + VIRTUAL_OVERSCAN)
    : flatRows.length;
  const renderRows = virtualEnabled ? flatRows.slice(windowStart, windowEnd) : flatRows;
  const padTop = virtualEnabled ? windowStart * rowHeight : 0;
  const padBottom = virtualEnabled ? (flatRows.length - windowEnd) * rowHeight : 0;

  /* ---------- shared cell classes ---------- */

  const padClass = virtualEnabled ? CELL_PAD_X[size] : CELL_PAD[size];
  const hasFixedColumn = leafColumns.some((l) => !!l.fixed);
  const resolvedLayout = tableLayout ?? (hasFixedColumn || virtualEnabled ? "fixed" : "auto");
  const stickyHeader = !!sticky || scrollY !== undefined;
  const stickyOffset = typeof sticky === "object" ? (sticky.offsetHeader ?? 0) : 0;
  const isLoading = typeof loading === "object" ? loading.spinning !== false : loading;
  const loadingTip = typeof loading === "object" ? loading.tip : undefined;

  const fixedCellClass = (leaf: { fixed?: FixedSide }, isHeader: boolean) =>
    leaf.fixed
      ? cn("sticky bg-inherit", isHeader ? "z-30" : "z-20", leaf.fixed === "left" ? "shadow-[1px_0_0_0_var(--kk-border-secondary)]" : "shadow-[-1px_0_0_0_var(--kk-border-secondary)]")
      : undefined;

  /* ---------- expand icon ---------- */

  const renderExpandIcon = (record: T, index: number, expanded: boolean, canExpand: boolean) => {
    const onExpandFn = (rec: T, e: React.MouseEvent) => toggleExpand(rec, e, index);
    if (expandable?.expandIcon) {
      return expandable.expandIcon({ expanded, expandable: canExpand, record, onExpand: onExpandFn });
    }
    if (!canExpand) return null;
    return (
      <button
        type="button"
        aria-label={expanded ? locale.collapse : locale.expand}
        aria-expanded={expanded}
        onClick={(e) => onExpandFn(record, e)}
        className="kk-press inline-flex items-center justify-center rounded-sm p-0.5 text-text-tertiary transition-colors duration-fast ease-kk-in-out hover:bg-fill-tertiary hover:text-text"
      >
        <ChevronRight
          className={cn(
            "size-3.5 transition-transform duration-mid ease-kk-in-out",
            expanded && "rotate-90",
          )}
        />
      </button>
    );
  };

  /* ---------- header ---------- */

  const sorterIcon = (leaf: LeafColumn<T>) => {
    const active = sortState?.colKey === leaf.colKey ? sortState.order : null;
    return (
      <span className="inline-flex flex-col text-text-quaternary">
        {active === "ascend" ? (
          <ChevronUp className="size-3.5 text-primary" />
        ) : active === "descend" ? (
          <ChevronDown className="size-3.5 text-primary" />
        ) : (
          <ChevronsUpDown className="size-3.5 opacity-40 transition-opacity duration-fast group-hover/sorter:opacity-100" />
        )}
      </span>
    );
  };

  const sorterTooltipTitle = (leaf: LeafColumn<T>): React.ReactNode => {
    const setting = leaf.column?.showSorterTooltip ?? showSorterTooltip;
    if (!setting) return null;
    if (typeof setting === "object" && setting.title !== undefined) return setting.title;
    const dirs = leaf.column?.sortDirections ?? sortDirections;
    const active = sortState?.colKey === leaf.colKey ? sortState.order : null;
    const idx = active ? dirs.indexOf(active) : -1;
    const next: SortOrder = idx === -1 ? dirs[0] : (dirs[idx + 1] ?? null);
    if (next === "ascend") return locale.triggerAsc;
    if (next === "descend") return locale.triggerDesc;
    return locale.cancelSort;
  };

  const selectionMenuItems = React.useMemo<DropdownItemType[]>(() => {
    const raw = rowSelection?.selections;
    if (!raw) return [];
    const list: (SelectionItem | string)[] =
      raw === true ? [SELECTION_ALL, SELECTION_INVERT, SELECTION_NONE] : raw;
    return list.map((item) => {
      if (typeof item === "string") {
        const label =
          item === SELECTION_ALL
            ? locale.selectAll
            : item === SELECTION_INVERT
              ? locale.selectInvert
              : locale.selectNone;
        return { key: item, label };
      }
      return { key: item.key, label: item.text };
    });
  }, [rowSelection?.selections, locale]);

  const renderHeaderCellContent = (cell: HeaderCellDef<T>): React.ReactNode => {
    if (cell.kind === "selection") {
      const selectAllNode =
        rowSelection?.hideSelectAll || rowSelection?.type === "radio" ? null : (
          <Checkbox
            checked={allPageSelected}
            indeterminate={!allPageSelected && somePageSelected}
            disabled={selectableKeys.length === 0}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
        );
      const titleNode =
        typeof rowSelection?.columnTitle === "function"
          ? rowSelection.columnTitle(selectAllNode)
          : (rowSelection?.columnTitle ?? selectAllNode);
      return (
        <div className="flex items-center justify-center gap-0.5">
          {titleNode}
          {selectionMenuItems.length > 0 && (
            <Dropdown
              trigger={["click"]}
              placement="bottomLeft"
              menu={{
                items: selectionMenuItems,
                onClick: ({ key }) => {
                  const raw = rowSelection?.selections;
                  const list: (SelectionItem | string)[] =
                    raw === true ? [SELECTION_ALL, SELECTION_INVERT, SELECTION_NONE] : (raw as (SelectionItem | string)[]);
                  const found = list.find((i) => (typeof i === "string" ? i : i.key) === key);
                  if (found) runSelection(found);
                },
              }}
            >
              <button
                type="button"
                aria-label={locale.filterTitle}
                className="inline-flex size-4 items-center justify-center rounded-xs text-text-quaternary transition-colors duration-fast hover:bg-fill-tertiary hover:text-text"
              >
                <ChevronDown className="size-3" />
              </button>
            </Dropdown>
          )}
        </div>
      );
    }
    if (cell.kind === "expand") return null;

    const col = cell.column!;
    const leaf = cell.leaf;
    const titleNode =
      typeof col.title === "function"
        ? col.title({
            sortOrder: leaf && sortState?.colKey === leaf.colKey ? sortState.order : null,
            sortColumn: sortState ? dataLeafColumns.find((l) => l.colKey === sortState.colKey)?.column : undefined,
            filters: mergedFilters,
          })
        : col.title;

    const sortable = !!col.sorter && !!leaf;
    const tooltip = sortable ? sorterTooltipTitle(leaf) : null;

    const label = (
      <span
        className={cn(
          "inline-flex items-center gap-1",
          sortable && "group/sorter cursor-pointer select-none",
        )}
        onClick={sortable ? () => toggleSort(leaf) : undefined}
      >
        <span className="min-w-0">{titleNode}</span>
        {sortable && sorterIcon(leaf)}
      </span>
    );

    return (
      <div
        className={cn(
          "flex items-center gap-0.5",
          col.align === "center" && "justify-center",
          col.align === "right" && "justify-end",
        )}
      >
        {tooltip ? <Tooltip title={tooltip}>{label}</Tooltip> : label}
        {leaf && (col.filters || col.filterDropdown) && (
          <ColumnFilterDropdown
            column={col}
            value={mergedFilters[String(leaf.colKey)] ?? null}
            onCommit={(values) => commitFilter(leaf, values)}
            locale={locale}
            getPopupContainer={getPopupContainer}
          />
        )}
      </div>
    );
  };

  const headerNode = showHeader && (
    <HeaderWrapper>
      {headerRows.map((row, rowIndex) => {
        const rowProps = onHeaderRow?.(row.map((c) => c.column).filter(Boolean) as ColumnType<T>[], rowIndex) ?? {};
        return (
          <HeaderRow
            key={rowIndex}
            {...rowProps}
            className={cn("bg-bg-layout text-xs font-semibold text-text-secondary", rowProps.className)}
          >
            {row.map((cell) => {
              if (cell.colSpan === 0) return null;
              const col = cell.column;
              const {
                className: extraClassName,
                style: extraStyle,
                ...extraHeaderProps
              } = col?.onHeaderCell?.(col) ?? {};
              return (
                <HeaderCell
                  key={cell.cellKey}
                  scope={cell.kind === "group" ? "colgroup" : "col"}
                  colSpan={cell.colSpan > 1 ? cell.colSpan : undefined}
                  rowSpan={cell.rowSpan > 1 ? cell.rowSpan : undefined}
                  style={{
                    width: cell.leaf?.width ?? col?.width,
                    minWidth: col?.minWidth,
                    left: cell.fixed === "left" ? cell.left : undefined,
                    right: cell.fixed === "right" ? cell.right : undefined,
                    top: stickyHeader ? stickyOffset + rowIndex * HEADER_ROW_HEIGHT[size] : undefined,
                    ...extraStyle,
                  }}
                  {...extraHeaderProps}
                  className={cn(
                    padClass,
                    "align-middle font-semibold whitespace-nowrap",
                    alignClass(col?.align),
                    "border-b border-border",
                    bordered && "border-r border-border-secondary last:border-r-0",
                    cell.kind === "group" && "text-center",
                    stickyHeader && "sticky z-20 bg-bg-layout",
                    fixedCellClass(cell, true),
                    col?.className,
                    extraClassName as string | undefined,
                  )}
                >
                  {renderHeaderCellContent(cell)}
                </HeaderCell>
              );
            })}
          </HeaderRow>
        );
      })}
    </HeaderWrapper>
  );

  /* ---------- body ---------- */

  const renderBodyRow = (row: Extract<FlatRow<T>, { kind: "row" }>, isLast: boolean) => {
    const { record, index, indent, expanded, hasChildren, canExpand, key } = row;
    const isSelected = selectedKeySet.has(key);
    const halfChecked =
      !checkStrictly && !isSelected && collectDescendants(key).some((k) => selectedKeySet.has(k));
    const rowProps = onRow?.(record, index) ?? {};
    const extraClass =
      typeof rowClassName === "function" ? rowClassName(record, index, indent) : rowClassName;

    const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
      rowProps.onClick?.(e);
      if (expandable?.expandRowByClick && canExpand) toggleExpand(record, e, index);
    };

    let renderedFirstData = false;

    return (
      <BodyRow
        key={key}
        data-row-key={key}
        {...rowProps}
        onClick={handleRowClick}
        style={virtualEnabled ? { height: rowHeight, ...rowProps.style } : rowProps.style}
        className={cn(
          "bg-bg-container transition-colors duration-fast ease-kk-in-out",
          rowHoverable && "hover:bg-fill-quaternary",
          isSelected && "bg-primary-bg/40 hover:bg-primary-bg",
          expandable?.expandRowByClick && canExpand && "cursor-pointer",
          extraClass,
          rowProps.className,
        )}
      >
        {leafColumns.map((leaf) => {
          const borderClass = cn(
            !isLast && "border-b border-border-secondary",
            bordered && "border-r border-border-secondary last:border-r-0",
          );

          if (leaf.kind === "selection") {
            const disabled = isRowDisabled(record);
            const originNode =
              rowSelection?.type === "radio" ? (
                <Radio
                  checked={isSelected}
                  disabled={disabled}
                  onChange={(e) => handleSelectRow(key, record, e.target.checked)}
                />
              ) : (
                <Checkbox
                  checked={isSelected}
                  indeterminate={halfChecked}
                  disabled={disabled}
                  onChange={(e) => handleSelectRow(key, record, e.target.checked)}
                />
              );
            return (
              <td
                key={leaf.colKey}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: leaf.width,
                  left: leaf.fixed === "left" ? leaf.left : undefined,
                  right: leaf.fixed === "right" ? leaf.right : undefined,
                }}
                className={cn(padClass, "bg-inherit text-center align-middle", borderClass, fixedCellClass(leaf, false))}
              >
                {rowSelection?.renderCell
                  ? rowSelection.renderCell(isSelected, record, index, originNode)
                  : originNode}
              </td>
            );
          }

          if (leaf.kind === "expand") {
            return (
              <td
                key={leaf.colKey}
                style={{
                  width: leaf.width,
                  left: leaf.fixed === "left" ? leaf.left : undefined,
                  right: leaf.fixed === "right" ? leaf.right : undefined,
                }}
                className={cn(padClass, "bg-inherit text-center align-middle", borderClass, fixedCellClass(leaf, false))}
              >
                {!hasChildren && renderExpandIcon(record, index, expanded, canExpand)}
              </td>
            );
          }

          const col = leaf.column!;
          const value = getPathValue(record, col.dataIndex ?? (col.key as string | undefined));
          const rendered = col.render ? col.render(value, record, index) : (value as React.ReactNode);
          const cellNode = isRenderedCell(rendered) ? rendered.children : (rendered as React.ReactNode);
          const mergeProps = isRenderedCell(rendered) ? rendered.props : undefined;
          const cellExtra = col.onCell?.(record, index) ?? {};
          const colSpan = (mergeProps?.colSpan ?? cellExtra.colSpan) as number | undefined;
          const rowSpan = (mergeProps?.rowSpan ?? cellExtra.rowSpan) as number | undefined;
          if (colSpan === 0 || rowSpan === 0) return null;

          const isFirstData = !renderedFirstData;
          if (isFirstData) renderedFirstData = true;
          const showInlineExpand = isFirstData && !showExpandColumn && (treeData || hasChildren);
          const ellipsis = col.ellipsis;
          const showTitle = typeof ellipsis === "object" ? ellipsis.showTitle !== false : !!ellipsis;
          const { className: extraClassName, style: extraStyle, colSpan: _cs, rowSpan: _rs, ...restCellProps } = cellExtra;

          return (
            <BodyCell
              key={leaf.colKey}
              as={col.rowScope ? "th" : BodyCellTag}
              record={record}
              shouldCellUpdate={col.shouldCellUpdate}
              scope={col.rowScope}
              colSpan={colSpan}
              rowSpan={rowSpan}
              title={showTitle && typeof cellNode === "string" ? cellNode : undefined}
              cellProps={restCellProps}
              style={{
                width: leaf.width,
                minWidth: col.minWidth,
                left: leaf.fixed === "left" ? leaf.left : undefined,
                right: leaf.fixed === "right" ? leaf.right : undefined,
                height: virtualEnabled ? rowHeight : undefined,
                ...extraStyle,
              }}
              className={cn(
                padClass,
                "bg-inherit align-middle font-normal text-text",
                alignClass(col.align),
                ellipsis && "truncate",
                virtualEnabled && "overflow-hidden whitespace-nowrap",
                borderClass,
                fixedCellClass(leaf, false),
                col.className,
                extraClassName as string | undefined,
              )}
            >
              {isFirstData && indent > 0 && (
                <span
                  className="inline-block align-middle"
                  style={{ width: indent * (expandable?.indentSize ?? 15) }}
                />
              )}
              {showInlineExpand && (
                <span className="mr-1.5 inline-flex w-4 justify-center align-middle">
                  {hasChildren ? renderExpandIcon(record, index, expanded, true) : null}
                </span>
              )}
              {cellNode}
            </BodyCell>
          );
        })}
      </BodyRow>
    );
  };

  const bodyNode = (
    <BodyWrapper>
      {padTop > 0 && (
        <tr aria-hidden style={{ height: padTop }}>
          <td colSpan={totalColSpan} className="p-0" />
        </tr>
      )}

      {flatRows.length === 0 ? (
        <tr>
          <td colSpan={totalColSpan} className="py-10 text-center">
            {typeof locale.emptyText === "function" ? (
              locale.emptyText()
            ) : locale.emptyText !== undefined ? (
              locale.emptyText
            ) : (
              <Empty image={EMPTY_IMAGE_SIMPLE} description="No data" />
            )}
          </td>
        </tr>
      ) : (
        renderRows.map((row, i) => {
          const isLast = !summary && windowStart + i === flatRows.length - 1;
          if (row.kind === "row") return renderBodyRow(row, isLast);
          const extraClass =
            typeof expandable?.expandedRowClassName === "function"
              ? expandable.expandedRowClassName(row.record, row.index, row.indent)
              : expandable?.expandedRowClassName;
          return (
            <tr
              key={row.key}
              className={cn(
                "bg-bg-layout/60",
                !isLast && "border-b border-border-secondary",
                extraClass,
              )}
            >
              <td colSpan={totalColSpan} className={cn("p-4", !isLast && "border-b border-border-secondary")}>
                {expandable?.expandedRowRender?.(row.record, row.index, row.indent, true)}
              </td>
            </tr>
          );
        })
      )}

      {padBottom > 0 && (
        <tr aria-hidden style={{ height: padBottom }}>
          <td colSpan={totalColSpan} className="p-0" />
        </tr>
      )}
    </BodyWrapper>
  );

  /* ---------- pagination bar ---------- */

  const positions = paginationConfig?.position ?? ["bottomRight"];
  const renderPagination = (place: "top" | "bottom") => {
    if (!paginationConfig) return null;
    const active = positions.filter((p) => p.startsWith(place));
    if (active.length === 0) return null;
    const align = active[0].endsWith("Left")
      ? "justify-start"
      : active[0].endsWith("Center")
        ? "justify-center"
        : "justify-end";
    const {
      current: _c,
      pageSize: _ps,
      total: _t,
      onChange: _oc,
      position: _pos,
      defaultCurrent: _dc,
      defaultPageSize: _dps,
      ...restPagination
    } = paginationConfig;
    return (
      <div className={cn("flex", align)}>
        <Pagination
          {...restPagination}
          current={current}
          pageSize={pageSize}
          total={total}
          onChange={handlePageChange}
        />
      </div>
    );
  };

  /* ---------- render ---------- */

  const scrollable = scroll?.x !== undefined || scrollY !== undefined;

  return (
    <div id={id} data-slot="table" className={cn("w-full space-y-4", className)} style={style}>
      {title && <div className="text-sm font-semibold text-text-heading">{title(pageData)}</div>}
      {renderPagination("top")}

      <div
        className={cn(
          "relative rounded-xl border border-border bg-bg-container shadow-xs",
          sticky && scrollY === undefined ? "overflow-visible" : "overflow-hidden",
        )}
      >
        {isLoading && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-2 bg-bg-container/70 backdrop-blur-xs">
            <Loader2 className="size-6 animate-spin text-primary" />
            {loadingTip && <span className="text-xs text-text-secondary">{loadingTip}</span>}
          </div>
        )}

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className={cn(scrollable && "kk-scrollbar overflow-auto")}
          style={{
            maxHeight: scrollY !== undefined ? (typeof scrollY === "number" ? `${scrollY}px` : scrollY) : undefined,
          }}
        >
          <TableTag
            className={cn(
              "w-full border-separate border-spacing-0 text-left",
              resolvedLayout === "fixed" ? "table-fixed" : "table-auto",
            )}
            style={{
              minWidth: scroll?.x === true ? "max-content" : scroll?.x,
            }}
          >
            {caption && (
              <caption className="caption-bottom px-4 py-2 text-xs text-text-tertiary">{caption}</caption>
            )}
            {headerNode}
            {bodyNode}
            {summary?.(pageData)}
          </TableTag>
        </div>
      </div>

      {footer && <div className="text-xs text-text-secondary">{footer(pageData)}</div>}
      {renderPagination("bottom")}
    </div>
  );
}

function normalizeFixed(fixed?: boolean | FixedSide): FixedSide | undefined {
  if (fixed === true) return "left";
  if (fixed === false || fixed === undefined) return undefined;
  return fixed;
}

/* ------------------------------------------------------------------ */
/* JSX column declaration                                              */
/* ------------------------------------------------------------------ */

/** Declarative column: `<Table.Column title="Name" dataIndex="name" />`. */
export function TableColumn<T = any>(_props: ColumnType<T>): React.ReactElement | null {
  return null;
}
/** Declarative group header: `<Table.ColumnGroup title="Name"> <Table.Column …/> </Table.ColumnGroup>`. */
export function TableColumnGroup<T = any>(
  _props: Omit<ColumnType<T>, "children"> & { children?: React.ReactNode },
): React.ReactElement | null {
  return null;
}

function columnsFromChildren<T>(children: React.ReactNode): ColumnType<T>[] {
  const out: ColumnType<T>[] = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const props = child.props as ColumnType<T> & { children?: React.ReactNode };
    if (child.type === TableColumnGroup) {
      const { children: sub, ...rest } = props;
      out.push({ ...rest, children: columnsFromChildren<T>(sub) });
      return;
    }
    if (child.type === TableColumn) {
      const { children: _sub, ...rest } = props;
      out.push(rest as ColumnType<T>);
    }
  });
  return out;
}

/* ------------------------------------------------------------------ */
/* Summary                                                             */
/* ------------------------------------------------------------------ */

export interface TableSummaryProps {
  children: React.ReactNode;
  /** Pin the summary to the bottom of a `scroll.y` container. */
  fixed?: boolean | "top" | "bottom";
  className?: string;
}

export function TableSummary({ children, fixed, className }: TableSummaryProps) {
  return (
    <tfoot
      data-slot="table-summary"
      className={cn(
        "bg-bg-layout/70 font-semibold text-text",
        fixed && "sticky z-20",
        fixed === "top" ? "top-0" : fixed ? "bottom-0" : undefined,
        className,
      )}
    >
      {children}
    </tfoot>
  );
}

export interface TableSummaryRowProps extends React.ComponentProps<"tr"> {
  children: React.ReactNode;
}
export function TableSummaryRow({ children, className, ...props }: TableSummaryRowProps) {
  return (
    <tr {...props} className={cn("bg-bg-layout/70", className)}>
      {children}
    </tr>
  );
}

export interface TableSummaryCellProps extends Omit<React.ComponentProps<"td">, "align"> {
  /** Leaf column index this cell belongs to (kept for API parity / readability). */
  index?: number;
  align?: ColumnAlign;
  children?: React.ReactNode;
}
export function TableSummaryCell({ children, className, index: _index, align, ...props }: TableSummaryCellProps) {
  return (
    <td
      {...props}
      className={cn("border-t border-border px-4 py-3 text-sm font-semibold", alignClass(align), className)}
    >
      {children}
    </td>
  );
}

TableSummary.Row = TableSummaryRow;
TableSummary.Cell = TableSummaryCell;

Table.Column = TableColumn;
Table.ColumnGroup = TableColumnGroup;
Table.Summary = TableSummary;
Table.EXPAND_COLUMN = EXPAND_COLUMN;
Table.SELECTION_COLUMN = SELECTION_COLUMN;
Table.SELECTION_ALL = SELECTION_ALL;
Table.SELECTION_INVERT = SELECTION_INVERT;
Table.SELECTION_NONE = SELECTION_NONE;
