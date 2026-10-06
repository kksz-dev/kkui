import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type TimelineMode = "left" | "alternate" | "right";
export type TimelineColor = "blue" | "red" | "green" | "gray" | string;

export interface TimelineItemProps {
  color?: TimelineColor;
  dot?: React.ReactNode;
  children?: React.ReactNode;
  label?: React.ReactNode;
  position?: "left" | "right";
  className?: string;
}

export interface TimelineProps extends React.ComponentProps<"ul"> {
  items?: TimelineItemProps[];
  mode?: TimelineMode;
  pending?: boolean | React.ReactNode;
  pendingDot?: React.ReactNode;
  reverse?: boolean;
  children?: React.ReactNode;
}

function TimelineItem(_props: TimelineItemProps) {
  return null;
}

const PRESET_COLORS: Record<string, string> = {
  blue: "border-primary text-primary",
  red: "border-error text-error",
  green: "border-success text-success",
  gray: "border-border text-text-quaternary",
};

function Timeline({
  items: itemsProp,
  mode = "left",
  pending = false,
  pendingDot,
  reverse = false,
  className,
  children,
  ...props
}: TimelineProps) {
  // Extract items from children if not provided as items prop
  const items = React.useMemo<TimelineItemProps[]>(() => {
    if (itemsProp) return itemsProp;
    const extracted: TimelineItemProps[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement<TimelineItemProps>(child)) {
        extracted.push({
          color: child.props.color,
          dot: child.props.dot,
          children: child.props.children,
          label: child.props.label,
          position: child.props.position,
          className: child.props.className,
        });
      }
    });
    return extracted;
  }, [itemsProp, children]);

  // Handle pending item
  let finalItems = [...items];
  if (reverse) {
    finalItems.reverse();
  }

  if (pending) {
    const pendingContent = typeof pending === "boolean" ? "Loading..." : pending;
    const pendingNode: TimelineItemProps = {
      children: pendingContent,
      dot: pendingDot ?? <Loader2 className="size-3.5 animate-spin text-primary" />,
      color: "blue",
    };
    if (reverse) {
      finalItems.unshift(pendingNode);
    } else {
      finalItems.push(pendingNode);
    }
  }

  const hasLabel = finalItems.some((it) => Boolean(it.label));
  // An explicit left/right mode wins over the label-driven alternate layout.
  const isAlternate = mode === "alternate" || (hasLabel && mode !== "left" && mode !== "right");
  const isRight = mode === "right";
  // The tail that runs INTO the pending node is the dashed one.
  const pendingTailIndex = pending ? (reverse ? 0 : finalItems.length - 2) : -1;

  return (
    <ul
      data-slot="timeline"
      data-mode={mode}
      className={cn(
        "relative flex flex-col text-sm text-text",
        className,
      )}
      {...props}
    >
      {finalItems.map((item, index) => {
        const isLast = index === finalItems.length - 1;
        const color = item.color ?? "blue";
        const isPreset = color in PRESET_COLORS;
        const colorClass = isPreset ? PRESET_COLORS[color] : "";
        const customStyle = !isPreset && !item.dot ? { borderColor: color } : undefined;

        // Determine item side in alternate / label mode
        let itemPosition: "left" | "right" = "left";
        if (item.position) {
          itemPosition = item.position;
        } else if (mode === "right") {
          itemPosition = "right";
        } else if (mode === "alternate") {
          itemPosition = index % 2 === 0 ? "left" : "right";
        }

        // Dot rendering
        const dotNode = item.dot ? (
          <span
            data-slot="timeline-dot"
            className="absolute left-1/2 top-1.5 -translate-x-1/2 -translate-y-1/2 bg-bg-container text-xs"
          >
            {item.dot}
          </span>
        ) : (
          <span
            data-slot="timeline-dot"
            style={customStyle}
            className={cn(
              "absolute left-1/2 top-1.5 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-bg-container",
              colorClass,
            )}
          />
        );

        if (isAlternate) {
          const isLeftContent = itemPosition === "left";
          return (
            <li
              key={index}
              data-slot="timeline-item"
              className={cn("group relative flex min-h-[56px] pb-6", item.className)}
            >
              {/* Left Column */}
              <div className="w-1/2 pr-6 text-right">
                {isLeftContent ? (
                  <div className="text-text">{item.children}</div>
                ) : (
                  <div className="text-xs text-text-tertiary">{item.label}</div>
                )}
              </div>

              {/* Center Axis */}
              <div className="relative flex flex-col items-center">
                {dotNode}
                {!isLast && (
                  <div
                    data-slot="timeline-tail"
                    className={cn(
                      "w-[2px] flex-1 bg-border-secondary",
                      index === pendingTailIndex && "w-0 border-l-2 border-dashed border-border-secondary bg-transparent",
                    )}
                  />
                )}
              </div>

              {/* Right Column */}
              <div className="w-1/2 pl-6 text-left">
                {!isLeftContent ? (
                  <div className="text-text">{item.children}</div>
                ) : (
                  <div className="text-xs text-text-tertiary">{item.label}</div>
                )}
              </div>
            </li>
          );
        }

        if (isRight) {
          return (
            <li
              key={index}
              data-slot="timeline-item"
              className={cn("group relative flex min-h-[48px] justify-end pb-6", item.className)}
            >
              {/* Content on Left */}
              <div className="min-w-0 flex-1 pr-6 text-right text-text">
                {item.children}
              </div>

              {/* Axis on Right */}
              <div className="relative flex flex-col items-center">
                {dotNode}
                {!isLast && (
                  <div
                    data-slot="timeline-tail"
                    className={cn(
                      "w-[2px] flex-1 bg-border-secondary",
                      index === pendingTailIndex && "w-0 border-l-2 border-dashed border-border-secondary bg-transparent",
                    )}
                  />
                )}
              </div>
            </li>
          );
        }

        // Standard Left Axis Mode
        return (
          <li
            key={index}
            data-slot="timeline-item"
            className={cn("group relative flex min-h-[48px] pb-6", item.className)}
          >
            {/* Axis on Left */}
            <div className="relative flex flex-col items-center pl-2">
              {dotNode}
              {!isLast && (
                <div
                  data-slot="timeline-tail"
                  className={cn(
                    "w-[2px] flex-1 bg-border-secondary",
                    pending && isLast ? "border-l-2 border-dashed border-border-secondary bg-transparent" : "",
                  )}
                />
              )}
            </div>

            {/* Content on Right */}
            <div className="min-w-0 flex-1 pl-6 text-text">
              {item.children}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

Timeline.Item = TimelineItem;

export { Timeline, TimelineItem };
