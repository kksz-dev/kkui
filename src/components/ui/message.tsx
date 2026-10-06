import * as React from "react";
import { createRoot, type Root } from "react-dom/client";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Portal } from "@/components/ui/portal";

/**
 * Message — lightweight global feedback toasts.
 *
 * Two ways to use it:
 *   `const [api, contextHolder] = message.useMessage()` — renders inside the React tree
 *     (keeps theme / context / portals of the app), the recommended way.
 *   `message.success("...")` — static shortcut, mounts its own root on <body>.
 */

export type MessageType = "info" | "success" | "error" | "warning" | "loading";

export interface MessageConfig {
  content: React.ReactNode;
  /** Seconds before auto close. `0` keeps it until closed (adds a close button). */
  duration?: number;
  type?: MessageType;
  icon?: React.ReactNode;
  /** Reusing a key replaces the toast in place (and restarts its timer). */
  key?: string | number;
  onClose?: () => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface MessageGlobalConfig {
  /** Distance from the top of the viewport, px. */
  top?: number;
  /** Default duration in seconds for every toast. */
  duration?: number;
  /** Maximum toasts on screen; the oldest is closed first. */
  maxCount?: number;
  /** Right-to-left layout. */
  rtl?: boolean;
  /** Render the stack inside this element instead of the viewport (needs `position: relative`). */
  getContainer?: () => HTMLElement;
}

/** Closes the toast it came from. */
export type MessageCloser = () => void;

/** `content` shorthand, or the full config object. */
export type MessageArgs = React.ReactNode | MessageConfig;

export interface MessageInstance {
  open: (config: MessageConfig) => MessageCloser;
  info: (content: MessageArgs, duration?: number, onClose?: () => void) => MessageCloser;
  success: (content: MessageArgs, duration?: number, onClose?: () => void) => MessageCloser;
  error: (content: MessageArgs, duration?: number, onClose?: () => void) => MessageCloser;
  warning: (content: MessageArgs, duration?: number, onClose?: () => void) => MessageCloser;
  loading: (content: MessageArgs, duration?: number, onClose?: () => void) => MessageCloser;
  destroy: (key?: string | number) => void;
}

interface MessageItem {
  id: string | number;
  content: React.ReactNode;
  type: MessageType;
  /** seconds, already resolved against the global config */
  duration: number;
  icon?: React.ReactNode;
  onClose?: () => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  style?: React.CSSProperties;
  closing: boolean;
}

interface MessageSnapshot {
  items: MessageItem[];
  config: MessageGlobalConfig;
}

/** Keep in sync with the exit animation duration below. */
const MOTION_DURATION = 200;

const icons: Record<MessageType, React.ReactNode> = {
  info: <Info className="size-4 shrink-0 text-info" />,
  success: <CheckCircle2 className="size-4 shrink-0 text-success" />,
  error: <AlertCircle className="size-4 shrink-0 text-error" />,
  warning: <AlertTriangle className="size-4 shrink-0 text-warning" />,
  loading: <Loader2 className="size-4 shrink-0 animate-spin text-primary" />,
};

let seed = 0;

function isConfig(v: MessageArgs): v is MessageConfig {
  return typeof v === "object" && v !== null && !React.isValidElement(v) && "content" in v;
}

/* ------------------------------------------------------------------ */
/* store                                                               */
/* ------------------------------------------------------------------ */

class MessageStore {
  private snapshot: MessageSnapshot = { items: [], config: {} };
  private listeners = new Set<() => void>();
  private timers = new Map<string | number, { timer?: number; start: number; remaining: number }>();

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  getSnapshot = (): MessageSnapshot => this.snapshot;

  private emit(items: MessageItem[] = this.snapshot.items, config: MessageGlobalConfig = this.snapshot.config) {
    this.snapshot = { items, config };
    this.listeners.forEach((fn) => fn());
  }

  configure(next: MessageGlobalConfig) {
    this.emit(this.snapshot.items, { ...this.snapshot.config, ...next });
  }

  open(config: MessageConfig): MessageCloser {
    const id = config.key ?? `kk-message-${++seed}`;
    const type = config.type ?? "info";
    const duration = config.duration ?? this.snapshot.config.duration ?? (type === "loading" ? 0 : 3);
    const item: MessageItem = {
      id,
      content: config.content,
      type,
      duration,
      icon: config.icon,
      onClose: config.onClose,
      onClick: config.onClick,
      className: config.className,
      style: config.style,
      closing: false,
    };

    // reusing a key must kill the timer of the toast it replaces
    this.clearTimer(id);

    const items = [...this.snapshot.items];
    const index = items.findIndex((i) => i.id === id);
    if (index > -1) items[index] = item;
    else items.push(item);
    this.emit(items);

    const { maxCount } = this.snapshot.config;
    if (maxCount && maxCount > 0) {
      const alive = items.filter((i) => !i.closing && i.id !== id);
      alive.slice(0, Math.max(0, alive.length + 1 - maxCount)).forEach((i) => this.close(i.id));
    }

    this.startTimer(item);
    return () => this.close(id);
  }

  close(key: string | number) {
    const item = this.snapshot.items.find((i) => i.id === key);
    if (!item || item.closing) return;
    this.clearTimer(key);
    this.emit(this.snapshot.items.map((i) => (i.id === key ? { ...i, closing: true } : i)));
    window.setTimeout(() => {
      const current = this.snapshot.items.find((i) => i.id === key);
      if (!current || !current.closing) return; // reopened with the same key meanwhile
      this.emit(this.snapshot.items.filter((i) => i.id !== key));
      item.onClose?.();
    }, MOTION_DURATION);
  }

  destroy(key?: string | number) {
    if (key !== undefined) this.close(key);
    else this.snapshot.items.forEach((i) => this.close(i.id));
  }

  pause(key: string | number) {
    const entry = this.timers.get(key);
    if (!entry || entry.timer === undefined) return;
    window.clearTimeout(entry.timer);
    this.timers.set(key, {
      start: entry.start,
      remaining: Math.max(0, entry.remaining - (Date.now() - entry.start)),
    });
  }

  resume(key: string | number) {
    const entry = this.timers.get(key);
    if (!entry || entry.timer !== undefined) return;
    const item = this.snapshot.items.find((i) => i.id === key);
    if (!item) return;
    this.startTimer(item, entry.remaining);
  }

  private startTimer(item: MessageItem, remaining = item.duration * 1000) {
    if (item.duration <= 0) return;
    const timer = window.setTimeout(() => this.close(item.id), remaining);
    this.timers.set(item.id, { timer, start: Date.now(), remaining });
  }

  private clearTimer(key: string | number) {
    const entry = this.timers.get(key);
    if (entry?.timer !== undefined) window.clearTimeout(entry.timer);
    this.timers.delete(key);
  }
}

function createInstance(store: MessageStore): MessageInstance {
  const shorthand =
    (type: MessageType) => (content: MessageArgs, duration?: number, onClose?: () => void) =>
      store.open(
        isConfig(content)
          ? { type, duration, onClose, ...content }
          : { content, type, duration, onClose },
      );

  return {
    open: (config) => store.open(config),
    info: shorthand("info"),
    success: shorthand("success"),
    error: shorthand("error"),
    warning: shorthand("warning"),
    loading: shorthand("loading"),
    destroy: (key) => store.destroy(key),
  };
}

/* ------------------------------------------------------------------ */
/* rendering                                                           */
/* ------------------------------------------------------------------ */

function MessageNode({ item, store }: { item: MessageItem; store: MessageStore }) {
  const persistent = item.duration <= 0;
  return (
    <div
      data-slot="message"
      data-state={item.closing ? "closed" : "open"}
      role={item.type === "error" || item.type === "warning" ? "alert" : "status"}
      style={item.style}
      onMouseEnter={() => store.pause(item.id)}
      onMouseLeave={() => store.resume(item.id)}
      onClick={item.onClick}
      className={cn(
        "pointer-events-auto flex max-w-full items-center gap-2.5 rounded-lg border border-border bg-bg-elevated px-4 py-2.5 text-sm text-text shadow-kk-secondary",
        "duration-200 ease-kk-in-out",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-3",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        item.onClick && "kk-press cursor-pointer",
        item.className,
      )}
    >
      {item.icon ?? icons[item.type]}
      <span>{item.content}</span>
      {persistent && (
        <button
          type="button"
          aria-label="Close"
          onClick={(e) => {
            e.stopPropagation();
            store.close(item.id);
          }}
          className="-mr-1.5 ml-1 rounded-sm p-0.5 text-text-tertiary transition-colors duration-mid hover:bg-fill-tertiary hover:text-text"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}

function MessageHolder({ store }: { store: MessageStore }) {
  const { items, config } = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  if (!items.length) return null;

  const container = config.getContainer?.();
  const node = (
    <div
      dir={config.rtl ? "rtl" : undefined}
      className={cn(
        "pointer-events-none inset-x-0 flex flex-col items-center gap-2 px-4",
        container ? "absolute" : "fixed",
      )}
      style={{ top: config.top ?? 16, zIndex: 1010 }}
    >
      {items.map((item) => (
        <MessageNode key={item.id} item={item} store={store} />
      ))}
    </div>
  );

  return container ? <Portal container={container}>{node}</Portal> : node;
}

/* ------------------------------------------------------------------ */
/* hook + static API                                                   */
/* ------------------------------------------------------------------ */

/** `const [api, contextHolder] = useMessage()` — render `contextHolder` anywhere in your tree. */
export function useMessage(config?: MessageGlobalConfig): [MessageInstance, React.ReactElement] {
  const [store] = React.useState(() => new MessageStore());
  const api = React.useMemo(() => createInstance(store), [store]);
  const { top, duration, maxCount, rtl, getContainer } = config ?? {};

  React.useEffect(() => {
    store.configure({ top, duration, maxCount, rtl, getContainer });
  }, [store, top, duration, maxCount, rtl, getContainer]);

  React.useEffect(() => () => store.destroy(), [store]);

  const contextHolder = <MessageHolder store={store} />;
  return [api, contextHolder];
}

let globalStore: MessageStore | null = null;
let globalRoot: Root | null = null;

function getGlobalStore(): MessageStore {
  if (!globalStore) globalStore = new MessageStore();
  if (!globalRoot && typeof document !== "undefined") {
    const host = document.createElement("div");
    host.setAttribute("data-kkui-host", "message");
    document.body.appendChild(host);
    globalRoot = createRoot(host);
    globalRoot.render(<MessageHolder store={globalStore} />);
  }
  return globalStore;
}

export const message: MessageInstance & {
  /** Global defaults for the static API: top / duration / maxCount / rtl / getContainer. */
  config: (config: MessageGlobalConfig) => void;
  useMessage: typeof useMessage;
} = {
  open: (config) => createInstance(getGlobalStore()).open(config),
  info: (content, duration, onClose) => createInstance(getGlobalStore()).info(content, duration, onClose),
  success: (content, duration, onClose) => createInstance(getGlobalStore()).success(content, duration, onClose),
  error: (content, duration, onClose) => createInstance(getGlobalStore()).error(content, duration, onClose),
  warning: (content, duration, onClose) => createInstance(getGlobalStore()).warning(content, duration, onClose),
  loading: (content, duration, onClose) => createInstance(getGlobalStore()).loading(content, duration, onClose),
  destroy: (key) => getGlobalStore().destroy(key),
  config: (config) => getGlobalStore().configure(config),
  useMessage,
};
