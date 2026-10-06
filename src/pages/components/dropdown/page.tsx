import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Placement from "./demos/placement";
import placementCode from "./demos/placement.tsx?raw";
import Arrow from "./demos/arrow";
import arrowCode from "./demos/arrow.tsx?raw";
import ArrowCenter from "./demos/arrow-center";
import arrowCenterCode from "./demos/arrow-center.tsx?raw";
import Trigger from "./demos/trigger";
import triggerCode from "./demos/trigger.tsx?raw";
import Event from "./demos/event";
import eventCode from "./demos/event.tsx?raw";
import ContextMenu from "./demos/context-menu";
import contextMenuCode from "./demos/context-menu.tsx?raw";
import Cascading from "./demos/cascading";
import cascadingCode from "./demos/cascading.tsx?raw";
import DropdownButtonDemo from "./demos/dropdown-button";
import dropdownButtonCode from "./demos/dropdown-button.tsx?raw";
import CustomPopup from "./demos/custom-popup";
import customPopupCode from "./demos/custom-popup.tsx?raw";
import Selectable from "./demos/selectable";
import selectableCode from "./demos/selectable.tsx?raw";
import Loading from "./demos/loading";
import loadingCode from "./demos/loading.tsx?raw";
import Extra from "./demos/extra";
import extraCode from "./demos/extra.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="dropdown"
      imports={["Dropdown", "DropdownButton"]}
      whenToUse={tr(
        <>
          <p>เมื่อมีตัวเลือกมากเกินกว่าจะวางเรียงไว้ทั้งหมด ให้ยุบไว้ใน Dropdown แล้วเปิดด้วยการ hover คลิก หรือคลิกขวา</p>
          <p className="mt-2">
            เมนูใช้โมเดล <code>items</code> เหมือน Menu รองรับเมนูย่อยหลายชั้น กลุ่ม เส้นคั่น และสถานะการเลือก
            (<code>selectable</code> / <code>multiple</code>)
          </p>
        </>,
        <>
          <p>When there are more than a few options to choose from, wrap them in a Dropdown and open it on hover, click or right click.</p>
          <p className="mt-2">
            The menu uses the same <code>items</code> model as Menu: nested submenus, groups, dividers and selection state
            (<code>selectable</code> / <code>multiple</code>).
          </p>
        </>,
      )}
      demos={[
        {
          title: tr("พื้นฐาน", "Basic"),
          description: tr("เมนูดรอปดาวน์แบบพื้นฐานที่สุด", "The most basic dropdown menu."),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("ตำแหน่ง", "Placement"),
          description: tr(<>รองรับ <code>placement</code> 6 แบบ</>, <>Six <code>placement</code>s are supported.</>),
          code: placementCode,
          component: <Placement />,
        },
        {
          title: tr("ลูกศร", "Arrow"),
          description: tr(<>แสดงลูกศรชี้ตัวทริกเกอร์ด้วย <code>arrow</code></>, <>Show an arrow pointing at the trigger with <code>arrow</code>.</>),
          code: arrowCode,
          component: <Arrow />,
        },
        {
          title: tr("ลูกศรชี้กึ่งกลาง", "Arrow pointing at center"),
          description: tr(
            <>ใส่ <code>{"arrow={{ pointAtCenter: true }}"}</code> เพื่อให้ลูกศรชี้กึ่งกลางของตัวทริกเกอร์</>,
            <>Set <code>{"arrow={{ pointAtCenter: true }}"}</code> to make the arrow point at the center of the trigger.</>,
          ),
          code: arrowCenterCode,
          component: <ArrowCenter />,
        },
        {
          title: tr("วิธีเปิด", "Trigger mode"),
          description: tr(
            <>ค่าเริ่มต้นคือ <code>hover</code> เปลี่ยนเป็น <code>click</code> ได้</>,
            <>The default trigger mode is <code>hover</code>, you can change it to <code>click</code>.</>,
          ),
          code: triggerCode,
          component: <Trigger />,
        },
        {
          title: tr("อีเวนต์การคลิก", "Click event"),
          description: tr(
            <>คลิกรายการแล้วจะเกิดอีเวนต์ ใช้ <code>open</code> / <code>onOpenChange</code> กับ <code>source</code> เพื่อคงเมนูไว้หลังคลิกได้</>,
            <>An event fires when you click a menu item; use <code>open</code> / <code>onOpenChange</code> and the <code>source</code> info to keep the menu open after a click.</>,
          ),
          code: eventCode,
          component: <Event />,
        },
        {
          title: tr("เมนูคลิกขวา", "Context Menu"),
          description: tr(
            <>ใส่ <code>trigger="contextMenu"</code> เมนูจะเปิดตรงตำแหน่งเมาส์</>,
            <>Set <code>trigger="contextMenu"</code> and the menu opens at the pointer position.</>,
          ),
          code: contextMenuCode,
          component: <ContextMenu />,
        },
        {
          title: tr("เมนูหลายชั้น", "Cascading menu"),
          description: tr(
            "เมนูซ้อนหลายชั้น เปิดด้วยการ hover พร้อมรองรับกลุ่มและเมนูย่อยที่ถูกปิดใช้งาน",
            "Multi-level menus open on hover; groups and disabled submenus are supported.",
          ),
          code: cascadingCode,
          component: <Cascading />,
        },
        {
          title: tr("ปุ่มพร้อมเมนู", "Button with dropdown menu"),
          description: tr(
            <><code>DropdownButton</code> คือปุ่มแยกสองส่วน ซ้ายทำงานหลัก ขวาเปิดเมนู ปรับทั้งคู่ได้ด้วย <code>buttonsRender</code></>,
            <><code>DropdownButton</code> is a split button: the left one runs an action, the right one opens the menu. <code>buttonsRender</code> customizes both.</>,
          ),
          code: dropdownButtonCode,
          component: <DropdownButtonDemo />,
        },
        {
          title: tr("แผงเมนูกำหนดเอง", "Custom dropdown"),
          description: tr(<>ครอบเมนูด้วยแผงของคุณเองผ่าน <code>popupRender</code></>, <>Wrap the menu in your own panel through <code>popupRender</code>.</>),
          code: customPopupCode,
          component: <CustomPopup />,
        },
        {
          title: tr("เมนูที่เลือกได้", "Selectable Menu"),
          description: tr(
            <>ตั้ง <code>selectable</code> (และ <code>multiple</code>) ให้เมนูจำรายการที่เลือกไว้ โหมดหลายรายการเมนูจะไม่ปิดเมื่อคลิก</>,
            <>Set <code>selectable</code> (and <code>multiple</code>) to keep the selected items highlighted; a multiple menu stays open while you toggle.</>,
          ),
          code: selectableCode,
          component: <Selectable />,
        },
        {
          title: tr("กำลังโหลด", "Loading"),
          description: tr(<><code>DropdownButton</code> ในสถานะกำลังโหลด</>, <>A <code>DropdownButton</code> in loading state.</>),
          code: loadingCode,
          component: <Loading />,
        },
        {
          title: tr("โหนดท้ายรายการ", "Extra node"),
          description: tr(<>ใช้ <code>extra</code> เพื่อแสดงโหนดท้ายแถว เช่น คีย์ลัด</>, <>Use <code>extra</code> to render a node at the end of a row, e.g. a shortcut.</>),
          code: extraCode,
          component: <Extra />,
        },
      ]}
      api={[
        {
          title: "Dropdown",
          rows: [
            { property: "menu", description: tr("พร็อพของเมนู (items, onClick, selectable, ...)", "The menu props (items, onClick, selectable, ...)"), type: "DropdownMenuProps", default: "-" },
            { property: "trigger", description: tr("วิธีเปิดเมนู ใส่หลายแบบพร้อมกันได้", "How the dropdown is opened; several modes can be combined"), type: "click | hover | contextMenu | Array<...>", default: "['hover']" },
            { property: "placement", description: tr("ตำแหน่งของเมนูเทียบกับทริกเกอร์", "Placement of the popup menu"), type: "bottomLeft | bottom | bottomRight | topLeft | top | topRight", default: "bottomLeft" },
            { property: "arrow", description: tr("แสดงลูกศร; รูปแบบอ็อบเจ็กต์ให้ลูกศรชี้กึ่งกลางทริกเกอร์", "Show the arrow; the object form points it at the center of the trigger"), type: "boolean | { pointAtCenter?: boolean }", default: "false" },
            { property: "open", description: tr("สถานะเปิด (controlled)", "Whether the menu is open (controlled)"), type: "boolean", default: "-" },
            { property: "defaultOpen", description: tr("สถานะเปิดเริ่มต้น (uncontrolled)", "Initial open state (uncontrolled)"), type: "boolean", default: "false" },
            { property: "onOpenChange", description: tr("เรียกเมื่อสถานะเปิดเปลี่ยน source เป็น trigger หรือ menu (คลิกรายการ)", "Called when the open state changes; source is `trigger` or `menu` (item click)"), type: "(open: boolean, info?: { source: 'trigger' | 'menu' }) => void", default: "-" },
            { property: "disabled", description: tr("ปิดการใช้งานเมนู", "Whether the dropdown is disabled"), type: "boolean", default: "false" },
            { property: "mouseEnterDelay", description: tr("หน่วงก่อนเปิดตอน hover (วินาที) ใช้กับเมนูย่อยด้วย", "Delay in seconds before opening on hover; also used by submenus"), type: "number", default: "0.1" },
            { property: "mouseLeaveDelay", description: tr("หน่วงก่อนปิดตอนเมาส์ออก (วินาที)", "Delay in seconds before closing on mouse out"), type: "number", default: "0.1" },
            { property: "autoAdjustOverflow", description: tr("ดันเมนูให้อยู่ในจอเมื่อพื้นที่ไม่พอ", "Keep the popup inside the viewport when it would overflow"), type: "boolean", default: "true" },
            { property: "autoFocus", description: tr("โฟกัสรายการแรกเมื่อเมนูเปิด", "Focus the first menu item when the popup opens"), type: "boolean", default: "false" },
            { property: "destroyOnHidden", description: tr("ถอดเมนูออกจาก DOM เมื่อปิด (ปกติจะซ่อนไว้)", "Unmount the popup when it closes instead of keeping it hidden"), type: "boolean", default: "false" },
            { property: "getPopupContainer", description: tr("เรนเดอร์เมนูในอิลิเมนต์อื่น (ต้องมี position)", "Render the popup inside another (positioned) element"), type: "(triggerNode: HTMLElement) => HTMLElement", default: "() => document.body" },
            { property: "align", description: tr("เลื่อนตำแหน่งเมนูเพิ่มเป็นพิกเซล [x, y]", "Extra pixel offset [x, y] applied to the position"), type: "{ offset?: [number, number] }", default: "-" },
            { property: "openClassName", description: tr("คลาสเพิ่มบนทริกเกอร์ขณะเมนูเปิด", "Extra classes on the trigger while the menu is open"), type: "string", default: "-" },
            { property: "popupRender", description: tr("ครอบหรือแทนที่เนื้อหาในป๊อปอัป", "Customize the popup content: wrap or replace the menu node"), type: "(menu: ReactNode) => ReactNode", default: "-" },
            { property: "overlayClassName", description: tr("คลาสของกล่องป๊อปอัป", "Class name of the popup root"), type: "string", default: "-" },
            { property: "overlayStyle", description: tr("สไตล์ของกล่องป๊อปอัป", "Style of the popup root"), type: "CSSProperties", default: "-" },
            { property: "zIndex", description: tr("ค่า z-index ของป๊อปอัป", "z-index of the popup"), type: "number", default: "1050" },
            { property: "className", description: tr("คลาสของ element ที่ครอบทริกเกอร์", "Class name of the trigger wrapper"), type: "string", default: "-" },
            { property: "children", description: tr("อิลิเมนต์ที่ใช้เปิดเมนู", "The element that opens the menu"), type: "ReactNode", default: "-" },
          ],
        },
        {
          title: "DropdownMenuProps (menu)",
          rows: [
            { property: "items", description: tr("รายการเมนู ดูชนิดด้านล่าง", "Menu item list; see the item types below"), type: "DropdownItemType[]", default: "-" },
            { property: "onClick", description: tr("เรียกเมื่อคลิกรายการใดก็ตาม", "Called when any menu item is clicked"), type: "({ key, keyPath, domEvent }) => void", default: "-" },
            { property: "selectable", description: tr("ให้เมนูจำรายการที่เลือก", "Allow selecting menu items"), type: "boolean", default: "false" },
            { property: "multiple", description: tr("เลือกได้หลายรายการ เมนูจะไม่ปิดเมื่อคลิก", "Allow selecting several items; the menu stays open"), type: "boolean", default: "false" },
            { property: "selectedKeys", description: tr("คีย์ที่ถูกเลือก (controlled)", "Keys of the selected items (controlled)"), type: "string[]", default: "-" },
            { property: "defaultSelectedKeys", description: tr("คีย์ที่ถูกเลือกตั้งต้น", "Keys selected initially"), type: "string[]", default: "[]" },
            { property: "onSelect", description: tr("เรียกเมื่อมีการเลือกรายการ", "Called when an item is selected"), type: "({ key, keyPath, selectedKeys, domEvent }) => void", default: "-" },
            { property: "onDeselect", description: tr("เรียกเมื่อยกเลิกการเลือก (โหมด multiple)", "Called when an item is deselected (multiple only)"), type: "({ key, keyPath, selectedKeys, domEvent }) => void", default: "-" },
            { property: "expandIcon", description: tr("ไอคอนท้ายแถวของเมนูย่อย", "Icon at the end of a submenu row"), type: "ReactNode", default: "<ChevronRight />" },
            { property: "className", description: tr("คลาสของแผงเมนู", "Class name of the menu panel"), type: "string", default: "-" },
            { property: "style", description: tr("สไตล์ของแผงเมนู", "Style of the menu panel"), type: "CSSProperties", default: "-" },
          ],
        },
        {
          title: "DropdownItem",
          description: tr(
            "รายการปกติ ใส่ `children` เพื่อทำเป็นเมนูย่อย นอกจากนี้ยังมี `{ type: 'divider', dashed? }` และ `{ type: 'group', label, children }`",
            "Plain item; add `children` for a submenu. Also `{ type: 'divider', dashed? }` and `{ type: 'group', label, children }`.",
          ),
          rows: [
            { property: "key", description: tr("คีย์ประจำรายการ", "Unique key of the item"), type: "string", default: "-" },
            { property: "label", description: tr("ข้อความหรือโหนดของรายการ", "Label of the item"), type: "ReactNode", default: "-" },
            { property: "icon", description: tr("ไอคอนหน้าแถว", "Icon at the start of the row"), type: "ReactNode", default: "-" },
            { property: "extra", description: tr("โหนดท้ายแถว เช่น คีย์ลัด", "Node at the end of the row, e.g. a shortcut"), type: "ReactNode", default: "-" },
            { property: "danger", description: tr("แสดงเป็นสไตล์อันตราย", "Render with the danger style"), type: "boolean", default: "false" },
            { property: "disabled", description: tr("ปิดการใช้งานรายการ", "Disable the item"), type: "boolean", default: "false" },
            { property: "title", description: tr("ข้อความ title ของแถว (ทูลทิปของเบราว์เซอร์)", "Native title attribute of the row"), type: "string", default: "-" },
            { property: "children", description: tr("รายการย่อย ทำให้กลายเป็นเมนูย่อย", "Sub items; turns the row into a submenu"), type: "DropdownItemType[]", default: "-" },
            { property: "type", description: tr("ชนิดของรายการ", "Type of the entry"), type: "item | submenu | divider | group", default: "item" },
            { property: "popupClassName", description: tr("คลาสของแผงเมนูย่อย", "Class name of the submenu panel"), type: "string", default: "-" },
            { property: "className", description: tr("คลาสของแถว", "Class name of the row"), type: "string", default: "-" },
            { property: "onClick", description: tr("เรียกเมื่อคลิกรายการนี้", "Called when this item is clicked"), type: "({ key, keyPath, domEvent }) => void", default: "-" },
          ],
        },
        {
          title: "DropdownButton",
          description: tr("รับพร็อพเดียวกับ Dropdown และเพิ่ม:", "Takes the same props as Dropdown, plus:"),
          rows: [
            { property: "type", description: tr("ชนิดของปุ่ม เหมือน Button", "Type of the buttons, same as Button"), type: "default | primary | dashed | text | link", default: "default" },
            { property: "size", description: tr("ขนาดของปุ่ม เหมือน Button", "Size of the buttons, same as Button"), type: "sm | md | lg", default: "md" },
            { property: "danger", description: tr("สถานะอันตราย", "Danger status of the buttons"), type: "boolean", default: "false" },
            { property: "loading", description: tr("สถานะกำลังโหลดของปุ่มซ้าย", "Loading status of the left button"), type: "boolean", default: "false" },
            { property: "disabled", description: tr("ปิดการใช้งานทั้งสองปุ่ม", "Disable both buttons"), type: "boolean", default: "false" },
            { property: "icon", description: tr("ไอคอนของปุ่มขวา", "Icon of the right button"), type: "ReactNode", default: "<Ellipsis />" },
            { property: "htmlType", description: tr("type ของปุ่มซ้ายจริง", "Native type of the left button"), type: "button | submit | reset", default: "button" },
            { property: "onClick", description: tr("เรียกเมื่อคลิกปุ่มซ้าย", "Called when the left button is clicked"), type: "MouseEventHandler", default: "-" },
            { property: "buttonsRender", description: tr("ปรับแต่งปุ่มทั้งสองก่อนเรนเดอร์", "Customize both buttons before rendering"), type: "(buttons: [ReactNode, ReactNode]) => ReactNode[]", default: "-" },
            { property: "children", description: tr("เนื้อหาของปุ่มซ้าย", "Content of the left button"), type: "ReactNode", default: "-" },
          ],
        },
      ]}
      related={[
        { title: "Menu", path: "/components/menu" },
        { title: "Button", path: "/components/button" },
        { title: "Select", path: "/components/select" },
      ]}
    />
  );
}
