import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Disabled from "./demos/disabled";
import disabledCode from "./demos/disabled.tsx?raw";
import Group from "./demos/group";
import groupCode from "./demos/group.tsx?raw";
import Vertical from "./demos/vertical";
import verticalCode from "./demos/vertical.tsx?raw";
import Options from "./demos/options";
import optionsCode from "./demos/options.tsx?raw";
import RadioButtonDemo from "./demos/radiobutton";
import radioButtonCode from "./demos/radiobutton.tsx?raw";
import Size from "./demos/size";
import sizeCode from "./demos/size.tsx?raw";
import Solid from "./demos/solid";
import solidCode from "./demos/solid.tsx?raw";
import Block from "./demos/block";
import blockCode from "./demos/block.tsx?raw";
import Name from "./demos/name";
import nameCode from "./demos/name.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="radio"
      imports={["Radio", "RadioGroup", "RadioButton"]}
      whenToUse={tr(
        <ul>
          <li>ใช้เลือกค่าเดียวจากหลายตัวเลือก</li>
          <li>ต่างจาก Select ตรงที่ Radio แสดงตัวเลือกทั้งหมดให้เห็น ทำให้เปรียบเทียบกันได้ง่าย จึงไม่ควรมีตัวเลือกมากเกินไป</li>
        </ul>,
        <ul>
          <li>Used to select a single state from multiple options.</li>
          <li>The difference from Select is that Radio is visible to the user and can facilitate the comparison of choice, which means there shouldn't be too many of them.</li>
        </ul>,
      )}
      demos={[
        { title: tr("การใช้งานพื้นฐาน", "Basic"), description: tr("ตัวอย่างที่ง่ายที่สุด", "The simplest use."), code: basicCode, component: <Basic /> },
        { title: tr("ปิดใช้งาน", "Disabled"), description: tr(<>ปิดการใช้งาน radio ด้วย <code>disabled</code></>, <>Radio unavailable through <code>disabled</code>.</>), code: disabledCode, component: <Disabled /> },
        { title: tr("กลุ่ม Radio", "Radio Group"), description: tr(<>จัดกลุ่ม radio ไว้ด้วยกัน โดย <code>onChange</code> จะได้อ็อบเจกต์คล้าย event ที่มี <code>target.value</code></>, <>A group of radio components; <code>onChange</code> receives an event-like object with <code>target.value</code>.</>), code: groupCode, component: <Group /> },
        { title: tr("แนวตั้ง", "Vertical"), description: tr(<><code>orientation="vertical"</code> เรียง radio ในแนวตั้ง และ children แสดงเนื้อหาเพิ่มเติมตอนถูกเลือกได้</>, <><code>orientation="vertical"</code> stacks the radios; children can render extra content when selected.</>), code: verticalCode, component: <Vertical /> },
        { title: tr("กลุ่ม Radio จาก options", "Radio Group with Options"), description: tr(<>สร้าง radio จาก <code>options</code> และเปลี่ยนเป็นปุ่มด้วย <code>optionType="button"</code></>, <>Render radios from <code>options</code>; switch to buttons with <code>optionType="button"</code>.</>), code: optionsCode, component: <Options /> },
        { title: tr("สไตล์ปุ่ม", "Radio Style"), description: tr(<>รวม <code>RadioButton</code> ไว้ในกลุ่มเดียวกัน จะได้หน้าตาแบบ segmented control</>, <>The combination of <code>RadioButton</code>s in a group looks like a segmented control.</>), code: radioButtonCode, component: <RadioButtonDemo /> },
        { title: tr("ขนาด", "Size"), description: tr(<>สามขนาด: <code>lg</code>, <code>md</code> (ค่าเริ่มต้น), <code>sm</code></>, <>Three sizes: <code>lg</code>, <code>md</code> (default), <code>sm</code>.</>), code: sizeCode, component: <Size /> },
        { title: tr("ปุ่มแบบทึบ", "Solid Radio Button"), description: tr(<><code>buttonStyle="solid"</code> เติมสีพื้นให้ปุ่มที่ถูกเลือก</>, <><code>buttonStyle="solid"</code> fills the selected button.</>), code: solidCode, component: <Solid /> },
        { title: tr("เต็มความกว้าง", "Block"), description: tr(<><code>block</code> ยืดกลุ่มให้เต็มความกว้างของ parent</>, <><code>block</code> stretches the group to fit its parent.</>), code: blockCode, component: <Block /> },
        { title: tr("ชื่อฟิลด์", "Name"), description: tr(<>ส่ง <code>name</code> เพื่อตั้ง name จริงให้ทุก input กลุ่มนี้จึงถูกส่งไปพร้อมฟอร์มได้</>, <>Passing <code>name</code> sets the native name on every input so the group posts inside a form.</>), code: nameCode, component: <Name /> },
      ]}
      api={[
        {
          title: "Radio / RadioButton",
          rows: [
            { property: "autoFocus", description: "Whether get focus when component mounted", type: "boolean", default: "false" },
            { property: "checked", description: "Specifies whether the radio is selected (standalone)", type: "boolean", default: "false" },
            { property: "defaultChecked", description: "Initial checked state (standalone)", type: "boolean", default: "false" },
            { property: "disabled", description: "Disable radio", type: "boolean", default: "false" },
            { property: "value", description: "According to value for comparison inside a group", type: "string | number", default: "-" },
            { property: "onChange", description: "Standalone change callback", type: "(e: RadioChangeEvent) => void", default: "-" },
          ],
        },
        {
          title: "RadioGroup",
          rows: [
            { property: "block", description: "Option to fit width to its parent", type: "boolean", default: "false" },
            { property: "buttonStyle", description: "The style type of radio button", type: "outline | solid", default: "outline" },
            { property: "defaultValue", description: "Default selected value", type: "string | number", default: "-" },
            { property: "disabled", description: "Disable all radio buttons", type: "boolean", default: "false" },
            { property: "name", description: "The name property of all input[type=\"radio\"] children", type: "string", default: "-" },
            { property: "options", description: "Set children optional", type: "string[] | number[] | { label, value, disabled? }[]", default: "-" },
            { property: "optionType", description: "Set Radio optionType", type: "default | button", default: "default" },
            { property: "size", description: "The size of radio button style", type: "sm | md | lg", default: "md" },
            { property: "value", description: "Used for setting the currently selected value", type: "string | number", default: "-" },
            { property: "orientation", description: "Layout of the options", type: "horizontal | vertical", default: "horizontal" },
            { property: "onChange", description: "The callback function that is triggered when the state changes", type: "(e: RadioChangeEvent) => void", default: "-" },
          ],
        },
      ]}
      related={[{ title: "Checkbox", path: "/components/checkbox" }, { title: "Select", path: "/components/select" }]}
    />
  );
}
