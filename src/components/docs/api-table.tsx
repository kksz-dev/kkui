import type { ApiSection } from "@/types";
import { ui, useLocale } from "@/i18n/locale";

export function ApiTable({ section }: { section: ApiSection }) {
  const { l } = useLocale();
  const id = "api-" + section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div className="space-y-3 max-w-full">
      <h3 id={id} className="scroll-mt-20 text-h5 font-semibold text-text-heading">
        {section.title}
      </h3>
      {section.description && <p className="text-text-secondary">{l(section.description)}</p>}
      <div className="kk-scrollbar overflow-x-auto rounded-lg border border-border-secondary max-w-full">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="bg-fill-quaternary text-left text-text-heading">
              <th className="w-1/4 px-4 py-3 font-medium">{l(ui.property)}</th>
              <th className="w-1/3 px-4 py-3 font-medium">{l(ui.description)}</th>
              <th className="w-1/4 px-4 py-3 font-medium">{l(ui.type)}</th>
              <th className="w-1/6 px-4 py-3 font-medium">{l(ui.default)}</th>
            </tr>
          </thead>
          <tbody>
            {section.rows.map((r, i) => (
              // index-qualified: two rows may legitimately document the same prop name
              <tr key={`${r.property}-${i}`} className="border-t border-border-secondary align-top">
                <td className="px-4 py-3 font-medium text-text break-words">
                  <span className="font-mono">{r.property}</span>
                  {r.version && (
                    <span className="ml-1 rounded-sm bg-primary-bg px-1 text-[11px] text-primary whitespace-nowrap">
                      {r.version}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-text-secondary break-words">{l(r.description)}</td>
                <td className="px-4 py-3 break-words">
                  <code className="rounded-sm bg-magenta-bg px-1 font-mono text-[12.5px] text-magenta break-all whitespace-normal">
                    {r.type}
                  </code>
                </td>
                <td className="px-4 py-3 text-text-secondary break-words">
                  {r.default ? (
                    <code className="rounded-sm bg-fill-tertiary px-1 font-mono text-[12.5px] break-all whitespace-normal">
                      {l(r.default)}
                    </code>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
