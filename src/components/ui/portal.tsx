import * as React from "react";
import { createPortal } from "react-dom";

/** Anything that can name a mount node: the node itself, a CSS selector, or a getter. */
export type PortalContainer = HTMLElement | string | (() => HTMLElement | null) | null | undefined;

export interface PortalProps {
  children: React.ReactNode;
  /** Where to mount. Defaults to `document.body`. */
  container?: PortalContainer;
  /** Render inline (no portal) — useful for tests and for `getPopupContainer` opt-outs. */
  disabled?: boolean;
  /** @deprecated the portal always mounts its children on the first render. */
  forceRender?: boolean;
  /** Called once the portal has attached to its container. */
  onMount?: (container: HTMLElement) => void;
}

function resolveContainer(container: PortalContainer): HTMLElement | null {
  if (typeof document === "undefined") return null;
  if (!container) return document.body;
  if (typeof container === "string") return document.querySelector<HTMLElement>(container);
  if (typeof container === "function") return container();
  return container;
}

export function Portal({ children, container, disabled = false, onMount }: PortalProps) {
  // Resolve on the first render, not in an effect: a popup that mounts one commit
  // late measures itself as missing, and anything positioning against it (DatePicker,
  // Select, Dropdown) is left pinned at the top-left corner of the page.
  const [target, setTarget] = React.useState<HTMLElement | null>(() => resolveContainer(container));

  React.useLayoutEffect(() => {
    if (disabled) return;
    const node = resolveContainer(container);
    setTarget((prev) => (prev === node ? prev : node));
    if (node) onMount?.(node);
  }, [container, disabled, onMount]);

  if (disabled) return <>{children}</>;
  if (!target) return null;

  return createPortal(children, target);
}
