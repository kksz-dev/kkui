import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Horizontal from "./demos/horizontal";
import horizontalCode from "./demos/horizontal.tsx?raw";
import Inline from "./demos/inline";
import inlineCode from "./demos/inline.tsx?raw";
import InlineCollapsed from "./demos/inline-collapsed";
import inlineCollapsedCode from "./demos/inline-collapsed.tsx?raw";
import SiderCurrent from "./demos/sider-current";
import siderCurrentCode from "./demos/sider-current.tsx?raw";
import Vertical from "./demos/vertical";
import verticalCode from "./demos/vertical.tsx?raw";
import Theme from "./demos/theme";
import themeCode from "./demos/theme.tsx?raw";
import SwitchMode from "./demos/switch-mode";
import switchModeCode from "./demos/switch-mode.tsx?raw";
import SubmenuTheme from "./demos/submenu-theme";
import submenuThemeCode from "./demos/submenu-theme.tsx?raw";
import DangerDisabled from "./demos/danger-disabled";
import dangerDisabledCode from "./demos/danger-disabled.tsx?raw";
import Extra from "./demos/extra";
import extraCode from "./demos/extra.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="menu"
      imports={["Menu"]}
      whenToUse={tr(
        <>
          <p>การนำทางเป็นส่วนสำคัญของทุกเว็บไซต์ เมนูที่ออกแบบดีช่วยให้ผู้ใช้รู้ว่าตัวเองอยู่ตรงไหนและไปถึงเนื้อหาได้เร็ว</p>
          <ul>
            <li>เมนูด้านบน: <code>mode="horizontal"</code> รายการที่ล้นจะยุบรวมเป็น submenu "…"</li>
            <li>เมนูด้านข้าง: <code>mode="inline"</code> กาง submenu ในที่เดิม ส่วน <code>mode="vertical"</code> เปิดเป็น popup</li>
            <li>ย่อ sidebar ด้วย <code>inlineCollapsed</code>: เหลือเฉพาะไอคอน submenu กลายเป็น popup และ label แสดงเป็น tooltip</li>
          </ul>
          <p className="mt-2">ทุกอย่างกำหนดจากข้อมูลใน <code>items</code>: รายการธรรมดา, submenu (<code>children</code>), กลุ่ม และเส้นคั่น</p>
        </>,
        <>
          <p>Navigation is an important part of any website; a good navigation design keeps users oriented and lets them reach content quickly.</p>
          <ul>
            <li>Top navigation: <code>mode="horizontal"</code>; overflowed items fold into a "…" submenu.</li>
            <li>Side navigation: <code>mode="inline"</code> expands submenus in place; <code>mode="vertical"</code> opens them as popups.</li>
            <li>Collapse a sidebar with <code>inlineCollapsed</code>: icons only, submenus turn into popups, labels become tooltips.</li>
          </ul>
          <p className="mt-2">Everything is data driven through <code>items</code>: plain items, submenus (<code>children</code>), groups and dividers.</p>
        </>,
      )}
      demos={[
        { title: tr("เมนูด้านบน", "Top Navigation"), description: tr("เมนูนำทางแนวนอนด้านบน ลองย่อความกว้างหน้าต่างเพื่อดูรายการที่ล้นยุบเข้า “…”", "Horizontal top navigation menu. Shrink the window to see overflowed items collapse into “…”."), code: horizontalCode, component: <Horizontal />, full: true },
        { title: tr("เมนูแบบ inline", "Inline menu"), description: tr("เมนูแนวตั้งที่กาง submenu อยู่ในตัวเมนู", "Vertical menu with inline submenus."), code: inlineCode, component: <Inline /> },
        { title: tr("เมนู inline แบบย่อ", "Collapsed inline menu"), description: tr(<>ย่อเมนู inline ด้วย <code>inlineCollapsed</code>: submenu กลายเป็น popup และ label แสดงเป็น tooltip</>, <>Inline menu could be collapsed with <code>inlineCollapsed</code>: submenus become popups and labels are shown as tooltips.</>), code: inlineCollapsedCode, component: <InlineCollapsed /> },
        { title: tr("เปิด submenu ทีละอัน", "Open current submenu only"), description: tr(<>ควบคุม <code>openKeys</code> เพื่อให้เปิด submenu ได้ครั้งละอันเดียว</>, <>Control <code>openKeys</code> so that only one submenu is open at a time.</>), code: siderCurrentCode, component: <SiderCurrent /> },
        { title: tr("เมนูแนวตั้ง", "Vertical menu"), description: tr("submenu เปิดเป็น popup เมื่อ hover", "Submenus open as popups on hover."), code: verticalCode, component: <Vertical /> },
        { title: tr("ธีมของเมนู", "Menu Themes"), description: tr(<>มีธีมมาให้สองแบบ: <code>light</code> และ <code>dark</code></>, <>There are two built-in themes: <code>light</code> and <code>dark</code>.</>), code: themeCode, component: <Theme /> },
        { title: tr("สลับชนิดเมนู", "Switch the menu type"), description: tr("สลับ mode ระหว่าง inline กับ vertical และสลับธีมแบบสด ๆ", "Show the dynamic switching mode (between inline and vertical) and theme."), code: switchModeCode, component: <SwitchMode /> },
        { title: tr("ธีมของ submenu", "Sub-menu theme"), description: tr(<>ตั้ง <code>theme</code> ที่ submenu เพื่อให้ popup ใช้ธีมแยกจากเมนูหลัก</>, <>Set a <code>theme</code> on a submenu item to style its popup independently.</>), code: submenuThemeCode, component: <SubmenuTheme /> },
        { title: tr("อันตรายและปิดใช้งาน", "Danger & disabled"), description: tr(<>รายการและ submenu ที่ใส่ <code>danger</code> และ <code>disabled</code></>, <><code>danger</code> and <code>disabled</code> items and submenus.</>), code: dangerDisabledCode, component: <DangerDisabled /> },
        { title: tr("โหนดเสริมท้ายรายการ", "Extra node"), description: tr(<>ใช้ <code>extra</code> แสดง shortcut หรือ badge ไว้ท้ายรายการ</>, <>Use <code>extra</code> to render a shortcut hint or badge at the end of an item.</>), code: extraCode, component: <Extra /> },
      ]}
      api={[
        {
          title: "Menu",
          description: "Extends React.ComponentProps<\"ul\"> (except onClick / onSelect).",
          rows: [
            { property: "items", description: "Menu item content", type: "ItemType[]", default: "-" },
            { property: "mode", description: "Type of menu", type: "vertical | horizontal | inline", default: "vertical" },
            { property: "theme", description: "Color theme of the menu", type: "light | dark", default: "light" },
            { property: "selectedKeys", description: "Array with the keys of currently selected menu items", type: "string[]", default: "-" },
            { property: "defaultSelectedKeys", description: "Array with the keys of default selected menu items", type: "string[]", default: "[]" },
            { property: "openKeys", description: "Array with the keys of currently opened sub-menus", type: "string[]", default: "-" },
            { property: "defaultOpenKeys", description: "Array with the keys of default opened sub-menus", type: "string[]", default: "[]" },
            { property: "onClick", description: "Called when a menu item is clicked", type: "({ key, keyPath, domEvent }) => void", default: "-" },
            { property: "onSelect", description: "Called when a menu item is selected", type: "({ key, keyPath, selectedKeys, domEvent }) => void", default: "-" },
            { property: "onDeselect", description: "Called when a menu item is deselected (multiple mode only)", type: "({ key, keyPath, selectedKeys, domEvent }) => void", default: "-" },
            { property: "onOpenChange", description: "Called when sub-menus are opened or closed", type: "(openKeys: string[]) => void", default: "-" },
            { property: "inlineCollapsed", description: "Specifies the collapsed status when menu is inline mode (width 80px)", type: "boolean", default: "false" },
            { property: "inlineIndent", description: "Indent (in pixels) of inline menu items on each level", type: "number", default: "24" },
            { property: "multiple", description: "Allows selection of multiple items", type: "boolean", default: "false" },
            { property: "selectable", description: "Allows selecting menu items", type: "boolean", default: "true" },
            { property: "subMenuOpenDelay", description: "Delay time to show submenu when mouse enters, in seconds", type: "number", default: "0.1" },
            { property: "subMenuCloseDelay", description: "Delay time to hide submenu when mouse leaves, in seconds", type: "number", default: "0.1" },
            { property: "triggerSubMenuAction", description: "Which action can trigger submenu open/close", type: "hover | click", default: "hover" },
            { property: "expandIcon", description: "Custom expand icon of submenu", type: "ReactNode | ({ isOpen, isSubMenu, level }) => ReactNode", default: "-" },
            { property: "overflowedIndicator", description: "Customized the ellipsis icon when menu is collapsed horizontally", type: "ReactNode", default: "<Ellipsis />" },
          ],
        },
        {
          title: "ItemType",
          description: "MenuItemType — a plain item.",
          rows: [
            { property: "key", description: "Unique ID of the menu item", type: "string", default: "-" },
            { property: "label", description: "Menu label", type: "ReactNode", default: "-" },
            { property: "icon", description: "The icon of the menu item", type: "ReactNode", default: "-" },
            { property: "extra", description: "Node rendered at the end of the row", type: "ReactNode", default: "-" },
            { property: "danger", description: "Display the danger style", type: "boolean", default: "false" },
            { property: "disabled", description: "Whether menu item is disabled", type: "boolean", default: "false" },
            { property: "title", description: "Set display title for collapsed item (native tooltip); defaults to a string label", type: "string", default: "-" },
            { property: "onClick", description: "Called when this item is clicked", type: "({ key, keyPath, domEvent }) => void", default: "-" },
          ],
        },
        {
          title: "SubMenuType",
          rows: [
            { property: "key", description: "Unique ID of the sub-menu", type: "string", default: "-" },
            { property: "label", description: "Sub-menu title", type: "ReactNode", default: "-" },
            { property: "icon", description: "Icon of sub menu", type: "ReactNode", default: "-" },
            { property: "children", description: "Sub-menus or sub-menu items", type: "ItemType[]", default: "-" },
            { property: "disabled", description: "Whether sub-menu is disabled", type: "boolean", default: "false" },
            { property: "theme", description: "Color theme of the sub-menu popup / inline body", type: "light | dark", default: "-" },
            { property: "popupClassName", description: "Sub-menu class name, used to customize the popup / inline list", type: "string", default: "-" },
            { property: "onTitleClick", description: "Callback executed when the sub-menu title is clicked", type: "({ key, domEvent }) => void", default: "-" },
          ],
        },
        {
          title: "MenuItemGroupType / MenuDividerType",
          rows: [
            { property: "type", description: "Must be `group` or `divider`", type: "'group' | 'divider'", default: "-" },
            { property: "label", description: "The title of the group", type: "ReactNode", default: "-" },
            { property: "children", description: "Sub-menu items of the group", type: "ItemType[]", default: "-" },
            { property: "dashed", description: "Whether the divider line is dashed", type: "boolean", default: "false" },
          ],
        },
      ]}
      extra={tr(
        <>
          <h2>คีย์บอร์ด</h2>
          <p>ปุ่มลูกศรเลื่อนระหว่างรายการที่มองเห็น (ซ้าย / ขวา เมื่อเป็นเมนูแนวนอน), Home / End กระโดดไปหัวท้าย, Enter หรือ Space สั่งทำงาน เมื่ออยู่บนหัว submenu ที่เปิด popup อยู่ ลูกศรที่ชี้ไปทาง popup จะย้าย focus เข้าไปข้างใน และ Escape ปิด popup</p>
        </>,
        <>
          <h2>Keyboard</h2>
          <p>Arrow keys move between visible items (Left / Right in horizontal mode), Home / End jump to the ends, Enter or Space activates. On an open popup submenu title, the arrow pointing at the popup moves focus into it; Escape closes it.</p>
        </>,
      )}
      related={[{ title: "Dropdown", path: "/components/dropdown" }, { title: "Layout", path: "/components/layout" }]}
    />
  );
}
