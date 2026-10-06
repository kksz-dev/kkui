import * as React from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/use-click-outside";

export interface SpeedDialAction {
  key: string;
  icon: React.ReactNode;
  title?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
}

export interface SpeedDialProps extends React.HTMLAttributes<HTMLDivElement> {
  actions: SpeedDialAction[];
  icon?: React.ReactNode;
  openIcon?: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  trigger?: "hover" | "click";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Keep the dial open after an action fires. */
  keepOpenOnAction?: boolean;
  "aria-label"?: string;
  className?: string;
}

const DIRECTION_CLASS = {
  // the rail overlaps the trigger's edge so the pointer never crosses a dead gap
  up: "flex-col-reverse bottom-full left-1/2 -translate-x-1/2 pb-3 flex-col",
  down: "flex-col top-full left-1/2 -translate-x-1/2 pt-3",
  left: "flex-row-reverse right-full top-1/2 -translate-y-1/2 pr-3",
  right: "flex-row left-full top-1/2 -translate-y-1/2 pl-3",
} as const;

const LABEL_SIDE = {
  up: "row",
  down: "row",
  left: "column",
  right: "column",
} as const;

export function SpeedDial({
  actions,
  icon,
  openIcon,
  direction = "up",
  trigger = "click",
  open: controlledOpen,
  onOpenChange,
  keepOpenOnAction = false,
  className,
  "aria-label": ariaLabel = "Quick actions",
  ...props
}: SpeedDialProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const ref = React.useRef<HTMLDivElement>(null);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  useClickOutside(ref, () => setOpen(false), open && trigger === "click");

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  React.useEffect(() => () => void (closeTimer.current && clearTimeout(closeTimer.current)), []);

  const hoverProps =
    trigger === "hover"
      ? {
          onMouseEnter: () => {
            if (closeTimer.current) clearTimeout(closeTimer.current);
            setOpen(true);
          },
          onMouseLeave: () => {
            // a short grace period keeps the dial usable while the pointer travels
            closeTimer.current = setTimeout(() => setOpen(false), 150);
          },
        }
      : {};

  const stacked = LABEL_SIDE[direction] === "column";

  return (
    <div
      ref={ref}
      data-slot="speed-dial"
      data-open={open || undefined}
      className={cn("group relative inline-flex items-center justify-center", className)}
      {...hoverProps}
      {...props}
    >
      {open && (
        <div
          role="menu"
          aria-label={ariaLabel}
          className={cn("absolute z-50 flex items-center gap-3", DIRECTION_CLASS[direction])}
        >
          {actions.map((action, i) => (
            <div
              key={action.key}
              className={cn(
                "flex items-center gap-2 animate-in fade-in-0 zoom-in-95 fill-mode-backwards",
                stacked && "flex-col",
              )}
              style={{ animationDelay: `${i * 40}ms`, animationDuration: "180ms" }}
            >
              {action.title && (
                <span className="order-first whitespace-nowrap rounded-md border border-border bg-bg-elevated px-2 py-1 text-xs font-medium text-text shadow-kk">
                  {action.title}
                </span>
              )}
              <button
                type="button"
                role="menuitem"
                disabled={action.disabled}
                aria-label={typeof action.title === "string" ? action.title : action.key}
                onClick={() => {
                  action.onClick?.();
                  if (!keepOpenOnAction) setOpen(false);
                }}
                className={cn(
                  "flex size-10 items-center justify-center rounded-full border border-border bg-bg-elevated text-text shadow-kk transition-all duration-mid",
                  "hover:scale-110 hover:border-primary hover:text-primary active:scale-95",
                  "focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/30",
                  action.danger && "text-error hover:border-error hover:text-error",
                  action.disabled && "cursor-not-allowed opacity-50 hover:scale-100 hover:border-border hover:text-text",
                )}
              >
                {action.icon}
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ariaLabel}
        data-open={open || undefined}
        onClick={trigger === "click" ? () => setOpen(!open) : undefined}
        className={cn(
          "group/fab flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-kk-secondary transition-all duration-mid",
          "hover:bg-primary-hover active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/30",
          open && "bg-primary-active",
        )}
      >
        {open && openIcon
          ? openIcon
          : (icon ?? <Plus className="size-5 transition-transform duration-300 group-data-[open]/fab:rotate-45" />)}
      </button>
    </div>
  );
}
