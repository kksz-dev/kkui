import * as React from "react";
import { cn } from "@/lib/utils";
import { useWave } from "@/hooks/use-wave";
import { useComponentDisabled, useComponentSize, type ComponentSize } from "@/components/ui/config-provider";

export type RadioValueType = string | number;

export interface RadioChangeEvent {
  target: { checked: boolean; value: RadioValueType | undefined; name?: string };
  nativeEvent?: Event;
}

export type RadioOptionType = {
  label: React.ReactNode;
  value: RadioValueType;
  disabled?: boolean;
  /** Native `title` tooltip on the option. */
  title?: string;
  /** Render this single option as a button (or a plain radio) regardless of the group `optionType`. */
  optionType?: "default" | "button";
  style?: React.CSSProperties;
  className?: string;
};

interface GroupContextValue {
  value: RadioValueType | undefined;
  disabled?: boolean;
  name?: string;
  size: ComponentSize;
  buttonStyle: "outline" | "solid";
  block: boolean;
  onChange: (val: RadioValueType, e: React.ChangeEvent<HTMLInputElement>) => void;
}
const GroupContext = React.createContext<GroupContextValue | null>(null);

export interface RadioProps
  extends Omit<React.ComponentProps<"label">, "onChange" | "defaultChecked" | "defaultValue"> {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  name?: string;
  value?: RadioValueType;
  /** Ignore the surrounding RadioGroup and behave as a standalone radio. */
  skipGroup?: boolean;
  onChange?: (e: RadioChangeEvent) => void;
  id?: string;
}

function Radio({
  className,
  checked,
  defaultChecked = false,
  disabled: disabledProp,
  autoFocus,
  name: nameProp,
  value,
  skipGroup = false,
  onChange,
  id,
  children,
  ...props
}: RadioProps) {
  const ctx = React.useContext(GroupContext);
  const group = skipGroup ? null : ctx;
  const wave = useWave<HTMLSpanElement>();
  const disabled = useComponentDisabled(disabledProp ?? group?.disabled);
  const name = nameProp ?? group?.name;
  const [inner, setInner] = React.useState(defaultChecked);

  const isChecked = group ? group.value === value : (checked ?? inner);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (group && value !== undefined) {
      group.onChange(value, e);
    } else if (checked === undefined) {
      setInner(true);
    }
    onChange?.({ target: { checked: true, value, name }, nativeEvent: e.nativeEvent });
  };

  return (
    <label
      data-slot="radio"
      data-checked={isChecked || undefined}
      className={cn(
        "relative inline-flex items-center gap-2 cursor-pointer select-none text-sm text-text",
        group?.block && "flex-1",
        disabled && "cursor-not-allowed text-text-disabled",
        className,
      )}
      {...props}
    >
      <input
        type="radio"
        className="peer sr-only"
        id={id}
        name={name}
        value={value ?? ""}
        checked={isChecked}
        disabled={disabled}
        autoFocus={autoFocus}
        onChange={handleChange}
      />
      <span
        aria-hidden
        onPointerDown={disabled ? undefined : wave.onPointerDown}
        style={{ "--kk-wave-color": "var(--kk-primary)" } as React.CSSProperties}
        className={cn(
          "kk-wave relative inline-flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-mid ease-kk-in-out",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/20",
          isChecked ? "border-primary bg-primary" : "border-border bg-bg-container",
          !disabled && !isChecked && "hover:border-primary",
          disabled && "cursor-not-allowed border-border bg-bg-container-disabled opacity-60",
        )}
      >
        {isChecked && <span className="size-1.5 rounded-full bg-white" />}
      </span>
      {children != null && <span>{children}</span>}
    </label>
  );
}

export interface RadioButtonProps
  extends Omit<React.ComponentProps<"label">, "onChange" | "defaultChecked" | "defaultValue"> {
  value?: RadioValueType;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  name?: string;
  /** Ignore the surrounding RadioGroup and behave as a standalone radio. */
  skipGroup?: boolean;
  onChange?: (e: RadioChangeEvent) => void;
  id?: string;
}

const buttonSizeClasses: Record<ComponentSize, string> = {
  sm: "h-control-sm px-2.5 text-xs",
  md: "h-control px-4 text-sm",
  lg: "h-control-lg px-5 text-base",
};

function RadioButton({
  className,
  children,
  checked,
  defaultChecked = false,
  disabled: disabledProp,
  autoFocus,
  name: nameProp,
  value,
  skipGroup = false,
  onChange,
  id,
  ...props
}: RadioButtonProps) {
  const ctx = React.useContext(GroupContext);
  const group = skipGroup ? null : ctx;
  const disabled = useComponentDisabled(disabledProp ?? group?.disabled);
  const name = nameProp ?? group?.name;
  const [inner, setInner] = React.useState(defaultChecked);

  const isChecked = group ? group.value === value : (checked ?? inner);
  const size = useComponentSize(group?.size);
  const solid = group?.buttonStyle === "solid";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (group && value !== undefined) {
      group.onChange(value, e);
    } else if (checked === undefined) {
      setInner(true);
    }
    onChange?.({ target: { checked: true, value, name }, nativeEvent: e.nativeEvent });
  };

  return (
    <label
      data-slot="radio-button"
      data-checked={isChecked || undefined}
      className={cn(
        "relative inline-flex cursor-pointer items-center justify-center border font-normal select-none",
        "transition-[color,background-color,border-color] duration-mid ease-kk-in-out",
        "first:rounded-l-md last:rounded-r-md -ml-px first:ml-0",
        "has-[:focus-visible]:z-20 has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-primary/30",
        buttonSizeClasses[size],
        group?.block && "flex-1",
        isChecked
          ? solid
            ? "z-10 border-primary bg-primary text-white"
            : "z-10 border-primary bg-bg-container text-primary"
          : "border-border bg-bg-container text-text",
        !disabled && !isChecked && "hover:text-primary hover:border-primary-hover",
        !disabled && isChecked && !solid && "hover:border-primary-hover hover:text-primary-hover",
        disabled && "cursor-not-allowed opacity-50 bg-bg-container-disabled text-text-disabled",
        disabled && isChecked && solid && "bg-primary/50 text-white",
        className,
      )}
      {...props}
    >
      <input
        type="radio"
        className="sr-only"
        id={id}
        name={name}
        value={value ?? ""}
        checked={isChecked}
        disabled={disabled}
        autoFocus={autoFocus}
        onChange={handleChange}
      />
      {children}
    </label>
  );
}

export interface RadioGroupProps
  extends Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> {
  defaultValue?: RadioValueType;
  value?: RadioValueType;
  onChange?: (e: RadioChangeEvent) => void;
  size?: ComponentSize;
  disabled?: boolean;
  name?: string;
  buttonStyle?: "outline" | "solid";
  optionType?: "default" | "button";
  block?: boolean;
  orientation?: "horizontal" | "vertical";
  options?: Array<RadioOptionType | string | number>;
  id?: string;
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
}

function RadioGroup({
  className,
  options,
  disabled,
  defaultValue,
  value,
  onChange,
  size,
  buttonStyle = "outline",
  optionType = "default",
  block = false,
  orientation = "horizontal",
  name,
  id,
  onFocus,
  onBlur,
  children,
  ...props
}: RadioGroupProps) {
  const [inner, setInner] = React.useState<RadioValueType | undefined>(defaultValue);
  const current = value !== undefined ? value : inner;
  const mergedSize = useComponentSize(size);
  const mergedDisabled = useComponentDisabled(disabled);

  const handleValChange = (val: RadioValueType, e: React.ChangeEvent<HTMLInputElement>) => {
    if (value === undefined) setInner(val);
    onChange?.({ target: { checked: true, value: val, name }, nativeEvent: e.nativeEvent });
  };

  const ctx: GroupContextValue = {
    value: current,
    disabled: mergedDisabled,
    name,
    size: mergedSize,
    buttonStyle,
    block,
    onChange: handleValChange,
  };

  const normalized = React.useMemo<RadioOptionType[] | null>(() => {
    if (!options) return null;
    return options.map((o) =>
      typeof o === "string" || typeof o === "number" ? { label: String(o), value: o } : o,
    );
  }, [options]);

  const isButton = optionType === "button";

  return (
    <GroupContext.Provider value={ctx}>
      <div
        data-slot="radio-group"
        id={id}
        onFocus={onFocus}
        onBlur={onBlur}
        className={cn(
          "inline-flex",
          isButton ? "flex-row" : orientation === "vertical" ? "flex-col gap-2" : "flex-row flex-wrap items-center gap-3",
          block && "flex w-full",
          className,
        )}
        {...props}
      >
        {normalized
          ? normalized.map((o) =>
              (o.optionType ?? optionType) === "button" ? (
                <RadioButton key={String(o.value)} value={o.value} disabled={o.disabled} title={o.title} style={o.style} className={o.className}>
                  {o.label}
                </RadioButton>
              ) : (
                <Radio key={String(o.value)} value={o.value} disabled={o.disabled} title={o.title} style={o.style} className={o.className}>
                  {o.label}
                </Radio>
              ),
            )
          : children}
      </div>
    </GroupContext.Provider>
  );
}

Radio.Group = RadioGroup;
Radio.Button = RadioButton;

export { Radio, RadioButton, RadioGroup };
