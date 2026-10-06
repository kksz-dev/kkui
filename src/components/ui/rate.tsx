import * as React from "react";
import { Star } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface RateProps
  extends Omit<React.ComponentProps<"ul">, "onChange" | "defaultValue" | "value"> {
  count?: number;
  value?: number;
  defaultValue?: number;
  allowHalf?: boolean;
  allowClear?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  character?:
    | React.ReactNode
    | ((props: { index: number; value: number }) => React.ReactNode);
  tooltips?: string[];
  onChange?: (value: number) => void;
  onHoverChange?: (value: number) => void;
}

function RateItem({
  index,
  value,
  hoverValue,
  allowHalf,
  disabled,
  character,
  tooltip,
  onItemHover,
  onItemClick,
}: {
  index: number;
  value: number;
  hoverValue: number | undefined;
  allowHalf: boolean;
  disabled: boolean;
  character:
    | React.ReactNode
    | ((props: { index: number; value: number }) => React.ReactNode);
  tooltip?: string;
  onItemHover: (hoverVal: number) => void;
  onItemClick: (val: number) => void;
}) {
  const displayVal = hoverValue !== undefined ? hoverValue : value;
  const isFull = displayVal >= index + 1;
  const isHalf = allowHalf && !isFull && displayVal >= index + 0.5;

  const charNode =
    typeof character === "function"
      ? character({ index, value: displayVal })
      : character;

  const itemContent = (
    <div
      className={cn(
        "relative inline-flex items-center justify-center transition-transform duration-mid",
        !disabled && "cursor-pointer hover:scale-110",
      )}
    >
      {/* Left half (when allowHalf) */}
      {allowHalf && (
        <div
          className={cn(
            "absolute top-0 left-0 h-full w-1/2 overflow-hidden transition-colors duration-mid z-[1]",
            isFull || isHalf ? "text-gold" : "text-fill-content",
          )}
          onMouseEnter={!disabled ? (e) => {
            e.stopPropagation();
            onItemHover(index + 0.5);
          } : undefined}
          onClick={!disabled ? (e) => {
            e.stopPropagation();
            onItemClick(index + 0.5);
          } : undefined}
        >
          <div className="w-[200%]">{charNode}</div>
        </div>
      )}

      {/* Whole / Right half */}
      <div
        className={cn(
          "transition-colors duration-mid",
          isFull ? "text-gold" : "text-fill-content",
        )}
        onMouseEnter={!disabled ? () => onItemHover(index + 1) : undefined}
        onClick={!disabled ? () => onItemClick(index + 1) : undefined}
      >
        {charNode}
      </div>
    </div>
  );

  if (tooltip) {
    return (
      <li data-slot="rate-star" className="list-none inline-block">
        <Tooltip title={tooltip}>{itemContent}</Tooltip>
      </li>
    );
  }

  return (
    <li data-slot="rate-star" className="list-none inline-block">
      {itemContent}
    </li>
  );
}

function Rate({
  count = 5,
  value,
  defaultValue = 0,
  allowHalf = false,
  allowClear = true,
  disabled = false,
  autoFocus = false,
  character = <Star className="size-5 fill-current stroke-none" />,
  tooltips,
  className,
  onChange,
  onHoverChange,
  onKeyDown,
  onBlur,
  onFocus,
  ...props
}: RateProps) {
  const [innerValue, setInnerValue] = React.useState<number>(defaultValue);
  const [hoverValue, setHoverValue] = React.useState<number | undefined>(undefined);
  const rootRef = React.useRef<HTMLUListElement>(null);

  const currentValue = value !== undefined ? value : innerValue;

  React.useEffect(() => {
    if (autoFocus && rootRef.current) {
      rootRef.current.focus();
    }
  }, [autoFocus]);

  const handleHover = (val: number) => {
    setHoverValue(val);
    onHoverChange?.(val);
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setHoverValue(undefined);
      onHoverChange?.(0);
    }
  };

  const handleClick = (val: number) => {
    let nextValue = val;
    if (allowClear && val === currentValue) {
      nextValue = 0;
    }
    if (value === undefined) {
      setInnerValue(nextValue);
    }
    onChange?.(nextValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (disabled) {
      onKeyDown?.(e);
      return;
    }

    const step = allowHalf ? 0.5 : 1;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(count, currentValue + step);
      if (value === undefined) setInnerValue(next);
      onChange?.(next);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(allowClear ? 0 : step, currentValue - step);
      if (value === undefined) setInnerValue(next);
      onChange?.(next);
    }
    onKeyDown?.(e);
  };

  return (
    <ul
      ref={rootRef}
      role="radiogroup"
      data-slot="rate"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      onMouseLeave={handleMouseLeave}
      onBlur={onBlur}
      onFocus={onFocus}
      className={cn(
        "inline-flex items-center gap-1.5 p-0 m-0 outline-none select-none",
        !disabled && "focus-visible:ring-[3px] focus-visible:ring-primary/30 rounded",
        disabled && "cursor-default",
        className,
      )}
      {...props}
    >
      {Array.from({ length: count }, (_, i) => (
        <RateItem
          key={i}
          index={i}
          value={currentValue}
          hoverValue={hoverValue}
          allowHalf={allowHalf}
          disabled={disabled}
          character={character}
          tooltip={tooltips?.[i]}
          onItemHover={handleHover}
          onItemClick={handleClick}
        />
      ))}
    </ul>
  );
}

export { Rate };
