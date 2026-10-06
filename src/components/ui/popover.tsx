import * as React from "react";
import { cn } from "@/lib/utils";
import { Portal, type PortalContainer } from "@/components/ui/portal";
import { useClickOutside } from "@/hooks/use-click-outside";
import { computeFloatingPosition, measureFloating, type FloatingPlacement } from "@/lib/floating-position";
import { useConfig } from "@/components/ui/config-provider";
import { resolveTooltipColor, type PresetColor } from "@/components/ui/tooltip";

export type PopoverPlacement = FloatingPlacement;
export type PopoverTrigger = "hover" | "focus" | "click" | "contextMenu";

export interface PopoverProps {
  title?: React.ReactNode;
  content?: React.ReactNode;
  placement?: PopoverPlacement;
  trigger?: PopoverTrigger | PopoverTrigger[];
  arrow?: boolean | { pointAtCenter?: boolean };
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  /** Preset palette name or any CSS color for the popup background. */
  color?: PresetColor | (string & {});
  autoAdjustOverflow?: boolean;
  /** Unmount the content while hidden (default) or keep it mounted. */
  destroyOnHidden?: boolean;
  /** Re-render the content on every open instead of reusing the mounted node. */
  fresh?: boolean;
  getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement;
  align?: { offset?: [number, number] };
  overlayClassName?: string;
  overlayStyle?: React.CSSProperties;
  overlayInnerStyle?: React.CSSProperties;
  classNames?: { root?: string; title?: string; body?: string };
  styles?: { root?: React.CSSProperties; title?: React.CSSProperties; body?: React.CSSProperties };
  zIndex?: number;
  className?: string;
  children: React.ReactNode;
}

function arrowSide(placement: PopoverPlacement): "top" | "bottom" | "left" | "right" {
  if (placement.startsWith("top")) return "bottom";
  if (placement.startsWith("bottom")) return "top";
  if (placement.startsWith("left")) return "right";
  return "left";
}

export function Popover({
  title,
  content,
  placement = "top",
  trigger = "hover",
  arrow = true,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  mouseEnterDelay = 0.1,
  mouseLeaveDelay = 0.1,
  color,
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
  zIndex = 1030,
  className,
  children,
}: PopoverProps) {
  const config = useConfig();
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const [everOpened, setEverOpened] = React.useState(defaultOpen);

  const triggerRef = React.useRef<HTMLDivElement>(null);
  const popupRef = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState<{ top: number; left: number } | null>(null);
  const [arrowOffset, setArrowOffset] = React.useState<number | null>(null);
  const popupId = React.useId();

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

  useClickOutside(
    popupRef,
    (e) => {
      if (triggerRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    },
    open,
  );

  // Memoised: a fresh `{}` every render would re-create updatePosition and re-run
  // the layout effect forever while the popover is open.
  const arrowConfig = React.useMemo(
    () => (arrow === false ? false : arrow === true ? {} : arrow),
    [arrow],
  );
  const pointAtCenter = arrowConfig !== false && arrowConfig.pointAtCenter === true;

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current || !popupRef.current) return;
    const tRect = triggerRef.current.getBoundingClientRect();
    const cRect = measureFloating(popupRef.current);
    const [ox = 0, oy = 0] = align?.offset ?? [];
    const next = computeFloatingPosition(tRect, cRect, placement, 8, {
      autoAdjustOverflow,
      offsetX: ox,
      offsetY: oy,
    });
    setPos((prev) => (prev && prev.top === next.top && prev.left === next.left ? prev : next));

    if (arrowConfig === false) {
      setArrowOffset(null);
      return;
    }
    const side = arrowSide(placement);
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    if (side === "top" || side === "bottom") {
      const center = tRect.left + scrollX + tRect.width / 2;
      const raw = pointAtCenter ? center - next.left : cRect.width / 2;
      setArrowOffset(Math.min(Math.max(raw, 16), Math.max(16, cRect.width - 16)));
    } else {
      const center = tRect.top + scrollY + tRect.height / 2;
      const raw = pointAtCenter ? center - next.top : cRect.height / 2;
      setArrowOffset(Math.min(Math.max(raw, 16), Math.max(16, cRect.height - 16)));
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

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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
      <div
        ref={triggerRef}
        aria-describedby={open ? popupId : undefined}
        aria-expanded={triggers.includes("click") ? open : undefined}
        className={cn("inline-block", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => triggers.includes("click") && setOpen(!open)}
        onFocus={() => triggers.includes("focus") && setOpen(true)}
        onBlur={() => triggers.includes("focus") && setOpen(false)}
        onContextMenu={(e) => {
          if (!triggers.includes("contextMenu")) return;
          e.preventDefault();
          setOpen(true);
        }}
      >
        {children}
      </div>

      {shouldRender && (
        <Portal container={container}>
          <div
            ref={popupRef}
            id={popupId}
            role="tooltip"
            data-slot="popover"
            data-placement={placement}
            style={{
              position: "absolute",
              top: pos?.top ?? -9999,
              left: pos?.left ?? -9999,
              zIndex,
              visibility: open ? undefined : "hidden",
              pointerEvents: open ? undefined : "none",
              backgroundColor: resolvedColor,
              ...semanticStyles?.root,
              ...overlayStyle,
              ...overlayInnerStyle,
            }}
            className={cn(
              "relative max-w-sm rounded-lg border border-border bg-bg-elevated p-4 text-sm text-text shadow-kk-secondary outline-none",
              open ? "animate-in fade-in-0 zoom-in-95 duration-200 ease-kk-spring-soft" : "animate-out fade-out-0 duration-100",
              semanticClassNames?.root,
              overlayClassName,
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {title && (
              <div
                style={semanticStyles?.title}
                className={cn(
                  "mb-2 border-b border-border-secondary pb-2 font-semibold text-text-heading",
                  semanticClassNames?.title,
                )}
              >
                {title}
              </div>
            )}
            <div style={semanticStyles?.body} className={semanticClassNames?.body}>
              {content}
            </div>

            {arrowConfig !== false && arrowOffset !== null && (
              <span
                aria-hidden
                data-slot="popover-arrow"
                style={{
                  backgroundColor: resolvedColor,
                  ...(side === "top" || side === "bottom"
                    ? { left: arrowOffset, [side]: -5 }
                    : { top: arrowOffset, [side]: -5 }),
                }}
                className={cn(
                  "absolute size-2.5 rotate-45 rounded-[2px] border border-border bg-bg-elevated",
                  side === "top" && "border-b-0 border-r-0",
                  side === "bottom" && "border-l-0 border-t-0",
                  side === "left" && "border-b-0 border-l-0",
                  side === "right" && "border-r-0 border-t-0",
                  side === "top" || side === "bottom" ? "-translate-x-1/2" : "-translate-y-1/2",
                )}
              />
            )}
          </div>
        </Portal>
      )}
    </>
  );
}
