import * as React from "react";
import dayjs, { type Dayjs } from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { RadioGroup, type RadioChangeEvent } from "@/components/ui/radio";

export type CalendarMode = "month" | "year";

export interface CalendarLocale {
  weekDays: string[];
  monthLabel: string;
  yearLabel: string;
  /** dayjs format for the header title in each mode. */
  monthFormat: string;
  yearFormat: string;
  /** dayjs format for a month cell in year mode. */
  monthCellFormat: string;
}

export const DEFAULT_CALENDAR_LOCALE: CalendarLocale = {
  weekDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  monthLabel: "Month",
  yearLabel: "Year",
  monthFormat: "MMMM YYYY",
  yearFormat: "YYYY",
  monthCellFormat: "MMM",
};

export interface CalendarHeaderRenderInfo {
  value: Dayjs;
  type: CalendarMode;
  onChange: (date: Dayjs) => void;
  onTypeChange: (type: CalendarMode) => void;
}

export interface CalendarProps {
  value?: Dayjs;
  defaultValue?: Dayjs;
  /** Panel mode; controlled when paired with `onPanelChange`. */
  mode?: CalendarMode;
  fullscreen?: boolean;
  /** Content inside a cell, under the date number. */
  cellRender?: (date: Dayjs, info: { type: CalendarMode }) => React.ReactNode;
  dateCellRender?: (date: Dayjs) => React.ReactNode;
  monthCellRender?: (date: Dayjs) => React.ReactNode;
  /** Replace the whole cell, including the date number. */
  fullCellRender?: (date: Dayjs, info: { type: CalendarMode }) => React.ReactNode;
  dateFullCellRender?: (date: Dayjs) => React.ReactNode;
  monthFullCellRender?: (date: Dayjs) => React.ReactNode;
  /** Replace the header bar. */
  headerRender?: (info: CalendarHeaderRenderInfo) => React.ReactNode;
  /** Selectable window; dates outside it are disabled and navigation stops there. */
  validRange?: [Dayjs, Dayjs];
  onChange?: (date: Dayjs) => void;
  onSelect?: (date: Dayjs, selectInfo: { source: "year" | "month" | "date" | "customize" }) => void;
  onPanelChange?: (date: Dayjs, mode: CalendarMode) => void;
  disabledDate?: (date: Dayjs) => boolean;
  locale?: Partial<CalendarLocale>;
  className?: string;
  style?: React.CSSProperties;
}

export function Calendar({
  value: controlledValue,
  defaultValue,
  mode: controlledMode,
  fullscreen = true,
  cellRender,
  dateCellRender,
  monthCellRender,
  fullCellRender,
  dateFullCellRender,
  monthFullCellRender,
  headerRender,
  validRange,
  onChange,
  onSelect,
  onPanelChange,
  disabledDate,
  locale: localeProp,
  className,
  style,
}: CalendarProps) {
  const locale = { ...DEFAULT_CALENDAR_LOCALE, ...localeProp };

  const [internalDate, setInternalDate] = React.useState<Dayjs>(() => defaultValue ?? dayjs());
  const isControlled = controlledValue !== undefined;
  const selectedDate = isControlled ? controlledValue : internalDate;

  const [internalMode, setInternalMode] = React.useState<CalendarMode>(controlledMode ?? "month");
  const mode = controlledMode ?? internalMode;

  const [panelDate, setPanelDate] = React.useState<Dayjs>(selectedDate);

  React.useEffect(() => {
    if (isControlled && controlledValue) setPanelDate(controlledValue);
  }, [isControlled, controlledValue?.valueOf()]); // eslint-disable-line react-hooks/exhaustive-deps

  const outOfRange = (d: Dayjs, unit: "day" | "month") =>
    Boolean(validRange && (d.isBefore(validRange[0], unit) || d.isAfter(validRange[1], unit)));

  const isDisabled = (d: Dayjs, unit: "day" | "month" = "day") => outOfRange(d, unit) || Boolean(disabledDate?.(d));

  const commit = (d: Dayjs, source: "year" | "month" | "date" | "customize") => {
    if (!isControlled) setInternalDate(d);
    setPanelDate(d);
    onSelect?.(d, { source });
    onChange?.(d);
  };

  const changeMode = (next: CalendarMode) => {
    if (controlledMode === undefined) setInternalMode(next);
    onPanelChange?.(panelDate, next);
  };

  const movePanel = (delta: number) => {
    const unit = mode === "month" ? "month" : "year";
    const next = delta > 0 ? panelDate.add(Math.abs(delta), unit) : panelDate.subtract(Math.abs(delta), unit);
    if (validRange && (next.isBefore(validRange[0], unit) || next.isAfter(validRange[1], unit))) return;
    setPanelDate(next);
    onPanelChange?.(next, mode);
  };

  const canGoBack = !validRange || !panelDate.subtract(1, mode === "month" ? "month" : "year").isBefore(validRange[0], mode === "month" ? "month" : "year");
  const canGoForward = !validRange || !panelDate.add(1, mode === "month" ? "month" : "year").isAfter(validRange[1], mode === "month" ? "month" : "year");

  // six full weeks, so neighbouring days are shown rather than blank holes
  const gridStart = panelDate.startOf("month").subtract(panelDate.startOf("month").day(), "day");
  const dayCells = Array.from({ length: 42 }, (_, i) => gridStart.add(i, "day"));

  const header = headerRender ? (
    headerRender({
      value: panelDate,
      type: mode,
      onChange: (date) => {
        setPanelDate(date);
        onPanelChange?.(date, mode);
      },
      onTypeChange: changeMode,
    })
  ) : (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-secondary pb-4">
      <div className="flex items-center gap-2">
        <div className="text-base font-semibold text-text-heading">
          {panelDate.format(mode === "month" ? locale.monthFormat : locale.yearFormat)}
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            aria-label="Previous"
            disabled={!canGoBack}
            onClick={() => movePanel(-1)}
            className="rounded-md p-1 text-text-tertiary hover:bg-fill-tertiary hover:text-text disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next"
            disabled={!canGoForward}
            onClick={() => movePanel(1)}
            className="rounded-md p-1 text-text-tertiary hover:bg-fill-tertiary hover:text-text disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* the mode switch belongs to the fullscreen calendar only */}
      {fullscreen && (
        <RadioGroup
          value={mode}
          onChange={(e: RadioChangeEvent) => changeMode(e.target.value as CalendarMode)}
          optionType="button"
          size="sm"
          options={[
            { label: locale.monthLabel, value: "month" },
            { label: locale.yearLabel, value: "year" },
          ]}
        />
      )}
    </div>
  );

  return (
    <div
      data-slot="calendar"
      data-mode={mode}
      style={style}
      className={cn(
        "w-full rounded-xl border border-border bg-bg-container p-6 shadow-kk-secondary",
        !fullscreen && "max-w-xs p-4",
        className,
      )}
    >
      {header}

      {mode === "month" && (
        <div className="mt-4">
          <div className="grid grid-cols-7 gap-px border-b border-border-secondary pb-2 text-center text-xs font-medium text-text-tertiary">
            {locale.weekDays.map((w, i) => (
              <div key={`${w}-${i}`}>{w}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 pt-2">
            {dayCells.map((d) => {
              const inMonth = d.isSame(panelDate, "month");
              const isSelected = selectedDate.isSame(d, "day");
              const isToday = dayjs().isSame(d, "day");
              const disabled = isDisabled(d);
              const full = fullCellRender?.(d, { type: "month" }) ?? dateFullCellRender?.(d);
              const content = cellRender?.(d, { type: "month" }) ?? dateCellRender?.(d);

              if (full) {
                return (
                  <div key={d.format("YYYY-MM-DD")} data-slot="calendar-cell" onClick={() => !disabled && commit(d, "date")}>
                    {full}
                  </div>
                );
              }

              return (
                <div
                  key={d.format("YYYY-MM-DD")}
                  data-slot="calendar-cell"
                  role="gridcell"
                  aria-selected={isSelected}
                  onClick={() => !disabled && commit(d, "date")}
                  className={cn(
                    "group relative flex cursor-pointer select-none flex-col rounded-lg border transition-all duration-mid",
                    fullscreen ? "h-24 p-2 text-left" : "h-9 items-center justify-center text-center",
                    isSelected
                      ? "border-primary bg-primary-bg/50 shadow-xs"
                      : isToday
                        ? "border-primary/50 bg-primary-bg/20"
                        : "border-transparent hover:border-border hover:bg-fill-quaternary",
                    !inMonth && "opacity-45",
                    disabled && "cursor-not-allowed opacity-30 hover:border-transparent hover:bg-transparent",
                  )}
                >
                  <span
                    className={cn(
                      "text-xs font-medium",
                      isSelected ? "font-semibold text-primary" : isToday ? "text-primary" : "text-text",
                    )}
                  >
                    {d.date()}
                  </span>
                  {fullscreen && content && (
                    <div className="kk-scrollbar mt-1 flex-1 overflow-y-auto text-xs">{content}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {mode === "year" && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {Array.from({ length: 12 }, (_, i) => {
            const m = panelDate.month(i);
            const isSelected = selectedDate.isSame(m, "month");
            const disabled = isDisabled(m, "month");
            const full = fullCellRender?.(m, { type: "year" }) ?? monthFullCellRender?.(m);
            const content = cellRender?.(m, { type: "year" }) ?? monthCellRender?.(m);

            if (full) {
              return (
                <div key={i} data-slot="calendar-cell" onClick={() => !disabled && commit(m, "month")}>
                  {full}
                </div>
              );
            }

            return (
              <div
                key={i}
                data-slot="calendar-cell"
                role="gridcell"
                aria-selected={isSelected}
                onClick={() => {
                  if (disabled) return;
                  setPanelDate(m);
                  commit(m, "month");
                }}
                className={cn(
                  "flex cursor-pointer flex-col rounded-lg border p-4 transition-all duration-mid",
                  fullscreen ? "h-28" : "h-16 items-center justify-center",
                  isSelected
                    ? "border-primary bg-primary-bg/50 font-semibold text-primary shadow-xs"
                    : "border-transparent text-text hover:border-border hover:bg-fill-quaternary",
                  disabled && "cursor-not-allowed opacity-30 hover:border-transparent hover:bg-transparent",
                )}
              >
                <span className="text-sm font-medium">{m.format(locale.monthCellFormat)}</span>
                {fullscreen && content && <div className="mt-2 text-xs text-text-secondary">{content}</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
