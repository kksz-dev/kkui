import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import CollapsedDemo from "./demos/collapsed";
import collapsedCode from "./demos/collapsed.tsx?raw";
import MobileDemo from "./demos/mobile";
import mobileCode from "./demos/mobile.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="app-sidebar"
      imports={["AppSidebar", "type AppSidebarItem", "type AppSidebarProps"]}
      whenToUse={tr(
        <p>ใช้เป็นแถบนำทางหลักด้านข้างของแอปที่มีหลายหมวด — พับเป็นแถบไอคอนได้ และรองรับโหมดลิ้นชักเมื่อ caller เลือกใช้</p>,
        <p>Use as the main side navigation of an application: nested sections, an icon rail when collapsed, and an opt-in drawer mode.</p>,
      )}
      demos={[
        {
          title: tr("เมนูซ้อนและกลุ่ม", "Groups and nesting"),
          description: tr("หัวข้อกลุ่ม เมนูย่อย ป้ายตัวเลข และเส้นคั่น", "Group headings, sub-items, badges and dividers."),
          code: basicCode,
          component: <Basic />,
          size: "full",
        },
        {
          title: tr("พับเป็นแถบไอคอน", "Collapsed rail"),
          description: tr("เหลือเฉพาะไอคอน ชื่อเมนูแสดงเป็น tooltip", "Icons only, with the label moving into a tooltip."),
          code: collapsedCode,
          component: <CollapsedDemo />,
          size: "wide",
        },
        {
          title: tr("โหมดลิ้นชักบนมือถือ", "Drawer on mobile"),
          description: tr("ส่ง mode=\"drawer\" พร้อม open/onOpenChange แล้วแถบจะเลื่อนทับหน้าพร้อมฉากหลัง", "Pass mode=\"drawer\" with open/onOpenChange and it slides over the page with a mask."),
          code: mobileCode,
          component: <MobileDemo />,
          size: "compact",
          previewClassName: "2xl:flex 2xl:min-h-[372px] 2xl:items-center 2xl:[&>*]:w-full",
        },
      ]}
      api={[
        {
          title: "AppSidebar",
          rows: [
            { property: "items", description: "Navigation tree", type: "AppSidebarItem[]", default: "required" },
            { property: "activeKey / defaultActiveKey", description: "Selected item; ancestors open automatically", type: "string", default: "-" },
            { property: "onSelect", description: "A leaf item was chosen", type: "(key, item) => void", default: "-" },
            { property: "collapsed / defaultCollapsed", description: "Icon rail mode", type: "boolean", default: "false" },
            { property: "onCollapsedChange", description: "Rail toggled", type: "(collapsed) => void", default: "-" },
            { property: "collapsible", description: "Show the collapse control", type: "boolean", default: "true" },
            { property: "mode", description: "Inline navigation or drawer overlay; the caller owns responsive breakpoints", type: "'inline' | 'drawer'", default: "inferred once from open" },
            { property: "open / onOpenChange", description: "Controlled visibility in drawer mode", type: "boolean", default: "-" },
            { property: "header / footer", description: "Slots above and below the list", type: "ReactNode", default: "-" },
            { property: "width / collapsedWidth", description: "Sizing in px", type: "number", default: "248 / 64" },
            { property: "linkRender", description: "Render an href leaf with your router link; receives safe row content and anchor props", type: "(item, node, anchorProps) => ReactNode", default: "-" },
          ],
        },
        {
          title: "AppSidebarItem",
          rows: [
            { property: "key", description: "Identity; optional for dividers", type: "string", default: "-" },
            { property: "label / icon / badge", description: "Row content; label is optional for dividers", type: "ReactNode", default: "-" },
            { property: "children", description: "Nested items", type: "AppSidebarItem[]", default: "-" },
            { property: "type", description: "'item' | 'group' | 'divider'", type: "string", default: "'item'" },
            { property: "href", description: "Renders a native anchor, or is passed to linkRender", type: "string", default: "-" },
            { property: "disabled", description: "Not selectable", type: "boolean", default: "false" },
          ],
        },
      ]}
      related={[{ path: "/components/app-bar", title: "AppBar" }, { path: "/components/menu", title: "Menu" }]}
    />
  );
}
