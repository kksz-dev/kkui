import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Disabled from "./demos/disabled";
import disabledCode from "./demos/disabled.tsx?raw";
import Controller from "./demos/controller";
import controllerCode from "./demos/controller.tsx?raw";
import Group from "./demos/group";
import groupCode from "./demos/group.tsx?raw";
import CheckAll from "./demos/check-all";
import checkAllCode from "./demos/check-all.tsx?raw";
import Layout from "./demos/layout";
import layoutCode from "./demos/layout.tsx?raw";
import Vertical from "./demos/vertical";
import verticalCode from "./demos/vertical.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="checkbox"
      imports={["Checkbox", "CheckboxGroup"]}
      whenToUse={tr(
        <>
          <ul>
            <li>ใช้เลือกหลายค่าจากตัวเลือกหลายรายการ</li>
            <li>Checkbox เดี่ยวทำหน้าที่คล้าย Switch สำหรับสลับระหว่างสองสถานะ ต่างกันตรงที่ Switch เปลี่ยนสถานะทันที ส่วน Checkbox มักรอการ submit</li>
          </ul>
        </>,
        <>
        <ul>
          <li>Used for selecting multiple values from several options.</li>
          <li>If you use only one checkbox, it is the same as using a Switch to toggle between two states. The difference is that Switch triggers the state change directly, while Checkbox usually needs a submit action.</li>
        </ul>
        </>,
      )}
      demos={[
        { title: tr("พื้นฐาน", "Basic"), description: tr("การใช้งาน Checkbox แบบพื้นฐาน", "Basic usage of checkbox."), code: basicCode, component: <Basic /> },
        { title: tr("ปิดใช้งาน", "Disabled"), description: tr("Checkbox แบบ disabled ในทุกสถานะ", "Disabled checkbox in every state."), code: disabledCode, component: <Disabled /> },
        { title: tr("Checkbox แบบ controlled", "Controlled Checkbox"), description: tr(<>เชื่อมสถานะกับ component อื่นผ่าน <code>checked</code> / <code>disabled</code></>, <>Communicate with other components via <code>checked</code> / <code>disabled</code>.</>), code: controllerCode, component: <Controller /> },
        { title: tr("กลุ่ม Checkbox", "Checkbox Group"), description: tr(<>สร้างกลุ่ม Checkbox จาก <code>options</code> โดยรับได้ทั้ง string หรือ object แบบ <code>{"{ label, value, disabled }"}</code></>, <>Generate a group of checkboxes from <code>options</code>. Strings or <code>{"{ label, value, disabled }"}</code> objects are accepted.</>), code: groupCode, component: <Group /> },
        { title: tr("เลือกทั้งหมด", "Check All"), description: tr(<>ใช้ prop <code>indeterminate</code> เพื่อทำสถานะ "เลือกทั้งหมด"</>, <>The <code>indeterminate</code> property lets you achieve a "check all" effect.</>), code: checkAllCode, component: <CheckAll /> },
        { title: tr("ใช้ร่วมกับ Grid", "Use with Grid"), description: tr("จัด children เป็น grid ด้วยการส่ง layout classes ให้ group", "Place children in a grid by passing layout classes to the group."), code: layoutCode, component: <Layout /> },
        { title: tr("แนวตั้ง", "Vertical"), description: tr(<><code>direction="vertical"</code> จัดตัวเลือกเรียงในแนวตั้ง</>, <><code>direction="vertical"</code> stacks the options.</>), code: verticalCode, component: <Vertical /> },
      ]}
      api={[
        {
          title: "Checkbox",
          rows: [
            { property: "autoFocus", description: "If get focus when component mounted", type: "boolean", default: "false" },
            { property: "checked", description: "Specifies whether the checkbox is selected", type: "boolean", default: "false" },
            { property: "defaultChecked", description: "Specifies the initial state", type: "boolean", default: "false" },
            { property: "disabled", description: "If disable checkbox", type: "boolean", default: "false" },
            { property: "indeterminate", description: "The indeterminate checked state of checkbox", type: "boolean", default: "false" },
            { property: "name", description: "Native name attribute", type: "string", default: "-" },
            { property: "value", description: "Value used inside CheckboxGroup", type: "string | number", default: "-" },
            { property: "onChange", description: "Callback when the state changes", type: "(e: CheckboxChangeEvent) => void", default: "-" },
          ],
        },
        {
          title: "CheckboxGroup",
          rows: [
            { property: "defaultValue", description: "Default selected values", type: "(string | number)[]", default: "[]" },
            { property: "disabled", description: "Disable all checkboxes", type: "boolean", default: "false" },
            { property: "name", description: "The name property of all inputs", type: "string", default: "-" },
            { property: "options", description: "Specifies options", type: "string[] | number[] | { label, value, disabled? }[]", default: "[]" },
            { property: "value", description: "Used for setting the currently selected values", type: "(string | number)[]", default: "[]" },
            { property: "direction", description: "Layout of options", type: "horizontal | vertical", default: "horizontal" },
            { property: "onChange", description: "Callback when any option changes", type: "(checkedValues: (string | number)[]) => void", default: "-" },
          ],
        },
      ]}
      related={[{ title: "Radio", path: "/components/radio" }, { title: "Switch", path: "/components/switch" }]}
    />
  );
}
