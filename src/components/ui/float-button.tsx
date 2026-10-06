import * as React from "react";
import { ArrowUp, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";

/**
 * FloatButton — a button that floats over the page (`position: fixed`, 24px from the right,
 * 48px from the bottom by default). Pass `className` / `style` to move it, or drop it inside a
 * `FloatButton.Group` — inside a group the buttons are laid out by the group instead.
 */
export type FloatButtonType = "default" | "primary";
export type FloatButtonShape = "circle" | "square";
export type FloatButtonGroupPlacement = "top" | "right" | "bottom" | "left";

/** Subset of BadgeProps supported by the corner badge of a FloatButton. */
export interface FloatButtonBadgeProps {
  count?: React.ReactNode;
  dot?: boolean;
  color?: string;
  offset?: [number, number];
  overflowCount?: number;
}

export interface FloatButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  icon?: React.ReactNode;
  description?: React.ReactNode;
  tooltip?: React.ReactNode;
  type?: FloatButtonType;
  /** Defaults to the shape of the surrounding group, or `circle` */
  shape?: FloatButtonShape;
  badge?: FloatButtonBadgeProps;
  href?: string;
  target?: string;
  /** Native type of the rendered <button> */
  htmlType?: "button" | "submit" | "reset";
}

interface GroupCtx {
  shape: FloatButtonShape;
  /** true when the group renders its children joined into one block (no `trigger`) */
  attached: boolean;
}
const GroupContext = React.createContext<GroupCtx | null>(null);

export function FloatButton({
  icon,
  description,
  tooltip,
  type = "default",
  shape,
  badge,
  href,
  target,
  htmlType = "button",
  className,
  style,
  children,
  ...props
}: FloatButtonProps) {
  const group = React.useContext(GroupContext);
  const resolvedShape = shape ?? group?.shape ?? "circle";
  // A description only fits the square shape.
  const showDescription = description != null && resolvedShape === "square";

  const rootClass = cn(
    "group/float-button relative z-[99] inline-flex shrink-0 outline-none select-none",
    "transition-[background-color,color,box-shadow,transform] duration-mid ease-kk-in-out",
    "focus-visible:ring-[3px] focus-visible:ring-primary/30",
    showDescription ? "size-12" : "size-10",
    type === "primary" ? "bg-primary text-white hover:bg-primary-hover" : "bg-bg-elevated text-text hover:bg-fill-tertiary",
    // joined inside an attached group: the group owns the radius, the shadow and the dividers
    group?.attached
      ? "rounded-none"
      : cn(
          "kk-press shadow-kk-secondary hover:shadow-kk",
          resolvedShape === "circle" ? "rounded-full" : "rounded-lg",
          // stand-alone float buttons float; a group positions its own children
          !group && "fixed right-6 bottom-12",
        ),
    className,
  );

  // Badge is stretched over the body so its indicator lands on the button's top-right corner.
  const badgeNode = badge ? (
    <Badge
      count={badge.count}
      dot={badge.dot}
      color={badge.color}
      offset={badge.offset}
      overflowCount={badge.overflowCount}
      className="pointer-events-none absolute inset-0"
    >
      <span className="block size-full" />
    </Badge>
  ) : null;

  const body = (
    <>
      {icon && <span className="flex items-center justify-center [&>svg]:size-4.5">{icon}</span>}
      {showDescription && <span className="max-w-full truncate px-1 text-[10px] leading-none font-medium">{description}</span>}
      {children}
      {badgeNode}
    </>
  );

  // The body fills the root: it anchors the badge and measures the tooltip against the button itself,
  // whatever positioning the caller's className gives the root.
  const bodyClass = "relative flex size-full flex-col items-center justify-center gap-0.5";
  const inner = tooltip ? (
    <Tooltip title={tooltip} placement="left" className={bodyClass}>
      {body}
    </Tooltip>
  ) : (
    <span className={bodyClass}>{body}</span>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        data-slot="float-button"
        {...(props as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        className={rootClass}
        style={style}
      >
        {inner}
      </a>
    );
  }

  return (
    <button type={htmlType} data-slot="float-button" {...props} className={rootClass} style={style}>
      {inner}
    </button>
  );
}

/* ---------------- FloatButton.BackTop ---------------- */

export interface BackTopProps extends Omit<FloatButtonProps, "target"> {
  /** Scroll distance (px) after which the button appears */
  visibilityHeight?: number;
  /** Duration (ms) of the scroll animation */
  duration?: number;
  /** Scroll container; defaults to the window */
  target?: () => HTMLElement | Window | Document;
}

type ScrollTarget = HTMLElement | Window | Document;

const scrollTopOf = (t: ScrollTarget) =>
  t instanceof HTMLElement ? t.scrollTop : window.scrollY || document.documentElement.scrollTop;

const scrollTo = (t: ScrollTarget, value: number) => {
  if (t instanceof HTMLElement) t.scrollTop = value;
  else window.scrollTo(window.scrollX, value);
};

const easeInOutCubic = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);

function BackTop({
  visibilityHeight = 400,
  duration = 450,
  target,
  icon = <ArrowUp />,
  tooltip = "Back to Top",
  onClick,
  className,
  ...props
}: BackTopProps) {
  const [visible, setVisible] = React.useState(false);
  const raf = React.useRef<number | undefined>(undefined);

  React.useEffect(() => {
    const scroller: ScrollTarget = target?.() ?? window;
    const node: HTMLElement | Window = scroller instanceof HTMLElement ? scroller : window;
    const onScroll = () => setVisible(scrollTopOf(scroller) >= visibilityHeight);
    node.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => node.removeEventListener("scroll", onScroll);
  }, [target, visibilityHeight]);

  React.useEffect(() => () => cancelAnimationFrame(raf.current ?? 0), []);

  const scrollToTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    const scroller: ScrollTarget = target?.() ?? window;
    const from = scrollTopOf(scroller);
    const startedAt = performance.now();
    cancelAnimationFrame(raf.current ?? 0);
    const step = (now: number) => {
      const p = duration > 0 ? Math.min((now - startedAt) / duration, 1) : 1;
      scrollTo(scroller, from * (1 - easeInOutCubic(p)));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    onClick?.(e);
  };

  if (!visible) return null;

  return <FloatButton icon={icon} tooltip={tooltip} onClick={scrollToTop} className={cn("kk-in kk-in-zoom", className)} {...props} />;
}

/* ---------------- FloatButton.Group ---------------- */

export interface FloatButtonGroupProps {
  /** Shape shared by the trigger and every child that does not set its own */
  shape?: FloatButtonShape;
  /** Type of the menu trigger button */
  type?: FloatButtonType;
  /** Turns the group into a menu; without it the children are joined into one block */
  trigger?: "click" | "hover";
  /** Direction the menu expands to (5.21) */
  placement?: FloatButtonGroupPlacement;
  /** Icon of the menu trigger */
  icon?: React.ReactNode;
  /** Icon of the menu trigger while open */
  closeIcon?: React.ReactNode;
  /** Description of the menu trigger */
  description?: React.ReactNode;
  /** Tooltip of the menu trigger */
  tooltip?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const directionClass: Record<FloatButtonGroupPlacement, string> = {
  top: "flex-col-reverse items-center",
  bottom: "flex-col items-center",
  left: "flex-row-reverse items-center",
  right: "flex-row items-center",
};

const enterClass: Record<FloatButtonGroupPlacement, string> = {
  top: "slide-in-from-bottom-2",
  bottom: "slide-in-from-top-2",
  left: "slide-in-from-right-2",
  right: "slide-in-from-left-2",
};

function FloatButtonGroup({
  shape = "circle",
  type = "primary",
  trigger,
  placement = "top",
  icon = <Plus />,
  closeIcon = <X />,
  description,
  tooltip,
  open: controlledOpen,
  onOpenChange,
  children,
  className,
  style,
}: FloatButtonGroupProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const isMenu = trigger !== undefined;

  const setOpen = (v: boolean) => {
    if (!isControlled) setInternalOpen(v);
    onOpenChange?.(v);
  };

  const ctx = React.useMemo<GroupCtx>(() => ({ shape, attached: !isMenu }), [shape, isMenu]);

  return (
    <GroupContext.Provider value={ctx}>
      <div
        data-slot="float-button-group"
        data-open={open || undefined}
        style={style}
        className={cn(
          "fixed right-6 bottom-12 z-[99] flex",
          isMenu
            ? cn(directionClass[placement], "gap-3")
            : cn("flex-col overflow-hidden shadow-kk-secondary divide-y divide-split", shape === "circle" ? "rounded-full" : "rounded-lg"),
          className,
        )}
        onMouseEnter={trigger === "hover" ? () => setOpen(true) : undefined}
        onMouseLeave={trigger === "hover" ? () => setOpen(false) : undefined}
      >
        {isMenu ? (
          <>
            <FloatButton
              type={type}
              shape={shape}
              icon={open ? closeIcon : icon}
              description={description}
              tooltip={tooltip}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            />
            {open && (
              <div className={cn("flex gap-2.5 animate-in fade-in-0 duration-200", directionClass[placement], enterClass[placement])}>
                {children}
              </div>
            )}
          </>
        ) : (
          children
        )}
      </div>
    </GroupContext.Provider>
  );
}

FloatButton.BackTop = BackTop;
FloatButton.Group = FloatButtonGroup;

export { BackTop as FloatButtonBackTop, FloatButtonGroup };
