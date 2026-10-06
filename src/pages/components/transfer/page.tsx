import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import OneWay from "./demos/one-way";
import oneWayCode from "./demos/one-way.tsx?raw";
import Search from "./demos/search";
import searchCode from "./demos/search.tsx?raw";
import Advanced from "./demos/advanced";
import advancedCode from "./demos/advanced.tsx?raw";
import CustomItem from "./demos/custom-item";
import customItemCode from "./demos/custom-item.tsx?raw";
import TableTransfer from "./demos/table-transfer";
import tableTransferCode from "./demos/table-transfer.tsx?raw";
import TreeTransfer from "./demos/tree-transfer";
import treeTransferCode from "./demos/tree-transfer.tsx?raw";
import Status from "./demos/status";
import statusCode from "./demos/status.tsx?raw";
import PaginationDemo from "./demos/pagination";
import paginationDemoCode from "./demos/pagination.tsx?raw";
import Disabled from "./demos/disabled";
import disabledCode from "./demos/disabled.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="transfer"
      imports={["Transfer", "type TransferItem"]}
      whenToUse={tr(
        <>
          <ul>
            <li>ย้ายรายการระหว่างสองคอลัมน์ได้อย่างชัดเจนและรวดเร็ว</li>
            <li>ใช้เมื่อเลือกหนึ่งหรือหลายรายการจากตัวเลือกจำนวนมาก หรือต้องจัดรายการไปคนละกลุ่ม</li>
            <li>มองเห็นและจัดการหลายรายการได้ยืดหยุ่นกว่า Select dropdown</li>
          </ul>
        </>,
        <>
        <ul>
          <li>Transfer the elements between two columns in an intuitive and efficient way.</li>
          <li>One or more elements need to be selected from a large set of options, or when elements need to be assigned to different groups.</li>
          <li>Offers better visibility and flexibility than a standard Select dropdown when dealing with multiple selections.</li>
        </ul>
        </>,
      )}
      demos={[
        { title: tr("พื้นฐาน", "Basic"), description: tr("การใช้งานพื้นฐาน พร้อมกำหนดชื่อคอลัมน์และเลือกรายการ", "The most basic usage with custom titles and item selection."), code: basicCode, component: <Basic /> },
        { title: tr("ทางเดียว", "One Way"), description: tr("ย้ายรายการได้เฉพาะซ้ายไปขวา และรายการด้านขวามีปุ่มลบ", "Items can only move from left to right; items on the right have a delete button."), code: oneWayCode, component: <OneWay /> },
        { title: tr("ค้นหา", "Search"), description: tr("เพิ่มช่องค้นหาเพื่อกรองรายการใน Transfer", "Transfer with a search box to filter elements."), code: searchCode, component: <Search /> },
        { title: tr("ขั้นสูง", "Advanced"), full: true, description: tr("ปรับ operations, footer และรองรับรายการจำนวนมาก", "Advanced usage with custom operations, footer, and large list sizes."), code: advancedCode, component: <Advanced /> },
        { title: tr("กำหนด Data Source", "Custom Datasource"), description: tr("กำหนดการเรนเดอร์รายการพร้อม Badge สถานะและ Tag", "Custom rendering items with status badges and tags."), code: customItemCode, component: <CustomItem /> },
        { title: tr("ใช้ Table", "Table Transfer"), full: true, description: tr("ปรับ list body ให้แสดงด้วย Table", "Customize the list body using a custom Table view."), code: tableTransferCode, component: <TableTransfer /> },
        { title: tr("ใช้ Tree", "Tree Transfer"), full: true, description: tr("ปรับคอลัมน์ต้นทางให้แสดงด้วย Tree", "Customize the source column as a Tree component."), code: treeTransferCode, component: <TreeTransfer /> },
        { title: tr("สถานะ", "Status"), description: tr("สถานะ validation แบบ error หรือ warning", "Validation status: error or warning."), code: statusCode, component: <Status /> },
        { title: tr("แบ่งหน้า", "Pagination"), description: tr("เปิด pagination เมื่อ data source มีรายการจำนวนมาก", "Enable pagination when data source has many items."), code: paginationDemoCode, component: <PaginationDemo /> },
        { title: tr("ปิดใช้งาน", "Disabled"), description: tr("ปิดใช้งาน Transfer ทั้ง component", "Disabled state for the entire transfer component."), code: disabledCode, component: <Disabled /> },
      ]}
      api={[
        {
          title: "Transfer",
          rows: [
            { property: "dataSource", description: "Used for setting the source data", type: "TransferItem[]", default: "[]" },
            { property: "targetKeys", description: "A set of keys of elements that are listed on the right column", type: "string[]", default: "[]" },
            { property: "defaultTargetKeys", description: "Default keys of elements listed on right column", type: "string[]", default: "[]" },
            { property: "selectedKeys", description: "A set of keys of selected items", type: "string[]", default: "[]" },
            { property: "titles", description: "A set of titles that are sorted from top to bottom", type: "[ReactNode, ReactNode]", default: "['', '']" },
            { property: "operations", description: "A set of operations that are sorted from top to bottom", type: "[ReactNode, ReactNode]", default: "['>', '<']" },
            { property: "oneWay", description: "Give the option to move elements in one direction only", type: "boolean", default: "false" },
            { property: "showSearch", description: "If included, a search box is displayed on each column", type: "boolean | { placeholder?, defaultValue? }", default: "false" },
            { property: "filterOption", description: "A function to determine whether an item matches search query", type: "(inputValue, item, direction) => boolean", default: "-" },
            { property: "render", description: "The function to generate each row item", type: "(item) => ReactNode | { label, value }", default: "-" },
            { property: "footer", description: "A function used for rendering the footer of each column", type: "(props, { direction }) => ReactNode", default: "-" },
            { property: "pagination", description: "Use pagination for lists", type: "boolean | { pageSize? }", default: "false" },
            { property: "listStyle", description: "A custom CSS style for each column", type: "CSSProperties | ({ direction }) => CSSProperties", default: "-" },
            { property: "disabled", description: "Whether disabled", type: "boolean", default: "false" },
            { property: "status", description: "Set validation status", type: "'error' | 'warning'", default: "-" },
            { property: "onChange", description: "A callback function that is executed when the transfer between columns is complete", type: "(targetKeys, direction, moveKeys) => void", default: "-" },
            { property: "onSelectChange", description: "A callback function which is executed when selected items are changed", type: "(sourceSelectedKeys, targetSelectedKeys) => void", default: "-" },
            { property: "onSearch", description: "A callback function which is executed when search field are changed", type: "(direction, value) => void", default: "-" },
            { property: "children", description: "Custom list body renderer", type: "(props) => ReactNode", default: "-" },
          ],
        },
        {
          title: "TransferItem",
          rows: [
            { property: "key", description: "The unique identifier of the item", type: "string", default: "-" },
            { property: "title", description: "The title of the item", type: "string", default: "-" },
            { property: "description", description: "The description of the item", type: "string", default: "-" },
            { property: "disabled", description: "Disable the item", type: "boolean", default: "false" },
          ],
        },
      ]}
    />
  );
}
