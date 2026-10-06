import * as React from "react";
import dayjs, { type Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Clock, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Portal } from "@/components/ui/portal";
import { useClickOutside } from "@/hooks/use-click-outside";
import { computeFloatingPosition, measureFloating, toContainerCoords } from "@/lib/floating-position";

dayjs.extend(customParseFormat);

export type TimePickerValue = Dayjs | null;
export type TimePickerRangeValue = [Dayjs | null, Dayjs | null] | null;
export type TimePickerSize = "sm" | "md" | "lg";
export type TimePickerVariant = "outlined" | "borderless" | "filled" | "underlined";
export type TimePickerStatus = "error" | "warning";
export type TimePickerPlacement = "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
export type TimeColumnType = "hour" | "minute" | "second" | "meridiem";

export interface DisabledTimeConfig {
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
}

export type TimeCellRender = (
  value: number | string,
  info: { type: TimeColumnType; originNode: React.ReactNode },
) => React.ReactNode;

export interface TimePickerProps {
  /** Mount the popup inside another element instead of <body>. */
  getPopupContainer?: (triggerNode: HTMLElement | null) => HTMLElement;
  value?: TimePickerValue;
  defaultValue?: TimePickerValue;
  onChange?: (time: Dayjs | null, timeString: string) => void;
  /** Fires on every column pick, before the value is confirmed. */
  onSelect?: (time: Dayjs) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  format?: string;
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean | { clearIcon?: React.ReactNode };
  size?: TimePickerSize;
  variant?: TimePickerVariant;
  status?: TimePickerStatus;
  placement?: TimePickerPlacement;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  use12Hours?: boolean;
  showHour?: boolean;
  showMinute?: boolean;
  showSecond?: boolean;
  /** Show the "Now" shortcut in the footer. */
  showNow?: boolean;
  /** Require the OK button; when false every pick commits immediately. */
  needConfirm?: boolean;
  /** Selecting the option the column is scrolled to. */
  changeOnScroll?: boolean;
  disabledTime?: (now: Dayjs) => DisabledTimeConfig;
  hideDisabledOptions?: boolean;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  inputReadOnly?: boolean;
  autoFocus?: boolean;
  renderExtraFooter?: () => React.ReactNode;
  cellRender?: TimeCellRender;
  prefix?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  className?: string;
  popupClassName?: string;
  style?: React.CSSProperties;
  popupStyle?: React.CSSProperties;
  id?: string;
  name?: string;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export interface TimeRangePickerProps
  extends Omit<
    TimePickerProps,
    "value" | "defaultValue" | "onChange" | "onSelect" | "placeholder" | "disabled" | "disabledTime" | "name"
  > {
  /** Mount the popup inside another element instead of <body>. */
  getPopupContainer?: (triggerNode: HTMLElement | null) => HTMLElement;
  value?: TimePickerRangeValue;
  defaultValue?: TimePickerRangeValue;
  onChange?: (times: [Dayjs, Dayjs] | null, timeStrings: [string, string]) => void;
  onSelect?: (time: Dayjs, type: "start" | "end") => void;
  placeholder?: [string, string];
  disabled?: boolean | [boolean, boolean];
  disabledTime?: (now: Dayjs, type: "start" | "end") => DisabledTimeConfig;
  /** Sort the two values ascending when both are picked. */
  order?: boolean;
  separator?: React.ReactNode;
}

/* ------------------------------------------------------------------ */
/* shared bits                                                         */
/* ------------------------------------------------------------------ */

const SIZE_CLASSES: Record<TimePickerSize, string> = {
  sm: "h-control-sm text-xs px-2.5 rounded-sm",
  md: "h-control text-sm px-3 rounded-md",
  lg: "h-control-lg text-base px-3.5 rounded-lg",
};

const VARIANT_CLASSES: Record<TimePickerVariant, string> = {
  outlined:
    "border border-border bg-bg-container hover:border-primary-hover focus-within:border-primary focus-within:ring-[3px] focus-within:ring-primary/30",
  borderless: "bg-transparent border border-transparent hover:bg-fill-tertiary",
  filled:
    "bg-fill-tertiary border border-transparent hover:bg-fill-secondary focus-within:bg-bg-container focus-within:border-primary",
  underlined:
    "border-b border-border rounded-none bg-transparent hover:border-primary-hover focus-within:border-primary",
};

const pad2 = (v: number) => String(v).padStart(2, "0");

interface ColumnFlags {
  use12Hours: boolean;
  showHour: boolean;
  showMinute: boolean;
  showSecond: boolean;
}

function defaultFormat({ use12Hours, showHour, showMinute, showSecond }: ColumnFlags) {
  const parts: string[] = [];
  if (showHour) parts.push(use12Hours ? "h" : "HH");
  if (showMinute) parts.push("mm");
  if (showSecond) parts.push("ss");
  const base = parts.join(":") || (use12Hours ? "h" : "HH");
  return use12Hours ? `${base} A` : base;
}

/** Resolve the column flags from the explicit props, falling back to the format string. */
function resolveFlags(
  format: string | undefined,
  use12Hours: boolean | undefined,
  showHour: boolean | undefined,
  showMinute: boolean | undefined,
  showSecond: boolean | undefined,
): ColumnFlags {
  const twelve = use12Hours ?? (format ? /A/i.test(format) : false);
  return {
    use12Hours: twelve,
    showHour: showHour ?? (format ? /[hH]/.test(format) : true),
    showMinute: showMinute ?? (format ? /m/.test(format) : true),
    showSecond: showSecond ?? (format ? /s/.test(format) : true),
  };
}

interface TimeLimits {
  hour: (h: number) => boolean;
  minute: (h: number, m: number) => boolean;
  second: (h: number, m: number, s: number) => boolean;
}

/** Merge `disabledTime` with the `minDate`/`maxDate` bounds into per-cell predicates. */
function makeLimits(
  base: Dayjs,
  config: DisabledTimeConfig | undefined,
  minDate: Dayjs | undefined,
  maxDate: Dayjs | undefined,
): TimeLimits {
  const day = base.millisecond(0);
  const offHours = config?.disabledHours?.() ?? [];
  const outside = (from: Dayjs, to: Dayjs) =>
    (maxDate ? from.isAfter(maxDate) : false) || (minDate ? to.isBefore(minDate) : false);

  return {
    hour: (h) => offHours.includes(h) || outside(day.hour(h).minute(0).second(0), day.hour(h).minute(59).second(59)),
    minute: (h, m) =>
      (config?.disabledMinutes?.(h) ?? []).includes(m) ||
      outside(day.hour(h).minute(m).second(0), day.hour(h).minute(m).second(59)),
    second: (h, m, s) => {
      const exact = day.hour(h).minute(m).second(s);
      return (config?.disabledSeconds?.(h, m) ?? []).includes(s) || outside(exact, exact);
    },
  };
}

interface ColumnOption {
  value: number;
  label: string;
  disabled: boolean;
}

/** One scrollable option column. */
function TimeColumn({
  header,
  type,
  options,
  value,
  onPick,
  changeOnScroll,
  cellRender,
}: {
  header: string;
  type: TimeColumnType;
  options: ColumnOption[];
  value: number | null;
  onPick: (v: number) => void;
  changeOnScroll: boolean;
  cellRender?: TimeCellRender;
}) {
  const listRef = React.useRef<HTMLDivElement>(null);
  const userScrolling = React.useRef(false);
  const timer = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (value === null) return;
    listRef.current?.querySelector<HTMLElement>(`[data-v="${value}"]`)?.scrollIntoView({ block: "nearest" });
  }, [value]);

  React.useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  const handleScroll = () => {
    if (!changeOnScroll || !userScrolling.current) return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      userScrolling.current = false;
      const list = listRef.current;
      if (!list) return;
      const cells = Array.from(list.querySelectorAll<HTMLElement>("[data-v]"));
      let bestValue: number | null = null;
      let bestDistance = Number.POSITIVE_INFINITY;
      for (const cell of cells) {
        const distance = Math.abs(cell.offsetTop - list.scrollTop);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestValue = Number(cell.dataset.v);
        }
      }
      if (bestValue === null || bestValue === value) return;
      if (options.find((o) => o.value === bestValue)?.disabled) return;
      onPick(bestValue);
    }, 180);
  };

  return (
    <div className="flex flex-col">
      <div className="border-b border-border-secondary px-2 py-1 text-center text-[10px] font-semibold text-text-quaternary uppercase">
        {header}
      </div>
      <div
        ref={listRef}
        onScroll={handleScroll}
        onWheel={() => (userScrolling.current = true)}
        onTouchMove={() => (userScrolling.current = true)}
        className="kk-scrollbar h-44 w-14 overflow-y-auto scroll-smooth py-1"
      >
        {options.map((option) => {
          const originNode = <span>{option.label}</span>;
          return (
            <button
              key={option.value}
              type="button"
              data-v={option.value}
              disabled={option.disabled}
              onClick={() => onPick(option.value)}
              className={cn(
                "block w-full rounded-sm px-1 py-1 text-center text-xs transition-colors duration-fast",
                option.value === value ? "bg-primary-bg font-semibold text-primary" : "text-text hover:bg-fill-tertiary",
                option.disabled && "cursor-not-allowed text-text-disabled hover:bg-transparent",
              )}
            >
              {cellRender ? cellRender(type === "meridiem" ? option.label : option.value, { type, originNode }) : originNode}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface TimePanelProps extends ColumnFlags {
  value: Dayjs | null;
  onPick: (next: Dayjs) => void;
  hourStep: number;
  minuteStep: number;
  secondStep: number;
  limits: TimeLimits;
  hideDisabledOptions: boolean;
  changeOnScroll: boolean;
  cellRender?: TimeCellRender;
}

/** The hour / minute / second / meridiem columns. */
function TimePanel({
  value,
  onPick,
  use12Hours,
  showHour,
  showMinute,
  showSecond,
  hourStep,
  minuteStep,
  secondStep,
  limits,
  hideDisabledOptions,
  changeOnScroll,
  cellRender,
}: TimePanelProps) {
  const base = value ?? dayjs().startOf("day");
  const hour = base.hour();
  const minute = base.minute();
  const isPM = hour >= 12;
  const has = value !== null;

  const visible = (options: ColumnOption[]) => (hideDisabledOptions ? options.filter((o) => !o.disabled) : options);

  const hourOptions: ColumnOption[] = [];
  if (use12Hours) {
    for (let i = 0; i < 12; i += hourStep) {
      const h24 = (isPM ? 12 : 0) + i;
      hourOptions.push({ value: h24, label: pad2(i === 0 ? 12 : i), disabled: limits.hour(h24) });
    }
  } else {
    for (let i = 0; i < 24; i += hourStep) hourOptions.push({ value: i, label: pad2(i), disabled: limits.hour(i) });
  }

  const minuteOptions: ColumnOption[] = [];
  for (let i = 0; i < 60; i += minuteStep) {
    minuteOptions.push({ value: i, label: pad2(i), disabled: limits.minute(hour, i) });
  }

  const secondOptions: ColumnOption[] = [];
  for (let i = 0; i < 60; i += secondStep) {
    secondOptions.push({ value: i, label: pad2(i), disabled: limits.second(hour, minute, i) });
  }

  const allHoursOff = (from: number) =>
    Array.from({ length: 12 }, (_, i) => from + i).every((h) => limits.hour(h));

  const meridiemOptions: ColumnOption[] = [
    { value: 0, label: "AM", disabled: allHoursOff(0) },
    { value: 1, label: "PM", disabled: allHoursOff(12) },
  ];

  return (
    <div className="flex divide-x divide-border-secondary">
      {showHour && (
        <TimeColumn
          header={use12Hours ? "hh" : "HH"}
          type="hour"
          options={visible(hourOptions)}
          value={has ? hour : null}
          onPick={(v) => onPick(base.hour(v))}
          changeOnScroll={changeOnScroll}
          cellRender={cellRender}
        />
      )}
      {showMinute && (
        <TimeColumn
          header="mm"
          type="minute"
          options={visible(minuteOptions)}
          value={has ? minute : null}
          onPick={(v) => onPick(base.minute(v))}
          changeOnScroll={changeOnScroll}
          cellRender={cellRender}
        />
      )}
      {showSecond && (
        <TimeColumn
          header="ss"
          type="second"
          options={visible(secondOptions)}
          value={has ? base.second() : null}
          onPick={(v) => onPick(base.second(v))}
          changeOnScroll={changeOnScroll}
          cellRender={cellRender}
        />
      )}
      {use12Hours && (
        <TimeColumn
          header="A"
          type="meridiem"
          options={visible(meridiemOptions)}
          value={has ? (isPM ? 1 : 0) : null}
          onPick={(v) => onPick(base.hour((hour % 12) + v * 12))}
          changeOnScroll={changeOnScroll}
          cellRender={cellRender}
        />
      )}
    </div>
  );
}

/** Popup shell: portal + placement + outside click, shared by both pickers. */
function usePopup(
  open: boolean,
  placement: TimePickerPlacement,
  close: () => void,
  getPopupContainer?: (triggerNode: HTMLElement | null) => HTMLElement,
): {
  triggerRef: React.RefObject<HTMLDivElement | null>;
  popupRef: React.RefObject<HTMLDivElement | null>;
  pos: { top: number; left: number } | null;
  container: HTMLElement | undefined;
} {
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const popupRef = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState<{ top: number; left: number } | null>(null);

  useClickOutside(
    popupRef,
    (e) => {
      if (triggerRef.current?.contains(e.target as Node)) return;
      close();
    },
    open,
  );

  const container = React.useMemo(
    () => (getPopupContainer ? getPopupContainer(triggerRef.current) : undefined),
    [getPopupContainer, open], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current || !popupRef.current) return;
    setPos(
      toContainerCoords(
        computeFloatingPosition(
          triggerRef.current.getBoundingClientRect(),
          measureFloating(popupRef.current),
          placement,
          4,
        ),
        container,
      ),
    );
  }, [placement, container]);

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

  return { triggerRef, popupRef, pos, container };
}

const POPUP_CLASS =
  "flex flex-col overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-kk animate-in fade-in-0 zoom-in-95 duration-200 ease-kk-spring-soft";

const INPUT_CLASS =
  "min-w-0 flex-1 bg-transparent text-inherit outline-none placeholder:text-text-placeholder disabled:cursor-not-allowed disabled:text-text-disabled";

const clearIconOf = (allowClear: boolean | { clearIcon?: React.ReactNode }) =>
  typeof allowClear === "object" ? (allowClear.clearIcon ?? <X className="size-3.5" />) : <X className="size-3.5" />;

/* ------------------------------------------------------------------ */
/* TimePicker                                                          */
/* ------------------------------------------------------------------ */

export function TimePicker({
  value: valueProp,
  defaultValue,
  onChange,
  onSelect,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  format,
  placeholder = "Select time",
  disabled = false,
  allowClear = true,
  size = "md",
  variant = "outlined",
  status,
  placement = "bottomLeft",
  hourStep = 1,
  minuteStep = 1,
  secondStep = 1,
  use12Hours,
  showHour,
  showMinute,
  showSecond,
  showNow = true,
  needConfirm = true,
  changeOnScroll = false,
  disabledTime,
  hideDisabledOptions = false,
  minDate,
  maxDate,
  inputReadOnly = false,
  autoFocus = false,
  renderExtraFooter,
  cellRender,
  prefix,
  suffixIcon,
  className,
  popupClassName,
  style,
  popupStyle,
  id,
  name,
  onFocus,
  onBlur,
  getPopupContainer,
}: TimePickerProps) {
  const flags = resolveFlags(format, use12Hours, showHour, showMinute, showSecond);
  const activeFormat = format ?? defaultFormat(flags);

  const isControlled = valueProp !== undefined;
  const [internal, setInternal] = React.useState<Dayjs | null>(defaultValue ?? null);
  const selected = isControlled ? (valueProp ?? null) : internal;

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = openProp ?? uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const [draft, setDraft] = React.useState<Dayjs | null>(selected);
  const [typed, setTyped] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // keep the panel in sync with a controlled value…
  React.useEffect(() => {
    setDraft(selected);
  }, [selected?.valueOf()]); // eslint-disable-line react-hooks/exhaustive-deps

  // …and re-seed it every time the popup opens
  React.useEffect(() => {
    if (open) {
      setDraft(selected);
      setTyped(null);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const { triggerRef, popupRef, pos, container } = usePopup(open, placement, () => setOpen(false), getPopupContainer);

  const commit = (next: Dayjs | null) => {
    if (!isControlled) setInternal(next);
    setTyped(null);
    onChange?.(next, next ? next.format(activeFormat) : "");
  };

  const handlePick = (next: Dayjs) => {
    setDraft(next);
    onSelect?.(next);
    if (!needConfirm) commit(next);
  };

  const handleNow = () => {
    const now = dayjs().millisecond(0);
    setDraft(now);
    onSelect?.(now);
    commit(now);
    setOpen(false);
  };

  const handleConfirm = () => {
    commit(draft ?? dayjs().millisecond(0));
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDraft(null);
    commit(null);
  };

  const applyTyped = () => {
    if (typed === null) return;
    const text = typed.trim();
    if (!text) {
      setDraft(null);
      commit(null);
      return;
    }
    const parsed = dayjs(text, activeFormat, true);
    if (!parsed.isValid()) {
      setTyped(null);
      return;
    }
    const next = (selected ?? dayjs())
      .hour(parsed.hour())
      .minute(parsed.minute())
      .second(parsed.second())
      .millisecond(0);
    setDraft(next);
    commit(next);
  };

  const limits = makeLimits(draft ?? dayjs().startOf("day"), disabledTime?.(draft ?? dayjs()), minDate, maxDate);
  const display = typed ?? (selected ? selected.format(activeFormat) : "");
  const showClear = allowClear !== false && Boolean(selected) && !disabled;

  return (
    <div
      ref={triggerRef}
      data-slot="time-picker"
      data-disabled={disabled || undefined}
      style={style}
      onClick={() => !disabled && setOpen(true)}
      className={cn(
        "relative inline-flex w-44 items-center gap-2 transition-all duration-mid ease-kk-in-out",
        !disabled && "cursor-pointer",
        SIZE_CLASSES[size],
        VARIANT_CLASSES[variant],
        status === "error" && "border-error focus-within:border-error focus-within:ring-error/20",
        status === "warning" && "border-warning focus-within:border-warning focus-within:ring-warning/20",
        disabled && "cursor-not-allowed bg-bg-container-disabled text-text-disabled",
        className,
      )}
    >
      {prefix && <span className="shrink-0 text-text-tertiary">{prefix}</span>}

      <input
        ref={inputRef}
        id={id}
        name={name}
        value={display}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={inputReadOnly}
        autoComplete="off"
        onChange={(e) => setTyped(e.target.value)}
        onFocus={onFocus}
        onBlur={(e) => {
          applyTyped();
          onBlur?.(e);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            applyTyped();
            setOpen(false);
          } else if (e.key === "Escape") {
            setTyped(null);
            setOpen(false);
          }
        }}
        className={cn(INPUT_CLASS, inputReadOnly && !disabled && "cursor-pointer")}
      />

      <span className="flex shrink-0 items-center">
        {showClear ? (
          <button
            type="button"
            aria-label="clear"
            onClick={handleClear}
            className="rounded-full p-0.5 text-text-quaternary transition-colors hover:bg-fill-tertiary hover:text-text"
          >
            {clearIconOf(allowClear)}
          </button>
        ) : (
          (suffixIcon ?? <Clock className="size-4 text-text-quaternary" />)
        )}
      </span>

      {open && !disabled && (
        <Portal container={container}>
          <div
            ref={popupRef}
            onClick={(e) => e.stopPropagation()}
            style={{ position: "absolute", top: pos?.top ?? -9999, left: pos?.left ?? -9999, zIndex: 1050, ...popupStyle }}
            className={cn(POPUP_CLASS, popupClassName)}
          >
            <TimePanel
              {...flags}
              value={draft}
              onPick={handlePick}
              hourStep={hourStep}
              minuteStep={minuteStep}
              secondStep={secondStep}
              limits={limits}
              hideDisabledOptions={hideDisabledOptions}
              changeOnScroll={changeOnScroll}
              cellRender={cellRender}
            />

            {renderExtraFooter && (
              <div className="border-t border-border-secondary px-3 py-2 text-xs text-text-secondary">
                {renderExtraFooter()}
              </div>
            )}

            {(showNow || needConfirm) && (
              <div className="flex items-center justify-between gap-2 border-t border-border-secondary px-3 py-2">
                {showNow ? (
                  <button
                    type="button"
                    onClick={handleNow}
                    className="text-xs font-medium text-primary transition-colors hover:text-primary-hover"
                  >
                    <Clock className="mr-1 inline size-3" />
                    Now
                  </button>
                ) : (
                  <span />
                )}
                {needConfirm && (
                  <Button size="sm" type="primary" onClick={handleConfirm} className="h-6 px-3 text-[11px]">
                    OK
                  </Button>
                )}
              </div>
            )}
          </div>
        </Portal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TimePicker.RangePicker                                              */
/* ------------------------------------------------------------------ */

export function TimeRangePicker({
  value: valueProp,
  defaultValue,
  onChange,
  onSelect,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  format,
  placeholder = ["Start time", "End time"],
  disabled = false,
  allowClear = true,
  size = "md",
  variant = "outlined",
  status,
  placement = "bottomLeft",
  hourStep = 1,
  minuteStep = 1,
  secondStep = 1,
  use12Hours,
  showHour,
  showMinute,
  showSecond,
  showNow = true,
  needConfirm = true,
  changeOnScroll = false,
  disabledTime,
  hideDisabledOptions = false,
  minDate,
  maxDate,
  inputReadOnly = false,
  autoFocus = false,
  order = true,
  separator,
  renderExtraFooter,
  cellRender,
  prefix,
  suffixIcon,
  className,
  popupClassName,
  style,
  popupStyle,
  id,
  onFocus,
  onBlur,
  getPopupContainer,
}: TimeRangePickerProps) {
  const flags = resolveFlags(format, use12Hours, showHour, showMinute, showSecond);
  const activeFormat = format ?? defaultFormat(flags);
  const [startDisabled, endDisabled] = Array.isArray(disabled) ? disabled : [disabled, disabled];
  const allDisabled = startDisabled && endDisabled;

  const isControlled = valueProp !== undefined;
  const [internal, setInternal] = React.useState<TimePickerRangeValue>(defaultValue ?? null);
  const value = isControlled ? (valueProp ?? null) : internal;

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = openProp ?? uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const [side, setSide] = React.useState<"start" | "end">("start");
  const [draft, setDraft] = React.useState<[Dayjs | null, Dayjs | null]>([value?.[0] ?? null, value?.[1] ?? null]);
  const [typed, setTyped] = React.useState<[string | null, string | null]>([null, null]);
  const startRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setDraft([value?.[0] ?? null, value?.[1] ?? null]);
  }, [value?.[0]?.valueOf(), value?.[1]?.valueOf()]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (open) {
      setDraft([value?.[0] ?? null, value?.[1] ?? null]);
      setTyped([null, null]);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (autoFocus) startRef.current?.focus();
  }, [autoFocus]);

  const { triggerRef, popupRef, pos, container } = usePopup(open, placement, () => setOpen(false), getPopupContainer);

  const commit = (pair: [Dayjs | null, Dayjs | null]) => {
    let [a, b] = pair;
    if (order && a && b && a.isAfter(b)) [a, b] = [b, a];
    const next: [Dayjs | null, Dayjs | null] = [a, b];
    setDraft(next);
    setTyped([null, null]);
    if (!isControlled) setInternal(a || b ? next : null);
    if (a && b) onChange?.([a, b], [a.format(activeFormat), b.format(activeFormat)]);
    else if (!a && !b) onChange?.(null, ["", ""]);
    return next;
  };

  const handlePick = (next: Dayjs) => {
    const pair: [Dayjs | null, Dayjs | null] = side === "start" ? [next, draft[1]] : [draft[0], next];
    setDraft(pair);
    onSelect?.(next, side);
    if (!needConfirm) commit(pair);
  };

  const handleNow = () => {
    const now = dayjs().millisecond(0);
    const pair: [Dayjs | null, Dayjs | null] = side === "start" ? [now, draft[1]] : [draft[0], now];
    setDraft(pair);
    onSelect?.(now, side);
    if (!needConfirm) commit(pair);
  };

  const handleConfirm = () => {
    if (side === "start" && !draft[1]) {
      if (!draft[0]) setDraft([dayjs().millisecond(0), draft[1]]);
      setSide("end");
      return;
    }
    const next = commit([draft[0], draft[1] ?? dayjs().millisecond(0)]);
    if (next[0] && next[1]) setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSide("start");
    commit([null, null]);
  };

  const applyTyped = (index: 0 | 1) => {
    const text = typed[index];
    if (text === null) return;
    const pair: [Dayjs | null, Dayjs | null] = [draft[0], draft[1]];
    if (!text.trim()) {
      pair[index] = null;
    } else {
      const parsed = dayjs(text.trim(), activeFormat, true);
      if (!parsed.isValid()) {
        setTyped((prev) => (index === 0 ? [null, prev[1]] : [prev[0], null]));
        return;
      }
      pair[index] = dayjs().hour(parsed.hour()).minute(parsed.minute()).second(parsed.second()).millisecond(0);
    }
    commit(pair);
  };

  const draftValue = side === "start" ? draft[0] : draft[1];
  const limits = makeLimits(
    draftValue ?? dayjs().startOf("day"),
    disabledTime?.(draftValue ?? dayjs(), side),
    minDate,
    maxDate,
  );
  const showClear = allowClear !== false && Boolean(value?.[0] || value?.[1]) && !allDisabled;

  const text = (index: 0 | 1) => typed[index] ?? (value?.[index] ? value[index]!.format(activeFormat) : "");

  const inputProps = (index: 0 | 1) => ({
    value: text(index),
    placeholder: placeholder[index],
    disabled: index === 0 ? startDisabled : endDisabled,
    readOnly: inputReadOnly,
    autoComplete: "off",
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      setSide(index === 0 ? "start" : "end");
      onFocus?.(e);
    },
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      setTyped((prev) => (index === 0 ? [next, prev[1]] : [prev[0], next]));
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      applyTyped(index);
      onBlur?.(e);
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") applyTyped(index);
      else if (e.key === "Escape") {
        setTyped([null, null]);
        setOpen(false);
      }
    },
    className: cn(
      INPUT_CLASS,
      "w-0 text-center",
      inputReadOnly && !allDisabled && "cursor-pointer",
      open && side === (index === 0 ? "start" : "end") && "text-primary",
    ),
  });

  return (
    <div
      ref={triggerRef}
      id={id}
      data-slot="time-range-picker"
      data-disabled={allDisabled || undefined}
      style={style}
      onClick={() => !allDisabled && setOpen(true)}
      className={cn(
        "relative inline-flex w-64 items-center gap-1 transition-all duration-mid ease-kk-in-out",
        !allDisabled && "cursor-pointer",
        SIZE_CLASSES[size],
        VARIANT_CLASSES[variant],
        status === "error" && "border-error focus-within:border-error focus-within:ring-error/20",
        status === "warning" && "border-warning focus-within:border-warning focus-within:ring-warning/20",
        allDisabled && "cursor-not-allowed bg-bg-container-disabled text-text-disabled",
        className,
      )}
    >
      {prefix && <span className="shrink-0 text-text-tertiary">{prefix}</span>}

      <input ref={startRef} {...inputProps(0)} />
      <span className="shrink-0 text-text-quaternary">{separator ?? <ArrowRight className="size-3" />}</span>
      <input {...inputProps(1)} />

      <span className="flex shrink-0 items-center pl-1">
        {showClear ? (
          <button
            type="button"
            aria-label="clear"
            onClick={handleClear}
            className="rounded-full p-0.5 text-text-quaternary transition-colors hover:bg-fill-tertiary hover:text-text"
          >
            {clearIconOf(allowClear)}
          </button>
        ) : (
          (suffixIcon ?? <Clock className="size-4 text-text-quaternary" />)
        )}
      </span>

      {open && !allDisabled && (
        <Portal container={container}>
          <div
            ref={popupRef}
            onClick={(e) => e.stopPropagation()}
            style={{ position: "absolute", top: pos?.top ?? -9999, left: pos?.left ?? -9999, zIndex: 1050, ...popupStyle }}
            className={cn(POPUP_CLASS, popupClassName)}
          >
            <div className="flex items-center gap-2 border-b border-border-secondary px-3 py-1.5 text-xs">
              {(["start", "end"] as const).map((s, i) => (
                <React.Fragment key={s}>
                  {i === 1 && <ArrowRight className="size-3 text-text-quaternary" />}
                  <button
                    type="button"
                    onClick={() => setSide(s)}
                    className={cn(
                      "rounded-sm px-1 py-0.5 transition-colors duration-fast",
                      side === s ? "font-semibold text-primary" : "text-text-tertiary hover:text-text",
                    )}
                  >
                    {draft[i] ? draft[i]!.format(activeFormat) : placeholder[i]}
                  </button>
                </React.Fragment>
              ))}
            </div>

            <TimePanel
              {...flags}
              value={draftValue}
              onPick={handlePick}
              hourStep={hourStep}
              minuteStep={minuteStep}
              secondStep={secondStep}
              limits={limits}
              hideDisabledOptions={hideDisabledOptions}
              changeOnScroll={changeOnScroll}
              cellRender={cellRender}
            />

            {renderExtraFooter && (
              <div className="border-t border-border-secondary px-3 py-2 text-xs text-text-secondary">
                {renderExtraFooter()}
              </div>
            )}

            {(showNow || needConfirm) && (
              <div className="flex items-center justify-between gap-2 border-t border-border-secondary px-3 py-2">
                {showNow ? (
                  <button
                    type="button"
                    onClick={handleNow}
                    className="text-xs font-medium text-primary transition-colors hover:text-primary-hover"
                  >
                    <Clock className="mr-1 inline size-3" />
                    Now
                  </button>
                ) : (
                  <span />
                )}
                {needConfirm && (
                  <Button size="sm" type="primary" onClick={handleConfirm} className="h-6 px-3 text-[11px]">
                    {side === "start" && !draft[1] ? "Next" : "OK"}
                  </Button>
                )}
              </div>
            )}
          </div>
        </Portal>
      )}
    </div>
  );
}

TimePicker.RangePicker = TimeRangePicker;
