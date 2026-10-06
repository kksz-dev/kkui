/**
 * KKUI registry — our own standalone format.
 * Scans src/components/ui/*.tsx (+ hooks/lib they import) and emits:
 *   public/r/registry.json      index of every component
 *   public/r/<name>.json        { name, title, description, files[{path,content}], deps[], uses[] }
 *   public/r/<name>.tsx         raw source (for copy/paste or curl)
 *   public/r/tokens.json        src/index.css as an installable file
 * Consumed by public/cli.ts:  curl -fsSL https://kkui.kksz.dev/cli.ts | bun run - add button
 */
import { readdir, readFile, mkdir, writeFile, rm, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dir, "..");
const UI_DIR = path.join(ROOT, "src/components/ui");
const PAGES_DIR = path.join(ROOT, "src/pages/components");
const OUT = path.join(ROOT, "public/r");

// packages every KKUI project already has after `init`
const IMPLICIT = new Set(["react", "react-dom", "clsx", "tailwind-merge", "class-variance-authority"]);
const pkg = JSON.parse(await readFile(path.join(ROOT, "package.json"), "utf8")) as {
  version: string;
  dependencies: Record<string, string>;
};

interface RegistryFile {
  /** path relative to the consumer's src/ e.g. components/ui/button.tsx */
  path: string;
  content: string;
}
interface RegistryItem {
  name: string;
  title: string;
  description?: string;
  group?: string;
  /** npm packages to install (name@range) */
  deps: string[];
  /** other KKUI components this one imports */
  uses: string[];
  files: RegistryFile[];
}

const IMPORT_RE = /from\s+["']([^"']+)["']/g;
const pkgName = (spec: string) => (spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0]!);
const titleCase = (s: string) => s.replace(/(^|-)(\w)/g, (_, __, c: string) => " " + c.toUpperCase()).trim();

async function readMeta(name: string) {
  try {
    const src = await readFile(path.join(PAGES_DIR, name, "metadata.ts"), "utf8");
    const pick = (k: string) => src.match(new RegExp(`${k}:\\s*["'\`]([^"'\`]*)["'\`]`))?.[1];
    // description is bilingual `{ th, en }` on most pages — the registry carries the English line
    const pickEn = (k: string) => src.match(new RegExp(`${k}:\\s*\\{[^}]*?\\ben:\\s*["'\`]([^"'\`]*)["'\`]`))?.[1];
    return { title: pick("title"), description: pick("description") ?? pickEn("description"), group: pick("group") };
  } catch {
    return {};
  }
}

async function scan(file: string) {
  const src = await readFile(file, "utf8");
  const deps = new Set<string>();
  const uses = new Set<string>();
  const local = new Set<string>();
  for (const m of src.matchAll(IMPORT_RE)) {
    const spec = m[1]!;
    if (spec.startsWith("@/components/ui/")) uses.add(spec.replace("@/components/ui/", ""));
    else if (spec.startsWith("@/hooks/") || spec.startsWith("@/lib/")) {
      if (spec !== "@/lib/utils") local.add(spec.replace("@/", "") + ".ts");
    } else if (!spec.startsWith(".") && !spec.startsWith("@/")) {
      const p = pkgName(spec);
      if (!IMPLICIT.has(p)) deps.add(pkg.dependencies[p] ? `${p}@${pkg.dependencies[p]}` : p);
    }
  }
  return { src, deps: [...deps].sort(), uses: [...uses].sort(), local: [...local].sort() };
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const files = (await readdir(UI_DIR)).filter((f) => f.endsWith(".tsx")).sort();
const index: Omit<RegistryItem, "files">[] = [];

for (const f of files) {
  const name = f.replace(/\.tsx$/, "");
  const { src, deps, uses, local } = await scan(path.join(UI_DIR, f));
  const meta = await readMeta(name);
  const item: RegistryItem = {
    name,
    title: meta.title ?? titleCase(name),
    description: meta.description,
    group: meta.group,
    deps,
    uses,
    files: [{ path: `components/ui/${f}`, content: src }],
  };
  for (const lf of local) item.files.push({ path: lf, content: await readFile(path.join(ROOT, "src", lf), "utf8") });
  await writeFile(path.join(OUT, `${name}.json`), JSON.stringify(item, null, 2));
  await writeFile(path.join(OUT, `${name}.tsx`), src);
  const { files: _files, ...rest } = item;
  index.push(rest);
}

// Component directories (e.g. ui/motion/) ship as one item with every file inside.
const dirs: string[] = [];
for (const entry of await readdir(UI_DIR)) {
  if (entry.endsWith(".tsx")) continue;
  const full = path.join(UI_DIR, entry);
  if ((await stat(full)).isDirectory()) dirs.push(entry);
}

for (const dirName of dirs.sort()) {
  const dirPath = path.join(UI_DIR, dirName);
  const inner = (await readdir(dirPath)).filter((f) => f.endsWith(".tsx") || f.endsWith(".ts")).sort();
  if (inner.length === 0) continue;

  const deps = new Set<string>();
  const uses = new Set<string>();
  const local = new Set<string>();
  const itemFiles: RegistryFile[] = [];

  for (const f of inner) {
    const scanned = await scan(path.join(dirPath, f));
    scanned.deps.forEach((d) => deps.add(d));
    scanned.uses.forEach((u) => uses.add(u));
    scanned.local.forEach((l) => local.add(l));
    itemFiles.push({ path: `components/ui/${dirName}/${f}`, content: scanned.src });
  }

  const meta = await readMeta(dirName);
  const item: RegistryItem = {
    name: dirName,
    title: meta.title ?? titleCase(dirName),
    description: meta.description,
    group: meta.group,
    deps: [...deps].sort(),
    uses: [...uses].filter((u) => u !== dirName).sort(),
    files: itemFiles,
  };
  for (const lf of local) item.files.push({ path: lf, content: await readFile(path.join(ROOT, "src", lf), "utf8") });
  await writeFile(path.join(OUT, `${dirName}.json`), JSON.stringify(item, null, 2));
  const { files: _dirFiles, ...rest } = item;
  index.push(rest);
}

const css = await readFile(path.join(ROOT, "src/index.css"), "utf8");
const utils = await readFile(path.join(ROOT, "src/lib/utils.ts"), "utf8");
const tokens: RegistryItem = {
  name: "tokens",
  title: "KKUI tokens + utils",
  description: "KKUI light/dark tokens as CSS variables + Tailwind v4 @theme utilities, and cn(). Installed by `init`.",
  deps: ["tailwindcss@" + (pkg.dependencies["tailwindcss"] ?? "^4"), "tw-animate-css@" + (pkg.dependencies["tw-animate-css"] ?? "^1")],
  uses: [],
  files: [
    { path: "index.css", content: css },
    { path: "lib/utils.ts", content: utils },
  ],
};
await writeFile(path.join(OUT, "tokens.json"), JSON.stringify(tokens, null, 2));

await writeFile(
  path.join(OUT, "registry.json"),
  JSON.stringify({ name: "kkui", version: pkg.version, homepage: "https://kkui.kksz.dev", components: index }, null, 2),
);
console.log(`registry: ${index.length} components + tokens → public/r/`);
