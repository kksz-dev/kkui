import * as React from "react";
import { CircleAlert, CircleCheck, Info, LoaderCircle, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Portal } from "@/components/ui/portal";

export type ToastType = "default" | "success" | "error" | "warning" | "info" | "loading";
export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToastAction {
  label: React.ReactNode;
  onClick: () => void;
}

export interface ToastOptions {
  id?: string | number;
  title?: React.ReactNode;
  description?: React.ReactNode;
  type?: ToastType;
  /** ms; 0 keeps it until dismissed. Loading toasts default to 0. */
  duration?: number;
  action?: ToastAction;
  cancel?: ToastAction;
  icon?: React.ReactNode;
  onDismiss?: (id: string | number) => void;
  onAutoClose?: (id: string | number) => void;
}

interface ToastRecord extends Required<Pick<ToastOptions, "id" | "type">> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  duration: number;
  action?: ToastAction;
  cancel?: ToastAction;
  icon?: React.ReactNode;
  onDismiss?: (id: string | number) => void;
  onAutoClose?: (id: string | number) => void;
}

/* ------------------------------------------------------------------ */
/* store                                                               */
/* ------------------------------------------------------------------ */

let seed = 0;
const listeners = new Set<() => void>();
let toasts: ToastRecord[] = [];

function emit() {
  listeners.forEach((fn) => fn());
}

function upsert(options: ToastOptions): string | number {
  const id = options.id ?? `kk-toast-${++seed}`;
  const type = options.type ?? "default";
  const previousTimer = toastTimers.get(id);
  if (previousTimer) stopTimer(previousTimer, false);
  toastTimers.delete(id);
  const record: ToastRecord = {
    id,
    type,
    title: options.title,
    description: options.description,
    duration: options.duration ?? (type === "loading" ? 0 : 4000),
    action: options.action,
    cancel: options.cancel,
    icon: options.icon,
    onDismiss: options.onDismiss,
    onAutoClose: options.onAutoClose,
  };
  const existing = toasts.findIndex((t) => t.id === id);
  toasts = existing >= 0 ? toasts.map((t, i) => (i === existing ? record : t)) : [...toasts, record];
  emit();
  return id;
}

function dismiss(id?: string | number) {
  if (id === undefined) {
    toastTimers.forEach((timer) => stopTimer(timer, false));
    toastTimers.clear();
    toasts.forEach((t) => t.onDismiss?.(t.id));
    toasts = [];
  } else {
    const timer = toastTimers.get(id);
    if (timer) stopTimer(timer, false);
    toastTimers.delete(id);
    toasts.find((t) => t.id === id)?.onDismiss?.(id);
    toasts = toasts.filter((t) => t.id !== id);
  }
  emit();
}

interface ToastTimer {
  record: ToastRecord;
  timer: ReturnType<typeof setTimeout> | null;
  startedAt: number;
  remaining: number;
}

const toastTimers = new Map<string | number, ToastTimer>();
let toastTimersPaused = false;

function stopTimer(timer: ToastTimer, preserveRemaining: boolean) {
  if (timer.timer === null) return;
  clearTimeout(timer.timer);
  timer.timer = null;
  if (preserveRemaining) {
    timer.remaining = Math.max(0, timer.remaining - (Date.now() - timer.startedAt));
  }
}

function startTimer(timer: ToastTimer) {
  if (toastTimersPaused || timer.timer !== null) return;
  timer.startedAt = Date.now();
  timer.timer = setTimeout(() => {
    timer.timer = null;
    if (toastTimers.get(timer.record.id) !== timer) return;
    toastTimers.delete(timer.record.id);
    if (toasts.find((record) => record.id === timer.record.id) !== timer.record) return;
    timer.record.onAutoClose?.(timer.record.id);
    if (toasts.find((record) => record.id === timer.record.id) === timer.record) dismiss(timer.record.id);
  }, Math.max(0, timer.remaining));
}

function syncToastTimers(records: ToastRecord[]) {
  const liveIds = new Set(records.map((record) => record.id));
  for (const [id, timer] of toastTimers) {
    if (liveIds.has(id)) continue;
    stopTimer(timer, false);
    toastTimers.delete(id);
  }

  for (const record of records) {
    const current = toastTimers.get(record.id);
    if (record.duration <= 0) {
      if (current) stopTimer(current, false);
      toastTimers.delete(record.id);
      continue;
    }
    if (current?.record === record) {
      startTimer(current);
      continue;
    }
    if (current) stopTimer(current, false);
    const next: ToastTimer = { record, timer: null, startedAt: 0, remaining: record.duration };
    toastTimers.set(record.id, next);
    startTimer(next);
  }
}

function setToastTimersPaused(paused: boolean) {
  if (toastTimersPaused === paused) return;
  toastTimersPaused = paused;
  for (const timer of toastTimers.values()) {
    if (paused) stopTimer(timer, true);
    else startTimer(timer);
  }
}

export interface ToastPromiseMessages<T> {
  loading: React.ReactNode;
  success: React.ReactNode | ((value: T) => React.ReactNode);
  error: React.ReactNode | ((error: unknown) => React.ReactNode);
}

function make(type: ToastType) {
  return (title: React.ReactNode, options: Omit<ToastOptions, "title" | "type"> = {}) =>
    upsert({ ...options, title, type });
}

/** `toast("Saved")`, `toast.success(...)`, `toast.promise(...)`, `toast.dismiss(id)` */
export const toast = Object.assign(
  (title: React.ReactNode, options: Omit<ToastOptions, "title"> = {}) => upsert({ ...options, title }),
  {
    success: make("success"),
    error: make("error"),
    warning: make("warning"),
    info: make("info"),
    loading: make("loading"),
    custom: (options: ToastOptions) => upsert(options),
    dismiss,
    /** Shows a loading toast, then swaps it for the outcome. */
    promise<T>(promise: Promise<T>, messages: ToastPromiseMessages<T>, options: Omit<ToastOptions, "title" | "type"> = {}) {
      const id = upsert({ ...options, title: messages.loading, type: "loading" });
      promise.then(
        (value) =>
          upsert({
            ...options,
            id,
            type: "success",
            title: typeof messages.success === "function" ? (messages.success as (v: T) => React.ReactNode)(value) : messages.success,
          }),
        (error) =>
          upsert({
            ...options,
            id,
            type: "error",
            title:
              typeof messages.error === "function"
                ? (messages.error as (e: unknown) => React.ReactNode)(error)
                : messages.error,
          }),
      );
      return promise;
    },
  },
);

/* ------------------------------------------------------------------ */
/* viewport                                                            */
/* ------------------------------------------------------------------ */

const TYPE_ICON: Record<ToastType, React.ReactNode> = {
  default: null,
  success: <CircleCheck className="size-4 text-success" />,
  error: <CircleAlert className="size-4 text-error" />,
  warning: <TriangleAlert className="size-4 text-warning" />,
  info: <Info className="size-4 text-info" />,
  loading: <LoaderCircle className="size-4 animate-spin text-primary" />,
};

const POSITION_CLASS: Record<ToastPosition, string> = {
  "top-left": "top-4 left-4 items-start",
  "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
  "top-right": "top-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-4 right-4 items-end",
};

export interface ToasterProps extends Omit<React.ComponentPropsWithoutRef<"section">, "children"> {
  position?: ToastPosition;
  /** Cards behind the front one peek out instead of stacking in a list. */
  stacked?: boolean;
  /** How many stay mounted. */
  visibleToasts?: number;
  /** Pause the timers while the pointer is over the stack. */
  pauseOnHover?: boolean;
  closeButton?: boolean;
  gap?: number;
  width?: number;
}

/** Only the first mounted Toaster renders, so two of them never double every toast. */
let viewportOwner: symbol | null = null;
const viewportTokens = new Set<symbol>();
const viewportListeners = new Set<() => void>();

function emitViewport() {
  viewportListeners.forEach((listener) => listener());
}

function subscribeViewport(listener: () => void) {
  viewportListeners.add(listener);
  return () => viewportListeners.delete(listener);
}

function registerViewport(token: symbol) {
  viewportTokens.add(token);
  if (viewportOwner === null) viewportOwner = token;
  emitViewport();
}

function unregisterViewport(token: symbol) {
  viewportTokens.delete(token);
  if (viewportOwner === token) viewportOwner = viewportTokens.values().next().value ?? null;
  emitViewport();
}

export const Toaster = React.forwardRef<HTMLElement, ToasterProps>(function Toaster(
  {
    position = "bottom-right",
    stacked = true,
    visibleToasts = 4,
    pauseOnHover = true,
    closeButton = true,
    gap = 12,
    width = 356,
    className,
    style,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    onKeyDown,
    ...rest
  },
  forwardedRef,
) {
  const items = React.useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => toasts,
    () => toasts,
  );

  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [heights, setHeights] = React.useState<Map<string | number, number>>(() => new Map());
  const sectionRef = React.useRef<HTMLElement>(null);
  const isTop = position.startsWith("top");

  const setSectionRef = React.useCallback(
    (node: HTMLElement | null) => {
      sectionRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
    },
    [forwardedRef],
  );

  const token = React.useRef<symbol | null>(null);
  if (token.current === null) token.current = Symbol("toaster");
  const owner = React.useSyncExternalStore(subscribeViewport, () => viewportOwner, () => viewportOwner);
  const owns = owner === token.current;

  React.useEffect(() => {
    const mine = token.current!;
    registerViewport(mine);
    return () => unregisterViewport(mine);
  }, []);

  React.useEffect(() => {
    if (!owns) return;
    setToastTimersPaused(pauseOnHover && (hovered || focused));
    syncToastTimers(items);
  }, [focused, hovered, items, owns, pauseOnHover]);

  React.useEffect(() => {
    if (items.length > 0) return;
    setHovered(false);
    setFocused(false);
  }, [items.length]);

  React.useLayoutEffect(() => {
    if (focused && !sectionRef.current?.contains(document.activeElement)) setFocused(false);
  }, [focused, items]);

  React.useEffect(() => {
    const liveIds = new Set(items.map((item) => item.id));
    setHeights((current) => {
      if ([...current.keys()].every((id) => liveIds.has(id))) return current;
      return new Map([...current].filter(([id]) => liveIds.has(id)));
    });
  }, [items]);

  const recordHeight = React.useCallback((id: string | number, height: number) => {
    setHeights((current) => {
      if (current.get(id) === height) return current;
      const next = new Map(current);
      next.set(id, height);
      return next;
    });
  }, []);

  if (!owns) return null;

  // newest first, so the front card is the most recent one
  const ordered = [...items].reverse().slice(0, Math.max(0, visibleToasts));
  const open = hovered || focused || !stacked;
  const offsets = ordered.map((_, index) => {
    if (!open) return index * 14;
    let offset = index * gap;
    for (let previous = 0; previous < index; previous += 1) {
      offset += heights.get(ordered[previous]!.id) ?? 0;
    }
    return offset;
  });
  const lastIndex = ordered.length - 1;
  const stackHeight =
    lastIndex < 0
      ? 0
      : open
        ? offsets[lastIndex]! + (heights.get(ordered[lastIndex]!.id) ?? 0)
        : heights.get(ordered[0]!.id) ?? 0;

  return (
    <Portal>
      <section
        {...rest}
        ref={setSectionRef}
        data-slot="toaster"
        onMouseEnter={(event) => {
          onMouseEnter?.(event);
          setHovered(true);
        }}
        onMouseLeave={(event) => {
          onMouseLeave?.(event);
          setHovered(false);
        }}
        onFocus={(event) => {
          onFocus?.(event);
          setFocused(true);
        }}
        onBlur={(event) => {
          onBlur?.(event);
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented || event.key !== "Escape" || !ordered[0]) return;
          event.preventDefault();
          event.stopPropagation();
          dismiss(ordered[0].id);
        }}
        className={cn("pointer-events-none fixed z-1060 flex flex-col", POSITION_CLASS[position], className)}
        style={{ width, maxWidth: "calc(100vw - 2rem)", ...style }}
      >
        <div
          data-slot="toaster-stack"
          className="relative w-full"
          style={{ height: stackHeight, pointerEvents: open ? "auto" : undefined }}
        >
          {ordered.map((item, i) => (
            <ToastCard
              key={item.id}
              toast={item}
              index={i}
              open={open}
              isTop={isTop}
              offset={offsets[i] ?? 0}
              closeButton={closeButton}
              onHeight={recordHeight}
            />
          ))}
        </div>
      </section>
    </Portal>
  );
});

function ToastCard({
  toast: item,
  index,
  open,
  isTop,
  offset,
  closeButton,
  onHeight,
}: {
  toast: ToastRecord;
  index: number;
  open: boolean;
  isTop: boolean;
  offset: number;
  closeButton: boolean;
  onHeight: (id: string | number, height: number) => void;
}) {
  const [drag, setDrag] = React.useState(0);
  const start = React.useRef<number | null>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const scale = open ? 1 : Math.max(0.8, 1 - index * 0.05);
  const direction = isTop ? 1 : -1;

  React.useLayoutEffect(() => {
    const node = cardRef.current;
    if (!node) return;
    const measure = () => onHeight(item.id, node.offsetHeight);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [item.id, onHeight]);

  const onPointerDown = (e: React.PointerEvent) => {
    start.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (start.current === null) return;
    setDrag(e.clientX - start.current);
  };
  const onPointerUp = () => {
    if (Math.abs(drag) > 80) dismiss(item.id);
    start.current = null;
    setDrag(0);
  };

  return (
    <div
      ref={cardRef}
      data-slot="toast"
      data-type={item.type}
      role={item.type === "error" || item.type === "warning" ? "alert" : "status"}
      tabIndex={index === 0 ? 0 : -1}
      inert={!open && index > 0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className={cn(
        "pointer-events-auto absolute inset-x-0 flex touch-pan-y items-start gap-3 rounded-xl border border-border bg-bg-elevated p-4 shadow-kk",
        "kk-spring-in select-none",
      )}
      style={{
        [isTop ? "top" : "bottom"]: 0,
        transform: `translate3d(${drag}px, ${direction * offset}px, 0) scale(${scale})`,
        opacity: Math.max(0, 1 - Math.abs(drag) / 200),
        zIndex: 100 - index,
        transition: start.current === null ? "transform 0.35s var(--kk-ease-spring-soft), opacity 0.2s linear" : "none",
      }}
    >
      {(item.icon ?? TYPE_ICON[item.type]) && (
        <span className="mt-0.5 shrink-0">{item.icon ?? TYPE_ICON[item.type]}</span>
      )}

      <div className="min-w-0 flex-1">
        {item.title && <div className="text-sm font-medium text-text-heading">{item.title}</div>}
        {item.description && <div className="mt-0.5 text-sm text-text-secondary">{item.description}</div>}

        {(item.action || item.cancel) && (
          <div className="mt-2.5 flex gap-2">
            {item.action && (
              <button
                type="button"
                onClick={() => {
                  item.action!.onClick();
                  dismiss(item.id);
                }}
                className="kk-press rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-white"
              >
                {item.action.label}
              </button>
            )}
            {item.cancel && (
              <button
                type="button"
                onClick={() => {
                  item.cancel!.onClick();
                  dismiss(item.id);
                }}
                className="kk-press rounded-md border border-border px-2.5 py-1 text-xs text-text"
              >
                {item.cancel.label}
              </button>
            )}
          </div>
        )}
      </div>

      {closeButton && (
        <button
          type="button"
          aria-label="Close"
          onClick={() => dismiss(item.id)}
          className="shrink-0 rounded-full p-0.5 text-text-quaternary transition-colors hover:bg-fill-tertiary hover:text-text"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
