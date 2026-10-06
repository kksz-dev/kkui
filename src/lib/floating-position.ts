export type FloatingPlacement =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight"
  | "leftTop"
  | "leftBottom"
  | "rightTop"
  | "rightBottom";

export interface FloatingOptions {
  /** Flip / clamp the popup so it stays inside the viewport (default true). */
  autoAdjustOverflow?: boolean;
  /** Extra pixel nudge applied after placement. */
  offsetX?: number;
  offsetY?: number;
}

/** Width/height of a popup, read straight from layout so a running scale/zoom
 *  animation cannot shrink the numbers the placement math depends on. */
export function measureFloating(el: HTMLElement): FloatingSize {
  return { width: el.offsetWidth, height: el.offsetHeight };
}

export interface FloatingSize {
  width: number;
  height: number;
}

export function computeFloatingPosition(
  triggerRect: DOMRect,
  contentRect: FloatingSize,
  placement: FloatingPlacement,
  offset = 8,
  options: FloatingOptions = {},
): { top: number; left: number } {
  const { autoAdjustOverflow = true, offsetX = 0, offsetY = 0 } = options;
  const scrollX = window.scrollX || document.documentElement.scrollLeft;
  const scrollY = window.scrollY || document.documentElement.scrollTop;

  let top = 0;
  let left = 0;

  switch (placement) {
    case "top":
      top = triggerRect.top - contentRect.height - offset;
      left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
      break;
    case "topLeft":
      top = triggerRect.top - contentRect.height - offset;
      left = triggerRect.left;
      break;
    case "topRight":
      top = triggerRect.top - contentRect.height - offset;
      left = triggerRect.right - contentRect.width;
      break;
    case "bottom":
      top = triggerRect.bottom + offset;
      left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
      break;
    case "bottomLeft":
      top = triggerRect.bottom + offset;
      left = triggerRect.left;
      break;
    case "bottomRight":
      top = triggerRect.bottom + offset;
      left = triggerRect.right - contentRect.width;
      break;
    case "left":
      top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
      left = triggerRect.left - contentRect.width - offset;
      break;
    case "leftTop":
      top = triggerRect.top;
      left = triggerRect.left - contentRect.width - offset;
      break;
    case "leftBottom":
      top = triggerRect.bottom - contentRect.height;
      left = triggerRect.left - contentRect.width - offset;
      break;
    case "right":
      top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
      left = triggerRect.right + offset;
      break;
    case "rightTop":
      top = triggerRect.top;
      left = triggerRect.right + offset;
      break;
    case "rightBottom":
      top = triggerRect.bottom - contentRect.height;
      left = triggerRect.right + offset;
      break;
  }

  // Viewport containment
  if (!autoAdjustOverflow) {
    return { top: top + scrollY + offsetY, left: left + scrollX + offsetX };
  }

  const padding = 8;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  if (left < padding) left = padding;
  if (left + contentRect.width > viewportWidth - padding) {
    left = Math.max(padding, viewportWidth - contentRect.width - padding);
  }

  if (top < padding && placement.startsWith("top")) top = triggerRect.bottom + offset;
  if (top + contentRect.height > viewportHeight - padding && placement.startsWith("bottom")) {
    top = Math.max(padding, triggerRect.top - contentRect.height - offset);
  }
  if (placement.startsWith("left") || placement.startsWith("right")) {
    // side placements: keep the popup inside the viewport vertically
    top = Math.max(padding, Math.min(top, viewportHeight - contentRect.height - padding));
  }

  return {
    top: top + scrollY + offsetY,
    left: left + scrollX + offsetX,
  };
}

/**
 * `computeFloatingPosition` returns page coordinates, which only line up when the
 * popup is a child of <body>. Inside a `getPopupContainer` target the same point
 * has to be expressed relative to that container's padding box.
 */
export function toContainerCoords(
  position: { top: number; left: number },
  container: HTMLElement | null | undefined,
): { top: number; left: number } {
  if (!container || container === document.body) return position;
  const rect = container.getBoundingClientRect();
  const scrollX = window.scrollX || document.documentElement.scrollLeft;
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  return {
    top: position.top - (rect.top + scrollY) + container.scrollTop,
    left: position.left - (rect.left + scrollX) + container.scrollLeft,
  };
}
