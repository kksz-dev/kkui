import * as React from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Ellipsis } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useBreakpoint } from "@/hooks/use-breakpoint";

/**
 * Pagination — KKUI semantics (current/pageSize controlled + uncontrolled, size changer,
 * quick jumper, simple mode, itemRender…). Size changer is a small KKUI dropdown menu.
 */
export type PaginationItemType = "page" | "prev" | "next" | "jump-prev" | "jump-next";

export interface PaginationProps extends Omit<React.ComponentProps<"ul">, "onChange"> {
  current?: number;
  defaultCurrent?: number;
  total?: number;
  pageSize?: number;
  defaultPageSize?: number;
  onChange?: (page: number, pageSize: number) => void;
  /** Show page-size select. Default: total > totalBoundaryShowSizeChanger */
  showSizeChanger?: boolean | { options?: number[]; disabled?: boolean };
  pageSizeOptions?: (number | string)[];
  onShowSizeChange?: (current: number, size: number) => void;
  showQuickJumper?: boolean | { goButton: React.ReactNode | true };
  showTotal?: (total: number, range: [number, number]) => React.ReactNode;
  /** Simple mode: `< 1 / 50 >` */
  simple?: boolean | { readOnly?: boolean };
  size?: "default" | "small";
  disabled?: boolean;
  hideOnSinglePage?: boolean;
  itemRender?: (page: number, type: PaginationItemType, originalElement: React.ReactNode) => React.ReactNode;
  showLessItems?: boolean;
  showTitle?: boolean;
  align?: "start" | "center" | "end";
  /** Under 576px: switch to simple mode and hide the size changer / quick jumper */
  responsive?: boolean;
  totalBoundaryShowSizeChanger?: number;
  /** Text after the page-size number in the changer */
  locale?: { items_per_page?: string; jump_to?: string; page?: string; prev_page?: string; next_page?: string };
}

function useControlled<T>(value: T | undefined, defaultValue: T): [T, (v: T) => void] {
  const [inner, setInner] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const v = isControlled ? value : inner;
  const set = React.useCallback(
    (n: T) => {
      if (!isControlled) setInner(n);
    },
    [isControlled],
  );
  return [v, set];
}

const itemBase =
  "inline-flex select-none items-center justify-center rounded-md border border-transparent text-sm text-text transition-[color,background-color,border-color] duration-mid ease-kk-in-out outline-none focus-visible:ring-[3px] focus-visible:ring-primary/30";

function Pagination({
  current: currentProp,
  defaultCurrent = 1,
  total = 0,
  pageSize: pageSizeProp,
  defaultPageSize = 10,
  onChange,
  showSizeChanger: showSizeChangerProp,
  pageSizeOptions = [10, 20, 50, 100],
  onShowSizeChange,
  showQuickJumper = false,
  showTotal,
  simple = false,
  size = "default",
  disabled = false,
  hideOnSinglePage = false,
  itemRender = (_p, _t, el) => el,
  showLessItems = false,
  showTitle = true,
  align = "start",
  responsive = false,
  totalBoundaryShowSizeChanger = 50,
  locale,
  className,
  ...props
}: PaginationProps) {
  const [pageSize, setPageSize] = useControlled(pageSizeProp, defaultPageSize);
  const allPages = Math.max(1, Math.ceil(total / pageSize));
  const [rawCurrent, setCurrent] = useControlled(currentProp, defaultCurrent);
  const current = Math.min(Math.max(1, rawCurrent), allPages);
  const [jumpValue, setJumpValue] = React.useState("");
  const [simpleValue, setSimpleValue] = React.useState<string | null>(null);

  // `responsive` collapses the whole pager to simple mode on narrow screens,
  // read from the shared breakpoint store
  const screens = useBreakpoint();
  const narrow = Boolean(responsive && screens.xs);

  const small = size === "small";
  const isSimple = Boolean(simple) || (responsive && narrow);
  const readOnly = typeof simple === "object" && simple.readOnly;
  const t = {
    items_per_page: "/ page",
    jump_to: "Go to",
    page: "Page",
    prev_page: "Previous Page",
    next_page: "Next Page",
    ...locale,
  };

  const goTo = (page: number) => {
    const p = Math.min(Math.max(1, page), allPages);
    if (disabled || p === current) return;
    setCurrent(p);
    onChange?.(p, pageSize);
  };

  const changePageSize = (s: number) => {
    const newCurrent = Math.min(current, Math.max(1, Math.ceil(total / s)));
    setPageSize(s);
    onShowSizeChange?.(newCurrent, s);
    if (newCurrent !== current) setCurrent(newCurrent);
    onChange?.(newCurrent, s);
  };

  if (hideOnSinglePage && allPages <= 1) return null;

  const showSizeChanger = showSizeChangerProp === undefined ? total > totalBoundaryShowSizeChanger : Boolean(showSizeChangerProp);
  const sizeOptions = (typeof showSizeChangerProp === "object" && showSizeChangerProp.options) || pageSizeOptions.map(Number);
  const sizeChangerDisabled = disabled || (typeof showSizeChangerProp === "object" && showSizeChangerProp.disabled);
  const options = Array.from(new Set([...sizeOptions, pageSize])).sort((a, b) => a - b);

  const itemSize = small ? "h-6 min-w-6" : "h-8 min-w-8";
  const prevDisabled = disabled || current <= 1;
  const nextDisabled = disabled || current >= allPages;

  const renderPage = (page: number) => {
    const active = page === current;
    const el = (
      <a
        rel="nofollow"
        className={cn(
          "flex size-full items-center justify-center px-1.5 font-normal",
          active && "font-semibold",
        )}
      >
        {page}
      </a>
    );
    return (
      <li
        key={page}
        title={showTitle ? String(page) : undefined}
        tabIndex={disabled ? -1 : 0}
        aria-current={active ? "page" : undefined}
        data-slot="pagination-item"
        data-active={active || undefined}
        onClick={() => goTo(page)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            goTo(page);
          }
        }}
        className={cn(
          itemBase,
          itemSize,
          "cursor-pointer",
          active ? "border-primary bg-bg-container text-primary" : "hover:bg-fill-tertiary",
          disabled && (active ? "cursor-not-allowed border-transparent bg-fill-secondary text-text-disabled" : "cursor-not-allowed text-text-disabled hover:bg-transparent"),
        )}
      >
        {itemRender(page, "page", el)}
      </li>
    );
  };

  const renderJump = (type: "jump-prev" | "jump-next") => {
    const target = type === "jump-prev" ? Math.max(1, current - 5) : Math.min(allPages, current + 5);
    const el = (
      <span className="group/jump flex size-full items-center justify-center">
        <Ellipsis className="size-3 text-text-quaternary transition-opacity duration-mid group-hover/jump:hidden" />
        {type === "jump-prev" ? (
          <ChevronsLeft className="hidden size-3 text-primary group-hover/jump:block" />
        ) : (
          <ChevronsRight className="hidden size-3 text-primary group-hover/jump:block" />
        )}
      </span>
    );
    return (
      <li
        key={type}
        title={showTitle ? (type === "jump-prev" ? "Previous 5 Pages" : "Next 5 Pages") : undefined}
        tabIndex={disabled ? -1 : 0}
        data-slot={`pagination-${type}`}
        onClick={() => goTo(target)}
        onKeyDown={(e) => {
          if (e.key === "Enter") goTo(target);
        }}
        className={cn(itemBase, itemSize, "cursor-pointer", disabled && "pointer-events-none")}
      >
        {itemRender(target, type, el)}
      </li>
    );
  };

  // ---- page list (rc-pagination algorithm)
  const pagerList: React.ReactNode[] = [];
  const buffer = showLessItems ? 1 : 2;
  if (allPages <= 3 + buffer * 2) {
    for (let i = 1; i <= allPages; i++) pagerList.push(renderPage(i));
  } else {
    let left = Math.max(1, current - buffer);
    let right = Math.min(current + buffer, allPages);
    if (current - 1 <= buffer) right = 1 + buffer * 2;
    if (allPages - current <= buffer) left = allPages - buffer * 2;
    for (let i = left; i <= right; i++) pagerList.push(renderPage(i));
    if (current - 1 >= buffer * 2 && current !== 1 + 2) pagerList.unshift(renderJump("jump-prev"));
    if (allPages - current >= buffer * 2 && current !== allPages - 2) pagerList.push(renderJump("jump-next"));
    if (left !== 1) pagerList.unshift(renderPage(1));
    if (right !== allPages) pagerList.push(renderPage(allPages));
  }

  const navBtn = (type: "prev" | "next", isDisabled: boolean) => {
    const Icon = type === "prev" ? ChevronLeft : ChevronRight;
    const el = (
      <button
        type="button"
        tabIndex={-1}
        disabled={isDisabled}
        aria-label={type === "prev" ? t.prev_page : t.next_page}
        className="flex size-full items-center justify-center rounded-md disabled:cursor-not-allowed"
      >
        <Icon className="size-3" />
      </button>
    );
    return (
      <li
        key={type}
        title={showTitle ? (type === "prev" ? t.prev_page : t.next_page) : undefined}
        tabIndex={isDisabled ? -1 : 0}
        aria-disabled={isDisabled || undefined}
        data-slot={`pagination-${type}`}
        onClick={() => !isDisabled && goTo(type === "prev" ? current - 1 : current + 1)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !isDisabled) goTo(type === "prev" ? current - 1 : current + 1);
        }}
        className={cn(
          itemBase,
          itemSize,
          isDisabled ? "cursor-not-allowed text-text-disabled" : "cursor-pointer hover:bg-fill-tertiary",
        )}
      >
        {itemRender(type === "prev" ? current - 1 : current + 1, type, el)}
      </li>
    );
  };


  const from = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const to = Math.min(current * pageSize, total);
  const totalNode = showTotal ? (
    <li key="total" data-slot="pagination-total" className={cn("mr-2 inline-flex items-center text-sm text-text", small ? "h-6" : "h-8")}>
      {showTotal(total, [from, to])}
    </li>
  ) : null;

  const sizeChangerNode = showSizeChanger ? (
    <li key="size-changer" data-slot="pagination-size-changer" className={cn("ml-2 relative inline-flex items-center", responsive && "max-[576px]:hidden")}>
      <select
        disabled={sizeChangerDisabled}
        value={pageSize}
        onChange={(e) => changePageSize(Number(e.target.value))}
        className={cn(
          "appearance-none rounded-md border border-border bg-bg-container pr-6 pl-2.5 text-sm text-text outline-none transition-[border-color,box-shadow] duration-mid cursor-pointer",
          "hover:border-primary-hover focus:border-primary focus:ring-2 focus:ring-primary/20",
          small ? "h-control-sm text-xs" : "h-control text-sm",
          sizeChangerDisabled && "cursor-not-allowed bg-bg-container-disabled text-text-disabled",
        )}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o} {t.items_per_page}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 size-3 text-text-quaternary" />
    </li>
  ) : null;

  const commitJump = () => {
    const n = Number(jumpValue);
    if (jumpValue !== "" && Number.isFinite(n)) goTo(Math.round(n));
    setJumpValue("");
  };
  const goButton = typeof showQuickJumper === "object" ? showQuickJumper.goButton : null;
  const jumperNode = showQuickJumper ? (
    <li key="jumper" data-slot="pagination-quick-jumper" className={cn("ml-2 inline-flex items-center gap-2 text-sm text-text", responsive && "max-[576px]:hidden")}>
      {t.jump_to}
      <Input
        size={small ? "sm" : "md"}
        inputMode="numeric"
        disabled={disabled}
        value={jumpValue}
        aria-label="Page"
        className="w-14"
        onChange={(e) => setJumpValue(e.target.value)}
        onBlur={() => goButton == null && commitJump()}
        onPressEnter={commitJump}
      />
      {t.page}
      {goButton != null &&
        (goButton === true ? (
          <button
            type="button"
            disabled={disabled}
            onClick={commitJump}
            className={cn(
              "inline-flex items-center rounded-md border border-border bg-bg-container px-2 text-sm text-text transition-colors duration-mid hover:border-primary-hover hover:text-primary-hover disabled:cursor-not-allowed disabled:bg-bg-container-disabled disabled:text-text-disabled",
              small ? "h-control-sm" : "h-control",
            )}
          >
            Confirm
          </button>
        ) : (
          <span onClick={commitJump} className="cursor-pointer">
            {goButton}
          </span>
        ))}
    </li>
  ) : null;

  const rootClass = cn(
    "flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-text",
    align === "center" && "justify-center",
    align === "end" && "justify-end",
    small && "gap-x-0",
    disabled && "cursor-not-allowed",
    className,
  );

  if (isSimple) {
    const commitSimple = () => {
      if (simpleValue != null) {
        const n = Number(simpleValue);
        if (simpleValue !== "" && Number.isFinite(n)) goTo(Math.round(n));
      }
      setSimpleValue(null);
    };
    return (
      <ul data-slot="pagination" data-simple="" className={rootClass} {...props}>
        {totalNode}
        {navBtn("prev", prevDisabled)}
        <li data-slot="pagination-simple-pager" className="inline-flex items-center gap-1 text-text">
          {readOnly ? (
            <span>{current}</span>
          ) : (
            <Input
              size={small ? "sm" : "md"}
              inputMode="numeric"
              disabled={disabled}
              aria-label="Page"
              className="w-12"
              value={simpleValue ?? String(current)}
              onChange={(e) => setSimpleValue(e.target.value)}
              onBlur={commitSimple}
              onPressEnter={commitSimple}
            />
          )}
          <span className="text-text-secondary">/</span>
          <span>{allPages}</span>
        </li>
        {navBtn("next", nextDisabled)}
        {sizeChangerNode}
      </ul>
    );
  }

  return (
    <ul data-slot="pagination" data-size={size} className={rootClass} {...props}>
      {totalNode}
      {navBtn("prev", prevDisabled)}
      {pagerList}
      {navBtn("next", nextDisabled)}
      {sizeChangerNode}
      {jumperNode}
    </ul>
  );
}

export { Pagination };
