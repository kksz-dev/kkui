/**
 * Measure animation smoothness: record every frame interval while an
 * interaction plays, then report the worst frame and how many were late.
 */
const PORT = Number(process.env.KKUI_CDP_PORT ?? 9356);
const BROWSER =
  process.env.KKUI_BROWSER ??
  ["/usr/bin/brave-browser", "/usr/bin/chromium", "/usr/bin/google-chrome"].find((p) => {
    try {
      return Bun.file(p).size >= 0;
    } catch {
      return false;
    }
  }) ??
  "/usr/bin/chromium";
const BASE = process.env.BASE ?? "http://localhost:5180";

const proc = Bun.spawn(
  [
    BROWSER,
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--no-sandbox",
    // headless still composites; keep the GPU path so timings mean something
    "--enable-gpu-rasterization",
    "--window-size=1440,900",
    `--user-data-dir=/tmp/kkui-cdp-anim-${PORT}`,
    "about:blank",
  ],
  { stdout: "ignore", stderr: "ignore" },
);

async function cdp() {
  for (let i = 0; i < 80; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (r.ok) return (await r.json()) as { webSocketDebuggerUrl: string };
    } catch {}
    await Bun.sleep(250);
  }
  throw new Error("no cdp");
}

const info = await cdp();
const ws = new WebSocket(info.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map<number, (v: any) => void>();
ws.onmessage = (e) => {
  const m = JSON.parse(String(e.data));
  if (m.id && pending.has(m.id)) pending.get(m.id)!(m);
};
const send = (method: string, params: any = {}, sessionId?: string) =>
  new Promise<any>((res) => {
    const mid = ++id;
    pending.set(mid, res);
    ws.send(JSON.stringify({ id: mid, method, params, sessionId }));
  });

const { result: target } = await send("Target.createTarget", { url: "about:blank" });
const { result: attach } = await send("Target.attachToTarget", { targetId: target.targetId, flatten: true });
const sid = attach.sessionId;
await send("Page.enable", {}, sid);
await send("Runtime.enable", {}, sid);
const evalJs = async (expr: string) =>
  (await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true }, sid)).result?.result?.value;

const RECORDER = `
window.__rec = () => {
  const frames = [];
  let last = performance.now();
  let stop = false;
  const tick = (t) => { frames.push(t - last); last = t; if (!stop) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  return () => {
    stop = true;
    const sorted = [...frames].sort((a, b) => a - b);
    const late = frames.filter((f) => f > 20).length;
    return {
      frames: frames.length,
      median: +(sorted[Math.floor(sorted.length / 2)] ?? 0).toFixed(1),
      p95: +(sorted[Math.floor(sorted.length * 0.95)] ?? 0).toFixed(1),
      worst: +Math.max(...frames, 0).toFixed(1),
      lateFrames: late,
    };
  };
};
`;

interface Case {
  name: string;
  path: string;
  action: string;
  ms?: number;
}

const cases: Case[] = [
  {
    name: "modal open+close",
    path: "/components/modal",
    action: `
      const btn = [...document.querySelectorAll("button")].find(b => /open modal/i.test(b.textContent)) ?? document.querySelector("main button");
      btn.click(); await wait(420);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      await wait(420);`,
  },
  {
    name: "drawer open+close",
    path: "/components/drawer",
    action: `
      const btn = [...document.querySelectorAll("button")].find(b => /open drawer/i.test(b.textContent)) ?? document.querySelector("main button");
      btn.click(); await wait(500);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      await wait(500);`,
  },
  {
    name: "collapse expand",
    path: "/components/collapse",
    action: `
      const closed = [...document.querySelectorAll("[data-slot=collapse-header]")].find(h => h.getAttribute("aria-expanded") === "false");
      closed?.click(); await wait(500);
      closed?.click(); await wait(500);`,
  },
  {
    name: "tabs ink bar",
    path: "/components/tabs",
    action: `
      const tabs = [...document.querySelectorAll("[data-slot=tabs-tab]")];
      for (const t of tabs.slice(0, 4)) { t.click(); await wait(240); }`,
  },
  {
    name: "dropdown open",
    path: "/components/dropdown",
    action: `
      const trigger = document.querySelector("[data-slot=dropdown-trigger]");
      for (const type of ["pointerover","mouseover","mouseenter"]) trigger.dispatchEvent(new MouseEvent(type, { bubbles: true }));
      await wait(500);
      for (const type of ["pointerout","mouseout","mouseleave"]) trigger.dispatchEvent(new MouseEvent(type, { bubbles: true }));
      await wait(400);`,
  },
  {
    name: "carousel slide",
    path: "/components/carousel",
    action: `
      const car = [...document.querySelectorAll("[data-slot=carousel]")].find(c => c.querySelectorAll("[data-slot=carousel-dot]").length > 1);
      car?.scrollIntoView({ block: "center" }); await wait(200);
      const dots = [...car.querySelectorAll("[data-slot=carousel-dot]")];
      for (const d of dots.slice(0, 3)) { d.click(); await wait(420); }`,
  },
  {
    name: "sidebar navigation",
    path: "/components/button",
    action: `
      for (const href of ["/components/icon", "/components/typography", "/components/divider"]) {
        document.querySelector("a[href='" + href + "']")?.click();
        await wait(600);
      }`,
  },
  {
    name: "scroll long page",
    path: "/components/table",
    action: `
      for (let i = 0; i < 24; i++) { window.scrollBy(0, 260); await wait(45); }`,
  },
];

console.log("name                     frames  median   p95  worst  late(>20ms)");
for (const c of cases) {
  await send("Page.navigate", { url: `${BASE}${c.path}` }, sid);
  await Bun.sleep(2300);
  await evalJs(RECORDER);
  if (process.env.NO_BLUR) {
    await evalJs(`(() => { const st = document.createElement("style"); st.textContent = "*{backdrop-filter:none !important}"; document.head.appendChild(st); return 1; })()`);
  }
  const result = await evalJs(`(async () => {
    const wait = (ms) => new Promise(r => setTimeout(r, ms));
    const stop = window.__rec();
    try { ${c.action} } catch (e) { return JSON.stringify({ error: String(e && e.message) }); }
    return JSON.stringify(stop());
  })()`);
  const r = JSON.parse(result ?? "{}");
  if (r.error) {
    console.log(`${c.name.padEnd(24)} error: ${r.error}`);
    continue;
  }
  console.log(
    `${c.name.padEnd(24)} ${String(r.frames).padStart(6)} ${String(r.median).padStart(7)} ${String(r.p95).padStart(5)} ${String(r.worst).padStart(6)} ${String(r.lateFrames).padStart(11)}`,
  );
}

ws.close();
proc.kill();
process.exit(0);
