import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  inputAddonVariants,
  inputHeight,
  inputWrapperVariants,
  useControlled,
  type InputSize,
  type InputStatus,
  type InputVariant,
} from "@/components/ui/input";

/**
 * InputNumber — KKUI numeric input: min/max/step/precision, formatter/parser,
 * hover-revealed step controls (with press-and-hold), keyboard arrows, optional wheel,
 * prefix/suffix/addons. Value is `number | null` (empty = null).
 */

export interface InputNumberFormatterInfo {
  /** true while the user is typing (formatter is called with the raw text) */
  userTyping: boolean;
  /** raw text currently in the box */
  input: string;
}

export interface InputNumberProps
  extends Omit<
    React.ComponentProps<"input">,
    "size" | "prefix" | "value" | "defaultValue" | "onChange" | "min" | "max" | "step" | "type"
  > {
  value?: number | null;
  defaultValue?: number | null;
  min?: number;
  max?: number;
  step?: number;
  /** Fixed number of decimals; defaults to the precision of `step` / typed value */
  precision?: number;
  /** Format the displayed text, e.g. thousands separators */
  formatter?: (value: string, info: InputNumberFormatterInfo) => string;
  /** Turn displayed text back into a number string (inverse of `formatter`) */
  parser?: (displayValue: string) => string;
  /** Show step controls (default) or provide custom icons; `false` hides them */
  controls?: boolean | { upIcon?: React.ReactNode; downIcon?: React.ReactNode };
  /** ArrowUp / ArrowDown step the value */
  keyboard?: boolean;
  /** Mouse wheel steps the value while focused */
  changeOnWheel?: boolean;
  /** Commit the typed value on blur (otherwise only Enter / step commit) */
  changeOnBlur?: boolean;
  decimalSeparator?: string;
  size?: InputSize;
  variant?: InputVariant;
  status?: InputStatus;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  onChange?: (value: number | null) => void;
  onStep?: (value: number, info: { offset: number; type: "up" | "down" }) => void;
  onPressEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  classNames?: { wrapper?: string; input?: string; prefix?: string; suffix?: string; controls?: string; addonBefore?: string; addonAfter?: string };
}

const decimalsOf = (n: number) => {
  const s = String(n);
  const i = s.indexOf(".");
  return i === -1 ? 0 : s.length - i - 1;
};

/** Sum with the precision of both operands so 0.1 + 0.2 stays 0.3. */
const addPrecise = (a: number, b: number) => {
  const d = Math.max(decimalsOf(a), decimalsOf(b));
  return Number((a + b).toFixed(d));
};

function InputNumber({
  className,
  classNames,
  value,
  defaultValue = null,
  min,
  max,
  step = 1,
  precision,
  formatter,
  parser,
  controls = true,
  keyboard = true,
  changeOnWheel = false,
  changeOnBlur = true,
  decimalSeparator = ".",
  size = "md",
  variant = "outlined",
  status,
  prefix,
  suffix,
  addonBefore,
  addonAfter,
  onChange,
  onStep,
  onPressEnter,
  onKeyDown,
  onFocus,
  onBlur,
  disabled,
  readOnly,
  ref,
  style,
  ...props
}: InputNumberProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
  const [val, setVal] = useControlled<number | null>(value, defaultValue);
  const [focused, setFocused] = React.useState(false);
  const [text, setText] = React.useState<string | null>(null); // raw text while typing
  const hasAddon = addonBefore != null || addonAfter != null;
  const valRef = React.useRef(val); // latest value for the press-and-hold timer
  valRef.current = val;

  const toString = React.useCallback(
    (n: number | null) => {
      if (n === null || Number.isNaN(n)) return "";
      const s = precision !== undefined ? n.toFixed(precision) : String(n);
      return decimalSeparator === "." ? s : s.replace(".", decimalSeparator);
    },
    [precision, decimalSeparator],
  );

  const parse = React.useCallback(
    (display: string): number | null => {
      let s = parser ? parser(display) : display;
      if (decimalSeparator !== ".") s = s.split(decimalSeparator).join(".");
      s = s.trim();
      if (s === "" || s === "-") return null;
      const n = Number(s);
      return Number.isNaN(n) ? NaN : n;
    },
    [parser, decimalSeparator],
  );

  const clamp = (n: number) => {
    let r = n;
    if (min !== undefined && r < min) r = min;
    if (max !== undefined && r > max) r = max;
    if (precision !== undefined) r = Number(r.toFixed(precision));
    return r;
  };

  const commit = (next: number | null) => {
    if (next !== valRef.current) {
      valRef.current = next;
      setVal(next);
      onChange?.(next);
    }
  };

  const displayText = text ?? (formatter ? formatter(toString(val), { userTyping: false, input: toString(val) }) : toString(val));
  const current = text !== null ? parse(text) : val;
  const outOfRange =
    current !== null && !Number.isNaN(current) && ((min !== undefined && current < min) || (max !== undefined && current > max));

  const doStep = (up: boolean) => {
    if (disabled || readOnly) return;
    const offset = up ? step : -step;
    const base = valRef.current ?? (text !== null ? parse(text) : null);
    const from = base === null || Number.isNaN(base) ? 0 : base;
    const next = clamp(addPrecise(from, offset));
    setText(null);
    commit(next);
    onStep?.(next, { offset: step, type: up ? "up" : "down" });
  };

  const commitText = () => {
    if (text === null) return;
    const parsed = parse(text);
    setText(null);
    if (parsed !== null && Number.isNaN(parsed)) return; // invalid → revert
    commit(parsed === null ? null : clamp(parsed));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const parsedStr = parser ? parser(raw) : raw;
    setText(formatter ? formatter(parsedStr, { userTyping: true, input: raw }) : raw);
    const parsed = parse(raw);
    // live commit for valid in-range numbers so controlled parents update while typing
    if (parsed === null) commit(null);
    else if (!Number.isNaN(parsed) && !(precision !== undefined && decimalsOf(parsed) > precision)) commit(parsed);
  };

  // press-and-hold repeat for the step buttons
  const holdTimer = React.useRef<number | null>(null);
  const stopHold = () => {
    if (holdTimer.current !== null) window.clearTimeout(holdTimer.current);
    holdTimer.current = null;
  };
  const startHold = (up: boolean) => {
    doStep(up);
    const repeat = (delay: number) => {
      holdTimer.current = window.setTimeout(() => {
        doStep(up);
        repeat(80);
      }, delay);
    };
    repeat(500);
  };
  React.useEffect(() => stopHold, []);

  const upDisabled = disabled || readOnly || (max !== undefined && val !== null && val >= max);
  const downDisabled = disabled || readOnly || (min !== undefined && val !== null && val <= min);
  const icons = typeof controls === "object" ? controls : {};

  const controlBtn = (up: boolean) => {
    const dis = up ? upDisabled : downDisabled;
    return (
      <span
        role="button"
        aria-label={up ? "Increase Value" : "Decrease Value"}
        aria-disabled={dis || undefined}
        data-slot={up ? "input-number-up" : "input-number-down"}
        className={cn(
          "flex flex-1 items-center justify-center text-text-description transition-colors duration-mid",
          up && "border-b border-border",
          dis ? "cursor-not-allowed text-text-disabled" : "cursor-pointer hover:h-[60%] hover:text-primary",
          "[&_svg]:size-[7px] [&_svg]:stroke-[3]",
        )}
        onMouseDown={(e) => {
          e.preventDefault();
          if (dis) return;
          inputRef.current?.focus();
          startHold(up);
        }}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
      >
        {up ? (icons.upIcon ?? <ChevronUp />) : (icons.downIcon ?? <ChevronDown />)}
      </span>
    );
  };

  const wrapper = (
    <span
      data-slot="input-number"
      data-status={status}
      data-disabled={disabled || undefined}
      data-out-of-range={outOfRange || undefined}
      style={hasAddon ? undefined : style}
      className={cn(
        inputWrapperVariants({ variant, size, status: status ?? "default", disabled: !!disabled }),
        inputHeight[size],
        "group/number pr-0",
        controls === false && (size === "sm" ? "pr-[7px]" : "pr-[11px]"),
        outOfRange && "text-error",
        hasAddon && addonBefore != null && "rounded-l-none",
        hasAddon && addonAfter != null && "rounded-r-none",
        hasAddon && "focus-within:z-10",
        hasAddon ? classNames?.wrapper : cn(className, classNames?.wrapper),
      )}
      onMouseDown={(e) => {
        if (e.target !== inputRef.current && !disabled && !(e.target as HTMLElement).closest("[role=button]")) {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }}
    >
      {prefix != null && (
        <span data-slot="input-number-prefix" className={cn("flex items-center [&_svg]:size-4", classNames?.prefix)}>
          {prefix}
        </span>
      )}
      <input
        ref={inputRef}
        data-slot="input-number-inner"
        type="text"
        inputMode="decimal"
        autoComplete="off"
        role="spinbutton"
        aria-valuenow={val ?? undefined}
        aria-valuemin={min}
        aria-valuemax={max}
        className={cn("h-full w-full", classNames?.input)}
        value={displayText}
        disabled={disabled}
        readOnly={readOnly}
        onChange={handleChange}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          if (changeOnBlur) commitText();
          else setText(null);
          onBlur?.(e);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            commitText();
            onPressEnter?.(e);
          } else if (keyboard && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
            e.preventDefault();
            doStep(e.key === "ArrowUp");
          }
          onKeyDown?.(e);
        }}
        onWheel={(e) => {
          if (!changeOnWheel || !focused) return;
          e.preventDefault();
          doStep(e.deltaY < 0);
        }}
        {...props}
      />
      {suffix != null && (
        <span
          data-slot="input-number-suffix"
          className={cn("flex items-center [&_svg]:size-4", controls !== false && "mr-[11px]", classNames?.suffix)}
        >
          {suffix}
        </span>
      )}
      {controls !== false && !readOnly && (
        <span
          data-slot="input-number-controls"
          aria-hidden
          className={cn(
            "flex h-full w-[22px] shrink-0 flex-col self-stretch border-l border-border bg-bg-container opacity-0 transition-opacity duration-mid select-none group-hover/number:opacity-100",
            size === "sm" ? "rounded-r-sm" : size === "lg" ? "rounded-r-lg" : "rounded-r-md",
            variant === "filled" && "bg-transparent",
            disabled && "hidden",
            classNames?.controls,
          )}
        >
          {controlBtn(true)}
          {controlBtn(false)}
        </span>
      )}
    </span>
  );

  if (!hasAddon) return wrapper;

  return (
    <span data-slot="input-number-group" style={style} className={cn("inline-flex w-full items-stretch", className)}>
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

export { InputNumber };
