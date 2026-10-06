import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Border from "./demos/border";
import borderCode from "./demos/border.tsx?raw";
import Size from "./demos/size";
import sizeCode from "./demos/size.tsx?raw";
import Responsive from "./demos/responsive";
import responsiveCode from "./demos/responsive.tsx?raw";
import Vertical from "./demos/vertical";
import verticalCode from "./demos/vertical.tsx?raw";
import VerticalBorder from "./demos/vertical-border";
import verticalBorderCode from "./demos/vertical-border.tsx?raw";
import Complex from "./demos/complex";
import complexCode from "./demos/complex.tsx?raw";
import CustomStyle from "./demos/custom-style";
import customStyleCode from "./demos/custom-style.tsx?raw";
import SpanFilled from "./demos/span-filled";
import spanFilledCode from "./demos/span-filled.tsx?raw";
import ChildrenItems from "./demos/children-items";
import childrenItemsCode from "./demos/children-items.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="descriptions"
      imports={["Descriptions", "DescriptionsItem", "type DescriptionsItemType"]}
      whenToUse={tr(
        <ul>
          <li>แสดงข้อมูลหลายฟิลด์รวมกันเป็นกลุ่มเดียว</li>
          <li>ใช้บ่อยกับหน้ารายละเอียดของอ็อบเจกต์หรือโปรไฟล์ ที่ต้องจัดวางให้อ่านง่ายเป็นระเบียบ</li>
        </ul>,
        <ul>
          <li>Display multiple field information in groups.</li>
          <li>Commonly used to present details of an object or profile in a structured, readable layout.</li>
        </ul>,
      )}
      demos={[
        { title: tr("การใช้งานพื้นฐาน", "Basic"), full: true, description: tr("ใช้ Descriptions แสดงข้อมูลเป็นคู่ label กับค่า", "Basic usage of Descriptions displaying key-value pairs."), code: basicCode, component: <Basic /> },
        { title: tr("เส้นขอบ", "Border"), full: true, description: tr("แบบมีเส้นขอบและพื้นหลังอย่างตาราง", "Descriptions with border and background table style."), code: borderCode, component: <Border /> },
        { title: tr("ขนาด", "Custom Size"), full: true, description: tr("ใช้ bordered ร่วมกับ size (default, middle, small)", "Combine bordered and size options (default, middle, small)."), code: sizeCode, component: <Size /> },
        { title: tr("ปรับตามหน้าจอ", "Responsive"), full: true, description: tr("จำนวนคอลัมน์ปรับตามขนาดหน้าจอ", "Responsive columns fitting different viewport sizes."), code: responsiveCode, component: <Responsive /> },
        { title: tr("แนวตั้ง", "Vertical"), full: true, description: tr("จัดวางแนวตั้ง โดย label อยู่เหนือเนื้อหา", "Vertical layout with labels placed above contents."), code: verticalCode, component: <Vertical /> },
        { title: tr("แนวตั้งมีเส้นขอบ", "Vertical Border"), full: true, description: tr("จัดวางแนวตั้งแบบตารางมีเส้นขอบ", "Vertical layout with bordered table style."), code: verticalBorderCode, component: <VerticalBorder /> },
        { title: tr("เนื้อหาซับซ้อน", "Complex Content"), full: true, description: tr("รายการที่มี tag, badge, ลิงก์ และข้อความยาว", "Rich items with tags, badges, links, and long text."), code: complexCode, component: <Complex /> },
        { title: tr("กำหนดสไตล์เอง", "Custom Style"), full: true, description: tr("กำหนด labelStyle และ contentStyle ของแต่ละเซลล์", "Custom labelStyle and contentStyle for cells."), code: customStyleCode, component: <CustomStyle /> },
        { title: tr("span แบบ filled", "Filled Span"), full: true, description: tr("ใช้ span=\"filled\" เพื่อขยายรายการไปจนสุดแถว", "Use span=\"filled\" to expand an item to the end of the row."), code: spanFilledCode, component: <SpanFilled /> },
        { title: tr("ส่งรายการผ่าน children", "Items via Children"), full: true, description: tr("เขียน DescriptionsItem เป็น children แทนการส่งพร็อพ items", "Composable DescriptionsItem children API."), code: childrenItemsCode, component: <ChildrenItems /> },
      ]}
      api={[
        {
          title: "Descriptions",
          rows: [
            { property: "bordered", description: "Whether to display the border", type: "boolean", default: "false" },
            { property: "column", description: "The number of DescriptionItems in a row, or responsive object", type: "number | object", default: "3" },
            { property: "title", description: "The title of the description list, situated at the top", type: "ReactNode", default: "-" },
            { property: "extra", description: "The action area of the description list, situated at the top right", type: "ReactNode", default: "-" },
            { property: "size", description: "Set the size of the list", type: "'default' | 'middle' | 'small'", default: "'default'" },
            { property: "layout", description: "The layout of the description list", type: "'horizontal' | 'vertical'", default: "'horizontal'" },
            { property: "colon", description: "Change default full-width colon of each item", type: "boolean", default: "true" },
            { property: "items", description: "Descriptions items content", type: "DescriptionsItemType[]", default: "[]" },
            { property: "labelStyle", description: "Customize label style", type: "CSSProperties", default: "-" },
            { property: "contentStyle", description: "Customize content style", type: "CSSProperties", default: "-" },
            { property: "styles", description: "Semantic styles for container, header, title, extra, label, content", type: "object", default: "-" },
            { property: "classNames", description: "Semantic classes for container, header, title, extra, label, content", type: "object", default: "-" },
          ],
        },
        {
          title: "DescriptionsItemType",
          description: "Structure of items in descriptions.",
          rows: [
            { property: "key", description: "Unique key for the item", type: "Key", default: "-" },
            { property: "label", description: "The description of the content", type: "ReactNode", default: "-" },
            { property: "children", description: "The content of the description item", type: "ReactNode", default: "-" },
            { property: "span", description: "The number of columns across, or 'filled' to fill remaining row space", type: "number | 'filled' | object", default: "1" },
            { property: "labelStyle", description: "Customize label style of this cell", type: "CSSProperties", default: "-" },
            { property: "contentStyle", description: "Customize content style of this cell", type: "CSSProperties", default: "-" },
          ],
        },
      ]}
    />
  );
}
