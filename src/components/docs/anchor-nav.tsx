import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ui, useLocale } from "@/i18n/locale";

export interface AnchorItem {
  id: string;
  title: string;
  level?: 2 | 3;
}

/** Right-side anchor nav: highlights the section in view. */
export function AnchorNav({ items }: { items: AnchorItem[] }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");
  const itemIds = items.map((i) => i.id).join(",");

  useEffect(() => {
    if (!items.length) return;
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          const targetId = visible[0].target.id;
          setActive((curr) => (curr !== targetId ? targetId : curr));
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: [0, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [itemIds]);

  const { l } = useLocale();
  if (!items.length) return null;
  return (
    <nav aria-label={l(ui.onThisPage)} className="text-[13px]">
      <ul className="border-l border-border-secondary">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className={cn(
                "-ml-px block border-l-2 py-1 pr-2 text-text-secondary transition-colors hover:text-primary",
                it.level === 3 ? "pl-6" : "pl-3",
                active === it.id ? "border-primary text-primary" : "border-transparent",
              )}
            >
              {it.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
