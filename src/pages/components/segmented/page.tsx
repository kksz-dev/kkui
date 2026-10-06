import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Block from "./demos/block";
import blockCode from "./demos/block.tsx?raw";
import Disabled from "./demos/disabled";
import disabledCode from "./demos/disabled.tsx?raw";
import Controlled from "./demos/controlled";
import controlledCode from "./demos/controlled.tsx?raw";
import CustomRender from "./demos/custom-render";
import customRenderCode from "./demos/custom-render.tsx?raw";
import Dynamic from "./demos/dynamic";
import dynamicCode from "./demos/dynamic.tsx?raw";
import Sizes from "./demos/sizes";
import sizesCode from "./demos/sizes.tsx?raw";
import WithIcon from "./demos/with-icon";
import withIconCode from "./demos/with-icon.tsx?raw";
import Synced from "./demos/synced";
import syncedCode from "./demos/synced.tsx?raw";
import Vertical from "./demos/vertical";
import verticalCode from "./demos/vertical.tsx?raw";
import Shape from "./demos/shape";
import shapeCode from "./demos/shape.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="segmented"
      imports={["Segmented"]}
      whenToUse={tr(
        <>
          <p>Segmented วางตัวเลือกเรียงกันในแนวนอน (หรือแนวตั้ง) ให้ผู้ใช้เลือกได้ค่าเดียว พร้อมแอนิเมชันเลื่อนตัวไฮไลต์</p>
          <ul>
            <li>เมื่อต้องสลับมุมมองหรือกรองข้อมูลระหว่างตัวเลือกที่เลือกได้ทีละอย่าง</li>
            <li>เมื่อตัวเลือกเรียงเป็นลำดับและมีจำนวนน้อย (ราว 2-5 ตัวเลือก)</li>
            <li>ใช้แทนกลุ่ม radio button หรือแถบ tab เมื่อพื้นที่จำกัด</li>
          </ul>
        </>,
        <>
          <p>Segmented Controls display multiple options horizontally (or vertically) and allow users to select a single choice with a sliding thumb animation.</p>
          <ul>
            <li>When you need to switch views or filter data between mutually exclusive options.</li>
            <li>When options are linear and small in number (2 to 5 options).</li>
            <li>As an alternative to radio button groups or tab bars when space is compact.</li>
          </ul>
        </>,
      )}
      demos={[
        { title: tr("การใช้งานพื้นฐาน", "Basic"), description: tr("ตัวอย่างที่ง่ายที่สุด ใช้ options เป็นสตริง", "The simplest usage with string options."), code: basicCode, component: <Basic /> },
        { title: tr("เต็มความกว้าง", "Block"), description: tr(<><code>block</code> ยืดให้เต็มความกว้างของ container</>, <>Fit the width of the parent container with <code>block</code>.</>), code: blockCode, component: <Block /> },
        { title: tr("ปิดใช้งาน", "Disabled"), description: tr(<><code>disabled</code> ปิดได้ทั้งตัวควบคุมทั้งหมด หรือเฉพาะบางตัวเลือก</>, <>Disable the entire control or individual options via <code>disabled</code>.</>), code: disabledCode, component: <Disabled /> },
        { title: tr("คุมค่าจากภายนอก", "Controlled"), description: tr(<>โหมด controlled ด้วย <code>value</code> และ <code>onChange</code></>, <>Controlled mode using <code>value</code> and <code>onChange</code>.</>), code: controlledCode, component: <Controlled /> },
        { title: tr("กำหนดเนื้อหาเอง", "Custom Render"), description: tr("จัดโครงสร้าง label เองได้ ใส่ไอคอนและคำอธิบายเพิ่ม", "Custom label structure with icons and descriptions."), code: customRenderCode, component: <CustomRender /> },
        { title: tr("เปลี่ยนตัวเลือกแบบไดนามิก", "Dynamic"), description: tr("โหลดหรืออัปเดต options ระหว่างใช้งาน", "Dynamically load or update options."), code: dynamicCode, component: <Dynamic /> },
        { title: tr("สามขนาด", "Three Sizes"), description: tr(<>มีสามขนาด: <code>sm</code>, <code>md</code> (ค่าเริ่มต้น) และ <code>lg</code></>, <>Three sizes are available: <code>sm</code>, <code>md</code> (default), and <code>lg</code>.</>), code: sizesCode, component: <Sizes /> },
        { title: tr("พร้อมไอคอน", "With Icon"), description: tr("ตัวเลือกที่มีแต่ไอคอน หรือไอคอนคู่กับข้อความ", "Options with icons only or icon plus text label."), code: withIconCode, component: <WithIcon /> },
        { title: tr("ผูกสองตัวเข้าด้วยกัน", "Synced Pair"), description: tr("Segmented สองตัวที่ผูกกับ state เดียวกัน", "Two segmented controls synced to the same state."), code: syncedCode, component: <Synced /> },
        { title: tr("แนวตั้ง", "Vertical"), description: tr(<>จัดวางแนวตั้งด้วย <code>vertical</code></>, <>Vertical layout with <code>vertical</code>.</>), code: verticalCode, component: <Vertical /> },
        { title: tr("ทรงมนแบบ pill", "Round Shape"), description: tr(<>ตั้ง <code>shape="round"</code> เพื่อให้มุมมนเป็นทรง pill</>, <>Set <code>shape="round"</code> for pill-shaped styling.</>), code: shapeCode, component: <Shape /> },
      ]}
      api={[
        {
          title: "Segmented",
          rows: [
            { property: "options", description: "Set children options", type: "string[] | number[] | SegmentedLabeledOption[]", default: "[]" },
            { property: "value", description: "Currently selected value", type: "string | number", default: "-" },
            { property: "defaultValue", description: "Default selected value", type: "string | number", default: "options[0]" },
            { property: "onChange", description: "Callback when selection changes", type: "(value: string | number) => void", default: "-" },
            { property: "size", description: "Control size", type: "sm | md | lg", default: "md" },
            { property: "block", description: "Fit width for parent", type: "boolean", default: "false" },
            { property: "disabled", description: "Disable all segments", type: "boolean", default: "false" },
            { property: "shape", description: "Option corner style", type: "default | round", default: "default" },
            { property: "vertical", description: "Vertical layout", type: "boolean", default: "false" },
            { property: "name", description: "Name of the hidden form input", type: "string", default: "-" },
            { property: "className", description: "Extra classes on the container", type: "string", default: "-" },
          ],
        },
        {
          title: "SegmentedLabeledOption",
          description: "Object structure for detailed option items.",
          rows: [
            { property: "label", description: "Display text or custom node", type: "ReactNode", default: "-" },
            { property: "value", description: "Option value", type: "string | number", default: "-" },
            { property: "icon", description: "Icon node", type: "ReactNode", default: "-" },
            { property: "disabled", description: "Disable this option", type: "boolean", default: "false" },
            { property: "className", description: "Custom class for this option", type: "string", default: "-" },
            { property: "title", description: "HTML title attribute tooltip", type: "string", default: "-" },
          ],
        },
      ]}
      related={[{ title: "Radio", path: "/components/radio" }, { title: "Tabs", path: "/components/tabs" }]}
    />
  );
}
