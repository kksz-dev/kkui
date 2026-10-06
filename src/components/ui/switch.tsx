import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWave } from "@/hooks/use-wave";

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "defaultValue" | "value"> {
  checked?: boolean;
  /** Alias of `checked`, so a Form can drive the switch with its generic value prop. */
  value?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean, event: React.MouseEvent<HTMLButtonElement>) => void;
  checkedChildren?: React.ReactNode;
  unCheckedChildren?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  size?: "default" | "small";
  className?: string;
  style?: React.CSSProperties;
}

export function Switch({
  checked: controlledChecked,
  value,
  defaultChecked = false,
  onChange,
  checkedChildren,
  unCheckedChildren,
  disabled = false,
  loading = false,
  size = "default",
  className,
  style,
  ...props
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const controlled = controlledChecked ?? value;
  const isControlled = controlled !== undefined;
  const isChecked = isControlled ? controlled : internalChecked;

  const wave = useWave<HTMLButtonElement>();
  const isDisabled = disabled || loading;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // caller's own onClick still runs; it used to overwrite this handler entirely
    props.onClick?.(e);
    if (isDisabled || e.defaultPrevented) return;
    const next = !isChecked;
    if (!isControlled) setInternalChecked(next);
    onChange?.(next, e);
  };

  const isSmall = size === "small";

  return (
    <button
      {...props}
      type="button"
      role="switch"
      aria-checked={isChecked}
      disabled={isDisabled}
      onClick={handleClick}
      onPointerDown={(e) => {
        props.onPointerDown?.(e);
        wave.onPointerDown(e);
      }}
      style={{
        "--kk-wave-color": "var(--kk-primary)",
        minWidth: isSmall ? "1.75rem" : "2.75rem",
        height: isSmall ? "1rem" : "1.375rem",
        ...style,
      } as React.CSSProperties}
      className={cn(
        "kk-wave relative inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors duration-mid ease-kk-in-out outline-none select-none px-0.5",
        "focus-visible:ring-2 focus-visible:ring-primary/20",
        isChecked ? "bg-primary" : "bg-fill-secondary hover:bg-fill",
        isDisabled && "cursor-not-allowed opacity-60 bg-bg-container-disabled",
        className,
      )}
    >
      {/* Knob rides above the label, so a long label cannot push it out of the track */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute flex items-center justify-center rounded-full bg-white shadow-xs transition-[left] duration-mid ease-kk-in-out",
        )}
        style={{
          width: isSmall ? "0.75rem" : "1.125rem",
          height: isSmall ? "0.75rem" : "1.125rem",
          left: isChecked ? `calc(100% - ${isSmall ? "0.875rem" : "1.25rem"})` : "0.125rem"
        }}
      >
        {loading && <Loader2 className={cn("animate-spin text-primary", isSmall ? "size-2" : "size-3")} />}
      </span>

      {(checkedChildren || unCheckedChildren) && (
        <span
          className={cn(
            "pointer-events-none block truncate text-[10px] font-medium leading-none text-white transition-[padding]",
          )}
          style={{
            paddingRight: isChecked ? (isSmall ? "0.875rem" : "1.25rem") : (isSmall ? "0.25rem" : "0.375rem"),
            paddingLeft: isChecked ? (isSmall ? "0.25rem" : "0.375rem") : (isSmall ? "0.875rem" : "1.25rem"),
          }}
        >
          {isChecked ? checkedChildren : unCheckedChildren}
        </span>
      )}
    </button>
  );
}
