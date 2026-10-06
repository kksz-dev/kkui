import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Options from "./demos/options";
import optionsCode from "./demos/options.tsx?raw";
import Custom from "./demos/custom";
import customCode from "./demos/custom.tsx?raw";
import NonCaseSensitive from "./demos/non-case-sensitive";
import nonCaseSensitiveCode from "./demos/non-case-sensitive.tsx?raw";
import CertainCategory from "./demos/certain-category";
import certainCategoryCode from "./demos/certain-category.tsx?raw";
import UncertainCategory from "./demos/uncertain-category";
import uncertainCategoryCode from "./demos/uncertain-category.tsx?raw";
import Status from "./demos/status";
import statusCode from "./demos/status.tsx?raw";
import Variant from "./demos/variant";
import variantCode from "./demos/variant.tsx?raw";
import AllowClear from "./demos/allow-clear";
import allowClearCode from "./demos/allow-clear.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="auto-complete"
      imports={["AutoComplete"]}
      whenToUse={tr(
        <>
          <ul>
            <li>เมื่อต้องการช่องกรอกข้อความ ไม่ใช่ตัวเลือกแบบ selector</li>
            <li>เมื่อต้องการคำแนะนำระหว่างพิมพ์ หรือข้อความช่วยกรอก</li>
          </ul>
          <p className="mt-2">
            ต่างจาก <a href="/components/select">Select</a> ตรงที่ AutoComplete เป็นช่องกรอกที่มีคำแนะนำโผล่มาให้ ผู้ใช้พิมพ์เองได้อิสระ จุดสำคัญคือช่วย
            <em>พิมพ์</em> ส่วน Select คือเลือกจากตัวเลือกที่กำหนดไว้ พิมพ์เองไม่ได้ จุดสำคัญคือ <em>เลือก</em>
          </p>
        </>,
        <>
          <ul>
            <li>When you need an input box instead of a selector.</li>
            <li>When you need input suggestions or helping text.</li>
          </ul>
          <p className="mt-2">
            The differences with <a href="/components/select">Select</a> are: AutoComplete is an input box with text hints, and users can type freely. The keyword is
            assisting <em>input</em>. Select is selecting among given options — users cannot type freely; the keyword is <em>select</em>.
          </p>
        </>,
      )}
      demos={[
        { title: tr("การใช้งานพื้นฐาน", "Basic Usage"), description: tr("การใช้งานพื้นฐาน: ตัวเลือกถูกสร้างจากสิ่งที่พิมพ์", "Basic usage: options are generated from what you type."), code: basicCode, component: <Basic /> },
        { title: tr("กำหนดตัวเลือกเอง", "Customized"), description: tr(<>กำหนด <code>options</code> เองได้ ตัวที่สองเป็นโหมด controlled ผ่าน <code>value</code>/<code>onChange</code></>, <>You could set custom <code>options</code>; the second one is in controlled mode via <code>value</code>/<code>onChange</code>.</>), code: optionsCode, component: <Options /> },
        { title: tr("เปลี่ยน input component", "Customize Input Component"), description: tr(<>เปลี่ยน input component ได้โดยส่ง element เข้ามาเป็น <code>children</code> เช่น <code>InputTextArea</code></>, <>Customize the input component: pass an element as <code>children</code>, e.g. <code>InputTextArea</code>.</>), code: customCode, component: <Custom /> },
        { title: tr("ไม่แยกตัวพิมพ์ใหญ่-เล็ก", "Non-case-sensitive AutoComplete"), description: tr(<>AutoComplete ที่ไม่แยกตัวพิมพ์ใหญ่-เล็ก ด้วย <code>filterOption</code> ที่เขียนเอง</>, <>A non-case-sensitive AutoComplete via a custom <code>filterOption</code>.</>), code: nonCaseSensitiveCode, component: <NonCaseSensitive /> },
        { title: tr("รูปแบบการค้นหา - หมวดหมู่ชัดเจน", "Lookup-Patterns - Certain Category"), description: tr("ตัวอย่างรูปแบบการค้นหาแบบหมวดหมู่ชัดเจน จัดกลุ่มตัวเลือกพร้อมหัวข้อและจำนวน", "Demonstration of lookup patterns: certain category. Group options with a title and count."), code: certainCategoryCode, component: <CertainCategory /> },
        { title: tr("รูปแบบการค้นหา - หมวดหมู่ไม่ชัดเจน", "Lookup-Patterns - Uncertain Category"), description: tr("ตัวอย่างรูปแบบการค้นหาแบบหมวดหมู่ไม่ชัดเจน เป็นช่องค้นหาคู่กับปุ่ม", "Demonstration of lookup patterns: uncertain category — a search box with a button."), code: uncertainCategoryCode, component: <UncertainCategory /> },
        { title: tr("สถานะ", "Status"), description: tr(<>ใส่ <code>status</code> เป็น <code>error</code> หรือ <code>warning</code> ให้ AutoComplete</>, <>Add <code>status</code> to AutoComplete with <code>error</code> or <code>warning</code>.</>), code: statusCode, component: <Status /> },
        { title: tr("รูปแบบการแสดงผล", "Variants"), description: tr(<>รูปแบบของ AutoComplete: <code>outlined</code>, <code>filled</code>, <code>borderless</code>, <code>underlined</code></>, <>Variants of AutoComplete: <code>outlined</code>, <code>filled</code>, <code>borderless</code>, <code>underlined</code>.</>), code: variantCode, component: <Variant /> },
        { title: tr("ปุ่มล้างค่าแบบกำหนดเอง", "Customize clear button"), description: tr(<>ปรับปุ่มล้างค่าด้วย <code>allowClear</code></>, <>Customize the clear button with <code>allowClear</code>.</>), code: allowClearCode, component: <AllowClear /> },
      ]}
      api={[
        {
          title: "AutoComplete",
          rows: [
            { property: "allowClear", description: "Show clear button", type: "boolean | { clearIcon?: ReactNode }", default: "false" },
            { property: "autoFocus", description: "If get focus when component mounted", type: "boolean", default: "false" },
            { property: "backfill", description: "If backfill selected item to the input when using keyboard", type: "boolean", default: "false" },
            { property: "children", description: "Customize input element (receives value / onChange / onKeyDown / onFocus / onBlur)", type: "ReactElement", default: "<Input />" },
            { property: "defaultActiveFirstOption", description: "Whether the first option is active by default", type: "boolean", default: "true" },
            { property: "defaultOpen", description: "Initial open state of the dropdown", type: "boolean", default: "-" },
            { property: "defaultValue", description: "Initial selected option", type: "string", default: "-" },
            { property: "disabled", description: "Whether disabled", type: "boolean", default: "false" },
            { property: "popupClassName", description: "The className of the dropdown", type: "string", default: "-" },
            { property: "popupMatchSelectWidth", description: "Whether the dropdown matches the input width; number = fixed width", type: "boolean | number", default: "true" },
            { property: "popupRender", description: "Customize dropdown content", type: "(menu: ReactElement) => ReactNode", default: "-" },
            { property: "filterOption", description: "If true, filter options by input; if function, filter options against it", type: "boolean | (inputValue, option) => boolean", default: "false" },
            { property: "notFoundContent", description: "Specify content to show when no result matches", type: "ReactNode", default: "null" },
            { property: "open", description: "Controlled open state of dropdown", type: "boolean", default: "-" },
            { property: "options", description: "Select options. Will get better perf than jsx definition", type: "{ label, value }[] | { label, options }[]", default: "-" },
            { property: "optionRender", description: "Customize the rendering dropdown options", type: "(option, info: { index }) => ReactNode", default: "-" },
            { property: "placeholder", description: "The placeholder of input", type: "string", default: "-" },
            { property: "placement", description: "The position where the dropdown pops up", type: "bottomLeft | bottomRight | topLeft | topRight", default: "bottomLeft" },
            { property: "size", description: "Size of the input", type: "sm | md | lg", default: "md" },
            { property: "status", description: "Set validation status", type: "error | warning", default: "-" },
            { property: "value", description: "Selected option", type: "string", default: "-" },
            { property: "variant", description: "Variants of input", type: "outlined | borderless | filled | underlined", default: "outlined" },
            { property: "onBlur", description: "Called when leaving the component", type: "function", default: "-" },
            { property: "onChange", description: "Called when selecting an option or changing an input value", type: "(value: string, option?) => void", default: "-" },
            { property: "onOpenChange", description: "Call when dropdown open state changes", type: "(open: boolean) => void", default: "-" },
            { property: "onFocus", description: "Called when entering the component", type: "function", default: "-" },
            { property: "onSearch", description: "Called when searching items", type: "(value: string) => void", default: "-" },
            { property: "onSelect", description: "Called when a option is selected. param is option's value and option instance", type: "(value: string, option) => void", default: "-" },
            { property: "onClear", description: "Called when clear", type: "() => void", default: "-" },
          ],
        },
      ]}
      extra={
        <>
          <h2>FAQ</h2>
          <h3>Why doesn't the text composition system work well with onSearch in controlled mode?</h3>
          <p>Keep <code>value</code> in sync in <code>onChange</code>, not <code>onSearch</code>: onSearch fires only on typing, onChange also on selecting.</p>
        </>
      }
      related={[
        { title: "Select", path: "/components/select" },
        { title: "Input", path: "/components/input" },
      ]}
    />
  );
}
