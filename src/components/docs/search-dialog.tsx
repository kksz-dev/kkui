import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { componentEntries } from "@/routes/autoRoutes";
import { COMPONENT_GROUPS } from "@/types";
import { groupLabel, ui, useLocale } from "@/i18n/locale";
import { Portal } from "@/components/ui/portal";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { cn } from "@/lib/utils";

export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const navigate = useNavigate();
  const { l } = useLocale();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  useScrollLock(open);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const groups = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return COMPONENT_GROUPS.map((g) => ({
      group: g,
      items: componentEntries.filter((c) => {
        if (c.group !== g) return false;
        if (!normalized) return true;
        return `${c.title} ${c.keywords?.join(" ") ?? ""} ${l(c.description)}`.toLowerCase().includes(normalized);
      }),
    })).filter((entry) => entry.items.length);
  }, [l, query]);
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query, open]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  const go = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (flat.length ? (i + 1) % flat.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0));
    } else if (e.key === "Enter") {
      const hit = flat[active];
      if (hit) {
        e.preventDefault();
        go(hit.path);
      }
    }
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 bg-bg-mask backdrop-blur-xs animate-in fade-in-0 duration-200"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={l(ui.searchPlaceholder)}
        className="fixed top-[15vh] left-1/2 z-50 w-[min(640px,92vw)] -translate-x-1/2 overflow-hidden rounded-xl border border-border-secondary bg-bg-elevated shadow-kk outline-none animate-in fade-in-0 zoom-in-95 duration-200"
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-2 border-b border-border-secondary px-4">
            <Search className="size-4 text-text-tertiary" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder={l(ui.searchPlaceholder)}
              role="combobox"
              aria-expanded="true"
              aria-controls="kkui-search-results"
              aria-activedescendant={flat[active] ? `kkui-search-${flat[active].slug}` : undefined}
              className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-text-placeholder text-text"
            />
          </div>
          <div ref={listRef} id="kkui-search-results" role="listbox" className="kk-scrollbar max-h-[50vh] overflow-y-auto p-2">
            {!groups.length && <div className="px-3 py-8 text-center text-sm text-text-tertiary">{l(ui.noResults)}</div>}
            {groups.map(({ group, items }) => (
              <section key={group} className="mb-2 last:mb-0">
                <h3 className="px-2 py-1.5 text-xs font-medium text-text-tertiary">{l(groupLabel[group])}</h3>
                {items.map((c) => {
                  const idx = flat.indexOf(c);
                  const isActive = idx === active;
                  return (
                    <button
                      key={c.slug}
                      id={`kkui-search-${c.slug}`}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      data-active={isActive}
                      onMouseEnter={() => setActive(idx)}
                      onClick={() => go(c.path)}
                      className={cn(
                        "flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-2 text-left text-sm text-text hover:bg-control-item-bg-active hover:text-primary",
                        isActive && "bg-control-item-bg-active text-primary",
                      )}
                    >
                      <span>{c.title}</span>
                      <span className="truncate pl-4 text-xs text-text-tertiary">{l(c.description)}</span>
                    </button>
                  );
                })}
              </section>
            ))}
          </div>
        </div>
      </div>
    </Portal>
  );
}
