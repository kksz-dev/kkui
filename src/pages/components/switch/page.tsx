import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Disabled from "./demos/disabled";
import disabledCode from "./demos/disabled.tsx?raw";
import Text from "./demos/text";
import textCode from "./demos/text.tsx?raw";
import Size from "./demos/size";
import sizeCode from "./demos/size.tsx?raw";
import Loading from "./demos/loading";
import loadingCode from "./demos/loading.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="switch"
      imports={["Switch"]}
      whenToUse={tr(
        <ul>
          <li>ใช้เมื่อต้องสลับระหว่างสองสถานะ หรือสถานะเปิด-ปิด</li>
          <li>ต่างจาก <code>Checkbox</code> ตรงที่ <code>Switch</code> เปลี่ยนสถานะทันทีที่คลิก ส่วน <code>Checkbox</code> มักใช้ติ๊กตัวเลือกในฟอร์มที่ค่อย submit ทีหลัง</li>
        </ul>,
        <ul>
          <li>If you need to represent the switching between two states or on-off state.</li>
          <li>The difference between <code>Switch</code> and <code>Checkbox</code> is that <code>Switch</code> immediately triggers the state change on click, whereas <code>Checkbox</code> is generally used to mark an option in a form that submits later.</li>
        </ul>,
      )}
      demos={[
        { title: tr("พื้นฐาน", "Basic"), description: tr("การใช้งานพื้นฐานที่สุด", "The most basic usage."), code: basicCode, component: <Basic /> },
        { title: tr("ปิดใช้งาน", "Disabled"), description: tr(<>สถานะปิดใช้งานของ <code>Switch</code></>, <>Disabled state of <code>Switch</code>.</>), code: disabledCode, component: <Disabled /> },
        { title: tr("ข้อความและไอคอน", "Text & Icon"), description: tr(<>ใส่เนื้อหาในสวิตช์ด้วย <code>checkedChildren</code> และ <code>unCheckedChildren</code></>, <>With <code>checkedChildren</code> and <code>unCheckedChildren</code>.</>), code: textCode, component: <Text /> },
        { title: tr("สองขนาด", "Two sizes"), description: tr(<><code>size="small"</code> คือสวิตช์ขนาดเล็ก</>, <><code>size="small"</code> represents a small sized switch.</>), code: sizeCode, component: <Size /> },
        { title: tr("กำลังโหลด", "Loading"), description: tr(<>ทำให้สวิตช์อยู่ในสถานะ <code>loading</code></>, <>Mark the switch as in <code>loading</code> state.</>), code: loadingCode, component: <Loading /> },
      ]}
      api={[
        {
          title: "Switch",
          rows: [
            { property: "autoFocus", description: "Whether get focus when component mounted", type: "boolean", default: "false" },
            { property: "checked", description: "Determine whether the Switch is checked", type: "boolean", default: "false" },
            { property: "checkedChildren", description: "Content to be shown when the state is checked", type: "ReactNode", default: "-" },
            { property: "defaultChecked", description: "Whether to set the initial state", type: "boolean", default: "false" },
            { property: "disabled", description: "Disable switch", type: "boolean", default: "false" },
            { property: "loading", description: "Loading state of switch", type: "boolean", default: "false" },
            { property: "size", description: "The size of the Switch", type: "default | small", default: "default" },
            { property: "unCheckedChildren", description: "Content to be shown when the state is unchecked", type: "ReactNode", default: "-" },
            { property: "onChange", description: "Trigger when the checked state changes", type: "(checked: boolean, event: Event) => void", default: "-" },
            { property: "onClick", description: "Trigger when clicked", type: "(checked: boolean, event: Event) => void", default: "-" },
          ],
        },
      ]}
      related={[{ title: "Checkbox", path: "/components/checkbox" }, { title: "Radio", path: "/components/radio" }]}
    />
  );
}
