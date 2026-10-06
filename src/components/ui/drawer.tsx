import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { Portal } from "@/components/ui/portal";
import { useWatermarkPanelRef } from "@/components/ui/watermark";

export type DrawerPlacement = "top" | "right" | "bottom" | "left";
export type DrawerSize = "default" | "large";

/** Keep in sync with the enter/exit animation durations below. */
const MOTION_DURATION = 300;

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

export interface DrawerSlotClassNames {
  mask?: string;
  header?: string;
  body?: string;
  footer?: string;
  content?: string;
}

export interface DrawerSlotStyles {
  mask?: React.CSSProperties;
  header?: React.CSSProperties;
  body?: React.CSSProperties;
  footer?: React.CSSProperties;
  content?: React.CSSProperties;
}

/** Offset applied to a parent drawer when a nested one opens. */
export type DrawerPush = boolean | { distance?: number };

interface DrawerPushContextValue {
  push: () => void;
  pull: () => void;
}

const DrawerPushContext = React.createContext<DrawerPushContextValue | null>(null);

export interface DrawerProps {
  open?: boolean;
  onClose?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  placement?: DrawerPlacement;
  /** Preset panel size: 378px / 736px. Overridden by `width` / `height`. */
  size?: DrawerSize;
  width?: number | string;
  height?: number | string;
  title?: React.ReactNode;
  extra?: React.ReactNode;
  footer?: React.ReactNode;
  closable?: boolean;
  /** Custom close icon, `false` hides the close button. */
  closeIcon?: React.ReactNode | boolean;
  mask?: boolean;
  maskClosable?: boolean;
  /** Close on Escape. */
  keyboard?: boolean;
  /** Move focus into the panel when it opens. */
  autoFocus?: boolean;
  /** Unmount children after close. */
  destroyOnClose?: boolean;
  /** Render (hidden) before the first open. */
  forceRender?: boolean;
  /** Called when the open state settles (after the animation). */
  afterOpenChange?: (open: boolean) => void;
  /** Show a skeleton instead of the body content. */
  loading?: boolean;
  /** Offset this drawer when a nested drawer opens. */
  push?: DrawerPush;
  /** Wrap the panel, e.g. with a <form>. */
  drawerRender?: (node: React.ReactNode) => React.ReactNode;
  /** Portal target; `false` renders in place. */
  getContainer?: HTMLElement | (() => HTMLElement) | false;
  children?: React.ReactNode;
  className?: string;
  /** Class on both the mask and the panel. */
  rootClassName?: string;
  classNames?: DrawerSlotClassNames;
  styles?: DrawerSlotStyles;
  /** Shorthand for `styles.body`. */
  bodyStyle?: React.CSSProperties;
  /** Shorthand for `styles.header`. */
  headerStyle?: React.CSSProperties;
  /** Shorthand for `styles.footer`. */
  footerStyle?: React.CSSProperties;
  zIndex?: number;
}

const placementClass: Record<DrawerPlacement, string> = {
  right:
    "inset-y-0 right-0 border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
  left: "inset-y-0 left-0 border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
  top: "inset-x-0 top-0 border-b data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
  bottom:
    "inset-x-0 bottom-0 border-t data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
};

export function Drawer({
  open = false,
  onClose,
  placement = "right",
  size = "default",
  width,
  height,
  title,
  extra,
  footer,
  closable = true,
  closeIcon,
  mask = true,
  maskClosable = true,
  keyboard = true,
  autoFocus = true,
  destroyOnClose = false,
  forceRender = false,
  afterOpenChange,
  loading = false,
  push = true,
  drawerRender,
  getContainer,
  children,
  className,
  rootClassName,
  classNames: slotClassNames,
  styles: slotStyles,
  bodyStyle,
  headerStyle,
  footerStyle,
  zIndex = 1000,
}: DrawerProps) {
  const [rendered, setRendered] = React.useState(open || forceRender);
  const [exiting, setExiting] = React.useState(false);
  const [settled, setSettled] = React.useState(false);
  const [pushCount, setPushCount] = React.useState(0);

  const panelRef = React.useRef<HTMLDivElement>(null);
  const panelWatermarkRef = useWatermarkPanelRef(panelRef);
  const lastActive = React.useRef<HTMLElement | null>(null);
  const prevOpen = React.useRef(false);
  const titleId = React.useId();

  const afterOpenChangeRef = React.useRef(afterOpenChange);
  afterOpenChangeRef.current = afterOpenChange;
  const onCloseRef = React.useRef(onClose);
  onCloseRef.current = onClose;

  /* nested drawers push the one that opened them */
  const parent = React.useContext(DrawerPushContext);
  React.useEffect(() => {
    if (!parent || !open) return;
    parent.push();
    return () => parent.pull();
  }, [parent, open]);

  const pushValue = React.useMemo<DrawerPushContextValue>(
    () => ({
      push: () => setPushCount((n) => n + 1),
      pull: () => setPushCount((n) => Math.max(0, n - 1)),
    }),
    [],
  );

  /* mount / unmount around the exit animation */
  React.useEffect(() => {
    const was = prevOpen.current;
    prevOpen.current = open;
    if (open) {
      setRendered(true);
      setExiting(false);
      if (!was) afterOpenChangeRef.current?.(true);
      return;
    }
    if (!was) return;
    setExiting(true);
    const timer = window.setTimeout(() => {
      setExiting(false);
      if (destroyOnClose) setRendered(false);
      afterOpenChangeRef.current?.(false);
    }, MOTION_DURATION);
    return () => window.clearTimeout(timer);
  }, [open, destroyOnClose]);

  /* Escape + body scroll lock (only while a mask covers the page) */
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && keyboard) onCloseRef.current?.(e as unknown as React.KeyboardEvent);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, keyboard]);

  // scroll lock lives in a shared hook that pads the scrollbar gap, so opening
  // an overlay no longer reflows the page behind it
  useScrollLock(open && mask);

  React.useEffect(() => {
    if (!open) {
      setSettled(false);
      return;
    }
    const t = window.setTimeout(() => setSettled(true), MOTION_DURATION);
    return () => window.clearTimeout(t);
  }, [open]);

  /* focus the panel on open, restore the trigger on close */
  React.useEffect(() => {
    if (!open || !autoFocus) return;
    lastActive.current = document.activeElement as HTMLElement | null;
    const raf = requestAnimationFrame(() => {
      const node = panelRef.current;
      if (!node || node.contains(document.activeElement)) return;
      const target = node.querySelector<HTMLElement>("[autofocus]") ?? node;
      target.focus();
    });
    return () => {
      cancelAnimationFrame(raf);
      lastActive.current?.focus?.();
    };
  }, [open, autoFocus]);

  /* keep Tab inside the panel */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !panelRef.current) return;
    const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (n) => n.offsetParent !== null,
    );
    if (!nodes.length) {
      e.preventDefault();
      panelRef.current.focus();
      return;
    }
    const first = nodes[0]!;
    const last = nodes[nodes.length - 1]!;
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === panelRef.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (!rendered) return null;

  const visible = open || exiting;
  const state = open ? "open" : "closed";
  const hiddenStyle: React.CSSProperties | undefined = visible ? undefined : { display: "none" };
  const showClose = closable && closeIcon !== false;
  const inline = getContainer === false;
  const position = inline ? "absolute" : "fixed";

  const horizontal = placement === "left" || placement === "right";
  const panelSize = horizontal
    ? (width ?? (size === "large" ? 736 : 378))
    : (height ?? (size === "large" ? 736 : 378));

  const pushDistance = push === false ? 0 : ((typeof push === "object" ? push.distance : undefined) ?? 180);
  const pushed = pushCount > 0 && pushDistance > 0;
  const pushOffset = pushed
    ? placement === "right"
      ? `translateX(-${pushDistance}px)`
      : placement === "left"
        ? `translateX(${pushDistance}px)`
        : placement === "bottom"
          ? `translateY(-${pushDistance}px)`
          : `translateY(${pushDistance}px)`
    : undefined;

  const sizeStyle: React.CSSProperties = horizontal
    ? { width: typeof panelSize === "number" ? `${panelSize}px` : panelSize, maxWidth: "100vw" }
    : { height: typeof panelSize === "number" ? `${panelSize}px` : panelSize, maxHeight: "100vh" };

  const panel = (
    <div
      ref={panelWatermarkRef}
      role="dialog"
      aria-modal={mask ? "true" : undefined}
      aria-labelledby={title ? titleId : undefined}
      data-slot="drawer"
      data-state={state}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className={cn(
        position,
        "flex flex-col border-border bg-bg-elevated shadow-kk-drawer outline-none",
        "transition-transform duration-300 ease-kk-in-out",
        // slide in on a spring; leaving stays quick and linear
        "data-[state=open]:animate-in data-[state=open]:ease-kk-spring-soft data-[state=open]:duration-[420ms]",
        "data-[state=closed]:animate-out data-[state=closed]:duration-200",
        placementClass[placement],
        rootClassName,
        slotClassNames?.content,
        className,
      )}
      style={{
        ...sizeStyle,
        transform: pushOffset,
        zIndex: zIndex + 1,
        ...hiddenStyle,
        ...slotStyles?.content,
      }}
    >
      {(title || showClose || extra) && (
        <div
          className={cn(
            "flex items-center justify-between border-b border-border-secondary px-6 py-4",
            slotClassNames?.header,
          )}
          style={{ ...headerStyle, ...slotStyles?.header }}
        >
          <div className="flex min-w-0 items-center gap-3">
            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-1 text-text-tertiary transition-colors duration-mid hover:bg-fill-tertiary hover:text-text"
                aria-label="Close"
              >
                {closeIcon && closeIcon !== true ? closeIcon : <X className="size-4" />}
              </button>
            )}
            {title && (
              <div id={titleId} className="truncate text-base font-semibold text-text-heading">
                {title}
              </div>
            )}
          </div>
          {extra && <div className="flex items-center gap-2">{extra}</div>}
        </div>
      )}

      <div
        className={cn("kk-scrollbar flex-1 overflow-y-auto p-6 text-sm text-text-secondary", slotClassNames?.body)}
        style={{ ...bodyStyle, ...slotStyles?.body }}
      >
        {loading ? (
          <div className="space-y-3" aria-busy="true">
            <div className="kk-shimmer h-4 w-2/5 rounded-sm" />
            <div className="kk-shimmer h-3 w-full rounded-sm" />
            <div className="kk-shimmer h-3 w-5/6 rounded-sm" />
            <div className="kk-shimmer h-3 w-3/4 rounded-sm" />
          </div>
        ) : (
          children
        )}
      </div>

      {footer && (
        <div
          className={cn(
            "flex items-center justify-end gap-2 border-t border-border-secondary px-6 py-3",
            slotClassNames?.footer,
          )}
          style={{ ...footerStyle, ...slotStyles?.footer }}
        >
          {footer}
        </div>
      )}
    </div>
  );

  const body = (
    <DrawerPushContext.Provider value={pushValue}>
      {mask && (
        <div
          aria-hidden="true"
          data-state={state}
          onClick={maskClosable ? (e) => onClose?.(e) : undefined}
          className={cn(
            position,
            // the blur is applied after the fade finishes: compositing a full-screen
            // blur during the animation is what dropped frames
            "inset-0 bg-bg-mask duration-200 [will-change:opacity] [transform:translateZ(0)]",
            "[transition-property:opacity,backdrop-filter]",
            settled && "[backdrop-filter:blur(var(--kk-mask-blur))]",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
            rootClassName,
            slotClassNames?.mask,
          )}
          style={{ zIndex, ...hiddenStyle, ...slotStyles?.mask }}
        />
      )}
      {drawerRender ? drawerRender(panel) : panel}
    </DrawerPushContext.Provider>
  );

  if (inline) return body;
  const container = typeof getContainer === "function" ? getContainer() : getContainer;
  return <Portal container={container || undefined}>{body}</Portal>;
}
