import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import CustomFilter from "./demos/custom-filter";
import customFilterCode from "./demos/custom-filter.tsx?raw";
import Controlled from "./demos/controlled";
import controlledCode from "./demos/controlled.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="command-palette"
      imports={["CommandPalette", "type CommandItem", "type CommandPaletteProps"]}
      whenToUse={tr(
        <p>ใช้เมื่อแอปมีคำสั่งและปลายทางเยอะ จนเมนูปกติหาช้ากว่าการพิมพ์ — เปิดด้วย ⌘K แล้วสั่งงานจากคีย์บอร์ดล้วน</p>,
        <p>Use when an app has more commands and destinations than a menu can surface quickly. Opens on ⌘K and runs entirely from the keyboard.</p>,
      )}
      demos={[
        {
          title: tr("กล่องคำสั่งพื้นฐาน", "Command Box"),
          description: tr("จัดกลุ่มคำสั่ง ค้นหาแบบหลายคำ และเลื่อนเลือกด้วยลูกศร", "Grouped, multi-word search, arrow-key navigation."),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("คำค้นหาและคีย์เวิร์ด (Keywords & Custom Query)", "Keywords & Filtering"),
          description: tr("รองรับ keywords ค้นหาข้ามภาษา และควบคุมข้อความค้นหา", "Supports multilingual keywords and controlled search query."),
          code: customFilterCode,
          component: <CustomFilter />,
        },
        {
          title: tr("ทางลัดคีย์บอร์ดและสถานะปิดการใช้งาน", "Shortcuts & Disabled States"),
          description: tr("แสดงปุ่มลัดคีย์บอร์ด (Shortcut badge) และคำสั่งที่ถูกปิดการใช้งาน (Disabled)", "Display shortcut keys and handle disabled actions gracefully."),
          code: controlledCode,
          component: <Controlled />,
        },
      ]}
      api={[
        {
          title: "CommandPalette",
          rows: [
            { property: "open / onOpenChange", description: "Visibility state", type: "boolean / (open: boolean) => void", default: "-" },
            { property: "items", description: "Commands list, optionally grouped", type: "CommandItem[]", default: "required" },
            { property: "value / onValueChange", description: "Controlled query string", type: "string / (value: string) => void", default: "-" },
            { property: "placeholder", description: "Input placeholder and accessible label", type: "string", default: "'Type a command or search…'" },
            { property: "filter", description: "Custom matcher function", type: "(item: CommandItem, query: string) => boolean", default: "word-wise contains" },
            { property: "shortcutKey", description: "Opens with meta/ctrl + this key; false disables global listener", type: "string | false", default: "'k'" },
            { property: "closeOnSelect", description: "Close palette automatically after a command is chosen", type: "boolean", default: "true" },
            { property: "footer", description: "Hint bar under the list", type: "ReactNode", default: "-" },
            { property: "emptyText", description: "Shown when nothing matches", type: "ReactNode", default: "'No results'" },
            { property: "maxHeight", description: "List maximum height in px", type: "number", default: "360" },
            { property: "getContainer", description: "Portal target; false renders in place", type: "HTMLElement | (() => HTMLElement) | false", default: "document.body" },
            { property: "zIndex", description: "Overlay stacking level", type: "number", default: "1050" },
            { property: "className", description: "Class on the dialog panel", type: "string", default: "-" },
          ],
        },
        {
          title: "CommandItem",
          rows: [
            { property: "key", description: "Unique item identifier", type: "string", default: "-" },
            { property: "label / description / icon", description: "Row visual content", type: "ReactNode", default: "-" },
            { property: "value", description: "Text matched by the default filter", type: "string", default: "string label or key" },
            { property: "shortcut", description: "Right-hand keyboard shortcut hint", type: "ReactNode", default: "-" },
            { property: "group", description: "Section heading name", type: "string", default: "-" },
            { property: "keywords", description: "Extra words the filter matches", type: "string[]", default: "-" },
            { property: "disabled", description: "Skip this command during keyboard navigation", type: "boolean", default: "false" },
            { property: "closeOnSelect", description: "Override palette-level close behavior for this specific item", type: "boolean", default: "-" },
            { property: "onSelect", description: "Callback executed when chosen", type: "() => void", default: "-" },
          ],
        },
      ]}
      related={[{ path: "/components/select", title: "Select" }, { path: "/components/combobox", title: "Combobox" }]}
    />
  );
}
