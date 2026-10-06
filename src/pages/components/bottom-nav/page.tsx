import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import IconOnly from "./demos/icon-only";
import iconOnlyCode from "./demos/icon-only.tsx?raw";
import Disabled from "./demos/disabled";
import disabledCode from "./demos/disabled.tsx?raw";
import Links from "./demos/links";
import linksCode from "./demos/links.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="bottom-nav"
      imports={["BottomNav", "BottomNavSpacer", "type BottomNavItem", "type BottomNavProps"]}
      whenToUse={tr(
        <p>ใช้บนมือถือเมื่อมีปลายทางหลัก 3–5 อัน ที่ต้องสลับไปมาบ่อย</p>,
        <p>Use on mobile when three to five destinations are switched between often.</p>,
      )}
      demos={[
        {
          title: tr("แถบล่างพื้นฐาน", "Basic bottom navigation"),
          description: tr("ไอคอนพร้อมป้ายแจ้งเตือน และไอคอนที่ถูกเลือกจะเด้งขึ้นเล็กน้อย", "Icons with badges; the active icon lifts on a spring."),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("ไอคอนอย่างเดียว", "Icon only"),
          description: tr(
            <><code>iconOnly</code> ซ่อนป้ายข้อความแต่ยังคงไว้ให้ screen reader และ <code>activeIcon</code> สลับไอคอนขณะถูกเลือก</>,
            <><code>iconOnly</code> hides the labels but keeps them for screen readers; <code>activeIcon</code> swaps the glyph while active.</>,
          ),
          code: iconOnlyCode,
          component: <IconOnly />,
        },
        {
          title: tr("ปิดใช้งานและไม่ควบคุมค่า", "Disabled and uncontrolled"),
          description: tr(
            <><code>defaultActiveKey</code> ให้คอมโพเนนต์เก็บค่าที่เลือกเอง รายการที่ <code>disabled</code> เลือกและโฟกัสไม่ได้</>,
            <><code>defaultActiveKey</code> lets the component own the selection; a <code>disabled</code> item cannot be selected or focused.</>,
          ),
          code: disabledCode,
          component: <Disabled />,
        },
        {
          title: tr("ลิงก์ของ router", "Router links"),
          description: tr(
            <>ใส่ <code>href</code> แล้วใช้ <code>linkRender</code> ห่อเนื้อหาด้วย Link ของ router คอมโพเนนต์จะใส่ class, aria และ onClick ให้เอง ถ้าไม่มี <code>linkRender</code> จะเรนเดอร์เป็น <code>&lt;a href&gt;</code> ธรรมดา</>,
            <>Give items an <code>href</code> and wrap the content with your router's Link via <code>linkRender</code>; classes, aria attributes and onClick are attached for you. Without <code>linkRender</code> a plain <code>&lt;a href&gt;</code> is rendered.</>,
          ),
          code: linksCode,
          component: <Links />,
        },
      ]}
      api={[
        {
          title: "BottomNav",
          rows: [
            { property: "items", description: tr("ปลายทางทั้งหมด", "Destinations"), type: "BottomNavItem[]", default: "[]" },
            { property: "activeKey / defaultActiveKey", description: tr("ปลายทางที่เลือก (ควบคุม / ค่าเริ่มต้น)", "Selected destination (controlled / initial)"), type: "string", default: tr("รายการแรกที่ไม่ disabled", "first enabled item") },
            { property: "onChange", description: tr("เรียกเมื่อเลือกปลายทาง", "A destination was chosen"), type: "(key, item) => void", default: "-" },
            { property: "fixed", description: tr("ตรึงไว้ล่างจอ ใช้คู่กับ BottomNavSpacer เพื่อกันพื้นที่ของหน้า", "Pin to the viewport; pair with BottomNavSpacer to reserve page space"), type: "boolean", default: "true" },
            { property: "safeArea", description: tr("เผื่อพื้นที่ home indicator ของ iOS", "Pad for the iOS home indicator"), type: "boolean", default: "true" },
            { property: "iconOnly", description: tr("ซ่อนป้ายข้อความ", "Hide the labels"), type: "boolean", default: "false" },
            { property: "linkRender", description: tr("เรนเดอร์รายการที่มี href ด้วยลิงก์ของ router โดยห่อเนื้อหาที่ไม่มี interaction", "Render each enabled href item as a router link around non-interactive content"), type: "(item, content) => ReactNode", default: "-" },
            { property: "aria-label", description: tr("ชื่อของแถบสำหรับ screen reader", "Accessible name of the bar"), type: "string", default: "Bottom navigation" },
          ],
        },
        {
          title: "BottomNavItem",
          rows: [
            { property: "key", description: tr("คีย์เฉพาะของรายการ", "Unique item key"), type: "string", default: "-" },
            { property: "label", description: tr("ป้ายข้อความ; ในโหมด iconOnly จะแสดงเฉพาะ screen reader", "Visible label; rendered screen-reader-only in iconOnly mode"), type: "ReactNode", default: "-" },
            { property: "icon", description: tr("ไอคอนปกติ", "Default icon"), type: "ReactNode", default: "-" },
            { property: "activeIcon", description: tr("ไอคอนขณะถูกเลือก", "Icon used while active"), type: "ReactNode", default: "-" },
            { property: "badge", description: tr("ป้ายแจ้งเตือน", "Visual badge"), type: "ReactNode", default: "-" },
            { property: "badgeLabel", description: tr("คำอธิบายป้ายสำหรับ screen reader", "Accessible badge description"), type: "string", default: "{badge} notifications" },
            { property: "ariaLabel", description: tr("ชื่อสำหรับ screen reader เมื่อไม่มี label", "Accessible name when label is omitted"), type: "string", default: "key" },
            { property: "href", description: tr("ปลายทางลิงก์; ส่งให้ linkRender หรือเป็น <a href> เมื่อไม่มี linkRender", "Link destination; passed to linkRender, or a native <a href> when linkRender is absent"), type: "string", default: "-" },
            { property: "disabled", description: tr("ปิดการเลือกและการนำทาง", "Disable selection and navigation"), type: "boolean", default: "false" },
          ],
        },
        {
          title: "BottomNavSpacer",
          rows: [
            { property: "safeArea", description: tr("กันพื้นที่ home indicator ของ iOS", "Reserve room for the iOS home indicator"), type: "boolean", default: "true" },
          ],
        },
      ]}
      related={[
        { path: "/components/app-bar", title: "AppBar" },
        { path: "/components/app-sidebar", title: "AppSidebar" },
        { path: "/components/tabs", title: "Tabs" },
      ]}
    />
  );
}
