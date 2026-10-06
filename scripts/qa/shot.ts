// Minimal CDP driver: navigate, run a click/eval script, screenshot.
// usage: bun shot.ts <url> <out.png> [jsSnippet] [waitMs]
const [url, out, snippet = "", waitMs = "600", prescript = ""] = process.argv.slice(2);
const PORT = Number(process.env.KKUI_CDP_PORT ?? 9333);
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

const proc = Bun.spawn(
  [
    BROWSER,
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--no-sandbox",
    "--disable-gpu",
    "--hide-scrollbars",
    "--window-size=1440,900",
    `--user-data-dir=/tmp/kkui-cdp-profile-${PORT}`,
    "about:blank",
  ],
  { stdout: "ignore", stderr: "ignore" },
);

async function waitForCdp() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (r.ok) return (await r.json()) as { webSocketDebuggerUrl: string };
    } catch {}
    await Bun.sleep(250);
  }
  throw new Error("CDP never came up");
}

const info = await waitForCdp();
const ws = new WebSocket(info.webSocketDebuggerUrl);
await new Promise((res) => (ws.onopen = res));

let id = 0;
const pending = new Map<number, (v: any) => void>();
ws.onmessage = (e) => {
  const msg = JSON.parse(String(e.data));
  if (msg.id && pending.has(msg.id)) pending.get(msg.id)!(msg);
};
function send(method: string, params: any = {}, sessionId?: string): Promise<any> {
  const mid = ++id;
  return new Promise((res) => {
    pending.set(mid, res);
    ws.send(JSON.stringify({ id: mid, method, params, sessionId }));
  });
}

const { result: target } = await send("Target.createTarget", { url: "about:blank" });
const { result: attach } = await send("Target.attachToTarget", { targetId: target.targetId, flatten: true });
const sid = attach.sessionId;

await send("Page.enable", {}, sid);
await send("Runtime.enable", {}, sid);
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }, sid);
if (prescript) await send("Page.addScriptToEvaluateOnNewDocument", { source: prescript }, sid);
await send("Page.navigate", { url }, sid);
await Bun.sleep(2500);

if (snippet) {
  const r = await send("Runtime.evaluate", { expression: snippet, awaitPromise: true, returnByValue: true }, sid);
  console.log("eval:", JSON.stringify(r.result?.result?.value ?? r.result?.exceptionDetails?.text ?? ""));
  await Bun.sleep(Number(waitMs));
}

const clip = process.env.FULLPAGE
  ? await (async () => {
      const m = await send("Page.getLayoutMetrics", {}, sid);
      const c = m.result.cssContentSize ?? m.result.contentSize;
      return { x: 0, y: 0, width: c.width, height: Math.min(c.height, 12000), scale: 1 };
    })()
  : undefined;
const shot = await send("Page.captureScreenshot", clip ? { format: "png", clip, captureBeyondViewport: true } : { format: "png" }, sid);
await Bun.write(out, Buffer.from(shot.result.data, "base64"));
console.log("saved", out);

ws.close();
proc.kill();
process.exit(0);
