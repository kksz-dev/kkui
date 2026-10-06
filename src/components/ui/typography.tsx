import * as React from "react";
import { Check, Copy, CornerDownLeft, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Typography — KKUI Title / Text / Paragraph / Link with
 * ellipsis (single-line, line-clamp, expandable), copyable and editable.
 */

export type TypographyType = "secondary" | "success" | "warning" | "danger";

export interface EllipsisConfig {
  /** Max lines. 1 = single line `truncate`, >1 = `-webkit-line-clamp` */
  rows?: number;
  /** Show a "more" link when clamped; `"collapsible"` also shows "less" when expanded */
  expandable?: boolean | "collapsible";
  /** Custom expand/collapse symbol */
  symbol?: React.ReactNode | ((expanded: boolean) => React.ReactNode);
  /** Controlled expanded state */
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpand?: (e: React.MouseEvent<HTMLElement>, info: { expanded: boolean }) => void;
  /** Called when the ellipsis state (clamped or not) changes */
  onEllipsis?: (ellipsis: boolean) => void;
  /** Show the full text as a native title tooltip while clamped */
  tooltip?: boolean | string;
  /** Node kept outside the ellipsis and always visible (use it for a middle ellipsis) */
  suffix?: React.ReactNode;
}

export interface CopyConfig {
  /** Text to copy (defaults to string children) */
  text?: string | (() => string | Promise<string>);
  onCopy?: (e?: React.MouseEvent<HTMLElement>) => void;
  /** [copy icon, copied icon] or a single icon */
  icon?: React.ReactNode | [React.ReactNode, React.ReactNode];
  /** false = no tooltip, or [copy label, copied label] */
  tooltips?: boolean | [React.ReactNode, React.ReactNode];
  /** Clipboard MIME type; `text/html` also writes a plain-text flavour */
  format?: "text/plain" | "text/html";
  tabIndex?: number;
}

export interface EditConfig {
  /** Controlled editing state */
  editing?: boolean;
  icon?: React.ReactNode;
  tooltip?: boolean | React.ReactNode;
  /** Text shown in the editor (defaults to string children) */
  text?: string;
  maxLength?: number;
  autoSize?: boolean | { minRows?: number; maxRows?: number };
  /** Which interaction opens the editor */
  triggerType?: ("icon" | "text")[];
  enterIcon?: React.ReactNode;
  onStart?: () => void;
  onChange?: (value: string) => void;
  onCancel?: () => void;
  onEnd?: () => void;
  tabIndex?: number;
}

export interface TypographyBaseProps {
  type?: TypographyType;
  disabled?: boolean;
  mark?: boolean;
  code?: boolean;
  keyboard?: boolean;
  underline?: boolean;
  delete?: boolean;
  strong?: boolean;
  italic?: boolean;
  ellipsis?: boolean | EllipsisConfig;
  copyable?: boolean | CopyConfig;
  editable?: boolean | EditConfig;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  id?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

type Tag = "span" | "div" | "a" | "h1" | "h2" | "h3" | "h4" | "h5";

const typeClass: Record<TypographyType, string> = {
  secondary: "text-text-secondary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-error",
};

/* -------------------------------------------------------------------------- */
/* helpers                                                                    */
/* -------------------------------------------------------------------------- */

function toString(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toString).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) return toString(node.props.children);
  return "";
}

function useControlled<T>(value: T | undefined, defaultValue: T, onChange?: (v: T) => void) {
  const [inner, setInner] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : inner;
  const set = React.useCallback(
    (v: T) => {
      if (!isControlled) setInner(v);
      onChange?.(v);
    },
    [isControlled, onChange],
  );
  return [current, set] as const;
}

/** Tiny hover tooltip used by copy/edit action buttons. */
function ActionButton({
  label,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & { label?: React.ReactNode }) {
  return (
    <span className="group/act relative inline-flex align-baseline">
      <button
        type="button"
        aria-label={typeof label === "string" ? label : undefined}
        className={cn(
          "inline-flex cursor-pointer items-center rounded-sm border-0 bg-transparent p-0 text-primary outline-none transition-colors duration-mid hover:text-primary-hover focus-visible:ring-[3px] focus-visible:ring-primary/30 [&_svg]:size-3.5",
          className,
        )}
        {...props}
      >
        {children}
      </button>
      {label != null && label !== false && (
        <span
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 rounded-md bg-bg-spotlight px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow-kk transition-opacity duration-mid group-hover/act:opacity-100 group-focus-within/act:opacity-100"
        >
          {label}
        </span>
      )}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* editor                                                                     */
/* -------------------------------------------------------------------------- */

function Editable({
  value,
  config,
  className,
  style,
  onSave,
  onCancel,
}: {
  value: string;
  config: EditConfig;
  className?: string;
  style?: React.CSSProperties;
  onSave: (v: string) => void;
  onCancel: () => void;
}) {
  const [text, setText] = React.useState(value);
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const composing = React.useRef(false);
  const autoSize = config.autoSize ?? true;

  const resize = React.useCallback(() => {
    const el = ref.current;
    if (!el || !autoSize) return;
    el.style.height = "auto";
    const lh = parseFloat(getComputedStyle(el).lineHeight) || 22;
    const min = typeof autoSize === "object" && autoSize.minRows ? autoSize.minRows * lh : 0;
    const max = typeof autoSize === "object" && autoSize.maxRows ? autoSize.maxRows * lh : Infinity;
    el.style.height = `${Math.min(Math.max(el.scrollHeight, min), max)}px`;
    el.style.overflowY = el.scrollHeight > max ? "auto" : "hidden";
  }, [autoSize]);

  React.useLayoutEffect(() => {
    resize();
    const el = ref.current;
    el?.focus();
    el?.setSelectionRange(el.value.length, el.value.length);
  }, [resize]);

  return (
    <div data-slot="typography-editor" className={cn("relative -mx-[11px] -my-[5px]", className)} style={style}>
      <textarea
        ref={ref}
        rows={1}
        value={text}
        maxLength={config.maxLength}
        onChange={(e) => {
          setText(e.target.value);
          resize();
        }}
        onCompositionStart={() => (composing.current = true)}
        onCompositionEnd={() => (composing.current = false)}
        onKeyDown={(e) => {
          if (composing.current) return;
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSave(text);
          } else if (e.key === "Escape") {
            onCancel();
          }
        }}
        onBlur={() => onSave(text)}
        className="block w-full resize-none rounded-md border border-primary bg-bg-container px-[11px] py-[4px] font-[inherit] text-[length:inherit] leading-[inherit] font-[inherit] tracking-[inherit] text-text outline-none ring-[3px] ring-primary/10 kk-scrollbar"
      />
      <span className="pointer-events-none absolute right-2.5 bottom-2 text-text-tertiary [&_svg]:size-3.5">
        {config.enterIcon === undefined ? <CornerDownLeft /> : config.enterIcon}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* base                                                                       */
/* -------------------------------------------------------------------------- */

interface BaseProps extends TypographyBaseProps {
  component: Tag;
  href?: string;
  target?: string;
  rel?: string;
}

function Base({
  component,
  type,
  disabled,
  mark,
  code,
  keyboard,
  underline,
  delete: del,
  strong,
  italic,
  ellipsis,
  copyable,
  editable,
  className,
  style,
  title,
  children,
  onClick,
  href,
  target,
  rel,
  id,
}: BaseProps) {
  const isInline = component === "span" || component === "a";
  const textStr = React.useMemo(() => toString(children), [children]);

  /* ---- ellipsis */
  const ell: EllipsisConfig | null = ellipsis ? (ellipsis === true ? {} : ellipsis) : null;
  const rows = ell?.rows ?? 1;
  const [expanded, setExpanded] = useControlled(ell?.expanded, ell?.defaultExpanded ?? false);
  const [clamped, setClamped] = React.useState(false);
  const contentRef = React.useRef<HTMLElement>(null);
  const onEllipsis = ell?.onEllipsis;
  const clampActive = !!ell && !(ell.expandable && expanded);

  React.useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el || !clampActive) {
      setClamped(false);
      return;
    }
    const measure = () => {
      const c = el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1;
      setClamped((prev) => {
        if (prev !== c) onEllipsis?.(c);
        return c;
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [clampActive, rows, children, onEllipsis]);

  /* ---- copyable */
  const copy: CopyConfig | null = copyable ? (copyable === true ? {} : copyable) : null;
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<number>(undefined);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  const doCopy = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const src = copy?.text;
    const value = typeof src === "function" ? await src() : (src ?? textStr);
    try {
      if (copy?.format === "text/html" && typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([value], { type: "text/html" }),
            "text/plain": new Blob([value], { type: "text/plain" }),
          }),
        ]);
      } else {
        await navigator.clipboard.writeText(value);
      }
    } catch {
      /* clipboard blocked: still show feedback */
    }
    setCopied(true);
    copy?.onCopy?.(e);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 3000);
  };

  /* ---- editable */
  const edit: EditConfig | null = editable ? (editable === true ? {} : editable) : null;
  const [editing, setEditing] = useControlled(edit?.editing, false);
  const triggerType = edit?.triggerType ?? ["icon"];
  const startEdit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    edit?.onStart?.();
    setEditing(true);
  };

  const Comp = component;
  const baseClass = cn(
    "text-text",
    type && typeClass[type],
    disabled && "cursor-not-allowed text-text-disabled select-none",
    component === "a" &&
      !disabled &&
      "cursor-pointer text-link no-underline transition-colors duration-mid hover:text-link-hover active:text-link-active",
    component === "a" && disabled && "pointer-events-none",
    component === "h1" && "mb-[0.5em] text-h1 font-semibold text-text-heading [[data-slot^=typography]+&]:mt-[1.2em]",
    component === "h2" && "mb-[0.5em] text-h2 font-semibold text-text-heading [[data-slot^=typography]+&]:mt-[1.2em]",
    component === "h3" && "mb-[0.5em] text-h3 font-semibold text-text-heading [[data-slot^=typography]+&]:mt-[1.2em]",
    component === "h4" && "mb-[0.5em] text-h4 font-semibold text-text-heading [[data-slot^=typography]+&]:mt-[1.2em]",
    component === "h5" && "mb-[0.5em] text-h5 font-semibold text-text-heading [[data-slot^=typography]+&]:mt-[1.2em]",
    component === "div" && "mb-[1em] last:mb-0",
    strong && "font-semibold",
    italic && "italic",
    underline && "underline",
    del && "line-through",
    className,
  );
  const slot = `typography-${component === "a" ? "link" : component === "span" ? "text" : component === "div" ? "paragraph" : "title"}`;

  if (edit && editing) {
    return (
      <Comp data-slot={slot} className={cn(baseClass, "block")} id={id}>
        <Editable
          value={edit.text ?? textStr}
          config={edit}
          onSave={(v) => {
            setEditing(false);
            if (v !== (edit.text ?? textStr)) edit.onChange?.(v);
            edit.onEnd?.();
          }}
          onCancel={() => {
            setEditing(false);
            edit.onCancel?.();
          }}
        />
      </Comp>
    );
  }

  /* ---- decorate content */
  let content: React.ReactNode = children;
  if (mark) content = <mark className="bg-gold-border px-0 text-black/85">{content}</mark>;
  if (code)
    content = (
      <code className="mx-0.5 rounded-sm border border-border-secondary bg-fill-tertiary px-[0.4em] py-[0.2em] font-mono text-[85%] text-inherit">
        {content}
      </code>
    );
  if (keyboard)
    content = (
      <kbd className="mx-0.5 rounded-sm border border-border-secondary border-b-2 bg-fill-tertiary px-[0.4em] py-[0.15em] font-mono text-[90%] text-inherit">
        {content}
      </kbd>
    );

  const canExpand = !!ell?.expandable && (clamped || (expanded && ell.expandable === "collapsible"));
  const symbol =
    typeof ell?.symbol === "function"
      ? ell.symbol(expanded)
      : (ell?.symbol ?? (expanded ? "Collapse" : "more"));

  const actions = (
    <>
      {canExpand && (
        <button
          type="button"
          data-slot="typography-expand"
          className="ml-1 inline cursor-pointer border-0 bg-transparent p-0 text-primary outline-none hover:text-primary-hover focus-visible:underline"
          onClick={(e) => {
            const next = !expanded;
            setExpanded(next);
            ell?.onExpand?.(e, { expanded: next });
          }}
        >
          {symbol}
        </button>
      )}
      {edit && triggerType.includes("icon") && (
        <ActionButton
          className="ml-1"
          label={edit.tooltip === false ? undefined : edit.tooltip === true || edit.tooltip == null ? "Edit" : edit.tooltip}
          tabIndex={edit.tabIndex}
          onClick={startEdit}
        >
          {edit.icon ?? <Pencil />}
        </ActionButton>
      )}
      {copy && (
        <ActionButton
          className={cn("ml-1", copied && "text-success hover:text-success")}
          label={
            copy.tooltips === false
              ? undefined
              : Array.isArray(copy.tooltips)
                ? copy.tooltips[copied ? 1 : 0]
                : copied
                  ? "Copied"
                  : "Copy"
          }
          tabIndex={copy.tabIndex}
          onClick={doCopy}
        >
          {Array.isArray(copy.icon)
            ? copy.icon[copied ? 1 : 0]
            : copied
              ? <Check />
              : (copy.icon ?? <Copy />)}
        </ActionButton>
      )}
    </>
  );
  const hasActions = canExpand || !!edit || !!copy;

  const nativeTitle = title ?? (ell?.tooltip && clamped ? (ell.tooltip === true ? textStr : ell.tooltip) : undefined);
  const linkProps = component === "a" ? { href: disabled ? undefined : href, target, rel: rel ?? (target === "_blank" ? "noopener noreferrer" : undefined) } : {};
  const clickable = edit && triggerType.includes("text") ? startEdit : onClick;

  /* no ellipsis: plain flow */
  if (!ell) {
    return (
      <Comp data-slot={slot} id={id} className={baseClass} style={style} title={nativeTitle} onClick={clickable} {...linkProps}>
        {content}
        {hasActions && actions}
      </Comp>
    );
  }

  const single = rows <= 1;
  const clampStyle: React.CSSProperties | undefined =
    clampActive && !single
      ? { display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: rows, overflow: "hidden" }
      : undefined;
  // The suffix sits next to the ellipsized text instead of inside it, so it never gets cut.
  const suffixNode =
    ell.suffix != null && ell.suffix !== false ? (
      <span data-slot="typography-suffix" className="shrink-0 whitespace-pre">
        {ell.suffix}
      </span>
    ) : null;
  const rowLayout = single || suffixNode != null;

  return (
    <Comp
      data-slot={slot}
      id={id}
      className={cn(baseClass, rowLayout ? (isInline ? "inline-flex max-w-full items-baseline align-bottom" : "flex items-baseline") : "block")}
      style={style}
      title={nativeTitle}
      onClick={clickable}
      {...linkProps}
    >
      <span
        ref={contentRef as React.RefObject<HTMLSpanElement>}
        data-slot="typography-content"
        className={cn(single && clampActive ? "min-w-0 truncate" : "min-w-0", !single && "block")}
        style={clampStyle}
      >
        {content}
      </span>
      {suffixNode}
      {hasActions && <span className="shrink-0">{actions}</span>}
    </Comp>
  );
}

/* -------------------------------------------------------------------------- */
/* public components                                                          */
/* -------------------------------------------------------------------------- */

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  /** Render as another element (default `article`) */
  component?: "article" | "div" | "section";
}

function TypographyRoot({ className, component: Comp = "article", ...props }: TypographyProps) {
  const rest = props as React.HTMLAttributes<HTMLElement>;
  return <Comp data-slot="typography" className={cn("text-sm leading-[1.5714] text-text", className)} {...rest} />;
}

export interface TitleProps extends TypographyBaseProps {
  level?: 1 | 2 | 3 | 4 | 5;
}
function TypographyTitle({ level = 1, ...props }: TitleProps) {
  return <Base component={`h${level}` as Tag} {...props} />;
}

export type TextProps = TypographyBaseProps;
function TypographyText(props: TextProps) {
  return <Base component="span" {...props} />;
}

export type ParagraphProps = TypographyBaseProps;
function TypographyParagraph(props: ParagraphProps) {
  return <Base component="div" {...props} />;
}

export interface LinkProps extends TypographyBaseProps {
  href?: string;
  target?: string;
  rel?: string;
}
function TypographyLink(props: LinkProps) {
  return <Base component="a" {...props} />;
}

const Typography = Object.assign(TypographyRoot, {
  Title: TypographyTitle,
  Text: TypographyText,
  Paragraph: TypographyParagraph,
  Link: TypographyLink,
});

export { Typography, TypographyTitle, TypographyText, TypographyParagraph, TypographyLink };
