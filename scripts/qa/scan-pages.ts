// Visit every docs page, collect console errors and page exceptions.
const PORT = Number(process.env.KKUI_CDP_PORT ?? 9334);
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
const paths: string[] = process.argv.slice(2);

const proc = Bun.spawn(
  [BROWSER, "--headless=new", `--remote-debugging-port=${PORT}`, "--no-sandbox", "--disable-gpu",
   "--window-size=1440,900", `--user-data-dir=/tmp/kkui-cdp-check-${PORT}`, "about:blank"],
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
const problems: string[] = [];
let current = "";

ws.onmessage = (e) => {
  const msg = JSON.parse(String(e.data));
  if (msg.id && pending.has(msg.id)) pending.get(msg.id)!(msg);
  if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") {
    problems.push(`${current} :: console.error :: ${msg.params.args.map((a: any) => a.value ?? a.description ?? "").join(" ").slice(0, 300)}`);
  }
  if (msg.method === "Runtime.exceptionThrown") {
    problems.push(`${current} :: exception :: ${(msg.params.exceptionDetails.exception?.description ?? msg.params.exceptionDetails.text).slice(0, 300)}`);
  }
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
await send("Log.enable", {}, sid);

for (const path of paths) {
  current = path;
  await send("Page.navigate", { url: `http://localhost:5180${path}` }, sid);
  await Bun.sleep(1600);
  const probe = await send(
    "Runtime.evaluate",
    { expression: `document.querySelectorAll("main *").length`, returnByValue: true },
    sid,
  );
  const count = probe.result?.result?.value ?? 0;
  if (count < 20) problems.push(`${path} :: rendered only ${count} nodes`);
  console.log(`${path} -> ${count} nodes`);
}

console.log(problems.length ? `\nPROBLEMS (${problems.length}):\n` + problems.join("\n") : "\nNo console errors.");
ws.close();
proc.kill();
process.exit(0);
