import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import NoTitle from "./demos/no-title";
import noTitleCode from "./demos/no-title.tsx?raw";
import Trigger from "./demos/trigger";
import triggerCode from "./demos/trigger.tsx?raw";
import Placement from "./demos/placement";
import placementCode from "./demos/placement.tsx?raw";
import Arrow from "./demos/arrow";
import arrowCode from "./demos/arrow.tsx?raw";
import Control from "./demos/control";
import controlCode from "./demos/control.tsx?raw";
import HoverWithClick from "./demos/hover-with-click";
import hoverWithClickCode from "./demos/hover-with-click.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="popover"
      imports={["Popover"]}
      whenToUse={tr(
        <>
          <p>การ์ด popup ขนาดเล็กสำหรับแสดงข้อมูลหรือการทำงานเพิ่มเติม</p>
          <p className="mt-2">Popover ต่างจาก Tooltip ตรงที่นอกจากข้อมูลแล้ว ภายในการ์ดยังใส่ element ที่กดได้ เช่น ลิงก์และปุ่ม</p>
        </>,
        <>
          <p>A simple popup menu to provide extra information or operations.</p>
          <p className="mt-2">Comparing with Tooltip, besides information Popover card can also provide action elements like links and buttons.</p>
        </>,
      )}
      demos={[
        { title: tr("การใช้งานพื้นฐาน", "Basic"), description: tr("ตัวอย่างพื้นฐานที่สุด ขนาดของการ์ดลอยขึ้นอยู่กับเนื้อหาข้างใน", "The most basic example. The size of the floating layer depends on the contents region."), code: basicCode, component: <Basic /> },
        { title: tr("ไม่มีหัวเรื่อง / เนื้อหาอิสระ", "Without title / rich content"), description: tr(<>ไม่ส่ง <code>title</code> เพื่อแสดงการ์ดธรรมดาได้ ส่วน <code>content</code> รับ node อะไรก็ได้ รวมถึงปุ่ม</>, <>Omit <code>title</code> for a plain card; <code>content</code> accepts any node including buttons.</>), code: noTitleCode, component: <NoTitle /> },
        { title: tr("สามวิธีในการเปิด", "Three ways to trigger"), description: tr("เปิดได้ด้วยการคลิก, focus หรือ hover", "Mouse to click, focus and move in."), code: triggerCode, component: <Trigger /> },
        { title: tr("ตำแหน่ง", "Placement"), description: tr(<>มี <code>placement</code> ให้เลือก 12 แบบ</>, <>There are 12 <code>placement</code> options available.</>), code: placementCode, component: <Placement /> },
        { title: tr("ลูกศร", "Arrow"), description: tr(<>ปรับลูกศรผ่าน <code>arrow</code>: ซ่อน หรือให้ชี้ตรงกลาง trigger</>, <>Change the arrow with <code>arrow</code>: hidden, or pointing at the trigger center.</>), code: arrowCode, component: <Arrow /> },
        { title: tr("ควบคุมการปิด", "Controlling the close of the dialog"), description: tr(<>ใช้ <code>open</code> คู่กับ <code>onOpenChange</code> ควบคุมการแสดงผล เช่น สั่งปิดจากปุ่มภายในการ์ด</>, <>Use <code>open</code> and <code>onOpenChange</code> to control the visibility, e.g. close it from a button inside.</>), code: controlCode, component: <Control /> },
        { title: tr("ใช้ hover คู่กับ click", "Hover with click popover"), description: tr("วางสอง popover บน trigger เดียว: hover เปิดอันหนึ่ง ส่วน click เปิดอีกอันและซ่อนการ์ดจาก hover", "Two popovers on one trigger: hover shows one, click shows the other and suppresses the hover card."), code: hoverWithClickCode, component: <HoverWithClick /> },
      ]}
      api={[
        {
          title: "Popover",
          rows: [
            { property: "title", description: "Title of the card", type: "ReactNode", default: "-" },
            { property: "content", description: "Content of the card", type: "ReactNode", default: "-" },
            { property: "placement", description: "Position of the card relative to the target", type: "top | left | right | bottom | topLeft | topRight | bottomLeft | bottomRight | leftTop | leftBottom | rightTop | rightBottom", default: "top" },
            { property: "trigger", description: "Event(s) that show the card", type: "hover | focus | click | contextMenu | Array<...>", default: "hover" },
            { property: "arrow", description: "Show the arrow, and whether it points at the trigger center", type: "boolean | { pointAtCenter: boolean }", default: "true" },
            { property: "open", description: "Controlled visibility", type: "boolean", default: "-" },
            { property: "defaultOpen", description: "Initial visibility", type: "boolean", default: "false" },
            { property: "onOpenChange", description: "Called when visibility changes (hover, click, focus, Escape, outside click)", type: "(open: boolean) => void", default: "-" },
            { property: "mouseEnterDelay", description: "Delay in seconds before showing (hover)", type: "number", default: "0.1" },
            { property: "mouseLeaveDelay", description: "Delay in seconds before hiding (hover)", type: "number", default: "0.1" },
            { property: "autoAdjustOverflow", description: "Flip / shift when the card would overflow the viewport", type: "boolean", default: "true" },
            { property: "destroyOnHidden", description: "Unmount the card when hidden", type: "boolean", default: "true" },
            { property: "overlayClassName", description: "Class of the card", type: "string", default: "-" },
            { property: "overlayStyle", description: "Style of the card", type: "CSSProperties", default: "-" },
            { property: "overlayInnerStyle", description: "Style of the inner wrapper", type: "CSSProperties", default: "-" },
            { property: "zIndex", description: "z-index of the card", type: "number", default: "50" },
            { property: "children", description: "The trigger; a non-element child is wrapped in a span", type: "ReactNode", default: "-" },
          ],
        },
      ]}
      extra={tr(
        <>
          <h2>ข้อควรรู้</h2>
          <p>child ของ <code>Popover</code> ต้องรับ <code>onMouseEnter</code>, <code>onMouseLeave</code>, <code>onFocus</code>, <code>onClick</code> และ ref ได้ ถ้าเป็น component ที่เขียนเอง ต้องส่ง prop เหล่านี้ต่อไปยัง DOM element</p>
        </>,
        <>
          <h2>Note</h2>
          <p>Ensure the child of <code>Popover</code> accepts <code>onMouseEnter</code>, <code>onMouseLeave</code>, <code>onFocus</code>, <code>onClick</code> and a ref. Custom components must forward these props to a DOM element.</p>
        </>,
      )}
      related={[{ title: "Tooltip", path: "/components/tooltip" }, { title: "Popconfirm", path: "/components/popconfirm" }]}
    />
  );
}
