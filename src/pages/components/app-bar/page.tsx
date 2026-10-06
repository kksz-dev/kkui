import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import MobileMenuDemo from "./demos/mobile-menu";
import mobileMenuCode from "./demos/mobile-menu.tsx?raw";
import LinksDemo from "./demos/links";
import linksCode from "./demos/links.tsx?raw";
import TransparentDemo from "./demos/transparent";
import transparentCode from "./demos/transparent.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="app-bar"
      imports={["AppBar", "type AppBarItem", "type AppBarProps"]}
      whenToUse={tr(
        <p>ใช้เป็นแถบบนสุดของแอป — โลโก้ เมนูหลัก ปุ่มลัด และปุ่มเปิดเมนูเมื่ออยู่บนจอเล็ก</p>,
        <p>Use as the top bar of an application: brand, primary navigation, actions, and a menu button on small screens.</p>,
      )}
      demos={[
        {
          title: tr("แถบแอปพื้นฐาน", "Basic AppBar"),
          description: tr("โลโก้ เมนู และปุ่มด้านขวา", "Brand, navigation and an action slot."),
          code: basicCode,
          component: <Basic />,
          size: "full",
        },
        {
          title: tr("ปุ่มแฮมเบอร์เกอร์และเมนูมือถือ", "Hamburger and mobile menu"),
          description: tr(
            <>
              ส่ง <code>onMenuClick</code> เพื่อแสดงปุ่มแฮมเบอร์เกอร์ แล้วใช้ <code>renderMobileMenu</code> วาดเมนูของคุณเองด้วยรายการและ
              logic การเลือกชุดเดียวกัน (แบบไม่ควบคุม ผ่าน <code>defaultActiveKey</code>)
            </>,
            <>
              Pass <code>onMenuClick</code> to show the hamburger and use <code>renderMobileMenu</code> to draw your own menu with the same items and
              selection logic (uncontrolled via <code>defaultActiveKey</code>).
            </>,
          ),
          code: mobileMenuCode,
          component: <MobileMenuDemo />,
          size: "full",
        },
        {
          title: tr("ลิงก์ของเราเตอร์", "Router links"),
          description: tr(
            <>
              ใช้ <code>linkRender</code> ครอบเนื้อหาของรายการที่มี <code>href</code> ด้วยลิงก์ของเราเตอร์ แถบยังจัดการ active และ{" "}
              <code>aria-current</code> ให้
            </>,
            <>
              Use <code>linkRender</code> to wrap items that have an <code>href</code> in your router link; the bar still manages the active state and{" "}
              <code>aria-current</code>.
            </>,
          ),
          code: linksCode,
          component: <LinksDemo />,
          size: "full",
        },
        {
          title: tr("โปร่งใสจนกว่าจะเลื่อน", "Transparent until scrolled"),
          description: tr("เริ่มโปร่งใสบนภาพปก แล้วค่อยทึบเมื่อเลื่อนลง", "Starts transparent over a hero, then fills in on scroll."),
          code: transparentCode,
          component: <TransparentDemo />,
          size: "full",
        },
      ]}
      api={[
        {
          title: "AppBar",
          rows: [
            { property: "logo / title", description: tr("ช่องแบรนด์", "Brand slot"), type: "ReactNode", default: "-" },
            { property: "items", description: tr("เมนูหลัก แสดงตั้งแต่ breakpoint md ขึ้นไป", "Primary navigation, visible from the md breakpoint"), type: "AppBarItem[]", default: "[]" },
            { property: "activeKey / defaultActiveKey", description: tr("รายการที่เลือก (ควบคุม / ค่าเริ่มต้น)", "Selected item (controlled / initial)"), type: "string", default: "-" },
            { property: "onSelect", description: tr("เรียกเมื่อเลือกรายการ", "An item was chosen"), type: "(key, item) => void", default: "-" },
            { property: "actions", description: tr("ช่องด้านขวา", "Right-hand slot"), type: "ReactNode", default: "-" },
            { property: "onMenuClick", description: tr("แสดงปุ่มแฮมเบอร์เกอร์และรับเหตุการณ์คลิก", "Show a hamburger and handle it"), type: "() => void", default: "-" },
            { property: "menuIcon", description: tr("ไอคอนแทนแฮมเบอร์เกอร์", "Replace the hamburger glyph"), type: "ReactNode", default: "<Menu />" },
            { property: "menuOpen", description: tr("สถานะเปิดที่ปุ่มแฮมเบอร์เกอร์ประกาศ (aria-expanded)", "Open state announced by the hamburger (aria-expanded)"), type: "boolean", default: "-" },
            { property: "menuId", description: tr("id ของเมนูที่ปุ่มแฮมเบอร์เกอร์ควบคุม (aria-controls)", "Id of the menu controlled by the hamburger (aria-controls)"), type: "string", default: "-" },
            { property: "menuLabel", description: tr("ป้ายสำหรับ screen reader ของปุ่มแฮมเบอร์เกอร์", "Accessible hamburger label"), type: "string", default: "Open / Close navigation" },
            { property: "renderMobileMenu", description: tr("วาดเมนูมือถือของคุณเองโดยใช้รายการและ logic การเลือกชุดเดียวกัน", "Render a caller-owned mobile menu with shared selection logic"), type: "(items, activeKey, select) => ReactNode", default: "-" },
            { property: "sticky", description: tr("ตรึงไว้บนสุดของคอนเทนเนอร์ที่เลื่อน", "Stick to the top of the scroll container"), type: "boolean", default: "true" },
            { property: "transparent", description: tr("โปร่งใสจนกว่าหน้าจะเลื่อน", "Transparent until the page scrolls"), type: "boolean", default: "false" },
            { property: "scrollTarget", description: tr("แหล่งเลื่อนของแถบโปร่งใส", "Scroll source for a transparent bar"), type: "() => Window | HTMLElement", default: "window" },
            { property: "blur", description: tr("เบลอพื้นหลังเมื่อแถบทึบแล้ว", "Frost the bar once filled"), type: "boolean", default: "true" },
            { property: "bordered", description: tr("แสดงเส้นขอบล่างเมื่อแถบทึบแล้ว", "Show the bottom border once the bar is filled"), type: "boolean", default: "true" },
            { property: "height", description: tr("ความสูงของแถบ (px)", "Bar height in px"), type: "number", default: "56" },
            {
              property: "linkRender",
              description: tr(
                "ครอบเนื้อหารายการที่มี href ด้วยลิงก์ของเราเตอร์ ถ้า handler ของลิงก์เรียก preventDefault จะไม่เลือกรายการนั้น",
                "Wrap items that have an href in a router link; selection is skipped when the link handler calls preventDefault",
              ),
              type: "(item, content) => ReactNode",
              default: "-",
            },
            { property: "className", description: tr("คลาสเพิ่มเติมบนแถบ", "Extra classes on the bar"), type: "string", default: "-" },
          ],
        },
        {
          title: "AppBarItem",
          rows: [
            { property: "key", description: tr("คีย์เฉพาะของรายการ", "Unique item key"), type: "string", default: "-" },
            { property: "label", description: tr("ข้อความของรายการ", "Visible item label"), type: "ReactNode", default: "-" },
            { property: "href", description: tr("ส่งให้ linkRender ใช้ ไม่ได้นำทางเอง", "Passed to linkRender; it does not navigate by itself"), type: "string", default: "-" },
            { property: "icon", description: tr("ไอคอนหน้าข้อความ", "Icon before the label"), type: "ReactNode", default: "-" },
            { property: "disabled", description: tr("ปิดการเลือกและการแสดงผลเป็นลิงก์", "Disable selection and link rendering"), type: "boolean", default: "false" },
          ],
        },
      ]}
      related={[
        { path: "/components/app-sidebar", title: "AppSidebar" },
        { path: "/components/bottom-nav", title: "BottomNav" },
        { path: "/components/page-header", title: "PageHeader" },
      ]}
    />
  );
}
