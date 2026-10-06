import * as React from "react";
import { CircleCheck, CircleX, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInjectedStyle } from "@/hooks/use-injected-style";

export type ProgressType = "line" | "circle" | "dashboard";
export type ProgressStatus = "normal" | "active" | "success" | "exception";
export type StrokeLinecap = "round" | "butt" | "square";
export type ProgressSize =
  | number
  | [number, number]
  | "small"
  | "default"
  | { width?: number; height?: number };

export interface ProgressGradient {
  from?: string;
  to?: string;
  direction?: string;
  [key: string]: string | undefined;
}

export interface ProgressProps extends Omit<React.ComponentProps<"div">, "size"> {
  /** Where the info sits relative to the bar (line type only). */
  percentPosition?: { align?: "start" | "center" | "end"; type?: "inner" | "outer" };
  /** Type of progress: line | circle | dashboard */
  type?: ProgressType;
  /** Completion percentage (0 - 100) */
  percent?: number;
  /** Status of progress: normal | active | success | exception */
  status?: ProgressStatus;
  /** Whether to display the progress text info */
  showInfo?: boolean;
  /** Custom formatter function for progress text info */
  format?: (percent?: number, successPercent?: number) => React.ReactNode;
  /** Color of progress stroke (string, gradient object, string array or preset) */
  strokeColor?: string | ProgressGradient | string[];
  /** Width / thickness of progress stroke */
  strokeWidth?: number;
  /** Preset size or custom dimensions */
  size?: ProgressSize;
  /** Style of stroke ends */
  strokeLinecap?: StrokeLinecap;
  /** Color of unfilled trail path */
  trailColor?: string;
  /** Segmented steps count or config */
  steps?: number | { count: number; gap?: number };
  /** Success segment config */
  success?: { percent?: number; strokeColor?: string };
  /** Gap degree in degrees for dashboard type (0-295, default 75) */
  gapDegree?: number;
  /** Gap position for circle/dashboard */
  gapPosition?: "top" | "bottom" | "left" | "right";
}

const progressActiveKeyframes = `
@keyframes kk-progress-active {
  0% { transform: translateX(-100%); opacity: 0.1; }
  20% { transform: translateX(-100%); opacity: 0.5; }
  100% { transform: translateX(100%); opacity: 0; }
}
.kk-progress-active-bar::after {
  content: "";
  position: absolute;
  inset: 0;
  background: #fff;
  border-radius: inherit;
  opacity: 0;
  animation: kk-progress-active 2.4s cubic-bezier(0.23, 1, 0.32, 1) infinite;
}
`;

function ProgressStyleTag() {
  useInjectedStyle("progress-active", progressActiveKeyframes);
  return null;
}

function resolveGradient(strokeColor?: string | ProgressGradient | string[]): {
  isGradient: boolean;
  background?: string;
  svgStops?: Array<{ offset: string; color: string }>;
} {
  if (!strokeColor) return { isGradient: false };
  if (Array.isArray(strokeColor)) return { isGradient: false };
  if (typeof strokeColor === "string") return { isGradient: false, background: strokeColor };

  const { from, to, direction = "to right", ...percentStops } = strokeColor;
  if (from && to) {
    return {
      isGradient: true,
      background: `linear-gradient(${direction}, ${from}, ${to})`,
      svgStops: [
        { offset: "0%", color: from },
        { offset: "100%", color: to },
      ],
    };
  }

  const entries = Object.entries(percentStops).filter(([k]) => k.endsWith("%") || !isNaN(Number(k)));
  if (entries.length > 0) {
    entries.sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
    const stopString = entries.map(([offset, color]) => `${color} ${offset.endsWith("%") ? offset : `${offset}%`}`).join(", ");
    return {
      isGradient: true,
      background: `linear-gradient(to right, ${stopString})`,
      svgStops: entries.map(([offset, color]) => ({
        offset: offset.endsWith("%") ? offset : `${offset}%`,
        color: color as string,
      })),
    };
  }

  return { isGradient: false };
}

function Progress({
  className,
  type = "line",
  percent = 0,
  status: propStatus,
  showInfo = true,
  percentPosition,
  format,
  strokeColor,
  strokeWidth,
  size = "default",
  strokeLinecap = "round",
  trailColor,
  steps,
  success,
  gapDegree = 75,
  gapPosition = "bottom",
  ...props
}: ProgressProps) {
  const clampedPercent = Math.min(100, Math.max(0, percent));
  const successPercent = success?.percent ? Math.min(100, Math.max(0, success.percent)) : 0;

  const resolvedStatus: ProgressStatus =
    propStatus ?? (clampedPercent >= 100 ? "success" : "normal");

  const gradientInfo = resolveGradient(strokeColor);
  const gradientId = React.useId();

  // Status colors
  const statusColorMap: Record<ProgressStatus, string> = {
    normal: "var(--kk-primary)",
    active: "var(--kk-primary)",
    success: "var(--kk-success)",
    exception: "var(--kk-error)",
  };

  const finalColor = gradientInfo.background ?? (typeof strokeColor === "string" ? strokeColor : statusColorMap[resolvedStatus]);

  // Info content renderer
  const renderInfo = () => {
    if (!showInfo) return null;
    if (format) return <span className="shrink-0 text-sm text-text tabular-nums">{format(clampedPercent, successPercent)}</span>;

    if (resolvedStatus === "exception") {
      return (
        <span className="shrink-0 text-error inline-flex items-center">
          {type === "line" ? <CircleX className="size-4" /> : <X className="size-5" />}
        </span>
      );
    }
    if (resolvedStatus === "success") {
      return (
        <span className="shrink-0 text-success inline-flex items-center">
          {type === "line" ? <CircleCheck className="size-4" /> : <Check className="size-5" />}
        </span>
      );
    }

    return (
      <span className="shrink-0 text-sm text-text tabular-nums">
        {Math.round(clampedPercent)}%
      </span>
    );
  };

  // ------------------------------------------------------------------
  // LINE PROGRESS
  // ------------------------------------------------------------------
  if (type === "line") {
    const isSmall = size === "small";
    const height = typeof strokeWidth === "number" ? strokeWidth : isSmall ? 6 : Array.isArray(size) ? size[1] : typeof size === "object" && size.height ? size.height : 8;

    // Segmented steps
    if (steps) {
      const stepCount = typeof steps === "number" ? steps : steps.count;
      const stepGap = typeof steps === "object" && steps.gap !== undefined ? steps.gap : 2;
      const activeSteps = Math.round((clampedPercent / 100) * stepCount);

      return (
        <div data-slot="progress" data-type="line" className={cn("flex w-full items-center gap-2 select-none", className)} {...props}>
          <div className="flex flex-1 items-center" style={{ gap: `${stepGap}px` }}>
            {Array.from({ length: stepCount }, (_, i) => {
              const isFilled = i < activeSteps;
              const stepColor = Array.isArray(strokeColor) ? strokeColor[i] ?? finalColor : finalColor;
              return (
                <div
                  key={i}
                  className="flex-1 transition-colors duration-mid ease-kk-in-out"
                  style={{
                    height: `${height}px`,
                    backgroundColor: isFilled ? stepColor : (trailColor ?? "var(--kk-fill-secondary)"),
                    borderRadius: strokeLinecap === "round" ? "9999px" : strokeLinecap === "square" ? "0" : undefined,
                  }}
                />
              );
            })}
          </div>
          {renderInfo()}
        </div>
      );
    }

    return (
      <>
        <ProgressStyleTag />
        <div
          data-slot="progress"
          data-type="line"
          className={cn(
            "flex w-full items-center gap-2 select-none",
            percentPosition?.align === "start" && "flex-row-reverse",
            className,
          )}
          {...props}
        >
          <div
            data-slot="progress-outer"
            className="relative flex-1 overflow-hidden"
            style={{
              height: `${height}px`,
              backgroundColor: trailColor ?? "var(--kk-fill-secondary)",
              borderRadius: strokeLinecap === "round" ? "9999px" : strokeLinecap === "square" ? "0" : undefined,
            }}
          >
            <div
              data-slot="progress-bg"
              className={cn(
                "relative top-0 left-0 h-full transition-all duration-mid ease-kk-in-out",
                resolvedStatus === "active" && "kk-progress-active-bar overflow-hidden",
              )}
              style={{
                width: `${clampedPercent}%`,
                background: finalColor,
                borderRadius: strokeLinecap === "round" ? "9999px" : strokeLinecap === "square" ? "0" : undefined,
              }}
            >
              {percentPosition?.type === "inner" && (
                <span
                  className={cn(
                    "flex h-full items-center px-2 text-[11px] font-medium text-white",
                    percentPosition.align === "start" ? "justify-start" : percentPosition.align === "center" ? "justify-center" : "justify-end",
                  )}
                >
                  {renderInfo()}
                </span>
              )}
            </div>
            {successPercent > 0 && (
              <div
                data-slot="progress-success-bg"
                className="absolute top-0 left-0 z-10 h-full transition-all duration-mid ease-kk-in-out"
                style={{
                  width: `${successPercent}%`,
                  backgroundColor: success?.strokeColor ?? "var(--kk-success)",
                  borderRadius: strokeLinecap === "round" ? "9999px" : strokeLinecap === "square" ? "0" : undefined,
                }}
              />
            )}
          </div>
          {percentPosition?.type !== "inner" && renderInfo()}
        </div>
      </>
    );
  }

  // ------------------------------------------------------------------
  // CIRCLE & DASHBOARD PROGRESS
  // ------------------------------------------------------------------
  const isDashboard = type === "dashboard";
  const circleSize =
    typeof size === "number"
      ? size
      : Array.isArray(size)
        ? size[0]
        : typeof size === "object" && size.width
          ? size.width
          : size === "small"
            ? 80
            : 120;

  const width = strokeWidth ?? (size === "small" ? 5 : 6);
  const radius = 50 - width / 2;
  const perimeter = Math.PI * 2 * radius;

  const gapDeg = isDashboard ? gapDegree : 0;
  const gapOffset = (gapDeg / 360) * perimeter;
  const activePerimeter = perimeter - gapOffset;

  const strokeDashoffset = perimeter - (clampedPercent / 100) * activePerimeter;
  const strokeDasharray = `${activePerimeter} ${perimeter + 1}`;

  const rotateMap: Record<string, number> = {
    top: -90 + gapDeg / 2,
    bottom: 90 + gapDeg / 2,
    left: 180 + gapDeg / 2,
    right: 0 + gapDeg / 2,
  };
  const rotation = isDashboard ? rotateMap[gapPosition] ?? rotateMap.bottom : -90;

  return (
    <div
      data-slot="progress"
      data-type={type}
      className={cn("relative inline-flex items-center justify-center select-none", className)}
      style={{ width: circleSize, height: circleSize }}
      {...props}
    >
      <svg
        className="size-full"
        viewBox="0 0 100 100"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {gradientInfo.svgStops && (
          <defs>
            <linearGradient id={gradientId} x1="100%" y1="0%" x2="0%" y2="0%">
              {gradientInfo.svgStops.map((stop, i) => (
                <stop key={i} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>
          </defs>
        )}

        {/* Trail Path */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={trailColor ?? "var(--kk-fill-secondary)"}
          strokeWidth={width}
          strokeDasharray={isDashboard ? `${activePerimeter} ${perimeter}` : undefined}
          strokeLinecap={strokeLinecap}
        />

        {/* Progress Path */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={gradientInfo.svgStops ? `url(#${gradientId})` : finalColor}
          strokeWidth={width}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={isDashboard ? -(perimeter - activePerimeter) + strokeDashoffset : strokeDashoffset}
          strokeLinecap={strokeLinecap}
          className="transition-all duration-mid ease-kk-in-out"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {renderInfo()}
      </div>
    </div>
  );
}

export { Progress };
