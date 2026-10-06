import * as React from "react";
import { cn } from "@/lib/utils";
import { Portal, type PortalContainer } from "@/components/ui/portal";
import { computeFloatingPosition, measureFloating, type FloatingPlacement } from "@/lib/floating-position";
import { useConfig } from "@/components/ui/config-provider";

export type TooltipPlacement = FloatingPlacement;
export type TooltipTrigger = "hover" | "focus" | "click" | "contextMenu";

export const PRESET_COLORS = [
  "pink",
  "red",
  "yellow",
  "orange",
  "cyan",
  "green",
  "blue",
  "purple",
  "geekblue",
  "magenta",
  "volcano",
  "gold",
  "lime",
] as const;
export type PresetColor = (typeof PRESET_COLORS)[number];

/** Preset names resolve to palette tokens; anything else is passed through as a CSS color. */
export function resolveTooltipColor(color?: string): string | undefined {
  if (!color) return undefined;
  return (PRESET_COLORS as readonly string[]).includes(color) ? `var(--color-${color})` : color;
}

export interface TooltipArrowConfig {
  /** Point the arrow at the center of the trigger instead of the popup edge. */
  pointAtCenter?: boolean;
}

export interface TooltipProps {
  title?: React.ReactNode;
  placement?: TooltipPlacement;
  trigger?: TooltipTrigger | TooltipTrigger[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  /** Preset palette name (blue, volcano, geekblue…) or any CSS color. */
  color?: PresetColor | (string & {});
  arrow?: boolean | TooltipArrowConfig;
  autoAdjustOverflow?: boolean;
  /** Unmount the popup content when hidden instead of keeping it mounted. */
  destroyOnHidden?: boolean;
  /** Re-render the content on every open (skip the cached node). */
  fresh?: boolean;
  /** Where to mount the popup. Falls back to ConfigProvider's getPopupContainer. */
  getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement;
  /** Pixel nudge applied after placement. */
  align?: { offset?: [number, number] };
  overlayClassName?: string;
  overlayStyle?: React.CSSProperties;
  overlayInnerStyle?: React.CSSProperties;
  classNames?: { root?: string; body?: string };
  styles?: { root?: React.CSSProperties; body?: React.CSSProperties };
  zIndex?: number;
  className?: string;
  children: React.ReactNode;
}

/** Which edge the arrow sits on, derived from the placement. */
function arrowSide(placement: TooltipPlacement): "top" | "bottom" | "left" | "right" {
  if (placement.startsWith("top")) return "bottom";
  if (placement.startsWith("bottom")) return "top";
  if (placement.startsWith("left")) return "right";
  return "left";
}

export function Tooltip({
  title,
  placement = "top",
  trigger = "hover",
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  mouseEnterDelay = 0.1,
  mouseLeaveDelay = 0.1,
  color,
  arrow = true,
  autoAdjustOverflow = true,
  destroyOnHidden = true,
  fresh = false,
  getPopupContainer,
  align,
  overlayClassName,
  overlayStyle,
  overlayInnerStyle,
  classNames: semanticClassNames,
  styles: semanticStyles,
  zIndex = 1070,
  className,
  children,
}: TooltipProps) {
  const config = useConfig();
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const [everOpened, setEverOpened] = React.useState(defaultOpen);

  const triggerRef = React.useRef<HTMLSpanElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState<{ top: number; left: number } | null>(null);
  const [arrowOffset, setArrowOffset] = React.useState<number | null>(null);
  const tooltipId = React.useId();

  const enterTimer = React.useRef<number | undefined>(undefined);
  const leaveTimer = React.useRef<number | undefined>(undefined);

  React.useEffect(
    () => () => {
      clearTimeout(enterTimer.current);
      clearTimeout(leaveTimer.current);
    },
    [],
  );

  const setOpen = (v: boolean) => {
    if (v) setEverOpened(true);
    if (!isControlled) setInternalOpen(v);
    onOpenChange?.(v);
  };

  // Memoised: a fresh `{}` every render would re-create updatePosition and re-run
  // the layout effect forever while the tooltip is open.
  const arrowConfig: TooltipArrowConfig | false = React.useMemo(
    () => (arrow === false ? false : arrow === true ? {} : arrow),
    [arrow],
  );
  const pointAtCenter = arrowConfig !== false && arrowConfig.pointAtCenter === true;

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current || !contentRef.current) return;
    const tRect = triggerRef.current.getBoundingClientRect();
    const cRect = measureFloating(contentRef.current);
    const [ox = 0, oy = 0] = align?.offset ?? [];
    const next = computeFloatingPosition(tRect, cRect, placement, 6, {
      autoAdjustOverflow,
      offsetX: ox,
      offsetY: oy,
    });
    setPos((prev) => (prev && prev.top === next.top && prev.left === next.left ? prev : next));

    if (arrowConfig === false) {
      setArrowOffset(null);
      return;
    }
    // Keep the arrow pointing at the trigger even after the popup was clamped.
    const side = arrowSide(placement);
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    if (side === "top" || side === "bottom") {
      const triggerCenter = tRect.left + scrollX + tRect.width / 2;
      const raw = pointAtCenter ? triggerCenter - next.left : cRect.width / 2;
      setArrowOffset(Math.min(Math.max(raw, 12), Math.max(12, cRect.width - 12)));
    } else {
      const triggerCenter = tRect.top + scrollY + tRect.height / 2;
      const raw = pointAtCenter ? triggerCenter - next.top : cRect.height / 2;
      setArrowOffset(Math.min(Math.max(raw, 12), Math.max(12, cRect.height - 12)));
    }
  }, [placement, autoAdjustOverflow, align, arrowConfig, pointAtCenter]);

  React.useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    const onScrollOrResize = () => updatePosition();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open, updatePosition]);

  // Escape closes an open tooltip, matching the popup family.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!title) return <>{children}</>;

  const triggers = Array.isArray(trigger) ? trigger : [trigger];

  const handleMouseEnter = () => {
    if (!triggers.includes("hover")) return;
    clearTimeout(leaveTimer.current);
    enterTimer.current = window.setTimeout(() => setOpen(true), mouseEnterDelay * 1000);
  };

  const handleMouseLeave = () => {
    if (!triggers.includes("hover")) return;
    clearTimeout(enterTimer.current);
    leaveTimer.current = window.setTimeout(() => setOpen(false), mouseLeaveDelay * 1000);
  };

  const resolvedColor = resolveTooltipColor(color);
  const side = arrowSide(placement);
  const shouldRender = open || (!destroyOnHidden && everOpened && !fresh);
  const container: PortalContainer = getPopupContainer
    ? () => getPopupContainer(triggerRef.current ?? undefined)
    : config.getPopupContainer
      ? () => config.getPopupContainer!(triggerRef.current ?? undefined)
      : undefined;

  return (
    <>
      <span
        ref={triggerRef}
        aria-describedby={open ? tooltipId : undefined}
        className={cn("inline-block", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => triggers.includes("click") && setOpen(!open)}
        onContextMenu={(e) => {
          if (!triggers.includes("contextMenu")) return;
          e.preventDefault();
          setOpen(true);
        }}
        onFocus={() => triggers.includes("focus") && setOpen(true)}
        onBlur={() => triggers.includes("focus") && setOpen(false)}
      >
        {children}
      </span>

      {shouldRender && (
        <Portal container={container}>
          <div
            ref={contentRef}
            id={tooltipId}
            role="tooltip"
            data-slot="tooltip"
            data-placement={placement}
            style={{
              position: "absolute",
              top: pos?.top ?? -9999,
              left: pos?.left ?? -9999,
              zIndex,
              visibility: open ? undefined : "hidden",
              pointerEvents: open ? undefined : "none",
              ...semanticStyles?.root,
              ...overlayStyle,
            }}
            className={cn(
              "max-w-xs break-words",
              open ? "animate-in fade-in-0 zoom-in-95 duration-200 ease-kk-spring-soft" : "animate-out fade-out-0 duration-100",
              semanticClassNames?.root,
              overlayClassName,
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              data-slot="tooltip-body"
              style={{ backgroundColor: resolvedColor, ...semanticStyles?.body, ...overlayInnerStyle }}
              className={cn(
                "relative rounded-md bg-bg-spotlight px-2.5 py-1.5 text-xs text-text-light-solid shadow-kk-secondary",
                semanticClassNames?.body,
              )}
            >
              {title}

              {arrowConfig !== false && arrowOffset !== null && (
                <span
                  aria-hidden
                  data-slot="tooltip-arrow"
                  style={{
                    backgroundColor: resolvedColor,
                    ...(side === "top" || side === "bottom"
                      ? { left: arrowOffset, [side]: -4 }
                      : { top: arrowOffset, [side]: -4 }),
                  }}
                  className={cn(
                    "absolute size-2 rotate-45 rounded-[1px] bg-bg-spotlight",
                    side === "top" || side === "bottom" ? "-translate-x-1/2" : "-translate-y-1/2",
                  )}
                />
              )}
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
