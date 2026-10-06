import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import WithFooterDemo from "./demos/with-footer";
import withFooterCode from "./demos/with-footer.tsx?raw";
import CardSurface from "./demos/card-surface";
import cardSurfaceCode from "./demos/card-surface.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="page-header"
      imports={["PageHeader", "type PageHeaderProps"]}
      whenToUse={tr(
        <p>ใช้เปิดหัวหน้าเพจ ให้ผู้ใช้รู้ว่าอยู่ที่ไหน ทำอะไรได้บ้าง และย้อนกลับได้จากที่เดียว</p>,
        <p>Use at the top of a page to say where the user is, what they can do here, and how to go back.</p>,
      )}
      demos={[
        {
          title: tr("หัวหน้าเพจพื้นฐาน", "Basic Page Header"),
          description: tr("เส้นทาง ชื่อ แท็ก ปุ่มย้อนกลับ และปุ่มการกระทำ", "Breadcrumb, title, tags, a back arrow and actions."),
          code: basicCode,
          component: <Basic />,
          size: "full",
        },
        {
          title: tr("หัวหน้าเพจแบบพื้นหลังทึบ", "Solid Container Surface"),
          description: tr("ตั้งค่า ghost={false} เพื่อแสดง PageHeader ในกล่องพื้นผิว card พร้อม Avatar", "Use ghost={false} for a solid card-like header container with Avatar and tags."),
          code: cardSurfaceCode,
          component: <CardSurface />,
          size: "full",
        },
        {
          title: tr("มีสถิติและแท็บด้านล่าง", "Stats and Tabs in Footer"),
          description: tr("วางตัวเลขสรุปกับแท็บไว้ในหัวเพจเดียวกัน", "Summary numbers and tabs live in the same header block."),
          code: withFooterCode,
          component: <WithFooterDemo />,
          size: "full",
        },
      ]}
      api={[
        {
          title: "PageHeader",
          rows: [
            { property: "title / subTitle", description: "Heading and secondary line", type: "ReactNode", default: "-" },
            { property: "titleLevel", description: "Semantic heading level for title", type: "1 | 2 | 3 | 4 | 5 | 6", default: "1" },
            { property: "breadcrumb", description: "Rendered above the title", type: "ReactNode", default: "-" },
            { property: "tags", description: "Beside the title", type: "ReactNode", default: "-" },
            { property: "avatar", description: "Left of the title", type: "AvatarProps | ReactNode", default: "-" },
            { property: "extra", description: "Actions on the right", type: "ReactNode", default: "-" },
            { property: "onBack", description: "Show a back arrow and receive its click event", type: "(event: MouseEvent) => void", default: "-" },
            { property: "backHref", description: "Native destination for the back control", type: "string", default: "-" },
            { property: "backRender", description: "Render a router link around the back glyph", type: "(content: ReactNode) => ReactElement", default: "-" },
            { property: "backIcon", description: "Replace the back arrow glyph", type: "ReactNode", default: "<ArrowLeft />" },
            { property: "backAriaLabel", description: "Accessible name for the back control", type: "string", default: "'Back'" },
            { property: "children", description: "Description or stats block under the title row", type: "ReactNode", default: "-" },
            { property: "footer", description: "Full-width slot below the header body, e.g. Tabs", type: "ReactNode", default: "-" },
            { property: "ghost", description: "Transparent instead of a raised surface", type: "boolean", default: "true" },
            { property: "bordered", description: "Bottom divider when ghost; full border on a raised surface", type: "boolean", default: "true" },
          ],
        },
      ]}
      related={[{ path: "/components/breadcrumb", title: "Breadcrumb" }, { path: "/components/app-bar", title: "AppBar" }]}
    />
  );
}
