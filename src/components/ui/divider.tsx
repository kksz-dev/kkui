import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Divider — KKUI horizontal / vertical rule with optional inline title,
 * dashed / dotted variants and spacing sizes.
 */
const dividerVariants = cva("border-split", {
  variants: {
    type: {
      horizontal: "clear-both flex w-full min-w-full items-center text-text",
      vertical: "relative top-[-0.06em] mx-2 inline-block h-[0.9em] self-center border-l align-middle",
    },
    variant: {
      solid: "",
      dashed: "",
      dotted: "",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  compoundVariants: [
    { type: "vertical", variant: "dashed", className: "border-dashed" },
    { type: "vertical", variant: "dotted", className: "border-dotted" },
    { type: "horizontal", size: "sm", className: "my-2" },
    { type: "horizontal", size: "md", className: "my-4" },
    { type: "horizontal", size: "lg", className: "my-6" },
  ],
  defaultVariants: { type: "horizontal", variant: "solid", size: "md" },
});

export type DividerOrientation = "left" | "right" | "center" | "start" | "end";

/** `start` / `end` are aliases of `left` / `right`. */
const orientationAlias: Record<DividerOrientation, "left" | "right" | "center"> = {
  left: "left",
  start: "left",
  right: "right",
  end: "right",
  center: "center",
};

export interface DividerProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Direction of the divider */
  type?: "horizontal" | "vertical";
  /** Vertical spacing of a horizontal divider: sm 8px / md 16px / lg 24px */
  size?: "sm" | "md" | "lg";
  /** Shorthand for variant="dashed" */
  dashed?: boolean;
  /** Line style */
  variant?: "solid" | "dashed" | "dotted";
  /** Title text is rendered like normal text (no heading weight) */
  plain?: boolean;
  /** Where the title sits on a horizontal divider (`start` / `end` are aliases of `left` / `right`) */
  orientation?: DividerOrientation;
  /** Gap between the edge and the title (only for left / right); number = px */
  orientationMargin?: string | number;
  /** Inline title */
  children?: React.ReactNode;
}

function Divider({
  className,
  type = "horizontal",
  variant,
  dashed = false,
  plain = false,
  orientation: orientationProp = "center",
  orientationMargin,
  size = "md",
  children,
  ...props
}: DividerProps) {
  const orientation = orientationAlias[orientationProp];
  const v = variant ?? (dashed ? "dashed" : "solid");
  const hasTitle = type === "horizontal" && children != null && children !== false;
  // Lines inherit the container's border color, so `className="border-purple"` recolors the whole divider.
  const styleClass = cn("border-t", v === "dashed" && "border-dashed", v === "dotted" && "border-dotted");
  const lineClass = cn(styleClass, "border-inherit");

  if (!hasTitle) {
    return (
      <div
        role="separator"
        aria-orientation={type}
        data-slot="divider"
        data-type={type}
        className={cn(dividerVariants({ type, variant: v, size }), type === "horizontal" && styleClass, className)}
        {...props}
      />
    );
  }

  const margin = orientationMargin != null ? (typeof orientationMargin === "number" ? `${orientationMargin}px` : orientationMargin) : undefined;
  const hasMargin = margin != null && orientation !== "center";
  // KKUI: side title keeps a 5% edge line unless orientationMargin is set.
  const startStyle: React.CSSProperties =
    orientation === "left" ? (hasMargin ? { flex: `0 0 ${margin}` } : { flex: "0 0 5%" }) : { flex: 1 };
  const endStyle: React.CSSProperties =
    orientation === "right" ? (hasMargin ? { flex: `0 0 ${margin}` } : { flex: "0 0 5%" }) : { flex: 1 };

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      data-slot="divider"
      data-type="horizontal"
      data-orientation={orientation}
      className={cn(dividerVariants({ type: "horizontal", variant: v, size }), "whitespace-nowrap", className)}
      {...props}
    >
      <span className={lineClass} style={startStyle} />
      <span
        data-slot="divider-title"
        className={cn(
          "inline-block px-4 text-center whitespace-nowrap",
          plain ? "text-sm font-normal text-text" : "text-base font-medium text-text-heading",
          hasMargin && orientation === "left" && "pl-0",
          hasMargin && orientation === "right" && "pr-0",
        )}
      >
        {children}
      </span>
      <span className={lineClass} style={endStyle} />
    </div>
  );
}

export { Divider, dividerVariants };
