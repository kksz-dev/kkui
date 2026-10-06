import * as React from "react";
import { Portal } from "@/components/ui/portal";
import { X } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type TourPlacement =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight"
  | "leftTop"
  | "leftBottom"
  | "rightTop"
  | "rightBottom"
  | "center";

export type TourType = "default" | "primary";

export type TourTarget =
  | HTMLElement
  | null
  | (() => HTMLElement | null)
  | React.RefObject<HTMLElement | null>;

export interface TourMask {
  /** Extra style for the mask layer */
  style?: React.CSSProperties;
  /** Mask color */
  color?: string;
  /** Whether clicking the mask closes the tour */
  closable?: boolean;
}

export interface TourStepClosable {
  /** Custom close icon for this step */
  closeIcon?: React.ReactNode;
  /** Accessible label of the close button */
  "aria-label"?: string;
}

export interface TourStep {
  title?: React.ReactNode;
  description?: React.ReactNode;
  cover?: React.ReactNode;
  target?: TourTarget;
  placement?: TourPlacement;
  arrow?: boolean | { pointAtCenter?: boolean };
  mask?: boolean | TourMask;
  type?: TourType;
  nextButtonProps?: ButtonProps & { children?: React.ReactNode };
  prevButtonProps?: ButtonProps & { children?: React.ReactNode };
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
  /** Whether this step shows a close button, optionally with its own icon */
  closable?: boolean | TourStepClosable;
  /** Custom close icon for this step (shorthand for `closable.closeIcon`) */
  closeIcon?: React.ReactNode;
  /** Step count reported to the indicators and to `actionsRender` */
  total?: number;
  scrollIntoViewOptions?: boolean | ScrollIntoViewOptions;
}

export interface TourGap {
  offset?: number | [number, number];
  radius?: number;
}

export interface TourProps {
  /** Steps list */
  steps?: TourStep[];
  /** Whether the tour is open */
  open?: boolean;
  /** Callback when tour is closed */
  onClose?: (current: number) => void;
  /** Current step index (controlled) */
  current?: number;
  /** Default step index */
  defaultCurrent?: number;
  /** Callback when step changes */
  onChange?: (current: number) => void;
  /** Callback when the last step finishes */
  onFinish?: () => void;
  /** Tour visual style */
  type?: TourType;
  /** Mask config, or `false` for a non-modal tour */
  mask?: boolean | TourMask;
  /** Show arrow; `pointAtCenter` makes it track the center of the target */
  arrow?: boolean | { pointAtCenter?: boolean };
  /** Default placement for steps without explicit placement */
  placement?: TourPlacement;
  /** Custom indicator renderer */
  indicatorsRender?: (current: number, total: number) => React.ReactNode;
  /** Custom footer actions; receives the default buttons */
  actionsRender?: (
    originNode: React.ReactNode,
    info: { current: number; total: number },
  ) => React.ReactNode;
  /** Custom close icon; pass `null` to hide the close button */
  closeIcon?: React.ReactNode;
  /** Block pointer interaction with the spotlighted target */
  disabledInteraction?: boolean;
  /** Tour layer z-index */
  zIndex?: number;
  /** Gap offset and border radius around target */
  gap?: TourGap;
  /** Animate spotlight and card movement between steps */
  animated?: boolean;
  /** Default scroll behavior used when a step has no `scrollIntoViewOptions` */
  scrollIntoViewOptions?: boolean | ScrollIntoViewOptions;
  /** Container the tour renders into */
  getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement;
  /** Root class name */
  rootClassName?: string;
}

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface Size {
  width: number;
  height: number;
}

const CARD_MARGIN = 12;
/** Distance of the arrow from the card corner when it does not point at the target center. */
const ARROW_INSET = 24;
const ARROW_HALF = 5;

function resolveTargetElement(target?: TourTarget): HTMLElement | null {
  if (!target) return null;
  if (typeof target === "function") return target();
  if ("current" in target) return target.current;
  return target;
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, Math.max(min, max)));

const sameRect = (a: Rect, b: Rect) =>
  a.top === b.top && a.left === b.left && a.width === b.width && a.height === b.height;

/** Rounded-rect subpath used to punch the spotlight hole out of the click catcher. */
function roundedRectPath({ top, left, width, height }: Rect, radius: number): string {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  const w = width - r * 2;
  const h = height - r * 2;
  return (
    `M${left + r} ${top}h${w}a${r} ${r} 0 0 1 ${r} ${r}v${h}a${r} ${r} 0 0 1 ${-r} ${r}` +
    `h${-w}a${r} ${r} 0 0 1 ${-r} ${-r}v${-h}a${r} ${r} 0 0 1 ${r} ${-r}z`
  );
}

export function Tour({
  steps = [],
  open = false,
  onClose,
  current: currentProp,
  defaultCurrent = 0,
  onChange,
  onFinish,
  type = "default",
  mask = true,
  arrow = true,
  placement: defaultPlacement = "bottom",
  indicatorsRender,
  actionsRender,
  closeIcon,
  disabledInteraction = false,
  zIndex = 1001,
  gap,
  animated = true,
  scrollIntoViewOptions,
  getPopupContainer,
  rootClassName,
}: TourProps) {
  const [uncontrolledCurrent, setUncontrolledCurrent] = React.useState(defaultCurrent);
  const isControlled = currentProp !== undefined;
  const current = isControlled ? currentProp : uncontrolledCurrent;

  const [targetRect, setTargetRect] = React.useState<Rect | null>(null);
  const [cardPosition, setCardPosition] = React.useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [cardSize, setCardSize] = React.useState<Size>({ width: 0, height: 0 });
  const [container, setContainer] = React.useState<HTMLElement | undefined>(undefined);

  const cardRef = React.useRef<HTMLDivElement>(null);
  const maskId = React.useId().replace(/:/g, "");

  const total = steps.length;
  const currentStep: TourStep | undefined = steps[current] ?? steps[0];

  const setCurrent = React.useCallback(
    (next: number) => {
      if (!isControlled) setUncontrolledCurrent(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  // Effective step config
  const stepTarget = currentStep ? resolveTargetElement(currentStep.target) : null;
  const stepPlacement = currentStep?.placement ?? defaultPlacement;
  const stepType = currentStep?.type ?? type;
  const stepMask = currentStep?.mask !== undefined ? currentStep.mask : mask;
  const stepArrow = currentStep?.arrow !== undefined ? currentStep.arrow : arrow;
  const stepScrollOptions = currentStep?.scrollIntoViewOptions ?? scrollIntoViewOptions;
  const stepTotal = currentStep?.total ?? total;

  const rawOffset = gap?.offset;
  const gapX = typeof rawOffset === "number" ? rawOffset : Array.isArray(rawOffset) ? rawOffset[0] : 6;
  const gapY = typeof rawOffset === "number" ? rawOffset : Array.isArray(rawOffset) ? rawOffset[1] : 6;
  const gapRadius = gap?.radius ?? 6;

  React.useEffect(() => {
    setContainer(getPopupContainer ? getPopupContainer(document.body) : undefined);
  }, [getPopupContainer]);

  const updatePositions = React.useCallback(() => {
    if (!open) return;

    if (!stepTarget) {
      setTargetRect(null);
      return;
    }

    const domRect = stepTarget.getBoundingClientRect();
    const rect: Rect = {
      top: domRect.top,
      left: domRect.left,
      width: domRect.width,
      height: domRect.height,
    };
    setTargetRect((prev) => (prev && sameRect(prev, rect) ? prev : rect));

    const cardEl = cardRef.current;
    const cardWidth = cardEl?.offsetWidth || 480;
    const cardHeight = cardEl?.offsetHeight || 200;
    setCardSize((prev) =>
      prev.width === cardWidth && prev.height === cardHeight ? prev : { width: cardWidth, height: cardHeight },
    );

    const right = rect.left + rect.width;
    const bottom = rect.top + rect.height;

    let top = 0;
    let left = 0;

    switch (stepPlacement) {
      case "top":
        top = rect.top - cardHeight - gapY - CARD_MARGIN;
        left = rect.left + rect.width / 2 - cardWidth / 2;
        break;
      case "topLeft":
        top = rect.top - cardHeight - gapY - CARD_MARGIN;
        left = rect.left - gapX;
        break;
      case "topRight":
        top = rect.top - cardHeight - gapY - CARD_MARGIN;
        left = right + gapX - cardWidth;
        break;
      case "bottom":
        top = bottom + gapY + CARD_MARGIN;
        left = rect.left + rect.width / 2 - cardWidth / 2;
        break;
      case "bottomLeft":
        top = bottom + gapY + CARD_MARGIN;
        left = rect.left - gapX;
        break;
      case "bottomRight":
        top = bottom + gapY + CARD_MARGIN;
        left = right + gapX - cardWidth;
        break;
      case "left":
        top = rect.top + rect.height / 2 - cardHeight / 2;
        left = rect.left - cardWidth - gapX - CARD_MARGIN;
        break;
      case "leftTop":
        top = rect.top - gapY;
        left = rect.left - cardWidth - gapX - CARD_MARGIN;
        break;
      case "leftBottom":
        top = bottom + gapY - cardHeight;
        left = rect.left - cardWidth - gapX - CARD_MARGIN;
        break;
      case "right":
        top = rect.top + rect.height / 2 - cardHeight / 2;
        left = right + gapX + CARD_MARGIN;
        break;
      case "rightTop":
        top = rect.top - gapY;
        left = right + gapX + CARD_MARGIN;
        break;
      case "rightBottom":
        top = bottom + gapY - cardHeight;
        left = right + gapX + CARD_MARGIN;
        break;
      case "center":
      default:
        top = window.innerHeight / 2 - cardHeight / 2;
        left = window.innerWidth / 2 - cardWidth / 2;
        break;
    }

    left = clamp(left, 16, window.innerWidth - cardWidth - 16);
    top = clamp(top, 16, window.innerHeight - cardHeight - 16);

    setCardPosition((prev) => (prev.top === top && prev.left === left ? prev : { top, left }));
  }, [open, stepTarget, stepPlacement, gapX, gapY]);

  // Scroll the target into view whenever the step changes
  React.useEffect(() => {
    if (!open || !stepTarget) return;

    const options = stepScrollOptions ?? { behavior: "smooth", block: "center", inline: "center" };
    if (typeof options === "object") {
      stepTarget.scrollIntoView(options);
    } else if (options) {
      stepTarget.scrollIntoView();
    }

    // Let smooth scrolling settle before measuring again
    const timeout = setTimeout(updatePositions, 150);
    return () => clearTimeout(timeout);
  }, [open, stepTarget, stepScrollOptions, updatePositions]);

  React.useEffect(() => {
    if (!open) return;
    updatePositions();

    const handleScrollOrResize = () => {
      requestAnimationFrame(updatePositions);
    };

    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("scroll", handleScrollOrResize, true);
    return () => {
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize, true);
    };
  }, [open, updatePositions]);

  if (!open || total === 0) return null;

  const hasTarget = Boolean(stepTarget && targetRect);
  const showMask = stepMask !== false;
  const maskConfig: TourMask = typeof stepMask === "object" ? stepMask : {};
  const maskColor = maskConfig.color ?? "rgba(0, 0, 0, 0.5)";
  const maskClosable = maskConfig.closable !== false;

  const spotlight: Rect | null =
    targetRect && hasTarget
      ? {
          left: targetRect.left - gapX,
          top: targetRect.top - gapY,
          width: targetRect.width + gapX * 2,
          height: targetRect.height + gapY * 2,
        }
      : null;

  // A huge outer rect keeps the catcher full-bleed; the element bounds clip the rest.
  const catcherClipPath = spotlight
    ? `path(evenodd, "M0 0H99999V99999H0Z ${roundedRectPath(spotlight, gapRadius)}")`
    : undefined;

  const isPrimary = stepType === "primary";
  const isVerticalPlacement = stepPlacement.startsWith("top") || stepPlacement.startsWith("bottom");
  const showArrow = stepArrow !== false && hasTarget && stepPlacement !== "center";
  const pointAtCenter = typeof stepArrow === "object" && stepArrow.pointAtCenter === true;

  let arrowOffset = ARROW_INSET;
  if (pointAtCenter && targetRect) {
    if (isVerticalPlacement) {
      const targetCenterX = targetRect.left + targetRect.width / 2;
      arrowOffset = clamp(targetCenterX - cardPosition.left - ARROW_HALF, 12, cardSize.width - 22);
    } else {
      const targetCenterY = targetRect.top + targetRect.height / 2;
      arrowOffset = clamp(targetCenterY - cardPosition.top - ARROW_HALF, 12, cardSize.height - 22);
    }
  }

  const stepClosable = currentStep?.closable;
  const closableConfig = typeof stepClosable === "object" ? stepClosable : undefined;
  const resolvedCloseIcon =
    closableConfig?.closeIcon !== undefined
      ? closableConfig.closeIcon
      : currentStep?.closeIcon !== undefined
        ? currentStep.closeIcon
        : closeIcon !== undefined
          ? closeIcon
          : <X className="size-4" />;
  const showCloseButton = stepClosable !== false && resolvedCloseIcon !== null;

  const handleNext = () => {
    if (current < total - 1) {
      setCurrent(current + 1);
    } else {
      onFinish?.();
      onClose?.(current);
    }
  };

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleClose = () => {
    currentStep?.onClose?.();
    onClose?.(current);
  };

  const {
    children: nextChildren,
    onClick: nextOnClick,
    ...nextButtonRest
  } = currentStep?.nextButtonProps ?? {};
  const {
    children: prevChildren,
    onClick: prevOnClick,
    ...prevButtonRest
  } = currentStep?.prevButtonProps ?? {};

  const defaultActions = (
    <div className="flex items-center gap-2">
      {current > 0 && (
        <Button
          size="sm"
          variant={isPrimary ? "text" : "outlined"}
          color={isPrimary ? "default" : undefined}
          className={isPrimary ? "text-white hover:bg-white/10" : undefined}
          {...prevButtonRest}
          onClick={(e) => {
            prevOnClick?.(e);
            handlePrev();
          }}
        >
          {prevChildren ?? "Previous"}
        </Button>
      )}

      <Button
        size="sm"
        type={isPrimary ? "default" : "primary"}
        variant={isPrimary ? "solid" : undefined}
        className={
          isPrimary
            ? "bg-white text-primary hover:bg-white/90 border-transparent shadow-sm font-medium"
            : undefined
        }
        {...nextButtonRest}
        onClick={(e) => {
          nextOnClick?.(e);
          handleNext();
        }}
      >
        {nextChildren ?? (current === total - 1 ? "Finish" : "Next")}
      </Button>
    </div>
  );

  return (
    <Portal container={container}>
      <div
        data-slot="tour"
        className={cn("pointer-events-none fixed inset-0 select-none", rootClassName)}
        style={{ zIndex }}
      >
        {showMask && (
          <>
            {/* Painted mask with the spotlight cut out */}
            <svg
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 size-full"
              style={{ zIndex, ...maskConfig.style }}
            >
              <defs>
                <mask id={maskId}>
                  <rect x="0" y="0" width="100%" height="100%" fill="white" />
                  {spotlight && (
                    <rect
                      x={spotlight.left}
                      y={spotlight.top}
                      width={spotlight.width}
                      height={spotlight.height}
                      rx={gapRadius}
                      ry={gapRadius}
                      fill="black"
                      className={animated ? "transition-all duration-mid ease-kk-in-out" : undefined}
                    />
                  )}
                </mask>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill={maskColor} mask={`url(#${maskId})`} />
            </svg>

            {/* Click catcher: clipped so the spotlight stays reachable */}
            <div
              data-slot="tour-mask"
              className="pointer-events-auto fixed inset-0"
              style={{ zIndex, clipPath: catcherClipPath }}
              onClick={maskClosable ? handleClose : undefined}
            />
          </>
        )}

        {/* Swallows every pointer event over the spotlight */}
        {disabledInteraction && spotlight && (
          <div
            data-slot="tour-interaction-blocker"
            aria-hidden="true"
            className={cn(
              "pointer-events-auto fixed cursor-not-allowed",
              animated && "transition-all duration-mid ease-kk-in-out",
            )}
            style={{
              zIndex,
              top: spotlight.top,
              left: spotlight.left,
              width: spotlight.width,
              height: spotlight.height,
              borderRadius: gapRadius,
            }}
            onClick={(e) => e.stopPropagation()}
          />
        )}

        {/* Tour card */}
        <div
          ref={cardRef}
          data-slot="tour-card"
          style={{
            zIndex: zIndex + 1,
            position: "fixed",
            ...(hasTarget
              ? { top: `${cardPosition.top}px`, left: `${cardPosition.left}px` }
              : { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }),
            ...currentStep?.style,
          }}
          className={cn(
            "pointer-events-auto relative w-[500px] max-w-[calc(100vw-32px)] rounded-lg p-4 shadow-kk",
            animated && "kk-in kk-in-zoom transition-[top,left] duration-mid ease-kk-in-out",
            isPrimary ? "bg-primary text-white" : "bg-bg-elevated text-text border border-border/50",
            currentStep?.className,
          )}
        >
          {showArrow && (
            <div
              aria-hidden="true"
              style={isVerticalPlacement ? { left: arrowOffset } : { top: arrowOffset }}
              className={cn(
                "absolute size-2.5 rotate-45 pointer-events-none",
                animated && "transition-[top,left] duration-mid ease-kk-in-out",
                isPrimary ? "bg-primary" : "bg-bg-elevated border-border/50",
                stepPlacement.startsWith("bottom") && "-top-1.25 border-t border-l",
                stepPlacement.startsWith("top") && "-bottom-1.25 border-b border-r",
                stepPlacement.startsWith("right") && "-left-1.25 border-b border-l",
                stepPlacement.startsWith("left") && "-right-1.25 border-t border-r",
              )}
            />
          )}

          {showCloseButton && (
            <button
              type="button"
              aria-label={closableConfig?.["aria-label"] ?? "Close"}
              onClick={handleClose}
              className={cn(
                "absolute right-3.5 top-3.5 flex size-6 items-center justify-center rounded-sm transition-colors cursor-pointer",
                isPrimary
                  ? "text-white/80 hover:bg-white/10 hover:text-white"
                  : "text-text-tertiary hover:bg-fill-tertiary hover:text-text",
              )}
            >
              {resolvedCloseIcon}
            </button>
          )}

          {currentStep?.cover && (
            <div className="mb-3 overflow-hidden rounded-md">{currentStep.cover}</div>
          )}

          <div className="pr-6">
            {currentStep?.title && (
              <div className="text-base font-semibold leading-6">{currentStep.title}</div>
            )}
            {currentStep?.description && (
              <div
                className={cn(
                  "mt-1.5 text-sm leading-5 break-words",
                  isPrimary ? "text-white/85" : "text-text-secondary",
                )}
              >
                {currentStep.description}
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5">
              {indicatorsRender
                ? indicatorsRender(current, stepTotal)
                : Array.from({ length: stepTotal }).map((_, idx) => (
                    <span
                      key={idx}
                      className={cn(
                        "size-1.5 rounded-full transition-all duration-mid",
                        idx === current
                          ? isPrimary
                            ? "bg-white scale-125"
                            : "bg-primary scale-125"
                          : isPrimary
                            ? "bg-white/40"
                            : "bg-fill-secondary",
                      )}
                    />
                  ))}
            </div>

            {actionsRender ? actionsRender(defaultActions, { current, total: stepTotal }) : defaultActions}
          </div>
        </div>
      </div>
    </Portal>
  );
}
