import * as React from "react";
import dayjs, { type Dayjs } from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import weekOfYear from "dayjs/plugin/weekOfYear";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);
dayjs.extend(quarterOfYear);
dayjs.extend(advancedFormat);

import {
  Calendar as CalendarIcon,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Portal } from "@/components/ui/portal";
import { useClickOutside } from "@/hooks/use-click-outside";
import { computeFloatingPosition, measureFloating, toContainerCoords } from "@/lib/floating-position";
import { Button } from "@/components/ui/button";
import { useLocale, type Lang } from "@/i18n/locale";

export type DatePickerValue = Dayjs | null;
export type DatePickerRangeValue = [Dayjs | null, Dayjs | null] | null;
export type DatePickerSize = "sm" | "md" | "lg";
export type DatePickerVariant = "outlined" | "borderless" | "filled" | "underlined";
export type DatePickerStatus = "error" | "warning";
export type DatePickerMode = "date" | "week" | "month" | "quarter" | "year";
export type DatePickerPlacement = "bottomLeft" | "bottomRight" | "topLeft" | "topRight";

export interface DatePickerPreset {
  label: React.ReactNode;
  value: Dayjs;
}

export interface RangePreset {
  label: React.ReactNode;
  value: [Dayjs, Dayjs];
}

export interface DatePickerProps {
  /** Mount the popup inside another element instead of <body>. */
  getPopupContainer?: (triggerNode: HTMLElement | null) => HTMLElement;

  value?: DatePickerValue;
  defaultValue?: DatePickerValue;
  onChange?: (date: Dayjs | null, dateString: string) => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  format?: string;
  placeholder?: string;
  picker?: DatePickerMode;
  disabled?: boolean;
  allowClear?: boolean;
  autoFocus?: boolean;
  inputReadOnly?: boolean;
  size?: DatePickerSize;
  variant?: DatePickerVariant;
  status?: DatePickerStatus;
  placement?: DatePickerPlacement;
  disabledDate?: (currentDate: Dayjs) => boolean;
  presets?: DatePickerPreset[];
  showTime?: boolean | { format?: string; showSecond?: boolean };
  showToday?: boolean;
  showNow?: boolean;
  suffixIcon?: React.ReactNode;
  renderExtraFooter?: () => React.ReactNode;
  cellRender?: (current: Dayjs, info: { type: DatePickerMode }) => React.ReactNode;
  className?: string;
  popupClassName?: string;
  style?: React.CSSProperties;
  id?: string;
  name?: string;
}

export interface RangePickerProps {
  /** Mount the popup inside another element instead of <body>. */
  getPopupContainer?: (triggerNode: HTMLElement | null) => HTMLElement;

  value?: DatePickerRangeValue;
  defaultValue?: DatePickerRangeValue;
  onChange?: (dates: DatePickerRangeValue, dateStrings: [string, string]) => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  format?: string;
  placeholder?: [string, string];
  picker?: DatePickerMode;
  disabled?: boolean | [boolean, boolean];
  allowClear?: boolean;
  allowEmpty?: [boolean, boolean];
  size?: DatePickerSize;
  variant?: DatePickerVariant;
  status?: DatePickerStatus;
  placement?: DatePickerPlacement;
  disabledDate?: (currentDate: Dayjs) => boolean;
  presets?: RangePreset[];
  showTime?: boolean | { format?: string; showSecond?: boolean };
  /** Hold the range until OK is pressed. Defaults to true when `showTime` is on. */
  needConfirm?: boolean;
  separator?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  renderExtraFooter?: () => React.ReactNode;
  cellRender?: (current: Dayjs, info: { type: DatePickerMode }) => React.ReactNode;
  className?: string;
  popupClassName?: string;
  style?: React.CSSProperties;
}

/* ------------------------------------------------------------------ */
/* shared bits                                                         */
/* ------------------------------------------------------------------ */

const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const TH_WEEK_DAYS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
const TH_MONTH_NAMES = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

function displayYear(year: number, lang: Lang): string {
  return String(lang === "th" ? year + 543 : year);
}

function displayDate(date: Dayjs, format: string, lang: Lang): string {
  const formatted = date.format(format);
  if (lang !== "th") return formatted;
  return formatted.replace(/(^|\D)(\d{4})(?=\D|$)/, (_, before: string, year: string) => `${before}${displayYear(Number(year), lang)}`);
}

function localizedPlaceholder(picker: DatePickerMode, showTime: DatePickerProps["showTime"], lang: Lang): string {
  if (lang === "en") return defaultPlaceholderFor(picker, showTime);
  if (showTime) return "เลือกวันที่และเวลา";
  return ({ date: "เลือกวันที่", month: "เลือกเดือน", year: "เลือกปี", quarter: "เลือกไตรมาส", week: "เลือกสัปดาห์" })[picker];
}

const SIZE_CLASSES: Record<DatePickerSize, string> = {
  sm: "h-control-sm text-xs px-2.5 rounded-sm",
  md: "h-control text-sm px-3 rounded-md",
  lg: "h-control-lg text-base px-3.5 rounded-lg",
};

const VARIANT_CLASSES: Record<DatePickerVariant, string> = {
  outlined:
    "border border-border bg-bg-container hover:border-primary-hover focus-within:border-primary focus-within:ring-[3px] focus-within:ring-primary/30",
  borderless: "bg-transparent border border-transparent hover:bg-fill-tertiary",
  filled:
    "bg-fill-tertiary border border-transparent hover:bg-fill-secondary focus-within:bg-bg-container focus-within:border-primary",
  underlined:
    "border-b border-border rounded-none bg-transparent hover:border-primary-hover focus-within:border-primary",
};

function defaultFormatFor(picker: DatePickerMode, showTime: DatePickerProps["showTime"]) {
  if (showTime) {
    const showSecond = typeof showTime === "object" ? showTime.showSecond !== false : true;
    return showSecond ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD HH:mm";
  }
  switch (picker) {
    case "month":
      return "YYYY-MM";
    case "year":
      return "YYYY";
    case "quarter":
      return "YYYY-[Q]Q";
    case "week":
      return "YYYY-[W]ww";
    default:
      return "YYYY-MM-DD";
  }
}

function defaultPlaceholderFor(picker: DatePickerMode, showTime: DatePickerProps["showTime"]) {
  if (showTime) return "Select date & time";
  switch (picker) {
    case "month":
      return "Select month";
    case "year":
      return "Select year";
    case "quarter":
      return "Select quarter";
    case "week":
      return "Select week";
    default:
      return "Select date";
  }
}

function buildMonthGrid(panel: Dayjs) {
  const startOfMonth = panel.startOf("month");
  const daysInMonth = panel.daysInMonth();
  const startDayOfWeek = startOfMonth.day();
  const cells: { date: Dayjs; isCurrentMonth: boolean }[] = [];

  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    cells.push({ date: startOfMonth.subtract(i + 1, "day"), isCurrentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ date: panel.date(i), isCurrentMonth: true });
  }
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) {
    cells.push({ date: panel.endOf("month").add(i, "day"), isCurrentMonth: false });
  }
  return cells;
}

/** Numeric spinner column used by the time footer. */
function TimeColumn({
  max,
  value,
  onChange,
  label,
}: {
  max: number;
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  const items = React.useMemo(() => Array.from({ length: max + 1 }, (_, i) => i), [max]);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current?.querySelector<HTMLButtonElement>(`[data-v="${value}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [value]);

  return (
    <div className="flex flex-col" aria-label={label}>
      <div className="border-b border-border-secondary px-2 py-1 text-center text-[10px] font-semibold uppercase text-text-quaternary">
        {label}
      </div>
      <div ref={ref} className="h-40 w-11 overflow-y-auto scroll-smooth py-1">
        {items.map((i) => (
          <button
            key={i}
            type="button"
            data-v={i}
            onClick={() => onChange(i)}
            className={cn(
              "block w-full rounded-sm px-1 py-1 text-center text-xs transition-colors duration-fast",
              i === value ? "bg-primary-bg font-semibold text-primary" : "text-text hover:bg-fill-tertiary",
            )}
          >
            {String(i).padStart(2, "0")}
          </button>
        ))}
      </div>
    </div>
  );
}

interface PanelProps {
  panelDate: Dayjs;
  onPanelChange: (d: Dayjs) => void;
  picker: DatePickerMode;
  disabledDate?: (d: Dayjs) => boolean;
  cellRender?: (current: Dayjs, info: { type: DatePickerMode }) => React.ReactNode;
  onSelect: (d: Dayjs) => void;
  /** highlight predicate for the selected cell */
  isSelected: (d: Dayjs) => boolean;
  /** cells strictly inside a range */
  isInRange?: (d: Dayjs) => boolean;
  isRangeStart?: (d: Dayjs) => boolean;
  isRangeEnd?: (d: Dayjs) => boolean;
  onHover?: (d: Dayjs | null) => void;
  /** hide the month arrows (range picker right panel keeps them) */
  showHeaderNav?: boolean;
  /** which end of the header keeps its arrows — a range panel only steers from its outer edge */
  navSide?: "both" | "start" | "end";
  /** week-day header labels, so a locale can hand in its own */
  weekDays?: string[];
}

/** One calendar body — shared by DatePicker and both sides of RangePicker. */
function DatePanel({
  panelDate,
  onPanelChange,
  picker,
  disabledDate,
  cellRender,
  onSelect,
  isSelected,
  isInRange,
  isRangeStart,
  isRangeEnd,
  onHover,
  showHeaderNav = true,
  navSide = "both",
  weekDays = WEEK_DAYS,
}: PanelProps) {
  const { lang } = useLocale();
  const monthNames = lang === "th" ? TH_MONTH_NAMES : MONTH_NAMES;
  const weekDayNames = lang === "th" ? TH_WEEK_DAYS : weekDays;
  const [innerMode, setInnerMode] = React.useState<"cells" | "month" | "year">("cells");
  const year = panelDate.year();
  const decadeStart = Math.floor(year / 10) * 10;

  const headerLabel = () => {
    if (innerMode === "year") return `${displayYear(decadeStart, lang)} – ${displayYear(decadeStart + 9, lang)}`;
    if (innerMode === "month" || picker === "month" || picker === "quarter") return displayYear(year, lang);
    if (picker === "year") return `${displayYear(decadeStart, lang)} – ${displayYear(decadeStart + 9, lang)}`;
    return `${lang === "th" ? TH_MONTH_NAMES[panelDate.month()] : panelDate.format("MMMM")} ${displayYear(year, lang)}`;
  };

  const stepUnit = picker === "year" ? 10 : 1;

  const cellBase =
    "relative flex h-8 items-center justify-center rounded-md text-xs font-medium transition-colors duration-fast";

  const renderDateCells = () => {
    const cells = buildMonthGrid(panelDate);
    return (
      <div className="w-[252px]">
        <div className="mb-1 grid grid-cols-7 text-center text-[11px] font-semibold text-text-quaternary">
          {weekDayNames.map((d, i) => (
            <div key={`${d}-${i}`} className="py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 text-xs" onMouseLeave={() => onHover?.(null)}>
          {cells.map(({ date, isCurrentMonth }, idx) => {
            const selected = isSelected(date);
            const inRange = isInRange?.(date) ?? false;
            const rangeStart = isRangeStart?.(date) ?? false;
            const rangeEnd = isRangeEnd?.(date) ?? false;
            const isEdge = selected || rangeStart || rangeEnd;
            const isToday = dayjs().isSame(date, "day");
            const isDisabled = disabledDate?.(date) ?? false;
            // an edge that opens a span paints half its cell, so the highlight
            // runs unbroken across the row instead of breaking between columns
            const halfRight = rangeStart && !rangeEnd;
            const halfLeft = rangeEnd && !rangeStart;

            return (
              <div key={idx} className={cn("relative flex h-9 items-center justify-center", inRange && "bg-primary-bg")}>
                {halfRight && <span aria-hidden className="absolute inset-y-0 right-0 w-1/2 bg-primary-bg" />}
                {halfLeft && <span aria-hidden className="absolute inset-y-0 left-0 w-1/2 bg-primary-bg" />}
                <button
                  type="button"
                  disabled={isDisabled}
                  onClick={() => onSelect(date)}
                  onMouseEnter={() => onHover?.(date)}
                  className={cn(
                    cellBase,
                    "z-10 w-8",
                    !isCurrentMonth && "text-text-quaternary",
                    isCurrentMonth && !isEdge && "text-text",
                    !isEdge && !isDisabled && "hover:bg-fill-secondary",
                    inRange && !isEdge && "text-primary",
                    isToday && !isEdge && "ring-1 ring-inset ring-primary font-semibold text-primary",
                    isEdge && "bg-primary text-white shadow-sm hover:bg-primary",
                    isDisabled && "cursor-not-allowed text-text-disabled hover:bg-transparent",
                  )}
                >
                  {cellRender ? cellRender(date, { type: "date" }) : date.date()}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekCells = () => {
    const cells = buildMonthGrid(panelDate);
    const rows: { date: Dayjs; isCurrentMonth: boolean }[][] = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

    return (
      <div className="w-72">
        <div className="mb-1 grid grid-cols-8 text-center text-[11px] font-semibold text-text-quaternary">
          <div className="py-1">{lang === "th" ? "สัปดาห์" : "Wk"}</div>
          {weekDays.map((d, i) => (
            <div key={`${d}-${i}`} className="py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="text-xs">
          {rows.map((row, ri) => {
            const weekStart = row[0].date;
            const selected = isSelected(weekStart);
            const isDisabled = disabledDate?.(weekStart) ?? false;
            return (
              <button
                key={ri}
                type="button"
                disabled={isDisabled}
                onClick={() => onSelect(weekStart)}
                className={cn(
                  "grid w-full grid-cols-8 rounded-md transition-colors duration-fast",
                  selected ? "bg-primary text-white" : "hover:bg-fill-tertiary",
                  isDisabled && "cursor-not-allowed opacity-40",
                )}
              >
                <span className={cn("py-1.5 text-[11px]", selected ? "text-white/80" : "text-text-quaternary")}>
                  {weekStart.week()}
                </span>
                {row.map(({ date, isCurrentMonth }, ci) => (
                  <span
                    key={ci}
                    className={cn(
                      "py-1.5",
                      !selected && !isCurrentMonth && "text-text-quaternary",
                      !selected && isCurrentMonth && "text-text",
                    )}
                  >
                    {date.date()}
                  </span>
                ))}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthCells = (onPick?: (d: Dayjs) => void) => (
    <div className="grid w-56 grid-cols-3 gap-2 p-1">
      {monthNames.map((m, idx) => {
        const cellDate = panelDate.month(idx).date(1);
        const selected = onPick ? false : isSelected(cellDate);
        const isDisabled = disabledDate?.(cellDate) ?? false;
        return (
          <button
            key={m}
            type="button"
            disabled={isDisabled}
            onClick={() => (onPick ? onPick(cellDate) : onSelect(cellDate))}
            className={cn(
              cellBase,
              "hover:bg-fill-tertiary",
              selected && "bg-primary text-white hover:bg-primary",
              isDisabled && "cursor-not-allowed opacity-40",
            )}
          >
            {cellRender ? cellRender(cellDate, { type: "month" }) : m}
          </button>
        );
      })}
    </div>
  );

  const renderQuarterCells = () => (
    <div className="grid w-56 grid-cols-2 gap-2 p-1">
      {[0, 1, 2, 3].map((q) => {
        const cellDate = panelDate.month(q * 3).date(1);
        const selected = isSelected(cellDate);
        const isDisabled = disabledDate?.(cellDate) ?? false;
        return (
          <button
            key={q}
            type="button"
            disabled={isDisabled}
            onClick={() => onSelect(cellDate)}
            className={cn(
              cellBase,
              "h-12 hover:bg-fill-tertiary",
              selected && "bg-primary text-white hover:bg-primary",
              isDisabled && "cursor-not-allowed opacity-40",
            )}
          >
            Q{q + 1}
          </button>
        );
      })}
    </div>
  );

  const renderYearCells = (onPick?: (d: Dayjs) => void) => (
    <div className="grid w-56 grid-cols-3 gap-2 p-1">
      {Array.from({ length: 12 }).map((_, idx) => {
        const y = decadeStart - 1 + idx;
        const cellDate = panelDate.year(y).month(0).date(1);
        const selected = onPick ? false : isSelected(cellDate);
        const outside = y < decadeStart || y > decadeStart + 9;
        const isDisabled = disabledDate?.(cellDate) ?? false;
        return (
          <button
            key={y}
            type="button"
            disabled={isDisabled}
            onClick={() => (onPick ? onPick(cellDate) : onSelect(cellDate))}
            className={cn(
              cellBase,
              "hover:bg-fill-tertiary",
              outside && "text-text-quaternary",
              selected && "bg-primary text-white hover:bg-primary",
              isDisabled && "cursor-not-allowed opacity-40",
            )}
          >
            {cellRender ? cellRender(cellDate, { type: "year" }) : displayYear(y, lang)}
          </button>
        );
      })}
    </div>
  );

  const body = () => {
    if (innerMode === "month") return renderMonthCells((d) => { onPanelChange(d); setInnerMode("cells"); });
    if (innerMode === "year") return renderYearCells((d) => { onPanelChange(d); setInnerMode(picker === "year" ? "cells" : "month"); });
    switch (picker) {
      case "week":
        return renderWeekCells();
      case "month":
        return renderMonthCells();
      case "quarter":
        return renderQuarterCells();
      case "year":
        return renderYearCells();
      default:
        return renderDateCells();
    }
  };

  const showMonthArrows = showHeaderNav && innerMode === "cells" && (picker === "date" || picker === "week");
  const showPrevNav = showHeaderNav && navSide !== "end";
  const showNextNav = showHeaderNav && navSide !== "start";

  const navBtn =
    "flex size-6 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-fill-tertiary hover:text-text";

  return (
    <div className="p-3">
      <div className="mb-2 flex items-center justify-between pb-2">
        <div className="flex items-center gap-1">
          {showPrevNav && (
            <button
              type="button"
              aria-label="previous year"
              onClick={() => onPanelChange(panelDate.subtract(stepUnit, "year"))}
              className={navBtn}
            >
              <ChevronsLeft className="size-3.5" />
            </button>
          )}
          {showPrevNav && showMonthArrows && (
            <button
              type="button"
              aria-label="previous month"
              onClick={() => onPanelChange(panelDate.subtract(1, "month"))}
              className={navBtn}
            >
              <ChevronLeft className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-sm font-semibold text-text-heading">
          {innerMode === "cells" && (picker === "date" || picker === "week") ? (
            <>
              <button
                type="button"
                onClick={() => setInnerMode("month")}
                className="rounded-md px-1 transition-colors hover:text-primary"
              >
                {lang === "th" ? TH_MONTH_NAMES[panelDate.month()] : panelDate.format("MMMM")}
              </button>
              <button
                type="button"
                onClick={() => setInnerMode("year")}
                className="rounded-md px-1 transition-colors hover:text-primary"
              >
                {displayYear(panelDate.year(), lang)}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => picker !== "year" && innerMode === "cells" && setInnerMode("year")}
              className="rounded-md px-1 transition-colors hover:text-primary"
            >
              {headerLabel()}
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          {showNextNav && showMonthArrows && (
            <button
              type="button"
              aria-label="next month"
              onClick={() => onPanelChange(panelDate.add(1, "month"))}
              className={navBtn}
            >
              <ChevronRight className="size-3.5" />
            </button>
          )}
          {showNextNav && (
            <button
              type="button"
              aria-label="next year"
              onClick={() => onPanelChange(panelDate.add(stepUnit, "year"))}
              className={navBtn}
            >
              <ChevronsRight className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {body()}
    </div>
  );
}

function PresetList({ presets, onPick }: { presets: { label: React.ReactNode }[]; onPick: (i: number) => void }) {
  return (
    <div className="flex max-h-[336px] w-36 shrink-0 flex-col gap-0.5 overflow-y-auto border-r border-border-secondary bg-bg-layout p-2">
      {presets.map((p, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onPick(idx)}
          className="kk-press w-full truncate rounded-md px-2.5 py-1.5 text-left text-xs text-text transition-colors duration-fast hover:bg-fill-tertiary hover:text-primary"
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* DatePicker                                                          */
/* ------------------------------------------------------------------ */

export function DatePicker({
  value: controlledValue,
  defaultValue,
  onChange,
  onOpenChange,
  open: controlledOpen,
  format,
  placeholder,
  picker = "date",
  disabled = false,
  allowClear = true,
  inputReadOnly,
  size = "md",
  variant = "outlined",
  status,
  placement = "bottomLeft",
  disabledDate,
  presets,
  showTime = false,
  showToday = true,
  showNow,
  suffixIcon,
  renderExtraFooter,
  cellRender,
  className,
  popupClassName,
  style,
  id,
  name,
  getPopupContainer,
}: DatePickerProps) {
  const { lang } = useLocale();
  const activeFormat = format ?? defaultFormatFor(picker, showTime);
  const showSecond = typeof showTime === "object" ? showTime.showSecond !== false : true;

  const [internalDate, setInternalDate] = React.useState<Dayjs | null>(defaultValue ?? null);
  const isControlled = controlledValue !== undefined;
  const selectedDate = isControlled ? controlledValue : internalDate;

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const [panelDate, setPanelDate] = React.useState<Dayjs>(() => selectedDate ?? dayjs());
  const [time, setTime] = React.useState(() => ({
    h: selectedDate?.hour() ?? 0,
    m: selectedDate?.minute() ?? 0,
    s: selectedDate?.second() ?? 0,
  }));

  React.useEffect(() => {
    if (selectedDate) {
      setPanelDate(selectedDate);
      setTime({ h: selectedDate.hour(), m: selectedDate.minute(), s: selectedDate.second() });
    }
  }, [selectedDate?.valueOf()]); // eslint-disable-line react-hooks/exhaustive-deps

  const triggerRef = React.useRef<HTMLDivElement>(null);
  const popupRef = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState<{ top: number; left: number } | null>(null);
  const popupContainer = React.useMemo(
    () => (getPopupContainer ? getPopupContainer(triggerRef.current) : undefined),
    [getPopupContainer, open], // eslint-disable-line react-hooks/exhaustive-deps
  );

  useClickOutside(
    popupRef,
    (e) => {
      if (triggerRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    },
    open,
  );

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current || !popupRef.current) return;
    setPos(
      toContainerCoords(computeFloatingPosition(
        triggerRef.current.getBoundingClientRect(),
        measureFloating(popupRef.current),
        placement,
        4,
      ), popupContainer),
    );
  }, [placement]);

  React.useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  const commit = (d: Dayjs | null) => {
    if (!isControlled) setInternalDate(d);
    onChange?.(d, d ? displayDate(d, activeFormat, lang) : "");
  };

  const handleSelectDate = (d: Dayjs) => {
    if (disabledDate?.(d)) return;
    const target = showTime ? d.hour(time.h).minute(time.m).second(time.s) : d;
    setPanelDate(target);
    if (showTime) {
      if (!isControlled) setInternalDate(target);
      return; // wait for OK
    }
    commit(target);
    setOpen(false);
  };

  const handleConfirm = () => {
    const base = selectedDate ?? panelDate;
    commit(base.hour(time.h).minute(time.m).second(time.s));
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    commit(null);
  };

  const isSelected = (d: Dayjs) => {
    if (!selectedDate) return false;
    switch (picker) {
      case "week":
        return selectedDate.isSame(d, "week" as dayjs.OpUnitType);
      case "month":
        return selectedDate.isSame(d, "month");
      case "quarter":
        return selectedDate.year() === d.year() && Math.floor(selectedDate.month() / 3) === Math.floor(d.month() / 3);
      case "year":
        return selectedDate.isSame(d, "year");
      default:
        return selectedDate.isSame(d, "day");
    }
  };

  const displayText = selectedDate ? displayDate(selectedDate, activeFormat, lang) : (placeholder ?? localizedPlaceholder(picker, showTime, lang));
  const wantNow = showNow ?? Boolean(showTime);

  return (
    <div
      ref={triggerRef}
      id={id}
      data-slot="date-picker"
      data-disabled={disabled || undefined}
      onClick={() => !disabled && setOpen(!open)}
      className={cn(
        "relative inline-flex select-none items-center justify-between gap-2 transition-all duration-mid ease-kk-in-out",
        !disabled && !inputReadOnly && "cursor-pointer",
        SIZE_CLASSES[size],
        VARIANT_CLASSES[variant],
        status === "error" && "border-error focus-within:border-error focus-within:ring-error/20",
        status === "warning" && "border-warning focus-within:border-warning focus-within:ring-warning/20",
        disabled && "cursor-not-allowed bg-bg-container-disabled text-text-disabled",
        className,
      )}
      style={style}
    >
      {name ? <input type="hidden" name={name} value={selectedDate ? selectedDate.format(activeFormat) : ""} /> : null}
      <div className="flex min-w-0 items-center gap-2">
        <span className={cn("truncate", !selectedDate && "text-text-placeholder")}>{displayText}</span>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {allowClear && selectedDate && !disabled ? (
          <button
            type="button"
            aria-label="clear"
            onClick={handleClear}
            className="rounded-full p-0.5 text-text-quaternary transition-colors hover:bg-fill-tertiary hover:text-text"
          >
            <X className="size-3.5" />
          </button>
        ) : (
          suffixIcon ?? <CalendarIcon className="size-4 text-text-quaternary" />
        )}
      </div>

      {open && !disabled && (
        <Portal container={popupContainer}>
          <div
            ref={popupRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              top: pos?.top ?? 0,
              left: pos?.left ?? 0,
              zIndex: 1050,
              // first paint measures the panel; keep it out of sight until it is placed
              visibility: pos ? "visible" : "hidden",
            }}
            className={cn(
              "flex overflow-hidden rounded-xl border border-border-secondary bg-bg-elevated shadow-kk",
              "animate-in fade-in-0 zoom-in-95 duration-200 ease-kk-spring-soft",
              popupClassName,
            )}
          >
            {presets && presets.length > 0 && (
              <PresetList presets={presets} onPick={(i) => handleSelectDate(presets[i].value)} />
            )}

            <div className="flex flex-col">
              <div className="flex">
                <DatePanel
                  panelDate={panelDate}
                  onPanelChange={setPanelDate}
                  picker={picker}
                  disabledDate={disabledDate}
                  cellRender={cellRender}
                  onSelect={handleSelectDate}
                  isSelected={isSelected}
                />

                {showTime && (
                  <div className="flex border-l border-border-secondary">
                    <TimeColumn max={23} value={time.h} label="hh" onChange={(h) => setTime((t) => ({ ...t, h }))} />
                    <TimeColumn max={59} value={time.m} label="mm" onChange={(m) => setTime((t) => ({ ...t, m }))} />
                    {showSecond && (
                      <TimeColumn max={59} value={time.s} label="ss" onChange={(s) => setTime((t) => ({ ...t, s }))} />
                    )}
                  </div>
                )}
              </div>

              {renderExtraFooter && (
                <div className="border-t border-border-secondary px-3 py-2 text-xs text-text-secondary">
                  {renderExtraFooter()}
                </div>
              )}

              {(showTime || showToday) && (
                <div className={cn("flex items-center gap-2 border-t border-border-secondary px-3 py-2", showTime ? "justify-between" : "justify-center")}>
                  {wantNow ? (
                    <button
                      type="button"
                      onClick={() => {
                        const now = dayjs();
                        setTime({ h: now.hour(), m: now.minute(), s: now.second() });
                        setPanelDate(now);
                        if (!showTime) {
                          commit(now);
                          setOpen(false);
                        }
                      }}
                      className="text-xs font-medium text-primary transition-colors hover:text-primary-hover"
                    >
                      <Clock className="mr-1 inline size-3" />
                      {lang === "th" ? "ตอนนี้" : "Now"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSelectDate(dayjs())}
                      className="text-xs font-medium text-primary transition-colors hover:text-primary-hover"
                    >
                      {lang === "th" ? "วันนี้" : "Today"}
                    </button>
                  )}

                  {showTime && (
                    <Button size="sm" type="primary" onClick={handleConfirm} className="h-6 px-3 text-[11px]">
                      {lang === "th" ? "ตกลง" : "OK"}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RangePicker                                                         */
/* ------------------------------------------------------------------ */

export function RangePicker({
  value: controlledValue,
  defaultValue,
  onChange,
  onOpenChange,
  open: controlledOpen,
  format,
  placeholder = ["Start date", "End date"],
  picker = "date",
  disabled = false,
  allowClear = true,
  size = "md",
  variant = "outlined",
  status,
  placement = "bottomLeft",
  disabledDate,
  presets,
  showTime = false,
  needConfirm,
  separator,
  suffixIcon,
  renderExtraFooter,
  cellRender,
  className,
  popupClassName,
  style,
  getPopupContainer,
}: RangePickerProps) {
  const { lang } = useLocale();
  const activeFormat = format ?? defaultFormatFor(picker, showTime);
  const showSecond = typeof showTime === "object" ? showTime.showSecond !== false : true;
  const [startDisabled, endDisabled] = Array.isArray(disabled) ? disabled : [disabled, disabled];
  const allDisabled = startDisabled && endDisabled;

  const [internalValue, setInternalValue] = React.useState<DatePickerRangeValue>(defaultValue ?? null);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const confirmMode = needConfirm ?? Boolean(showTime);

  const [stage, setStage] = React.useState<"start" | "end">("start");
  const [draftStart, setDraftStart] = React.useState<Dayjs | null>(value?.[0] ?? null);
  const [draftEnd, setDraftEnd] = React.useState<Dayjs | null>(value?.[1] ?? null);
  const [hovered, setHovered] = React.useState<Dayjs | null>(null);
  const [leftPanel, setLeftPanel] = React.useState<Dayjs>(() => value?.[0] ?? dayjs());
  const [startTime, setStartTime] = React.useState(() => ({
    h: value?.[0]?.hour() ?? 0,
    m: value?.[0]?.minute() ?? 0,
    s: value?.[0]?.second() ?? 0,
  }));
  const [endTime, setEndTime] = React.useState(() => ({
    h: value?.[1]?.hour() ?? 23,
    m: value?.[1]?.minute() ?? 59,
    s: value?.[1]?.second() ?? 59,
  }));

  const rightPanel = leftPanel.add(picker === "year" ? 10 : 1, picker === "year" ? "year" : picker === "month" || picker === "quarter" ? "year" : "month");

  const triggerRef = React.useRef<HTMLDivElement>(null);
  const popupRef = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState<{ top: number; left: number } | null>(null);
  const popupContainer = React.useMemo(
    () => (getPopupContainer ? getPopupContainer(triggerRef.current) : undefined),
    [getPopupContainer, open], // eslint-disable-line react-hooks/exhaustive-deps
  );

  useClickOutside(
    popupRef,
    (e) => {
      if (triggerRef.current?.contains(e.target as Node)) return;
      setOpen(false);
      setStage("start");
      setHovered(null);
    },
    open,
  );

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current || !popupRef.current) return;
    setPos(
      toContainerCoords(computeFloatingPosition(
        triggerRef.current.getBoundingClientRect(),
        measureFloating(popupRef.current),
        placement,
        4,
      ), popupContainer),
    );
  }, [placement]);

  React.useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  const commit = (range: DatePickerRangeValue) => {
    if (!isControlled) setInternalValue(range);
    onChange?.(
      range,
      range && range[0] && range[1] ? [displayDate(range[0], activeFormat, lang), displayDate(range[1], activeFormat, lang)] : ["", ""],
    );
  };

  const applyTime = (d: Dayjs, which: "start" | "end") => {
    if (!showTime) return d;
    const t = which === "start" ? startTime : endTime;
    return d.hour(t.h).minute(t.m).second(t.s);
  };

  const handleSelect = (d: Dayjs) => {
    if (disabledDate?.(d)) return;
    if (stage === "start") {
      setDraftStart(d);
      setDraftEnd(null);
      setStage("end");
      setHovered(null);
      return;
    }
    const [a, b] = d.isBefore(draftStart!) ? [d, draftStart!] : [draftStart!, d];
    setHovered(null);
    if (confirmMode) {
      setDraftStart(a);
      setDraftEnd(b);
      return; // wait for OK
    }
    commit([applyTime(a, "start"), applyTime(b, "end")]);
    setStage("start");
    setOpen(false);
  };

  const handleConfirm = () => {
    const a = draftStart ?? value?.[0] ?? null;
    const b = draftEnd ?? value?.[1] ?? null;
    if (a && b) commit([applyTime(a, "start"), applyTime(b, "end")]);
    setStage("start");
    setOpen(false);
  };

  const handleCancel = () => {
    setDraftStart(value?.[0] ?? null);
    setDraftEnd(value?.[1] ?? null);
    setStage("start");
    setHovered(null);
    setOpen(false);
  };

  const handlePreset = (idx: number) => {
    const [a, b] = presets![idx].value;
    setDraftStart(a);
    setDraftEnd(b);
    setLeftPanel(a);
    setStage("start");
    setHovered(null);
    if (confirmMode) return; // the range is staged; OK applies it
    commit([a, b]);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDraftStart(null);
    setDraftEnd(null);
    setStage("start");
    commit(null);
  };

  // range highlight — while picking, preview against the hovered cell
  const previewEnd = stage === "end" ? (draftEnd ?? hovered) : null;
  const rangeA = stage === "end" ? draftStart : (confirmMode ? draftStart : null) ?? value?.[0] ?? null;
  const rangeB = stage === "end" ? previewEnd : (confirmMode ? draftEnd : null) ?? value?.[1] ?? null;
  const lo = rangeA && rangeB ? (rangeA.isBefore(rangeB) ? rangeA : rangeB) : rangeA;
  const hi = rangeA && rangeB ? (rangeA.isBefore(rangeB) ? rangeB : rangeA) : rangeB;

  const isRangeStart = (d: Dayjs) => Boolean(lo && d.isSame(lo, "day"));
  const isRangeEnd = (d: Dayjs) => Boolean(hi && d.isSame(hi, "day"));
  const isInRange = (d: Dayjs) => Boolean(lo && hi && d.isAfter(lo, "day") && d.isBefore(hi, "day"));

  const panelProps = {
    picker,
    disabledDate,
    cellRender,
    onSelect: handleSelect,
    isSelected: () => false,
    isInRange,
    isRangeStart,
    isRangeEnd,
    onHover: setHovered,
  };

  return (
    <div
      ref={triggerRef}
      data-slot="range-picker"
      data-disabled={allDisabled || undefined}
      onClick={() => !allDisabled && setOpen(!open)}
      className={cn(
        "relative inline-flex select-none items-center gap-2 transition-all duration-mid ease-kk-in-out",
        !allDisabled && "cursor-pointer",
        SIZE_CLASSES[size],
        VARIANT_CLASSES[variant],
        status === "error" && "border-error focus-within:border-error focus-within:ring-error/20",
        status === "warning" && "border-warning focus-within:border-warning focus-within:ring-warning/20",
        allDisabled && "cursor-not-allowed bg-bg-container-disabled text-text-disabled",
        className,
      )}
      style={style}
    >
      <span
        className={cn(
          "truncate",
          !value?.[0] && "text-text-placeholder",
          startDisabled && !allDisabled && "text-text-disabled",
          stage === "start" && open && "text-primary",
        )}
      >
        {value?.[0] ? displayDate(value[0], activeFormat, lang) : (placeholder[0] ?? localizedPlaceholder(picker, showTime, lang))}
      </span>

      <span className="shrink-0 text-text-quaternary">{separator ?? <ArrowRight className="size-3" />}</span>

      <span
        className={cn(
          "truncate",
          !value?.[1] && "text-text-placeholder",
          endDisabled && !allDisabled && "text-text-disabled",
          stage === "end" && open && "text-primary",
        )}
      >
        {value?.[1] ? displayDate(value[1], activeFormat, lang) : (placeholder[1] ?? localizedPlaceholder(picker, showTime, lang))}
      </span>

      <span className="ml-auto flex shrink-0 items-center pl-1">
        {allowClear && value?.[0] && !allDisabled ? (
          <button
            type="button"
            aria-label="clear"
            onClick={handleClear}
            className="rounded-full p-0.5 text-text-quaternary transition-colors hover:bg-fill-tertiary hover:text-text"
          >
            <X className="size-3.5" />
          </button>
        ) : (
          suffixIcon ?? <CalendarIcon className="size-4 text-text-quaternary" />
        )}
      </span>

      {open && !allDisabled && (
        <Portal container={popupContainer}>
          <div
            ref={popupRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              top: pos?.top ?? 0,
              left: pos?.left ?? 0,
              zIndex: 1050,
              // first paint measures the panel; keep it out of sight until it is placed
              visibility: pos ? "visible" : "hidden",
            }}
            className={cn(
              "flex overflow-hidden rounded-xl border border-border-secondary bg-bg-elevated shadow-kk",
              "animate-in fade-in-0 zoom-in-95 duration-200 ease-kk-spring-soft",
              popupClassName,
            )}
          >
            {presets && presets.length > 0 && <PresetList presets={presets} onPick={handlePreset} />}

            <div className="flex flex-col">
              <div className="flex divide-x divide-border-secondary">
                <DatePanel {...panelProps} panelDate={leftPanel} onPanelChange={setLeftPanel} navSide="start" />
                <DatePanel
                  {...panelProps}
                  panelDate={rightPanel}
                  onPanelChange={(d) =>
                    setLeftPanel(d.subtract(picker === "year" ? 10 : 1, picker === "year" || picker === "month" || picker === "quarter" ? "year" : "month"))
                  }
                  navSide="end"
                />

                {showTime && (
                  <div className="flex">
                    <TimeColumn max={23} value={startTime.h} label="hh" onChange={(h) => setStartTime((t) => ({ ...t, h }))} />
                    <TimeColumn max={59} value={startTime.m} label="mm" onChange={(m) => setStartTime((t) => ({ ...t, m }))} />
                    {showSecond && (
                      <TimeColumn max={59} value={startTime.s} label="ss" onChange={(s) => setStartTime((t) => ({ ...t, s }))} />
                    )}
                    <TimeColumn max={23} value={endTime.h} label="HH" onChange={(h) => setEndTime((t) => ({ ...t, h }))} />
                    <TimeColumn max={59} value={endTime.m} label="MM" onChange={(m) => setEndTime((t) => ({ ...t, m }))} />
                    {showSecond && (
                      <TimeColumn max={59} value={endTime.s} label="SS" onChange={(s) => setEndTime((t) => ({ ...t, s }))} />
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-border-secondary px-3 py-2">
                <span className="truncate text-xs text-text-tertiary">
                  {lo && hi
                    ? `${displayDate(lo, activeFormat, lang)} ~ ${displayDate(hi, activeFormat, lang)}`
                    : stage === "start"
                      ? (lang === "th" ? "เลือกวันเริ่มต้น" : "Select start date")
                      : (lang === "th" ? "เลือกวันสิ้นสุด" : "Select end date")}
                </span>
                <div className="flex shrink-0 items-center gap-2">
                  {renderExtraFooter?.()}
                  {confirmMode && (
                    <>
                      <Button size="sm" type="text" onClick={handleCancel}>
                        {lang === "th" ? "ยกเลิก" : "Cancel"}
                      </Button>
                      <Button size="sm" type="primary" disabled={!(draftStart && draftEnd)} onClick={handleConfirm}>
                        {lang === "th" ? "ตกลง" : "OK"}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}

DatePicker.RangePicker = RangePicker;

/* ------------------------------------------------------------------ */
/* shorthand pickers                                                   */
/* ------------------------------------------------------------------ */

type ShorthandProps = Omit<DatePickerProps, "picker">;

export function MonthPicker(props: ShorthandProps) {
  return <DatePicker {...props} picker="month" />;
}
export function YearPicker(props: ShorthandProps) {
  return <DatePicker {...props} picker="year" />;
}
export function QuarterPicker(props: ShorthandProps) {
  return <DatePicker {...props} picker="quarter" />;
}
export function WeekPicker(props: ShorthandProps) {
  return <DatePicker {...props} picker="week" />;
}

DatePicker.MonthPicker = MonthPicker;
DatePicker.YearPicker = YearPicker;
DatePicker.QuarterPicker = QuarterPicker;
DatePicker.WeekPicker = WeekPicker;
