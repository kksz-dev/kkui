import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Flex — thin, typed wrapper over CSS flexbox with KKUI prop names.
 * Prefer this over Space for layouts (Space is for spacing inline elements).
 */

export type FlexGap = "sm" | "md" | "lg" | number | (string & {});

const gapMap: Record<"sm" | "md" | "lg", string> = { sm: "8px", md: "16px", lg: "24px" };
const toGap = (g: FlexGap) => (typeof g === "number" ? `${g}px` : (gapMap[g as "sm" | "md" | "lg"] ?? g));

export interface FlexProps extends React.ComponentProps<"div"> {
  /** Column direction */
  vertical?: boolean;
  /** `flex-wrap` value; `true` = wrap */
  wrap?: boolean | React.CSSProperties["flexWrap"];
  /** `justify-content` */
  justify?: React.CSSProperties["justifyContent"];
  /** `align-items` */
  align?: React.CSSProperties["alignItems"];
  /** CSS `flex` shorthand applied to this element */
  flex?: React.CSSProperties["flex"];
  /** Gap between items: preset or CSS length */
  gap?: FlexGap;
  /** Render as another element (`section`, `ul`, ...) */
  component?: React.ElementType;
}

function Flex({
  className,
  vertical = false,
  wrap = false,
  justify,
  align,
  flex,
  gap,
  component: Comp = "div",
  style,
  ...props
}: FlexProps) {
  return (
    <Comp
      data-slot="flex"
      className={cn("flex", vertical ? "flex-col" : "flex-row", className)}
      style={{
        flexWrap: wrap === true ? "wrap" : wrap === false ? undefined : wrap,
        justifyContent: justify,
        alignItems: align,
        flex,
        gap: gap != null ? toGap(gap) : undefined,
        ...style,
      }}
      {...props}
    />
  );
}

export { Flex };
