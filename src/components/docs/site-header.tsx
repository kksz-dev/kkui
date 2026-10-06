import { Link, NavLink } from "react-router-dom";
import { Github, Moon, Search, Sun, Menu } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { SearchDialog } from "./search-dialog";
import { useState } from "react";
import { Languages } from "lucide-react";
import { ui, useLocale } from "@/i18n/locale";
import { ThemeCustomizerButton } from "./theme-customizer";

const nav = [
  { to: "/components/overview", label: ui.navComponents },
  { to: "/icons", label: ui.navIcons },
  { to: "/components/motion", label: ui.navMotion },
  { to: "/docs/getting-started", label: ui.navDocs },
  { to: "/docs/design-tokens", label: ui.navDesign },
];

export function SiteHeader({ onMenu }: { onMenu?: () => void }) {
  const { theme, toggle } = useTheme();
  const { lang, toggle: toggleLang, l } = useLocale();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border-secondary bg-bg-container/85 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1400px] items-center gap-4 px-4 lg:px-6">
        {onMenu && (
          <button type="button" aria-label={l(ui.menu)} onClick={onMenu} className="rounded-md p-2 text-text-secondary hover:bg-fill-tertiary lg:hidden">
            <Menu className="size-5" />
          </button>
        )}
        <Link to="/" className="flex items-center gap-2 font-semibold text-text-heading">
          <img src="/favicon.svg" alt="" className="size-8" />
          <span className="text-lg tracking-tight">KKUI</span>
          <span className="hidden rounded-full bg-primary-bg px-2 py-0.5 text-[11px] font-medium text-primary sm:inline">v0.1</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="kk-press ml-2 hidden h-9 w-64 items-center gap-2 rounded-lg border border-border bg-bg-container px-3 text-sm text-text-placeholder transition-[border-color,box-shadow] duration-mid hover:border-primary-hover hover:shadow-kk-tertiary md:flex"
        >
          <Search className="size-4" />
          <span className="flex-1 text-left">{l(ui.searchPlaceholder)}</span>
          <kbd className="rounded-sm border border-border px-1.5 font-mono text-[11px] text-text-tertiary">⌘K</kbd>
        </button>
        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                cn("relative rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors duration-mid hover:text-primary", "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform after:duration-mid after:ease-kk-out", isActive && "text-primary after:scale-x-100")
              }
            >
              {l(n.label)}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1 md:ml-2">
          <button type="button" aria-label="Search" onClick={() => setOpen(true)} className="rounded-md p-2 text-text-secondary hover:bg-fill-tertiary md:hidden">
            <Search className="size-4" />
          </button>
          <button type="button" aria-label={l(ui.toggleLang)} title={l(ui.toggleLang)} onClick={toggleLang} className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-text-secondary hover:bg-fill-tertiary">
            <Languages className="size-4" />
            <span className="uppercase">{lang === "th" ? "TH" : "EN"}</span>
          </button>
          <ThemeCustomizerButton />
          <button type="button" aria-label={l(ui.toggleTheme)} onClick={toggle} className="rounded-md p-2 text-text-secondary hover:bg-fill-tertiary">
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <a href="https://github.com/kksz-dev/kkui" target="_blank" rel="noreferrer" aria-label="GitHub" className="rounded-md p-2 text-text-secondary hover:bg-fill-tertiary">
            <Github className="size-4" />
          </a>
        </div>
      </div>
      <SearchDialog open={open} onOpenChange={setOpen} />
    </header>
  );
}
