import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import SizeStatus from "./demos/size-status";
import sizeStatusCode from "./demos/size-status.tsx?raw";
import CreateDemo from "./demos/create";
import createCode from "./demos/create.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="combobox"
      imports={["Combobox", "type ComboboxOption", "type ComboboxProps"]}
      whenToUse={tr(
        <p>ใช้เมื่อรายการยาวเกินกว่าจะกดเลือกทีละอัน แต่ยังต้องการค่าเดียวที่ชัดเจน — และบางครั้งต้องเพิ่มค่าที่ยังไม่มีในรายการ</p>,
        <p>Use when the list is too long to scan but the answer is still a single value, and sometimes that value is not on the list yet.</p>,
      )}
      demos={[
        {
          title: tr("ค้นหาและเลือก", "Search and Select"),
          description: tr("กลุ่ม คำอธิบายใต้ชื่อ และล้างค่าได้", "Groups, secondary lines and a clear control."),
          code: basicCode,
          component: <Basic />,
          size: "compact",
        },
        {
          title: tr("ขนาดและสถานะ", "Sizes & Statuses"),
          description: tr("รองรับขนาด sm, md, lg และสถานะ warning / error / disabled", "Supports sizes sm, md, lg and validation states warning, error, disabled."),
          code: sizeStatusCode,
          component: <SizeStatus />,
          size: "compact",
        },
        {
          title: tr("สร้างค่าใหม่", "Create a Value"),
          description: tr("พิมพ์สิ่งที่ยังไม่มีในรายการแล้วเพิ่มได้ทันทีด้วย allowCreate", "allowCreate turns an unmatched query into a new option."),
          code: createCode,
          component: <CreateDemo />,
          size: "compact",
        },
      ]}
      api={[
        {
          title: "Combobox",
          rows: [
            { property: "options", description: "Choices", type: "ComboboxOption[]", default: "-" },
            { property: "value / defaultValue", description: "Selected value", type: "string | null", default: "null" },
            { property: "onChange", description: "Selection changed callback", type: "(value: string | null, option?: ComboboxOption) => void", default: "-" },
            { property: "allowCreate / onCreate", description: "Commit a value that is not on the list", type: "boolean / (value: string) => void", default: "false" },
            { property: "createLabel", description: "Render the create-option label", type: "(value: string) => ReactNode", default: "-" },
            { property: "placeholder", description: "Trigger placeholder", type: "string", default: "'Select…'" },
            { property: "searchPlaceholder", description: "Popup search placeholder and accessible name", type: "string", default: "'Search…'" },
            { property: "emptyText", description: "Content shown when nothing matches", type: "ReactNode", default: "'No matches'" },
            { property: "disabled", description: "Disable the control", type: "boolean", default: "false" },
            { property: "allowClear", description: "Show a clear control", type: "boolean", default: "false" },
            { property: "size", description: "Control size", type: "'sm' | 'md' | 'lg'", default: "'md'" },
            { property: "status", description: "Validation state", type: "'error' | 'warning'", default: "-" },
            { property: "popupWidth", description: "Match the trigger, or a fixed px width", type: "number | 'trigger'", default: "'trigger'" },
            { property: "listHeight", description: "Maximum popup-list height in px", type: "number", default: "280" },
            { property: "getPopupContainer", description: "Mount the popup elsewhere; called after the trigger mounts", type: "(trigger: HTMLElement) => HTMLElement", default: "document.body" },
            { property: "id / name", description: "Control id and hidden form-field name", type: "string", default: "auto / -" },
            { property: "className", description: "Trigger class names", type: "string", default: "-" },
          ],
        },
      ]}
      related={[{ path: "/components/select", title: "Select" }, { path: "/components/auto-complete", title: "AutoComplete" }]}
    />
  );
}
