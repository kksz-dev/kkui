import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWave } from "@/hooks/use-wave";

export type ButtonType = "default" | "primary" | "dashed" | "text" | "link";
export type ButtonVariant = "solid" | "outlined" | "dashed" | "filled" | "text" | "link";
export type ButtonColor = "default" | "primary" | "danger";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonShape = "default" | "circle" | "round";
/** `true`, or an object to delay the spinner / replace its icon. */
export type ButtonLoading = boolean | { delay?: number; icon?: React.ReactNode };

/** A label of exactly two Chinese characters gets a space between them (`autoInsertSpace`). */
const TWO_CN_CHARS = /^[\u4e00-\u9fa5]{2}$/;

interface ButtonGroupContextValue {
  size?: ButtonSize;
}
const ButtonGroupContext = React.createContext<ButtonGroupContextValue | null>(null);

const typeMap: Record<ButtonType, { variant: ButtonVariant; color: ButtonColor }> = {
  default: { variant: "outlined", color: "default" },
  primary: { variant: "solid", color: "primary" },
  dashed: { variant: "dashed", color: "default" },
  text: { variant: "text", color: "default" },
  link: { variant: "link", color: "primary" },
};

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color" | "type"> {
  type?: ButtonType | "button" | "submit" | "reset";
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  shape?: ButtonShape;
  danger?: boolean;
  ghost?: boolean;
  block?: boolean;
  loading?: ButtonLoading;
  /** Insert a space between the two characters of a 2-Chinese-character label */
  autoInsertSpace?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
  href?: string;
  target?: string;
  htmlType?: "button" | "submit" | "reset";
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    style,
    type = "default",
    variant,
    color,
    size: sizeProp,
    shape = "default",
    danger = false,
    ghost = false,
    block = false,
    loading = false,
    autoInsertSpace = true,
    icon,
    iconPosition = "start",
    href,
    target,
    htmlType = "button",
    asChild = false,
    disabled,
    children,
    onPointerDown,
    ...props
  },
  ref,
) {
  const wave = useWave<HTMLButtonElement>();
  const group = React.useContext(ButtonGroupContext);
  const size = sizeProp ?? group?.size ?? "md";

  /* loading: `true` shows at once, `{ delay }` waits before showing the spinner */
  const loadingRequested = loading === true || (typeof loading === "object" && loading !== null);
  const loadingDelay = typeof loading === "object" && loading !== null ? (loading.delay ?? 0) : 0;
  const loadingIcon = typeof loading === "object" && loading !== null ? loading.icon : undefined;
  const [delayPassed, setDelayPassed] = React.useState(false);
  React.useEffect(() => {
    if (!loadingRequested || loadingDelay <= 0) {
      setDelayPassed(false);
      return;
    }
    const t = window.setTimeout(() => setDelayPassed(true), loadingDelay);
    return () => window.clearTimeout(t);
  }, [loadingRequested, loadingDelay]);
  const isLoading = loadingRequested && (loadingDelay <= 0 || delayPassed);

  let buttonStyleType: ButtonType = "default";
  let resolvedHtmlType = htmlType;
  if (type === "submit" || type === "reset" || type === "button") {
    resolvedHtmlType = type;
    buttonStyleType = "default";
  } else if (type in typeMap) {
    buttonStyleType = type as ButtonType;
  }

  const mapped = typeMap[buttonStyleType] ?? typeMap.default;
  const v = variant ?? mapped.variant;
  const c = danger ? "danger" : (color ?? mapped.color);
  const iconOnly = !children && children !== 0;
  const isDisabled = disabled || isLoading;

  const sizeClasses: Record<ButtonSize, string> = {
    sm: "h-control-sm rounded-sm text-sm",
    md: "h-control rounded-md text-sm",
    lg: "h-control-lg rounded-lg text-base",
  };

  const variantColorClasses: Record<string, string> = {
    "solid-primary": "bg-primary text-white hover:bg-primary-hover active:bg-primary-active border-transparent shadow-[0_2px_0_rgba(5,145,255,0.1)]",
    "solid-default": "bg-bg-solid text-bg-container hover:bg-bg-solid-hover active:bg-bg-solid-active border-transparent",
    "solid-danger": "bg-error text-white hover:bg-error-hover active:bg-error-active border-transparent",
    "outlined-default": "border-border bg-bg-container text-text hover:border-primary-hover hover:text-primary-hover active:border-primary-active active:text-primary-active shadow-[0_2px_0_rgba(0,0,0,0.02)]",
    "outlined-primary": "border-primary bg-bg-container text-primary hover:border-primary-hover hover:text-primary-hover active:border-primary-active active:text-primary-active",
    "outlined-danger": "border-error bg-bg-container text-error hover:border-error-hover hover:text-error-hover active:border-error-active active:text-error-active",
    "dashed-default": "border-border border-dashed bg-bg-container text-text hover:border-primary-hover hover:text-primary-hover active:border-primary-active active:text-primary-active",
    "dashed-primary": "border-primary border-dashed bg-bg-container text-primary hover:border-primary-hover hover:text-primary-hover",
    "dashed-danger": "border-error border-dashed bg-bg-container text-error hover:border-error-hover hover:text-error-hover",
    "filled-default": "bg-fill-tertiary border-transparent text-text hover:bg-fill-secondary active:bg-fill",
    "filled-primary": "bg-primary-bg border-transparent text-primary hover:bg-primary-bg-hover active:bg-primary-border",
    "filled-danger": "bg-error-bg border-transparent text-error hover:bg-error-bg-hover active:bg-error-border",
    "text-default": "border-transparent bg-transparent text-text hover:bg-fill-tertiary active:bg-fill-secondary",
    "text-primary": "border-transparent bg-transparent text-primary hover:bg-primary-bg active:bg-primary-bg-hover",
    "text-danger": "border-transparent bg-transparent text-error hover:bg-error-bg active:bg-error-bg-hover",
    "link-default": "border-transparent bg-transparent text-text hover:text-primary-hover active:text-primary-active",
    "link-primary": "border-transparent bg-transparent text-primary hover:text-primary-hover active:text-primary-active",
    "link-danger": "border-transparent bg-transparent text-error hover:text-error-hover active:text-error-active",
  };

  const shapeClasses: Record<ButtonShape, string> = {
    default: "",
    circle: "rounded-full px-0",
    round: "rounded-full",
  };

  const key = `${v}-${c}`;
  const baseVariantClass = variantColorClasses[key] ?? variantColorClasses["outlined-default"];

  const ghostClass = ghost
    ? c === "danger"
      ? "bg-transparent! border-error text-error"
      : c === "primary"
        ? "bg-transparent! border-primary text-primary"
        : "bg-transparent! border-white text-white"
    : "";

  const isSquare = iconOnly || shape === "circle";

  const classes = cn(
    // kk-hover-pop carries both the colour easing and the spring on transform
    "kk-wave kk-hover-pop relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-normal select-none border outline-none focus-visible:ring-[3px] focus-visible:ring-primary/30",
    "disabled:cursor-not-allowed disabled:border-border disabled:bg-bg-container-disabled disabled:text-text-disabled disabled:shadow-none",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    sizeClasses[size],
    shapeClasses[shape],
    baseVariantClass,
    ghostClass,
    block && "w-full flex",
    isSquare && (size === "sm" ? "w-control-sm px-0" : size === "lg" ? "w-control-lg px-0" : "w-control px-0"),
    className,
  );

  // the spinner replaces the icon on the side `iconPosition` points at
  const spinner = isLoading ? (loadingIcon ?? <Loader2 className="animate-spin" />) : null;
  const affix = spinner ?? icon;
  const label =
    autoInsertSpace && typeof children === "string" && TWO_CN_CHARS.test(children) ? children.split("").join(" ") : children;

  const content = (
    <>
      {iconPosition === "start" ? affix : null}
      {label != null && label !== false && <span>{label}</span>}
      {iconPosition === "end" ? affix : null}
    </>
  );

  const waveColor =
    c === "danger" ? "var(--kk-error)" : c === "primary" ? "var(--kk-primary)" : "var(--kk-text-quaternary)";
  const waveStyle = { "--kk-wave-color": waveColor } as React.CSSProperties;

  const padValue = isSquare ? "0px" : (size === "sm" ? "7px" : "15px");

  if (href && !asChild) {
    return (
      <a
        data-slot="button"
        href={isDisabled ? undefined : href}
        target={target}
        aria-disabled={isDisabled || undefined}
        className={cn(classes, isDisabled && "pointer-events-none border-border bg-bg-container-disabled text-text-disabled")}
        style={{ ...waveStyle, paddingLeft: padValue, paddingRight: padValue, ...style }}
        {...(props as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  if (asChild && React.isValidElement(children)) {
    const rawChild = children as React.ReactElement<any>;
    return React.cloneElement(rawChild, {
      ...props,
      ref,
      className: cn(classes, rawChild.props.className),
      disabled: isDisabled,
      style: { ...waveStyle, paddingLeft: padValue, paddingRight: padValue, ...rawChild.props.style, ...style },
      onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
        wave.onPointerDown(e);
        rawChild.props.onPointerDown?.(e);
        onPointerDown?.(e);
      },
    });
  }

  return (
    <button
      ref={ref}
      data-slot="button"
      data-variant={v}
      data-color={c}
      data-size={size}
      type={resolvedHtmlType}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      className={classes}
      style={{ ...waveStyle, paddingLeft: padValue, paddingRight: padValue, ...style }}
      onPointerDown={(e) => {
        wave.onPointerDown(e);
        onPointerDown?.(e);
      }}
      {...props}
    >
      {content}
    </button>
  );
});

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Size applied to every Button inside that does not set its own */
  size?: ButtonSize;
}

export function ButtonGroup({ className, size, ...props }: ButtonGroupProps) {
  const ctx = React.useMemo<ButtonGroupContextValue>(() => ({ size }), [size]);
  return (
    <ButtonGroupContext.Provider value={ctx}>
      <div
        role="group"
        data-slot="button-group"
        className={cn(
          "inline-flex [&>[data-slot=button]]:rounded-none [&>[data-slot=button]:first-child]:rounded-l-md [&>[data-slot=button]:last-child]:rounded-r-md [&>[data-slot=button]:not(:first-child)]:-ml-px [&>[data-slot=button]:hover]:z-10 [&>[data-slot=button]:focus-visible]:z-10",
          className,
        )}
        {...props}
      />
    </ButtonGroupContext.Provider>
  );
}
