import * as React from "react";
import { cn } from "@/lib/utils";

export interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Gradient stops — any CSS colour, design tokens by default. */
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
  className?: string;
  children: React.ReactNode;
}

const DEFAULT_COLORS = [
  "var(--kk-primary)",
  "var(--kk-success)",
  "var(--kk-warning)",
  "var(--kk-error)",
  "var(--kk-primary-hover)",
];

export function GradientText({
  colors = DEFAULT_COLORS,
  animationSpeed = 6,
  showBorder = false,
  className,
  children,
  ...props
}: GradientTextProps) {
  const flow: React.CSSProperties = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")}, ${colors[0]})`,
    animationDuration: `${animationSpeed}s`,
  };

  const label = (
    <span
      className="bg-[length:300%_100%] bg-clip-text text-transparent animate-[gradient-flow_6s_ease_infinite]"
      style={flow}
    >
      {children}
    </span>
  );

  return (
    <span
      data-slot="gradient-text"
      className={cn(
        "relative inline-flex items-center justify-center",
        showBorder && "rounded-lg bg-[length:300%_100%] p-px animate-[gradient-flow_6s_ease_infinite]",
        className,
      )}
      style={showBorder ? flow : undefined}
      {...props}
    >
      {showBorder ? (
        <span className="inline-flex items-center justify-center rounded-[7px] bg-bg-container px-3 py-1">
          {label}
        </span>
      ) : (
        label
      )}
    </span>
  );
}
