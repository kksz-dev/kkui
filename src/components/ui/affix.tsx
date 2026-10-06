import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Affix — KKUI sticky wrapper: pins its child to the top / bottom of the
 * viewport (or a `target` container) once the page scrolls past it. A placeholder
 * keeps the document flow intact while the content is fixed.
 */

export type AffixTarget = Window | HTMLElement | null;

export interface AffixProps extends Omit<React.ComponentProps<"div">, "onChange"> {
  /** Offset from the top of the viewport (or target) at which to affix */
  offsetTop?: number;
  /** Offset from the bottom; when set, sticks to the bottom instead */
  offsetBottom?: number;
  /** Scroll container; defaults to window */
  target?: () => AffixTarget;
  /** Fires when the affixed state changes */
  onChange?: (affixed: boolean) => void;
}

const getTargetRect = (target: AffixTarget): DOMRect | { top: number; bottom: number; left: number; width: number } => {
  if (target && target !== window) return (target as HTMLElement).getBoundingClientRect();
  return { top: 0, bottom: window.innerHeight, left: 0, width: window.innerWidth };
};

interface FixedStyle {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  height: number;
}

function Affix({ className, style, offsetTop, offsetBottom, target, onChange, children, ...props }: AffixProps) {
  const placeholderRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [fixed, setFixed] = React.useState<FixedStyle | null>(null);
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;
  const affixedRef = React.useRef(false);

  const mode: "top" | "bottom" = offsetBottom != null && offsetTop == null ? "bottom" : "top";
  const offset = mode === "bottom" ? (offsetBottom as number) : (offsetTop ?? 0);

  const measure = React.useCallback(() => {
    const placeholder = placeholderRef.current;
    const content = contentRef.current;
    if (!placeholder || !content) return;
    const targetNode = target ? target() : window;
    if (!targetNode) return;
    const targetRect = getTargetRect(targetNode);
    const placeholderRect = placeholder.getBoundingClientRect();
    // measure real content size (when fixed the placeholder holds the size)
    const width = affixedRef.current ? placeholderRect.width : content.offsetWidth;
    const height = affixedRef.current ? placeholderRect.height : content.offsetHeight;

    let next: FixedStyle | null = null;
    if (mode === "top") {
      const limit = targetRect.top + offset;
      if (placeholderRect.top < limit) next = { top: limit, left: placeholderRect.left, width, height };
    } else {
      const limit = targetRect.bottom - offset;
      if (placeholderRect.top + height > limit) {
        next = { bottom: window.innerHeight - limit, left: placeholderRect.left, width, height };
      }
    }
    const nowAffixed = next != null;
    setFixed((prev) => {
      if (!prev && !next) return prev;
      if (prev && next && prev.top === next.top && prev.bottom === next.bottom && prev.left === next.left && prev.width === next.width && prev.height === next.height) return prev;
      return next;
    });
    if (nowAffixed !== affixedRef.current) {
      affixedRef.current = nowAffixed;
      onChangeRef.current?.(nowAffixed);
    }
  }, [mode, offset, target]);

  React.useLayoutEffect(() => {
    measure();
    const targetNode = target ? target() : window;
    // capture-phase scroll on window catches nested scroll containers too
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    if (targetNode && targetNode !== window) (targetNode as HTMLElement).addEventListener("scroll", measure);
    const ro = new ResizeObserver(measure);
    if (contentRef.current) ro.observe(contentRef.current);
    if (targetNode && targetNode !== window) ro.observe(targetNode as HTMLElement);
    return () => {
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
      if (targetNode && targetNode !== window) (targetNode as HTMLElement).removeEventListener("scroll", measure);
      ro.disconnect();
    };
  }, [measure, target]);

  return (
    <div
      ref={placeholderRef}
      data-slot="affix"
      data-affixed={fixed ? "" : undefined}
      className={cn(className)}
      style={{ ...(fixed ? { width: fixed.width, height: fixed.height } : null), ...style }}
      {...props}
    >
      <div
        ref={contentRef}
        data-slot="affix-content"
        className={cn(fixed && "z-10")}
        style={fixed ? { position: "fixed", top: fixed.top, bottom: fixed.bottom, left: fixed.left, width: fixed.width, height: fixed.height } : undefined}
      >
        {children}
      </div>
    </div>
  );
}

export { Affix };
