import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Async from "./demos/async";
import asyncCode from "./demos/async.tsx?raw";
import Prefix from "./demos/prefix";
import prefixCode from "./demos/prefix.tsx?raw";
import Readonly from "./demos/readonly";
import readonlyCode from "./demos/readonly.tsx?raw";
import Form from "./demos/form";
import formCode from "./demos/form.tsx?raw";
import Autosize from "./demos/autosize";
import autosizeCode from "./demos/autosize.tsx?raw";
import Placement from "./demos/placement";
import placementCode from "./demos/placement.tsx?raw";
import Status from "./demos/status";
import statusCode from "./demos/status.tsx?raw";
import Variant from "./demos/variant";
import variantCode from "./demos/variant.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="mentions"
      imports={["Mentions", "getMentions"]}
      whenToUse={tr(
        <>
          <p>ใช้กล่าวถึงบุคคลหรือสิ่งต่าง ๆ ภายในช่องกรอกข้อมูล</p>
          <ul>
            <li>เหมาะเมื่อต้องกล่าวถึงบุคคลหรือสิ่งต่าง ๆ เช่น ใน comment, chat หรือ issue tracker</li>
            <li>พิมพ์อักขระ trigger (ค่าเริ่มต้นคือ <code>@</code>) เพื่อเปิดรายการแนะนำ แล้วเลือกด้วยเมาส์, ปุ่มลูกศร + Enter หรือ Tab</li>
          </ul>
        </>,
        <>
          <p>Used to mention someone or something in an input.</p>
          <ul>
            <li>When you need to mention someone or something (comments, chat, issue trackers).</li>
            <li>Type the trigger character (<code>@</code> by default) to open the suggestion list; pick with mouse, arrows + Enter, or Tab.</li>
          </ul>
        </>,
      )}
      demos={[
        { title: tr("การใช้งานพื้นฐาน", "Basic"), description: tr("การใช้งานพื้นฐาน", "Basic usage."), code: basicCode, component: <Basic /> },
        { title: tr("โหลดข้อมูลแบบ asynchronous", "Asynchronous loading"), description: tr(<>โหลด option ผ่าน <code>onSearch</code>, ปิดการกรองฝั่ง client ด้วย <code>filterOption={"{false}"}</code> และแสดงสถานะ <code>loading</code></>, <>Load options on <code>onSearch</code>, disable client filtering with <code>filterOption={"{false}"}</code> and show <code>loading</code>.</>), code: asyncCode, component: <Async /> },
        { title: tr("กำหนด trigger token", "Customize Trigger Token"), description: tr(<>กำหนด trigger token ด้วย <code>prefix</code>; <code>onSearch</code> จะได้รับ prefix ที่กำลังใช้งาน</>, <>Customize trigger tokens with <code>prefix</code>; <code>onSearch</code> receives the active prefix.</>), code: prefixCode, component: <Prefix /> },
        { title: tr("ปิดใช้งานหรืออ่านอย่างเดียว", "disabled or readOnly"), description: tr(<>ตั้งค่า <code>disabled</code> และ <code>readOnly</code></>, <>Configure <code>disabled</code> and <code>readOnly</code>.</>), code: readonlyCode, component: <Readonly /> },
        { title: tr("ใช้ร่วมกับ Form", "With Form"), description: tr(<>ควบคุมค่าจากภายนอกและใช้ <code>getMentions</code> ตรวจสอบ mention ที่กรอก</>, <>Controlled usage plus <code>getMentions</code> to validate the entered mentions.</>), code: formCode, component: <Form /> },
        { title: tr("ปรับความสูงอัตโนมัติ", "autoSize"), description: tr(<>ปรับความสูงตามเนื้อหาอัตโนมัติด้วย <code>autoSize</code></>, <>Height auto-adjusts to content via <code>autoSize</code>.</>), code: autosizeCode, component: <Autosize /> },
        { title: tr("ตำแหน่ง", "Placement"), description: tr(<>เปลี่ยน <code>placement</code> ของ popup เป็น <code>top</code></>, <>Change the popup <code>placement</code> to <code>top</code>.</>), code: placementCode, component: <Placement /> },
        { title: tr("สถานะ", "Status"), description: tr(<>เพิ่มสถานะผ่าน <code>status</code>: <code>error</code> หรือ <code>warning</code>; <code>allowClear</code> เพิ่มไอคอนล้างค่า</>, <>Add status with <code>status</code>: <code>error</code> or <code>warning</code>; <code>allowClear</code> adds a clear icon.</>), code: statusCode, component: <Status /> },
        { title: tr("รูปแบบ", "Variants"), description: tr(<>มีสี่รูปแบบ: <code>outlined</code>, <code>filled</code>, <code>borderless</code>, <code>underlined</code></>, <>Four variants: <code>outlined</code>, <code>filled</code>, <code>borderless</code>, <code>underlined</code>.</>), code: variantCode, component: <Variant /> },
      ]}
      api={[
        {
          title: "Mentions",
          description: "Extends InputTextArea props (rows, autoSize, allowClear, showCount, variant, status, disabled, readOnly, placeholder…).",
          rows: [
            { property: "allowClear", description: "If allow to remove mentions content with clear icon", type: "boolean | { clearIcon?: ReactNode }", default: "false" },
            { property: "autoSize", description: "Textarea height autosize feature", type: "boolean | { minRows?: number; maxRows?: number }", default: "false" },
            { property: "defaultValue", description: "Default value", type: "string", default: "-" },
            { property: "filterOption", description: "Customize filter option logic; `false` disables filtering", type: "false | (input: string, option: MentionsOption) => boolean", default: "matches value, case-insensitive" },
            { property: "notFoundContent", description: "Set mentions content when not match", type: "ReactNode", default: "Not Found" },
            { property: "loading", description: "Show a spinner in the popup while options load", type: "boolean", default: "false" },
            { property: "placement", description: "Set popup placement", type: "top | bottom", default: "bottom" },
            { property: "prefix", description: "Set trigger prefix keyword", type: "string | string[]", default: "@" },
            { property: "split", description: "Set split string before and after selected mention", type: "string", default: "' '" },
            { property: "status", description: "Set validation status", type: "error | warning", default: "-" },
            { property: "variant", description: "Variants of Input", type: "outlined | filled | borderless | underlined", default: "outlined" },
            { property: "value", description: "Set value of mentions", type: "string", default: "-" },
            { property: "options", description: "Option list", type: "{ value: string; label?: ReactNode; disabled?: boolean; className?: string }[]", default: "[]" },
            { property: "open", description: "Controlled popup visibility", type: "boolean", default: "-" },
            { property: "disabled", description: "Whether disabled", type: "boolean", default: "false" },
            { property: "readOnly", description: "Read only", type: "boolean", default: "false" },
            { property: "onChange", description: "Trigger when value changed", type: "(text: string) => void", default: "-" },
            { property: "onSelect", description: "Trigger when user select the option", type: "(option: MentionsOption, prefix: string) => void", default: "-" },
            { property: "onSearch", description: "Trigger when prefix hit", type: "(text: string, prefix: string) => void", default: "-" },
            { property: "popupClassName", description: "Class of the popup", type: "string", default: "-" },
          ],
        },
        {
          title: "getMentions",
          description: "Utility: parse a text into its mentions.",
          rows: [
            { property: "getMentions(value, config?)", description: "Returns `{ prefix, value }[]` for every word starting with a prefix", type: "(value: string, config?: { prefix?: string | string[]; split?: string }) => { prefix: string; value: string }[]", default: "-" },
          ],
        },
      ]}
      related={[{ title: "Input", path: "/components/input" }]}
    />
  );
}
