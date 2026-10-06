import * as React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "prefix"> {
  title: React.ReactNode;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  icon?: React.ReactNode;
  trend?: {
    value: number | string;
    direction: "up" | "down" | "neutral";
    label?: React.ReactNode;
  };
  sparklineData?: number[];
  animate?: boolean;
  /** Swap the card body for a placeholder while the number is being fetched. */
  loading?: boolean;
  /** Decimal places kept while counting up and when formatting the final value. */
  precision?: number;
  /** Full control over the printed value; receives the (animated) number. */
  formatter?: (value: number) => React.ReactNode;
  /** Inline style for the value line. */
  valueStyle?: React.CSSProperties;
  className?: string;
}

/** Counts from the previous value to `target`. Idle (and free) when `enabled` is false. */
function useCountUp(target: number, enabled: boolean, duration = 1000) {
  const [count, setCount] = React.useState(enabled ? 0 : target);
  const fromRef = React.useRef(enabled ? 0 : target);

  React.useEffect(() => {
    if (!enabled || !Number.isFinite(target)) {
      setCount(target);
      fromRef.current = target;
      return;
    }
    const start = fromRef.current;
    const startTime = performance.now();
    let frame = 0;

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(start + (target - start) * ease);
      if (progress < 1) frame = requestAnimationFrame(step);
      else fromRef.current = target;
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, enabled]);

  return count;
}

export function StatCard({
  title,
  value,
  prefix,
  suffix,
  icon,
  trend,
  sparklineData,
  animate = true,
  loading = false,
  precision,
  formatter,
  valueStyle,
  className,
  ...props
}: StatCardProps) {
  // a numeric string ("1234.5") counts up just like a number does
  const numValue = typeof value === "number" ? value : Number.parseFloat(String(value));
  const isNumber = Number.isFinite(numValue);
  const counted = useCountUp(isNumber ? numValue : 0, animate && isNumber && !loading);

  const printNumber = (n: number) =>
    n.toLocaleString(undefined, {
      minimumFractionDigits: precision ?? 0,
      maximumFractionDigits: precision ?? (Number.isInteger(n) ? 0 : 2),
    });

  const displayedValue = !isNumber
    ? value
    : formatter
      ? formatter(animate ? counted : numValue)
      : printNumber(animate ? counted : numValue);

  // Mini Sparkline SVG generator
  const renderSparkline = () => {
    if (!sparklineData || sparklineData.length < 2) return null;
    const min = Math.min(...sparklineData);
    const max = Math.max(...sparklineData);
    const range = max - min || 1;
    const width = 100;
    const height = 30;

    const points = sparklineData
      .map((val, idx) => {
        const x = (idx / (sparklineData.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
      })
      .join(" ");

    const [lastX, lastY] = points.split(" ").at(-1)!.split(",").map(Number);

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="h-8 w-24 overflow-visible" aria-hidden>
        <polygon points={`0,${height} ${points} ${width},${height}`} className="fill-primary/10" />
        <polyline
          points={points}
          className="fill-none stroke-primary"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={lastX} cy={lastY} r="2.5" className="fill-primary" />
      </svg>
    );
  };

  return (
    <div
      data-slot="stat-card"
      className={cn(
        "relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-bg-container p-5 shadow-xs transition-all duration-mid hover:shadow-kk",
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-medium text-text-secondary">{title}</span>
          {loading ? (
            <div className="h-8 w-24 animate-pulse rounded-md bg-fill-tertiary" />
          ) : (
            <div
              className="flex items-baseline gap-1 text-2xl font-bold tracking-tight text-text-heading"
              style={valueStyle}
            >
              {prefix && <span className="text-lg font-normal text-text-tertiary">{prefix}</span>}
              <span>{displayedValue}</span>
              {suffix && <span className="text-sm font-normal text-text-tertiary">{suffix}</span>}
            </div>
          )}
        </div>
        {icon && (
          <div className="flex size-10 items-center justify-center rounded-lg bg-fill-tertiary text-primary">
            {icon}
          </div>
        )}
      </div>

      {(trend || sparklineData) && !loading && (
        <div className="mt-4 flex items-center justify-between border-t border-border-secondary pt-3">
          {trend ? (
            <div className="flex items-center gap-1.5 text-xs">
              <span
                className={cn(
                  "inline-flex items-center font-semibold",
                  trend.direction === "up" && "text-success",
                  trend.direction === "down" && "text-error",
                  trend.direction === "neutral" && "text-text-tertiary",
                )}
              >
                {trend.direction === "up" && <ArrowUpRight className="size-3.5" />}
                {trend.direction === "down" && <ArrowDownRight className="size-3.5" />}
                {trend.direction === "neutral" && <Minus className="size-3.5" />}
                {trend.value}
              </span>
              {trend.label && <span className="text-text-tertiary">{trend.label}</span>}
            </div>
          ) : (
            <div />
          )}

          {renderSparkline()}
        </div>
      )}
    </div>
  );
}
