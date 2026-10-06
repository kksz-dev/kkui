import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Simple from "./demos/simple";
import simpleCode from "./demos/simple.tsx?raw";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import LoadMore from "./demos/load-more";
import loadMoreCode from "./demos/load-more.tsx?raw";
import Vertical from "./demos/vertical";
import verticalCode from "./demos/vertical.tsx?raw";
import Grid from "./demos/grid";
import gridCode from "./demos/grid.tsx?raw";
import ResponsiveGrid from "./demos/responsive-grid";
import responsiveGridCode from "./demos/responsive-grid.tsx?raw";
import InfiniteScroll from "./demos/infinite-scroll";
import infiniteScrollCode from "./demos/infinite-scroll.tsx?raw";
import PaginationDemo from "./demos/pagination";
import paginationDemoCode from "./demos/pagination.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="list"
      imports={["List", "ListItem", "ListItemMeta"]}
      whenToUse={tr(
        <ul>
          <li>ใช้ List เพื่อแสดงเนื้อหาหลายรายการที่เกี่ยวข้องกับเรื่องเดียวกัน โดยแต่ละรายการอาจมีองค์ประกอบต่างชนิดและขนาดกัน</li>
          <li>ช่วยจัดข้อมูลเป็นชุดที่มีโครงสร้างและกวาดตาอ่านง่าย พร้อม action, pagination, header, footer และ grid ได้ตามต้องการ</li>
        </ul>,
        <ul>
          <li>A list can be used to display content related to a single subject. The content can consist of multiple elements of varying type and size.</li>
          <li>It helps to organize information into structured, scannable blocks with optional actions, pagination, headers, footers, and grids.</li>
        </ul>,
      )}
      demos={[
        { title: tr("รายการแบบเรียบง่าย", "Simple List"), description: tr("รายการแบบง่ายของ KKUI พร้อมขนาดหลายแบบ ขอบ และ header/footer", "KKUI simple list with different sizes, bordered, and header/footer."), code: simpleCode, component: <Simple /> },
        { title: tr("รายการพื้นฐาน", "Basic List"), description: tr("รายการพื้นฐานที่มี avatar, หัวเรื่อง, คำอธิบาย และปุ่ม action", "Basic list with avatar, title, description, and action buttons."), code: basicCode, component: <Basic /> },
        { title: tr("โหลดเพิ่ม", "Load More"), description: tr("โหลดรายการเพิ่มด้วยปุ่ม load more", "Load more list items with a load more button."), code: loadMoreCode, component: <LoadMore /> },
        { title: tr("เลย์เอาต์แนวตั้ง", "Vertical"), full: true, description: tr("จัดรายการในแนวตั้ง พร้อมภาพปกเสริมและ action ที่ใช้ไอคอน", "Vertical item layout with extra cover image and rich action items with icons."), code: verticalCode, component: <Vertical /> },
        { title: tr("กริด", "Grid"), full: true, description: tr("แสดงรายการเป็นกริดการ์ดหลายคอลัมน์", "Display list items as a multi-column card grid."), code: gridCode, component: <Grid /> },
        { title: tr("กริดแบบ responsive", "Responsive Grid"), full: true, description: tr("กริดการ์ด responsive ที่ปรับตาม breakpoint ของ viewport", "Responsive card grid matching viewport breakpoints."), code: responsiveGridCode, component: <ResponsiveGrid /> },
        { title: tr("โหลดเมื่อเลื่อน", "Scrolling Loaded"), description: tr("โหลดรายการเพิ่มอัตโนมัติเมื่อผู้ใช้เลื่อนลง", "Load more items automatically as the user scrolls down."), code: infiniteScrollCode, component: <InfiniteScroll /> },
        { title: tr("แบ่งหน้า", "Pagination"), full: true, description: tr("ตั้งค่า pagination พร้อมกำหนดตำแหน่งและการจัดแนวได้", "Pagination settings with customizable position and alignment."), code: paginationDemoCode, component: <PaginationDemo /> },
      ]}
      api={[
        {
          title: "List",
          rows: [
            { property: "bordered", description: "Toggles rendering of the border around the list", type: "boolean", default: "false" },
            { property: "dataSource", description: "DataSource array for list", type: "any[]", default: "[]" },
            { property: "footer", description: "List footer renderer", type: "ReactNode", default: "-" },
            { property: "grid", description: "The grid-ish layout of list", type: "ListGridType", default: "-" },
            { property: "header", description: "List header renderer", type: "ReactNode", default: "-" },
            { property: "itemLayout", description: "The layout of list, default is horizontal", type: "'horizontal' | 'vertical'", default: "'horizontal'" },
            { property: "loading", description: "Shows a loading indicator while the contents of the list are being fetched", type: "boolean | object", default: "false" },
            { property: "loadMore", description: "Shows a load more content", type: "ReactNode", default: "-" },
            { property: "pagination", description: "Pagination config or boolean", type: "boolean | object", default: "false" },
            { property: "renderItem", description: "Customize list item", type: "(item, index) => ReactNode", default: "-" },
            { property: "size", description: "Size of list", type: "'small' | 'default' | 'large'", default: "'default'" },
            { property: "split", description: "Toggles rendering of the split under the list item", type: "boolean", default: "true" },
          ],
        },
        {
          title: "List.Item",
          rows: [
            { property: "actions", description: "The actions of list item", type: "ReactNode[]", default: "-" },
            { property: "extra", description: "The extra content of list item, rendered on the right in vertical layout", type: "ReactNode", default: "-" },
          ],
        },
        {
          title: "List.Item.Meta",
          rows: [
            { property: "avatar", description: "The avatar of list item", type: "ReactNode", default: "-" },
            { property: "description", description: "The description of list item", type: "ReactNode", default: "-" },
            { property: "title", description: "The title of list item", type: "ReactNode", default: "-" },
          ],
        },
      ]}
    />
  );
}
