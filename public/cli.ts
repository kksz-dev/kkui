#!/usr/bin/env bun
/**
 * KKUI CLI — copies component source into YOUR project. No package to install.
 *
 *   curl -fsSL https://kkui.kksz.dev/cli.ts | bun run - init
 *   curl -fsSL https://kkui.kksz.dev/cli.ts | bun run - add button card table
 *   curl -fsSL https://kkui.kksz.dev/cli.ts | bun run - list
 *
 * Options:  --dir src   (where components/ui, hooks, lib live; default "src")
 *           --force     (overwrite existing files)
 *           --no-install (print deps instead of running `bun add`)
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.KKUI_REGISTRY ?? "https://kkui.kksz.dev/r";
const args = process.argv.slice(2);
const flag = (n: string) => args.includes(n);
const opt = (n: string, d: string) => {
  const i = args.indexOf(n);
  return i >= 0 && args[i + 1] ? args[i + 1]! : d;
};
const srcDir = path.resolve(process.cwd(), opt("--dir", "src"));
const positional = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--dir");
const cmd = positional[0];
const names = positional.slice(1);

interface Item { name: string; title: string; deps: string[]; uses: string[]; files: { path: string; content: string }[] }

async function fetchJson<T>(url: string): Promise<T> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return (await r.json()) as T;
}
const exists = (p: string) => access(p).then(() => true, () => false);

async function writeItem(item: Item, written: Set<string>) {
  for (const f of item.files) {
    const target = path.join(srcDir, f.path);
    if (!flag("--force") && (await exists(target))) {
      console.log(`  skip   ${path.relative(process.cwd(), target)} (exists, use --force)`);
      continue;
    }
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, f.content);
    console.log(`  write  ${path.relative(process.cwd(), target)}`);
    written.add(target);
  }
}

async function install(deps: Set<string>) {
  if (!deps.size) return;
  const list = [...deps];
  if (flag("--no-install")) return console.log(`\nInstall deps:\n  bun add ${list.join(" ")}`);
  console.log(`\n$ bun add ${list.join(" ")}`);
  const p = Bun.spawn(["bun", "add", ...list], { stdout: "inherit", stderr: "inherit" });
  await p.exited;
}

if (cmd === "list") {
  const reg = await fetchJson<{ components: { name: string; title: string; group?: string }[] }>(`${BASE}/registry.json`);
  for (const c of reg.components) console.log(`${c.name.padEnd(18)} ${c.title.padEnd(20)} ${c.group ?? ""}`);
} else if (cmd === "init") {
  const written = new Set<string>();
  const tokens = await fetchJson<Item>(`${BASE}/tokens.json`);
  console.log("KKUI init → tokens (index.css) + lib/utils.ts");
  await writeItem(tokens, written);
  await install(new Set([...tokens.deps, "clsx", "tailwind-merge", "class-variance-authority", "lucide-react"]));
  console.log(`\nDone. Make sure vite.config.ts has @tailwindcss/vite and the "@" alias → ${path.relative(process.cwd(), srcDir)}.`);
} else if (cmd === "add" && names.length) {
  const done = new Set<string>();
  const deps = new Set<string>();
  const written = new Set<string>();
  const queue = [...names];
  while (queue.length) {
    const n = queue.shift()!;
    if (done.has(n)) continue;
    done.add(n);
    const item = await fetchJson<Item>(`${BASE}/${n}.json`).catch(() => null);
    if (!item) {
      console.error(`  !! unknown component "${n}" (see: list)`);
      continue;
    }
    console.log(`+ ${item.title}`);
    await writeItem(item, written);
    item.deps.forEach((d) => deps.add(d));
    queue.push(...item.uses.filter((u) => !done.has(u)));
  }
  await install(deps);
} else {
  console.log(`kkui — usage:
  init                 install tokens (index.css) + lib/utils.ts + base deps
  add <name...>        copy components (and what they use) into ${path.relative(process.cwd(), srcDir)}/
  list                 show all components
  flags: --dir <src>  --force  --no-install`);
}
