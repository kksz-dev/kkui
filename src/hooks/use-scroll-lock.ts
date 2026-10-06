import * as React from "react";

let locks = 0;
let restore: { overflow: string; paddingRight: string } | null = null;

function scrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

/**
 * Freeze background scrolling while an overlay is open.
 *
 * Setting `overflow: hidden` alone removes the scrollbar, the page widens by
 * its width and every element reflows — the jank you see in the first frames of
 * a modal. The gap is padded back here instead, and nested overlays share one
 * lock through a counter.
 */
export function useScrollLock(active: boolean): void {
  React.useEffect(() => {
    if (!active || typeof document === "undefined") return;

    if (locks === 0) {
      const body = document.body;
      restore = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
      const gap = scrollbarWidth();
      body.style.overflow = "hidden";
      if (gap > 0) body.style.paddingRight = `${gap}px`;
    }
    locks += 1;

    return () => {
      locks -= 1;
      if (locks === 0 && restore) {
        document.body.style.overflow = restore.overflow;
        document.body.style.paddingRight = restore.paddingRight;
        restore = null;
      }
    };
  }, [active]);
}
