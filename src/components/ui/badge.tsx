import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Badge — KKUI badge: count / dot / status / color / size / offset / ribbon.
 * Wraps `children` and positions the badge at the top-right corner; standalone when no children.
 */
export const PRESET_BADGE_COLORS = [
  "magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple",
] as const;
export type PresetBadgeColor = (typeof PRESET_BADGE_COLORS)[number];
export type BadgeStatus = "success" | "processing" | "default" | "error" | "warning";

const presetBg: Record<PresetBadgeColor, string> = {
  magenta: "bg-magenta", red: "bg-red", volcano: "bg-volcano", orange: "bg-orange", gold: "bg-gold", lime: "bg-lime",
  green: "bg-green", cyan: "bg-cyan", blue: "bg-blue", geekblue: "bg-geekblue", purple: "bg-purple",
};
const statusBg: Record<BadgeStatus, string> = {
  success: "bg-success",
  processing: "bg-primary",
  default: "bg-text-quaternary",
  error: "bg-error",
  warning: "bg-warning",
};

const isPreset = (c: string): c is PresetBadgeColor => (PRESET_BADGE_COLORS as readonly string[]).includes(c);

/** Digit column that scrolls to the target digit (KKUI ScrollNumber). */
function ScrollDigit({ digit }: { digit: number }) {
  return (
    <span className="inline-block h-[var(--badge-h)] overflow-hidden text-center">
      <span
        className="flex flex-col transition-transform duration-slow ease-kk-in-out"
        style={{ transform: `translateY(${-digit * 100}%)` }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="block h-[var(--badge-h)] leading-[var(--badge-h)]">
            {i}
          </span>
        ))}
      </span>
    </span>
  );
}

function ScrollNumber({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((ch, i) =>
        /\d/.test(ch) ? <ScrollDigit key={`${i}-${text.length}`} digit={Number(ch)} /> : <span key={i}>{ch}</span>,
      )}
    </>
  );
}

export interface BadgeProps extends Omit<React.ComponentProps<"span">, "color" | "title"> {
  /** Number to show; hidden when 0 unless `showZero` */
  count?: React.ReactNode;
  /** Max count shown, larger renders `${overflowCount}+` */
  overflowCount?: number;
  /** Show badge even when count is 0 */
  showZero?: boolean;
  /** Red dot instead of count */
  dot?: boolean;
  /** Status dot; combine with `text` */
  status?: BadgeStatus;
  /** Text next to a status dot */
  text?: React.ReactNode;
  /** Preset or custom CSS color of the badge / status dot */
  color?: PresetBadgeColor | (string & {});
  size?: "default" | "small";
  /** [x, y] offset of the badge relative to the top-right corner */
  offset?: [number, number];
  /** Native title on the badge; defaults to the count */
  title?: string;
  /** Extra classes on the inner badge element */
  classNames?: { indicator?: string; root?: string };
  styles?: { indicator?: React.CSSProperties; root?: React.CSSProperties };
}

function Badge({
  className,
  count,
  overflowCount = 99,
  showZero = false,
  dot = false,
  status,
  text,
  color,
  size = "default",
  offset,
  title,
  classNames,
  styles,
  children,
  style,
  ...props
}: BadgeProps) {
  const isNumber = typeof count === "number";
  const displayCount = isNumber && count > overflowCount ? `${overflowCount}+` : count;
  const hidden = (count == null || (isNumber && count === 0 && !showZero) || count === "") && !dot;
  const hasStatus = Boolean(status || color) && !children && count == null && !dot;
  const custom = color && !isPreset(color) ? color : undefined;
  const bgClass = status ? statusBg[status] : color && isPreset(color) ? presetBg[color] : !custom ? "bg-error" : undefined;

  // ---- status dot + text (standalone) ----
  if (hasStatus) {
    const s = status ?? "default";
    return (
      <span data-slot="badge" data-status={s} className={cn("inline-flex items-center gap-2 text-sm text-text", className)} style={style} {...props}>
        <span className="relative inline-flex size-1.5 shrink-0">
          {s === "processing" && (
            <span className={cn("kk-pulse-ring absolute inset-0 rounded-full", bgClass)} style={custom ? { backgroundColor: custom } : undefined} />
          )}
          <span className={cn("relative inline-flex size-1.5 rounded-full", bgClass)} style={custom ? { backgroundColor: custom } : undefined} />
        </span>
        {text != null && <span>{text}</span>}
      </span>
    );
  }

  const indicatorStyle: React.CSSProperties = {
    ...(custom ? { backgroundColor: custom } : {}),
    ...(children && offset ? { marginTop: offset[1], marginInlineEnd: -offset[0] } : {}),
    ...styles?.indicator,
  };

  const indicator = hidden ? null : dot ? (
    <span
      data-slot="badge-indicator"
      className={cn(
        "size-1.5 rounded-full shadow-[0_0_0_1px_var(--kk-bg-container)]",
        bgClass,
        children && "absolute top-0 right-0 z-10 origin-top-right translate-x-1/2 -translate-y-1/2",
        classNames?.indicator,
      )}
      style={indicatorStyle}
    />
  ) : (
    <span
      data-slot="badge-indicator"
      title={title ?? (isNumber ? String(count) : undefined)}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-normal whitespace-nowrap text-white shadow-[0_0_0_1px_var(--kk-bg-container)] tabular-nums",
        size === "small" ? "h-3.5 min-w-3.5 px-1 text-[10px] leading-3.5 [--badge-h:14px]" : "h-5 min-w-5 px-1.5 text-xs leading-5 [--badge-h:20px]",
        bgClass,
        children && "absolute top-0 right-0 z-10 origin-top-right translate-x-1/2 -translate-y-1/2",
        classNames?.indicator,
      )}
      style={indicatorStyle}
    >
      {typeof displayCount === "string" || typeof displayCount === "number" ? <ScrollNumber text={String(displayCount)} /> : displayCount}
    </span>
  );

  return (
    <span
      data-slot="badge"
      className={cn("relative inline-block", !children && "leading-none", className, classNames?.root)}
      style={{ ...style, ...styles?.root }}
      {...props}
    >
      {children}
      {indicator}
    </span>
  );
}

export interface BadgeRibbonProps extends Omit<React.ComponentProps<"div">, "color"> {
  text?: React.ReactNode;
  color?: PresetBadgeColor | (string & {});
  placement?: "start" | "end";
}

/** BadgeRibbon — corner ribbon over a card-like child. */
function BadgeRibbon({ className, text, color, placement = "end", children, ...props }: BadgeRibbonProps) {
  const custom = color && !isPreset(color) ? color : undefined;
  const bgClass = color && isPreset(color) ? presetBg[color] : !custom ? "bg-primary" : undefined;
  return (
    <div data-slot="badge-ribbon-wrapper" className={cn("relative", className)} {...props}>
      {children}
      <div
        data-slot="badge-ribbon"
        className={cn(
          "absolute top-2 h-[22px] px-2 text-xs leading-[22px] whitespace-nowrap text-white",
          placement === "end" ? "-right-2 rounded-l-sm rounded-tr-sm" : "-left-2 rounded-r-sm rounded-tl-sm",
          bgClass,
        )}
        style={custom ? { backgroundColor: custom } : undefined}
      >
        {text}
        <span
          className={cn(
            "absolute top-full size-2 brightness-75",
            placement === "end" ? "right-0 [clip-path:polygon(0_0,100%_0,0_100%)]" : "left-0 [clip-path:polygon(0_0,100%_0,100%_100%)]",
            bgClass,
          )}
          style={custom ? { backgroundColor: custom } : undefined}
        />
      </div>
    </div>
  );
}

Badge.Ribbon = BadgeRibbon;

export { Badge, BadgeRibbon };
