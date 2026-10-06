import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { componentEntries } from "@/routes/autoRoutes";
import { COMPONENT_GROUPS } from "@/types";
import { cn } from "@/lib/utils";
import { groupLabel, ui, useLocale } from "@/i18n/locale";

const topLinks = [{ to: "/components/overview", label: ui.overview }];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { l } = useLocale();
  const navRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  useEffect(() => {
    // landing deep in the list (e.g. /components/watermark) — centre the active link inside the
    // sidebar's own scroll box without touching window scroll (scrollIntoView would)
    const link = navRef.current?.querySelector<HTMLElement>('a[aria-current="page"]');
    let box = link?.parentElement ?? null;
    while (box && !/(auto|scroll)/.test(getComputedStyle(box).overflowY)) box = box.parentElement;
    if (!link || !box) return;
    const delta = link.getBoundingClientRect().top - box.getBoundingClientRect().top;
    box.scrollTop += delta - (box.clientHeight - link.offsetHeight) / 2;
  }, [pathname]);
  return (
    <nav ref={navRef} aria-label="Components" className="text-sm">
      <ul className="mb-4 space-y-0.5">
        {topLinks.map((link) => (
          <li key={link.to}>
            <SideLink to={link.to} onClick={onNavigate}>
              {l(link.label)}
            </SideLink>
          </li>
        ))}
      </ul>
      {COMPONENT_GROUPS.map((g) => {
        const items = componentEntries.filter((c) => c.group === g);
        if (!items.length) return null;
        return (
          <div key={g} className="mb-4">
            <div className="px-3 pb-1.5 text-xs font-medium text-text-tertiary">{l(groupLabel[g])}</div>
            <ul className="space-y-0.5">
              {items.map((c) => (
                <li key={c.slug}>
                  <SideLink to={c.path} onClick={onNavigate}>
                    <span className="flex-1 truncate">{c.title}</span>
                    {c.wip && <span className="rounded-sm bg-warning-bg px-1 text-[10px] text-warning">{l(ui.wip)}</span>}
                  </SideLink>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

function SideLink({ to, onClick, children }: { to: string; onClick?: () => void; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "relative flex items-center gap-2 rounded-md px-3 py-1.5 text-text transition-[background-color,color] duration-mid ease-kk-in-out hover:bg-fill-tertiary",
          "before:absolute before:top-1/2 before:left-0 before:h-0 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-primary before:transition-[height] before:duration-mid before:ease-kk-out",
          isActive && "bg-control-item-bg-active font-medium text-primary before:h-4 hover:bg-control-item-bg-active",
        )
      }
    >
      {children}
    </NavLink>
  );
}
