import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Colorful from "./demos/colorful";
import colorfulCode from "./demos/colorful.tsx?raw";
import Control from "./demos/control";
import controlCode from "./demos/control.tsx?raw";
import Checkable from "./demos/checkable";
import checkableCode from "./demos/checkable.tsx?raw";
import Status from "./demos/status";
import statusCode from "./demos/status.tsx?raw";
import Icon from "./demos/icon";
import iconCode from "./demos/icon.tsx?raw";
import Borderless from "./demos/borderless";
import borderlessCode from "./demos/borderless.tsx?raw";
import Animation from "./demos/animation";
import animationCode from "./demos/animation.tsx?raw";
import CustomClose from "./demos/custom-close";
import customCloseCode from "./demos/custom-close.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="tag"
      imports={["Tag", "CheckableTag", "TagStatusIcon"]}
      whenToUse={tr(
        <>
          <ul>
            <li>ใช้ติดป้ายบอกคุณสมบัติ มิติ หรือหมวดหมู่ของรายการ</li>
            <li>ใช้กรองหรือเลือกจากตัวเลือกจำนวนน้อย — กรณีนี้ให้ใช้ <code>CheckableTag</code></li>
            <li>ใช้แสดงสถานะ (success / processing / error / warning) แทรกข้างข้อความ</li>
          </ul>
        </>,
        <>
          <ul>
            <li>To mark an item with a property, dimension or category.</li>
            <li>To filter or select from a small set of options — use <code>CheckableTag</code> for that.</li>
            <li>To surface a status (success / processing / error / warning) inline next to text.</li>
          </ul>
        </>,
      )}
      demos={[
        { title: tr("พื้นฐาน", "Basic"), description: tr(<>tag พื้นฐาน tag แบบลิงก์ และ tag ที่ปิดได้ <code>onClose</code> จะได้รับ click event เรียก <code>preventDefault()</code> เพื่อไม่ให้ tag หายไป</>, <>Usage of a basic tag, a link tag and a closable tag. <code>onClose</code> receives the click event; call <code>preventDefault()</code> to keep the tag.</>), code: basicCode, component: <Basic /> },
        { title: tr("แท็กหลากสี", "Colorful Tag"), description: tr(<>มีสีสำเร็จรูป 11 สีผ่าน <code>color</code> หรือใส่ CSS color ใดก็ได้เพื่อให้เป็น tag สีทึบ</>, <>Eleven preset colors via <code>color</code>, or any CSS color for a solid tag.</>), code: colorfulCode, component: <Colorful /> },
        { title: tr("เพิ่ม/ลบแบบไดนามิก", "Add & Remove Dynamically"), description: tr(<>สร้าง tag ทั้งชุดจาก array และเพิ่มตัวใหม่ด้วย input ที่แทรกอยู่ในแถวเดียวกัน</>, <>Generating a set of tags by an array, adding a new one with an inline input.</>), code: controlCode, component: <Control /> },
        { title: tr("เลือกได้", "Checkable"), description: tr(<><code>CheckableTag</code> ทำงานเหมือน checkbox และคุมเป็น controlled ได้ด้วย <code>checked</code> / <code>onChange</code></>, <><code>CheckableTag</code> works like a checkbox and can be controlled with <code>checked</code> / <code>onChange</code>.</>), code: checkableCode, component: <Checkable /> },
        { title: tr("แท็กสถานะ", "Status Tag"), description: tr(<>สีสถานะ <code>success</code>, <code>processing</code>, <code>error</code>, <code>warning</code>, <code>default</code> พร้อมไอคอนที่เข้าคู่กันถ้าต้องการ</>, <>Status colors <code>success</code>, <code>processing</code>, <code>error</code>, <code>warning</code>, <code>default</code>, optionally with a matching icon.</>), code: statusCode, component: <Status /> },
        { title: tr("ไอคอน", "Icon"), description: tr(<>ส่ง <code>icon</code> เพื่อแสดงไอคอนไว้หน้าเนื้อหา</>, <>Pass an <code>icon</code> to render it before the content.</>), code: iconCode, component: <Icon /> },
        { title: tr("ไม่มีเส้นขอบ", "Borderless"), description: tr(<><code>bordered={"{false}"}</code> เอาเส้นขอบออก เหมาะกับการวางบนพื้นหลังสี</>, <><code>bordered={"{false}"}</code> removes the border; useful on colored backgrounds.</>), code: borderlessCode, component: <Borderless /> },
        { title: tr("เพิ่ม/ลบพร้อมแอนิเมชัน", "Add & Remove with Animation"), description: tr(<>ผสมคลาสของ tw-animate-css เพื่อให้ tag ค่อยๆ ปรากฏ</>, <>Combine tw-animate-css classes for a subtle appear animation.</>), code: animationCode, component: <Animation /> },
        { title: tr("ไอคอนปิดแบบกำหนดเอง", "Custom Close Icon"), description: tr(<><code>closable={"{{ closeIcon }}"}</code> ใช้แทนไอคอน X เริ่มต้น</>, <><code>closable={"{{ closeIcon }}"}</code> replaces the default X.</>), code: customCloseCode, component: <CustomClose /> },
      ]}
      api={[
        {
          title: "Tag",
          rows: [
            { property: "closable", description: "Whether the tag can be closed; object form allows a custom close icon", type: "boolean | { closeIcon?: ReactNode }", default: "false" },
            { property: "closeIcon", description: "Custom close icon", type: "ReactNode", default: "-" },
            { property: "color", description: "Preset / status / custom color", type: "PresetTagColor | StatusTagColor | string", default: "-" },
            { property: "icon", description: "Icon rendered before content", type: "ReactNode", default: "-" },
            { property: "bordered", description: "Whether the tag has a border", type: "boolean", default: "true" },
            { property: "href", description: "Render as anchor", type: "string", default: "-" },
            { property: "onClose", description: "Callback on close click; preventDefault keeps the tag", type: "(e: MouseEvent) => void", default: "-" },
            { property: "onClick", description: "Click handler", type: "MouseEventHandler", default: "-" },
          ],
        },
        {
          title: "CheckableTag",
          rows: [
            { property: "checked", description: "Controlled checked state", type: "boolean", default: "-" },
            { property: "defaultChecked", description: "Initial state for uncontrolled usage", type: "boolean", default: "false" },
            { property: "onChange", description: "Called when the state changes", type: "(checked: boolean) => void", default: "-" },
          ],
        },
        {
          title: "TagStatusIcon",
          rows: [{ property: "status", description: "KKUI status icon (check / spinner / x / alert / clock)", type: "success | processing | error | warning | default", default: "-" }],
        },
      ]}
      related={[{ title: "Badge", path: "/components/badge" }]}
    />
  );
}
