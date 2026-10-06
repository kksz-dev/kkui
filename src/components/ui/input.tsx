import * as React from "react";
import { cva } from "class-variance-authority";
import { Eye, EyeOff, Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";

/**
 * Input — KKUI text inputs (Input / TextArea / Search / Password / OTP / Group)
 * on Tailwind tokens. The wrapper `<span>` owns the border so prefix / suffix / clear /
 * count sit inside the control exactly like KKUI's affix wrapper.
 */

export type InputSize = "sm" | "md" | "lg";
export type InputStatus = "error" | "warning";
export type InputVariant = "outlined" | "filled" | "borderless" | "underlined";

/* ------------------------------------------------------------------ */
/* shared helpers                                                      */
/* ------------------------------------------------------------------ */

/** value/defaultValue/onChange → [value, setValue] (controlled when `value !== undefined`). */
export function useControlled<T>(value: T | undefined, defaultValue: T): [T, (next: T) => void] {
  const [inner, setInner] = React.useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const set = React.useCallback(
    (next: T) => {
      if (!isControlled) setInner(next);
    },
    [isControlled],
  );
  return [isControlled ? (value as T) : inner, set];
}

/** Set a native input value and fire React's onChange (used by clear buttons). */
export function triggerNativeChange(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const proto = Object.getPrototypeOf(el) as object;
  const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
  setter?.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

/** KKUI CloseCircleFilled look-alike (used by allowClear). */
export function ClearIcon({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-3 items-center justify-center rounded-full bg-text-quaternary text-bg-container transition-colors duration-mid hover:bg-text-tertiary",
        className,
      )}
    >
      <X className="size-2" strokeWidth={3.5} />
    </span>
  );
}

export const inputWrapperVariants = cva(
  [
    "relative flex w-full min-w-0 items-center gap-1 text-sm text-text",
    "transition-[border-color,background-color,box-shadow] duration-mid ease-kk-in-out",
    "[&_input]:min-w-0 [&_input]:flex-1 [&_input]:bg-transparent [&_input]:text-inherit [&_input]:outline-none [&_input]:placeholder:text-text-placeholder [&_input]:disabled:cursor-not-allowed",
    "[&_textarea]:bg-transparent [&_textarea]:outline-none [&_textarea]:placeholder:text-text-placeholder [&_textarea]:disabled:cursor-not-allowed",
  ],
  {
    variants: {
      variant: {
        outlined: "border border-border bg-bg-container hover:border-primary-hover focus-within:border-primary focus-within:ring-[3px] focus-within:ring-primary/10 focus-within:hover:border-primary",
        filled: "border border-transparent bg-fill-tertiary hover:bg-fill-secondary focus-within:border-primary focus-within:bg-bg-container focus-within:hover:bg-bg-container",
        borderless: "border border-transparent bg-transparent",
        underlined: "rounded-none! border-b border-border bg-transparent hover:border-primary-hover focus-within:border-primary",
      },
      size: {
        sm: "rounded-sm px-[7px]",
        md: "rounded-md px-[11px]",
        lg: "rounded-lg px-[11px] text-base",
      },
      status: { default: "", error: "", warning: "" },
      disabled: { true: "cursor-not-allowed text-text-disabled", false: "" },
    },
    compoundVariants: [
      { variant: "outlined", status: "error", className: "border-error hover:border-error-hover focus-within:border-error focus-within:ring-error/10 focus-within:hover:border-error" },
      { variant: "outlined", status: "warning", className: "border-warning hover:border-warning-hover focus-within:border-warning focus-within:ring-warning/10 focus-within:hover:border-warning" },
      { variant: "filled", status: "error", className: "bg-error-bg text-error hover:bg-error-bg-hover focus-within:border-error" },
      { variant: "filled", status: "warning", className: "bg-warning-bg text-warning hover:bg-warning-bg-hover focus-within:border-warning" },
      { variant: "borderless", status: "error", className: "text-error" },
      { variant: "borderless", status: "warning", className: "text-warning" },
      { variant: "underlined", status: "error", className: "border-error hover:border-error-hover focus-within:border-error" },
      { variant: "underlined", status: "warning", className: "border-warning hover:border-warning-hover focus-within:border-warning" },
      { variant: ["outlined", "filled"], disabled: true, className: "border-border bg-bg-container-disabled hover:border-border hover:bg-bg-container-disabled" },
    ],
    defaultVariants: { variant: "outlined", size: "md", status: "default", disabled: false },
  },
);

/** Single-line control heights (kept out of the cva so TextArea can grow freely). */
export const inputHeight: Record<InputSize, string> = { sm: "h-control-sm", md: "h-control", lg: "h-control-lg" };

export const inputAddonVariants = cva("flex shrink-0 items-center whitespace-nowrap border border-border bg-fill-alter text-text", {
  variants: {
    size: {
      sm: "px-[7px] text-sm",
      md: "px-[11px] text-sm",
      lg: "px-[11px] text-base",
    },
    side: { before: "border-r-0", after: "border-l-0" },
  },
  compoundVariants: [
    { size: "sm", side: "before", className: "rounded-l-sm" },
    { size: "md", side: "before", className: "rounded-l-md" },
    { size: "lg", side: "before", className: "rounded-l-lg" },
    { size: "sm", side: "after", className: "rounded-r-sm" },
    { size: "md", side: "after", className: "rounded-r-md" },
    { size: "lg", side: "after", className: "rounded-r-lg" },
  ],
  defaultVariants: { size: "md" },
});

/* ------------------------------------------------------------------ */
/* count                                                               */
/* ------------------------------------------------------------------ */

export interface InputCountInfo {
  value: string;
  count: number;
  maxLength?: number;
}

export interface InputCountConfig {
  /** Show the counter (boolean) or a custom formatter */
  show?: boolean | ((info: InputCountInfo) => React.ReactNode);
  /** Max count; when exceeded the input turns red (and is cut when `exceedFormatter` is given) */
  max?: number;
  /** How to count — defaults to `value.length` (code units); use e.g. grapheme splitting for emoji */
  strategy?: (value: string) => number;
  /** Cut the value when it exceeds `max` */
  exceedFormatter?: (value: string, config: { max: number }) => string;
}

export type ShowCount = boolean | { formatter: (info: InputCountInfo) => React.ReactNode };

function useCount(showCount: ShowCount | undefined, count: InputCountConfig | undefined, maxLength: number | undefined) {
  const strategy = count?.strategy ?? ((v: string) => v.length);
  const max = count?.max ?? maxLength;
  const show = count?.show ?? (typeof showCount === "object" ? showCount.formatter : !!showCount);
  return {
    max,
    strategy,
    show: !!show,
    format(value: string): React.ReactNode {
      const n = strategy(value);
      const info: InputCountInfo = { value, count: n, maxLength: max };
      if (typeof show === "function") return show(info);
      return max === undefined ? `${n}` : `${n} / ${max}`;
    },
    exceed(value: string) {
      return count?.max !== undefined && strategy(value) > count.max;
    },
    clamp(value: string) {
      if (count?.max !== undefined && count.exceedFormatter && strategy(value) > count.max) {
        return count.exceedFormatter(value, { max: count.max });
      }
      return value;
    },
  };
}

/* ------------------------------------------------------------------ */
/* Input                                                               */
/* ------------------------------------------------------------------ */

export interface InputClassNames {
  /** the bordered affix wrapper */
  wrapper?: string;
  input?: string;
  prefix?: string;
  suffix?: string;
  count?: string;
  addonBefore?: string;
  addonAfter?: string;
}

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size" | "prefix" | "value" | "defaultValue" | "onChange"> {
  size?: InputSize;
  variant?: InputVariant;
  status?: InputStatus;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  /** Show a clear icon when the input has a value */
  allowClear?: boolean | { clearIcon?: React.ReactNode };
  /** Show a character counter in the suffix */
  showCount?: ShowCount;
  count?: InputCountConfig;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPressEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  classNames?: InputClassNames;
}

function InputBase({
  className,
  classNames,
  size = "md",
  variant = "outlined",
  status,
  prefix,
  suffix,
  addonBefore,
  addonAfter,
  allowClear,
  showCount,
  count,
  maxLength,
  value,
  defaultValue,
  onChange,
  onPressEnter,
  onClear,
  onKeyDown,
  disabled,
  readOnly,
  ref,
  style,
  ...props
}: InputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
  const [val, setVal] = useControlled(value, defaultValue ?? "");
  const counter = useCount(showCount, count, maxLength);
  const outOfRange = counter.exceed(val);
  const hasAddon = addonBefore != null || addonAfter != null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = counter.clamp(e.target.value);
    if (next !== e.target.value) e.target.value = next;
    setVal(next);
    onChange?.(e);
  };

  const clearNode = allowClear && !disabled && !readOnly && val !== "" && (
    <span
      role="button"
      tabIndex={-1}
      aria-label="clear"
      data-slot="input-clear"
      className="inline-flex cursor-pointer items-center [&_svg]:size-3.5 [&_svg]:text-text-quaternary [&_svg]:hover:text-text-tertiary"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => {
        if (inputRef.current) triggerNativeChange(inputRef.current, "");
        onClear?.();
        inputRef.current?.focus();
      }}
    >
      {typeof allowClear === "object" && allowClear.clearIcon ? allowClear.clearIcon : <ClearIcon />}
    </span>
  );

  const countNode = counter.show && (
    <span data-slot="input-count" className={cn("text-text-description whitespace-nowrap", outOfRange && "text-error", classNames?.count)}>
      {counter.format(val)}
    </span>
  );

  const wrapper = (
    <span
      data-slot="input"
      data-status={status}
      data-disabled={disabled || undefined}
      data-variant={variant}
      style={hasAddon ? undefined : style}
      className={cn(
        inputWrapperVariants({ variant, size, status: status ?? "default", disabled: !!disabled }),
        inputHeight[size],
        outOfRange && "text-error",
        hasAddon && addonBefore != null && "rounded-l-none",
        hasAddon && addonAfter != null && "rounded-r-none",
        hasAddon && "focus-within:z-10",
        hasAddon ? classNames?.wrapper : cn(className, classNames?.wrapper),
      )}
      onMouseDown={(e) => {
        if (e.target !== inputRef.current && !disabled) {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }}
    >
      {prefix != null && (
        <span data-slot="input-prefix" className={cn("flex items-center [&_svg]:size-4", classNames?.prefix)}>
          {prefix}
        </span>
      )}
      <input
        ref={inputRef}
        data-slot="input-inner"
        className={cn("h-full w-full", classNames?.input)}
        value={val}
        maxLength={count?.max === undefined ? maxLength : undefined}
        disabled={disabled}
        readOnly={readOnly}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") onPressEnter?.(e);
          onKeyDown?.(e);
        }}
        {...props}
      />
      {(clearNode || countNode || suffix != null) && (
        <span data-slot="input-suffix" className={cn("flex items-center gap-1 [&_svg]:size-4", classNames?.suffix)}>
          {clearNode}
          {countNode}
          {suffix}
        </span>
      )}
    </span>
  );

  if (!hasAddon) return wrapper;

  return (
    <span data-slot="input-group" style={style} className={cn("inline-flex w-full items-stretch", className)}>
      {addonBefore != null && (
        <span data-slot="input-addon" className={cn(inputAddonVariants({ size, side: "before" }), classNames?.addonBefore)}>
          {addonBefore}
        </span>
      )}
      {wrapper}
      {addonAfter != null && (
        <span data-slot="input-addon" className={cn(inputAddonVariants({ size, side: "after" }), classNames?.addonAfter)}>
          {addonAfter}
        </span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* TextArea                                                            */
/* ------------------------------------------------------------------ */

export type AutoSize = boolean | { minRows?: number; maxRows?: number };

export interface InputTextAreaProps
  extends Omit<React.ComponentProps<"textarea">, "value" | "defaultValue" | "onChange"> {
  size?: InputSize;
  variant?: InputVariant;
  status?: InputStatus;
  /** Grow with content; `{ minRows, maxRows }` to clamp */
  autoSize?: AutoSize;
  allowClear?: boolean | { clearIcon?: React.ReactNode };
  showCount?: ShowCount;
  count?: InputCountConfig;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onPressEnter?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onClear?: () => void;
  onResize?: (size: { width: number; height: number }) => void;
  classNames?: Pick<InputClassNames, "wrapper" | "input" | "count">;
}

function InputTextArea({
  className,
  classNames,
  size = "md",
  variant = "outlined",
  status,
  autoSize,
  allowClear,
  showCount,
  count,
  maxLength,
  value,
  defaultValue,
  onChange,
  onPressEnter,
  onClear,
  onKeyDown,
  onResize,
  disabled,
  readOnly,
  rows,
  ref,
  style,
  ...props
}: InputTextAreaProps) {
  const areaRef = React.useRef<HTMLTextAreaElement>(null);
  React.useImperativeHandle(ref, () => areaRef.current as HTMLTextAreaElement);
  const [val, setVal] = useControlled(value, defaultValue ?? "");
  const counter = useCount(showCount, count, maxLength);
  const outOfRange = counter.exceed(val);

  const minRows = typeof autoSize === "object" ? autoSize.minRows : undefined;
  const maxRows = typeof autoSize === "object" ? autoSize.maxRows : undefined;

  React.useLayoutEffect(() => {
    const el = areaRef.current;
    if (!el || !autoSize) return;
    const cs = getComputedStyle(el);
    const lineHeight = parseFloat(cs.lineHeight) || 22;
    const padding = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const border = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
    el.style.height = "auto";
    const content = el.scrollHeight + border;
    const min = minRows ? minRows * lineHeight + padding + border : 0;
    const max = maxRows ? maxRows * lineHeight + padding + border : Infinity;
    const next = Math.min(Math.max(content, min), max);
    el.style.height = `${next}px`;
    el.style.overflowY = content > max ? "auto" : "hidden";
  }, [val, autoSize, minRows, maxRows]);

  React.useEffect(() => {
    const el = areaRef.current;
    if (!el || !onResize) return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry) onResize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [onResize]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = counter.clamp(e.target.value);
    if (next !== e.target.value) e.target.value = next;
    setVal(next);
    onChange?.(e);
  };

  const showClear = allowClear && !disabled && !readOnly && val !== "";

  return (
    <span
      data-slot="input-textarea"
      data-status={status}
      data-disabled={disabled || undefined}
      style={style}
      className={cn(
        inputWrapperVariants({ variant, size, status: status ?? "default", disabled: !!disabled }),
        "items-stretch p-0",
        outOfRange && "text-error",
        counter.show && "mb-[22px]",
        className,
        classNames?.wrapper,
      )}
    >
      <textarea
        ref={areaRef}
        data-slot="input-inner"
        rows={rows ?? (autoSize ? (minRows ?? 1) : 2)}
        className={cn(
          "block min-h-[inherit] w-full resize-y py-1 leading-[1.5714] text-inherit",
          size === "sm" ? "px-[7px]" : "px-[11px]",
          autoSize && "resize-none",
          showClear && "pr-6",
          disabled && "text-text-disabled",
          classNames?.input,
        )}
        value={val}
        maxLength={count?.max === undefined ? maxLength : undefined}
        disabled={disabled}
        readOnly={readOnly}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") onPressEnter?.(e);
          onKeyDown?.(e);
        }}
        {...props}
      />
      {showClear && (
        <span
          role="button"
          tabIndex={-1}
          aria-label="clear"
          data-slot="input-clear"
          className="absolute top-2 right-2 inline-flex cursor-pointer items-center [&_svg]:size-3.5 [&_svg]:text-text-quaternary"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            if (areaRef.current) triggerNativeChange(areaRef.current, "");
            onClear?.();
            areaRef.current?.focus();
          }}
        >
          {typeof allowClear === "object" && allowClear.clearIcon ? allowClear.clearIcon : <ClearIcon />}
        </span>
      )}
      {counter.show && (
        <span
          data-slot="input-count"
          className={cn("absolute right-0 -bottom-[22px] text-sm text-text-description", outOfRange && "text-error", classNames?.count)}
        >
          {counter.format(val)}
        </span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Search                                                              */
/* ------------------------------------------------------------------ */

export interface InputSearchProps extends Omit<InputProps, "onKeyDown"> {
  /** `true` → primary icon button; string/node → primary button with that content; a `<Button>` element is used as-is */
  enterButton?: React.ReactNode;
  loading?: boolean;
  onSearch?: (
    value: string,
    event?: React.SyntheticEvent<HTMLElement>,
    info?: { source: "clear" | "input" },
  ) => void;
}

function InputSearch({
  enterButton,
  loading = false,
  onSearch,
  onPressEnter,
  onClear,
  size = "md",
  disabled,
  suffix,
  classNames,
  ...props
}: InputSearchProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const search = (e?: React.SyntheticEvent<HTMLElement>) => onSearch?.(inputRef.current?.value ?? "", e, { source: "input" });

  let button: React.ReactNode = null;
  if (enterButton) {
    const shared: ButtonProps = {
      size,
      disabled,
      loading,
      className: "rounded-l-none",
      onMouseDown: (e) => e.preventDefault(),
      onClick: (e) => search(e),
    };
    if (React.isValidElement<ButtonProps>(enterButton) && enterButton.type === Button) {
      button = React.cloneElement(enterButton, {
        ...shared,
        className: cn(shared.className, enterButton.props.className),
        onClick: (e) => {
          enterButton.props.onClick?.(e);
          search(e);
        },
      });
    } else if (enterButton === true) {
      button = <Button type="primary" icon={<Search />} {...shared} />;
    } else {
      button = (
        <Button type="primary" {...shared}>
          {enterButton}
        </Button>
      );
    }
  }

  const iconSuffix = !enterButton && (
    <span
      role="button"
      aria-label="search"
      className={cn("inline-flex cursor-pointer items-center text-text-tertiary transition-colors hover:text-text", disabled && "pointer-events-none")}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => search(e)}
    >
      {loading ? <Loader2 className="animate-spin" /> : <Search />}
    </span>
  );

  return (
    <InputBase
      ref={inputRef}
      data-slot="input-search"
      size={size}
      disabled={disabled}
      suffix={
        suffix != null || iconSuffix ? (
          <>
            {suffix}
            {iconSuffix}
          </>
        ) : undefined
      }
      addonAfter={button}
      classNames={{ ...classNames, addonAfter: cn("border-0 bg-transparent p-0 [&>[data-slot=button]]:-ml-px [&>[data-slot=button]]:relative [&>[data-slot=button]:hover]:z-20", classNames?.addonAfter) }}
      onPressEnter={(e) => {
        onPressEnter?.(e);
        search(e);
      }}
      onClear={() => {
        onClear?.();
        onSearch?.("", undefined, { source: "clear" });
      }}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Password                                                            */
/* ------------------------------------------------------------------ */

export interface InputPasswordProps extends Omit<InputProps, "type"> {
  visibilityToggle?: boolean | { visible?: boolean; onVisibleChange?: (visible: boolean) => void };
  iconRender?: (visible: boolean) => React.ReactNode;
}

function InputPassword({ visibilityToggle = true, iconRender, suffix, disabled, ...props }: InputPasswordProps) {
  const toggle = typeof visibilityToggle === "object" ? visibilityToggle : undefined;
  const [visible, setVisible] = useControlled(toggle?.visible, false);
  const canToggle = visibilityToggle !== false;

  const icon = iconRender ? iconRender(visible) : visible ? <Eye /> : <EyeOff />;

  return (
    <InputBase
      data-slot="input-password"
      type={visible ? "text" : "password"}
      disabled={disabled}
      suffix={
        <>
          {suffix}
          {canToggle && (
            <span
              role="button"
              tabIndex={-1}
              aria-label={visible ? "hide password" : "show password"}
              className={cn("inline-flex cursor-pointer items-center text-text-tertiary transition-colors hover:text-text-secondary", disabled && "pointer-events-none")}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                const next = !visible;
                setVisible(next);
                toggle?.onVisibleChange?.(next);
              }}
            >
              {icon}
            </span>
          )}
        </>
      }
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/* OTP                                                                 */
/* ------------------------------------------------------------------ */

export interface InputOTPProps {
  length?: number;
  value?: string;
  defaultValue?: string;
  /** Called only when every cell is filled */
  onChange?: (value: string) => void;
  /** Called on every keystroke with the per-cell values */
  onInput?: (value: string[]) => void;
  /** Transform typed characters, e.g. `(v) => v.toUpperCase()` */
  formatter?: (value: string) => string;
  /** Hide characters: `true` for dots, or a replacement character */
  mask?: boolean | string;
  separator?: React.ReactNode | ((index: number) => React.ReactNode);
  size?: InputSize;
  status?: InputStatus;
  variant?: InputVariant;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  type?: "text" | "password";
  name?: string;
  className?: string;
  id?: string;
}

const otpCellVariants = cva(
  [
    "relative shrink-0 text-center text-text outline-none",
    "transition-[border-color,background-color,box-shadow] duration-mid ease-kk-in-out",
    "disabled:cursor-not-allowed disabled:text-text-disabled",
  ],
  {
    variants: {
      variant: {
        outlined: "border border-border bg-bg-container hover:border-primary-hover focus:border-primary focus:ring-[3px] focus:ring-primary/10 disabled:border-border disabled:bg-bg-container-disabled disabled:hover:border-border",
        filled: "border border-transparent bg-fill-tertiary hover:bg-fill-secondary focus:border-primary focus:bg-bg-container disabled:bg-bg-container-disabled",
        borderless: "border border-transparent bg-transparent",
        underlined: "rounded-none! border-b border-border bg-transparent hover:border-primary-hover focus:border-primary",
      },
      size: {
        sm: "size-control-sm rounded-sm text-sm",
        md: "size-control rounded-md text-sm",
        lg: "size-control-lg rounded-lg text-base",
      },
      status: { default: "", error: "", warning: "" },
    },
    compoundVariants: [
      { variant: ["outlined", "underlined"], status: "error", className: "border-error hover:border-error-hover focus:border-error focus:ring-error/10" },
      { variant: ["outlined", "underlined"], status: "warning", className: "border-warning hover:border-warning-hover focus:border-warning focus:ring-warning/10" },
      { variant: "filled", status: "error", className: "bg-error-bg text-error hover:bg-error-bg-hover" },
      { variant: "filled", status: "warning", className: "bg-warning-bg text-warning hover:bg-warning-bg-hover" },
    ],
    defaultVariants: { variant: "outlined", size: "md", status: "default" },
  },
);

function InputOTP({
  length = 6,
  value,
  defaultValue,
  onChange,
  onInput,
  formatter,
  mask,
  separator,
  size = "md",
  status,
  variant = "outlined",
  disabled,
  readOnly,
  autoFocus,
  type = "text",
  name,
  className,
  id,
}: InputOTPProps) {
  const [val, setVal] = useControlled(value, defaultValue ?? "");
  const lastComplete = React.useRef(val.length === length ? val : "");
  const maskChar = typeof mask === "string" ? mask : undefined;

  const handleValueChange = (raw: string) => {
    const next = raw.slice(0, length);
    setVal(next);
    const cells = Array.from({ length }, (_, i) => next[i] ?? "");
    onInput?.(cells);
    if (next.length === length && next !== lastComplete.current) {
      lastComplete.current = next;
      onChange?.(next);
    } else if (next.length < length) {
      lastComplete.current = "";
    }
  };

  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleCellChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const rawChar = e.target.value.slice(-1);
    const char = formatter ? formatter(rawChar) : rawChar;
    const chars = val.split("");
    chars[index] = char;
    const next = chars.join("").slice(0, length);
    handleValueChange(next);
    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !val[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div
      id={id}
      data-slot="input-otp"
      data-status={status}
      className={cn("inline-flex items-center gap-2", className)}
    >
      {Array.from({ length }, (_, i) => (
        <React.Fragment key={i}>
          {i > 0 && separator != null && (
            <span className="text-text-tertiary select-none">{typeof separator === "function" ? separator(i - 1) : separator}</span>
          )}
          <span className="relative inline-flex">
            <input
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type={mask === true ? "password" : type}
              value={val[i] ?? ""}
              disabled={disabled}
              readOnly={readOnly}
              autoFocus={i === 0 && autoFocus}
              onChange={(e) => handleCellChange(i, e)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={cn(
                otpCellVariants({ variant, size, status: status ?? "default" }),
                "text-center outline-none transition-colors",
                maskChar && "text-transparent caret-text",
              )}
            />
            {maskChar && val[i] && (
              <span aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center text-text">
                {maskChar}
              </span>
            )}
          </span>
        </React.Fragment>
      ))}
      {name && <input type="hidden" name={name} value={val} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Group                                                               */
/* ------------------------------------------------------------------ */

export interface InputGroupProps extends React.ComponentProps<"div"> {
  /** Attach children (remove inner radius, collapse borders) — KKUI `Space.Compact` */
  compact?: boolean;
  size?: InputSize;
}

function InputGroup({ className, compact = false, size, children, ...props }: InputGroupProps) {
  return (
    <div
      role="group"
      data-slot="input-group"
      data-size={size}
      className={cn(
        "flex w-full items-stretch",
        compact
          ? "[&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none! [&>*:not(:last-child)]:rounded-r-none! [&>*:hover]:z-10 [&>*:focus-within]:z-10"
          : "gap-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

const Input = Object.assign(InputBase, {
  TextArea: InputTextArea,
  Search: InputSearch,
  Password: InputPassword,
  OTP: InputOTP,
  Group: InputGroup,
});

export { Input, InputTextArea, InputSearch, InputPassword, InputOTP, InputGroup };
