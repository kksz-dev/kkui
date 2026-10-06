import * as React from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ChevronsUpDown,
  Columns3,
  Download,
  Filter,
  GripVertical,
  Layers,
  Maximize2,
  Minimize2,
  MoreVertical,
  Search,
  Settings2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "@/components/ui/pagination";
import { Dropdown } from "@/components/ui/dropdown";
import { Spin } from "@/components/ui/spin";

export type DataGridSortDirection = "asc" | "desc" | null;
export type DataGridDensity = "compact" | "middle" | "comfortable";

export interface DataGridColumn<T = any> {
  key: string;
  title: React.ReactNode;
  dataIndex?: keyof T | string;
  width?: number | string;
  minWidth?: number;
  pin?: "left" | "right" | false;
  sortable?: boolean;
  filterable?: boolean;
  groupable?: boolean;
  resizable?: boolean;
  hidden?: boolean;
  align?: "left" | "center" | "right";
  render?: (value: any, record: T, index: number) => React.ReactNode;
  summary?: "sum" | "avg" | "count" | "min" | "max" | ((data: T[]) => React.ReactNode);
  /** Plain-text title used by CSV export when `title` is a node. */
  exportTitle?: string;
  /** Custom comparator; falls back to a value comparison. */
  sorter?: (a: T, b: T) => number;
}

export interface DataGridState {
  page: number;
  pageSize: number;
  sort: { key: string; direction: DataGridSortDirection } | null;
  search: string;
  filters: Record<string, string>;
  groupBy: string[];
}

export interface DataGridProps<T = any> extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "title"> {
  columns: DataGridColumn<T>[];
  dataSource: T[];
  rowKey?: keyof T | ((record: T) => string);
  loading?: boolean;
  pagination?: boolean | { pageSize?: number; current?: number; pageSizeOptions?: number[] };
  selectable?: boolean;
  selectedRowKeys?: (string | number)[];
  onSelectionChange?: (keys: (string | number)[], selectedRows: T[]) => void;
  /** Column keys to group rows by; controlled when `onGroupByChange` is supplied. */
  groupBy?: string[];
  onGroupByChange?: (groupBy: string[]) => void;
  showSummary?: boolean;
  toolbar?: boolean;
  /** Show the column chooser in the toolbar. */
  columnChooser?: boolean;
  title?: React.ReactNode;
  density?: DataGridDensity;
  onDensityChange?: (density: DataGridDensity) => void;
  /** Master-detail: render an extra row underneath a record. */
  expandable?: {
    expandedRowRender: (record: T, index: number) => React.ReactNode;
    rowExpandable?: (record: T) => boolean;
    defaultExpandedRowKeys?: (string | number)[];
  };
  /** Windowed rendering for long lists; disables pagination. */
  virtual?: boolean;
  rowHeight?: number;
  /** Body height — required for `virtual`, optional otherwise. */
  height?: number;
  emptyText?: React.ReactNode;
  onRowClick?: (record: T, index: number) => void;
  /** Fires on every sort / filter / page / grouping change. */
  onChange?: (state: DataGridState) => void;
  className?: string;
}

const DENSITY_PADDING: Record<DataGridDensity, string> = {
  compact: "py-1.5 px-2.5 text-xs",
  middle: "py-2.5 px-3 text-sm",
  comfortable: "py-3.5 px-4 text-sm",
};

const DENSITY_ROW_HEIGHT: Record<DataGridDensity, number> = {
  compact: 32,
  middle: 44,
  comfortable: 52,
};

function titleToText(col: DataGridColumn<any>): string {
  if (col.exportTitle) return col.exportTitle;
  if (typeof col.title === "string" || typeof col.title === "number") return String(col.title);
  return col.key;
}

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true });
}

/** One row in the flattened body: either a group header or a record. */
type BodyRow<T> =
  | { kind: "group"; id: string; label: string; column: string; count: number; depth: number }
  | { kind: "record"; id: string; record: T; index: number; depth: number };

export function DataGrid<T extends Record<string, any>>({
  columns: columnsProp,
  dataSource,
  rowKey = "id",
  loading = false,
  pagination = true,
  selectable = true,
  selectedRowKeys: controlledSelectedKeys,
  onSelectionChange,
  groupBy: groupByProp,
  onGroupByChange,
  showSummary = true,
  toolbar = true,
  columnChooser = true,
  title,
  density: densityProp,
  onDensityChange,
  expandable,
  virtual = false,
  rowHeight,
  height,
  emptyText = "No data available",
  onRowClick,
  onChange,
  className,
  ...props
}: DataGridProps<T>) {
  // ---------------------------------------------------------------- column state
  // Layout lives here (order, pin, width, visibility); everything else stays on the prop.
  type Layout = { pin: "left" | "right" | false; width?: number; hidden: boolean };
  const [order, setOrder] = React.useState<string[]>(() => columnsProp.map((c) => c.key));
  const [layout, setLayout] = React.useState<Record<string, Layout>>(() =>
    Object.fromEntries(columnsProp.map((c) => [c.key, { pin: c.pin ?? false, width: undefined, hidden: !!c.hidden }])),
  );

  React.useEffect(() => {
    // a new columns prop adds/removes columns without discarding the user's layout
    setOrder((prev) => {
      const incoming = columnsProp.map((c) => c.key);
      const kept = prev.filter((k) => incoming.includes(k));
      return [...kept, ...incoming.filter((k) => !kept.includes(k))];
    });
    setLayout((prev) => {
      const next: Record<string, Layout> = {};
      for (const c of columnsProp) {
        next[c.key] = prev[c.key] ?? { pin: c.pin ?? false, width: undefined, hidden: !!c.hidden };
      }
      return next;
    });
  }, [columnsProp]);

  const columns = React.useMemo(() => {
    const byKey = new Map(columnsProp.map((c) => [c.key, c]));
    return order.flatMap((key) => {
      const col = byKey.get(key);
      return col ? [{ ...col, pin: layout[key]?.pin ?? false, hidden: layout[key]?.hidden ?? false }] : [];
    });
  }, [columnsProp, order, layout]);

  const visibleColumns = React.useMemo(() => columns.filter((c) => !c.hidden), [columns]);

  // ---------------------------------------------------------------- view state
  const [sortState, setSortState] = React.useState<{ key: string; direction: DataGridSortDirection } | null>(null);
  const [search, setSearch] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<Record<string, string>>({});
  const [internalGroupBy, setInternalGroupBy] = React.useState<string[]>(groupByProp ?? []);
  const groupBy = groupByProp ?? internalGroupBy;
  const [collapsedGroups, setCollapsedGroups] = React.useState<Set<string>>(new Set());
  const [expandedKeys, setExpandedKeys] = React.useState<Set<string | number>>(
    () => new Set(expandable?.defaultExpandedRowKeys ?? []),
  );

  const paginationConfig = typeof pagination === "object" ? pagination : {};
  const paginationEnabled = pagination !== false && !virtual;
  const [internalPage, setInternalPage] = React.useState(paginationConfig.current ?? 1);
  const [pageSize, setPageSize] = React.useState(paginationConfig.pageSize ?? 10);
  const currentPage = paginationConfig.current ?? internalPage;

  React.useEffect(() => {
    if (paginationConfig.pageSize) setPageSize(paginationConfig.pageSize);
  }, [paginationConfig.pageSize]);

  const [internalSelectedKeys, setInternalSelectedKeys] = React.useState<(string | number)[]>([]);
  const selectedKeys = controlledSelectedKeys ?? internalSelectedKeys;

  const [internalDensity, setInternalDensity] = React.useState<DataGridDensity>("middle");
  const density = densityProp ?? internalDensity;
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const bodyRef = React.useRef<HTMLDivElement>(null);
  const headRefs = React.useRef<Record<string, HTMLTableCellElement | null>>({});
  const [pinOffsets, setPinOffsets] = React.useState<Record<string, number>>({});

  const getKey = React.useCallback(
    (record: T, idx: number): string | number => {
      if (typeof rowKey === "function") return rowKey(record);
      return (record[rowKey] as string | number) ?? idx;
    },
    [rowKey],
  );

  const emitChange = (patch: Partial<DataGridState>) => {
    onChange?.({
      page: currentPage,
      pageSize,
      sort: sortState,
      search,
      filters: columnFilters,
      groupBy,
      ...patch,
    });
  };

  const setDensity = (next: DataGridDensity) => {
    if (densityProp === undefined) setInternalDensity(next);
    onDensityChange?.(next);
  };

  const setGroupBy = (next: string[]) => {
    if (groupByProp === undefined) setInternalGroupBy(next);
    onGroupByChange?.(next);
    emitChange({ groupBy: next });
  };

  const setPage = (page: number, size = pageSize) => {
    if (paginationConfig.current === undefined) setInternalPage(page);
    setPageSize(size);
    emitChange({ page, pageSize: size });
  };

  const handleSort = (key: string) => {
    setSortState((prev) => {
      const next: typeof prev =
        !prev || prev.key !== key
          ? { key, direction: "asc" }
          : prev.direction === "asc"
            ? { key, direction: "desc" }
            : null;
      emitChange({ sort: next });
      return next;
    });
  };

  const setColumnFilter = (key: string, query: string) => {
    setColumnFilters((prev) => {
      const next = { ...prev };
      if (query) next[key] = query;
      else delete next[key];
      emitChange({ filters: next });
      return next;
    });
    if (paginationConfig.current === undefined) setInternalPage(1);
  };

  const patchLayout = (key: string, patch: Partial<Layout>) =>
    setLayout((prev) => ({ ...prev, [key]: { ...(prev[key] ?? { pin: false, hidden: false }), ...patch } }));

  // ---------------------------------------------------------------- data pipeline
  const processedData = React.useMemo(() => {
    let result = [...dataSource];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((item) => Object.values(item).some((v) => String(v).toLowerCase().includes(q)));
    }

    for (const [colKey, query] of Object.entries(columnFilters)) {
      if (!query) continue;
      const col = columns.find((c) => c.key === colKey);
      const dataKey = (col?.dataIndex ?? colKey) as keyof T;
      const q = query.toLowerCase();
      result = result.filter((item) => String(item[dataKey] ?? "").toLowerCase().includes(q));
    }

    if (sortState?.direction) {
      const col = columns.find((c) => c.key === sortState.key);
      const dataKey = (col?.dataIndex ?? sortState.key) as keyof T;
      const dir = sortState.direction === "asc" ? 1 : -1;
      result.sort((a, b) => (col?.sorter ? col.sorter(a, b) : compareValues(a[dataKey], b[dataKey])) * dir);
    }

    return result;
  }, [dataSource, search, columnFilters, sortState, columns]);

  const pageData = React.useMemo(() => {
    if (!paginationEnabled) return processedData;
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, paginationEnabled, currentPage, pageSize]);

  /** Group headers are interleaved with their records so one <tbody> can render both. */
  const bodyRows = React.useMemo<BodyRow<T>[]>(() => {
    const indexOf = new Map<T, number>();
    processedData.forEach((r, i) => indexOf.set(r, i));

    if (groupBy.length === 0) {
      return pageData.map((record) => ({
        kind: "record" as const,
        id: String(getKey(record, indexOf.get(record) ?? 0)),
        record,
        index: indexOf.get(record) ?? 0,
        depth: 0,
      }));
    }

    const build = (records: T[], keys: string[], depth: number, path: string): BodyRow<T>[] => {
      if (keys.length === 0) {
        return records.map((record) => ({
          kind: "record" as const,
          id: String(getKey(record, indexOf.get(record) ?? 0)),
          record,
          index: indexOf.get(record) ?? 0,
          depth,
        }));
      }
      const [colKey, ...rest] = keys;
      const col = columns.find((c) => c.key === colKey);
      const dataKey = (col?.dataIndex ?? colKey) as keyof T;
      const buckets = new Map<string, T[]>();
      for (const record of records) {
        const label = String(record[dataKey] ?? "—");
        if (!buckets.has(label)) buckets.set(label, []);
        buckets.get(label)!.push(record);
      }
      return [...buckets.entries()].flatMap(([label, bucket]) => {
        const id = `${path}/${colKey}:${label}`;
        const header: BodyRow<T> = {
          kind: "group",
          id,
          label,
          column: titleToText(col ?? { key: colKey, title: colKey }),
          count: bucket.length,
          depth,
        };
        if (collapsedGroups.has(id)) return [header];
        return [header, ...build(bucket, rest, depth + 1, id)];
      });
    };

    return build(pageData, groupBy, 0, "");
  }, [pageData, processedData, groupBy, collapsedGroups, columns, getKey]);

  // ---------------------------------------------------------------- virtual window
  const effectiveRowHeight = rowHeight ?? DENSITY_ROW_HEIGHT[density];
  const [scrollTop, setScrollTop] = React.useState(0);
  const viewportHeight = height ?? 420;
  const overscan = 6;

  const window_ = React.useMemo(() => {
    if (!virtual) return { start: 0, end: bodyRows.length, padTop: 0, padBottom: 0 };
    const start = Math.max(0, Math.floor(scrollTop / effectiveRowHeight) - overscan);
    const visible = Math.ceil(viewportHeight / effectiveRowHeight) + overscan * 2;
    const end = Math.min(bodyRows.length, start + visible);
    return {
      start,
      end,
      padTop: start * effectiveRowHeight,
      padBottom: Math.max(0, (bodyRows.length - end) * effectiveRowHeight),
    };
  }, [virtual, scrollTop, effectiveRowHeight, viewportHeight, bodyRows.length, overscan]);

  const renderedRows = bodyRows.slice(window_.start, window_.end);

  // ---------------------------------------------------------------- pinned offsets
  React.useLayoutEffect(() => {
    const next: Record<string, number> = {};
    let leftAcc = selectable ? 40 : 0;
    for (const col of visibleColumns) {
      if (col.pin === "left") {
        next[col.key] = leftAcc;
        leftAcc += headRefs.current[col.key]?.offsetWidth ?? 0;
      }
    }
    let rightAcc = 0;
    for (const col of [...visibleColumns].reverse()) {
      if (col.pin === "right") {
        next[col.key] = rightAcc;
        rightAcc += headRefs.current[col.key]?.offsetWidth ?? 0;
      }
    }
    setPinOffsets((prev) => {
      const same =
        Object.keys(next).length === Object.keys(prev).length && Object.entries(next).every(([k, v]) => prev[k] === v);
      return same ? prev : next;
    });
  }, [visibleColumns, layout, selectable, density]);

  // ---------------------------------------------------------------- selection
  const allPageKeys = pageData.map((r, i) => getKey(r, i));
  const allSelected = allPageKeys.length > 0 && allPageKeys.every((k) => selectedKeys.includes(k));
  const someSelected = allPageKeys.some((k) => selectedKeys.includes(k));

  const applySelection = (keys: (string | number)[]) => {
    if (!controlledSelectedKeys) setInternalSelectedKeys(keys);
    const rows = processedData.filter((r, i) => keys.includes(getKey(r, i)));
    onSelectionChange?.(keys, rows);
  };

  const handleSelectAllOnPage = (checked: boolean) => {
    const rest = selectedKeys.filter((k) => !allPageKeys.includes(k));
    applySelection(checked ? [...rest, ...allPageKeys] : rest);
  };

  const handleSelectEverything = () => applySelection(processedData.map((r, i) => getKey(r, i)));

  const handleSelectRow = (key: string | number, checked: boolean) =>
    applySelection(checked ? [...selectedKeys, key] : selectedKeys.filter((k) => k !== key));

  // ---------------------------------------------------------------- export
  const exportCsv = () => {
    const cols = visibleColumns;
    const header = cols.map((c) => `"${titleToText(c).replace(/"/g, '""')}"`).join(",");
    const rows = processedData.map((row) =>
      cols
        .map((c) => {
          const raw = row[(c.dataIndex ?? c.key) as keyof T];
          return `"${String(raw ?? "").replace(/"/g, '""')}"`;
        })
        .join(","),
    );
    const blob = new Blob([`﻿${[header, ...rows].join("\n")}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data-export.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  // ---------------------------------------------------------------- column resize / reorder
  const resizeState = React.useRef<{ key: string; startX: number; startWidth: number } | null>(null);

  const onResizeStart = (e: React.PointerEvent, col: DataGridColumn<T>) => {
    e.preventDefault();
    e.stopPropagation();
    const startWidth = headRefs.current[col.key]?.offsetWidth ?? 120;
    resizeState.current = { key: col.key, startX: e.clientX, startWidth };

    const onMove = (ev: PointerEvent) => {
      const st = resizeState.current;
      if (!st) return;
      const width = Math.max(col.minWidth ?? 56, st.startWidth + (ev.clientX - st.startX));
      patchLayout(st.key, { width });
    };
    const onUp = () => {
      resizeState.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const dragKey = React.useRef<string | null>(null);
  const onHeaderDrop = (targetKey: string) => {
    const from = dragKey.current;
    dragKey.current = null;
    if (!from || from === targetKey) return;
    setOrder((prev) => {
      const next = prev.filter((k) => k !== from);
      next.splice(next.indexOf(targetKey), 0, from);
      return next;
    });
  };

  // ---------------------------------------------------------------- cell chrome
  const padding = DENSITY_PADDING[density];
  const columnCount = visibleColumns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0);

  const pinClass = (col: DataGridColumn<T>, surface: "head" | "body" | "foot") =>
    col.pin
      ? cn(
          "sticky z-20",
          col.pin === "left" ? "border-r border-border" : "border-l border-border",
          surface === "body" ? "bg-bg-container" : "bg-bg-layout",
        )
      : undefined;

  const pinStyle = (col: DataGridColumn<T>): React.CSSProperties | undefined =>
    col.pin ? { [col.pin]: pinOffsets[col.key] ?? 0 } : undefined;

  const summaryFor = (col: DataGridColumn<T>): React.ReactNode => {
    const dataKey = (col.dataIndex ?? col.key) as keyof T;
    const numbers = () => processedData.map((r) => Number(r[dataKey]) || 0);
    if (typeof col.summary === "function") return col.summary(processedData);
    switch (col.summary) {
      case "sum":
        return `Sum: ${numbers().reduce((a, b) => a + b, 0).toLocaleString()}`;
      case "avg": {
        const list = numbers();
        return `Avg: ${list.length ? (list.reduce((a, b) => a + b, 0) / list.length).toFixed(2) : 0}`;
      }
      case "count":
        return `Count: ${processedData.length}`;
      case "min":
        return processedData.length ? `Min: ${Math.min(...numbers())}` : null;
      case "max":
        return processedData.length ? `Max: ${Math.max(...numbers())}` : null;
      default:
        return null;
    }
  };

  const hasSummary = showSummary && visibleColumns.some((c) => c.summary);

  return (
    <div
      data-slot="data-grid"
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border bg-bg-container shadow-xs",
        isFullscreen && "fixed inset-0 z-50 rounded-none border-0",
        className,
      )}
      {...props}
    >
      {toolbar && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-bg-layout px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            {title && <span className="text-sm font-semibold text-text-heading">{title}</span>}
            <Input
              size="sm"
              allowClear
              className="w-56"
              prefix={<Search className="size-3.5 text-text-quaternary" />}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (paginationConfig.current === undefined) setInternalPage(1);
              }}
              placeholder="Search table..."
            />

            {groupBy.length > 0 && (
              <div className="flex items-center gap-1.5">
                {groupBy.map((key) => {
                  const col = columns.find((c) => c.key === key);
                  return (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1 rounded-full bg-primary-bg px-2 py-0.5 text-xs text-primary"
                    >
                      <Layers className="size-3" />
                      {titleToText(col ?? { key, title: key })}
                      <button
                        type="button"
                        aria-label={`Stop grouping by ${key}`}
                        onClick={() => setGroupBy(groupBy.filter((k) => k !== key))}
                        className="rounded-full p-0.5 hover:bg-primary/15"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outlined" onClick={exportCsv} icon={<Download className="size-3.5" />}>
              Export CSV
            </Button>

            {columnChooser && (
              <Dropdown
                trigger={["click"]}
                menu={{
                  items: columns.map((col) => ({
                    key: col.key,
                    label: (
                      <span className="flex items-center gap-2">
                        <Checkbox checked={!col.hidden} skipGroup />
                        {titleToText(col)}
                      </span>
                    ),
                    onClick: () => patchLayout(col.key, { hidden: !col.hidden }),
                  })),
                }}
              >
                <Button size="sm" variant="text" icon={<Columns3 className="size-3.5" />}>
                  Columns
                </Button>
              </Dropdown>
            )}

            <Dropdown
              trigger={["click"]}
              menu={{
                items: (["compact", "middle", "comfortable"] as DataGridDensity[]).map((d) => ({
                  key: d,
                  label: d[0].toUpperCase() + d.slice(1),
                  onClick: () => setDensity(d),
                })),
              }}
            >
              <Button size="sm" variant="text" icon={<Settings2 className="size-3.5" />}>
                Density
              </Button>
            </Dropdown>

            <Button
              size="sm"
              variant="text"
              aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              onClick={() => setIsFullscreen(!isFullscreen)}
              icon={isFullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
            />
          </div>
        </div>
      )}

      {selectable && someSelected && (
        <div className="flex items-center gap-3 border-b border-border bg-primary-bg/50 px-4 py-2 text-xs text-text">
          <span>{selectedKeys.length} selected</span>
          {selectedKeys.length < processedData.length && (
            <button type="button" onClick={handleSelectEverything} className="font-medium text-primary hover:underline">
              Select all {processedData.length}
            </button>
          )}
          <button type="button" onClick={() => applySelection([])} className="text-text-tertiary hover:text-text">
            Clear
          </button>
        </div>
      )}

      <div className="relative flex-1">
        {loading && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-bg-container/70 backdrop-blur-[1px]">
            <Spin />
          </div>
        )}

        <div
          ref={bodyRef}
          onScroll={virtual ? (e) => setScrollTop((e.target as HTMLDivElement).scrollTop) : undefined}
          className="kk-scrollbar overflow-auto"
          style={height ? { height, maxHeight: height } : undefined}
        >
          <table className="w-full border-collapse text-left">
            <colgroup>
              {selectable && <col style={{ width: 40 }} />}
              {expandable && <col style={{ width: 36 }} />}
              {visibleColumns.map((col) => (
                <col
                  key={col.key}
                  style={{ width: layout[col.key]?.width ?? col.width, minWidth: col.minWidth }}
                />
              ))}
            </colgroup>

            <thead className="sticky top-0 z-20">
              <tr className="border-b border-border bg-bg-layout text-xs font-semibold text-text-secondary">
                {selectable && (
                  <th className="w-10 bg-bg-layout p-3 text-center">
                    <Checkbox
                      checked={allSelected}
                      indeterminate={!allSelected && someSelected}
                      onChange={(e) => handleSelectAllOnPage(e.target.checked)}
                      skipGroup
                    />
                  </th>
                )}
                {expandable && <th className="bg-bg-layout p-3" />}

                {visibleColumns.map((col) => {
                  const isSorted = sortState?.key === col.key;
                  const filterValue = columnFilters[col.key] ?? "";
                  return (
                    <th
                      key={col.key}
                      ref={(node) => {
                        headRefs.current[col.key] = node;
                      }}
                      draggable
                      onDragStart={() => (dragKey.current = col.key)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => onHeaderDrop(col.key)}
                      style={{ ...pinStyle(col), minWidth: col.minWidth }}
                      className={cn(
                        "group relative select-none bg-bg-layout p-3",
                        col.align === "right" && "text-right",
                        col.align === "center" && "text-center",
                        pinClass(col, "head"),
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center gap-1.5",
                          col.align === "right" && "justify-end",
                          col.align === "center" && "justify-center",
                        )}
                      >
                        <GripVertical className="size-3 cursor-grab text-text-quaternary opacity-0 transition-opacity group-hover:opacity-100" />
                        <span className="truncate">{col.title}</span>

                        {col.sortable !== false && (
                          <button
                            type="button"
                            aria-label={`Sort by ${titleToText(col)}`}
                            onClick={() => handleSort(col.key)}
                            className="cursor-pointer text-text-quaternary hover:text-text"
                          >
                            {isSorted && sortState?.direction === "asc" ? (
                              <ChevronUp className="size-3.5 text-primary" />
                            ) : isSorted && sortState?.direction === "desc" ? (
                              <ChevronDown className="size-3.5 text-primary" />
                            ) : (
                              <ChevronsUpDown className="size-3.5 opacity-40 hover:opacity-100" />
                            )}
                          </button>
                        )}

                        {col.filterable && (
                          <Dropdown
                            trigger={["click"]}
                            popupRender={() => (
                              <div className="w-48 rounded-lg border border-border bg-bg-elevated p-2 shadow-kk">
                                <Input
                                  autoFocus
                                  size="sm"
                                  value={filterValue}
                                  onChange={(e) => setColumnFilter(col.key, e.target.value)}
                                  placeholder={`Filter ${titleToText(col)}`}
                                />
                                {filterValue && (
                                  <button
                                    type="button"
                                    onClick={() => setColumnFilter(col.key, "")}
                                    className="mt-1.5 text-xs text-primary hover:underline"
                                  >
                                    Clear filter
                                  </button>
                                )}
                              </div>
                            )}
                          >
                            <button
                              type="button"
                              aria-label={`Filter ${titleToText(col)}`}
                              className={cn(
                                "text-text-quaternary hover:text-text",
                                filterValue && "text-primary hover:text-primary",
                              )}
                            >
                              <Filter className="size-3" />
                            </button>
                          </Dropdown>
                        )}

                        <Dropdown
                          trigger={["click"]}
                          menu={{
                            items: [
                              { key: "pin-left", label: "Pin left", onClick: () => patchLayout(col.key, { pin: "left" }) },
                              {
                                key: "pin-right",
                                label: "Pin right",
                                onClick: () => patchLayout(col.key, { pin: "right" }),
                              },
                              { key: "unpin", label: "Unpin", onClick: () => patchLayout(col.key, { pin: false }) },
                              ...(col.groupable
                                ? [
                                    {
                                      key: "group",
                                      label: groupBy.includes(col.key) ? "Stop grouping" : "Group by this column",
                                      onClick: () =>
                                        setGroupBy(
                                          groupBy.includes(col.key)
                                            ? groupBy.filter((k) => k !== col.key)
                                            : [...groupBy, col.key],
                                        ),
                                    },
                                  ]
                                : []),
                              { key: "hide", label: "Hide column", onClick: () => patchLayout(col.key, { hidden: true }) },
                            ],
                          }}
                        >
                          <button
                            type="button"
                            aria-label={`${titleToText(col)} options`}
                            className="text-text-quaternary opacity-0 transition-opacity hover:text-text group-hover:opacity-100"
                          >
                            <MoreVertical className="size-3" />
                          </button>
                        </Dropdown>
                      </div>

                      {col.resizable !== false && (
                        <span
                          role="separator"
                          aria-orientation="vertical"
                          onPointerDown={(e) => onResizeStart(e, col)}
                          className="absolute inset-y-0 right-0 w-1 cursor-col-resize bg-transparent hover:bg-primary/40"
                        />
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-border-secondary">
              {virtual && window_.padTop > 0 && (
                <tr aria-hidden style={{ height: window_.padTop }}>
                  <td colSpan={columnCount} />
                </tr>
              )}

              {bodyRows.length === 0 && !loading ? (
                <tr>
                  <td colSpan={columnCount} className="py-12 text-center text-xs text-text-tertiary">
                    {emptyText}
                  </td>
                </tr>
              ) : (
                renderedRows.map((row) => {
                  if (row.kind === "group") {
                    const collapsed = collapsedGroups.has(row.id);
                    return (
                      <tr key={row.id} className="bg-bg-layout/70">
                        <td colSpan={columnCount} className="px-3 py-2">
                          <button
                            type="button"
                            aria-expanded={!collapsed}
                            onClick={() =>
                              setCollapsedGroups((prev) => {
                                const next = new Set(prev);
                                if (next.has(row.id)) next.delete(row.id);
                                else next.add(row.id);
                                return next;
                              })
                            }
                            className="flex items-center gap-1.5 text-xs font-semibold text-text"
                            style={{ paddingLeft: row.depth * 16 }}
                          >
                            {collapsed ? <ChevronRight className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                            <span className="text-text-tertiary">{row.column}:</span>
                            {row.label}
                            <span className="font-normal text-text-quaternary">({row.count})</span>
                          </button>
                        </td>
                      </tr>
                    );
                  }

                  const key = getKey(row.record, row.index);
                  const isSelected = selectedKeys.includes(key);
                  const canExpand = expandable ? (expandable.rowExpandable?.(row.record) ?? true) : false;
                  const isExpanded = expandedKeys.has(key);

                  return (
                    <React.Fragment key={row.id}>
                      <tr
                        onClick={() => onRowClick?.(row.record, row.index)}
                        style={virtual ? { height: effectiveRowHeight } : undefined}
                        className={cn(
                          "transition-colors hover:bg-fill-tertiary/50",
                          isSelected && "bg-primary-bg/30 hover:bg-primary-bg/50",
                          onRowClick && "cursor-pointer",
                        )}
                      >
                        {selectable && (
                          <td className="bg-bg-container p-3 text-center">
                            <Checkbox
                              checked={isSelected}
                              onChange={(e) => handleSelectRow(key, e.target.checked)}
                              skipGroup
                            />
                          </td>
                        )}

                        {expandable && (
                          <td className="bg-bg-container p-3">
                            {canExpand && (
                              <button
                                type="button"
                                aria-label={isExpanded ? "Collapse row" : "Expand row"}
                                aria-expanded={isExpanded}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedKeys((prev) => {
                                    const next = new Set(prev);
                                    if (next.has(key)) next.delete(key);
                                    else next.add(key);
                                    return next;
                                  });
                                }}
                                className="text-text-tertiary hover:text-text"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="size-3.5" />
                                ) : (
                                  <ChevronRight className="size-3.5" />
                                )}
                              </button>
                            )}
                          </td>
                        )}

                        {visibleColumns.map((col, colIdx) => {
                          const dataKey = (col.dataIndex ?? col.key) as keyof T;
                          const val = row.record[dataKey];
                          return (
                            <td
                              key={col.key}
                              style={pinStyle(col)}
                              className={cn(
                                padding,
                                "bg-bg-container text-text",
                                col.align === "right" && "text-right",
                                col.align === "center" && "text-center",
                                pinClass(col, "body"),
                              )}
                            >
                              <span
                                className="block"
                                style={colIdx === 0 && groupBy.length ? { paddingLeft: row.depth * 16 } : undefined}
                              >
                                {col.render ? col.render(val, row.record, row.index) : (val as React.ReactNode)}
                              </span>
                            </td>
                          );
                        })}
                      </tr>

                      {expandable && isExpanded && canExpand && (
                        <tr className="bg-bg-layout/40">
                          <td colSpan={columnCount} className="px-4 py-3">
                            {expandable.expandedRowRender(row.record, row.index)}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}

              {virtual && window_.padBottom > 0 && (
                <tr aria-hidden style={{ height: window_.padBottom }}>
                  <td colSpan={columnCount} />
                </tr>
              )}
            </tbody>

            {hasSummary && (
              <tfoot className="sticky bottom-0">
                <tr className="border-t-2 border-border bg-bg-layout font-semibold text-text">
                  {selectable && <td className="bg-bg-layout p-3 text-center text-xs">Total</td>}
                  {expandable && <td className="bg-bg-layout p-3" />}
                  {visibleColumns.map((col) => (
                    <td
                      key={col.key}
                      style={pinStyle(col)}
                      className={cn(
                        "bg-bg-layout p-3 text-xs",
                        col.align === "right" && "text-right",
                        col.align === "center" && "text-center",
                        pinClass(col, "foot"),
                      )}
                    >
                      {summaryFor(col)}
                    </td>
                  ))}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {paginationEnabled && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-bg-layout px-4 py-3 text-xs text-text-secondary">
          <span>
            Showing {processedData.length === 0 ? 0 : Math.min((currentPage - 1) * pageSize + 1, processedData.length)} to{" "}
            {Math.min(currentPage * pageSize, processedData.length)} of {processedData.length} entries
          </span>

          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={processedData.length}
            pageSizeOptions={paginationConfig.pageSizeOptions}
            onChange={(page, size) => setPage(page, size)}
          />
        </div>
      )}
    </div>
  );
}
