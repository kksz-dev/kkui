import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleCheck, CircleX, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Alert — KKUI feedback banner: 4 types, optional icon/description/action,
 * closable with a collapse animation, `banner` mode and an ErrorBoundary helper.
 */
const alertVariants = cva(
  "relative flex w-full items-start gap-2 border text-sm text-text transition-[opacity,margin,padding,max-height] duration-mid ease-kk-in-out",
  {
    variants: {
      type: {
        success: "border-success-border bg-success-bg",
        info: "border-info-border bg-info-bg",
        warning: "border-warning-border bg-warning-bg",
        error: "border-error-border bg-error-bg",
      },
      banner: {
        true: "rounded-none border-0",
        false: "rounded-lg",
      },
      withDescription: {
        true: "px-6 py-5",
        false: "px-3 py-2",
      },
    },
    defaultVariants: { type: "info", banner: false, withDescription: false },
  },
);

const iconColor: Record<AlertType, string> = {
  success: "text-success",
  info: "text-info",
  warning: "text-warning",
  error: "text-error",
};

const defaultIcons: Record<AlertType, React.ComponentType<{ className?: string }>> = {
  success: CircleCheck,
  info: Info,
  warning: TriangleAlert,
  error: CircleX,
};

export type AlertType = "success" | "info" | "warning" | "error";

export interface AlertClosable {
  closeIcon?: React.ReactNode;
  afterClose?: () => void;
  disabled?: boolean;
  "aria-label"?: string;
}

export interface AlertProps
  extends Omit<React.ComponentProps<"div">, "title" | "children">,
    Omit<VariantProps<typeof alertVariants>, "withDescription" | "banner"> {
  /** Content of Alert */
  message?: React.ReactNode;
  /** Additional content shown under the message */
  description?: React.ReactNode;
  /** Whether to show icon */
  showIcon?: boolean;
  /** Custom icon, only when showIcon is true */
  icon?: React.ReactNode;
  /** Whether Alert can be closed (or close config) */
  closable?: boolean | AlertClosable;
  /** Custom close icon (shorthand of closable.closeIcon) */
  closeIcon?: React.ReactNode;
  /** Called when close is clicked */
  onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Called after the close animation finished */
  afterClose?: () => void;
  /** Whether to show as banner (no border/radius, warning by default) */
  banner?: boolean;
  /** Action node on the right */
  action?: React.ReactNode;
}

function Alert({
  className,
  type,
  message,
  description,
  showIcon: showIconProp,
  icon,
  closable,
  closeIcon,
  onClose,
  afterClose,
  banner = false,
  action,
  style,
  ...props
}: AlertProps) {
  const [closed, setClosed] = React.useState(false);
  const [closing, setClosing] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const resolvedType: AlertType = type ?? (banner ? "warning" : "info");
  const showIcon = showIconProp ?? banner;
  const withDescription = description != null;
  const closableConfig: AlertClosable | undefined =
    typeof closable === "object" ? closable : closable === true || closeIcon != null ? {} : undefined;
  const isClosable = closableConfig != null;
  const resolvedCloseIcon = closableConfig?.closeIcon ?? closeIcon;
  const resolvedAfterClose = closableConfig?.afterClose ?? afterClose;

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClose?.(e);
    const el = ref.current;
    if (el) el.style.maxHeight = `${el.offsetHeight}px`;
    // force reflow before collapsing
    void el?.offsetHeight;
    setClosing(true);
  };

  const onTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (closing && e.target === ref.current && e.propertyName === "max-height") {
      setClosed(true);
      resolvedAfterClose?.();
    }
  };

  if (closed) return null;

  const IconComp = defaultIcons[resolvedType];
  const iconNode = showIcon ? (
    <span
      data-slot="alert-icon"
      className={cn(
        "flex shrink-0 items-center [&_svg]:size-4",
        iconColor[resolvedType],
        withDescription ? "mt-0.5 [&_svg]:size-6" : "h-[22px]",
      )}
    >
      {icon ?? <IconComp />}
    </span>
  ) : null;

  return (
    <div
      ref={ref}
      role="alert"
      data-slot="alert"
      data-type={resolvedType}
      className={cn(
        alertVariants({ type: resolvedType, banner, withDescription }),
        closing && "!my-0 !max-h-0 !py-0 overflow-hidden opacity-0",
        className,
      )}
      style={style}
      onTransitionEnd={onTransitionEnd}
      {...props}
    >
      {iconNode}
      <div data-slot="alert-content" className="min-w-0 flex-1">
        {message != null && (
          <div data-slot="alert-message" className={cn(withDescription ? "mb-2 text-base text-text-heading" : "text-text")}>
            {message}
          </div>
        )}
        {withDescription && (
          <div data-slot="alert-description" className="text-sm text-text">
            {description}
          </div>
        )}
      </div>
      {action != null && (
        <div data-slot="alert-action" className="ml-1 shrink-0 self-start">
          {action}
        </div>
      )}
      {isClosable && (
        <button
          type="button"
          data-slot="alert-close"
          aria-label={closableConfig?.["aria-label"] ?? "Close"}
          disabled={closableConfig?.disabled}
          onClick={handleClose}
          className={cn(
            "ml-1 flex shrink-0 cursor-pointer items-center self-start bg-transparent text-xs text-text-tertiary transition-colors duration-mid hover:text-text disabled:cursor-not-allowed disabled:text-text-disabled",
            !withDescription && "h-[22px]",
            "[&_svg]:size-3",
          )}
        >
          {resolvedCloseIcon ?? <X />}
        </button>
      )}
    </div>
  );
}

/* ---------------- ErrorBoundary ---------------- */

export interface AlertErrorBoundaryProps {
  message?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}

interface AlertErrorBoundaryState {
  error?: Error | null;
  info?: { componentStack?: string | null } | null;
}

/** Catches render errors in children and displays them as an error Alert. */
class AlertErrorBoundary extends React.Component<AlertErrorBoundaryProps, AlertErrorBoundaryState> {
  state: AlertErrorBoundaryState = { error: undefined, info: { componentStack: "" } };

  componentDidCatch(error: Error | null, info: { componentStack?: string | null }) {
    this.setState({ error, info });
  }

  render() {
    const { message, description, children } = this.props;
    const { error, info } = this.state;
    const componentStack = info?.componentStack ?? null;
    const errorMessage = typeof message === "undefined" ? (error || "").toString() : message;
    const errorDescription = typeof description === "undefined" ? componentStack : description;
    if (error) {
      return (
        <Alert
          type="error"
          message={errorMessage}
          description={
            <pre className="max-h-64 overflow-auto rounded-md bg-fill-quaternary p-2 font-mono text-xs whitespace-pre-wrap text-text-secondary kk-scrollbar">
              {errorDescription}
            </pre>
          }
        />
      );
    }
    return children;
  }
}

export { Alert, AlertErrorBoundary, alertVariants };
