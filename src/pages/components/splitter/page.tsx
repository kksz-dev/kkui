import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Control from "./demos/control";
import controlCode from "./demos/control.tsx?raw";
import Vertical from "./demos/vertical";
import verticalCode from "./demos/vertical.tsx?raw";
import Multiple from "./demos/multiple";
import multipleCode from "./demos/multiple.tsx?raw";
import Collapsible from "./demos/collapsible";
import collapsibleCode from "./demos/collapsible.tsx?raw";
import Size from "./demos/size";
import sizeCode from "./demos/size.tsx?raw";
import Callback from "./demos/callback";
import callbackCode from "./demos/callback.tsx?raw";
import Lazy from "./demos/lazy";
import lazyCode from "./demos/lazy.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="splitter"
      defaultDemoSize="full"
      imports={["Splitter", "SplitterPanel"]}
      whenToUse={tr(
        <>
          <p>
            Splitter แบ่งพื้นที่ออกเป็นแพเนลที่ปรับขนาดได้ ห่อ <code>SplitterPanel</code> ไว้ใน <code>Splitter</code> ทุกช่องว่างระหว่างแพเนลจะมีแถบให้ลาก
            และถ้าแพเนลเป็น collapsible จะมีลูกศรเล็ก ๆ สำหรับพับแพเนลเก็บ
          </p>
          <ul>
            <li>ใช้เมื่อผู้ใช้ต้องแบ่งพื้นที่ระหว่างสองมุมมอง เช่น editor กับ preview, รายการกับรายละเอียด, tree กับ canvas</li>
            <li>ขนาดเป็นพิกเซล สตริงอย่าง <code>"30%"</code> จะคำนวณจากขนาด container แพเนลที่ไม่กำหนดขนาดจะแบ่งพื้นที่ที่เหลือเท่า ๆ กัน</li>
            <li>container ต้องมีขนาดของตัวเอง (กำหนดความสูงตายตัวเมื่อใช้ <code>layout="vertical"</code>)</li>
            <li>แถบโฟกัสด้วยคีย์บอร์ดได้: ลูกศรเลื่อนทีละ 10px (กด Shift ค้างเป็น 40px) ส่วน Home / End กระโดดไปสุดขอบที่ min / max อนุญาต</li>
          </ul>
        </>,
        <>
          <p>
            Splitter divides an area into resizable panes. Wrap <code>SplitterPanel</code>s in a <code>Splitter</code>; every gap gets a draggable bar and,
            for collapsible panels, small arrows that fold a pane away.
          </p>
          <ul>
            <li>Use it when the user needs to trade space between two views: an editor and a preview, a list and its detail, a tree and a canvas.</li>
            <li>Sizes are pixels; strings like <code>"30%"</code> are resolved against the container. Panels without a size share the remaining space.</li>
            <li>The container must have a size of its own (a fixed height for <code>layout="vertical"</code>).</li>
            <li>The bar is keyboard focusable: arrow keys move it by 10px (40px with Shift), Home / End jump to the limit allowed by min / max.</li>
          </ul>
        </>,
      )}
      demos={[
        { title: tr("พื้นฐาน", "Basic"), description: tr(<>สองแพเนล แพเนลแรกกำหนด <code>defaultSize</code>, <code>min</code> และ <code>max</code></>, <>Two panes, the first with <code>defaultSize</code>, <code>min</code> and <code>max</code>.</>), code: basicCode, component: <Basic /> },
        { title: tr("โหมดควบคุม", "Control mode"), description: tr(<>ส่ง <code>size</code> แล้วอัปเดตค่าใน <code>onResize</code> ส่วน <code>resizable={"{false}"}</code> จะล็อกแถบรอบแพเนลนั้น</>, <>Pass <code>size</code> and update it in <code>onResize</code>. <code>resizable={"{false}"}</code> locks a panel's bars.</>), code: controlCode, component: <Control /> },
        { title: tr("แนวตั้ง", "Vertical"), description: tr(<><code>layout="vertical"</code> วางแพเนลซ้อนกันในแนวตั้ง ต้องกำหนดความสูงให้ container</>, <><code>layout="vertical"</code> stacks the panes; give the container a height.</>), code: verticalCode, component: <Vertical /> },
        { title: tr("ซ้อนกันหลายชั้น", "Complex combination"), description: tr(<>ซ้อน Splitter แนวตั้งไว้ใน Splitter แนวนอน</>, <>Nest a vertical Splitter inside a horizontal one.</>), code: multipleCode, component: <Multiple /> },
        { title: tr("พับเก็บได้", "Collapsible"), description: tr(<><code>collapsible</code> แสดงลูกศรบนแถบ <code>{"{ start: true }"}</code> แสดงลูกศรเฉพาะฝั่งต้นของแพเนล (บนแถบก่อนหน้า)</>, <><code>collapsible</code> shows arrows on the bar; <code>{"{ start: true }"}</code> only puts an arrow on the panel's start side (the bar before it).</>), code: collapsibleCode, component: <Collapsible /> },
        { title: tr("จำกัดขนาด", "Size limits"), description: tr(<><code>min</code> / <code>max</code> เป็น px หรือเปอร์เซ็นต์ จะจำกัดระยะลาก</>, <><code>min</code> / <code>max</code> as px or percentage clamp the drag.</>), code: sizeCode, component: <Size /> },
        { title: tr("โหมดหน่วง", "Lazy"), description: tr(<><code>lazy</code> เลื่อนการปรับขนาดจริงไปตอนปล่อยเมาส์ ระหว่างลากจะเห็นแถบพรีวิวตำแหน่งใหม่แทน</>, <><code>lazy</code> defers the actual resize until the drag ends; a preview bar shows where the split will land.</>), code: lazyCode, component: <Lazy /> },
        { title: tr("คอลแบ็ก", "Callbacks"), description: tr(<><code>onResizeStart</code>, <code>onResize</code> และ <code>onResizeEnd</code> ได้รับขนาด px ของทุกแพเนล</>, <><code>onResizeStart</code>, <code>onResize</code> and <code>onResizeEnd</code> receive the px sizes of every panel.</>), code: callbackCode, component: <Callback /> },
      ]}
      api={[
        {
          title: "Splitter",
          description: tr("ขยายจาก React.ComponentProps<\"div\"> (ยกเว้น `onResize` ดั้งเดิม)", "Extends React.ComponentProps<\"div\"> (except the native `onResize`)."),
          rows: [
            { property: "layout", description: tr("ทิศทางการจัดวาง", "Layout direction"), type: "horizontal | vertical", default: "horizontal" },
            { property: "lazy", description: tr("โหมดหน่วง: ระหว่างลากจะแสดงแถบพรีวิว แล้วค่อยปรับขนาดแพเนลจริง (พร้อม onResize/onResizeEnd) ตอนปล่อย", "Lazy mode: a preview bar follows the pointer and the panels are only resized (with onResize/onResizeEnd) when the drag ends"), type: "boolean", default: "false" },
            { property: "onResizeStart", description: tr("เรียกเมื่อเริ่มปรับขนาด (ลาก คีย์บอร์ด หรือลูกศรพับ)", "Called when a resize starts (drag, keyboard or collapse arrow)"), type: "(sizes: number[]) => void", default: "-" },
            { property: "onResize", description: tr("เรียกเมื่อขนาดแพเนลเปลี่ยน", "Called whenever the panel sizes change"), type: "(sizes: number[]) => void", default: "-" },
            { property: "onResizeEnd", description: tr("เรียกเมื่อการปรับขนาดจบ", "Called when the resize ends"), type: "(sizes: number[]) => void", default: "-" },
            { property: "className", description: tr("className ของ container (กำหนดความสูงตรงนี้)", "Container className (set the height here)"), type: "string", default: "-" },
          ],
        },
        {
          title: "SplitterPanel",
          description: tr("ขยายจาก React.ComponentProps<\"div\"> — className / style / children ส่งต่อไปยังแพเนล", "Extends React.ComponentProps<\"div\">; className / style / children are passed to the pane."),
          rows: [
            { property: "defaultSize", description: tr("ขนาดเริ่มต้น เป็น px หรือสตริงเปอร์เซ็นต์", "Initial panel size, px or percentage string"), type: "number | string", default: "-" },
            { property: "min", description: tr("ขนาดต่ำสุด เป็น px หรือสตริงเปอร์เซ็นต์", "Minimum threshold, px or percentage string"), type: "number | string", default: "-" },
            { property: "max", description: tr("ขนาดสูงสุด เป็น px หรือสตริงเปอร์เซ็นต์", "Maximum threshold, px or percentage string"), type: "number | string", default: "-" },
            { property: "size", description: tr("ขนาดแบบควบคุม เป็น px หรือสตริงเปอร์เซ็นต์", "Controlled panel size, px or percentage string"), type: "number | string", default: "-" },
            { property: "collapsible", description: tr("พับเก็บด่วนด้วยลูกศรบนแถบ (ทั้งสองฝั่ง หรือระบุฝั่ง)", "Quick folding via arrows on the bar (both sides, or per side)"), type: "boolean | { start?: boolean; end?: boolean }", default: "false" },
            { property: "resizable", description: tr("ลากแถบรอบแพเนลนี้ได้หรือไม่", "Whether the bars around this panel can be dragged"), type: "boolean", default: "true" },
          ],
        },
      ]}
      related={[{ title: "Layout", path: "/components/layout" }, { title: "Flex", path: "/components/flex" }]}
    />
  );
}
