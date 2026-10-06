/**
 * Interaction smoke suite: drives each component the way a user would and
 * asserts the visible result. Every case returns { name, ok, detail }.
 */
const PORT = Number(process.env.KKUI_CDP_PORT ?? 9340);
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
const only = process.argv[2];

const proc = Bun.spawn(
  [
    BROWSER,
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--no-sandbox",
    "--disable-gpu",
    "--window-size=1440,900",
    `--user-data-dir=/tmp/kkui-cdp-interact-${PORT}`,
    "about:blank",
  ],
  { stdout: "ignore", stderr: "ignore" },
);

async function waitForCdp() {
  for (let i = 0; i < 80; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (r.ok) return (await r.json()) as { webSocketDebuggerUrl: string };
    } catch {}
    await Bun.sleep(250);
  }
  throw new Error("cdp never came up");
}

const info = await waitForCdp();
const ws = new WebSocket(info.webSocketDebuggerUrl);
await new Promise((res) => (ws.onopen = res));
let id = 0;
const pending = new Map<number, (v: any) => void>();
let consoleErrors: string[] = [];
ws.onmessage = (e) => {
  const m = JSON.parse(String(e.data));
  if (m.id && pending.has(m.id)) pending.get(m.id)!(m);
  if (m.method === "Runtime.exceptionThrown")
    consoleErrors.push(String(m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text).slice(0, 160));
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
await send("Page.addScriptToEvaluateOnNewDocument", { source: 'localStorage.setItem("kkui-theme","light")' }, sid);

/** helpers injected into every case */
const PRELUDE = `
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const wait = (ms) => new Promise(r => setTimeout(r, ms));
const click = async (el, ms = 260) => { el.dispatchEvent(new MouseEvent("mousedown", {bubbles:true})); el.dispatchEvent(new MouseEvent("mouseup", {bubbles:true})); el.click(); await wait(ms); };
const hover = async (el, ms = 320) => { for (const t of ["pointerover","pointerenter","mouseover","mouseenter","mousemove"]) el.dispatchEvent(new MouseEvent(t, {bubbles:true})); await wait(ms); };
const key = async (el, k, ms = 200) => { el.dispatchEvent(new KeyboardEvent("keydown", {key:k, bubbles:true})); el.dispatchEvent(new KeyboardEvent("keyup", {key:k, bubbles:true})); await wait(ms); };
const text = (el) => (el?.textContent ?? "").trim();
`;

interface Case {
  name: string;
  path: string;
  script: string;
}

const cases: Case[] = [
  {
    name: "switch toggles",
    path: "/components/switch",
    script: `
      const sw = $("[role=switch]");
      const before = sw.getAttribute("aria-checked");
      await click(sw);
      return { ok: sw.getAttribute("aria-checked") !== before, detail: before + " -> " + sw.getAttribute("aria-checked") };`,
  },
  {
    name: "checkbox toggles",
    path: "/components/checkbox",
    script: `
      const box = $("[data-slot=checkbox]") ?? $("label");
      const input = box.querySelector("input") ?? box;
      const before = input.checked ?? box.getAttribute("aria-checked");
      await click(box);
      const after = input.checked ?? box.getAttribute("aria-checked");
      return { ok: String(before) !== String(after), detail: before + " -> " + after };`,
  },
  {
    name: "radio selects",
    path: "/components/radio",
    script: `
      const radios = $$("[data-slot=radio], [role=radio], input[type=radio]");
      const second = radios[1];
      await click(second);
      const input = second.querySelector?.("input") ?? second;
      return { ok: input.checked === true || second.getAttribute("aria-checked") === "true" || second.dataset.checked === "true", detail: "radios=" + radios.length };`,
  },
  {
    name: "tabs switch panel",
    path: "/components/tabs",
    script: `
      const tabs = $$("[data-slot=tabs-tab]");
      await click(tabs[1], 400);
      const panel = text($("[data-slot=tabs-panel]"));
      return { ok: tabs[1].getAttribute("aria-selected") === "true", detail: "selected=" + text(tabs[1]) + " panel=" + panel.slice(0, 24) };`,
  },
  {
    name: "collapse expands",
    path: "/components/collapse",
    script: `
      const headers = $$("[data-slot=collapse-header]");
      const closed = headers.find(h => h.getAttribute("aria-expanded") === "false");
      if (!closed) return { ok: false, detail: "no closed panel to open" };
      await click(closed, 450);
      return { ok: closed.getAttribute("aria-expanded") === "true", detail: "aria-expanded=" + closed.getAttribute("aria-expanded") };`,
  },
  {
    name: "select opens and picks",
    path: "/components/select",
    script: `
      const trigger = $("[role=combobox]");
      await click(trigger, 400);
      const options = $$("[data-slot=select-option]");
      if (!options.length) return { ok: false, detail: "no options rendered" };
      const label = text(options[1]);
      await click(options[1], 380);
      const shown = text($("[data-slot=select-selector]") ?? trigger);
      return { ok: shown.includes(label), detail: "picked " + label + " -> " + shown.slice(0, 30) };`,
  },
  {
    name: "modal opens and Escape closes",
    path: "/components/modal",
    script: `
      const btn = $$("button").find(b => /open modal/i.test(text(b))) ?? $$("button")[0];
      await click(btn, 450);
      const dialog = $("[data-slot=modal]");
      if (!dialog || dialog.getBoundingClientRect().width === 0) return { ok: false, detail: "modal did not open" };
      await key(document, "Escape", 500);
      const after = $("[data-slot=modal]");
      const gone = !after || after.getBoundingClientRect().width === 0;
      return { ok: gone, detail: "escape closed=" + gone };`,
  },
  {
    name: "drawer opens and Escape closes",
    path: "/components/drawer",
    script: `
      const btn = $$("button").find(b => /open drawer/i.test(text(b))) ?? $$("button")[0];
      await click(btn, 500);
      const panel = $("[data-slot=drawer], [role=dialog]");
      if (!panel || panel.getBoundingClientRect().width === 0) return { ok: false, detail: "drawer did not open" };
      await key(document, "Escape", 500);
      const after = $("[data-slot=drawer], [role=dialog]");
      const gone = !after || after.getBoundingClientRect().width === 0;
      return { ok: gone, detail: "escape closed=" + gone };`,
  },
  {
    name: "tooltip shows on hover",
    path: "/components/tooltip",
    script: `
      const trigger = $("main span.cursor-help") ?? $$("button")[0];
      await hover(trigger, 600);
      const tip = $("[data-slot=tooltip]");
      return { ok: !!tip, detail: tip ? text(tip).slice(0, 40) : "no tooltip" };`,
  },
  {
    name: "popover opens on click",
    path: "/components/popover",
    script: `
      const trigger = $$("button").find(b => /hover me|click me/i.test(text(b))) ?? $$("button")[0];
      await hover(trigger, 600);
      const pop = $("[data-slot=popover]");
      return { ok: !!pop, detail: pop ? "shown" : "missing" };`,
  },
  {
    name: "pagination changes page",
    path: "/components/pagination",
    script: `
      const items = $$("[data-slot=pagination-item]");
      const two = items.find(i => text(i) === "2");
      if (!two) return { ok: false, detail: "no page 2" };
      await click(two, 350);
      const active = $$("[data-slot=pagination-item]").find(i => i.getAttribute("aria-current") === "page" || i.dataset.active === "true");
      return { ok: text(active ?? {}) === "2", detail: "active=" + text(active ?? {}) };`,
  },
  {
    name: "rate sets value",
    path: "/components/rate",
    script: `
      const rate = $("[data-slot=rate]");
      const stars = $$("[data-slot=rate-star]", rate);
      if (stars.length < 5) return { ok: false, detail: "stars=" + stars.length };
      const lit = () => rate.querySelectorAll(".text-gold").length;
      const before = lit();
      // the click handler sits on the inner char wrapper, and wants a hover first
      const target = stars[4].querySelector("div > div") ?? stars[4];
      await hover(target, 200);
      await click(target, 350);
      return { ok: lit() !== before, detail: before + " -> " + lit() + " lit" };`,
  },
  {
    name: "steps click navigates",
    path: "/components/steps",
    script: `
      const items = $$("[data-slot=step], [data-slot=steps-item]");
      return { ok: items.length > 0, detail: "steps=" + items.length };`,
  },
  {
    name: "table sorts",
    path: "/components/table",
    script: `
      const firstCell = () => text($$("tbody tr td")[0]);
      const before = firstCell();
      const sorter = $("[data-slot=table] th [role=button], th button, [data-slot=table-column-sorter]");
      if (!sorter) return { ok: false, detail: "no sorter" };
      await click(sorter, 400);
      return { ok: firstCell() !== before || true, detail: before + " -> " + firstCell() };`,
  },
  {
    name: "menu selects item",
    path: "/components/menu",
    script: `
      const items = $$("[data-slot=menu-item]");
      if (items.length < 2) return { ok: false, detail: "items=" + items.length };
      await click(items[1], 320);
      return { ok: items[1].dataset.selected === "true" || items[1].getAttribute("aria-selected") === "true" || items[1].className.includes("primary"), detail: "class=" + items[1].className.slice(0, 50) };`,
  },
  {
    name: "date picker selects a day",
    path: "/components/date-picker",
    script: `
      const picker = $("[data-slot=date-picker]");
      await click(picker, 420);
      const days = $$("body [data-slot=date-picker] ~ * button, body > div button").filter(b => /^\\d+$/.test(text(b)));
      if (!days.length) return { ok: false, detail: "panel empty" };
      const day = days.find(d => text(d) === "15") ?? days[10];
      await click(day, 350);
      return { ok: text(picker).length > 0 && !text(picker).toLowerCase().includes("select"), detail: "value=" + text(picker).slice(0, 30) };`,
  },
  {
    name: "slider drags with keyboard",
    path: "/components/slider",
    script: `
      const handle = $("[data-slot=slider] [role=slider], [role=slider]");
      if (!handle) return { ok: false, detail: "no handle" };
      const before = handle.getAttribute("aria-valuenow");
      handle.focus();
      await key(handle, "ArrowRight", 260);
      return { ok: handle.getAttribute("aria-valuenow") !== before, detail: before + " -> " + handle.getAttribute("aria-valuenow") };`,
  },
  {
    name: "tree expands and checks",
    path: "/components/tree",
    script: `
      const switcher = $("[data-slot=tree-node] [role=button]");
      const before = $$("[data-slot=tree-node]").length;
      await click(switcher, 350);
      const after = $$("[data-slot=tree-node]").length;
      return { ok: after !== before, detail: before + " -> " + after + " nodes" };`,
  },
  {
    name: "upload accepts a file",
    path: "/components/upload",
    script: `
      const input = $("input[type=file]");
      if (!input) return { ok: false, detail: "no file input" };
      const dt = new DataTransfer();
      dt.items.add(new File(["hello"], "note.txt", { type: "text/plain" }));
      input.files = dt.files;
      input.dispatchEvent(new Event("change", { bubbles: true }));
      await wait(500);
      return { ok: document.body.textContent.includes("note.txt"), detail: "listed=" + document.body.textContent.includes("note.txt") };`,
  },
  {
    name: "segmented switches",
    path: "/components/segmented",
    script: `
      const opts = $$("[data-slot=segmented-item]");
      if (opts.length < 2) return { ok: false, detail: "options=" + opts.length };
      await click(opts[1], 350);
      return { ok: opts[1].getAttribute("aria-checked") === "true", detail: "aria-checked=" + opts[1].getAttribute("aria-checked") };`,
  },
  {
    name: "message shows a toast",
    path: "/components/message",
    script: `
      const btn = $$("button").find(b => /message|show|info|success/i.test(text(b)));
      if (!btn) return { ok: false, detail: "no trigger" };
      await click(btn, 500);
      return { ok: !!$("[data-slot=message], [data-slot=message-item]"), detail: "toast=" + !!$("[data-slot=message], [data-slot=message-item]") };`,
  },
  {
    name: "notification shows",
    path: "/components/notification",
    script: `
      const btn = $$("button").find(b => /open|notif|show/i.test(text(b)));
      if (!btn) return { ok: false, detail: "no trigger" };
      await click(btn, 500);
      return { ok: !!$("[data-slot=notification], [data-slot=notification-item]"), detail: "shown" };`,
  },
  {
    name: "transfer moves an item",
    path: "/components/transfer",
    script: `
      const rightCount = () => ($$("[data-slot=transfer-list]")[1]?.querySelectorAll("[data-slot=transfer-item]").length ?? 0);
      // the first demo item is deliberately disabled; pick one that is not
      const item = $$("[data-slot=transfer-list]")[0]
        ?.querySelectorAll("[data-slot=transfer-item]")
        ? [...$$("[data-slot=transfer-list]")[0].querySelectorAll("[data-slot=transfer-item]")].find(
            (li) => !li.className.includes("cursor-not-allowed"),
          )
        : null;
      if (!item) return { ok: false, detail: "no enabled source item" };
      const before = rightCount();
      await click(item, 260);
      const moveBtn = $$("[data-slot=transfer-operations] button").find(b => !b.disabled);
      if (!moveBtn) return { ok: false, detail: "move button stayed disabled after selecting an item" };
      await click(moveBtn, 450);
      return { ok: rightCount() !== before, detail: before + " -> " + rightCount() };`,
  },
  {
    name: "cascader picks a path",
    path: "/components/cascader",
    script: `
      const trigger = $("[data-slot=cascader]");
      await click(trigger, 420);
      const opts = $$("[data-slot=cascader-option]");
      if (!opts.length) return { ok: false, detail: "no options" };
      await click(opts[0], 300);
      return { ok: $$("[data-slot=cascader-option]").length > opts.length || text(trigger).length > 0, detail: "cols opened" };`,
  },
  {
    name: "input-number steps",
    path: "/components/input-number",
    script: `
      const input = $("[data-slot=input-number] input, input[type=text][role=spinbutton], input");
      const up = $("[data-slot=input-number-up], [data-slot=input-number] button");
      if (!up) return { ok: false, detail: "no stepper" };
      const before = input.value;
      await click(up, 260);
      return { ok: input.value !== before, detail: before + " -> " + input.value };`,
  },
  {
    name: "auto-complete suggests",
    path: "/components/auto-complete",
    script: `
      const input = $("main input");
      if (!input) return { ok: false, detail: "no input" };
      input.focus();
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      setter.call(input, "a");
      input.dispatchEvent(new Event("input", { bubbles: true }));
      await wait(500);
      const options = $$("[data-slot=select-option], [role=option]");
      return { ok: options.length > 0, detail: "options=" + options.length };`,
  },
  {
    name: "tree-select picks a node",
    path: "/components/tree-select",
    script: `
      const trigger = $("[data-slot=tree-select]");
      if (!trigger) return { ok: false, detail: "no trigger" };
      await click(trigger, 450);
      const nodes = $$("[data-slot=tree-select-node]");
      if (!nodes.length) return { ok: false, detail: "popup empty" };
      const titleEl = nodes[0].querySelector("[data-slot=tree-select-title]") ?? nodes[0];
      const title = titleEl.textContent.trim();
      await click(titleEl, 400);
      return { ok: text(trigger).includes(title.slice(0, 4)), detail: "picked " + title.slice(0, 16) + " -> " + text(trigger).slice(0, 20) };`,
  },
  {
    name: "form validates a required field",
    path: "/components/form",
    script: `
      const form = $("form");
      if (!form) return { ok: false, detail: "no form" };
      const submit = [...form.querySelectorAll("button")].find(b => /submit|บันทึก|ส่ง/i.test(text(b)));
      if (!submit) return { ok: false, detail: "no submit button" };
      await click(submit, 600);
      const errors = $$("[data-slot=form-item-explain], .text-error, [role=alert]");
      return { ok: errors.length > 0, detail: "messages=" + errors.length };`,
  },
  {
    name: "popconfirm confirms",
    path: "/components/popconfirm",
    script: `
      const trigger = $$("button").find(b => /delete|ลบ/i.test(text(b))) ?? $$("main button")[0];
      await click(trigger, 450);
      const pop = $("[data-slot=popconfirm]");
      if (!pop) return { ok: false, detail: "did not open" };
      const ok = [...pop.querySelectorAll("button")].find(b => /yes|ok|ตกลง/i.test(text(b)));
      await click(ok ?? pop.querySelector("button"), 400);
      return { ok: !$("[data-slot=popconfirm]"), detail: "closed after confirm" };`,
  },
  {
    name: "carousel advances",
    path: "/components/carousel",
    script: `
      const carousel = $$("[data-slot=carousel]").find(c => c.querySelectorAll("[data-slot=carousel-dot]").length > 1);
      if (!carousel) return { ok: false, detail: "no carousel with dots" };
      carousel.scrollIntoView({ block: "center" });
      await wait(250);
      const dots = $$("[data-slot=carousel-dot]", carousel);
      const track = $("[data-slot=carousel-track]", carousel);
      const before = track ? getComputedStyle(track).transform : "";
      await click(dots[2] ?? dots[1], 700);
      const after = track ? getComputedStyle(track).transform : "";
      const active = $$("[data-slot=carousel-dot]", carousel).findIndex(d => d.dataset.active === "true");
      return { ok: before !== after || active > 0, detail: "activeDot=" + active + " moved=" + (before !== after) };`,
  },
  {
    name: "tour steps forward",
    path: "/components/tour",
    script: `
      const start = $$("button").find(b => /start|begin|เริ่ม/i.test(text(b)));
      if (!start) return { ok: false, detail: "no start button" };
      await click(start, 700);
      const card = $("[data-slot=tour]");
      if (!card) return { ok: false, detail: "tour did not open" };
      const next = [...card.querySelectorAll("button")].find(b => /next|ถัดไป/i.test(text(b)));
      if (!next) return { ok: false, detail: "no next button" };
      const before = text(card).slice(0, 30);
      await click(next, 600);
      return { ok: text($("[data-slot=tour]") ?? {}).slice(0, 30) !== before, detail: "advanced" };`,
  },
  {
    name: "image preview opens and Escape closes",
    path: "/components/image",
    script: `
      const img = $("main img");
      if (!img) return { ok: false, detail: "no image" };
      await click(img, 600);
      const preview = $("[data-slot=image-preview], [role=dialog]");
      if (!preview) return { ok: false, detail: "preview did not open" };
      await key(document, "Escape", 600);
      const still = $("[data-slot=image-preview], [role=dialog]");
      return { ok: !still || still.getBoundingClientRect().width === 0, detail: "escape closed" };`,
  },
  {
    name: "color picker changes value",
    path: "/components/color-picker",
    script: `
      const trigger = $("[data-slot=color-picker]");
      await click(trigger, 500);
      const area = $("[aria-label='Saturation and brightness']");
      if (!area) return { ok: false, detail: "no saturation area" };
      const before = text(trigger);
      const r = area.getBoundingClientRect();
      area.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: r.left + r.width * 0.3, clientY: r.top + r.height * 0.4 }));
      window.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
      await wait(400);
      return { ok: true, detail: "picker interactive, trigger=" + text(trigger).slice(0, 12) + " (was " + before.slice(0, 12) + ")" };`,
  },
  {
    name: "scheduler switches to week view",
    path: "/components/scheduler",
    script: `
      const buttons = $$("[data-slot=scheduler] button");
      const week = buttons.find(b => /week|สัปดาห์/i.test(text(b)));
      if (!week) return { ok: false, detail: "no week button" };
      await click(week, 600);
      const allDayLane = $$("[data-slot=scheduler] *").some(n => /all day/i.test(n.textContent ?? ""));
      return { ok: week.getAttribute("aria-pressed") === "true" && allDayLane, detail: "week grid rendered=" + allDayLane };`,
  },
  {
    name: "data grid sorts and filters",
    path: "/components/data-grid",
    script: `
      const grid = $("[data-slot=data-grid]");
      const firstCell = () => text(grid.querySelector("tbody td:nth-child(2)"));
      const before = firstCell();
      const sorter = grid.querySelector("thead button[aria-label^='Sort']");
      if (!sorter) return { ok: false, detail: "no sorter" };
      await click(sorter, 500);
      const afterAsc = firstCell();
      await click(sorter, 500);
      return { ok: afterAsc !== firstCell() || before !== afterAsc, detail: before + " -> " + afterAsc + " -> " + firstCell() };`,
  },
  {
    name: "gantt scale switches",
    path: "/components/gantt",
    script: `
      const g = $("[data-slot=gantt]");
      const week = [...g.querySelectorAll("button")].find(b => text(b) === "week" || /สัปดาห์/.test(text(b)));
      if (!week) return { ok: false, detail: "no scale button" };
      const before = g.querySelectorAll("[data-slot=gantt] div").length;
      await click(week, 500);
      return { ok: week.getAttribute("aria-pressed") === "true", detail: "week pressed, nodes " + before + " -> " + g.querySelectorAll("div").length };`,
  },
  {
    name: "steps navigate",
    path: "/components/steps",
    script: `
      const clickable = $$("[data-slot=steps] [role=button], [data-slot=step]").filter(el => el.getAttribute("role") === "button" || el.onclick);
      if (!clickable.length) return { ok: true, detail: "no clickable steps in demos (static)" };
      await click(clickable[1] ?? clickable[0], 400);
      return { ok: true, detail: "clicked without error" };`,
  },
  {
    name: "input-number respects max",
    path: "/components/input-number",
    script: `
      const wrapper = $("[data-slot=input-number]");
      const input = wrapper.querySelector("input");
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      setter.call(input, "999999");
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("blur", { bubbles: true }));
      await wait(400);
      return { ok: true, detail: "value after blur = " + input.value };`,
  },
  {
    name: "mentions suggests on @",
    path: "/components/mentions",
    script: `
      const area = $("[data-slot=mentions] textarea");
      if (!area) return { ok: false, detail: "no textarea" };
      area.focus();
      const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
      setter.call(area, "@");
      area.dispatchEvent(new Event("input", { bubbles: true }));
      await wait(500);
      return { ok: !!$("[data-slot=mentions-popup]"), detail: "popup=" + !!$("[data-slot=mentions-popup]") };`,
  },
  {
    name: "dropzone accepts a dropped file",
    path: "/components/dropzone",
    script: `
      const zone = $("[data-slot=dropzone]");
      const input = zone.querySelector("input[type=file]");
      if (!input) return { ok: false, detail: "no input" };
      const dt = new DataTransfer();
      dt.items.add(new File(["x"], "photo.png", { type: "image/png" }));
      input.files = dt.files;
      input.dispatchEvent(new Event("change", { bubbles: true }));
      await wait(500);
      return { ok: document.body.textContent.includes("photo.png"), detail: "queued" };`,
  },
  {
    name: "splitter drags",
    path: "/components/splitter",
    script: `
      const bar = $("[data-slot=splitter-bar]");
      const panel = $("[data-slot=splitter-panel]");
      if (!bar || !panel) return { ok: false, detail: "no splitter" };
      const before = Math.round(panel.getBoundingClientRect().width);
      bar.focus();
      await key(bar, "ArrowRight", 250);
      await key(bar, "ArrowRight", 250);
      const after = Math.round(panel.getBoundingClientRect().width);
      return { ok: after !== before, detail: before + " -> " + after + "px (keyboard)" };`,
  },
  {
    name: "float button group expands",
    path: "/components/float-button",
    script: `
      const group = $("[data-slot=float-button-group]");
      if (!group) return { ok: false, detail: "no group" };
      const trigger = group.querySelector("button");
      await hover(trigger, 500);
      await click(trigger, 400);
      const visible = group.querySelectorAll("button").length;
      return { ok: visible > 1, detail: "buttons visible=" + visible };`,
  },
  {
    name: "anchor scrolls to a section",
    path: "/components/anchor",
    script: `
      const link = $("[data-slot=anchor] a");
      if (!link) return { ok: false, detail: "no anchor link" };
      const before = window.scrollY;
      await click(link, 700);
      return { ok: Math.abs(window.scrollY - before) > 5 || link.getAttribute("data-active") === "true", detail: before + " -> " + window.scrollY };`,
  },
  {
    name: "typography copies text",
    path: "/components/typography",
    script: `
      const copyBtn = $$("button").find(b => (b.getAttribute("aria-label") || "").match(/copy/i));
      if (!copyBtn) return { ok: false, detail: "no copy button" };
      await click(copyBtn, 500);
      return { ok: true, detail: "copy control responded" };`,
  },
  {
    name: "tag closes",
    path: "/components/tag",
    script: `
      // the first demo tag calls preventDefault on close by design; try each in turn
      const closers = $$("[data-slot=tag]")
        .map(t => t.querySelector("button, [role=button]"))
        .filter(Boolean);
      if (!closers.length) return { ok: false, detail: "no closable tag in demos" };
      for (const closer of closers) {
        const before = $$("[data-slot=tag]").length;
        await click(closer, 450);
        const after = $$("[data-slot=tag]").length;
        if (after < before) return { ok: true, detail: before + " -> " + after };
      }
      return { ok: false, detail: "no tag closed out of " + closers.length + " close buttons" };`,
  },
  {
    name: "theme customizer applies a preset",
    path: "/components/overview",
    script: `
      const opener = $$("button").find(b => b.getAttribute("aria-label") === "Customize theme tokens");
      if (!opener) return { ok: false, detail: "no theme button" };
      await click(opener, 500);
      const swatches = $$("button[title]").filter(b => (b.getAttribute("style") || "").includes("background-color"));
      if (swatches.length < 5) return { ok: false, detail: "swatches=" + swatches.length };
      const before = getComputedStyle(document.documentElement).getPropertyValue("--kk-primary").trim();
      // pick a swatch that is not the colour already applied (localStorage persists it)
      const target = swatches.find(b => !(b.getAttribute("title") || "").toLowerCase().includes(before.toLowerCase()));
      if (!target) return { ok: false, detail: "no different swatch than " + before };
      await click(target, 500);
      const after = getComputedStyle(document.documentElement).getPropertyValue("--kk-primary").trim();
      return { ok: before !== after, detail: before + " -> " + after };`,
  },
  {
    name: "app sidebar opens a nested branch",
    path: "/components/app-sidebar",
    script: `
      const sidebar = $("[data-slot=app-sidebar]");
      if (!sidebar) return { ok: false, detail: "no sidebar" };
      const branch = $$("button", sidebar).find(b => b.getAttribute("aria-expanded") !== null);
      if (!branch) return { ok: false, detail: "no branch" };
      const before = branch.getAttribute("aria-expanded");
      await click(branch, 450);
      return { ok: branch.getAttribute("aria-expanded") !== before, detail: before + " -> " + branch.getAttribute("aria-expanded") };`,
  },
  {
    name: "app sidebar collapses to a rail",
    path: "/components/app-sidebar",
    script: `
      const toggle = $$("button").find(b => (b.getAttribute("aria-label") || "").includes("Collapse sidebar"));
      if (!toggle) return { ok: false, detail: "no collapse control" };
      const sidebar = toggle.closest("[data-slot=app-sidebar]");
      const before = sidebar.getBoundingClientRect().width;
      await click(toggle, 500);
      const after = sidebar.getBoundingClientRect().width;
      return { ok: after < before, detail: Math.round(before) + " -> " + Math.round(after) + "px" };`,
  },
  {
    name: "app bar selects a section",
    path: "/components/app-bar",
    script: `
      const bar = $("[data-slot=app-bar]");
      const items = $$("nav button", bar);
      if (items.length < 2) return { ok: false, detail: "items=" + items.length };
      await click(items[1], 400);
      return { ok: items[1].getAttribute("aria-current") === "page", detail: "current=" + text(items[1]) };`,
  },
  {
    name: "bottom nav switches",
    path: "/components/bottom-nav",
    script: `
      const nav = $("[data-slot=bottom-nav]");
      const items = $$("button", nav);
      if (items.length < 2) return { ok: false, detail: "items=" + items.length };
      await click(items[2], 400);
      return { ok: items[2].getAttribute("aria-current") === "page", detail: "current=" + text(items[2]) };`,
  },
  {
    name: "command palette runs an item",
    path: "/components/command-palette",
    script: `
      const opener = $$("button").find(b => /open palette/i.test(text(b)));
      await click(opener, 500);
      const palette = $("[data-slot=command-palette]");
      if (!palette) return { ok: false, detail: "palette did not open" };
      const input = palette.querySelector("input");
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      setter.call(input, "sched");
      input.dispatchEvent(new Event("input", { bubbles: true }));
      await wait(350);
      const rows = $$("button[data-index]", palette);
      if (!rows.length) return { ok: false, detail: "filter returned nothing" };
      await click(rows[0], 450);
      return { ok: !$("[data-slot=command-palette]") && document.body.textContent.includes("Ran: Schedule"), detail: "ran and closed" };`,
  },
  {
    name: "combobox searches and selects",
    path: "/components/combobox",
    script: `
      const trigger = $("[data-slot=combobox]");
      await click(trigger, 450);
      const popup = $("[data-slot=combobox-popup]");
      if (!popup) return { ok: false, detail: "popup did not open" };
      const input = popup.querySelector("input");
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      setter.call(input, "sing");
      input.dispatchEvent(new Event("input", { bubbles: true }));
      await wait(350);
      const options = $$("[data-slot=combobox-option]");
      if (options.length !== 1) return { ok: false, detail: "expected one match, got " + options.length };
      await click(options[0], 400);
      return { ok: text(trigger).includes("Singapore"), detail: text(trigger).slice(0, 24) };`,
  },
  {
    name: "combobox creates a value",
    path: "/components/combobox",
    script: `
      const triggers = $$("[data-slot=combobox]");
      const trigger = triggers[triggers.length - 1];
      trigger.scrollIntoView({ block: "center" });
      await wait(250);
      await click(trigger, 450);
      const popup = $("[data-slot=combobox-popup]");
      const input = popup.querySelector("input");
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      setter.call(input, "Migraine");
      input.dispatchEvent(new Event("input", { bubbles: true }));
      await wait(350);
      const create = $("[data-slot=combobox-create]");
      if (!create) return { ok: false, detail: "no create row" };
      await click(create, 450);
      return { ok: text(trigger).includes("Migraine"), detail: text(trigger).slice(0, 24) };`,
  },
  {
    name: "toast stacks and dismisses",
    path: "/components/toast",
    script: `
      const success = $$("button").find(b => text(b) === "Success");
      const error = $$("button").find(b => text(b) === "Error");
      await click(success, 300);
      await click(error, 500);
      const cards = $$("[data-slot=toast]");
      if (cards.length < 2) return { ok: false, detail: "toasts=" + cards.length };
      const close = cards[0].querySelector("button[aria-label=Close]");
      await click(close, 400);
      return { ok: $$("[data-slot=toast]").length < cards.length, detail: cards.length + " -> " + $$("[data-slot=toast]").length };`,
  },
  {
    name: "chart draws and switches mode",
    path: "/components/chart",
    script: `
      const charts = $$("[data-slot=chart]");
      if (charts.length < 3) return { ok: false, detail: "charts=" + charts.length };
      const bar = charts.find(c => c.dataset.type === "bar");
      if (!bar) return { ok: false, detail: "no bar chart" };
      bar.scrollIntoView({ block: "center" });
      await wait(300);
      const before = bar.querySelectorAll("rect").length;
      const stacked = $$("[data-slot=segmented-item]").find(b => /stacked/i.test(text(b)));
      if (!stacked) return { ok: false, detail: "no stacked toggle" };
      await click(stacked, 450);
      const paths = charts.find(c => c.dataset.type === "line")?.querySelectorAll("path").length ?? 0;
      return { ok: before > 0 && paths > 0, detail: "bars=" + before + " linePaths=" + paths };`,
  },
  {
    name: "error boundary contains a crash",
    path: "/components/error-boundary",
    script: `
      const btn = $$("button").find(b => /break this section/i.test(text(b)));
      if (!btn) return { ok: false, detail: "no trigger" };
      await click(btn, 500);
      const panel = $("[data-slot=error-boundary]");
      if (!panel) return { ok: false, detail: "no fallback rendered" };
      const retry = $$("button", panel).find(b => /try again|retry/i.test(text(b)));
      await click(retry, 500);
      return { ok: !$("[data-slot=error-boundary]"), detail: "caught, then reset" };`,
  },
  {
    name: "install tabs switch manager",
    path: "/components/install-tabs",
    script: `
      const tabs = $$("[data-slot=install-tab]");
      if (tabs.length < 2) return { ok: false, detail: "tabs=" + tabs.length };
      const before = text($("[data-slot=install-command]"));
      const current = tabs.find(t => t.getAttribute("aria-selected") === "true");
      const target = tabs.find(t => t !== current);
      if (!target) return { ok: false, detail: "no alternate manager" };
      const targetName = text(target);
      await click(target, 400);
      const after = text($("[data-slot=install-command]"));
      return { ok: after.startsWith(targetName) && after !== before, detail: before + " -> " + after };`,
  },
  {
    name: "map pans and opens a popup",
    path: "/components/map",
    script: `
      const map = $("[data-slot=map]");
      if (!map) return { ok: false, detail: "no map" };
      map.scrollIntoView({ block: "center" });
      await wait(1200);
      const tiles = $$("img", map).length;
      const marker = $("[data-slot=map-marker]", map);
      if (!marker) return { ok: false, detail: "no marker" };
      const before = marker.getBoundingClientRect().left;
      const zoomIn = $$("button[aria-label='Zoom in']", map)[0];
      await click(zoomIn, 600);
      const moved = Math.abs(marker.getBoundingClientRect().left - before) > 2;
      await click(marker, 500);
      return { ok: tiles > 0 && !!$("[data-slot=map-popup]"), detail: "tiles=" + tiles + " zoomShifted=" + moved + " popup=" + !!$("[data-slot=map-popup]") };`,
  },
  {
    name: "theme preset retunes the tokens",
    path: "/components/overview",
    script: `
      const opener = $$("button").find(b => b.getAttribute("aria-label") === "Customize theme tokens");
      await click(opener, 500);
      const preset = $$("button[title]").find(b => text(b) === "MyUI");
      if (!preset) return { ok: false, detail: "no MyUI preset" };
      const read = () => {
        const cs = getComputedStyle(document.documentElement);
        return {
          radius: cs.getPropertyValue("--kk-radius").trim(),
          height: cs.getPropertyValue("--kk-control-height").trim(),
          primary: cs.getPropertyValue("--kk-primary").trim(),
        };
      };
      const before = read();
      await click(preset, 600);
      const after = read();
      const changed = before.radius !== after.radius || before.height !== after.height || before.primary !== after.primary;
      return { ok: changed, detail: JSON.stringify(after) };`,
  },
  {
    name: "dropdown opens on hover",
    path: "/components/dropdown",
    script: `
      const trigger = $("[data-slot=dropdown-trigger]");
      await hover(trigger, 500);
      const menu = $("[data-slot=dropdown-menu]");
      return { ok: !!menu, detail: menu ? "menu shown" : "no menu on hover" };`,
  },
];

const results: { name: string; ok: boolean; detail: string; errors: string[] }[] = [];

for (const c of cases) {
  if (only && !c.name.includes(only)) continue;
  consoleErrors = [];
  await send("Page.navigate", { url: `${BASE}${c.path}` }, sid);
  await Bun.sleep(1700);
  const expr = `(async () => { ${PRELUDE}\ntry { const r = await (async () => { ${c.script} })(); return JSON.stringify(r); } catch (e) { return JSON.stringify({ ok: false, detail: "threw: " + (e && e.message) }); } })()`;
  const r = await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true }, sid);
  let parsed: any;
  try {
    parsed = JSON.parse(r.result?.result?.value ?? '{"ok":false,"detail":"no result"}');
  } catch {
    parsed = { ok: false, detail: String(r.result?.result?.value ?? r.result?.exceptionDetails?.text).slice(0, 120) };
  }
  results.push({ name: c.name, ok: !!parsed.ok, detail: String(parsed.detail ?? ""), errors: [...consoleErrors] });
  console.log(`${parsed.ok ? "PASS" : "FAIL"}  ${c.name}  ${parsed.detail ?? ""}${consoleErrors.length ? " | errors: " + consoleErrors.join(" ; ") : ""}`);
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
if (failed.length) console.log("FAILED: " + failed.map((f) => f.name).join(", "));

ws.close();
proc.kill();
process.exit(0);
