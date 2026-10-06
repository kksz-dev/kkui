import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Standalone from "./demos/standalone";
import standaloneCode from "./demos/standalone.tsx?raw";
import Overflow from "./demos/overflow";
import overflowCode from "./demos/overflow.tsx?raw";
import Dot from "./demos/dot";
import dotCode from "./demos/dot.tsx?raw";
import Status from "./demos/status";
import statusCode from "./demos/status.tsx?raw";
import Change from "./demos/change";
import changeCode from "./demos/change.tsx?raw";
import Link from "./demos/link";
import linkCode from "./demos/link.tsx?raw";
import Size from "./demos/size";
import sizeCode from "./demos/size.tsx?raw";
import Colorful from "./demos/colorful";
import colorfulCode from "./demos/colorful.tsx?raw";
import Ribbon from "./demos/ribbon";
import ribbonCode from "./demos/ribbon.tsx?raw";
import Offset from "./demos/offset";
import offsetCode from "./demos/offset.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="badge"
      imports={["Badge", "BadgeRibbon"]}
      whenToUse={tr(
        <>
          <p>Badge คือจุดสีแดงเล็กหรือตัวเลขที่มุมของ element ใช้บอกว่ามีรายการใหม่ งานค้าง หรือสิ่งที่ต้องตรวจสอบ เมื่อใช้เดี่ยวจะแสดงแบบ inline และเมื่อกำหนด <code>status</code> จะแสดงเป็นจุดสีพร้อม label</p>
        </>,
        <>
          <p>A badge is a small red dot or number that sits at the corner of an element to show that something is new, pending or needs attention. Standalone it renders inline; with <code>status</code> it becomes a colored dot with a label.</p>
        </>,
      )}
      demos={[
        { title: tr("พื้นฐาน", "Basic"), description: tr(<>การใช้งานแบบง่าย Badge จะซ่อนเมื่อ <code>count</code> เป็น 0 เว้นแต่กำหนด <code>showZero</code> และใช้ node ใดเป็น count ก็ได้</>, <>Simplest usage. The badge hides when <code>count</code> is 0 unless <code>showZero</code>; any node can be a count.</>), code: basicCode, component: <Basic /> },
        { title: tr("ใช้งานเดี่ยว", "Standalone"), description: tr(<>เมื่อไม่มี children Badge จะแสดงแบบ inline ปรับ indicator ผ่าน <code>classNames.indicator</code> หรือ selector ได้</>, <>Without children the badge is rendered inline. Style the indicator through <code>classNames.indicator</code> or a selector.</>), code: standaloneCode, component: <Standalone /> },
        { title: tr("จำกัดจำนวนสูงสุด", "Overflow Count"), description: tr(<><code>overflowCount</code> จำกัดค่าสูงสุด โดยแสดงเป็น <code>99+</code></>, <><code>overflowCount</code> caps the number, showing <code>99+</code>.</>), code: overflowCode, component: <Overflow /> },
        { title: tr("จุดสีแดง", "Red Badge"), description: tr(<><code>dot</code> แสดงเฉพาะจุดสีแดง ใช้เป็นเครื่องหมายว่ามีรายการใหม่</>, <><code>dot</code> shows only a red dot — for "new" markers.</>), code: dotCode, component: <Dot /> },
        { title: tr("สถานะ", "Status"), description: tr(<><code>status</code> แสดงจุดสีพร้อม <code>text</code> และสถานะ <code>processing</code> จะกะพริบ</>, <><code>status</code> renders a colored dot with an optional <code>text</code>; <code>processing</code> pulses.</>), code: statusCode, component: <Status /> },
        { title: tr("เปลี่ยนค่า", "Dynamic"), description: tr(<>ตัวเลขจะเลื่อนเมื่อค่าเปลี่ยน</>, <>The number scrolls when it changes.</>), code: changeCode, component: <Change /> },
        { title: tr("คลิกได้", "Clickable"), description: tr(<>ครอบ Badge ด้วยลิงก์เพื่อให้คลิกได้</>, <>Wrap the badge in a link.</>), code: linkCode, component: <Link /> },
        { title: tr("ขนาด", "Size"), description: tr(<><code>size="small"</code> ลดขนาด Badge ตัวเลข</>, <><code>size="small"</code> shrinks the count badge.</>), code: sizeCode, component: <Size /> },
        { title: tr("กำหนดสี", "Colorful"), description: tr(<>ใช้สี preset หรือสี CSS ที่กำหนดเองกับจุดสถานะได้</>, <>Preset colors and custom CSS colors for status dots.</>), code: colorfulCode, component: <Colorful /> },
        { title: tr("ริบบิ้น", "Ribbon"), description: tr(<><code>BadgeRibbon</code> แสดงริบบิ้นที่มุม และ <code>placement</code> กำหนดให้อยู่ด้าน start หรือ end</>, <><code>BadgeRibbon</code> renders a corner ribbon; <code>placement</code> puts it at start or end.</>), code: ribbonCode, component: <Ribbon />, full: true },
        { title: tr("เลื่อนตำแหน่ง", "Offset"), description: tr(<><code>offset</code> เลื่อน Badge ตามค่า <code>[x, y]</code> หน่วยพิกเซล</>, <><code>offset</code> shifts the badge by <code>[x, y]</code> pixels.</>), code: offsetCode, component: <Offset /> },
      ]}
      api={[
        {
          title: "Badge",
          rows: [
            { property: "color", description: "Preset or custom color of the badge / status dot", type: "PresetBadgeColor | string", default: "-" },
            { property: "count", description: "Number to show; hidden when 0 unless showZero", type: "ReactNode", default: "-" },
            { property: "classNames", description: "Extra classes for root / indicator", type: "{ root?, indicator? }", default: "-" },
            { property: "dot", description: "Show a red dot instead of a count", type: "boolean", default: "false" },
            { property: "offset", description: "Offset of the badge from the corner", type: "[number, number]", default: "-" },
            { property: "overflowCount", description: "Max count shown", type: "number", default: "99" },
            { property: "showZero", description: "Show badge when count is 0", type: "boolean", default: "false" },
            { property: "size", description: "Size of the count badge", type: "default | small", default: "default" },
            { property: "status", description: "Status dot", type: "success | processing | default | error | warning", default: "-" },
            { property: "styles", description: "Inline styles for root / indicator", type: "{ root?, indicator? }", default: "-" },
            { property: "text", description: "Text next to a status dot", type: "ReactNode", default: "-" },
            { property: "title", description: "Native title on hover", type: "string", default: "count" },
          ],
        },
        {
          title: "BadgeRibbon",
          rows: [
            { property: "color", description: "Preset or custom color", type: "PresetBadgeColor | string", default: "-" },
            { property: "placement", description: "Ribbon position", type: "start | end", default: "end" },
            { property: "text", description: "Ribbon content", type: "ReactNode", default: "-" },
          ],
        },
      ]}
      related={[{ title: "Tag", path: "/components/tag" }, { title: "Avatar", path: "/components/avatar" }]}
    />
  );
}
