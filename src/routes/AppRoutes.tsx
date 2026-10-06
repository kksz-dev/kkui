import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { GlobalLoading, RootLayout, RoutesApp, safeLazy } from "./autoRoutes";
import { ui, useLocale } from "@/i18n/locale";

const ComponentsLayout = safeLazy(() => import("@/pages/components/layout"));
const DocsLayout = safeLazy(() => import("@/pages/docs/layout"));

export function AppRoutes() {
  const componentRoutes = RoutesApp.filter((r) => r.path.startsWith("/components"));
  const docRoutes = RoutesApp.filter((r) => r.path.startsWith("/docs"));
  const otherRoutes = RoutesApp.filter(
    (r) => !r.path.startsWith("/components") && !r.path.startsWith("/docs"),
  );

  const inner = (
    <Routes>
      {/* Nested Layout for /components/* */}
      <Route element={<ComponentsLayout />}>
        <Route path="/components" element={<Navigate to="/components/overview" replace />} />
        {componentRoutes.map((item) => {
          const Page = item.element;
          return <Route key={item.path} path={item.path} element={<Page />} />;
        })}
        <Route path="/components/*" element={<NotFound />} />
      </Route>

      {/* Nested Layout for /docs/* */}
      <Route element={<DocsLayout />}>
        <Route path="/docs" element={<Navigate to="/docs/getting-started" replace />} />
        {docRoutes.map((item) => {
          const Page = item.element;
          return <Route key={item.path} path={item.path} element={<Page />} />;
        })}
        <Route path="/docs/*" element={<NotFound />} />
      </Route>

      {/* Top-level pages e.g. / */}
      {otherRoutes.map((item) => {
        const Page = item.element;
        return <Route key={item.path} path={item.path} element={<Page />} />;
      })}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  // RootLayout (src/pages/layout.tsx) adds the site header on top-level pages and scroll-to-top on navigation.
  return (
    <Suspense fallback={<GlobalLoading />}>
      {RootLayout ? <RootLayout>{inner}</RootLayout> : inner}
    </Suspense>
  );
}

function NotFound() {
  const { l } = useLocale();
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 text-center">
      <div className="text-h1 font-semibold text-text-heading">404</div>
      <p className="text-text-secondary">{l(ui.notFoundTitle)}</p>
    </div>
  );
}
