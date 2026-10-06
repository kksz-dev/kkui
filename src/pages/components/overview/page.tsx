import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { componentEntries } from "@/routes/autoRoutes";
import { COMPONENT_GROUPS } from "@/types";
import { groupLabel, tr, ui, useLocale } from "@/i18n/locale";
import { Reveal } from "@/components/docs/motion";

export default function Overview() {
  const [q, setQ] = useState("");
  const { l } = useLocale();
  const query = q.trim().toLowerCase();
  const filtered = componentEntries.filter(
    (c) => !query || c.title.toLowerCase().includes(query) || c.keywords?.some((k) => k.toLowerCase().includes(query)) || l(c.description).toLowerCase().includes(query),
  );
  return (
    <div className="pb-24">
      <h1 className="text-h2 font-semibold text-text-heading">{l(tr("ภาพรวมคอมโพเนนต์", "Components Overview"))}</h1>
      <p className="mt-2 max-w-3xl text-text-secondary">
        {l(
          tr(
            `KKUI มีคอมโพเนนต์ระดับ enterprise ครบทุกหมวด สร้างบน Tailwind CSS v4 + KKUI primitives แต่ละตัวเป็นไฟล์เดียวที่คุณคัดลอกไปเป็นของตัวเอง — ตอนนี้ ${componentEntries.length} ตัว`,
            `KKUI ships a complete enterprise component catalog built on Tailwind CSS v4 + KKUI primitives: each component is a single file you copy and own. ${componentEntries.length} components so far.`,
          ),
        )}
      </p>
      <label className="mt-6 flex h-10 w-full max-w-md items-center gap-2 rounded-lg border border-border px-3 focus-within:border-primary focus-within:ring-[3px] focus-within:ring-primary/20">
        <Search className="size-4 text-text-tertiary" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={l(ui.searchPlaceholder)} className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-placeholder" />
      </label>
      {COMPONENT_GROUPS.map((g) => {
        const items = filtered.filter((c) => c.group === g);
        if (!items.length) return null;
        return (
          <section key={g} className="mt-10">
            <h2 className="mb-4 text-h4 font-semibold text-text-heading">
              {l(groupLabel[g])} <span className="text-base font-normal text-text-tertiary">{items.length}</span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((c, i) => (
                <Reveal key={c.slug} delay={Math.min(i, 9) * 45}>
                <Link
                  to={c.path}
                  className="kk-lift group block h-full rounded-lg border border-border-secondary bg-bg-container p-4 hover:border-transparent"
                >
                  <div className="flex items-center gap-2 font-medium text-text-heading group-hover:text-primary">
                    {c.title}
                    {c.wip && <span className="rounded-sm bg-warning-bg px-1 text-[10px] text-warning">{l(ui.wip)}</span>}
                  </div>
                  <div className="mt-1 line-clamp-2 text-sm text-text-secondary">{l(c.description)}</div>
                </Link>
                </Reveal>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
