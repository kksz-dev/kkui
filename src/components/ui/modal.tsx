import * as React from "react";
import { createRoot, type Root } from "react-dom/client";
import { X, AlertCircle, CheckCircle2, Info, AlertTriangle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Portal } from "@/components/ui/portal";
import { useWatermarkPanelRef } from "@/components/ui/watermark";

export type ModalType = "info" | "success" | "error" | "warning" | "confirm";

/** Keep in sync with the enter/exit animation durations below. */
const MOTION_DURATION = 200;

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

export interface ModalSlotClassNames {
  header?: string;
  body?: string;
  footer?: string;
  mask?: string;
  wrapper?: string;
  content?: string;
}

export interface ModalSlotStyles {
  header?: React.CSSProperties;
  body?: React.CSSProperties;
  footer?: React.CSSProperties;
  mask?: React.CSSProperties;
  wrapper?: React.CSSProperties;
  content?: React.CSSProperties;
}

export interface ModalProps {
  open?: boolean;
  onCancel?: (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement> | React.KeyboardEvent) => void;
  onOk?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<unknown>;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode | ((props: { OkBtn: React.ComponentType; CancelBtn: React.ComponentType }) => React.ReactNode);
  okText?: React.ReactNode;
  cancelText?: React.ReactNode;
  okType?: ButtonProps["type"];
  okButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  confirmLoading?: boolean;
  centered?: boolean;
  width?: number | string;
  closable?: boolean;
  /** Custom close icon, `false` hides the close button. */
  closeIcon?: React.ReactNode | boolean;
  /** Render the dimming mask. */
  mask?: boolean;
  maskClosable?: boolean;
  /** Close on Escape. */
  keyboard?: boolean;
  /** Unmount children after close. */
  destroyOnClose?: boolean;
  /** Render (hidden) before the first open, so children mount early. */
  forceRender?: boolean;
  /** Called after the close animation finished. */
  afterClose?: () => void;
  /** Called when the open state settles. */
  afterOpenChange?: (open: boolean) => void;
  /** Return focus to the element that had it before opening. */
  focusTriggerAfterClose?: boolean;
  /** Show a skeleton instead of the body content. */
  loading?: boolean;
  /** Wrap the dialog panel, e.g. with a drag handler or a <form>. */
  modalRender?: (node: React.ReactNode) => React.ReactNode;
  /** Portal target; `false` renders in place. */
  getContainer?: HTMLElement | (() => HTMLElement) | false;
  className?: string;
  /** Class on both the mask and the wrapper. */
  rootClassName?: string;
  /** Class on the scrollable wrapper. */
  wrapClassName?: string;
  classNames?: ModalSlotClassNames;
  styles?: ModalSlotStyles;
  /** Shorthand for `styles.body`. */
  bodyStyle?: React.CSSProperties;
  zIndex?: number;
}

export function Modal({
  open = false,
  onCancel,
  onOk,
  title,
  children,
  footer,
  okText = "OK",
  cancelText = "Cancel",
  okType = "primary",
  okButtonProps,
  cancelButtonProps,
  confirmLoading = false,
  centered = false,
  width = 520,
  closable = true,
  closeIcon,
  mask = true,
  maskClosable = true,
  keyboard = true,
  destroyOnClose = false,
  forceRender = false,
  afterClose,
  afterOpenChange,
  focusTriggerAfterClose = true,
  loading = false,
  modalRender,
  getContainer,
  className,
  rootClassName,
  wrapClassName,
  classNames: slotClassNames,
  styles: slotStyles,
  bodyStyle,
  zIndex = 1000,
}: ModalProps) {
  const [internalLoading, setInternalLoading] = React.useState(false);
  const [rendered, setRendered] = React.useState(open || forceRender);
  const [exiting, setExiting] = React.useState(false);
  const [settled, setSettled] = React.useState(false);
  const okLoading = confirmLoading || internalLoading;

  const dialogRef = React.useRef<HTMLDivElement>(null);
  const panelWatermarkRef = useWatermarkPanelRef(dialogRef);
  const lastActive = React.useRef<HTMLElement | null>(null);
  const prevOpen = React.useRef(false);
  const titleId = React.useId();

  const afterCloseRef = React.useRef(afterClose);
  afterCloseRef.current = afterClose;
  const afterOpenChangeRef = React.useRef(afterOpenChange);
  afterOpenChangeRef.current = afterOpenChange;
  const onCancelRef = React.useRef(onCancel);
  onCancelRef.current = onCancel;

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
      afterCloseRef.current?.();
    }, MOTION_DURATION);
    return () => window.clearTimeout(timer);
  }, [open, destroyOnClose]);

  /* body scroll lock (only while a mask covers the page) + Escape */
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && keyboard) onCancelRef.current?.(e as unknown as React.KeyboardEvent);
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

  /* focus the dialog on open, restore the trigger on close */
  React.useEffect(() => {
    if (!open) return;
    lastActive.current = document.activeElement as HTMLElement | null;
    const raf = requestAnimationFrame(() => {
      const node = dialogRef.current;
      if (!node || node.contains(document.activeElement)) return;
      const target = node.querySelector<HTMLElement>("[autofocus]") ?? node;
      target.focus();
    });
    return () => {
      cancelAnimationFrame(raf);
      if (focusTriggerAfterClose) lastActive.current?.focus?.();
    };
  }, [open, focusTriggerAfterClose]);

  const handleOk = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!onOk) return;
    try {
      const res = onOk(e);
      if (res && typeof (res as Promise<unknown>).then === "function") {
        setInternalLoading(true);
        await res;
      }
    } catch {
      /* a rejected onOk keeps the dialog open */
    } finally {
      setInternalLoading(false);
    }
  };

  /* keep Tab inside the dialog */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !dialogRef.current) return;
    const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (n) => n.offsetParent !== null,
    );
    if (!nodes.length) {
      e.preventDefault();
      dialogRef.current.focus();
      return;
    }
    const first = nodes[0]!;
    const last = nodes[nodes.length - 1]!;
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === dialogRef.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const OkBtn: React.FC = () => (
    <Button type={okType} loading={okLoading} onClick={handleOk} {...okButtonProps}>
      {okText}
    </Button>
  );

  const CancelBtn: React.FC = () => (
    <Button
      disabled={okLoading}
      onClick={onCancel as unknown as React.MouseEventHandler<HTMLButtonElement>}
      {...cancelButtonProps}
    >
      {cancelText}
    </Button>
  );

  const renderFooter = () => {
    if (footer === null) return null;
    const content =
      typeof footer === "function" ? (
        footer({ OkBtn, CancelBtn })
      ) : footer !== undefined ? (
        footer
      ) : (
        <>
          <CancelBtn />
          <OkBtn />
        </>
      );
    return (
      <div
        className={cn(
          "flex items-center justify-end gap-2 border-t border-border-secondary pt-3",
          slotClassNames?.footer,
        )}
        style={slotStyles?.footer}
      >
        {content}
      </div>
    );
  };

  if (!rendered) return null;

  const visible = open || exiting;
  const state = open ? "open" : "closed";
  const hiddenStyle: React.CSSProperties | undefined = visible ? undefined : { display: "none" };
  const showClose = closable && closeIcon !== false;
  const inline = getContainer === false;
  const position = inline ? "absolute" : "fixed";

  const panel = (
    <div
      ref={panelWatermarkRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      // a closed-but-kept dialog must not be announced
      aria-hidden={!visible || undefined}
      data-slot="modal"
      data-state={state}
      tabIndex={-1}
      className={cn(
        "relative w-full rounded-xl border border-border bg-bg-elevated p-6 shadow-kk outline-none",
        "ease-kk-in-out",
        // the panel arrives on a spring, and leaves quickly
        "data-[state=open]:kk-spring-in",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-150",
        slotClassNames?.content,
        className,
      )}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        maxWidth: "calc(100vw - 32px)",
        ...slotStyles?.content,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {title && (
        <div
          id={titleId}
          className={cn("mb-3 flex items-center justify-between pr-6 text-base font-semibold text-text-heading", slotClassNames?.header)}
          style={slotStyles?.header}
        >
          {title}
        </div>
      )}
      {showClose && (
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-md p-1.5 text-text-tertiary transition-colors duration-mid hover:bg-fill-tertiary hover:text-text"
          aria-label="Close"
        >
          {closeIcon && closeIcon !== true ? closeIcon : <X className="size-4" />}
        </button>
      )}
      <div
        className={cn("py-2 text-sm text-text-secondary", slotClassNames?.body)}
        style={{ ...bodyStyle, ...slotStyles?.body }}
      >
        {loading ? (
          <div className="space-y-3 py-1" aria-busy="true">
            <div className="kk-shimmer h-4 w-2/5 rounded-sm" />
            <div className="kk-shimmer h-3 w-full rounded-sm" />
            <div className="kk-shimmer h-3 w-4/5 rounded-sm" />
          </div>
        ) : (
          children
        )}
      </div>
      {renderFooter()}
    </div>
  );

  const body = (
    <>
      {mask && (
        <div
          aria-hidden="true"
          data-state={state}
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
      <div
        className={cn(
          position,
          "kk-scrollbar inset-0 flex justify-center overflow-y-auto p-4",
          centered ? "min-h-full items-center" : "items-start pt-24",
          rootClassName,
          wrapClassName,
          slotClassNames?.wrapper,
        )}
        style={{ zIndex: zIndex + 1, ...hiddenStyle, ...slotStyles?.wrapper }}
        onKeyDown={handleKeyDown}
        onClick={(e) => {
          if (e.target === e.currentTarget && maskClosable) onCancel?.(e);
        }}
      >
        {modalRender ? modalRender(panel) : panel}
      </div>
    </>
  );

  if (inline) return body;
  const container = typeof getContainer === "function" ? getContainer() : getContainer;
  return <Portal container={container || undefined}>{body}</Portal>;
}

/* ---------------- Dynamic modals: Modal.confirm / useModal ---------------- */

export interface ModalFuncProps {
  title?: React.ReactNode;
  content?: React.ReactNode;
  icon?: React.ReactNode;
  okText?: React.ReactNode;
  cancelText?: React.ReactNode;
  okType?: ButtonProps["type"];
  okButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  /** Show the Cancel button. Defaults to `true` for `confirm`, `false` for the others. */
  okCancel?: boolean;
  centered?: boolean;
  width?: number | string;
  className?: string;
  zIndex?: number;
  closable?: boolean;
  mask?: boolean;
  maskClosable?: boolean;
  keyboard?: boolean;
  /** Which button receives focus when the dialog opens. */
  autoFocusButton?: "ok" | "cancel" | null;
  getContainer?: HTMLElement | (() => HTMLElement) | false;
  onOk?: () => void | Promise<unknown>;
  onCancel?: () => void;
  afterClose?: () => void;
}

export interface ModalFuncReturn {
  destroy: () => void;
  update: (props: ModalFuncProps | ((prev: ModalFuncProps) => ModalFuncProps)) => void;
}

export interface ModalHookApi {
  confirm: (props: ModalFuncProps) => ModalFuncReturn;
  info: (props: ModalFuncProps) => ModalFuncReturn;
  success: (props: ModalFuncProps) => ModalFuncReturn;
  error: (props: ModalFuncProps) => ModalFuncReturn;
  warning: (props: ModalFuncProps) => ModalFuncReturn;
}

const modalIcons: Record<ModalType, React.ReactNode> = {
  info: <Info className="size-5 text-info" />,
  success: <CheckCircle2 className="size-5 text-success" />,
  error: <AlertCircle className="size-5 text-error" />,
  warning: <AlertTriangle className="size-5 text-warning" />,
  confirm: <HelpCircle className="size-5 text-warning" />,
};

interface ConfirmItem {
  id: number;
  type: ModalType;
  props: ModalFuncProps;
  open: boolean;
}

let confirmSeed = 0;

class ModalStore {
  private items: ConfirmItem[] = [];
  private listeners = new Set<() => void>();

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  getSnapshot = (): ConfirmItem[] => this.items;

  private emit(items: ConfirmItem[]) {
    this.items = items;
    this.listeners.forEach((fn) => fn());
  }

  add(type: ModalType, props: ModalFuncProps): ModalFuncReturn {
    const id = ++confirmSeed;
    this.emit([...this.items, { id, type, props, open: true }]);
    return {
      destroy: () => this.close(id),
      update: (next) =>
        this.emit(
          this.items.map((i) =>
            i.id === id ? { ...i, props: typeof next === "function" ? next(i.props) : { ...i.props, ...next } } : i,
          ),
        ),
    };
  }

  close(id: number) {
    this.emit(this.items.map((i) => (i.id === id ? { ...i, open: false } : i)));
  }

  remove(id: number) {
    this.emit(this.items.filter((i) => i.id !== id));
  }

  closeAll() {
    this.emit(this.items.map((i) => ({ ...i, open: false })));
  }
}

function ConfirmDialog({ item, store }: { item: ConfirmItem; store: ModalStore }) {
  const { props, type } = item;
  const okCancel = props.okCancel ?? type === "confirm";
  const autoFocusButton = props.autoFocusButton === undefined ? "ok" : props.autoFocusButton;

  return (
    <Modal
      open={item.open}
      centered={props.centered ?? true}
      width={props.width ?? 416}
      className={props.className}
      zIndex={props.zIndex}
      closable={props.closable ?? false}
      mask={props.mask}
      maskClosable={props.maskClosable ?? false}
      keyboard={props.keyboard ?? true}
      getContainer={props.getContainer}
      okText={props.okText ?? "OK"}
      cancelText={props.cancelText ?? "Cancel"}
      okType={props.okType ?? "primary"}
      okButtonProps={{ autoFocus: autoFocusButton === "ok", ...props.okButtonProps }}
      cancelButtonProps={{ autoFocus: autoFocusButton === "cancel", ...props.cancelButtonProps }}
      footer={okCancel ? undefined : ({ OkBtn }) => <OkBtn />}
      afterClose={() => {
        store.remove(item.id);
        props.afterClose?.();
      }}
      onCancel={() => {
        props.onCancel?.();
        store.close(item.id);
      }}
      onOk={async () => {
        await props.onOk?.();
        store.close(item.id);
      }}
    >
      <div className="flex gap-3 pt-1">
        <div className="shrink-0 pt-0.5">{props.icon ?? modalIcons[type]}</div>
        <div className="min-w-0 flex-1">
          {props.title && <div className="text-base font-semibold text-text-heading">{props.title}</div>}
          {props.content && <div className="mt-2 text-sm text-text-secondary">{props.content}</div>}
        </div>
      </div>
    </Modal>
  );
}

function ModalHost({ store }: { store: ModalStore }) {
  const items = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  return (
    <>
      {items.map((item) => (
        <ConfirmDialog key={item.id} item={item} store={store} />
      ))}
    </>
  );
}

function createApi(store: ModalStore): ModalHookApi {
  return {
    confirm: (props) => store.add("confirm", props),
    info: (props) => store.add("info", props),
    success: (props) => store.add("success", props),
    error: (props) => store.add("error", props),
    warning: (props) => store.add("warning", props),
  };
}

/** `const [modal, contextHolder] = Modal.useModal()` — dialogs stay inside the React tree. */
export function useModal(): [ModalHookApi, React.ReactElement] {
  const [store] = React.useState(() => new ModalStore());
  const api = React.useMemo(() => createApi(store), [store]);
  React.useEffect(() => () => store.closeAll(), [store]);
  return [api, <ModalHost store={store} />];
}

let globalStore: ModalStore | null = null;
let globalRoot: Root | null = null;

function getGlobalStore(): ModalStore {
  if (!globalStore) globalStore = new ModalStore();
  if (!globalRoot && typeof document !== "undefined") {
    const host = document.createElement("div");
    host.setAttribute("data-kkui-host", "modal");
    document.body.appendChild(host);
    globalRoot = createRoot(host);
    globalRoot.render(<ModalHost store={globalStore} />);
  }
  return globalStore;
}

Modal.confirm = (props: ModalFuncProps) => getGlobalStore().add("confirm", props);
Modal.info = (props: ModalFuncProps) => getGlobalStore().add("info", props);
Modal.success = (props: ModalFuncProps) => getGlobalStore().add("success", props);
Modal.error = (props: ModalFuncProps) => getGlobalStore().add("error", props);
Modal.warning = (props: ModalFuncProps) => getGlobalStore().add("warning", props);
Modal.destroyAll = () => getGlobalStore().closeAll();
Modal.useModal = useModal;
