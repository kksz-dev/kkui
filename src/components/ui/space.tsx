import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Space — KKUI inline spacing between children, plus SpaceCompact for
 * attaching adjacent controls (buttons / inputs / selects) into one segment.
 */

export type SpaceSize = "sm" | "md" | "lg" | number;

const sizeMap: Record<"sm" | "md" | "lg", number> = { sm: 8, md: 16, lg: 24 };
const toPx = (s: SpaceSize) => (typeof s === "number" ? s : sizeMap[s]);

export interface SpaceProps extends React.ComponentProps<"div"> {
  direction?: "horizontal" | "vertical";
  /** Gap: preset or px; tuple = [horizontal, vertical] */
  size?: SpaceSize | [SpaceSize, SpaceSize];
  align?: "start" | "end" | "center" | "baseline";
  /** Wrap onto multiple lines (horizontal only) */
  wrap?: boolean;
  /** Node rendered between every two items */
  split?: React.ReactNode;
  /** Wrapper element for each item */
  classNames?: { item?: string };
}

function Space({
  className,
  direction = "horizontal",
  size = "sm",
  align,
  wrap = false,
  split,
  classNames,
  style,
  children,
  ...props
}: SpaceProps) {
  const [h, v] = Array.isArray(size) ? size : [size, size];
  const items = React.Children.toArray(children);
  if (items.length === 0) return null;
  const alignment = align ?? (direction === "horizontal" ? "center" : undefined);

  return (
    <div
      data-slot="space"
      data-direction={direction}
      className={cn(
        "inline-flex",
        direction === "vertical" ? "flex-col" : "flex-row",
        wrap && direction === "horizontal" && "flex-wrap",
        alignment === "start" && "items-start",
        alignment === "end" && "items-end",
        alignment === "center" && "items-center",
        alignment === "baseline" && "items-baseline",
        className,
      )}
      style={{ columnGap: toPx(h), rowGap: toPx(v), ...style }}
      {...props}
    >
      {items.map((child, i) => (
        <React.Fragment key={i}>
          {i > 0 && split != null && (
            <span data-slot="space-split" className="inline-flex items-center">
              {split}
            </span>
          )}
          <div data-slot="space-item" className={cn("empty:hidden", classNames?.item)}>
            {child}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Space.Compact                                                              */
/* -------------------------------------------------------------------------- */

export interface SpaceCompactProps extends React.ComponentProps<"div"> {
  direction?: "horizontal" | "vertical";
  /** Fit width of parent */
  block?: boolean;
  /** Height / font size forced onto every direct child, and published on SpaceCompactContext */
  size?: "sm" | "md" | "lg";
}

/**
 * Controls own their height, so the compact size is applied from the container:
 * the direct-child height / font size wins over whatever the control set itself.
 * Controls that also want to react in JS can read `useSpaceCompact()`.
 */
const compactSizeClasses: Record<"sm" | "md" | "lg", string> = {
  sm: "[&>*]:h-control-sm! [&>*]:text-sm!",
  md: "[&>*]:h-control! [&>*]:text-sm!",
  lg: "[&>*]:h-control-lg! [&>*]:text-base!",
};

const compactRadiusClasses: Record<"sm" | "md" | "lg", { horizontal: string; vertical: string }> = {
  sm: {
    horizontal: "[&>*:first-child]:rounded-l-sm! [&>*:last-child]:rounded-r-sm!",
    vertical: "[&>*:first-child]:rounded-t-sm! [&>*:last-child]:rounded-b-sm!",
  },
  md: {
    horizontal: "[&>*:first-child]:rounded-l-md! [&>*:last-child]:rounded-r-md!",
    vertical: "[&>*:first-child]:rounded-t-md! [&>*:last-child]:rounded-b-md!",
  },
  lg: {
    horizontal: "[&>*:first-child]:rounded-l-lg! [&>*:last-child]:rounded-r-lg!",
    vertical: "[&>*:first-child]:rounded-t-lg! [&>*:last-child]:rounded-b-lg!",
  },
};

export interface SpaceCompactItem {
  size?: "sm" | "md" | "lg";
  direction: "horizontal" | "vertical";
}

const SpaceCompactContext = React.createContext<SpaceCompactItem | null>(null);
/** Read compact context inside a form control to inherit `size`. */
function useSpaceCompact() {
  return React.useContext(SpaceCompactContext);
}

/**
 * Attaches direct children: removes inner radius, collapses adjacent borders
 * (-1px overlap) and raises the hovered / focused item so its border shows.
 * Works with any control that keeps its border on the outer element
 * (Button, native input/select, or KKUI controls via `data-slot`).
 */
function SpaceCompact({ className, direction = "horizontal", block = false, size, children, ...props }: SpaceCompactProps) {
  const ctx = React.useMemo<SpaceCompactItem>(() => ({ size, direction }), [size, direction]);
  const items = React.Children.toArray(children);
  const horizontal = direction === "horizontal";

  return (
    <SpaceCompactContext.Provider value={ctx}>
      <div
        role="group"
        data-slot="space-compact"
        data-direction={direction}
        className={cn(
          "inline-flex",
          horizontal ? "flex-row items-stretch" : "flex-col",
          block && "flex w-full",
          // reset radius on every item; restore on first / last edge
          "[&>*]:relative [&>*]:rounded-none",
          horizontal
            ? "[&>*:first-child]:rounded-l-md [&>*:last-child]:rounded-r-md [&>*:not(:first-child)]:-ml-px"
            : "[&>*:first-child]:rounded-t-md [&>*:last-child]:rounded-b-md [&>*:not(:first-child)]:-mt-px",
          // Button ships its own size radius (sm 4 / lg 8); keep it consistent on edges
          horizontal
            ? "[&>[data-size=sm]:first-child]:rounded-l-sm [&>[data-size=sm]:last-child]:rounded-r-sm [&>[data-size=lg]:first-child]:rounded-l-lg [&>[data-size=lg]:last-child]:rounded-r-lg"
            : "[&>[data-size=sm]:first-child]:rounded-t-sm [&>[data-size=sm]:last-child]:rounded-b-sm [&>[data-size=lg]:first-child]:rounded-t-lg [&>[data-size=lg]:last-child]:rounded-b-lg",
          // `size` applies to the children themselves
          size && compactSizeClasses[size],
          size && compactRadiusClasses[size][horizontal ? "horizontal" : "vertical"],
          "[&>*:hover]:z-10 [&>*:focus-within]:z-10 [&>*:focus-visible]:z-10",
          className,
        )}
        {...props}
      >
        {items}
      </div>
    </SpaceCompactContext.Provider>
  );
}

const SpaceRoot = Object.assign(Space, { Compact: SpaceCompact });

export { SpaceRoot as Space, SpaceCompact, useSpaceCompact, SpaceCompactContext };
