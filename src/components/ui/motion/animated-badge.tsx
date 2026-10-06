import * as React from "react";
import { cn } from "@/lib/utils";

export interface AnimatedBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: "primary" | "success" | "warning" | "error" | "purple";
  ping?: boolean;
  children: React.ReactNode;
}

const colorMap = {
  primary: "bg-primary text-white border-primary/20",
  success: "bg-success text-white border-success/20",
  warning: "bg-warning text-white border-warning/20",
  error: "bg-error text-white border-error/20",
  purple: "bg-purple text-white border-purple/20",
};

export function AnimatedBadge({
  color = "primary",
  ping = true,
  className,
  children,
  ...props
}: AnimatedBadgeProps) {
  return (
    <span
      data-slot="animated-badge"
      className={cn(
        "relative inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold select-none",
        colorMap[color],
        className,
      )}
      {...props}
    >
      {ping && (
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-white" />
        </span>
      )}
      {children}
    </span>
  );
}
