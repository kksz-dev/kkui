import * as React from "react";

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
export type ScreenMap = Partial<Record<Breakpoint, boolean>>;

/** Largest first, the order the resolvers walk when picking a responsive value. */
export const responsiveArray: Breakpoint[] = ["xxl", "xl", "lg", "md", "sm", "xs"];

export const responsiveMap: Record<Breakpoint, string> = {
  xs: "(max-width: 575px)",
  sm: "(min-width: 576px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 992px)",
  xl: "(min-width: 1200px)",
  xxl: "(min-width: 1600px)",
};

/**
 * One media-query set for the whole app.
 *
 * Every component used to open its own six MediaQueryLists, so a page full of
 * responsive Cols registered thousands of listeners and kept the browser busy.
 * Here the queries are created once and components merely subscribe.
 */
const EMPTY: ScreenMap = {};

let queries: { bp: Breakpoint; mql: MediaQueryList }[] | null = null;
let snapshot: ScreenMap = EMPTY;
const subscribers = new Set<() => void>();

function ensureQueries() {
  if (queries || typeof window === "undefined" || typeof window.matchMedia !== "function") return;
  queries = responsiveArray.map((bp) => ({ bp, mql: window.matchMedia(responsiveMap[bp]) }));
  const read = () => {
    const next: ScreenMap = {};
    for (const { bp, mql } of queries!) next[bp] = mql.matches;
    // keep the object identity stable while nothing actually changed
    const same = responsiveArray.every((bp) => snapshot[bp] === next[bp]);
    if (!same) {
      snapshot = next;
      subscribers.forEach((fn) => fn());
    }
  };
  read();
  for (const { mql } of queries) mql.addEventListener("change", read);
}

function subscribe(onChange: () => void) {
  ensureQueries();
  subscribers.add(onChange);
  return () => {
    subscribers.delete(onChange);
  };
}

const getSnapshot = () => snapshot;
const getServerSnapshot = () => EMPTY;

/** Subscribe to KKUI breakpoints — returns `{ xs, sm, md, lg, xl, xxl }` booleans. */
export function useBreakpoint(): ScreenMap {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Pick the value of the largest matching breakpoint from a responsive object. */
export function resolveResponsive<T>(value: Partial<Record<Breakpoint, T>>, screens: ScreenMap): T | undefined {
  for (const bp of responsiveArray) {
    if (screens[bp] && value[bp] !== undefined) return value[bp];
  }
  return undefined;
}
