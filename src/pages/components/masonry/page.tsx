import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import ResponsiveDemo from "./demos/responsive";
import responsiveCode from "./demos/responsive.tsx?raw";
import SequentialDemo from "./demos/sequential";
import sequentialCode from "./demos/sequential.tsx?raw";
import DynamicDemo from "./demos/dynamic";
import dynamicCode from "./demos/dynamic.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="masonry"
      imports={['Masonry', 'type MasonryProps', 'type MasonryBreakpoints']}
      whenToUse={tr(
        <p>ใช้เรียงการ์ดที่ความสูงไม่เท่ากันเป็นกริดน้ำตกแบบ Pinterest</p>,
        <p>Use when displaying cards of varying dynamic heights in a Pinterest-style waterfall grid.</p>,
      )}
      demos={[
        {
          title: tr("พื้นฐาน", "Basic"),
          description: tr("กำหนดจำนวนคอลัมน์คงที่ การ์ดแต่ละใบลงคอลัมน์ที่เตี้ยที่สุดในขณะนั้น", "A fixed column count; each card lands in the column that is currently shortest."),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("ความสูงเปลี่ยนตามเนื้อหา", "Dynamic Content"),
          description: tr("กด Show more ให้การ์ดขยาย คอลัมน์จะเกลี่ยใหม่เองทันที เพราะวัดความสูงจริงของทุกชิ้นด้วย ResizeObserver", "Click Show more to expand a card; the columns re-balance on their own because every item is measured with a ResizeObserver."),
          code: dynamicCode,
          component: <DynamicDemo />,
        },
        {
          title: tr("เรียงตามลำดับต้นฉบับ", "Sequential Order"),
          description: tr("ไล่คอลัมน์ตามลำดับเดิม แทนการเกลี่ยความสูง", "Keep the source order column by column instead of balancing heights."),
          code: sequentialCode,
          component: <SequentialDemo />,
        },
        {
          title: tr("คอลัมน์ตามความกว้างคอนเทนเนอร์", "Container-driven Columns"),
          description: tr("จำนวนคอลัมน์ยึดความกว้างคอนเทนเนอร์ (ไม่ใช่หน้าต่าง) ตามจุดตัด sm / md / lg / xl ลองย่อ-ขยายหน้าต่างดู", "Column count follows the container width (not the window) through the sm / md / lg / xl breakpoints. Resize the window to see it re-flow."),
          code: responsiveCode,
          component: <ResponsiveDemo />,
          size: "full",
        },
      ]}
      api={[
        {
          title: "Masonry",
          rows: [
            { property: "columns", description: tr("จำนวนคอลัมน์คงที่ หรือจำนวนต่อจุดตัดความกว้างของคอนเทนเนอร์", "Fixed column count, or a count per container-width breakpoint"), type: "number | MasonryBreakpoints", default: "{ sm: 1, md: 2, lg: 3, xl: 4 }" },
            { property: "gap", description: tr("ระยะห่างระหว่างการ์ดทั้งสองแกน (px)", "Gutter between cards on both axes (px)"), type: "number", default: "16" },
            { property: "sequential", description: tr("ไล่คอลัมน์ตามลำดับต้นฉบับ แทนการลงคอลัมน์ที่เตี้ยที่สุด", "Fill columns in source order instead of the shortest column"), type: "boolean", default: "false" },
            { property: "className", description: tr("คลาสเพิ่มเติมของ root", "Extra classes on the root element"), type: "string", default: "-" },
            { property: "children", description: tr("การ์ดที่จะจัดเรียง (แต่ละ child คือหนึ่งชิ้น)", "Cards to lay out (each child is one item)"), type: "ReactNode", default: "-" },
          ],
        },
        {
          title: "MasonryBreakpoints",
          description: tr("วัดจากความกว้างของคอนเทนเนอร์ ไม่ใช่หน้าต่าง ใช้ค่าของจุดตัดที่ใหญ่ที่สุดที่ถึง; จุดตัดที่ไม่กำหนดจะตกไปใช้ค่าที่เล็กกว่า", "Measured against the container width, not the window. The largest breakpoint reached wins; unset breakpoints fall through to the smaller one."),
          rows: [
            { property: "sm", description: tr("จำนวนคอลัมน์เมื่อกว้าง ≥ 0px", "Columns when the container is ≥ 0px wide"), type: "number", default: "-" },
            { property: "md", description: tr("จำนวนคอลัมน์เมื่อกว้าง ≥ 768px", "Columns when the container is ≥ 768px wide"), type: "number", default: "-" },
            { property: "lg", description: tr("จำนวนคอลัมน์เมื่อกว้าง ≥ 1024px", "Columns when the container is ≥ 1024px wide"), type: "number", default: "-" },
            { property: "xl", description: tr("จำนวนคอลัมน์เมื่อกว้าง ≥ 1280px", "Columns when the container is ≥ 1280px wide"), type: "number", default: "-" },
          ],
        },
      ]}
      related={[{ title: "Grid", path: "/components/grid" }, { title: "Card", path: "/components/card" }]}
    />
  );
}
