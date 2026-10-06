import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import WithActions from "./demos/with-actions";
import withActionsCode from "./demos/with-actions.tsx?raw";
import CustomIcon from "./demos/custom-icon";
import customIconCode from "./demos/custom-icon.tsx?raw";
import CustomStyle from "./demos/custom-style";
import customStyleCode from "./demos/custom-style.tsx?raw";
import Placement from "./demos/placement";
import placementCode from "./demos/placement.tsx?raw";
import Duration from "./demos/duration";
import durationCode from "./demos/duration.tsx?raw";
import UpdateByKey from "./demos/update-by-key";
import updateByKeyCode from "./demos/update-by-key.tsx?raw";
import Stack from "./demos/stack";
import stackCode from "./demos/stack.tsx?raw";
import Progress from "./demos/progress";
import progressCode from "./demos/progress.tsx?raw";
import Hooks from "./demos/hooks";
import hooksCode from "./demos/hooks.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="notification"
      imports={["notification", "useNotification", "type NotificationConfig"]}
      whenToUse={tr(
        <>
          <p>ใช้ประกาศเรื่องที่ระบบทำเสร็จเอง หรือข้อความที่ยาวกว่าหนึ่งบรรทัดและอาจต้องมีปุ่มให้กด</p>
          <ul>
            <li>งานเบื้องหลังเสร็จ (อัปโหลด ประมวลผล ส่งออกไฟล์) หรือมีเหตุการณ์เข้ามาโดยผู้ใช้ไม่ได้กดอะไร</li>
            <li>ต้องการหัวข้อ + คำอธิบาย + ปุ่ม ในการ์ดเดียว ถ้าเป็นข้อความสั้นบรรทัดเดียวให้ใช้ <code>Message</code></li>
            <li>วางได้ 6 มุม ซ้อนเป็นกองเมื่อมีหลายใบ และแสดงแถบเวลาถอยหลังได้ด้วย <code>showProgress</code></li>
          </ul>
        </>,
        <>
          <p>Use it for things the system finished on its own, or for a notice that needs more than one line and maybe a button.</p>
          <ul>
            <li>Background work that completed (upload, export, batch job), or an event the user did not trigger.</li>
            <li>Title + description + actions in one card; for a one-line result use <code>Message</code> instead.</li>
            <li>Six placements, notices collapse into a pile when they add up, and <code>showProgress</code> draws the remaining time.</li>
          </ul>
        </>,
      )}
      demos={[
        {
          title: tr("การใช้งานพื้นฐาน", "Basic"),
          description: tr(
            <>เปิดการ์ดพร้อม <code>message</code> และ <code>description</code>; เมธอดตามประเภทจะใส่ไอคอนให้เอง</>,
            <>Open a card with <code>message</code> and <code>description</code>; the typed methods add the icon.</>,
          ),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("ปุ่มการกระทำ", "Actions"),
          description: tr(
            <><code>actions</code> (หรือ <code>btn</code> แบบเดิม) วางปุ่มไว้ท้ายการ์ด และปุ่มปิดจะไม่ไปกระตุ้น <code>onClick</code> ของการ์ดแล้ว</>,
            <><code>actions</code> (or the legacy <code>btn</code>) puts buttons at the end of the card; the close button no longer triggers the card's <code>onClick</code>.</>,
          ),
          code: withActionsCode,
          component: <WithActions />,
        },
        {
          title: tr("ไอคอนกำหนดเอง", "Custom Icon"),
          description: tr(<>ส่ง <code>icon</code> แทนไอคอนตามประเภท</>, <>Pass <code>icon</code> to replace the type icon.</>),
          code: customIconCode,
          component: <CustomIcon />,
        },
        {
          title: tr("สไตล์กำหนดเอง", "Custom Style"),
          description: tr(
            <><code>className</code> / <code>style</code> ปรับการ์ด และ <code>closeIcon={"{false}"}</code> ซ่อนปุ่มปิด</>,
            <><code>className</code> / <code>style</code> restyle the card, <code>closeIcon={"{false}"}</code> drops the close button.</>,
          ),
          code: customStyleCode,
          component: <CustomStyle />,
        },
        {
          title: tr("ตำแหน่ง", "Placement"),
          description: tr(
            <>หกตำแหน่ง: <code>topLeft</code>, <code>top</code>, <code>topRight</code>, <code>bottomLeft</code>, <code>bottom</code>, <code>bottomRight</code></>,
            <>Six placements: <code>topLeft</code>, <code>top</code>, <code>topRight</code>, <code>bottomLeft</code>, <code>bottom</code>, <code>bottomRight</code>.</>,
          ),
          code: placementCode,
          component: <Placement />,
        },
        {
          title: tr("ไม่ปิดอัตโนมัติ", "Duration 0"),
          description: tr(
            <><code>duration: 0</code> ให้การ์ดค้างจนกดปิด และ <code>destroy()</code> ก็เรียก <code>onClose</code> ให้เหมือนกัน</>,
            <><code>duration: 0</code> keeps the card until it is closed; <code>destroy()</code> still fires <code>onClose</code>.</>,
          ),
          code: durationCode,
          component: <Duration />,
        },
        {
          title: tr("อัปเดตด้วย key", "Update by key"),
          description: tr(
            <>เปิดซ้ำด้วย <code>key</code> เดิมเพื่อเขียนทับการ์ดเดิม ตัวจับเวลาเก่าถูกยกเลิกให้</>,
            <>Open again with the same <code>key</code> to rewrite the card; the previous timer is cleared.</>,
          ),
          code: updateByKeyCode,
          component: <UpdateByKey />,
        },
        {
          title: tr("ซ้อนเป็นกอง", "Stack"),
          description: tr(
            <>เกิน <code>threshold</code> เมื่อไหร่ การ์ดจะซ้อนกัน เอาเมาส์ไปวางเพื่อกางออก</>,
            <>Past <code>threshold</code> the cards collapse into a pile; hover to fan them out.</>,
          ),
          code: stackCode,
          component: <Stack />,
        },
        {
          title: tr("แถบเวลา", "Progress"),
          description: tr(
            <><code>showProgress</code> วาดเวลาที่เหลือ และ <code>pauseOnHover</code> หยุดนับเมื่อชี้เมาส์</>,
            <><code>showProgress</code> draws the time left and <code>pauseOnHover</code> freezes it under the pointer.</>,
          ),
          code: progressCode,
          component: <Progress />,
        },
        {
          title: tr("ฮุก useNotification", "useNotification hook"),
          description: tr(
            <><code>const [api, contextHolder] = notification.useNotification(config)</code> — ตั้งค่าเฉพาะอินสแตนซ์นี้ได้</>,
            <><code>const [api, contextHolder] = notification.useNotification(config)</code> — config applies to that instance only.</>,
          ),
          code: hooksCode,
          component: <Hooks />,
        },
      ]}
      api={[
        {
          title: "notification.method",
          description: tr("ทุกเมธอดคืนฟังก์ชันสำหรับปิดการ์ดนั้น", "Every method returns a closer for that card."),
          rows: [
            { property: "notification.open(config)", description: tr("เปิดการ์ดแบบไม่มีไอคอนประเภท", "Open a card without a type icon"), type: "(config: NotificationConfig) => () => void", default: "-" },
            { property: "notification.info / success / warning / error(config)", description: tr("เปิดการ์ดพร้อมไอคอนตามประเภท", "Open a card with the type icon"), type: "(config: NotificationConfig) => () => void", default: "-" },
            { property: "notification.destroy(key?)", description: tr("ปิดการ์ดตาม key (มองหาทุกตำแหน่ง) หรือปิดทั้งหมด และเรียก onClose ให้", "Close the card with that key wherever it sits, or all of them — onClose still fires"), type: "(key?: string | number) => void", default: "-" },
            { property: "notification.config(config)", description: tr("ตั้งค่าเริ่มต้นของ API แบบสถิต", "Set defaults for the static API"), type: "(config: NotificationGlobalConfig) => void", default: "-" },
            { property: "notification.useNotification(config?)", description: tr("ฮุกที่คืน [api, contextHolder]", "Hook returning [api, contextHolder]"), type: "(config?) => [NotificationInstance, ReactElement]", default: "-" },
          ],
        },
        {
          title: "NotificationConfig",
          rows: [
            { property: "message", description: tr("หัวข้อของการ์ด", "Title of the card"), type: "ReactNode", default: "-" },
            { property: "description", description: tr("เนื้อหา", "Body content"), type: "ReactNode", default: "-" },
            { property: "actions", description: tr("ปุ่มท้ายการ์ด", "Footer actions"), type: "ReactNode", default: "-" },
            { property: "btn", description: tr("ชื่อเดิมของ actions ใช้เมื่อไม่ได้ส่ง actions", "Legacy name for actions, used when actions is absent"), type: "ReactNode", default: "-" },
            { property: "duration", description: tr("วินาทีก่อนปิดอัตโนมัติ, 0 = ไม่ปิดเอง", "Seconds before auto close, 0 keeps it open"), type: "number", default: "4.5" },
            { property: "type", description: tr("ประเภทของการ์ด", "Card type"), type: "info | success | error | warning | open", default: "open" },
            { property: "icon", description: tr("ไอคอนกำหนดเอง", "Custom icon"), type: "ReactNode", default: "-" },
            { property: "key", description: tr("ตัวระบุ ใช้ซ้ำเพื่ออัปเดตในที่เดิม", "Identifier; reuse it to update in place"), type: "string | number", default: "-" },
            { property: "placement", description: tr("ตำแหน่งบนจอ", "Where the card appears"), type: "topLeft | top | topRight | bottomLeft | bottom | bottomRight", default: "topRight" },
            { property: "role", description: tr("บทบาท ARIA ของการ์ด", "ARIA live role of the card"), type: "alert | status", default: "alert" },
            { property: "closeIcon", description: tr("ไอคอนปิดกำหนดเอง, false = ไม่มีปุ่มปิด", "Custom close icon, false hides the button"), type: "ReactNode | boolean", default: "-" },
            { property: "showProgress", description: tr("แสดงแถบเวลาที่เหลือ", "Draw the remaining-time bar"), type: "boolean", default: "false" },
            { property: "pauseOnHover", description: tr("หยุดนับเวลาเมื่อชี้เมาส์", "Freeze the timer under the pointer"), type: "boolean", default: "true" },
            { property: "onClose", description: tr("เรียกหลังการ์ดปิดสนิท", "Fires after the card closed"), type: "() => void", default: "-" },
            { property: "onClick", description: tr("คลิกที่การ์ด (ปุ่มปิดไม่กระตุ้น)", "Click on the card (the close button does not trigger it)"), type: "(e: MouseEvent) => void", default: "-" },
            { property: "className", description: tr("คลาสเพิ่มเติมของการ์ด", "Extra class on the card"), type: "string", default: "-" },
            { property: "style", description: tr("สไตล์ของการ์ด", "Inline style on the card"), type: "CSSProperties", default: "-" },
          ],
        },
        {
          title: "NotificationGlobalConfig",
          rows: [
            { property: "placement", description: tr("ตำแหน่งเริ่มต้น", "Default placement"), type: "NotificationPlacement", default: "topRight" },
            { property: "top", description: tr("ระยะจากขอบบนสำหรับตำแหน่ง top*", "Offset from the top edge for top* placements"), type: "number", default: "24" },
            { property: "bottom", description: tr("ระยะจากขอบล่างสำหรับตำแหน่ง bottom*", "Offset from the bottom edge for bottom* placements"), type: "number", default: "24" },
            { property: "duration", description: tr("ระยะเวลาเริ่มต้น", "Default duration"), type: "number", default: "4.5" },
            { property: "maxCount", description: tr("จำนวนการ์ดสูงสุดต่อหนึ่งตำแหน่ง", "Maximum cards kept per placement"), type: "number", default: "-" },
            { property: "rtl", description: tr("จัดวางแบบขวาไปซ้าย", "Right-to-left layout"), type: "boolean", default: "false" },
            { property: "closeIcon", description: tr("ไอคอนปิดเริ่มต้น, false = ไม่มีปุ่มปิด", "Default close icon, false hides it"), type: "ReactNode | boolean", default: "-" },
            { property: "showProgress", description: tr("เปิดแถบเวลาให้ทุกการ์ด", "Turn the timer bar on for every card"), type: "boolean", default: "false" },
            { property: "pauseOnHover", description: tr("หยุดนับเวลาเมื่อชี้เมาส์", "Freeze timers under the pointer"), type: "boolean", default: "true" },
            { property: "stack", description: tr("ซ้อนการ์ดเมื่อเกิน threshold", "Collapse cards into a pile past threshold"), type: "boolean | { threshold?: number }", default: "{ threshold: 3 }" },
            { property: "getContainer", description: tr("เรนเดอร์ในอิลิเมนต์อื่น (ต้องมี position: relative)", "Render inside another element (needs position: relative)"), type: "() => HTMLElement", default: "document.body" },
          ],
        },
      ]}
      related={[
        { title: "Message", path: "/components/message" },
        { title: "Alert", path: "/components/alert" },
        { title: "App", path: "/components/app" },
      ]}
    />
  );
}
