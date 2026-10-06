import * as React from "react";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Portal } from "@/components/ui/portal";
import { useClickOutside } from "@/hooks/use-click-outside";
import {
  computeFloatingPosition,
  measureFloating,
  type FloatingPlacement,
  type FloatingSize,
} from "@/lib/floating-position";

export type PopconfirmPlacement = FloatingPlacement;
export type PopconfirmTrigger = "click" | "hover" | "focus" | "contextMenu";

/** Keep in sync with the enter/exit animation duration below. */
const MOTION_DURATION = 150;
const ARROW_SIZE = 8;
const ARROW_EDGE = 16;

export interface PopconfirmAlign {
  /** Extra [x, y] px added to the computed position. */
  offset?: [number, number];
}

type TriggerElementProps = React.HTMLAttributes<HTMLElement> & {
  ref?: React.Ref<HTMLElement>;
  disabled?: boolean;
};

export interface PopconfirmProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  onConfirm?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<unknown>;
  onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  okText?: React.ReactNode;
  cancelText?: React.ReactNode;
  okType?: ButtonProps["type"];
  okButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  /** Render the Cancel button. */
  showCancel?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
  placement?: PopconfirmPlacement;
  /** What opens the popup. */
  trigger?: PopconfirmTrigger | PopconfirmTrigger[];
  /** Draw the arrow; `{ pointAtCenter: true }` aims it at the middle of the trigger. */
  arrow?: boolean | { pointAtCenter?: boolean };
  /** Background color of the popup (any CSS color or token var). */
  color?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Seconds before a hover trigger opens / closes. */
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  /** Unmount the popup when hidden. */
  destroyTooltipOnHide?: boolean;
  /** Flip / clamp the popup into the viewport. */
  autoAdjustOverflow?: boolean;
  align?: PopconfirmAlign;
  /** Render the popup inside another element instead of <body>. */
  getPopupContainer?: (trigger: HTMLElement) => HTMLElement;
  onPopupClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** Re-render the popup content while hidden instead of showing the cached one. */
  fresh?: boolean;
  /** Single element that accepts a ref — it becomes the trigger (no extra wrapper). */
  children: React.ReactElement;
  className?: string;
  overlayClassName?: string;
  overlayStyle?: React.CSSProperties;
  overlayInnerStyle?: React.CSSProperties;
  zIndex?: number;
}

function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref && typeof ref === "object") (ref as React.RefObject<T | null>).current = value;
}

function sideOf(placement: PopconfirmPlacement): "top" | "bottom" | "left" | "right" {
  if (placement.startsWith("top")) return "top";
  if (placement.startsWith("bottom")) return "bottom";
  if (placement.startsWith("left")) return "left";
  return "right";
}

/** Placement math without any viewport clamping (used when autoAdjustOverflow is off). */
function basePosition(t: DOMRect, c: FloatingSize, placement: PopconfirmPlacement, offset: number) {
  const side = sideOf(placement);
  const align = placement.slice(side.length);
  let top = 0;
  let left = 0;
  if (side === "top") top = t.top - c.height - offset;
  else if (side === "bottom") top = t.bottom + offset;
  else if (side === "left") left = t.left - c.width - offset;
  else left = t.right + offset;

  if (side === "top" || side === "bottom") {
    left = align === "Left" ? t.left : align === "Right" ? t.right - c.width : t.left + (t.width - c.width) / 2;
  } else {
    top = align === "Top" ? t.top : align === "Bottom" ? t.bottom - c.height : t.top + (t.height - c.height) / 2;
  }
  return { top: top + window.scrollY, left: left + window.scrollX };
}

const arrowBorderClass: Record<"top" | "bottom" | "left" | "right", string> = {
  top: "border-t-0 border-l-0",
  bottom: "border-b-0 border-r-0",
  left: "border-b-0 border-l-0",
  right: "border-t-0 border-r-0",
};

export function Popconfirm({
  title,
  description,
  onConfirm,
  onCancel,
  okText = "OK",
  cancelText = "Cancel",
  okType = "primary",
  okButtonProps,
  cancelButtonProps,
  showCancel = true,
  icon = <HelpCircle className="mt-0.5 size-4 shrink-0 text-warning" />,
  disabled = false,
  placement = "top",
  trigger = "click",
  arrow = true,
  color,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  mouseEnterDelay = 0.1,
  mouseLeaveDelay = 0.1,
  destroyTooltipOnHide = true,
  autoAdjustOverflow = true,
  align,
  getPopupContainer,
  onPopupClick,
  fresh = false,
  children,
  className,
  overlayClassName,
  overlayStyle,
  overlayInnerStyle,
  zIndex = 1050,
}: PopconfirmProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const [loading, setLoading] = React.useState(false);
  const [rendered, setRendered] = React.useState(open);
  const [exiting, setExiting] = React.useState(false);
  const [pos, setPos] = React.useState<{ top: number; left: number; arrow: number } | null>(null);

  const triggerRef = React.useRef<HTMLElement>(null);
  const popupRef = React.useRef<HTMLDivElement>(null);
  const enterTimer = React.useRef<number | undefined>(undefined);
  const leaveTimer = React.useRef<number | undefined>(undefined);
  const contentId = React.useId();

  const triggers = Array.isArray(trigger) ? trigger : [trigger];
  const side = sideOf(placement);
  const withArrow = arrow !== false;
  const pointAtCenter = typeof arrow === "object" && arrow.pointAtCenter === true;
  const gap = withArrow ? 10 : 8;

  const setOpen = React.useCallback(
    (v: boolean) => {
      if (disabled) return;
      if (!isControlled) setUncontrolledOpen(v);
      onOpenChange?.(v);
    },
    [disabled, isControlled, onOpenChange],
  );

  useClickOutside(
    popupRef,
    (e) => {
      if (triggerRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    },
    open,
  );

  /* keep the popup mounted for the exit animation */
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    const was = prevOpen.current;
    prevOpen.current = open;
    if (open) {
      setRendered(true);
      setExiting(false);
      return;
    }
    if (!was) return;
    setExiting(true);
    const timer = window.setTimeout(() => {
      setExiting(false);
      if (destroyTooltipOnHide) setRendered(false);
    }, MOTION_DURATION);
    return () => window.clearTimeout(timer);
  }, [open, destroyTooltipOnHide]);

  /* Escape closes */
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const updatePosition = React.useCallback(() => {
    const triggerEl = triggerRef.current;
    const popupEl = popupRef.current;
    if (!triggerEl || !popupEl) return;
    const t = triggerEl.getBoundingClientRect();
    const c = measureFloating(popupEl);

    const raw = autoAdjustOverflow
      ? computeFloatingPosition(t, c, placement, gap)
      : basePosition(t, c, placement, gap);

    let top = raw.top + (align?.offset?.[1] ?? 0);
    let left = raw.left + (align?.offset?.[0] ?? 0);

    // arrow offset along the popup edge, in viewport space
    const vertical = side === "top" || side === "bottom";
    const popupStart = vertical ? left - window.scrollX : top - window.scrollY;
    const span = vertical ? c.width : c.height;
    let arrowOffset: number;
    if (pointAtCenter) {
      const center = vertical ? t.left + t.width / 2 : t.top + t.height / 2;
      arrowOffset = center - popupStart;
    } else {
      const alignPart = placement.slice(side.length);
      arrowOffset =
        alignPart === "Left" || alignPart === "Top"
          ? ARROW_EDGE
          : alignPart === "Right" || alignPart === "Bottom"
            ? span - ARROW_EDGE
            : span / 2;
    }
    arrowOffset = Math.min(Math.max(arrowOffset, ARROW_EDGE), Math.max(ARROW_EDGE, span - ARROW_EDGE));

    const container = getPopupContainer?.(triggerEl);
    if (container && container !== document.body) {
      const rect = container.getBoundingClientRect();
      left -= rect.left + window.scrollX - container.scrollLeft;
      top -= rect.top + window.scrollY - container.scrollTop;
    }

    setPos({ top, left, arrow: arrowOffset });
  }, [align, autoAdjustOverflow, gap, getPopupContainer, placement, pointAtCenter, side]);

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

  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!onConfirm) {
      setOpen(false);
      return;
    }
    try {
      const res = onConfirm(e);
      if (res && typeof (res as Promise<unknown>).then === "function") {
        setLoading(true);
        await res;
      }
      setOpen(false);
    } catch {
      /* a rejected onConfirm keeps the popup open */
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    onCancel?.(e);
    setOpen(false);
  };

  const openOnHover = () => {
    if (!triggers.includes("hover")) return;
    window.clearTimeout(leaveTimer.current);
    enterTimer.current = window.setTimeout(() => setOpen(true), mouseEnterDelay * 1000);
  };

  const closeOnHover = () => {
    if (!triggers.includes("hover")) return;
    window.clearTimeout(enterTimer.current);
    leaveTimer.current = window.setTimeout(() => setOpen(false), mouseLeaveDelay * 1000);
  };

  const child = children as React.ReactElement<TriggerElementProps>;
  const childProps = child.props;
  const triggerNode = React.cloneElement(child, {
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node;
      setRef(childProps.ref, node);
    },
    "aria-haspopup": "dialog",
    "aria-expanded": open,
    "aria-describedby": open ? contentId : undefined,
    className: cn(childProps.className, disabled && "cursor-not-allowed opacity-60", className),
    onClick: disabled
      ? childProps.onClick
      : (e: React.MouseEvent<HTMLElement>) => {
          childProps.onClick?.(e);
          if (triggers.includes("click")) setOpen(!open);
        },
    onContextMenu: disabled
      ? childProps.onContextMenu
      : (e: React.MouseEvent<HTMLElement>) => {
          childProps.onContextMenu?.(e);
          if (triggers.includes("contextMenu")) {
            e.preventDefault();
            setOpen(true);
          }
        },
    onMouseEnter: disabled
      ? childProps.onMouseEnter
      : (e: React.MouseEvent<HTMLElement>) => {
          childProps.onMouseEnter?.(e);
          openOnHover();
        },
    onMouseLeave: disabled
      ? childProps.onMouseLeave
      : (e: React.MouseEvent<HTMLElement>) => {
          childProps.onMouseLeave?.(e);
          closeOnHover();
        },
    onFocus: disabled
      ? childProps.onFocus
      : (e: React.FocusEvent<HTMLElement>) => {
          childProps.onFocus?.(e);
          if (triggers.includes("focus")) setOpen(true);
        },
    onBlur: disabled
      ? childProps.onBlur
      : (e: React.FocusEvent<HTMLElement>) => {
          childProps.onBlur?.(e);
          if (triggers.includes("focus")) setOpen(false);
        },
  });

  const visible = open || exiting;
  const inner = (
    <div
      className={cn(
        "relative w-72 rounded-xl border border-border bg-bg-elevated p-4 text-left shadow-kk-secondary",
        overlayClassName,
      )}
      style={{ backgroundColor: color, ...overlayInnerStyle }}
    >
      <div className="flex gap-2.5">
        {icon}
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-text-heading">{title}</div>
          {description && <div className="mt-1 text-xs leading-relaxed text-text-secondary">{description}</div>}
        </div>
      </div>
      <div className="mt-3.5 flex items-center justify-end gap-2">
        {showCancel && (
          <Button size="sm" disabled={loading} onClick={handleCancel} {...cancelButtonProps}>
            {cancelText}
          </Button>
        )}
        <Button size="sm" type={okType} loading={loading} onClick={handleConfirm} {...okButtonProps}>
          {okText}
        </Button>
      </div>
      {withArrow && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute size-2 rotate-45 border border-border bg-bg-elevated",
            arrowBorderClass[side],
          )}
          style={{
            backgroundColor: color,
            ...(side === "top" ? { bottom: -ARROW_SIZE / 2, left: (pos?.arrow ?? 0) - ARROW_SIZE / 2 } : {}),
            ...(side === "bottom" ? { top: -ARROW_SIZE / 2, left: (pos?.arrow ?? 0) - ARROW_SIZE / 2 } : {}),
            ...(side === "left" ? { right: -ARROW_SIZE / 2, top: (pos?.arrow ?? 0) - ARROW_SIZE / 2 } : {}),
            ...(side === "right" ? { left: -ARROW_SIZE / 2, top: (pos?.arrow ?? 0) - ARROW_SIZE / 2 } : {}),
          }}
        />
      )}
    </div>
  );

  /* while hidden the popup keeps its last content, unless `fresh` */
  const cached = React.useRef<React.ReactNode>(null);
  if (visible || fresh) cached.current = inner;
  const content = visible || fresh ? inner : cached.current;

  const container = triggerRef.current ? getPopupContainer?.(triggerRef.current) : undefined;

  return (
    <>
      {triggerNode}

      {rendered && (
        <Portal container={container}>
          <div
            ref={popupRef}
            id={contentId}
            role="dialog"
            aria-modal="false"
            data-slot="popconfirm"
            data-state={open ? "open" : "closed"}
            data-placement={placement}
            onClick={onPopupClick}
            onMouseEnter={openOnHover}
            onMouseLeave={closeOnHover}
            style={{
              position: "absolute",
              top: pos?.top ?? -9999,
              left: pos?.left ?? -9999,
              zIndex,
              display: visible ? undefined : "none",
              ...overlayStyle,
            }}
            className={cn(
              "relative outline-none duration-150 ease-kk-in-out",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            )}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  );
}
