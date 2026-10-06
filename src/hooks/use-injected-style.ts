import * as React from "react";

const injected = new Set<string>();

/**
 * Put a stylesheet into <head> once per id, no matter how many instances of a
 * component are mounted. Rendering a <style> tag per instance duplicates the
 * same keyframes dozens of times on a busy page.
 */
export function useInjectedStyle(id: string, css: string): void {
  React.useLayoutEffect(() => {
    if (typeof document === "undefined" || injected.has(id)) return;
    const el = document.createElement("style");
    el.dataset.kkui = id;
    el.textContent = css;
    document.head.appendChild(el);
    injected.add(id);
  }, [id, css]);
}
