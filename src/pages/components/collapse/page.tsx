import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Size from "./demos/size";
import sizeCode from "./demos/size.tsx?raw";
import Accordion from "./demos/accordion";
import accordionCode from "./demos/accordion.tsx?raw";
import Nested from "./demos/nested";
import nestedCode from "./demos/nested.tsx?raw";
import Borderless from "./demos/borderless";
import borderlessCode from "./demos/borderless.tsx?raw";
import CustomPanel from "./demos/custom-panel";
import customPanelCode from "./demos/custom-panel.tsx?raw";
import NoArrow from "./demos/no-arrow";
import noArrowCode from "./demos/no-arrow.tsx?raw";
import Extra from "./demos/extra";
import extraCode from "./demos/extra.tsx?raw";
import Ghost from "./demos/ghost";
import ghostCode from "./demos/ghost.tsx?raw";
import Collapsible from "./demos/collapsible";
import collapsibleCode from "./demos/collapsible.tsx?raw";
import CustomIconPosition from "./demos/custom-icon-position";
import customIconPositionCode from "./demos/custom-icon-position.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="collapse"
      imports={["Collapse", "CollapsePanel"]}
      whenToUse={tr(
        <>
          <p>
            Collapse ใช้จัดกลุ่มหรือซ่อนส่วนที่ซับซ้อน เพื่อให้หน้ากระชับและอ่านง่าย
          </p>
          <ul>
            <li>ใช้จัดกลุ่มหรือซ่อนส่วนที่ซับซ้อนเพื่อให้หน้าสะอาดตา</li>
            <li>โหมด Accordion เปิดได้ครั้งละหนึ่ง panel</li>
            <li>เหมาะกับ FAQ, checklist หลายขั้น หรือ settings panel ที่มีข้อมูลหนาแน่น</li>
          </ul>
        </>,
        <>
          <p>
            Collapse can be used to group or hide complex regions to keep the page clean and concise.
          </p>
          <ul>
            <li>Can be used to group or hide complex regions to keep the page clean.</li>
            <li>Accordion mode allows only one panel to be expanded at a time.</li>
            <li>Frequently used in FAQs, multi-step checklists, or dense settings panels.</li>
          </ul>
        </>,
      )}
      demos={[
        { title: tr("พื้นฐาน", "Collapse"), description: tr("ค่าเริ่มต้นเปิดหลาย panel พร้อมกันได้", "By default, any number of panels can be expanded simultaneously."), code: basicCode, component: <Basic /> },
        { title: tr("ขนาด", "Size"), description: tr(<>Collapse รองรับ 3 ขนาด: <code>size="sm" | "md" | "lg"</code></>, <>Collapse supports three sizes: <code>size="sm" | "md" | "lg"</code>.</>), code: sizeCode, component: <Size /> },
        { title: tr("Accordion", "Accordion"), description: tr(<>เมื่อเปิดโหมด Accordion ผ่าน <code>accordion</code> จะเปิดได้ครั้งละหนึ่ง panel</>, <>In accordion mode via <code>accordion</code>, only one panel can be expanded at a time.</>), code: accordionCode, component: <Accordion /> },
        { title: tr("Panel ซ้อน", "Nested panel"), description: tr("วาง Collapse panel ซ้อนกันได้", "Collapse panels can be nested inside one another."), code: nestedCode, component: <Nested /> },
        { title: tr("ไม่มีเส้นขอบ", "Borderless"), description: tr(<>ใช้ <code>bordered={false}</code> เพื่อแสดง Collapse แบบไม่มีเส้นขอบ</>, <>A borderless style of Collapse via <code>bordered={false}</code>.</>), code: borderlessCode, component: <Borderless /> },
        { title: tr("ปรับแต่ง Panel", "Custom Panel"), description: tr(<>ปรับไอคอนขยายด้วย <code>expandIcon</code></>, <>Customize the expand icon with <code>expandIcon</code>.</>), code: customPanelCode, component: <CustomPanel /> },
        { title: tr("ซ่อนลูกศร", "No arrow"), description: tr(<>ซ่อนไอคอนขยายของแต่ละ panel ด้วย <code>showArrow: false</code></>, <>Hide the expand icon on individual panels by setting <code>showArrow: false</code>.</>), code: noArrowCode, component: <NoArrow /> },
        { title: tr("Element เสริม", "Extra node"), description: tr(<>เพิ่ม element ที่ส่วนหัวของ panel ด้วย <code>extra</code></>, <>Add an extra element to the panel header using <code>extra</code>.</>), code: extraCode, component: <Extra /> },
        { title: tr("Collapse แบบ ghost", "Ghost Collapse"), description: tr(<>ใช้ <code>ghost</code> เพื่อทำพื้นหลัง Collapse ให้โปร่งใสและไม่มีเส้นขอบ</>, <>Make the collapse background transparent and borderless via <code>ghost</code>.</>), code: ghostCode, component: <Ghost /> },
        { title: tr("กำหนดพื้นที่กด", "Collapsible"), description: tr(<>กำหนดพื้นที่กดเพื่อขยายหรือยุบด้วย <code>collapsible="header" | "icon" | "disabled"</code></>, <>Specify the trigger area for expanding/collapsing via <code>collapsible="header" | "icon" | "disabled"</code>.</>), code: collapsibleCode, component: <Collapsible /> },
        { title: tr("ตำแหน่งไอคอนขยาย", "Custom expand icon position"), description: tr(<>กำหนด <code>expandIconPosition="end"</code> เพื่อวางลูกศรไว้ด้านขวา</>, <>Set <code>expandIconPosition="end"</code> to position the arrow on the right side.</>), code: customIconPositionCode, component: <CustomIconPosition /> },
      ]}
      api={[
        {
          title: "Collapse",
          description: "Collapse container component.",
          rows: [
            { property: "accordion", description: "If true, Collapse renders as Accordion (only one open panel at a time)", type: "boolean", default: "false" },
            { property: "activeKey", description: "Key of the active panel(s)", type: "string[] | string", default: "-" },
            { property: "bordered", description: "Toggles rendering of the border by the base component", type: "boolean", default: "true" },
            { property: "collapsible", description: "Specify whether the panel is collapsible and the trigger area", type: "header | icon | disabled", default: "header" },
            { property: "defaultActiveKey", description: "Key of the initial active panel(s)", type: "string[] | string", default: "-" },
            { property: "destroyOnHidden", description: "Destroy DOM structure of hidden panel", type: "boolean", default: "false" },
            { property: "expandIcon", description: "Custom expand icon render function", type: "(panelProps) => ReactNode", default: "-" },
            { property: "expandIconPosition", description: "Set expand icon position", type: "start | end", default: "start" },
            { property: "ghost", description: "Make the collapse borderless and its background transparent", type: "boolean", default: "false" },
            { property: "items", description: "Collapse items configuration", type: "CollapseItem[]", default: "[]" },
            { property: "size", description: "Size of the collapse container", type: "sm | md | lg | small | middle | large", default: "md" },
            { property: "onChange", description: "Callback function triggered when active panel is changed", type: "(key: string[] | string) => void", default: "-" },
          ],
        },
        {
          title: "CollapseItem",
          description: "Configuration object for each panel in `items`.",
          rows: [
            { property: "children", description: "Panel content", type: "ReactNode", default: "-" },
            { property: "className", description: "Custom class name for panel container", type: "string", default: "-" },
            { property: "collapsible", description: "Specify whether the panel is collapsible and trigger area", type: "header | icon | disabled", default: "-" },
            { property: "destroyOnHidden", description: "Destroy DOM structure of hidden panel", type: "boolean", default: "false" },
            { property: "extra", description: "Extra element in the header", type: "ReactNode", default: "-" },
            { property: "forceRender", description: "Forced render of content even when collapsed", type: "boolean", default: "false" },
            { property: "headerClass", description: "Custom class name for panel header", type: "string", default: "-" },
            { property: "key", description: "Unique key for the panel", type: "string | number", default: "-" },
            { property: "label", description: "The title of the panel", type: "ReactNode", default: "-" },
            { property: "showArrow", description: "Whether to display the arrow icon", type: "boolean", default: "true" },
          ],
        },
      ]}
      related={[
        { title: "Card", path: "/components/card" },
        { title: "Tabs", path: "/components/tabs" },
      ]}
    />
  );
}
