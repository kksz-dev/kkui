import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SiteHeader } from "@/components/docs/site-header";

export default function RootLayout({ children }: { children?: ReactNode }) {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
      return;
    }
    // Lazy pages mount after the browser's native hash jump — retry briefly until the target exists.
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    let raf = 0;
    const scroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView();
        return;
      }
      if (++tries < 90) raf = window.requestAnimationFrame(scroll);
    };
    raf = window.requestAnimationFrame(scroll);
    return () => window.cancelAnimationFrame(raf);
  }, [pathname, hash]);
  // component & docs pages render their own header (with menu button)
  const hasOwnHeader = pathname.startsWith("/components") || pathname.startsWith("/docs");
  return (
    <div className="min-h-screen bg-bg-container">
      {!hasOwnHeader && <SiteHeader />}
      {children}
    </div>
  );
}
