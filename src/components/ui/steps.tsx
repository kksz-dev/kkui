import * as React from "react";
import { Check, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type StepStatus = "wait" | "process" | "finish" | "error";

export interface StepItem {
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  status?: StepStatus;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
  className?: string;
}

export type StepsProgressDotRender = (
  dot: React.ReactNode,
  info: {
    index: number;
    status: StepStatus;
    title: React.ReactNode;
    description: React.ReactNode;
  },
) => React.ReactNode;

export interface StepsProps extends Omit<React.ComponentProps<"div">, "onChange"> {
  items?: StepItem[];
  current?: number;
  initial?: number;
  status?: StepStatus;
  direction?: "horizontal" | "vertical";
  labelPlacement?: "horizontal" | "vertical";
  size?: "default" | "small";
  type?: "default" | "navigation" | "inline";
  progressDot?: boolean | StepsProgressDotRender;
  percent?: number;
  onChange?: (current: number) => void;
  responsive?: boolean;
  children?: React.ReactNode;
}

export interface StepProps extends StepItem {
  children?: React.ReactNode;
}

function Step(_props: StepProps) {
  return null;
}

const RING_R = 17;
const RING_C = 2 * Math.PI * RING_R;

/**
 * Progress ring drawn around whatever icon the current step renders (number, custom
 * icon or dot). It sits 4px outside its parent on every side, so it fits the 24px
 * small circle, the 32px default circle and the dot wrapper alike.
 */
function PercentRing({ percent }: { percent: number }) {
  return (
    <svg
      data-slot="steps-percent"
      className="pointer-events-none absolute -top-1 -left-1 size-[calc(100%+0.5rem)] -rotate-90"
      viewBox="0 0 40 40"
    >
      <circle cx="20" cy="20" r={RING_R} fill="none" stroke="var(--kk-border-secondary)" strokeWidth="2" />
      <circle
        cx="20"
        cy="20"
        r={RING_R}
        fill="none"
        stroke="var(--kk-primary)"
        strokeWidth="2"
        strokeDasharray={RING_C}
        strokeDashoffset={RING_C * (1 - percent / 100)}
        strokeLinecap="round"
        className="transition-[stroke-dashoffset] duration-mid"
      />
    </svg>
  );
}

function Steps({
  items: itemsProp,
  current = 0,
  initial = 0,
  status: currentStatus = "process",
  direction = "horizontal",
  labelPlacement: labelPlacementProp,
  size = "default",
  type = "default",
  progressDot = false,
  percent,
  onChange,
  responsive = true,
  className,
  children,
  ...props
}: StepsProps) {
  // Extract items from children if not passed as items prop
  const items: StepItem[] = React.useMemo(() => {
    if (itemsProp) return itemsProp;
    const extracted: StepItem[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement<StepProps>(child)) {
        extracted.push({
          title: child.props.title,
          subTitle: child.props.subTitle,
          description: child.props.description || child.props.children,
          icon: child.props.icon,
          status: child.props.status,
          disabled: child.props.disabled,
          onClick: child.props.onClick,
          className: child.props.className,
        });
      }
    });
    return extracted;
  }, [itemsProp, children]);

  const labelPlacement = labelPlacementProp ?? (progressDot ? "vertical" : "horizontal");
  const isSmall = size === "small";
  const isVertical = direction === "vertical";
  const isNav = type === "navigation";
  const isInline = type === "inline";

  // Helper to determine status of a step
  const getStepStatus = (index: number, itemStatus?: StepStatus): StepStatus => {
    if (itemStatus) return itemStatus;
    const activeIndex = current - initial;
    if (index < activeIndex) return "finish";
    if (index === activeIndex) return currentStatus;
    return "wait";
  };

  const handleStepClick = (index: number, item: StepItem, e: React.MouseEvent<HTMLElement>) => {
    if (item.disabled) return;
    item.onClick?.(e);
    if (onChange) {
      onChange(index + initial);
    }
  };

  // --- Inline steps layout ---
  if (isInline) {
    return (
      <div
        data-slot="steps"
        data-type="inline"
        className={cn("flex flex-wrap items-center gap-3 text-sm text-text", className)}
        {...props}
      >
        {items.map((item, index) => {
          const stepStatus = getStepStatus(index, item.status);
          const isClickable = !item.disabled && (Boolean(onChange) || Boolean(item.onClick));
          return (
            <div
              key={index}
              data-slot="steps-item"
              data-status={stepStatus}
              onClick={(e) => isClickable && handleStepClick(index, item, e)}
              className={cn(
                "inline-flex items-center gap-1.5 transition-colors duration-mid",
                isClickable && "cursor-pointer hover:text-primary",
                item.disabled && "cursor-not-allowed opacity-50",
                stepStatus === "process" && "font-medium text-text-heading",
                stepStatus === "finish" && "text-text-secondary",
                stepStatus === "wait" && "text-text-quaternary",
                stepStatus === "error" && "text-error font-medium",
                item.className,
              )}
            >
              <span
                className={cn(
                  "size-2 rounded-full transition-colors",
                  stepStatus === "finish" && "bg-primary",
                  stepStatus === "process" && "bg-primary ring-2 ring-primary/20",
                  stepStatus === "wait" && "bg-fill",
                  stepStatus === "error" && "bg-error",
                )}
              />
              <span>{item.title}</span>
              {item.description && (
                <span data-slot="steps-item-description" className="text-xs text-text-description">
                  {item.description}
                </span>
              )}
              {index < items.length - 1 && <span className="text-text-quaternary">/</span>}
            </div>
          );
        })}
      </div>
    );
  }

  // --- Navigation type steps ---
  if (isNav) {
    return (
      <div
        data-slot="steps"
        data-type="navigation"
        className={cn(
          "flex border-b border-border-secondary",
          isVertical ? "flex-col" : "flex-row",
          className,
        )}
        {...props}
      >
        {items.map((item, index) => {
          const stepStatus = getStepStatus(index, item.status);
          const isClickable = !item.disabled && (Boolean(onChange) || Boolean(item.onClick));
          const isCurrent = index === current - initial;
          return (
            <div
              key={index}
              data-slot="steps-item"
              data-status={stepStatus}
              onClick={(e) => isClickable && handleStepClick(index, item, e)}
              className={cn(
                "group relative flex flex-1 items-center justify-between py-3 px-4 transition-colors duration-mid select-none",
                isClickable && "cursor-pointer hover:bg-fill-alter",
                item.disabled && "cursor-not-allowed opacity-40 hover:bg-transparent",
                isCurrent && "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary after:content-['']",
                item.className,
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full border text-sm transition-colors",
                    stepStatus === "finish" && "border-primary bg-bg-container text-primary",
                    stepStatus === "process" && "border-primary bg-primary text-white font-medium",
                    stepStatus === "wait" && "border-border bg-bg-container text-text-quaternary",
                    stepStatus === "error" && "border-error bg-bg-container text-error",
                  )}
                >
                  {stepStatus === "finish" ? (
                    <Check className="size-4" />
                  ) : stepStatus === "error" ? (
                    <X className="size-4" />
                  ) : item.icon ? (
                    item.icon
                  ) : (
                    index + 1 + initial
                  )}
                </span>
                <div className="min-w-0">
                  <div
                    className={cn(
                      "text-sm leading-none transition-colors",
                      stepStatus === "process" && "font-medium text-text-heading",
                      stepStatus === "finish" && "text-text",
                      stepStatus === "wait" && "text-text-tertiary",
                      stepStatus === "error" && "text-error font-medium",
                    )}
                  >
                    {item.title}
                  </div>
                  {item.subTitle && (
                    <span className="ml-1 text-xs text-text-tertiary">{item.subTitle}</span>
                  )}
                </div>
              </div>
              {index < items.length - 1 && (
                <ChevronRight className="size-4 text-text-quaternary group-hover:text-text-tertiary" />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // --- Default steps layout ---
  const iconSizeClass = isSmall ? "size-6 text-xs" : "size-8 text-sm";

  return (
    <div
      data-slot="steps"
      data-direction={direction}
      data-label-placement={labelPlacement}
      data-size={size}
      className={cn(
        "flex w-full",
        isVertical ? "flex-col" : "flex-row",
        responsive && !isVertical && "max-[532px]:flex-col",
        className,
      )}
      {...props}
    >
      {items.map((item, index) => {
        const stepStatus = getStepStatus(index, item.status);
        const isClickable = !item.disabled && (Boolean(onChange) || Boolean(item.onClick));
        const isLast = index === items.length - 1;
        const isCurrent = index === current - initial;
        const showPercent = typeof percent === "number" && isCurrent && stepStatus === "process";

        // Render dot or standard circle icon
        let iconContent: React.ReactNode;
        if (progressDot) {
          const defaultDot = (
            <span
              className={cn(
                "relative z-10 block size-2 rounded-full transition-all duration-mid",
                stepStatus === "finish" && "bg-primary",
                stepStatus === "process" && "bg-primary shadow-[0_0_0_4px_var(--kk-control-outline)]",
                stepStatus === "wait" && "bg-fill",
                stepStatus === "error" && "bg-error",
              )}
            />
          );
          const dot =
            typeof progressDot === "function"
              ? progressDot(defaultDot, {
                  index: index + initial,
                  status: stepStatus,
                  title: item.title,
                  description: item.description,
                })
              : defaultDot;
          iconContent = showPercent ? (
            <span className="relative z-10 flex size-6 items-center justify-center">
              {dot}
              <PercentRing percent={percent ?? 0} />
            </span>
          ) : (
            dot
          );
        } else if (item.icon) {
          iconContent = (
            <span
              className={cn(
                "relative flex size-full items-center justify-center transition-colors [&_svg]:size-5",
                stepStatus === "finish" && "text-primary",
                stepStatus === "process" && "text-primary",
                stepStatus === "wait" && "text-text-quaternary",
                stepStatus === "error" && "text-error",
              )}
            >
              {item.icon}
              {showPercent && <PercentRing percent={percent ?? 0} />}
            </span>
          );
        } else {
          iconContent = (
            <span
              className={cn(
                "relative z-10 flex items-center justify-center rounded-full border transition-colors duration-mid select-none",
                iconSizeClass,
                stepStatus === "finish" && "border-primary bg-bg-container text-primary",
                stepStatus === "process" && "border-primary bg-primary text-white font-medium",
                stepStatus === "wait" && "border-border bg-bg-container text-text-quaternary font-medium",
                stepStatus === "error" && "border-error bg-bg-container text-error",
              )}
            >
              {stepStatus === "finish" ? (
                <Check className={cn(isSmall ? "size-3.5" : "size-4")} />
              ) : stepStatus === "error" ? (
                <X className={cn(isSmall ? "size-3.5" : "size-4")} />
              ) : (
                index + 1 + initial
              )}
              {showPercent && <PercentRing percent={percent ?? 0} />}
            </span>
          );
        }

        // Connector line styling
        const lineFinished = stepStatus === "finish";

        if (isVertical) {
          return (
            <div
              key={index}
              data-slot="steps-item"
              data-status={stepStatus}
              className={cn(
                "group relative flex min-h-[64px] gap-4",
                isClickable && "cursor-pointer",
                item.disabled && "cursor-not-allowed opacity-50",
                item.className,
              )}
              onClick={(e) => isClickable && handleStepClick(index, item, e)}
            >
              <div className="relative flex flex-col items-center">
                <div
                  className={cn(
                    "flex shrink-0 items-center justify-center",
                    progressDot ? "size-6" : iconSizeClass,
                  )}
                >
                  {iconContent}
                </div>
                {!isLast && (
                  <div
                    data-slot="steps-tail"
                    className={cn(
                      "w-[2px] flex-1 my-1 transition-colors duration-mid",
                      lineFinished ? "bg-primary" : "bg-border-secondary",
                    )}
                  />
                )}
              </div>
              <div className={cn("min-w-0 flex-1 pb-6", isSmall && "pb-4")}>
                <div className="flex items-baseline gap-2">
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors",
                      stepStatus === "process" && "text-text-heading",
                      stepStatus === "finish" && "text-text",
                      stepStatus === "wait" && "text-text-tertiary",
                      stepStatus === "error" && "text-error",
                      isClickable && "group-hover:text-primary",
                    )}
                  >
                    {item.title}
                  </span>
                  {item.subTitle && (
                    <span className="text-xs text-text-tertiary">{item.subTitle}</span>
                  )}
                </div>
                {item.description && (
                  <div className="mt-1 text-xs text-text-description">{item.description}</div>
                )}
              </div>
            </div>
          );
        }

        if (labelPlacement === "vertical") {
          return (
            <div
              key={index}
              data-slot="steps-item"
              data-status={stepStatus}
              className={cn(
                "group relative flex flex-1 flex-col items-center text-center",
                isClickable && "cursor-pointer",
                item.disabled && "cursor-not-allowed opacity-50",
                item.className,
              )}
              onClick={(e) => isClickable && handleStepClick(index, item, e)}
            >
              {!isLast && (
                <div
                  data-slot="steps-tail"
                  className={cn(
                    "absolute left-[50%] right-[-50%] h-[2px] transition-colors duration-mid",
                    progressDot ? "top-3" : isSmall ? "top-3" : "top-4",
                    lineFinished ? "bg-primary" : "bg-border-secondary",
                  )}
                />
              )}
              <div
                className={cn(
                  "relative z-10 flex shrink-0 items-center justify-center bg-bg-container px-2",
                  progressDot ? "h-6" : iconSizeClass,
                )}
              >
                {iconContent}
              </div>
              <div className="mt-2 w-full px-2">
                <div
                  className={cn(
                    "text-sm font-medium transition-colors",
                    stepStatus === "process" && "text-text-heading",
                    stepStatus === "finish" && "text-text",
                    stepStatus === "wait" && "text-text-tertiary",
                    stepStatus === "error" && "text-error",
                    isClickable && "group-hover:text-primary",
                  )}
                >
                  {item.title}
                </div>
                {item.subTitle && (
                  <div className="text-xs text-text-tertiary">{item.subTitle}</div>
                )}
                {item.description && (
                  <div className="mt-1 text-xs text-text-description">{item.description}</div>
                )}
              </div>
            </div>
          );
        }

        // Horizontal labelPlacement === "horizontal"
        return (
          <div
            key={index}
            data-slot="steps-item"
            data-status={stepStatus}
            className={cn(
              "group relative flex flex-1 items-center overflow-hidden",
              isClickable && "cursor-pointer",
              item.disabled && "cursor-not-allowed opacity-50",
              item.className,
            )}
            onClick={(e) => isClickable && handleStepClick(index, item, e)}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "relative z-10 flex shrink-0 items-center justify-center bg-bg-container",
                  progressDot ? "size-6" : iconSizeClass,
                )}
              >
                {iconContent}
              </div>
              <div className="min-w-0 pr-4">
                <div className="flex items-baseline gap-2 whitespace-nowrap">
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors",
                      stepStatus === "process" && "text-text-heading",
                      stepStatus === "finish" && "text-text",
                      stepStatus === "wait" && "text-text-tertiary",
                      stepStatus === "error" && "text-error",
                      isClickable && "group-hover:text-primary",
                    )}
                  >
                    {item.title}
                  </span>
                  {item.subTitle && (
                    <span className="text-xs text-text-tertiary">{item.subTitle}</span>
                  )}
                </div>
                {item.description && (
                  <div className="mt-0.5 text-xs text-text-description line-clamp-2">
                    {item.description}
                  </div>
                )}
              </div>
            </div>
            {!isLast && (
              <div
                data-slot="steps-tail"
                className={cn(
                  "h-[1px] flex-1 mr-4 transition-colors duration-mid",
                  lineFinished ? "bg-primary" : "bg-border-secondary",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

Steps.Step = Step;

export { Steps, Step };
