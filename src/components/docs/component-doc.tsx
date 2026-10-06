import { useMemo, useState, useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Tabs } from "@/components/ui/tabs";
import { InstallTabs } from "@/components/ui/install-tabs";
import type { ApiSection, DemoItem, DemoSize, RouteMeta } from "@/types";
import { DemoBox } from "./demo-box";
import { DocPager } from "./doc-pager";
import { ApiTable } from "./api-table";
import { AnchorNav, type AnchorItem } from "./anchor-nav";
import { CodeBlock } from "./code-block";
import { cn } from "@/lib/utils";
import { groupLabel, ui, useLocale, type Localized } from "@/i18n/locale";
import { FadeIn, Reveal } from "./motion";

export interface ComponentDocProps {
  meta: RouteMeta;
  /** slug of the component file, e.g. "button" → src/components/ui/button.tsx */
  slug: string;
  /** Named exports to show in the import snippet */
  imports: string[];
  whenToUse: Localized<ReactNode>;
  demos: DemoItem[];
  /** Default card width for demos that do not set `size`. */
  defaultDemoSize?: DemoSize;
  api: ApiSection[];
  /** Optional free-form sections rendered after API (FAQ, notes...) */
  extra?: Localized<ReactNode>;
  /** Optional related components */
  related?: { title: Localized<string>; path: string }[];
}

interface RegistryFile {
  path: string;
  content: string;
}

interface RegistryItem {
  name: string;
  title: string;
  description?: string;
  deps: string[];
  uses: string[];
  files: RegistryFile[];
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
/** Anchor ids always come from the English title so links are stable across languages. */
const resolve = (t: Localized<string>) => (typeof t === "string" ? t : t.en);

const demoSizeClass: Record<DemoSize, string> = {
  compact: "xl:col-span-1 2xl:col-span-4",
  standard: "xl:col-span-1 2xl:col-span-6",
  wide: "xl:col-span-2 2xl:col-span-8",
  full: "xl:col-span-2 2xl:col-span-12",
};

/**
 * Standard component documentation page:
 * title → description → When To Use → responsive examples → API → extra
 */
export function ComponentDoc({
  meta,
  slug,
  imports,
  whenToUse,
  demos,
  defaultDemoSize = "standard",
  api,
  extra,
  related,
}: ComponentDocProps) {
  const { l } = useLocale();
  const anchors = useMemo<AnchorItem[]>(
    () => [
      { id: "when-to-use", title: l(ui.whenToUse) },
      { id: "examples", title: l(ui.examples) },
      ...demos.map((d) => ({ id: slugify(resolve(d.title)), title: l(d.title), level: 3 as const })),
      { id: "api", title: "API" },
      ...api.map((a) => ({ id: "api-" + slugify(a.title), title: a.title, level: 3 as const })),
    ],
    [demos, api, l],
  );

  const [registryData, setRegistryData] = useState<RegistryItem | null>(null);
  const [loadingRegistry, setLoadingRegistry] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setRegistryData(null);
    setLoadingRegistry(true);
    fetch(`${window.location.origin}/r/${slug}.json`)
      .then((r) => (r.ok ? (r.json() as Promise<RegistryItem>) : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data) => {
        if (cancelled) return;
        setRegistryData(data);
        setLoadingRegistry(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to load registry data", err);
        setLoadingRegistry(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const importSnippet = `import { ${imports.join(", ")} } from "@/components/ui/${slug}";`;
  const installSnippet = `curl -fsSL https://kkui.kksz.dev/cli.ts | bun run - add ${slug}`;
  const usesAdaptiveDemoGrid =
    defaultDemoSize !== "standard" || demos.some((demo) => demo.size !== undefined);

  const tabItems = [
    {
      key: "cli",
      label: "CLI",
      children: (
        <div className="mt-3">
          <CodeBlock code={installSnippet} language="bash" />
        </div>
      ),
    },
    {
      key: "manual",
      label: l({ th: "ติดตั้งด้วยตนเอง (Manual)", en: "Manual" }),
      children: registryData ? (
        <div className="mt-3 flex flex-col gap-6">
          {registryData.deps && registryData.deps.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-text-heading">
                {l({ th: "ติดตั้ง dependencies ต่อไปนี้ (Install the following dependencies):", en: "Install the following dependencies:" })}
              </h3>
              <InstallTabs packages={registryData.deps} />
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-heading">
              {l({
                th: "คัดลอกและวางโค้ดต่อไปนี้ลงในโปรเจกต์ของคุณ (Copy and paste the following code into your project):",
                en: "Copy and paste the following code into your project:"
              })}
            </h3>
            {registryData.files.map((file) => (
              <div key={file.path} className="space-y-2">
                <div className="text-xs font-mono font-semibold text-text-secondary bg-fill-tertiary px-3 py-1.5 rounded-md border border-border inline-block">
                  {file.path}
                </div>
                <CodeBlock code={file.content} />
              </div>
            ))}
            <div className="text-xs text-text-tertiary italic">
              {l({
                th: "* ปรับเปลี่ยนเส้นทางการ Import ให้ตรงกับโครงสร้างโปรเจกต์ของคุณ",
                en: "* Update the import paths to match your project setup."
              })}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-text-heading">
              {l({ th: "วิธีใช้งาน (Usage):", en: "Usage:" })}
            </h3>
            <CodeBlock code={importSnippet} />
            {demos[0] && (
              <div className="mt-3 space-y-2">
                <div className="text-xs text-text-tertiary">
                  {l({ th: "ตัวอย่างการเรียกใช้งานพื้นฐาน:", en: "Example usage:" })}
                </div>
                <CodeBlock code={demos[0].code} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-3 rounded-lg border border-border bg-bg-container p-6 text-center text-text-secondary">
          {loadingRegistry ? (
            <span>{l({ th: "กำลังโหลดข้อมูลจากคอมโพเนนต์เรจิสทรี...", en: "Loading component registry data..." })}</span>
          ) : (
            <div className="space-y-3">
              <div>{l({ th: "ไม่สามารถดึงข้อมูลคอมโพเนนต์ได้ในขณะนี้", en: "Unable to load component data at the moment." })}</div>
              <a
                href={`https://github.com/kksz-dev/kkui/blob/main/src/components/ui/${slug}.tsx`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                {l({ th: "ดูซอร์สบน GitHub", en: "View source on GitHub" })}
              </a>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex gap-10">
      <article className="min-w-0 flex-1 pb-24">
        <FadeIn as="header" className="mb-8" direction="up">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-h2 font-semibold text-text-heading">{meta.title}</h1>
            <span className="rounded-full bg-fill-tertiary px-2 py-0.5 text-xs text-text-secondary">{l(groupLabel[meta.group] ?? meta.group)}</span>
            {meta.wip && <span className="rounded-full bg-warning-bg px-2 py-0.5 text-xs text-warning">{l(ui.wip)}</span>}
          </div>
          <p className="mt-2 text-base text-text-secondary">{l(meta.description)}</p>
          <div className="mt-5 space-y-5">
            <div>
              <div className="mb-2 text-xs font-semibold text-text-tertiary uppercase tracking-wider">{l(ui.install)}</div>
              <Tabs items={tabItems} size="middle" />
            </div>
            <div>
              <div className="mb-2 text-xs font-semibold text-text-tertiary uppercase tracking-wider">{l(ui.import)}</div>
              <CodeBlock code={importSnippet} />
            </div>
          </div>
        </FadeIn>

        <h2 id="when-to-use" className="mb-3 scroll-mt-20 text-h4 font-semibold text-text-heading">
          {l(ui.whenToUse)}
        </h2>
        <div className="prose-kk mb-10 text-text [&_li]:my-1 [&_ul]:list-disc [&_ul]:pl-5 [&_code]:rounded-sm [&_code]:bg-fill-tertiary [&_code]:px-1 [&_code]:font-mono [&_code]:text-[.9em]">
          {l(whenToUse)}
        </div>

        <h2 id="examples" className="mb-4 scroll-mt-20 text-h4 font-semibold text-text-heading">
          {l(ui.examples)}
        </h2>
        <div
          className={cn(
            usesAdaptiveDemoGrid
              ? "grid grid-cols-1 items-start gap-6 xl:grid-cols-2 2xl:grid-cols-12"
              : "xl:columns-2 xl:gap-6",
          )}
        >
          {demos.map((d, i) => {
            const size = d.size ?? (d.full ? "full" : defaultDemoSize);
            return (
              <Reveal
                key={resolve(d.title)}
                delay={(i % 3) * 50}
                className={cn(
                  usesAdaptiveDemoGrid
                    ? ["min-w-0 self-start", demoSizeClass[size]]
                    : ["mb-6 break-inside-avoid", d.full && "xl:[column-span:all]"],
                )}
              >
                <DemoBox
                  title={l(d.title)}
                  description={d.description && l(d.description)}
                  code={d.code}
                  background={d.background}
                  previewClassName={cn(size === "compact" && "p-4", d.previewClassName)}
                  id={slugify(resolve(d.title))}
                >
                  {d.component}
                </DemoBox>
              </Reveal>
            );
          })}
        </div>

        <h2 id="api" className="mt-14 mb-4 scroll-mt-20 text-h4 font-semibold text-text-heading">
          API
        </h2>
        <div className="space-y-8">
          {api.map((s, i) => (
            <Reveal key={s.title} delay={i * 40}>
              <ApiTable section={s} />
            </Reveal>
          ))}
        </div>

        {extra && <div className="mt-12 space-y-4 text-text [&_h2]:text-h4 [&_h2]:font-semibold [&_h2]:text-text-heading [&_h3]:text-h5 [&_h3]:font-semibold [&_p]:text-text-secondary [&_code]:rounded-sm [&_code]:bg-fill-tertiary [&_code]:px-1 [&_code]:font-mono [&_code]:text-[.9em]">{l(extra)}</div>}

        {related && related.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-3 text-h5 font-semibold text-text-heading">{l(ui.related)}</h2>
            <div className="flex flex-wrap gap-2">
              {related.map((r) => (
                <Link key={r.path} to={r.path} className="kk-press rounded-md border border-border px-3 py-1 text-sm transition-colors duration-mid hover:border-primary hover:text-primary">
                  {l(r.title)}
                </Link>
              ))}
            </div>
          </div>
        )}
        <DocPager slug={slug} />
      </article>
      <aside className="kk-scrollbar sticky top-20 hidden max-h-[calc(100dvh-6rem)] w-48 shrink-0 self-start overscroll-contain overflow-y-auto pb-2 xl:block">
        <AnchorNav items={anchors} />
      </aside>
    </div>
  );
}
