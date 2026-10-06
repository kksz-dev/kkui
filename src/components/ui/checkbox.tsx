import * as React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWave } from "@/hooks/use-wave";
import { useComponentDisabled } from "@/components/ui/config-provider";

export type CheckboxValueType = string | number;

export interface CheckboxChangeEvent {
  target: { checked: boolean; name?: string; value?: CheckboxValueType };
  nativeEvent?: Event;
}

export interface CheckboxProps
  extends Omit<React.ComponentProps<"label">, "onChange" | "defaultChecked" | "defaultValue"> {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  name?: string;
  value?: CheckboxValueType;
  /** Ignore the surrounding CheckboxGroup and behave as a standalone checkbox. */
  skipGroup?: boolean;
  onChange?: (e: CheckboxChangeEvent) => void;
  id?: string;
}

interface GroupContextValue {
  value: CheckboxValueType[];
  disabled?: boolean;
  name?: string;
  /** At least one option must be checked for the surrounding form to submit. */
  required?: boolean;
  toggle: (v: CheckboxValueType, checked: boolean) => void;
}
const GroupContext = React.createContext<GroupContextValue | null>(null);

function Checkbox({
  className,
  checked,
  defaultChecked = false,
  indeterminate = false,
  disabled: disabledProp,
  autoFocus,
  name: nameProp,
  value,
  skipGroup = false,
  onChange,
  id,
  children,
  ...props
}: CheckboxProps) {
  const ctx = React.useContext(GroupContext);
  const group = skipGroup ? null : ctx;
  const wave = useWave<HTMLSpanElement>();
  const disabled = useComponentDisabled(disabledProp ?? group?.disabled);
  const name = nameProp ?? group?.name;
  const inGroup = group != null && value !== undefined;
  const controlled = inGroup ? group.value.includes(value) : checked;

  const [inner, setInner] = React.useState(defaultChecked);
  const isChecked = controlled ?? inner;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const nextChecked = !isChecked;
    if (controlled === undefined) setInner(nextChecked);
    if (inGroup) group.toggle(value, nextChecked);
    onChange?.({ target: { checked: nextChecked, name, value }, nativeEvent: e.nativeEvent });
  };

  return (
    <label
      data-slot="checkbox"
      data-checked={isChecked || undefined}
      className={cn(
        "relative inline-flex items-center gap-2 cursor-pointer select-none text-sm text-text",
        disabled && "cursor-not-allowed text-text-disabled",
        className,
      )}
      {...props}
    >
      <input
        type="checkbox"
        className="peer sr-only"
        id={id}
        name={name}
        value={value ?? ""}
        checked={isChecked}
        disabled={disabled}
        autoFocus={autoFocus}
        required={group?.required && group.value.length === 0}
        aria-checked={indeterminate ? "mixed" : isChecked}
        onChange={handleChange}
      />
      <span
        aria-hidden
        onPointerDown={disabled ? undefined : wave.onPointerDown}
        style={{ "--kk-wave-color": "var(--kk-primary)" } as React.CSSProperties}
        className={cn(
          "kk-wave relative inline-flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors duration-mid ease-kk-in-out",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/20",
          isChecked || indeterminate
            ? "border-primary bg-primary text-white"
            : "border-border bg-bg-container",
          !disabled && !isChecked && !indeterminate && "hover:border-primary",
          disabled && "cursor-not-allowed border-border bg-bg-container-disabled text-text-disabled opacity-60",
        )}
      >
        {indeterminate ? (
          <Minus className="size-3 stroke-[3]" />
        ) : isChecked ? (
          <Check className="size-3 stroke-[3]" />
        ) : null}
      </span>
      {children != null && <span>{children}</span>}
    </label>
  );
}

export interface CheckboxOptionType {
  label: React.ReactNode;
  value: CheckboxValueType;
  disabled?: boolean;
  /** Native `title` tooltip on the option. */
  title?: string;
  /** `id` of the option's native input (pair it with an external `<label htmlFor>`). */
  id?: string;
  style?: React.CSSProperties;
  className?: string;
}

export interface CheckboxGroupProps
  extends Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> {
  defaultValue?: CheckboxValueType[];
  value?: CheckboxValueType[];
  onChange?: (checkedValue: CheckboxValueType[]) => void;
  options?: Array<CheckboxOptionType | string | number>;
  disabled?: boolean;
  direction?: "horizontal" | "vertical";
  name?: string;
  /** Require at least one checked option before the surrounding form can submit. */
  required?: boolean;
}

function CheckboxGroup({
  className,
  options,
  disabled,
  direction = "horizontal",
  defaultValue = [],
  value,
  onChange,
  name,
  required,
  children,
  ...props
}: CheckboxGroupProps) {
  const [inner, setInner] = React.useState<CheckboxValueType[]>(defaultValue);
  const current = value ?? inner;
  const mergedDisabled = useComponentDisabled(disabled);

  const toggle = (val: CheckboxValueType, checked: boolean) => {
    if (checked === current.includes(val)) return;
    const next = checked ? [...current, val] : current.filter((v) => v !== val);
    if (value === undefined) setInner(next);
    onChange?.(next);
  };

  const content = options
    ? options.map((opt) => {
        const option: CheckboxOptionType =
          typeof opt === "string" || typeof opt === "number" ? { label: String(opt), value: opt } : opt;
        return (
          <Checkbox
            key={String(option.value)}
            value={option.value}
            disabled={option.disabled}
            id={option.id}
            title={option.title}
            style={option.style}
            className={option.className}
          >
            {option.label}
          </Checkbox>
        );
      })
    : children;

  return (
    <GroupContext.Provider
      value={{
        value: current,
        disabled: mergedDisabled,
        name,
        required,
        toggle,
      }}
    >
      <div
        data-slot="checkbox-group"
        className={cn(
          direction === "vertical" ? "flex flex-col gap-2" : "inline-flex flex-wrap gap-2",
          className,
        )}
        {...props}
      >
        {content}
      </div>
    </GroupContext.Provider>
  );
}

Checkbox.Group = CheckboxGroup;

export { Checkbox, CheckboxGroup };
