import * as React from "react";
import { cn } from "@/lib/utils";

export type SpinSize = "small" | "default" | "large" | "sm" | "md" | "lg";

export interface SpinProps extends React.ComponentProps<"div"> {
  /** Size of the spinner */
  size?: SpinSize;
  /** Whether Spin is spinning */
  spinning?: boolean;
  /** Customize description content when Spin has children */
  tip?: React.ReactNode;
  /** Specifies a delay in milliseconds for loading state (prevent flicker) */
  delay?: number;
  /** React node of the spinning indicator */
  indicator?: React.ReactElement;
  /** The className of wrapper when Spin has children */
  wrapperClassName?: string;
  /** Display a fullscreen loading overlay */
  fullscreen?: boolean;
  /** Display percent value inside or around spinner */
  percent?: number | "auto";
}

const sizeConfig: Record<string, { dotSize: string; dotItemSize: string; textSize: string; containerSize: string }> = {
  small: { dotSize: "size-3.5", dotItemSize: "size-1.5", textSize: "text-xs", containerSize: "h-3.5" },
  sm: { dotSize: "size-3.5", dotItemSize: "size-1.5", textSize: "text-xs", containerSize: "h-3.5" },
  default: { dotSize: "size-5", dotItemSize: "size-2", textSize: "text-sm", containerSize: "h-5" },
  md: { dotSize: "size-5", dotItemSize: "size-2", textSize: "text-sm", containerSize: "h-5" },
  large: { dotSize: "size-8", dotItemSize: "size-3", textSize: "text-base", containerSize: "h-8" },
  lg: { dotSize: "size-8", dotItemSize: "size-3", textSize: "text-base", containerSize: "h-8" },
};

function DefaultIndicator({ size = "default" }: { size?: SpinSize }) {
  const conf = sizeConfig[size] ?? sizeConfig.default;
  return (
    <span
      className={cn("relative inline-block rotate-45 animate-spin duration-1000", conf.dotSize)}
      style={{ animationDuration: "1.2s", animationTimingFunction: "linear" }}
    >
      <span className={cn("absolute top-0 left-0 rounded-full bg-primary opacity-30 animate-pulse", conf.dotItemSize)} style={{ animationDelay: "0s" }} />
      <span className={cn("absolute top-0 right-0 rounded-full bg-primary opacity-30 animate-pulse", conf.dotItemSize)} style={{ animationDelay: "0.4s" }} />
      <span className={cn("absolute bottom-0 right-0 rounded-full bg-primary opacity-30 animate-pulse", conf.dotItemSize)} style={{ animationDelay: "0.8s" }} />
      <span className={cn("absolute bottom-0 left-0 rounded-full bg-primary opacity-30 animate-pulse", conf.dotItemSize)} style={{ animationDelay: "1.2s" }} />
    </span>
  );
}

/** `percent="auto"` has no real number behind it, so it creeps toward 100 and never arrives. */
function useAutoPercent(enabled: boolean) {
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    if (!enabled) return;
    setValue(0);
    const timer = setInterval(() => {
      // asymptotic: fast at first, then slower, capped just under full
      setValue((prev) => (prev >= 95 ? prev : prev + Math.max(0.5, (95 - prev) / 12)));
    }, 220);
    return () => clearInterval(timer);
  }, [enabled]);

  return value;
}

function PercentIndicator({ percent, size = "default" }: { percent: number | "auto"; size?: SpinSize }) {
  const conf = sizeConfig[size] ?? sizeConfig.default;
  const auto = useAutoPercent(percent === "auto");
  const numPercent = typeof percent === "number" ? Math.min(100, Math.max(0, percent)) : auto;
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (numPercent / 100) * circumference;

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg className="size-12 -rotate-90" viewBox="0 0 44 44">
        <circle
          cx="22"
          cy="22"
          r={radius}
          className="stroke-fill-secondary"
          strokeWidth="3.5"
          fill="none"
        />
        <circle
          cx="22"
          cy="22"
          r={radius}
          className="stroke-primary transition-all duration-mid ease-kk-in-out"
          strokeWidth="3.5"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className={cn("absolute font-medium text-text tabular-nums", conf.textSize)}>
        {percent === "auto" ? "auto" : `${Math.round(numPercent)}%`}
      </span>
    </div>
  );
}

function Spin({
  className,
  size = "default",
  spinning = true,
  tip,
  delay,
  indicator,
  wrapperClassName,
  fullscreen = false,
  percent,
  children,
  ...props
}: SpinProps) {
  const [shouldSpin, setShouldSpin] = React.useState(spinning);

  React.useEffect(() => {
    if (!delay) {
      setShouldSpin(spinning);
      return;
    }

    if (spinning) {
      const timer = setTimeout(() => setShouldSpin(true), delay);
      return () => clearTimeout(timer);
    } else {
      setShouldSpin(false);
    }
  }, [spinning, delay]);

  const conf = sizeConfig[size] ?? sizeConfig.default;

  const spinIndicator = percent !== undefined ? (
    <PercentIndicator percent={percent} size={size} />
  ) : indicator && React.isValidElement<{ className?: string }>(indicator) ? (
    React.cloneElement(indicator, {
      className: cn(
        indicator.props.className,
        !indicator.props.className?.includes("animate-") && "animate-spin",
      ),
    })
  ) : (
    <DefaultIndicator size={size} />
  );

  const spinnerContent = (
    <div
      data-slot="spin"
      className={cn(
        "inline-flex flex-col items-center justify-center gap-2 select-none text-primary",
        className,
      )}
      {...props}
    >
      {spinIndicator}
      {tip && <div className={cn("font-normal text-primary", conf.textSize)}>{tip}</div>}
    </div>
  );

  if (fullscreen) {
    if (!shouldSpin) return null;
    return (
      <div
        data-slot="spin-fullscreen"
        className="fixed inset-0 z-50 flex items-center justify-center bg-bg-mask backdrop-blur-xs transition-opacity duration-mid"
      >
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-bg-elevated p-6 shadow-kk">
          {spinnerContent}
        </div>
      </div>
    );
  }

  if (children == null) {
    if (!shouldSpin) return null;
    return spinnerContent;
  }

  return (
    <div
      data-slot="spin-nested-loading"
      className={cn("relative", wrapperClassName)}
    >
      {shouldSpin && (
        <div
          data-slot="spin-container-overlay"
          className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-bg-container/60 transition-all duration-mid"
        >
          {spinnerContent}
        </div>
      )}
      <div
        data-slot="spin-container"
        className={cn(
          "transition-[opacity,filter] duration-mid ease-kk-in-out",
          shouldSpin && "pointer-events-none opacity-40 blur-[0.5px] select-none",
        )}
      >
        {children}
      </div>
    </div>
  );
}

export { Spin };
