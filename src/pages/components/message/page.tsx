import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Duration from "./demos/duration";
import durationCode from "./demos/duration.tsx?raw";
import LoadingUpdate from "./demos/loading-update";
import loadingUpdateCode from "./demos/loading-update.tsx?raw";
import UpdateContent from "./demos/update-content";
import updateContentCode from "./demos/update-content.tsx?raw";
import CustomIcon from "./demos/custom-icon";
import customIconCode from "./demos/custom-icon.tsx?raw";
import Persistent from "./demos/persistent";
import persistentCode from "./demos/persistent.tsx?raw";
import Config from "./demos/config";
import configCode from "./demos/config.tsx?raw";
import Hooks from "./demos/hooks";
import hooksCode from "./demos/hooks.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="message"
      imports={["message", "useMessage", "type MessageConfig"]}
      whenToUse={tr(
        <>
          <p>ใช้แจ้งผลลัพธ์สั้นๆ ของการกระทำ เช่น สำเร็จ ผิดพลาด หรือกำลังประมวลผล โดยไม่ขัดจังหวะผู้ใช้</p>
          <ul>
            <li>ลอยอยู่ด้านบนกึ่งกลางจอ ปิดตัวเองอัตโนมัติ และไม่บล็อกการทำงานของหน้า</li>
            <li>ถ้าต้องให้ผู้ใช้ตัดสินใจหรืออ่านรายละเอียดยาว ให้ใช้ <code>Modal</code> หรือ <code>Notification</code> แทน</li>
            <li>แนะนำให้ใช้ <code>message.useMessage()</code> แล้ววาง <code>contextHolder</code> ไว้ในทรี React เพื่อให้ธีมและ context ตรงกับแอป ส่วนการเรียกแบบสถิต (<code>message.success(...)</code>) เหมาะกับโค้ดนอกคอมโพเนนต์</li>
          </ul>
        </>,
        <>
          <p>Use it for short feedback about an action — success, failure, or work in progress — without interrupting the user.</p>
          <ul>
            <li>It floats at the top center, closes itself and never blocks the page.</li>
            <li>When the user has to decide something, or has to read more than a line, use <code>Modal</code> or <code>Notification</code> instead.</li>
            <li>Prefer <code>message.useMessage()</code> and render its <code>contextHolder</code> inside your tree so theme and context match the app; the static calls (<code>message.success(...)</code>) are for code outside components.</li>
          </ul>
        </>,
      )}
      demos={[
        {
          title: tr("ประเภทข้อความ", "Message Types"),
          description: tr(
            <>ห้าแบบ: <code>info</code>, <code>success</code>, <code>error</code>, <code>warning</code>, <code>loading</code></>,
            <>Five types: <code>info</code>, <code>success</code>, <code>error</code>, <code>warning</code>, <code>loading</code>.</>,
          ),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("ระยะเวลาแสดง", "Duration"),
          description: tr(
            <>กำหนดวินาทีเป็นอาร์กิวเมนต์ที่สอง หรือคีย์ <code>duration</code> และตัวจับเวลาจะหยุดเมื่อเอาเมาส์ไปวาง</>,
            <>Pass seconds as the second argument or as <code>duration</code>; the timer freezes while the pointer is over the toast.</>,
          ),
          code: durationCode,
          component: <Duration />,
        },
        {
          title: tr("โหลดแล้วอัปเดตด้วย key", "Loading then update by key"),
          description: tr(
            <>ใช้ <code>key</code> เดิมเพื่อแทนที่ toast เดิมในที่เดิม ตัวจับเวลาเก่าจะถูกยกเลิกให้ ไม่ค้างแบบเดิม</>,
            <>Reuse the same <code>key</code> to replace a toast in place — the old timer is cleared, so the update sticks.</>,
          ),
          code: loadingUpdateCode,
          component: <LoadingUpdate />,
        },
        {
          title: tr("อัปเดตเนื้อหา", "Update content"),
          description: tr(
            <>เรียก <code>message.open()</code> ซ้ำด้วย <code>key</code> เดิมเพื่อเปลี่ยนข้อความระหว่างที่ยังแสดงอยู่</>,
            <>Call <code>message.open()</code> again with the same <code>key</code> to rewrite a toast while it is on screen.</>,
          ),
          code: updateContentCode,
          component: <UpdateContent />,
        },
        {
          title: tr("ไอคอนกำหนดเอง", "Custom Icon"),
          description: tr(<>ส่ง <code>icon</code> เพื่อแทนไอคอนตามประเภท</>, <>Pass <code>icon</code> to replace the type icon.</>),
          code: customIconCode,
          component: <CustomIcon />,
        },
        {
          title: tr("ไม่ปิดอัตโนมัติ", "Persistent"),
          description: tr(
            <><code>duration: 0</code> ทำให้ toast อยู่จนกว่าจะปิดเอง จึงมีปุ่มปิดให้ และตัวปิดที่ฟังก์ชันคืนมาจะเรียก <code>onClose</code> ด้วย</>,
            <><code>duration: 0</code> keeps the toast until it is dismissed, so it gets a close button — and the returned closer fires <code>onClose</code>.</>,
          ),
          code: persistentCode,
          component: <Persistent />,
        },
        {
          title: tr("ตั้งค่าส่วนกลาง", "Global config"),
          description: tr(
            <><code>message.config()</code> ตั้ง <code>top</code>, <code>duration</code>, <code>maxCount</code>, <code>rtl</code>, <code>getContainer</code> ให้ API แบบสถิต</>,
            <><code>message.config()</code> sets <code>top</code>, <code>duration</code>, <code>maxCount</code>, <code>rtl</code> and <code>getContainer</code> for the static API.</>,
          ),
          code: configCode,
          component: <Config />,
        },
        {
          title: tr("ฮุก useMessage", "useMessage hook"),
          description: tr(
            <><code>const [api, contextHolder] = message.useMessage()</code> — เรนเดอร์ในทรี React ได้ context ครบ</>,
            <><code>const [api, contextHolder] = message.useMessage()</code> — renders in the React tree, so it keeps your context.</>,
          ),
          code: hooksCode,
          component: <Hooks />,
        },
      ]}
      api={[
        {
          title: "message.method",
          description: tr(
            "ทุกเมธอดคืนฟังก์ชันสำหรับปิด toast นั้น และรับได้ทั้งแบบ (content, duration, onClose) หรือส่งอ็อบเจ็กต์ MessageConfig",
            "Every method returns a closer for that toast and accepts either (content, duration, onClose) or a MessageConfig object.",
          ),
          rows: [
            { property: "message.open(config)", description: tr("เปิด toast จากคอนฟิกเต็ม", "Open a toast from a full config"), type: "(config: MessageConfig) => () => void", default: "-" },
            { property: "message.info(content, [duration], [onClose])", description: tr("toast ข้อมูล", "Info toast"), type: "(content: ReactNode | MessageConfig, duration?, onClose?) => () => void", default: "-" },
            { property: "message.success(...)", description: tr("toast สำเร็จ", "Success toast"), type: "same as info", default: "-" },
            { property: "message.error(...)", description: tr("toast ผิดพลาด", "Error toast"), type: "same as info", default: "-" },
            { property: "message.warning(...)", description: tr("toast เตือน", "Warning toast"), type: "same as info", default: "-" },
            { property: "message.loading(...)", description: tr("toast กำลังโหลด ค่าเริ่มต้นไม่ปิดเอง", "Loading toast, never closes by itself by default"), type: "same as info", default: "duration 0" },
            { property: "message.destroy(key?)", description: tr("ปิดตาม key หรือปิดทั้งหมด", "Close one key, or all toasts"), type: "(key?: string | number) => void", default: "-" },
            { property: "message.config(config)", description: tr("ตั้งค่าเริ่มต้นของ API แบบสถิต", "Set defaults for the static API"), type: "(config: MessageGlobalConfig) => void", default: "-" },
            { property: "message.useMessage(config?)", description: tr("ฮุกที่คืน [api, contextHolder]", "Hook returning [api, contextHolder]"), type: "(config?: MessageGlobalConfig) => [MessageInstance, ReactElement]", default: "-" },
          ],
        },
        {
          title: "MessageConfig",
          rows: [
            { property: "content", description: tr("เนื้อหาที่แสดง", "Content of the toast"), type: "ReactNode", default: "-" },
            { property: "duration", description: tr("วินาทีก่อนปิดอัตโนมัติ, 0 = ไม่ปิดเอง", "Seconds before auto close, 0 keeps it open"), type: "number", default: "3 (loading: 0)" },
            { property: "type", description: tr("ประเภทของ toast", "Toast type"), type: "info | success | error | warning | loading", default: "info" },
            { property: "icon", description: tr("ไอคอนกำหนดเอง", "Custom icon"), type: "ReactNode", default: "-" },
            { property: "key", description: tr("ตัวระบุ toast ใช้ซ้ำเพื่ออัปเดตในที่เดิม", "Identifier; reuse it to update in place"), type: "string | number", default: "-" },
            { property: "onClose", description: tr("เรียกหลังปิดสนิท ทั้งจากหมดเวลา ปุ่มปิด และตัวปิดที่คืนมา", "Fires after it closed — by timeout, close button or the returned closer"), type: "() => void", default: "-" },
            { property: "onClick", description: tr("คลิกที่ toast", "Click handler on the toast"), type: "(e: MouseEvent) => void", default: "-" },
            { property: "className", description: tr("คลาสเพิ่มเติมของการ์ด", "Extra class on the card"), type: "string", default: "-" },
            { property: "style", description: tr("สไตล์ของการ์ด", "Inline style on the card"), type: "CSSProperties", default: "-" },
          ],
        },
        {
          title: "MessageGlobalConfig",
          rows: [
            { property: "top", description: tr("ระยะห่างจากขอบบน (px)", "Distance from the top edge, px"), type: "number", default: "16" },
            { property: "duration", description: tr("ระยะเวลาเริ่มต้นของทุก toast", "Default duration for every toast"), type: "number", default: "3" },
            { property: "maxCount", description: tr("จำนวน toast สูงสุดบนจอ อันเก่าสุดจะถูกปิดก่อน", "Maximum toasts on screen; the oldest closes first"), type: "number", default: "-" },
            { property: "rtl", description: tr("จัดวางแบบขวาไปซ้าย", "Right-to-left layout"), type: "boolean", default: "false" },
            { property: "getContainer", description: tr("เรนเดอร์ในอิลิเมนต์อื่น (ต้องมี position: relative)", "Render inside another element (needs position: relative)"), type: "() => HTMLElement", default: "document.body" },
          ],
        },
      ]}
      related={[
        { title: "Notification", path: "/components/notification" },
        { title: "Modal", path: "/components/modal" },
        { title: "App", path: "/components/app" },
      ]}
    />
  );
}
