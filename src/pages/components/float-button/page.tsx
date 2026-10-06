import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Type from "./demos/type";
import typeCode from "./demos/type.tsx?raw";
import Shape from "./demos/shape";
import shapeCode from "./demos/shape.tsx?raw";
import Description from "./demos/description";
import descriptionCode from "./demos/description.tsx?raw";
import TooltipDemo from "./demos/tooltip";
import tooltipCode from "./demos/tooltip.tsx?raw";
import BadgeDemo from "./demos/badge";
import badgeCode from "./demos/badge.tsx?raw";
import Group from "./demos/group";
import groupCode from "./demos/group.tsx?raw";
import GroupMenu from "./demos/group-menu";
import groupMenuCode from "./demos/group-menu.tsx?raw";
import Placement from "./demos/placement";
import placementCode from "./demos/placement.tsx?raw";
import BackTop from "./demos/back-top";
import backTopCode from "./demos/back-top.tsx?raw";
import Controlled from "./demos/controlled";
import controlledCode from "./demos/controlled.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="float-button"
      imports={["FloatButton", "type FloatButtonProps"]}
      whenToUse={tr(
        <>
          <p>ปุ่มลอยสำหรับคำสั่งที่ต้องเข้าถึงได้ตลอดเวลา ไม่ว่าผู้ใช้จะเลื่อนหน้าไปถึงไหน เช่น แชท ช่วยเหลือ หรือกลับขึ้นด้านบน</p>
          <ul>
            <li>ใช้เมื่อคำสั่งนั้นใช้ได้กับทั้งหน้า ไม่ผูกกับส่วนใดส่วนหนึ่ง</li>
            <li>หนึ่งหน้าจอไม่ควรมีเกินหนึ่งกลุ่ม เพื่อไม่ให้บังเนื้อหา</li>
          </ul>
          <p className="mt-2">
            ตัว <code>FloatButton</code> เป็น <code>position: fixed</code> อยู่แล้ว (ห่างขวา 24px ล่าง 48px) ส่ง{" "}
            <code>className</code> หรือ <code>style</code> เพื่อย้ายตำแหน่งได้ — ตัวอย่างในหน้านี้ใช้ <code>absolute</code>{" "}
            เพื่อขังปุ่มไว้ในกล่องเดโม
          </p>
        </>,
        <>
          <p>A button that stays reachable while the page scrolls — chat, help, or back to top.</p>
          <ul>
            <li>Use it for an action that belongs to the whole page, not to one section.</li>
            <li>Keep at most one group per screen so content stays readable.</li>
          </ul>
          <p className="mt-2">
            <code>FloatButton</code> is <code>position: fixed</code> (24px from the right, 48px from the bottom). Pass{" "}
            <code>className</code> or <code>style</code> to move it — the demos below override it with <code>absolute</code>{" "}
            to keep the buttons inside their preview box.
          </p>
        </>,
      )}
      demos={[
        {
          title: tr("พื้นฐาน", "Basic"),
          description: tr(
            <>ปุ่มลอยเดี่ยว ใส่ <code>href</code> เพื่อให้เรนเดอร์เป็นลิงก์</>,
            <>A stand-alone floating button; add <code>href</code> to render an anchor.</>,
          ),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("ประเภท", "Type"),
          description: tr(<><code>default</code> และ <code>primary</code></>, <><code>default</code> and <code>primary</code>.</>),
          code: typeCode,
          component: <Type />,
        },
        {
          title: tr("รูปทรง", "Shape"),
          description: tr(<>เลือก <code>circle</code> หรือ <code>square</code></>, <>Choose <code>circle</code> or <code>square</code>.</>),
          code: shapeCode,
          component: <Shape />,
        },
        {
          title: tr("คำอธิบาย", "Description"),
          description: tr(
            <><code>description</code> ใช้ได้เฉพาะทรง <code>square</code> เท่านั้น ทรงกลมจะถูกละไว้</>,
            <><code>description</code> only fits the <code>square</code> shape; it is ignored for circles.</>,
          ),
          code: descriptionCode,
          component: <Description />,
        },
        {
          title: tr("ทูลทิป", "Tooltip"),
          description: tr(<>ใส่ <code>tooltip</code> เพื่อบอกว่าปุ่มทำอะไร</>, <>Add a <code>tooltip</code> to explain the button.</>),
          code: tooltipCode,
          component: <TooltipDemo />,
        },
        {
          title: tr("แบดจ์", "Badge"),
          description: tr(
            <><code>badge</code> รับ <code>count</code>, <code>dot</code>, <code>color</code>, <code>offset</code>, <code>overflowCount</code></>,
            <><code>badge</code> takes <code>count</code>, <code>dot</code>, <code>color</code>, <code>offset</code> and <code>overflowCount</code>.</>,
          ),
          code: badgeCode,
          component: <BadgeDemo />,
        },
        {
          title: tr("กลุ่ม", "Group"),
          description: tr(
            <>ไม่ใส่ <code>trigger</code> ปุ่มลูกจะเชื่อมกันเป็นก้อนเดียว</>,
            <>Without <code>trigger</code> the children are joined into a single block.</>,
          ),
          code: groupCode,
          component: <Group />,
        },
        {
          title: tr("เมนูของกลุ่ม", "Group Menu"),
          description: tr(
            <>ใส่ <code>trigger="hover"</code> หรือ <code>"click"</code> เพื่อให้กลุ่มกางเป็นเมนู</>,
            <>Set <code>trigger="hover"</code> or <code>"click"</code> to expand the group as a menu.</>,
          ),
          code: groupMenuCode,
          component: <GroupMenu />,
        },
        {
          title: tr("ทิศทางการกาง", "Placement"),
          description: tr(
            <><code>placement</code> กำหนดทิศที่เมนูกางออก: <code>top</code>, <code>right</code>, <code>bottom</code>, <code>left</code></>,
            <><code>placement</code> sets the direction the menu expands to: <code>top</code>, <code>right</code>, <code>bottom</code>, <code>left</code>.</>,
          ),
          code: placementCode,
          component: <Placement />,
          full: true,
        },
        {
          title: tr("กลับขึ้นด้านบน", "Back Top"),
          description: tr(
            <><code>FloatButton.BackTop</code> เลื่อนกลับขึ้นบนแบบมีแอนิเมชัน ระบุคอนเทนเนอร์ด้วย <code>target</code> และความเร็วด้วย <code>duration</code></>,
            <><code>FloatButton.BackTop</code> animates the scroll back to the top; pick the container with <code>target</code> and the speed with <code>duration</code>.</>,
          ),
          code: backTopCode,
          component: <BackTop />,
        },
        {
          title: tr("ควบคุมจากภายนอก", "Controlled"),
          description: tr(
            <>คุมการกางของกลุ่มด้วย <code>open</code> / <code>onOpenChange</code></>,
            <>Control the expanded state of a group with <code>open</code> / <code>onOpenChange</code>.</>,
          ),
          code: controlledCode,
          component: <Controlled />,
        },
      ]}
      api={[
        {
          title: "FloatButton",
          description: tr(
            "ขยายจาก React.ButtonHTMLAttributes (ยกเว้น `type` ดั้งเดิม ให้ใช้ `htmlType`) — ค่าเริ่มต้นเป็น position: fixed",
            "Extends React.ButtonHTMLAttributes (except native `type`, use `htmlType`) — fixed-positioned by default.",
          ),
          rows: [
            { property: "icon", description: tr("ไอคอนกลางปุ่ม", "Icon inside the button"), type: "ReactNode", default: "-" },
            { property: "description", description: tr("ข้อความใต้ไอคอน ใช้ได้เฉพาะทรง square", "Text under the icon; square shape only"), type: "ReactNode", default: "-" },
            { property: "tooltip", description: tr("ทูลทิปตอน hover (แสดงด้านซ้าย)", "Tooltip on hover (shown on the left)"), type: "ReactNode", default: "-" },
            { property: "type", description: tr("ชนิดของปุ่ม", "Button type"), type: "default | primary", default: "default" },
            { property: "shape", description: tr("รูปทรง ถ้าไม่ระบุจะใช้ของกลุ่ม", "Shape; falls back to the group's shape"), type: "circle | square", default: "circle" },
            { property: "badge", description: tr("แบดจ์มุมขวาบน", "Badge at the top-right corner"), type: "FloatButtonBadgeProps", default: "-" },
            { property: "href", description: tr("ถ้าใส่จะเรนเดอร์เป็น <a>", "Render an anchor instead of a button"), type: "string", default: "-" },
            { property: "target", description: tr("target ของลิงก์ (ใช้กับ href)", "Anchor target (with href)"), type: "string", default: "-" },
            { property: "htmlType", description: tr("type ของ button จริง", "Native button type"), type: "button | submit | reset", default: "button" },
            { property: "onClick", description: tr("ตัวจัดการคลิก", "Click handler"), type: "MouseEventHandler", default: "-" },
            { property: "className", description: tr("คลาสบน element ราก ใช้ทับตำแหน่ง fixed ได้", "Classes on the root element; overrides the fixed position"), type: "string", default: "-" },
            { property: "style", description: tr("สไตล์บน element ราก", "Style of the root element"), type: "CSSProperties", default: "-" },
          ],
        },
        {
          title: "FloatButtonBadgeProps",
          description: tr("ส่วนย่อยของ BadgeProps ที่ FloatButton รองรับ", "The subset of BadgeProps supported by FloatButton."),
          rows: [
            { property: "count", description: tr("ตัวเลขหรือโหนดที่แสดงในแบดจ์", "Number or node shown in the badge"), type: "ReactNode", default: "-" },
            { property: "dot", description: tr("แสดงเป็นจุดแทนตัวเลข", "Show a dot instead of a count"), type: "boolean", default: "false" },
            { property: "color", description: tr("สีของแบดจ์ (พรีเซ็ตหรือค่าสี CSS)", "Badge color (preset name or CSS color)"), type: "string", default: "-" },
            { property: "offset", description: tr("เลื่อนแบดจ์ [x, y]", "Offset of the badge [x, y]"), type: "[number, number]", default: "-" },
            { property: "overflowCount", description: tr("ค่ามากสุดก่อนแสดงเป็น n+", "Max count before it renders as n+"), type: "number", default: "99" },
          ],
        },
        {
          title: "FloatButton.Group",
          rows: [
            { property: "shape", description: tr("รูปทรงของกลุ่มและปุ่มลูกที่ไม่ได้ระบุเอง", "Shape of the group and of children without their own"), type: "circle | square", default: "circle" },
            { property: "type", description: tr("ชนิดของปุ่มทริกเกอร์", "Type of the menu trigger"), type: "default | primary", default: "primary" },
            { property: "trigger", description: tr("ถ้าใส่ กลุ่มจะกลายเป็นเมนูที่กางได้ ถ้าไม่ใส่ปุ่มลูกจะเชื่อมกันเป็นก้อน", "Turns the group into an expandable menu; omit it to join the children into one block"), type: "click | hover", default: "-" },
            { property: "placement", description: tr("ทิศที่เมนูกางออก", "Direction the menu expands to"), type: "top | right | bottom | left", default: "top", version: "5.21" },
            { property: "icon", description: tr("ไอคอนของปุ่มทริกเกอร์", "Icon of the trigger"), type: "ReactNode", default: "<Plus />" },
            { property: "closeIcon", description: tr("ไอคอนของปุ่มทริกเกอร์ตอนเมนูเปิด", "Icon of the trigger while the menu is open"), type: "ReactNode", default: "<X />" },
            { property: "description", description: tr("คำอธิบายบนปุ่มทริกเกอร์ (ทรง square)", "Description on the trigger (square shape)"), type: "ReactNode", default: "-" },
            { property: "tooltip", description: tr("ทูลทิปของปุ่มทริกเกอร์", "Tooltip of the trigger"), type: "ReactNode", default: "-" },
            { property: "open", description: tr("สถานะกาง (controlled)", "Expanded state (controlled)"), type: "boolean", default: "-" },
            { property: "onOpenChange", description: tr("เรียกเมื่อสถานะกางเปลี่ยน", "Called when the expanded state changes"), type: "(open: boolean) => void", default: "-" },
            { property: "children", description: tr("ปุ่มลูก โดยปกติคือ FloatButton", "Child buttons, normally FloatButton"), type: "ReactNode", default: "-" },
            { property: "className", description: tr("คลาสบนกล่องกลุ่ม ใช้ทับตำแหน่ง fixed ได้", "Classes on the group box; overrides the fixed position"), type: "string", default: "-" },
            { property: "style", description: tr("สไตล์ของกล่องกลุ่ม", "Style of the group box"), type: "CSSProperties", default: "-" },
          ],
        },
        {
          title: "FloatButton.BackTop",
          description: tr("รับพร็อพทั้งหมดของ FloatButton (ยกเว้น target) เพิ่มอีกสามตัว", "Takes every FloatButton prop (except target) plus three of its own."),
          rows: [
            { property: "visibilityHeight", description: tr("เลื่อนเกินกี่พิกเซลจึงแสดงปุ่ม", "Scroll distance (px) before the button appears"), type: "number", default: "400" },
            { property: "duration", description: tr("ระยะเวลาของแอนิเมชันเลื่อน (มิลลิวินาที)", "Duration of the scroll animation (ms)"), type: "number", default: "450" },
            { property: "target", description: tr("คอนเทนเนอร์ที่เลื่อน ถ้าไม่ระบุใช้ window", "Scroll container; defaults to the window"), type: "() => HTMLElement | Window | Document", default: "() => window" },
            { property: "icon", description: tr("ไอคอนของปุ่ม", "Icon of the button"), type: "ReactNode", default: "<ArrowUp />" },
            { property: "tooltip", description: tr("ทูลทิปของปุ่ม", "Tooltip of the button"), type: "ReactNode", default: "\"Back to Top\"" },
            { property: "onClick", description: tr("เรียกหลังเริ่มเลื่อน", "Called after the scroll starts"), type: "MouseEventHandler", default: "-" },
          ],
        },
      ]}
      related={[
        { title: "Button", path: "/components/button" },
        { title: "Badge", path: "/components/badge" },
        { title: "Affix", path: "/components/affix" },
      ]}
    />
  );
}
