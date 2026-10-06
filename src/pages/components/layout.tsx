import { useState, type ReactNode } from "react";
import { SiteHeader } from "@/components/docs/site-header";
import { Sidebar } from "@/components/docs/sidebar";
import { PageTransition } from "@/components/docs/motion";
import { useLocation, Outlet } from "react-router-dom";
import { Portal } from "@/components/ui/portal";

export default function ComponentsLayout({ children }: { children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  return (
    <>
      <SiteHeader onMenu={() => setOpen(true)} />
      <div className="mx-auto flex max-w-[1400px] px-4 lg:px-6">
        <aside className="kk-scrollbar sticky top-16 hidden h-[calc(100vh-4rem)] w-56 shrink-0 overflow-y-auto border-r border-border-secondary py-6 pr-3 lg:block">
          <Sidebar />
        </aside>
        <main className="min-w-0 flex-1 py-8 lg:pl-10 overflow-x-clip">
          <PageTransition trigger={pathname}>{children ?? <Outlet />}</PageTransition>
        </main>
      </div>

      {open && (
        <Portal>
          <div
            className="fixed inset-0 z-50 bg-bg-mask backdrop-blur-xs animate-in fade-in-0 duration-200 lg:hidden"
            onClick={() => setOpen(false)}
          />
          <div
            className="kk-scrollbar fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-bg-container p-4 shadow-kk-drawer outline-none animate-in slide-in-from-left duration-200 lg:hidden"
          >
            <Sidebar onNavigate={() => setOpen(false)} />
          </div>
        </Portal>
      )}
    </>
  );
}
