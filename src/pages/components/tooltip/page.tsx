import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Placement from "./demos/placement";
import placementCode from "./demos/placement.tsx?raw";
import Arrow from "./demos/arrow";
import arrowCode from "./demos/arrow.tsx?raw";
import Colorful from "./demos/colorful";
import colorfulCode from "./demos/colorful.tsx?raw";
import AutoAdjust from "./demos/auto-adjust";
import autoAdjustCode from "./demos/auto-adjust.tsx?raw";
import Disabled from "./demos/disabled";
import disabledCode from "./demos/disabled.tsx?raw";
import Trigger from "./demos/trigger";
import triggerCode from "./demos/trigger.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="tooltip"
      imports={["Tooltip"]}
      whenToUse={tr(
        <>
          <p>คำอธิบายจะแสดงเมื่อเมาส์เข้า และซ่อนเมื่อเมาส์ออก Tooltip ไม่รองรับข้อความซับซ้อนหรือการกระทำ</p>
          <p className="mt-2">ใช้อธิบาย element หรือให้ข้อความช่วยเหลือสั้นๆ ถ้าต้องการเนื้อหาแบบ rich หรือมีปุ่มให้กด ใช้ Popover แทน</p>
          <p className="mt-2">สร้างบน KKUI Tooltip โดยมี provider อยู่ในคอมโพเนนต์ให้แล้ว จึงไม่ต้องครอบที่ระดับ root</p>
        </>,
        <>
          <p>The tip is shown on mouse enter, and is hidden on mouse leave. The Tooltip does not support complex text or operations.</p>
          <p className="mt-2">Use it to describe an element or a short piece of help text. If you need rich content or actions, use Popover instead.</p>
          <p className="mt-2">Built on KKUI Tooltip; a provider is created inside the component so no root-level wrapper is required.</p>
        </>,
      )}
      demos={[
        { title: tr("พื้นฐาน", "Basic"), description: tr("การใช้งานแบบง่ายที่สุด", "The simplest usage."), code: basicCode, component: <Basic /> },
        { title: tr("ตำแหน่ง", "Placement"), description: tr(<>มีตัวเลือก <code>placement</code> ให้ใช้ 12 แบบ</>, <>There are 12 <code>placement</code> options available.</>), code: placementCode, component: <Placement /> },
        { title: tr("หัวลูกศร", "Arrow"), description: tr(<>ซ่อนหัวลูกศรด้วย <code>arrow={"{false}"}</code> หรือให้ชี้กลาง trigger เสมอด้วย <code>{"arrow={{ pointAtCenter: true }}"}</code></>, <>Hide the arrow with <code>arrow={"{false}"}</code> or keep it pointing at the trigger center with <code>{"arrow={{ pointAtCenter: true }}"}</code>.</>), code: arrowCode, component: <Arrow /> },
        { title: tr("Tooltip หลากสี", "Colorful Tooltip"), description: tr(<>ใส่ชื่อสีสำเร็จรูปหรือ css color ใดก็ได้ใน <code>color</code> หัวลูกศรจะเปลี่ยนตาม</>, <>Use a preset name or any css color for <code>color</code>; the arrow follows.</>), code: colorfulCode, component: <Colorful /> },
        { title: tr("ปรับตำแหน่งอัตโนมัติ", "Adjust placement automatically"), description: tr("tooltip จะพลิกหรือเลื่อนเพื่อให้อยู่ใน viewport เสมอ ลองเลื่อนกล่องดูเปรียบเทียบ", "The tooltip flips or shifts to stay in the viewport. Scroll the box to compare."), code: autoAdjustCode, component: <AutoAdjust /> },
        { title: tr("children ที่ถูก disabled", "Disabled children"), description: tr("element ที่ disabled จะไม่ส่ง mouse event ให้ครอบด้วย span เพื่อให้ tooltip ยังแสดงได้", "Disabled elements do not emit mouse events; wrap them in a span so the tooltip still shows."), code: disabledCode, component: <Disabled /> },
        { title: tr("trigger และดีเลย์", "Trigger & delay"), description: tr(<>เลือก <code>trigger</code> (hover / focus / click) ปรับ <code>mouseEnterDelay</code> / <code>mouseLeaveDelay</code> หรือคุมการแสดงผลเองผ่าน <code>open</code></>, <>Choose <code>trigger</code> (hover / focus / click), tune <code>mouseEnterDelay</code> / <code>mouseLeaveDelay</code>, or control <code>open</code>.</>), code: triggerCode, component: <Trigger /> },
      ]}
      api={[
        {
          title: "Tooltip",
          rows: [
            { property: "title", description: "The text shown in the tooltip; empty title renders nothing", type: "ReactNode", default: "-" },
            { property: "placement", description: "Position of the tooltip relative to the target", type: "top | left | right | bottom | topLeft | topRight | bottomLeft | bottomRight | leftTop | leftBottom | rightTop | rightBottom", default: "top" },
            { property: "color", description: "Background color: preset name (magenta, red, volcano, orange, gold, lime, green, cyan, blue, geekblue, purple) or css color", type: "string", default: "-" },
            { property: "arrow", description: "Show the arrow, and whether it points at the trigger center", type: "boolean | { pointAtCenter: boolean }", default: "true" },
            { property: "open", description: "Controlled visibility", type: "boolean", default: "-" },
            { property: "defaultOpen", description: "Initial visibility", type: "boolean", default: "false" },
            { property: "onOpenChange", description: "Called when visibility changes", type: "(open: boolean) => void", default: "-" },
            { property: "trigger", description: "Event(s) that show the tooltip", type: "hover | focus | click | Array<hover | focus | click>", default: "hover" },
            { property: "mouseEnterDelay", description: "Delay in seconds before showing", type: "number", default: "0.1" },
            { property: "mouseLeaveDelay", description: "Delay in seconds before hiding", type: "number", default: "0.1" },
            { property: "autoAdjustOverflow", description: "Flip / shift when the tooltip would overflow the viewport", type: "boolean", default: "true" },
            { property: "destroyOnHidden", description: "Unmount the tooltip content when hidden", type: "boolean", default: "true" },
            { property: "overlayClassName", description: "Class of the tooltip card", type: "string", default: "-" },
            { property: "overlayStyle", description: "Style of the tooltip card", type: "CSSProperties", default: "-" },
            { property: "overlayInnerStyle", description: "Style of the inner content", type: "CSSProperties", default: "-" },
            { property: "zIndex", description: "z-index of the tooltip", type: "number", default: "50" },
            { property: "children", description: "The trigger; a non-element child is wrapped in a span", type: "ReactNode", default: "-" },
          ],
        },
        {
          title: "TooltipProvider",
          description: "Optional tooltip provider to share delayDuration / skipDelayDuration among many tooltips.",
          rows: [
            { property: "delayDuration", description: "Delay in ms before opening", type: "number", default: "700" },
            { property: "skipDelayDuration", description: "Time in ms a user has to move to another trigger without incurring the delay", type: "number", default: "300" },
          ],
        },
      ]}
      extra={tr(
        <>
          <h2>หมายเหตุ</h2>
          <p>child ของ <code>Tooltip</code> ต้องรับ <code>onMouseEnter</code>, <code>onMouseLeave</code>, <code>onFocus</code>, <code>onClick</code> และ ref ได้ คอมโพเนนต์ที่เขียนเองต้องส่งพร็อพเหล่านี้ต่อไปยัง DOM element</p>
        </>,
        <>
          <h2>Note</h2>
          <p>Ensure the child of <code>Tooltip</code> accepts <code>onMouseEnter</code>, <code>onMouseLeave</code>, <code>onFocus</code>, <code>onClick</code> and a ref. Custom components must forward these props to a DOM element.</p>
        </>,
      )}
      related={[{ title: "Popover", path: "/components/popover" }, { title: "Popconfirm", path: "/components/popconfirm" }]}
    />
  );
}
