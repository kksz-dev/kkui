import * as React from "react";
import { X, CircleCheck, CircleX, CircleAlert, Clock, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Tag — KKUI tag: preset / status / custom colors, closable, icon, bordered,
 * clickable (href / onClick). Plus CheckableTag.
 */
export const PRESET_TAG_COLORS = [
  "magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple",
] as const;
export type PresetTagColor = (typeof PRESET_TAG_COLORS)[number];

export const STATUS_TAG_COLORS = ["success", "processing", "error", "warning", "default"] as const;
export type StatusTagColor = (typeof STATUS_TAG_COLORS)[number];

const presetClass: Record<PresetTagColor, string> = {
  magenta: "bg-magenta-bg text-magenta border-magenta-border",
  red: "bg-red-bg text-red border-red-border",
  volcano: "bg-volcano-bg text-volcano border-volcano-border",
  orange: "bg-orange-bg text-orange border-orange-border",
  gold: "bg-gold-bg text-gold border-gold-border",
  lime: "bg-lime-bg text-lime border-lime-border",
  green: "bg-green-bg text-green border-green-border",
  cyan: "bg-cyan-bg text-cyan border-cyan-border",
  blue: "bg-blue-bg text-blue border-blue-border",
  geekblue: "bg-geekblue-bg text-geekblue border-geekblue-border",
  purple: "bg-purple-bg text-purple border-purple-border",
};

const statusClass: Record<StatusTagColor, string> = {
  success: "bg-success-bg text-success border-success-border",
  processing: "bg-info-bg text-info border-info-border",
  error: "bg-error-bg text-error border-error-border",
  warning: "bg-warning-bg text-warning border-warning-border",
  default: "bg-fill-quaternary text-text border-border",
};

const statusIcon: Record<StatusTagColor, React.ReactNode> = {
  success: <CircleCheck />,
  processing: <LoaderCircle className="animate-spin" />,
  error: <CircleX />,
  warning: <CircleAlert />,
  default: <Clock />,
};

const isPreset = (c: string): c is PresetTagColor => (PRESET_TAG_COLORS as readonly string[]).includes(c);
const isStatus = (c: string): c is StatusTagColor => (STATUS_TAG_COLORS as readonly string[]).includes(c);

export interface TagProps extends Omit<React.ComponentProps<"span">, "color" | "onClick"> {
  /** Preset color (magenta … purple), status color (success | processing | error | warning | default) or any CSS color */
  color?: PresetTagColor | StatusTagColor | (string & {});
  /** Show a close icon (or a custom one) */
  closable?: boolean | { closeIcon?: React.ReactNode };
  /** Custom close icon (shorthand of `closable={{ closeIcon }}`) */
  closeIcon?: React.ReactNode;
  /** Called on close click; `e.preventDefault()` keeps the tag visible */
  onClose?: (e: React.MouseEvent<HTMLElement>) => void;
  /** Icon rendered before the content */
  icon?: React.ReactNode;
  /** Whether the tag has a border (shorthand for variant="outlined" | "filled") */
  bordered?: boolean;
  /** Visual style — replaces `bordered` (5.24 style) */
  variant?: "filled" | "outlined" | "borderless";
  /** Render as an anchor */
  href?: string;
  target?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

function Tag({
  className,
  color,
  closable = false,
  closeIcon,
  onClose,
  icon,
  bordered,
  variant,
  href,
  target,
  onClick,
  children,
  style,
  ...props
}: TagProps) {
  const [visible, setVisible] = React.useState(true);

  // A tag that was closed comes back when its content changes.
  React.useEffect(() => {
    setVisible(true);
  }, [children, color]);

  if (!visible) return null;

  const preset = color && isPreset(color) ? color : undefined;
  const status = color && isStatus(color) ? color : undefined;
  const custom = color && !preset && !status ? color : undefined;
  const clickable = Boolean(href || onClick);
  const closableIcon = typeof closable === "object" ? closable.closeIcon : undefined;
  // Passing a closeIcon implies closable.
  const showClose = closable === false ? false : Boolean(closable) || closeIcon !== undefined;
  const finalCloseIcon = closableIcon ?? closeIcon ?? <X />;
  const resolvedVariant = variant ?? (bordered === false ? "borderless" : "outlined");

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    onClose?.(e);
    if (e.defaultPrevented) return;
    setVisible(false);
  };

  const classes = cn(
    "inline-flex h-[22px] max-w-full items-center gap-1 rounded-sm border px-[7px] text-xs leading-5 whitespace-nowrap select-none",
    "transition-colors duration-mid ease-kk-in-out [&_svg]:size-3 [&_svg]:shrink-0",
    !color && "bg-fill-quaternary text-text border-border",
    preset && presetClass[preset],
    status && statusClass[status],
    custom && "border-transparent text-white",
    resolvedVariant === "borderless" && "border-transparent",
    resolvedVariant === "filled" && "border-transparent",
    clickable && "cursor-pointer hover:opacity-85",
    className,
  );

  const content = (
    <>
      {icon}
      {children != null && <span className="truncate">{children}</span>}
      {showClose && (
        <button
          type="button"
          aria-label="Close"
          onClick={handleClose}
          className={cn(
            "inline-flex shrink-0 cursor-pointer items-center rounded-xs outline-none transition-colors [&_svg]:size-2.5",
            custom ? "text-white/70 hover:text-white" : "text-text-description hover:text-text",
          )}
        >
          {finalCloseIcon}
        </button>
      )}
    </>
  );

  const styleWithColor = custom ? { ...style, backgroundColor: custom } : style;

  if (href) {
    return (
      <a data-slot="tag" href={href} target={target} className={classes} style={styleWithColor} onClick={onClick} {...(props as React.ComponentProps<"a">)}>
        {content}
      </a>
    );
  }
  return (
    <span data-slot="tag" data-color={color} className={classes} style={styleWithColor} onClick={onClick} {...props}>
      {content}
    </span>
  );
}

/** Tag with an icon that matches an KKUI status color (`success | processing | error | warning | default`). */
function TagStatusIcon({ status }: { status: StatusTagColor }) {
  return <>{statusIcon[status]}</>;
}

export interface CheckableTagProps extends Omit<React.ComponentProps<"span">, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

/** CheckableTag — behaves like a checkbox, styled as a tag. */
function CheckableTag({ className, checked, defaultChecked = false, onChange, onClick, children, ...props }: CheckableTagProps) {
  const [inner, setInner] = React.useState(defaultChecked);
  const isChecked = checked ?? inner;
  return (
    <span
      data-slot="checkable-tag"
      role="checkbox"
      aria-checked={isChecked}
      tabIndex={0}
      className={cn(
        "inline-flex h-[22px] cursor-pointer items-center rounded-sm border border-transparent px-[7px] text-xs leading-5 select-none",
        "transition-colors duration-mid ease-kk-in-out outline-none focus-visible:ring-[3px] focus-visible:ring-primary/30",
        isChecked ? "bg-primary text-white hover:bg-primary-hover active:bg-primary-active" : "text-text hover:text-primary active:bg-primary-bg",
        className,
      )}
      onClick={(e) => {
        onClick?.(e);
        if (checked === undefined) setInner(!isChecked);
        onChange?.(!isChecked);
      }}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          if (checked === undefined) setInner(!isChecked);
          onChange?.(!isChecked);
        }
      }}
      {...props}
    >
      {children}
    </span>
  );
}

Tag.CheckableTag = CheckableTag;
Tag.StatusIcon = TagStatusIcon;

export { Tag, CheckableTag, TagStatusIcon };
