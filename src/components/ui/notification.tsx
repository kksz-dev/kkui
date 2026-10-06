import * as React from "react";
import { createRoot, type Root } from "react-dom/client";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Portal } from "@/components/ui/portal";

/**
 * Notification — rich, stackable notices anchored to a corner of the screen.
 *
 * `const [api, contextHolder] = notification.useNotification()` keeps the notices inside
 * the React tree; the static `notification.success({...})` mounts its own root on <body>.
 */

export type NotificationType = "info" | "success" | "error" | "warning" | "open";
export type NotificationPlacement = "topRight" | "bottomRight" | "topLeft" | "bottomLeft" | "top" | "bottom";

export interface NotificationConfig {
  message: React.ReactNode;
  description?: React.ReactNode;
  /** Footer actions (5.24 name). */
  actions?: React.ReactNode;
  /** Legacy single-action node; used when `actions` is not given. */
  btn?: React.ReactNode;
  /** Seconds before auto close, `0` never closes by itself. */
  duration?: number;
  type?: NotificationType;
  icon?: React.ReactNode;
  /** Reusing a key updates the notice in place and restarts its timer. */
  key?: string | number;
  placement?: NotificationPlacement;
  /** ARIA live role of the card. */
  role?: "alert" | "status";
  /** `false` hides the close button, a node replaces the default ✕. */
  closeIcon?: React.ReactNode | boolean;
  /** Draw a timer bar along the bottom edge. */
  showProgress?: boolean;
  /** Freeze the timer while the pointer is over the card. */
  pauseOnHover?: boolean;
  onClose?: () => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface NotificationGlobalConfig {
  placement?: NotificationPlacement;
  /** Offset from the top edge for `top*` placements, px. */
  top?: number;
  /** Offset from the bottom edge for `bottom*` placements, px. */
  bottom?: number;
  duration?: number;
  /** Maximum notices kept per placement; the oldest closes first. */
  maxCount?: number;
  rtl?: boolean;
  closeIcon?: React.ReactNode | boolean;
  showProgress?: boolean;
  pauseOnHover?: boolean;
  /** Collapse notices into a pile once there are more than `threshold` of them. */
  stack?: boolean | { threshold?: number };
  /** Render inside this element instead of the viewport (needs `position: relative`). */
  getContainer?: () => HTMLElement;
}

export type NotificationCloser = () => void;

export interface NotificationInstance {
  open: (config: NotificationConfig) => NotificationCloser;
  info: (config: NotificationConfig) => NotificationCloser;
  success: (config: NotificationConfig) => NotificationCloser;
  error: (config: NotificationConfig) => NotificationCloser;
  warning: (config: NotificationConfig) => NotificationCloser;
  destroy: (key?: string | number) => void;
}

interface NotificationItem extends Omit<NotificationConfig, "key" | "duration" | "type" | "placement"> {
  id: string | number;
  type: NotificationType;
  placement: NotificationPlacement;
  /** seconds */
  duration: number;
  /** ms left on the timer (only changes when paused) */
  remaining: number;
  paused: boolean;
  closing: boolean;
}

interface NotificationSnapshot {
  items: NotificationItem[];
  config: NotificationGlobalConfig;
}

/** Keep in sync with the exit animation duration below. */
const MOTION_DURATION = 200;
const STACK_OFFSET = 8;

const icons: Record<NotificationType, React.ReactNode> = {
  info: <Info className="mt-0.5 size-5 shrink-0 text-info" />,
  success: <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />,
  error: <AlertCircle className="mt-0.5 size-5 shrink-0 text-error" />,
  warning: <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" />,
  open: null,
};

const PLACEMENTS: NotificationPlacement[] = ["topRight", "bottomRight", "topLeft", "bottomLeft", "top", "bottom"];

let seed = 0;

/* ------------------------------------------------------------------ */
/* store                                                               */
/* ------------------------------------------------------------------ */

class NotificationStore {
  private snapshot: NotificationSnapshot = { items: [], config: {} };
  private listeners = new Set<() => void>();
  private timers = new Map<string | number, number>();
  private starts = new Map<string | number, number>();

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  getSnapshot = (): NotificationSnapshot => this.snapshot;

  private emit(items: NotificationItem[] = this.snapshot.items, config: NotificationGlobalConfig = this.snapshot.config) {
    this.snapshot = { items, config };
    this.listeners.forEach((fn) => fn());
  }

  private patch(key: string | number, patch: Partial<NotificationItem>) {
    this.emit(this.snapshot.items.map((i) => (i.id === key ? { ...i, ...patch } : i)));
  }

  configure(next: NotificationGlobalConfig) {
    this.emit(this.snapshot.items, { ...this.snapshot.config, ...next });
  }

  open(config: NotificationConfig): NotificationCloser {
    const global = this.snapshot.config;
    const id = config.key ?? `kk-notification-${++seed}`;
    const duration = config.duration ?? global.duration ?? 4.5;
    const placement = config.placement ?? global.placement ?? "topRight";
    const { key: _key, duration: _duration, type: _type, placement: _placement, ...rest } = config;

    const item: NotificationItem = {
      ...rest,
      id,
      type: config.type ?? "open",
      placement,
      duration,
      remaining: duration * 1000,
      paused: false,
      closing: false,
      closeIcon: config.closeIcon ?? global.closeIcon,
      showProgress: config.showProgress ?? global.showProgress,
      pauseOnHover: config.pauseOnHover ?? global.pauseOnHover ?? true,
      role: config.role ?? "alert",
    };

    // reusing a key must kill the timer of the notice it replaces
    this.clearTimer(id);

    const items = [...this.snapshot.items];
    const index = items.findIndex((i) => i.id === id);
    if (index > -1) items[index] = item;
    else items.push(item);
    this.emit(items);

    const { maxCount } = global;
    if (maxCount && maxCount > 0) {
      const alive = items.filter((i) => !i.closing && i.id !== id && i.placement === placement);
      alive.slice(0, Math.max(0, alive.length + 1 - maxCount)).forEach((i) => this.close(i.id));
    }

    this.startTimer(item, item.remaining);
    return () => this.close(id);
  }

  close(key: string | number) {
    const item = this.snapshot.items.find((i) => i.id === key);
    if (!item || item.closing) return;
    this.clearTimer(key);
    this.patch(key, { closing: true });
    window.setTimeout(() => {
      const current = this.snapshot.items.find((i) => i.id === key);
      if (!current || !current.closing) return; // replaced with the same key meanwhile
      this.emit(this.snapshot.items.filter((i) => i.id !== key));
      item.onClose?.();
    }, MOTION_DURATION);
  }

  /** `destroy(key)` closes one notice (in whichever placement holds it), `destroy()` closes all. */
  destroy(key?: string | number) {
    if (key !== undefined) this.close(key);
    else this.snapshot.items.forEach((i) => this.close(i.id));
  }

  pause(key: string | number) {
    const item = this.snapshot.items.find((i) => i.id === key);
    const timer = this.timers.get(key);
    if (!item || item.paused || timer === undefined) return;
    window.clearTimeout(timer);
    this.timers.delete(key);
    const elapsed = Date.now() - (this.starts.get(key) ?? Date.now());
    this.patch(key, { paused: true, remaining: Math.max(0, item.remaining - elapsed) });
  }

  resume(key: string | number) {
    const item = this.snapshot.items.find((i) => i.id === key);
    if (!item || !item.paused) return;
    this.patch(key, { paused: false });
    this.startTimer(item, item.remaining);
  }

  private startTimer(item: NotificationItem, remaining: number) {
    if (item.duration <= 0) return;
    this.starts.set(item.id, Date.now());
    this.timers.set(item.id, window.setTimeout(() => this.close(item.id), remaining));
  }

  private clearTimer(key: string | number) {
    const timer = this.timers.get(key);
    if (timer !== undefined) window.clearTimeout(timer);
    this.timers.delete(key);
    this.starts.delete(key);
  }
}

function createInstance(store: NotificationStore): NotificationInstance {
  const typed = (type: NotificationType) => (config: NotificationConfig) => store.open({ ...config, type });
  return {
    open: (config) => store.open(config),
    info: typed("info"),
    success: typed("success"),
    error: typed("error"),
    warning: typed("warning"),
    destroy: (key) => store.destroy(key),
  };
}

/* ------------------------------------------------------------------ */
/* rendering                                                           */
/* ------------------------------------------------------------------ */

function ProgressBar({ duration, remaining, paused }: { duration: number; remaining: number; paused: boolean }) {
  const total = duration * 1000;
  const percent = total > 0 ? Math.max(0, Math.min(100, (remaining / total) * 100)) : 0;
  const [style, setStyle] = React.useState<React.CSSProperties>({ width: `${percent}%`, transitionDuration: "0ms" });

  React.useEffect(() => {
    setStyle({ width: `${percent}%`, transitionDuration: "0ms" });
    if (paused) return;
    const raf = requestAnimationFrame(() => setStyle({ width: "0%", transitionDuration: `${remaining}ms` }));
    return () => cancelAnimationFrame(raf);
  }, [paused, remaining, percent]);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 overflow-hidden rounded-b-xl bg-fill-quaternary"
      aria-hidden="true"
    >
      <div className="h-full bg-primary transition-[width] ease-linear" style={style} />
    </div>
  );
}

interface NodeProps {
  item: NotificationItem;
  store: NotificationStore;
  rtl?: boolean;
  stackStyle?: React.CSSProperties;
  inert?: boolean;
}

const enterClass: Record<NotificationPlacement, string> = {
  topRight: "data-[state=open]:slide-in-from-right-4 data-[state=closed]:slide-out-to-right-4",
  bottomRight: "data-[state=open]:slide-in-from-right-4 data-[state=closed]:slide-out-to-right-4",
  topLeft: "data-[state=open]:slide-in-from-left-4 data-[state=closed]:slide-out-to-left-4",
  bottomLeft: "data-[state=open]:slide-in-from-left-4 data-[state=closed]:slide-out-to-left-4",
  top: "data-[state=open]:slide-in-from-top-4 data-[state=closed]:slide-out-to-top-4",
  bottom: "data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:slide-out-to-bottom-4",
};

function NotificationNode({ item, store, rtl, stackStyle, inert }: NodeProps) {
  const actions = item.actions ?? item.btn;
  const showClose = item.closeIcon !== false;
  return (
    <div
      data-slot="notification"
      data-state={item.closing ? "closed" : "open"}
      role={item.role}
      style={{ ...stackStyle, ...item.style }}
      dir={rtl ? "rtl" : undefined}
      onClick={item.onClick}
      onMouseEnter={() => item.pauseOnHover && store.pause(item.id)}
      onMouseLeave={() => item.pauseOnHover && store.resume(item.id)}
      className={cn(
        "pointer-events-auto relative flex w-96 max-w-[calc(100vw-32px)] items-start gap-3 overflow-hidden rounded-xl border border-border bg-bg-elevated p-4 shadow-kk",
        "duration-200 ease-kk-in-out",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        enterClass[item.placement],
        item.onClick && "kk-press cursor-pointer",
        inert && "pointer-events-none",
        item.className,
      )}
    >
      {item.icon ?? icons[item.type]}
      <div className={cn("min-w-0 flex-1", showClose && "pr-5")}>
        <div className="text-sm font-semibold text-text-heading">{item.message}</div>
        {item.description && (
          <div className="mt-1 text-xs leading-relaxed text-text-secondary">{item.description}</div>
        )}
        {actions && <div className="mt-3 flex items-center justify-end gap-2">{actions}</div>}
      </div>
      {showClose && (
        <button
          type="button"
          aria-label="Close"
          onClick={(e) => {
            e.stopPropagation();
            store.close(item.id);
          }}
          className={cn(
            "absolute top-3 rounded-md p-1 text-text-tertiary transition-colors duration-mid hover:bg-fill-tertiary hover:text-text",
            rtl ? "left-3" : "right-3",
          )}
        >
          {item.closeIcon && item.closeIcon !== true ? item.closeIcon : <X className="size-4" />}
        </button>
      )}
      {item.showProgress && item.duration > 0 && (
        <ProgressBar duration={item.duration} remaining={item.remaining} paused={item.paused} />
      )}
    </div>
  );
}

const containerClass: Record<NotificationPlacement, string> = {
  topRight: "right-6 items-end",
  bottomRight: "right-6 items-end",
  topLeft: "left-6 items-start",
  bottomLeft: "left-6 items-start",
  top: "left-1/2 -translate-x-1/2 items-center",
  bottom: "left-1/2 -translate-x-1/2 items-center",
};

function NotificationStackGroup({
  placement,
  items,
  store,
  config,
  absolute,
}: {
  placement: NotificationPlacement;
  items: NotificationItem[];
  store: NotificationStore;
  config: NotificationGlobalConfig;
  absolute: boolean;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const stack = config.stack ?? true;
  const threshold = (typeof stack === "object" ? stack.threshold : undefined) ?? 3;
  const collapsed = stack !== false && items.length > threshold && !expanded;
  const fromTop = placement.startsWith("top");

  const offsetStyle: React.CSSProperties = fromTop
    ? { top: config.top ?? 24 }
    : { bottom: config.bottom ?? 24 };

  return (
    <div
      className={cn(
        "pointer-events-none",
        absolute ? "absolute" : "fixed",
        collapsed ? "grid" : "flex flex-col gap-3",
        containerClass[placement],
      )}
      style={{ ...offsetStyle, zIndex: 1010 }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {items.map((item, index) => {
        const depth = items.length - 1 - index;
        const stackStyle: React.CSSProperties | undefined = collapsed
          ? {
              gridArea: "1 / 1",
              alignSelf: fromTop ? "start" : "end",
              transform: `translateY(${(fromTop ? depth : -depth) * STACK_OFFSET}px) scale(${1 - depth * 0.04})`,
              transformOrigin: fromTop ? "top center" : "bottom center",
              opacity: depth > 2 ? 0 : 1,
              zIndex: items.length - depth,
              transition: "transform 200ms var(--kk-ease-out), opacity 200ms var(--kk-ease-out)",
            }
          : undefined;
        return (
          <NotificationNode
            key={item.id}
            item={item}
            store={store}
            rtl={config.rtl}
            stackStyle={stackStyle}
            inert={collapsed && depth > 0}
          />
        );
      })}
    </div>
  );
}

function NotificationHolder({ store }: { store: NotificationStore }) {
  const { items, config } = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const container = config.getContainer?.();

  const groups = PLACEMENTS.map((placement) => ({
    placement,
    list: items.filter((i) => i.placement === placement),
  })).filter((g) => g.list.length > 0);

  if (!groups.length) return null;

  const node = (
    <>
      {groups.map((group) => (
        <NotificationStackGroup
          key={group.placement}
          placement={group.placement}
          items={group.list}
          store={store}
          config={config}
          absolute={!!container}
        />
      ))}
    </>
  );

  return container ? <Portal container={container}>{node}</Portal> : node;
}

/* ------------------------------------------------------------------ */
/* hook + static API                                                   */
/* ------------------------------------------------------------------ */

/** `const [api, contextHolder] = useNotification()` — render `contextHolder` in your tree. */
export function useNotification(
  config?: NotificationGlobalConfig,
): [NotificationInstance, React.ReactElement] {
  const [store] = React.useState(() => new NotificationStore());
  const api = React.useMemo(() => createInstance(store), [store]);
  const { placement, top, bottom, duration, maxCount, rtl, closeIcon, showProgress, pauseOnHover, stack, getContainer } =
    config ?? {};

  React.useEffect(() => {
    store.configure({ placement, top, bottom, duration, maxCount, rtl, closeIcon, showProgress, pauseOnHover, stack, getContainer });
  }, [store, placement, top, bottom, duration, maxCount, rtl, closeIcon, showProgress, pauseOnHover, stack, getContainer]);

  React.useEffect(() => () => store.destroy(), [store]);

  const contextHolder = <NotificationHolder store={store} />;
  return [api, contextHolder];
}

let globalStore: NotificationStore | null = null;
let globalRoot: Root | null = null;

function getGlobalStore(): NotificationStore {
  if (!globalStore) globalStore = new NotificationStore();
  if (!globalRoot && typeof document !== "undefined") {
    const host = document.createElement("div");
    host.setAttribute("data-kkui-host", "notification");
    document.body.appendChild(host);
    globalRoot = createRoot(host);
    globalRoot.render(<NotificationHolder store={globalStore} />);
  }
  return globalStore;
}

export const notification: NotificationInstance & {
  /** Global defaults for the static API. */
  config: (config: NotificationGlobalConfig) => void;
  useNotification: typeof useNotification;
} = {
  open: (config) => createInstance(getGlobalStore()).open(config),
  info: (config) => createInstance(getGlobalStore()).info(config),
  success: (config) => createInstance(getGlobalStore()).success(config),
  error: (config) => createInstance(getGlobalStore()).error(config),
  warning: (config) => createInstance(getGlobalStore()).warning(config),
  destroy: (key) => getGlobalStore().destroy(key),
  config: (config) => getGlobalStore().configure(config),
  useNotification,
};
