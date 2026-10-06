import { useCallback, useRef } from "react";

/** Click ripple ("wave"). Spread `{...wave}` on an element that has class `kk-wave`. */
export function useWave<T extends HTMLElement>() {
  const timer = useRef<number | undefined>(undefined);
  const onPointerDown = useCallback((e: React.PointerEvent<T>) => {
    const el = e.currentTarget;
    el.removeAttribute("data-wave");
    // force reflow so re-adding restarts the animation
    void el.offsetWidth;
    el.setAttribute("data-wave", "on");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => el.removeAttribute("data-wave"), 450);
  }, []);
  return { onPointerDown };
}
