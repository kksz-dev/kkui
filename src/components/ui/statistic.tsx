import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Format a numeric value with groupSeparator and decimalSeparator
 */
function formatNumber(
  value: number | string,
  precision?: number,
  groupSeparator: string = ",",
  decimalSeparator: string = ".",
): string {
  if (typeof value === "string" && isNaN(Number(value))) {
    return value;
  }

  const num = typeof value === "number" ? value : Number(value);
  const fixed = precision !== undefined ? num.toFixed(precision) : String(num);
  const [intPart, decPart] = fixed.split(".");

  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);
  return decPart !== undefined ? `${formattedInt}${decimalSeparator}${decPart}` : formattedInt;
}

export interface StatisticProps extends Omit<React.ComponentProps<"div">, "title" | "prefix"> {
  /** Title of the statistic */
  title?: React.ReactNode;
  /** Display value */
  value?: number | string;
  /** Precision of input value (decimal places) */
  precision?: number;
  /** Prefix of the value */
  prefix?: React.ReactNode;
  /** Suffix of the value */
  suffix?: React.ReactNode;
  /** Custom style for the value */
  valueStyle?: React.CSSProperties;
  /** Group separator for thousandths (default ",") */
  groupSeparator?: string;
  /** Decimal separator (default ".") */
  decimalSeparator?: string;
  /** Custom formatter function */
  formatter?: (value: number | string) => React.ReactNode;
  /** Wrap the rendered value — receives the already formatted node */
  valueRender?: (node: React.ReactNode) => React.ReactNode;
  /** Loading skeleton state */
  loading?: boolean;
}

function Statistic({
  className,
  title,
  value,
  precision,
  prefix,
  suffix,
  valueStyle,
  groupSeparator = ",",
  decimalSeparator = ".",
  formatter,
  valueRender,
  loading = false,
  ...props
}: StatisticProps) {
  const renderedValue = React.useMemo(() => {
    if (value === undefined || value === null) return "-";
    if (formatter) return formatter(value);
    return formatNumber(value, precision, groupSeparator, decimalSeparator);
  }, [value, precision, groupSeparator, decimalSeparator, formatter]);

  return (
    <div data-slot="statistic" className={cn("font-sans", className)} {...props}>
      {title != null && (
        <div data-slot="statistic-title" className="mb-1 text-sm text-text-secondary">
          {title}
        </div>
      )}
      <div data-slot="statistic-content" className="flex items-baseline text-2xl font-normal text-text-heading" style={valueStyle}>
        {loading ? (
          <div className="kk-shimmer h-8 w-24 rounded-md bg-fill-secondary" />
        ) : (
          (() => {
            const body = (
              <>
                {prefix && (
                  <span data-slot="statistic-prefix" className="mr-1 inline-flex items-center text-lg">
                    {prefix}
                  </span>
                )}
                <span data-slot="statistic-value" className="inline-block">
                  {renderedValue}
                </span>
                {suffix && (
                  <span data-slot="statistic-suffix" className="ml-1 inline-flex items-center text-sm text-text-secondary">
                    {suffix}
                  </span>
                )}
              </>
            );
            return valueRender ? valueRender(body) : body;
          })()
        )}
      </div>
    </div>
  );
}

/* ---------------- Countdown Formatting ---------------- */

function formatTime(diffMs: number, formatStr: string): string {
  let diff = Math.max(0, Math.floor(diffMs));

  const hasDays = /D/.test(formatStr);
  const days = hasDays ? Math.floor(diff / 86400000) : 0;
  if (hasDays) diff %= 86400000;

  const hours = Math.floor(diff / 3600000);
  diff %= 3600000;

  const minutes = Math.floor(diff / 60000);
  diff %= 60000;

  const seconds = Math.floor(diff / 1000);
  const milliseconds = diff % 1000;

  const pad = (n: number, size = 2) => String(n).padStart(size, "0");

  return formatStr
    .replace(/\bDD\b/g, pad(days))
    .replace(/\bD\b/g, String(days))
    .replace(/\bHH\b/g, pad(hours))
    .replace(/\bH\b/g, String(hours))
    .replace(/\bmm\b/g, pad(minutes))
    .replace(/\bm\b/g, String(minutes))
    .replace(/\bss\b/g, pad(seconds))
    .replace(/\bs\b/g, String(seconds))
    .replace(/\bSSS\b/g, pad(milliseconds, 3));
}

/* ---------------- StatisticCountdown ---------------- */

export interface StatisticCountdownProps extends Omit<StatisticProps, "value" | "formatter" | "onChange"> {
  /** Target deadline timestamp in ms or Date object or ISO string */
  value?: number | Date | string;
  /** Format of countdown (default "HH:mm:ss") */
  format?: string;
  /** Triggered when timer reaches 0 */
  onFinish?: () => void;
  /** Triggered on every tick */
  onChange?: (diff: number) => void;
}

/** Keep the latest callback without re-arming the interval on every render. */
function useLatest<T>(value: T) {
  const ref = React.useRef(value);
  React.useEffect(() => {
    ref.current = value;
  });
  return ref;
}

function toTimestamp(value: number | Date | string | undefined, fallback: number): number {
  if (value === undefined || value === null) return fallback;
  if (value instanceof Date) return value.getTime();
  if (typeof value === "string") return new Date(value).getTime();
  return value;
}

function StatisticCountdown({
  value,
  format = "HH:mm:ss",
  onFinish,
  onChange,
  ...props
}: StatisticCountdownProps) {
  const targetTimestamp = React.useMemo(() => toTimestamp(value, 0), [value]);
  const [diff, setDiff] = React.useState<number>(() => Math.max(0, targetTimestamp - Date.now()));
  const finishedRef = React.useRef(false);
  const onFinishRef = useLatest(onFinish);
  const onChangeRef = useLatest(onChange);

  React.useEffect(() => {
    finishedRef.current = false;
    const update = () => {
      const remaining = Math.max(0, targetTimestamp - Date.now());
      setDiff(remaining);
      onChangeRef.current?.(remaining);
      if (remaining <= 0 && !finishedRef.current) {
        finishedRef.current = true;
        onFinishRef.current?.();
      }
    };

    update();
    const timer = setInterval(update, format.includes("SSS") ? 30 : 1000);
    return () => clearInterval(timer);
  }, [targetTimestamp, format, onChangeRef, onFinishRef]);

  const formatted = React.useMemo(() => formatTime(diff, format), [diff, format]);

  return <Statistic {...props} value={formatted} />;
}

/* ---------------- StatisticCountup ---------------- */

export interface StatisticCountupProps extends Omit<StatisticProps, "value" | "formatter" | "onChange"> {
  /** Start timestamp; counts up from here */
  value?: number | Date | string;
  format?: string;
  onChange?: (elapsed: number) => void;
}

function StatisticCountup({ value, format = "HH:mm:ss", onChange, ...props }: StatisticCountupProps) {
  const startTimestamp = React.useMemo(() => toTimestamp(value, Date.now()), [value]);
  const [elapsed, setElapsed] = React.useState<number>(() => Math.max(0, Date.now() - startTimestamp));
  const onChangeRef = useLatest(onChange);

  React.useEffect(() => {
    const update = () => {
      const el = Math.max(0, Date.now() - startTimestamp);
      setElapsed(el);
      onChangeRef.current?.(el);
    };

    update();
    const timer = setInterval(update, format.includes("SSS") ? 30 : 1000);
    return () => clearInterval(timer);
  }, [startTimestamp, format, onChangeRef]);

  const formatted = React.useMemo(() => formatTime(elapsed, format), [elapsed, format]);

  return <Statistic {...props} value={formatted} />;
}

/* ---------------- StatisticTimer ---------------- */

export interface StatisticTimerProps extends Omit<StatisticProps, "value" | "formatter" | "onChange"> {
  /** Mode: countdown (to target timestamp) or countup (from start timestamp) */
  type?: "countdown" | "countup";
  /** Base timestamp in ms (for countdown: target; for countup: startTime) */
  value?: number | Date | string;
  /** Format (default "HH:mm:ss") */
  format?: string;
  /** Called when the countdown reaches zero */
  onFinish?: () => void;
  /** Called on every tick with the current duration in ms */
  onChange?: (time: number) => void;
}

/**
 * Switches between countdown and countup. Both branches are separate components
 * so changing `type` at runtime cannot change the hook order.
 */
function StatisticTimer({ type = "countdown", onFinish, ...props }: StatisticTimerProps) {
  if (type === "countdown") return <StatisticCountdown {...props} onFinish={onFinish} />;
  return <StatisticCountup {...props} />;
}

Statistic.Countdown = StatisticCountdown;
Statistic.Timer = StatisticTimer;
Statistic.Countup = StatisticCountup;

export { Statistic, StatisticCountdown, StatisticCountup, StatisticTimer };
