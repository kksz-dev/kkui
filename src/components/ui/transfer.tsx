import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  Trash2,
} from "lucide-react";
import { Dropdown } from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "@/components/ui/pagination";

export type TransferDirection = "left" | "right";

export interface TransferItem {
  key: string;
  title?: string;
  description?: string;
  disabled?: boolean;
  tag?: string;
  [key: string]: unknown;
}

export type TransferRender<T = TransferItem> = (
  item: T
) => React.ReactNode | { label: React.ReactNode; value: string };

export interface TransferLocale {
  itemUnit?: string;
  itemsUnit?: string;
  searchPlaceholder?: string;
  notFoundContent?: React.ReactNode;
  selectAll?: string;
  selectInvert?: string;
  selectCurrent?: string;
  removeAll?: string;
  removeCurrent?: string;
}

export interface TransferListProps<T = TransferItem> {
  direction: TransferDirection;
  title?: React.ReactNode;
  dataSource: T[];
  selectedKeys: string[];
  targetKeys: string[];
  disabled?: boolean;
  showSearch?: boolean | { placeholder?: string; defaultValue?: string };
  filterOption?: (inputValue: string, item: T, direction: TransferDirection) => boolean;
  onSearch?: (direction: TransferDirection, value: string) => void;
  onItemSelect: (key: string, checked: boolean) => void;
  onItemSelectAll: (keys: string[], checked: boolean) => void;
  onItemRemove?: (keys: string[]) => void;
  render?: TransferRender<T>;
  showSelectAll?: boolean;
  selectAllLabel?: React.ReactNode | ((info: { selectedCount: number; totalCount: number }) => React.ReactNode);
  selectionsIcon?: React.ReactNode;
  footer?: (props: TransferListProps<T>, info?: { direction: TransferDirection }) => React.ReactNode;
  pagination?: boolean | { pageSize?: number; simple?: boolean; showSizeChanger?: boolean; showLessItems?: boolean };
  listStyle?: React.CSSProperties | ((params: { direction: TransferDirection }) => React.CSSProperties);
  locale?: TransferLocale;
  onScroll?: (direction: TransferDirection, e: React.UIEvent<HTMLUListElement>) => void;
  oneWay?: boolean;
  children?: (props: TransferListBodyProps<T>) => React.ReactNode;
  status?: "error" | "warning";
}

export interface TransferListBodyProps<T = TransferItem> {
  direction: TransferDirection;
  filteredItems: T[];
  selectedKeys: string[];
  onItemSelect: (key: string, checked: boolean) => void;
  onItemSelectAll: (keys: string[], checked: boolean) => void;
  disabled?: boolean;
}

export interface TransferProps<T = TransferItem>
  extends Omit<React.ComponentProps<"div">, "onChange" | "children" | "titles" | "onScroll"> {
  dataSource?: T[];
  targetKeys?: string[];
  defaultTargetKeys?: string[];
  onChange?: (targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => void;
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  onSelectChange?: (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => void;
  render?: TransferRender<T>;
  titles?: [React.ReactNode, React.ReactNode];
  operations?: [React.ReactNode, React.ReactNode];
  operationStyle?: React.CSSProperties;
  showSearch?: boolean | { placeholder?: string; defaultValue?: string };
  filterOption?: (inputValue: string, item: T, direction: TransferDirection) => boolean;
  showSelectAll?: boolean;
  selectAllLabels?: [
    React.ReactNode | ((info: { selectedCount: number; totalCount: number }) => React.ReactNode),
    React.ReactNode | ((info: { selectedCount: number; totalCount: number }) => React.ReactNode),
  ];
  selectionsIcon?: React.ReactNode;
  oneWay?: boolean;
  pagination?: boolean | { pageSize?: number; simple?: boolean; showSizeChanger?: boolean; showLessItems?: boolean };
  listStyle?: React.CSSProperties | ((params: { direction: TransferDirection }) => React.CSSProperties);
  disabled?: boolean;
  status?: "error" | "warning";
  footer?: (props: TransferListProps<T>, info?: { direction: TransferDirection }) => React.ReactNode;
  onScroll?: (direction: TransferDirection, e: React.UIEvent<HTMLUListElement>) => void;
  onSearch?: (direction: TransferDirection, value: string) => void;
  locale?: TransferLocale;
  rowKey?: (item: T) => string;
  children?: (props: TransferListBodyProps<T>) => React.ReactNode;
}

const defaultLocale: TransferLocale = {
  itemUnit: "item",
  itemsUnit: "items",
  searchPlaceholder: "Search here",
  notFoundContent: "No data",
  selectAll: "Select all",
  selectInvert: "Invert current page",
  removeAll: "Remove all",
  removeCurrent: "Remove current page",
};

function defaultFilterOption<T extends TransferItem>(
  inputValue: string,
  item: T
): boolean {
  const query = inputValue.toLowerCase().trim();
  if (!query) return true;
  const title = item.title ? String(item.title).toLowerCase() : "";
  const desc = item.description ? String(item.description).toLowerCase() : "";
  const key = String(item.key).toLowerCase();
  return title.includes(query) || desc.includes(query) || key.includes(query);
}

function TransferList<T extends TransferItem>({
  direction,
  title,
  dataSource,
  selectedKeys,
  disabled = false,
  showSearch = false,
  filterOption = defaultFilterOption,
  onSearch,
  onItemSelect,
  onItemSelectAll,
  onItemRemove,
  render,
  showSelectAll = true,
  selectAllLabel,
  selectionsIcon,
  footer,
  pagination,
  listStyle,
  locale = defaultLocale,
  onScroll,
  oneWay = false,
  children,
  status,
}: TransferListProps<T>) {
  const mergedLocale = { ...defaultLocale, ...locale };
  const [searchValue, setSearchValue] = React.useState<string>(() => {
    if (typeof showSearch === "object" && showSearch.defaultValue) {
      return showSearch.defaultValue;
    }
    return "";
  });

  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = typeof pagination === "object" && pagination.pageSize ? pagination.pageSize : 10;

  // Filter items
  const filteredItems = React.useMemo(() => {
    return dataSource.filter((item) => {
      if (!searchValue) return true;
      return filterOption(searchValue, item, direction);
    });
  }, [dataSource, searchValue, filterOption, direction]);

  // Paginated items
  const displayItems = React.useMemo(() => {
    if (!pagination) return filteredItems;
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, pagination, currentPage, pageSize]);

  // Total and selected counts
  const enabledFilteredItems = filteredItems.filter((i) => !i.disabled);
  const selectedCount = enabledFilteredItems.filter((i) => selectedKeys.includes(i.key)).length;
  const totalCount = filteredItems.length;
  const enabledTotalCount = enabledFilteredItems.length;

  const isAllChecked = enabledTotalCount > 0 && selectedCount === enabledTotalCount;
  const isIndeterminate = selectedCount > 0 && selectedCount < enabledTotalCount;

  const handleSelectAllChange = (checked: boolean) => {
    const keysToToggle = enabledFilteredItems.map((i) => i.key);
    onItemSelectAll(keysToToggle, checked);
  };

  const handleInvert = () => {
    const keysToToggle = displayItems.filter((i) => !i.disabled).map((i) => i.key);
    const unselected = keysToToggle.filter((k) => !selectedKeys.includes(k));
    const selected = keysToToggle.filter((k) => selectedKeys.includes(k));
    // deselect selected, select unselected
    onItemSelectAll(selected, false);
    onItemSelectAll(unselected, true);
  };

  const handleRemoveAll = () => {
    if (onItemRemove) {
      onItemRemove(filteredItems.filter((i) => !i.disabled).map((i) => i.key));
    }
  };

  const computedStyle = typeof listStyle === "function" ? listStyle({ direction }) : listStyle;

  // Render header count label
  let countLabel: React.ReactNode = null;
  if (selectAllLabel) {
    if (typeof selectAllLabel === "function") {
      countLabel = selectAllLabel({ selectedCount, totalCount });
    } else {
      countLabel = selectAllLabel;
    }
  } else {
    const unit = totalCount <= 1 ? mergedLocale.itemUnit : mergedLocale.itemsUnit;
    countLabel = (
      <span>
        {selectedCount > 0 ? `${selectedCount}/${totalCount}` : totalCount} {unit}
      </span>
    );
  }

  const searchPlaceholder =
    typeof showSearch === "object" && showSearch.placeholder
      ? showSearch.placeholder
      : mergedLocale.searchPlaceholder;

  return (
    <div
      data-slot="transfer-list"
      data-direction={direction}
      data-status={status}
      style={computedStyle}
      className={cn(
        "flex h-[240px] w-[200px] flex-col rounded-lg border border-border bg-bg-container text-sm transition-colors",
        status === "error" && "border-error ring-1 ring-error/20",
        status === "warning" && "border-warning ring-1 ring-warning/20",
        disabled && "border-border bg-bg-container-disabled cursor-not-allowed opacity-60"
      )}
    >
      {/* Header */}
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-border-secondary px-3 text-text">
        <div className="flex items-center gap-1.5 min-w-0">
          {showSelectAll && (
            <Checkbox
              checked={isAllChecked}
              indeterminate={isIndeterminate}
              disabled={disabled || enabledTotalCount === 0}
              onChange={(e) => handleSelectAllChange(e.target.checked)}
            />
          )}
          {selectionsIcon !== false && (
            <Dropdown
              disabled={disabled}
              trigger={["click"]}
              menu={{
                items: [
                  {
                    key: "all",
                    label: mergedLocale.selectAll,
                    onClick: () => handleSelectAllChange(true),
                  },
                  {
                    key: "invert",
                    label: mergedLocale.selectInvert,
                    onClick: handleInvert,
                  },
                  ...(direction === "right" && oneWay
                    ? [
                        {
                          key: "remove-all",
                          label: mergedLocale.removeAll,
                          danger: true,
                          onClick: handleRemoveAll,
                        },
                      ]
                    : []),
                ],
              }}
            >
              <button
                type="button"
                disabled={disabled}
                aria-label="Selections menu"
                className="inline-flex size-4 cursor-pointer items-center justify-center text-text-tertiary hover:text-text focus:outline-none"
              >
                {selectionsIcon ?? <ChevronDown className="size-3" />}
              </button>
            </Dropdown>
          )}
          <span className="truncate text-xs text-text-secondary">{countLabel}</span>
        </div>
        {title && <span className="shrink-0 text-xs font-semibold text-text-heading">{title}</span>}
      </div>

      {/* Search Input */}
      {showSearch && (
        <div className="border-b border-border-secondary p-2">
          <Input
            size="sm"
            allowClear
            disabled={disabled}
            value={searchValue}
            placeholder={searchPlaceholder}
            prefix={<Search className="size-3.5 text-text-tertiary" />}
            onChange={(e) => {
              const val = e.target.value;
              setSearchValue(val);
              setCurrentPage(1);
              onSearch?.(direction, val);
            }}
            onClear={() => {
              setSearchValue("");
              setCurrentPage(1);
              onSearch?.(direction, "");
            }}
          />
        </div>
      )}

      {/* Body */}
      <div className="flex-1 overflow-hidden">
        {children ? (
          children({
            direction,
            filteredItems,
            selectedKeys,
            onItemSelect,
            onItemSelectAll,
            disabled,
          })
        ) : displayItems.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center py-6 text-xs text-text-quaternary">
            {mergedLocale.notFoundContent}
          </div>
        ) : (
          <ul
            onScroll={(e) => onScroll?.(direction, e)}
            className="h-full overflow-y-auto kk-scrollbar py-1"
          >
            {displayItems.map((item) => {
              const isSelected = selectedKeys.includes(item.key);
              const isItemDisabled = disabled || item.disabled;

              let rendered: React.ReactNode = item.title ?? item.key;
              if (render) {
                const r = render(item);
                if (r && typeof r === "object" && "label" in r) {
                  rendered = (r as { label: React.ReactNode }).label;
                } else {
                  rendered = r as React.ReactNode;
                }
              }

              return (
                <li
                  key={item.key}
                  data-slot="transfer-item"
                  onClick={() => {
                    if (!isItemDisabled) {
                      onItemSelect(item.key, !isSelected);
                    }
                  }}
                  className={cn(
                    "group flex items-center justify-between px-3 py-1.5 text-xs text-text transition-colors",
                    !isItemDisabled && "cursor-pointer hover:bg-fill-tertiary",
                    isSelected && !isItemDisabled && "bg-primary-bg/30 text-primary",
                    isItemDisabled && "cursor-not-allowed opacity-40 text-text-disabled"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {!(direction === "right" && oneWay) && (
                      <Checkbox
                        checked={isSelected}
                        disabled={isItemDisabled}
                        onChange={(e) => onItemSelect(item.key, e.target.checked)}
                      />
                    )}
                    <span className="truncate flex-1">{rendered}</span>
                  </div>

                  {direction === "right" && oneWay && (
                    <button
                      type="button"
                      disabled={isItemDisabled}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isItemDisabled && onItemRemove) {
                          onItemRemove([item.key]);
                        }
                      }}
                      className="ml-1 inline-flex size-4 shrink-0 items-center justify-center text-text-quaternary hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Pagination if enabled */}
      {pagination && filteredItems.length > pageSize && (
        <div className="shrink-0 border-t border-border-secondary p-1 flex justify-end">
          <Pagination
            size="small"
            simple
            current={currentPage}
            pageSize={pageSize}
            total={filteredItems.length}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Footer */}
      {footer && (
        <div className="shrink-0 border-t border-border-secondary p-1.5 text-xs">
          {footer(
            {
              direction,
              title,
              dataSource,
              selectedKeys,
              targetKeys: [],
              disabled,
              onItemSelect,
              onItemSelectAll,
            },
            { direction }
          )}
        </div>
      )}
    </div>
  );
}

function Transfer<T extends TransferItem = TransferItem>({
  dataSource = [],
  targetKeys: targetKeysProp,
  defaultTargetKeys = [],
  onChange,
  selectedKeys: selectedKeysProp,
  defaultSelectedKeys = [],
  onSelectChange,
  render,
  titles = ["", ""],
  operations = ["", ""],
  operationStyle,
  showSearch = false,
  filterOption,
  showSelectAll = true,
  selectAllLabels,
  selectionsIcon,
  oneWay = false,
  pagination = false,
  listStyle,
  disabled = false,
  status,
  footer,
  onScroll,
  onSearch,
  locale,
  rowKey = (item: T) => item.key,
  children,
  className,
  style,
  ...props
}: TransferProps<T>) {
  // Target keys (right pane keys)
  const [innerTargetKeys, setInnerTargetKeys] = React.useState<string[]>(defaultTargetKeys);
  const targetKeys = targetKeysProp ?? innerTargetKeys;
  const targetKeySet = React.useMemo(() => new Set(targetKeys), [targetKeys]);

  // Selected keys
  const [innerSelectedKeys, setInnerSelectedKeys] = React.useState<string[]>(defaultSelectedKeys);
  const selectedKeys = selectedKeysProp ?? innerSelectedKeys;

  // Split source and target items
  const { leftDataSource, rightDataSource } = React.useMemo(() => {
    const left: T[] = [];
    const right: T[] = [];
    dataSource.forEach((item) => {
      const k = rowKey(item);
      const normalizedItem = { ...item, key: k };
      if (targetKeySet.has(k)) {
        right.push(normalizedItem);
      } else {
        left.push(normalizedItem);
      }
    });
    return { leftDataSource: left, rightDataSource: right };
  }, [dataSource, targetKeySet, rowKey]);

  // Split selected keys into left and right
  const sourceSelectedKeys = React.useMemo(() => {
    return selectedKeys.filter((k) => !targetKeySet.has(k));
  }, [selectedKeys, targetKeySet]);

  const targetSelectedKeys = React.useMemo(() => {
    return selectedKeys.filter((k) => targetKeySet.has(k));
  }, [selectedKeys, targetKeySet]);

  // Selection handlers
  const handleItemSelect = (_direction: TransferDirection, key: string, checked: boolean) => {
    let nextSelected: string[];
    if (checked) {
      nextSelected = [...selectedKeys, key];
    } else {
      nextSelected = selectedKeys.filter((k) => k !== key);
    }

    if (selectedKeysProp === undefined) {
      setInnerSelectedKeys(nextSelected);
    }

    const nextSource = nextSelected.filter((k) => !targetKeySet.has(k));
    const nextTarget = nextSelected.filter((k) => targetKeySet.has(k));
    onSelectChange?.(nextSource, nextTarget);
  };

  const handleItemSelectAll = (_direction: TransferDirection, keys: string[], checked: boolean) => {
    const keySet = new Set(keys);
    let nextSelected: string[];
    if (checked) {
      const set = new Set([...selectedKeys, ...keys]);
      nextSelected = Array.from(set);
    } else {
      nextSelected = selectedKeys.filter((k) => !keySet.has(k));
    }

    if (selectedKeysProp === undefined) {
      setInnerSelectedKeys(nextSelected);
    }

    const nextSource = nextSelected.filter((k) => !targetKeySet.has(k));
    const nextTarget = nextSelected.filter((k) => targetKeySet.has(k));
    onSelectChange?.(nextSource, nextTarget);
  };

  // Move operations
  const moveToRight = () => {
    const moveKeys = sourceSelectedKeys;
    if (moveKeys.length === 0) return;

    const nextTargetKeys = [...targetKeys, ...moveKeys];
    if (targetKeysProp === undefined) {
      setInnerTargetKeys(nextTargetKeys);
    }

    // clear moved keys from selected
    const nextSelected = selectedKeys.filter((k) => !moveKeys.includes(k));
    if (selectedKeysProp === undefined) {
      setInnerSelectedKeys(nextSelected);
    }

    onChange?.(nextTargetKeys, "right", moveKeys);
    const nextSource = nextSelected.filter((k) => !new Set(nextTargetKeys).has(k));
    const nextTarget = nextSelected.filter((k) => new Set(nextTargetKeys).has(k));
    onSelectChange?.(nextSource, nextTarget);
  };

  const moveToLeft = () => {
    const moveKeys = targetSelectedKeys;
    if (moveKeys.length === 0) return;

    const removeSet = new Set(moveKeys);
    const nextTargetKeys = targetKeys.filter((k) => !removeSet.has(k));
    if (targetKeysProp === undefined) {
      setInnerTargetKeys(nextTargetKeys);
    }

    // clear moved keys from selected
    const nextSelected = selectedKeys.filter((k) => !removeSet.has(k));
    if (selectedKeysProp === undefined) {
      setInnerSelectedKeys(nextSelected);
    }

    onChange?.(nextTargetKeys, "left", moveKeys);
    const nextSource = nextSelected.filter((k) => !new Set(nextTargetKeys).has(k));
    const nextTarget = nextSelected.filter((k) => new Set(nextTargetKeys).has(k));
    onSelectChange?.(nextSource, nextTarget);
  };

  const handleItemRemove = (keys: string[]) => {
    const removeSet = new Set(keys);
    const nextTargetKeys = targetKeys.filter((k) => !removeSet.has(k));
    if (targetKeysProp === undefined) {
      setInnerTargetKeys(nextTargetKeys);
    }

    const nextSelected = selectedKeys.filter((k) => !removeSet.has(k));
    if (selectedKeysProp === undefined) {
      setInnerSelectedKeys(nextSelected);
    }

    onChange?.(nextTargetKeys, "left", keys);
    const nextSource = nextSelected.filter((k) => !new Set(nextTargetKeys).has(k));
    const nextTarget = nextSelected.filter((k) => new Set(nextTargetKeys).has(k));
    onSelectChange?.(nextSource, nextTarget);
  };

  return (
    <div
      data-slot="transfer"
      data-disabled={disabled || undefined}
      style={style}
      className={cn("inline-flex items-center gap-3 text-text", className)}
      {...props}
    >
      {/* Left List */}
      <TransferList
        direction="left"
        title={titles[0]}
        dataSource={leftDataSource}
        selectedKeys={sourceSelectedKeys}
        targetKeys={targetKeys}
        disabled={disabled}
        showSearch={showSearch}
        filterOption={filterOption}
        onSearch={onSearch}
        onItemSelect={(key, checked) => handleItemSelect("left", key, checked)}
        onItemSelectAll={(keys, checked) => handleItemSelectAll("left", keys, checked)}
        render={render}
        showSelectAll={showSelectAll}
        selectAllLabel={selectAllLabels?.[0]}
        selectionsIcon={selectionsIcon}
        footer={footer}
        pagination={pagination}
        listStyle={listStyle}
        locale={locale}
        onScroll={onScroll}
        status={status}
        children={children}
      />

      {/* Operation Buttons */}
      <div
        data-slot="transfer-operations"
        style={operationStyle}
        className="flex flex-col items-center justify-center gap-2"
      >
        <Button
          type="primary"
          size="sm"
          disabled={disabled || sourceSelectedKeys.length === 0}
          onClick={moveToRight}
          aria-label="Move right"
        >
          {operations[0] ? operations[0] : <ChevronRight className="size-3.5" />}
        </Button>
        {!oneWay && (
          <Button
            type="primary"
            size="sm"
            disabled={disabled || targetSelectedKeys.length === 0}
            onClick={moveToLeft}
            aria-label="Move left"
          >
            {operations[1] ? operations[1] : <ChevronLeft className="size-3.5" />}
          </Button>
        )}
      </div>

      {/* Right List */}
      <TransferList
        direction="right"
        title={titles[1]}
        dataSource={rightDataSource}
        selectedKeys={targetSelectedKeys}
        targetKeys={targetKeys}
        disabled={disabled}
        showSearch={showSearch}
        filterOption={filterOption}
        onSearch={onSearch}
        onItemSelect={(key, checked) => handleItemSelect("right", key, checked)}
        onItemSelectAll={(keys, checked) => handleItemSelectAll("right", keys, checked)}
        onItemRemove={handleItemRemove}
        render={render}
        showSelectAll={showSelectAll}
        selectAllLabel={selectAllLabels?.[1]}
        selectionsIcon={selectionsIcon}
        footer={footer}
        pagination={pagination}
        listStyle={listStyle}
        locale={locale}
        onScroll={onScroll}
        oneWay={oneWay}
        status={status}
        children={children}
      />
    </div>
  );
}

export { Transfer, TransferList };
