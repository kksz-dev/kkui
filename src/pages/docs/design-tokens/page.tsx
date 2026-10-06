import { tr, useLocale } from "@/i18n/locale";

const swatches: { name: string; vars: string[] }[] = [
  { name: "Primary", vars: ["--kk-primary", "--kk-primary-hover", "--kk-primary-active", "--kk-primary-bg", "--kk-primary-bg-hover", "--kk-primary-border", "--kk-primary-border-hover"] },
  { name: "Success", vars: ["--kk-success", "--kk-success-hover", "--kk-success-active", "--kk-success-bg", "--kk-success-bg-hover", "--kk-success-border", "--kk-success-border-hover"] },
  { name: "Warning", vars: ["--kk-warning", "--kk-warning-hover", "--kk-warning-active", "--kk-warning-bg", "--kk-warning-bg-hover", "--kk-warning-border", "--kk-warning-border-hover"] },
  { name: "Error", vars: ["--kk-error", "--kk-error-hover", "--kk-error-active", "--kk-error-bg", "--kk-error-bg-hover", "--kk-error-border", "--kk-error-border-hover"] },
  { name: "Text", vars: ["--kk-text", "--kk-text-secondary", "--kk-text-tertiary", "--kk-text-quaternary"] },
  { name: "Fill", vars: ["--kk-fill", "--kk-fill-secondary", "--kk-fill-tertiary", "--kk-fill-quaternary"] },
  { name: "Background", vars: ["--kk-bg-container", "--kk-bg-elevated", "--kk-bg-layout", "--kk-bg-spotlight", "--kk-bg-mask"] },
  { name: "Border", vars: ["--kk-border", "--kk-border-secondary", "--kk-split"] },
];

const presets = ["magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple"];

const sizes = [
  ["--kk-radius-xs", "2px", "rounded-xs"],
  ["--kk-radius-sm", "4px", "rounded-sm"],
  ["--kk-radius", "6px", "rounded-md"],
  ["--kk-radius-lg", "8px", "rounded-lg"],
  ["--kk-control-height-sm", "24px", "h-control-sm"],
  ["--kk-control-height", "32px", "h-control"],
  ["--kk-control-height-lg", "40px", "h-control-lg"],
  ["--kk-font-size", "14px", "text-sm (base)"],
  ["--kk-font-size-lg", "16px", "text-base"],
  ["--kk-line-height", "1.5714", "-"],
];

export default function DesignTokens() {
  const { l, lang } = useLocale();
  return (
    <article className="max-w-4xl pb-24">
      <h1 className="text-h2 font-semibold text-text-heading">{l(tr("โทเคนดีไซน์", "Design Tokens"))}</h1>
      <p className="mt-2 text-text-secondary">
        {lang === "th" ? (
          <>
            ทุกค่า (สว่างและมืด) อยู่ใน <code className="rounded-sm bg-fill-tertiary px-1 font-mono text-[.9em]">src/index.css</code> แก้ตัวแปรที่นั่นทีเดียว ทุกคอมโพเนนต์เปลี่ยนตาม utilities ถูกสร้างผ่าน Tailwind v4 <code className="rounded-sm bg-fill-tertiary px-1 font-mono text-[.9em]">@theme</code>:
            <code className="ml-1 rounded-sm bg-fill-tertiary px-1 font-mono text-[.9em]">bg-primary-bg</code>, <code className="rounded-sm bg-fill-tertiary px-1 font-mono text-[.9em]">text-text-secondary</code>, <code className="rounded-sm bg-fill-tertiary px-1 font-mono text-[.9em]">border-error-border</code>, <code className="rounded-sm bg-fill-tertiary px-1 font-mono text-[.9em]">h-control</code>…
          </>
        ) : (
          <>
            Every value (light and dark) lives in <code className="rounded-sm bg-fill-tertiary px-1 font-mono text-[.9em]">src/index.css</code>. Change a variable there and every component follows. Utilities are generated through Tailwind v4 <code className="rounded-sm bg-fill-tertiary px-1 font-mono text-[.9em]">@theme</code>:
            <code className="ml-1 rounded-sm bg-fill-tertiary px-1 font-mono text-[.9em]">bg-primary-bg</code>, <code className="rounded-sm bg-fill-tertiary px-1 font-mono text-[.9em]">text-text-secondary</code>, <code className="rounded-sm bg-fill-tertiary px-1 font-mono text-[.9em]">border-error-border</code>, <code className="rounded-sm bg-fill-tertiary px-1 font-mono text-[.9em]">h-control</code>…
          </>
        )}
      </p>

      <h2 className="mt-10 mb-4 text-h4 font-semibold text-text-heading">{l(tr("สี", "Colors"))}</h2>
      <div className="space-y-6">
        {swatches.map((s) => (
          <div key={s.name}>
            <div className="mb-2 text-sm font-medium text-text-heading">{s.name}</div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
              {s.vars.map((v) => (
                <div key={v} className="overflow-hidden rounded-md border border-border-secondary">
                  <div className="h-12" style={{ background: `var(${v})` }} />
                  <div className="truncate px-2 py-1 font-mono text-[11px] text-text-secondary">{v}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-10 mb-4 text-h4 font-semibold text-text-heading">{l(tr("พาเลตต์สำเร็จรูป", "Preset palette"))}</h2>
      <p className="mb-3 text-sm text-text-secondary">{l(tr("ใช้กับ preset สีของ Tag / Badge / Avatar:", "Used by Tag / Badge / Avatar color presets:"))} <code className="rounded-sm bg-fill-tertiary px-1 font-mono">bg-magenta-bg text-magenta border-magenta-border</code></p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-11">
        {presets.map((p) => (
          <div key={p} className="overflow-hidden rounded-md border border-border-secondary">
            <div className="h-10" style={{ background: `var(--color-${p})` }} />
            <div className="h-6" style={{ background: `var(--color-${p}-bg)`, borderTop: `1px solid var(--color-${p}-border)` }} />
            <div className="px-2 py-1 text-center font-mono text-[11px] text-text-secondary">{p}</div>
          </div>
        ))}
      </div>

      <h2 className="mt-10 mb-4 text-h4 font-semibold text-text-heading">{l(tr("ขนาดและตัวอักษร", "Size & typography"))}</h2>
      <div className="overflow-x-auto rounded-lg border border-border-secondary">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-fill-quaternary text-left text-text-heading">
              <th className="px-4 py-2 font-medium">{l(tr("โทเคน", "Token"))}</th>
              <th className="px-4 py-2 font-medium">{l(tr("ค่า", "Value"))}</th>
              <th className="px-4 py-2 font-medium">Utility</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map(([t, v, u]) => (
              <tr key={t} className="border-t border-border-secondary">
                <td className="px-4 py-2 font-mono text-[12.5px]">{t}</td>
                <td className="px-4 py-2 text-text-secondary">{v}</td>
                <td className="px-4 py-2 font-mono text-[12.5px] text-magenta">{u}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 mb-4 text-h4 font-semibold text-text-heading">{l(tr("เงา", "Shadows"))}</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {["shadow-kk", "shadow-kk-secondary", "shadow-kk-card"].map((s) => (
          <div key={s} className={`rounded-lg bg-bg-container p-6 text-center font-mono text-xs text-text-secondary ${s}`}>{s}</div>
        ))}
      </div>
    </article>
  );
}
