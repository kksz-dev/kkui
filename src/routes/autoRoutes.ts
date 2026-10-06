import { createElement, lazy, type ComponentType } from "react";
import { COMPONENT_GROUPS, type RouteMeta } from "@/types";

type PageModule = { default: ComponentType<{ children?: React.ReactNode }> };
type Loader = () => Promise<PageModule>;

const CHUNK_RELOAD_KEY = "kkui:chunk-reload";

function clearChunkReloadMarker(): void {
  sessionStorage.removeItem(CHUNK_RELOAD_KEY);
  const url = new URL(window.location.href);
  if (url.searchParams.has("_chunk_reload")) {
    url.searchParams.delete("_chunk_reload");
    window.history.replaceState(window.history.state, "", url.toString());
  }
}

function reloadAfterChunkError(): void {
  // A stale chunk should recover after fetching a fresh index once. Guard the
  // retry so a persistent CDN/extension failure does not create a reload loop.
  if (sessionStorage.getItem(CHUNK_RELOAD_KEY) === window.location.pathname) return;

  sessionStorage.setItem(CHUNK_RELOAD_KEY, window.location.pathname);
  const url = new URL(window.location.href);
  url.searchParams.set("_chunk_reload", Date.now().toString());
  window.location.replace(url.toString());
}

export function safeLazy(loader: Loader): React.LazyExoticComponent<ComponentType<any>> {
  return lazy(async () => {
    try {
      const module = await loader();
      clearChunkReloadMarker();
      return module;
    } catch (err) {
      console.error("Chunk load error, reloading page:", err);
      const msg = err instanceof Error ? err.message : String(err);
      if (
        msg.includes("Failed to fetch") ||
        msg.includes("dynamically imported module") ||
        msg.includes("MIME type") ||
        msg.includes("Failed to load module script")
      ) {
        reloadAfterChunkError();
      }
      throw err;
    }
  });
}

// Glob from /src directly (not @) so paths match at build time.
const pageModules = import.meta.glob("/src/pages/**/page.tsx") as Record<string, Loader>;
const metaModules = import.meta.glob("/src/pages/**/metadata.ts", { eager: true }) as Record<
  string,
  { default: RouteMeta }
>;
const layoutModules = import.meta.glob("/src/pages/**/layout.tsx") as Record<string, Loader>;
const loadingModule = import.meta.glob("/src/pages/loading.tsx", { eager: true }) as Record<
  string,
  PageModule
>;

function toRoutePath(file: string): string {
  return (
    file
      .replace(/^.*\/pages/, "")
      .replace(/\/page\.tsx$/, "")
      .replace(/\[(.+?)\]/g, ":$1")
      .replace(/\/index$/, "") || "/"
  );
}

function nearestLayout(routePath: string): Loader | undefined {
  const segments = routePath.split("/").filter(Boolean);
  while (segments.length > 0) {
    const key = `/src/pages/${segments.join("/")}/layout.tsx`;
    if (key in layoutModules) return layoutModules[key];
    segments.pop();
  }
  return undefined;
}

export interface RouteItem {
  path: string;
  element: React.LazyExoticComponent<ComponentType<{ children?: React.ReactNode }>>;
  meta?: RouteMeta;
  layout?: Loader;
}

export const RoutesApp: RouteItem[] = Object.entries(pageModules).map(([file, loader]) => {
  const path = toRoutePath(file);
  const metaKey = file.replace(/page\.tsx$/, "metadata.ts");
  return {
    path,
    element: safeLazy(loader),
    meta: metaModules[metaKey]?.default,
    layout: nearestLayout(path),
  };
});

/** Root layout (src/pages/layout.tsx) wraps every route. */
export const RootLayout = layoutModules["/src/pages/layout.tsx"]
  ? safeLazy(layoutModules["/src/pages/layout.tsx"])
  : undefined;

export const GlobalLoading =
  loadingModule["/src/pages/loading.tsx"]?.default ??
  (() => createElement("div", { className: "p-6 text-text-tertiary" }, "Loading..."));

/** Component docs entries, derived from metadata — used by sidebar/search/overview. */
export interface ComponentEntry extends RouteMeta {
  slug: string;
  path: string;
}

export const componentEntries: ComponentEntry[] = Object.entries(metaModules)
  .filter(([file]) => file.startsWith("/src/pages/components/") && file.split("/").length === 6)
  .map(([file, mod]) => {
    const slug = file.split("/")[4]!;
    return { ...mod.default, slug, path: `/components/${slug}` };
  })
  .sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.title.localeCompare(b.title));

/** The components in sidebar order — one flat list, used by the doc pager. */
export const orderedComponents: ComponentEntry[] = COMPONENT_GROUPS.flatMap((group) =>
  componentEntries.filter((c) => c.group === group),
);
