import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Bordered from "./demos/bordered";
import borderedCode from "./demos/bordered.tsx?raw";
import Size from "./demos/size";
import sizeCode from "./demos/size.tsx?raw";
import PaginationDemo from "./demos/pagination";
import paginationCode from "./demos/pagination.tsx?raw";
import TitleAndFooter from "./demos/title-and-footer";
import titleAndFooterCode from "./demos/title-and-footer.tsx?raw";
import RowSelectionDemo from "./demos/row-selection";
import rowSelectionCode from "./demos/row-selection.tsx?raw";
import FilterSort from "./demos/filter-sort";
import filterSortCode from "./demos/filter-sort.tsx?raw";
import CustomFilterPanel from "./demos/custom-filter-panel";
import customFilterPanelCode from "./demos/custom-filter-panel.tsx?raw";
import ResetFilters from "./demos/reset-filters";
import resetFiltersCode from "./demos/reset-filters.tsx?raw";
import ExpandableDemo from "./demos/expandable";
import expandableCode from "./demos/expandable.tsx?raw";
import NestedTable from "./demos/nested-table";
import nestedTableCode from "./demos/nested-table.tsx?raw";
import TreeDataDemo from "./demos/tree-data";
import treeDataCode from "./demos/tree-data.tsx?raw";
import FixedColumnsDemo from "./demos/fixed-columns";
import fixedColumnsCode from "./demos/fixed-columns.tsx?raw";
import FixedHeader from "./demos/fixed-header";
import fixedHeaderCode from "./demos/fixed-header.tsx?raw";
import StickyHeader from "./demos/sticky-header";
import stickyHeaderCode from "./demos/sticky-header.tsx?raw";
import GroupingColumns from "./demos/grouping-columns";
import groupingColumnsCode from "./demos/grouping-columns.tsx?raw";
import ColspanRowspan from "./demos/colspan-rowspan";
import colspanRowspanCode from "./demos/colspan-rowspan.tsx?raw";
import SummaryDemo from "./demos/summary";
import summaryCode from "./demos/summary.tsx?raw";
import EllipsisDemo from "./demos/ellipsis";
import ellipsisCode from "./demos/ellipsis.tsx?raw";
import EditableCell from "./demos/editable-cell";
import editableCellCode from "./demos/editable-cell.tsx?raw";
import EditableRow from "./demos/editable-row";
import editableRowCode from "./demos/editable-row.tsx?raw";
import AjaxRemote from "./demos/ajax-remote";
import ajaxRemoteCode from "./demos/ajax-remote.tsx?raw";
import VirtualList from "./demos/virtual-list";
import virtualListCode from "./demos/virtual-list.tsx?raw";
import DynamicSettings from "./demos/dynamic-settings";
import dynamicSettingsCode from "./demos/dynamic-settings.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="table"
      imports={[
        "Table",
        "type ColumnType",
        "type TableProps",
        "type TableRowSelection",
        "type TableExpandable",
      ]}
      whenToUse={tr(
        <ul>
          <li>ใช้แสดงข้อมูลเชิงตารางที่ต้องเรียงลำดับ กรอง เลือกแถว ขยายรายละเอียด หรือแบ่งหน้า</li>
          <li>
            ทำงานได้ทั้งฝั่ง client (ส่ง <code>dataSource</code> ทั้งชุด) และฝั่ง server — รับ{" "}
            <code>onChange(pagination, filters, sorter, extra)</code> แล้วยิง API เอง โดยคุมค่าผ่าน{" "}
            <code>pagination.total</code>, <code>column.filteredValue</code> และ{" "}
            <code>column.sortOrder</code>
          </li>
          <li>
            ข้อมูลจำนวนมากให้ใช้ <code>virtual</code> คู่กับ <code>scroll.y</code> — ตารางจะ mount
            เฉพาะแถวที่มองเห็น (ตารางที่มี <code>scroll.y</code> และแถวเกิน 100 จะเปิดโหมดนี้ให้อัตโนมัติ)
          </li>
          <li>
            ถ้าต้องการแค่แสดงรายการที่ไม่ใช่ตาราง ให้ใช้ <a href="/components/list">List</a> หรือ{" "}
            <a href="/components/descriptions">Descriptions</a> แทน
          </li>
        </ul>,
        <ul>
          <li>To display structured rows that need sorting, filtering, selection, expandable detail or pagination.</li>
          <li>
            Works client-side (pass the whole <code>dataSource</code>) and server-side — handle{" "}
            <code>onChange(pagination, filters, sorter, extra)</code> and drive the table through{" "}
            <code>pagination.total</code>, <code>column.filteredValue</code> and <code>column.sortOrder</code>.
          </li>
          <li>
            For huge datasets set <code>virtual</code> together with <code>scroll.y</code> so only the visible
            rows are mounted (a <code>scroll.y</code> table with more than 100 rows switches to it automatically).
          </li>
          <li>
            For non-tabular data prefer <a href="/components/list">List</a> or{" "}
            <a href="/components/descriptions">Descriptions</a>.
          </li>
        </ul>,
      )}
      demos={[
        {
          title: tr("การใช้งานพื้นฐาน", "Basic Usage"),
          description: tr(
            <>กำหนด <code>columns</code> และ <code>dataSource</code> ก็ได้ตารางพร้อมแบ่งหน้า</>,
            <>Simple table with <code>columns</code> and <code>dataSource</code>, paginated by default.</>,
          ),
          code: basicCode,
          component: <Basic />,
          full: true,
        },
        {
          title: tr("เส้นขอบ", "Bordered"),
          description: tr(
            <>ใส่ <code>bordered</code> เพื่อแสดงเส้นแบ่งทุกเซลล์</>,
            <>Add <code>bordered</code> to draw a divider around every cell.</>,
          ),
          code: borderedCode,
          component: <Bordered />,
          full: true,
        },
        {
          title: tr("ขนาด", "Size"),
          description: tr(
            <><code>size</code>: <code>sm</code> แน่น, <code>md</code> ปกติ, <code>lg</code> โปร่ง</>,
            <><code>size</code>: <code>sm</code> compact, <code>md</code> default, <code>lg</code> roomy.</>,
          ),
          code: sizeCode,
          component: <Size />,
          full: true,
        },
        {
          title: tr("การแบ่งหน้า", "Pagination"),
          description: tr(
            <>ส่ง config ของ <a href="/components/pagination">Pagination</a> เข้ามาได้ทั้งชุด และเลือกตำแหน่งด้วย <code>position</code></>,
            <>Pass any <a href="/components/pagination">Pagination</a> config, and place the bar with <code>position</code>.</>,
          ),
          code: paginationCode,
          component: <PaginationDemo />,
          full: true,
        },
        {
          title: tr("หัวเรื่องและท้ายตาราง", "Title and Footer"),
          description: tr(
            <><code>title</code> และ <code>footer</code> รับข้อมูลของหน้าปัจจุบันเข้ามาด้วย</>,
            <><code>title</code> and <code>footer</code> both receive the current page data.</>,
          ),
          code: titleAndFooterCode,
          component: <TitleAndFooter />,
          full: true,
        },
        {
          title: tr("การเลือกแถว", "Row Selection"),
          description: tr(
            <>เลือกได้ทั้งแบบ checkbox และ radio, <code>selections</code> เพิ่มเมนูเลือกทั้งหมด / กลับด้าน / ล้าง</>,
            <>Checkbox or radio selection; <code>selections</code> adds the select-all / invert / clear menu.</>,
          ),
          code: rowSelectionCode,
          component: <RowSelectionDemo />,
          full: true,
        },
        {
          title: tr("กรองและเรียงลำดับ", "Filter and Sorter"),
          description: tr(
            <>ใช้ <code>filters</code> + <code>onFilter</code> และ <code>sorter</code> ต่อคอลัมน์</>,
            <>Per-column <code>filters</code> + <code>onFilter</code> and a <code>sorter</code> comparator.</>,
          ),
          code: filterSortCode,
          component: <FilterSort />,
          full: true,
        },
        {
          title: tr("แผงกรองแบบกำหนดเอง", "Custom Filter Panel"),
          description: tr(
            <><code>filterDropdown</code> เขียนแผงกรองเองได้ ส่วน <code>filterMode="tree"</code> ให้เมนูแบบต้นไม้</>,
            <><code>filterDropdown</code> renders your own panel; <code>filterMode="tree"</code> gives a nested menu.</>,
          ),
          code: customFilterPanelCode,
          component: <CustomFilterPanel />,
          full: true,
        },
        {
          title: tr("ล้างตัวกรองและการเรียง", "Reset Filters and Sorters"),
          description: tr(
            <>คุมสถานะเองผ่าน <code>filteredValue</code> / <code>sortOrder</code> แล้วรีเซ็ตได้จากภายนอก</>,
            <>Control the state with <code>filteredValue</code> / <code>sortOrder</code> and reset it from outside.</>,
          ),
          code: resetFiltersCode,
          component: <ResetFilters />,
          full: true,
        },
        {
          title: tr("แถวที่ขยายได้", "Expandable Row"),
          description: tr(
            <><code>expandable.expandedRowRender</code> แสดงรายละเอียดใต้แถว</>,
            <><code>expandable.expandedRowRender</code> renders a detail panel under the row.</>,
          ),
          code: expandableCode,
          component: <ExpandableDemo />,
          full: true,
        },
        {
          title: tr("ตารางซ้อนตาราง", "Nested Table"),
          description: tr(
            <>แถวที่ขยายจะ render ตารางลูกอีกชุดได้เลย</>,
            <>An expanded row can render a whole child table.</>,
          ),
          code: nestedTableCode,
          component: <NestedTable />,
          full: true,
        },
        {
          title: tr("ข้อมูลแบบต้นไม้", "Tree Data"),
          description: tr(
            <>ใส่ฟิลด์ <code>children</code> ในข้อมูล (เปลี่ยนชื่อได้ด้วย <code>expandable.childrenColumnName</code>)</>,
            <>Rows with a <code>children</code> field (renamed via <code>expandable.childrenColumnName</code>).</>,
          ),
          code: treeDataCode,
          component: <TreeDataDemo />,
          full: true,
        },
        {
          title: tr("คอลัมน์ตรึง", "Fixed Columns"),
          description: tr(
            <>ตรึงคอลัมน์ซ้าย/ขวาด้วย <code>fixed</code> คู่กับ <code>scroll.x</code></>,
            <>Pin columns with <code>fixed</code> together with <code>scroll.x</code>.</>,
          ),
          code: fixedColumnsCode,
          component: <FixedColumnsDemo />,
          full: true,
        },
        {
          title: tr("หัวตารางคงที่", "Fixed Header"),
          description: tr(
            <><code>scroll.y</code> ทำให้ตัวตารางเลื่อนแต่หัวตารางค้างไว้</>,
            <><code>scroll.y</code> scrolls the body and keeps the header in place.</>,
          ),
          code: fixedHeaderCode,
          component: <FixedHeader />,
          full: true,
        },
        {
          title: tr("หัวตารางติดหน้าจอ", "Sticky Header"),
          description: tr(
            <><code>sticky</code> ให้หัวตารางเกาะขอบบนของหน้าจอขณะเลื่อนหน้า (ตั้ง offset ได้)</>,
            <><code>sticky</code> pins the header to the scrolling page (with an optional offset).</>,
          ),
          code: stickyHeaderCode,
          component: <StickyHeader />,
          full: true,
        },
        {
          title: tr("หัวตารางแบบกลุ่ม", "Grouping Columns"),
          description: tr(
            <>ใส่ <code>children</code> ในคอลัมน์เพื่อสร้างหัวตารางหลายชั้น</>,
            <>Nest <code>children</code> in a column to build multi-level headers.</>,
          ),
          code: groupingColumnsCode,
          component: <GroupingColumns />,
          full: true,
        },
        {
          title: tr("รวมเซลล์", "Colspan and Rowspan"),
          description: tr(
            <><code>onCell</code> คืน <code>colSpan</code> / <code>rowSpan</code> เพื่อรวมเซลล์ (<code>0</code> = ซ่อนเซลล์นั้น)</>,
            <><code>onCell</code> returns <code>colSpan</code> / <code>rowSpan</code> to merge cells (<code>0</code> hides the cell).</>,
          ),
          code: colspanRowspanCode,
          component: <ColspanRowspan />,
          full: true,
        },
        {
          title: tr("แถวสรุป", "Summary"),
          description: tr(
            <><code>summary</code> ต้องคืน <code>&lt;Table.Summary&gt;</code> ซึ่ง render เป็น <code>tfoot</code> จริง</>,
            <><code>summary</code> must return <code>&lt;Table.Summary&gt;</code> — it renders the real <code>tfoot</code>.</>,
          ),
          code: summaryCode,
          component: <SummaryDemo />,
          full: true,
        },
        {
          title: tr("ตัดข้อความ", "Ellipsis"),
          description: tr(
            <><code>ellipsis</code> ตัดข้อความยาวและใส่ <code>title</code> ให้อัตโนมัติ ปิดได้ด้วย <code>{"{ showTitle: false }"}</code></>,
            <><code>ellipsis</code> truncates long text and adds a native <code>title</code>; disable it with <code>{"{ showTitle: false }"}</code>.</>,
          ),
          code: ellipsisCode,
          component: <EllipsisDemo />,
          full: true,
        },
        {
          title: tr("แก้ไขรายเซลล์", "Editable Cells"),
          description: tr(
            <>คลิกที่เซลล์เพื่อแก้ไข แล้วบันทึกกลับเข้า state ผ่าน <code>render</code></>,
            <>Click a cell to edit it and write back into state from <code>render</code>.</>,
          ),
          code: editableCellCode,
          component: <EditableCell />,
          full: true,
        },
        {
          title: tr("แก้ไขทั้งแถว", "Editable Rows"),
          description: tr(
            <>เปลี่ยน <code>tr</code>/<code>td</code> ด้วย <code>components</code> แล้วส่งข้อมูลแก้ไขผ่าน <code>onCell</code></>,
            <>Swap <code>tr</code>/<code>td</code> through <code>components</code> and feed the editor via <code>onCell</code>.</>,
          ),
          code: editableRowCode,
          component: <EditableRow />,
          full: true,
        },
        {
          title: tr("ดึงข้อมูลจากเซิร์ฟเวอร์", "Ajax Remote Data"),
          description: tr(
            <>แบ่งหน้า/กรอง/เรียงที่ฝั่ง server: อ่านค่าจาก <code>onChange</code> แล้วส่ง <code>pagination.total</code> กลับมา</>,
            <>Server-side paging, filtering and sorting: read <code>onChange</code> and return <code>pagination.total</code>.</>,
          ),
          code: ajaxRemoteCode,
          component: <AjaxRemote />,
          full: true,
        },
        {
          title: tr("รายการเสมือน", "Virtual List"),
          description: tr(
            <>ข้อมูล 10,000 แถวด้วย <code>virtual</code> + <code>scroll</code> — mount เฉพาะแถวที่เห็น</>,
            <>10,000 rows with <code>virtual</code> + <code>scroll</code> — only visible rows are mounted.</>,
          ),
          code: virtualListCode,
          component: <VirtualList />,
          full: true,
        },
        {
          title: tr("ปรับค่าแบบไดนามิก", "Dynamic Settings"),
          description: tr(
            <>สลับ props หลัก ๆ ของตารางแบบสด ๆ</>,
            <>Toggle the main table props live.</>,
          ),
          code: dynamicSettingsCode,
          component: <DynamicSettings />,
          full: true,
        },
      ]}
      api={[
        {
          title: "Table",
          rows: [
            { property: "columns", description: tr("รายการคอลัมน์", "Columns of the table"), type: "ColumnType<T>[]", default: "-" },
            { property: "children", description: tr("ประกาศคอลัมน์แบบ JSX ด้วย Table.Column / Table.ColumnGroup (ใช้เมื่อไม่ส่ง columns)", "Declare columns as JSX with Table.Column / Table.ColumnGroup (used when columns is omitted)"), type: "ReactNode", default: "-" },
            { property: "dataSource", description: tr("ข้อมูลที่จะแสดง", "Data record array to render"), type: "T[]", default: "[]" },
            { property: "rowKey", description: tr("คีย์ของแต่ละแถว", "Row key of each record"), type: "string | ((record: T) => Key)", default: "'key'" },
            { property: "loading", description: tr("สถานะกำลังโหลด ใส่ tip เพิ่มได้", "Loading state, optionally with a tip"), type: "boolean | { spinning?: boolean; tip?: ReactNode }", default: "false" },
            { property: "pagination", description: tr("ตั้งค่าการแบ่งหน้า, false = ปิด", "Pagination config, false to hide it"), type: "false | TablePaginationConfig", default: "{}" },
            { property: "bordered", description: tr("แสดงเส้นขอบทุกเซลล์", "Show cell borders"), type: "boolean", default: "false" },
            { property: "size", description: tr("ความหนาแน่นของตาราง", "Density of the table"), type: "'sm' | 'md' | 'lg'", default: "'md'" },
            { property: "rowSelection", description: tr("ตั้งค่าการเลือกแถว", "Row selection config"), type: "TableRowSelection<T>", default: "-" },
            { property: "expandable", description: tr("ตั้งค่าแถวที่ขยายได้ / tree data", "Expandable row and tree data config"), type: "TableExpandable<T>", default: "-" },
            { property: "summary", description: tr("แถวสรุปท้ายตาราง ต้องคืน <Table.Summary>", "Summary rows, must return <Table.Summary>"), type: "(currentData: readonly T[]) => ReactNode", default: "-" },
            { property: "title", description: tr("ส่วนหัวเหนือตาราง", "Title above the table"), type: "(currentData: readonly T[]) => ReactNode", default: "-" },
            { property: "footer", description: tr("ส่วนท้ายใต้ตาราง", "Footer below the table"), type: "(currentData: readonly T[]) => ReactNode", default: "-" },
            { property: "scroll", description: tr("ขนาดพื้นที่เลื่อน — x เลื่อนแนวนอน, y ล็อกหัวตาราง", "Scroll area — x scrolls horizontally, y fixes the header"), type: "{ x?: number | string | true; y?: number | string }", default: "-" },
            { property: "sticky", description: tr("ให้หัวตารางเกาะขอบบนของหน้าจอ", "Stick the header to the scrolling page"), type: "boolean | { offsetHeader?: number }", default: "false" },
            { property: "virtual", description: tr("เปิด virtual scroll (ต้องมี scroll.y เป็นตัวเลข)", "Enable windowed rendering (needs a numeric scroll.y)"), type: "boolean", default: "false" },
            { property: "showHeader", description: tr("แสดงหัวตาราง", "Whether to show the header"), type: "boolean", default: "true" },
            { property: "rowClassName", description: tr("คลาสของแต่ละแถว", "Class name of each row"), type: "string | ((record: T, index: number, indent: number) => string)", default: "-" },
            { property: "components", description: tr("แทนที่ element ของตาราง (table / thead / tbody / tr / th / td)", "Override table elements (table / thead / tbody / tr / th / td)"), type: "TableComponents", default: "-" },
            { property: "tableLayout", description: tr("ค่า table-layout ของ CSS", "The CSS table-layout value"), type: "'auto' | 'fixed'", default: "'auto'" },
            { property: "locale", description: tr("ข้อความในตาราง (ตัวกรอง, ไม่มีข้อมูล, tooltip เรียง)", "Text of filters, empty state and sorter tooltips"), type: "TableLocale", default: "-" },
            { property: "showSorterTooltip", description: tr("แสดง tooltip บนหัวคอลัมน์ที่เรียงได้", "Show a tooltip on sortable headers"), type: "boolean | { title?: ReactNode }", default: "true" },
            { property: "sortDirections", description: tr("ลำดับการวนของทิศทางการเรียง", "Cycle of the available sort directions"), type: "('ascend' | 'descend')[]", default: "['ascend', 'descend']" },
            { property: "rowHoverable", description: tr("ไฮไลต์แถวเมื่อชี้เมาส์", "Highlight the row on hover"), type: "boolean", default: "true" },
            { property: "caption", description: tr("คำบรรยายตาราง (element caption)", "Table caption element"), type: "ReactNode", default: "-" },
            { property: "getPopupContainer", description: tr("กำหนด container ของ dropdown ตัวกรอง", "Container of the filter dropdown"), type: "(triggerNode: HTMLElement) => HTMLElement", default: "document.body" },
            { property: "onChange", description: tr("เรียกเมื่อเปลี่ยนหน้า/ตัวกรอง/การเรียง — ใช้ทำ server-side", "Fired on pagination, filter or sorter change — the server-side hook"), type: "(pagination, filters, sorter, extra) => void", default: "-" },
            { property: "onRow", description: tr("props เพิ่มเติมของแถว", "Extra props for a body row"), type: "(record: T, index: number) => HTMLAttributes", default: "-" },
            { property: "onHeaderRow", description: tr("props เพิ่มเติมของแถวหัวตาราง", "Extra props for a header row"), type: "(columns, index) => HTMLAttributes", default: "-" },
            { property: "className / style / id", description: tr("ส่งต่อไปยัง element ราก", "Passed to the root element"), type: "string | CSSProperties | string", default: "-" },
          ],
        },
        {
          title: "ColumnType",
          description: tr("ค่าใน columns แต่ละตัว", "One entry of the columns array."),
          rows: [
            { property: "key", description: tr("คีย์ของคอลัมน์ (ไม่ใส่จะใช้ dataIndex หรือลำดับแทน)", "Column key (falls back to dataIndex, then to its position)"), type: "Key", default: "-" },
            { property: "title", description: tr("หัวคอลัมน์ รับฟังก์ชันเพื่ออ่านสถานะเรียง/กรองได้", "Header content; a function receives the sort and filter state"), type: "ReactNode | ((props: ColumnTitleProps<T>) => ReactNode)", default: "-" },
            { property: "dataIndex", description: tr("ฟิลด์ในข้อมูล รองรับ path แบบ array", "Field of the record, supports a path array"), type: "string | number | readonly (string | number)[]", default: "-" },
            { property: "render", description: tr("แปลงค่าเป็น ReactNode หรือคืน { children, props } เพื่อรวมเซลล์", "Renders the cell, or returns { children, props } to merge cells"), type: "(value, record, index) => ReactNode | { children, props }", default: "-" },
            { property: "width / minWidth", description: tr("ความกว้างของคอลัมน์", "Width of the column"), type: "number | string / number", default: "-" },
            { property: "align", description: tr("การจัดวางในเซลล์", "Cell alignment"), type: "'left' | 'center' | 'right'", default: "'left'" },
            { property: "sorter", description: tr("true = เรียงตาม dataIndex, หรือใส่ฟังก์ชันเปรียบเทียบ", "true sorts by dataIndex, or pass a compare function"), type: "boolean | ((a: T, b: T) => number)", default: "-" },
            { property: "sortOrder", description: tr("คุมทิศทางการเรียงจากภายนอก", "Controlled sort order of this column"), type: "'ascend' | 'descend' | null", default: "-" },
            { property: "defaultSortOrder", description: tr("ทิศทางการเรียงเริ่มต้น", "Initial sort order"), type: "'ascend' | 'descend' | null", default: "-" },
            { property: "sortDirections", description: tr("ลำดับการวนเฉพาะคอลัมน์นี้", "Sort direction cycle for this column"), type: "('ascend' | 'descend')[]", default: "Table.sortDirections" },
            { property: "showSorterTooltip", description: tr("tooltip เฉพาะคอลัมน์นี้", "Sorter tooltip for this column"), type: "boolean | { title?: ReactNode }", default: "Table.showSorterTooltip" },
            { property: "filters", description: tr("ตัวเลือกในเมนูกรอง (ใส่ children เพื่อทำเป็นต้นไม้)", "Filter menu items (nest children for a tree)"), type: "FilterItem[]", default: "-" },
            { property: "onFilter", description: tr("เงื่อนไขการกรองต่อแถว", "Decides whether a record matches a filter value"), type: "(value: FilterValue, record: T) => boolean", default: "-" },
            { property: "filterMultiple", description: tr("เลือกได้หลายค่า", "Allow selecting multiple filter values"), type: "boolean", default: "true" },
            { property: "filterSearch", description: tr("ช่องค้นหาในเมนูกรอง หรือฟังก์ชันจับคู่เอง", "Search box inside the filter menu, or a custom matcher"), type: "boolean | ((input, item) => boolean)", default: "false" },
            { property: "filteredValue", description: tr("คุมค่าตัวกรองจากภายนอก (null = ล้าง)", "Controlled filter value (null clears it)"), type: "FilterValue[] | null", default: "-" },
            { property: "defaultFilteredValue", description: tr("ค่าตัวกรองเริ่มต้น", "Initial filter value"), type: "FilterValue[]", default: "-" },
            { property: "filterMode", description: tr("รูปแบบเมนูกรอง", "Filter menu layout"), type: "'menu' | 'tree'", default: "'menu'" },
            { property: "filterResetToDefaultFilteredValue", description: tr("ปุ่ม Reset คืนค่าเป็น defaultFilteredValue", "Reset restores defaultFilteredValue instead of clearing"), type: "boolean", default: "false" },
            { property: "filterDropdown", description: tr("แผงกรองแบบกำหนดเอง", "Custom filter panel"), type: "ReactNode | ((props: FilterDropdownRenderProps) => ReactNode)", default: "-" },
            { property: "filterDropdownProps", description: tr("คุมการเปิด/ปิดและสไตล์ของแผงกรอง", "Control the open state and styling of the filter panel"), type: "{ open?, onOpenChange?, className?, style? }", default: "-" },
            { property: "filterIcon", description: tr("ไอคอนตัวกรอง", "Filter icon"), type: "ReactNode | ((filtered: boolean) => ReactNode)", default: "-" },
            { property: "ellipsis", description: tr("ตัดข้อความยาว, showTitle: false เพื่อไม่ใส่ title", "Truncate long text; showTitle: false skips the native title"), type: "boolean | { showTitle?: boolean }", default: "false" },
            { property: "fixed", description: tr("ตรึงคอลัมน์ซ้าย/ขวา", "Pin the column left or right"), type: "'left' | 'right'", default: "-" },
            { property: "colSpan", description: tr("จำนวนคอลัมน์ที่หัวตารางกิน (0 = ซ่อนหัวคอลัมน์นี้)", "colSpan of the header cell (0 hides it)"), type: "number", default: "1" },
            { property: "rowScope", description: tr("render เซลล์ในตัวตารางเป็น th พร้อม scope", "Render body cells as th with this scope"), type: "'row' | 'rowgroup'", default: "-" },
            { property: "responsive", description: tr("แสดงคอลัมน์เฉพาะ breakpoint ที่ระบุ", "Only render the column at these breakpoints"), type: "('xs'|'sm'|'md'|'lg'|'xl'|'xxl')[]", default: "-" },
            { property: "onCell", description: tr("props เพิ่มเติมของเซลล์ ใช้ทำ colSpan/rowSpan", "Extra cell props — the way to set colSpan / rowSpan"), type: "(record: T, index: number) => CellExtraProps", default: "-" },
            { property: "onHeaderCell", description: tr("props เพิ่มเติมของเซลล์หัวตาราง", "Extra header cell props"), type: "(column) => HeaderCellExtraProps", default: "-" },
            { property: "shouldCellUpdate", description: tr("คืน false เพื่อข้ามการ re-render เซลล์", "Return false to skip re-rendering the cell"), type: "(record: T, prevRecord: T) => boolean", default: "-" },
            { property: "children", description: tr("คอลัมน์ลูก ทำให้หัวตารางเป็นหลายชั้น", "Nested columns — renders grouped header rows"), type: "ColumnType<T>[]", default: "-" },
            { property: "className", description: tr("คลาสของเซลล์ในคอลัมน์นี้", "Class name of the cells in this column"), type: "string", default: "-" },
          ],
        },
        {
          title: "rowSelection",
          rows: [
            { property: "type", description: tr("แบบ checkbox หรือ radio", "Checkbox or radio selection"), type: "'checkbox' | 'radio'", default: "'checkbox'" },
            { property: "selectedRowKeys", description: tr("คีย์ที่ถูกเลือก (controlled)", "Controlled selected keys"), type: "Key[]", default: "-" },
            { property: "defaultSelectedRowKeys", description: tr("คีย์ที่เลือกไว้ตั้งแต่แรก (uncontrolled)", "Initially selected keys (uncontrolled)"), type: "Key[]", default: "[]" },
            { property: "onChange", description: tr("เรียกเมื่อการเลือกเปลี่ยน", "Fired when the selection changes"), type: "(keys, rows, info: { type }) => void", default: "-" },
            { property: "getCheckboxProps", description: tr("ตั้งค่า checkbox ของแต่ละแถว เช่น disabled", "Per-row checkbox props, e.g. disabled"), type: "(record: T) => { disabled?, name? }", default: "-" },
            { property: "selections", description: tr("เมนูข้างหัว checkbox — true ใช้ชุดมาตรฐาน", "Menu next to the header checkbox — true uses the default items"), type: "boolean | (SelectionItem | string)[]", default: "false" },
            { property: "hideSelectAll", description: tr("ซ่อน checkbox เลือกทั้งหน้า", "Hide the select-all checkbox"), type: "boolean", default: "false" },
            { property: "onSelect", description: tr("เรียกเมื่อเลือก/ยกเลิกทีละแถว", "Fired when a single row is (de)selected"), type: "(record, selected, selectedRows) => void", default: "-" },
            { property: "onSelectAll", description: tr("เรียกเมื่อกดเลือกทั้งหน้า", "Fired when the select-all checkbox is used"), type: "(selected, selectedRows, changeRows) => void", default: "-" },
            { property: "onSelectNone", description: tr("เรียกเมื่อกดล้างทั้งหมดจากเมนู selections", "Fired by the clear-all item of selections"), type: "() => void", default: "-" },
            { property: "onSelectInvert", description: tr("เรียกเมื่อกดกลับด้านจากเมนู selections", "Fired by the invert item of selections"), type: "(selectedRowKeys: Key[]) => void", default: "-" },
            { property: "preserveSelectedRowKeys", description: tr("เก็บคีย์ที่ไม่อยู่ใน dataSource ปัจจุบันไว้ (สำหรับ server paging)", "Keep keys that are no longer in dataSource (server paging)"), type: "boolean", default: "false" },
            { property: "checkStrictly", description: tr("false = ผูก checkbox แม่-ลูกใน tree data", "false links parent and child checkboxes in tree data"), type: "boolean", default: "true" },
            { property: "columnWidth", description: tr("ความกว้างคอลัมน์เลือก", "Width of the selection column"), type: "number | string", default: "48" },
            { property: "columnTitle", description: tr("หัวคอลัมน์เลือก", "Title of the selection column"), type: "ReactNode | ((originalNode) => ReactNode)", default: "-" },
            { property: "fixed", description: tr("ตรึงคอลัมน์เลือก", "Pin the selection column"), type: "boolean | 'left' | 'right'", default: "-" },
            { property: "renderCell", description: tr("render checkbox เอง", "Render the selection cell yourself"), type: "(checked, record, index, originNode) => ReactNode", default: "-" },
          ],
        },
        {
          title: "expandable",
          rows: [
            { property: "expandedRowRender", description: tr("เนื้อหาของแถวที่ขยาย", "Content of the expanded row"), type: "(record, index, indent, expanded) => ReactNode", default: "-" },
            { property: "rowExpandable", description: tr("แถวไหนขยายได้บ้าง", "Whether a row can be expanded"), type: "(record: T) => boolean", default: "-" },
            { property: "expandedRowKeys", description: tr("คีย์ที่ขยายอยู่ (controlled)", "Controlled expanded keys"), type: "Key[]", default: "-" },
            { property: "defaultExpandedRowKeys", description: tr("คีย์ที่ขยายไว้ตั้งแต่แรก", "Initially expanded keys"), type: "Key[]", default: "[]" },
            { property: "defaultExpandAllRows", description: tr("ขยายทุกแถวตั้งแต่แรก", "Expand every row on mount"), type: "boolean", default: "false" },
            { property: "onExpand", description: tr("เรียกเมื่อกดขยาย/ยุบ", "Fired when a row is expanded or collapsed"), type: "(expanded: boolean, record: T) => void", default: "-" },
            { property: "onExpandedRowsChange", description: tr("เรียกพร้อมคีย์ทั้งหมดที่ขยายอยู่", "Fired with the full list of expanded keys"), type: "(expandedKeys: Key[]) => void", default: "-" },
            { property: "expandIcon", description: tr("ไอคอนขยายแบบกำหนดเอง", "Custom expand icon"), type: "(props: ExpandIconProps<T>) => ReactNode", default: "-" },
            { property: "indentSize", description: tr("ระยะเยื้องต่อชั้นของ tree data (px)", "Indent per tree level, in px"), type: "number", default: "15" },
            { property: "expandRowByClick", description: tr("คลิกที่แถวเพื่อขยาย", "Expand the row by clicking anywhere on it"), type: "boolean", default: "false" },
            { property: "expandedRowClassName", description: tr("คลาสของแถวที่ขยาย", "Class name of the expanded row"), type: "string | ((record, index, indent) => string)", default: "-" },
            { property: "columnWidth", description: tr("ความกว้างคอลัมน์ไอคอนขยาย", "Width of the expand column"), type: "number | string", default: "48" },
            { property: "fixed", description: tr("ตรึงคอลัมน์ไอคอนขยาย", "Pin the expand column"), type: "boolean | 'left' | 'right'", default: "-" },
            { property: "showExpandColumn", description: tr("false = ไม่ต้องมีคอลัมน์ไอคอนขยาย", "false removes the expand column"), type: "boolean", default: "true" },
            { property: "childrenColumnName", description: tr("ชื่อฟิลด์ของข้อมูลลูกใน tree data", "Field holding tree children"), type: "string", default: "'children'" },
          ],
        },
        {
          title: "pagination",
          description: tr(
            "รับทุก prop ของ Pagination บวก position",
            "Accepts every Pagination prop plus position.",
          ),
          rows: [
            { property: "position", description: tr("ตำแหน่งแถบแบ่งหน้า", "Where to render the pagination bar"), type: "('topLeft'|'topCenter'|'topRight'|'bottomLeft'|'bottomCenter'|'bottomRight')[]", default: "['bottomRight']" },
            { property: "current / pageSize", description: tr("คุมหน้าและจำนวนต่อหน้าจากภายนอก", "Controlled page and page size"), type: "number", default: "-" },
            { property: "defaultCurrent / defaultPageSize", description: tr("ค่าเริ่มต้นแบบ uncontrolled", "Uncontrolled initial values"), type: "number", default: "1 / 10" },
            { property: "total", description: tr("จำนวนรายการทั้งหมด — ใส่เองเมื่อแบ่งหน้าที่ server", "Total number of records — set it when paging on the server"), type: "number", default: "dataSource.length" },
            { property: "showSizeChanger / showQuickJumper / showTotal", description: tr("ตัวเลือกเสริมของแถบแบ่งหน้า", "Extra controls of the pagination bar"), type: "boolean | object | function", default: "-" },
            { property: "onChange", description: tr("เรียกเมื่อเปลี่ยนหน้า (onChange ของ Table ก็ถูกเรียกด้วย)", "Fired on page change (Table.onChange fires too)"), type: "(page: number, pageSize: number) => void", default: "-" },
          ],
        },
        {
          title: "Statics",
          description: tr("ตัวช่วยที่แขวนไว้บน Table", "Helpers attached to Table."),
          rows: [
            { property: "Table.Column", description: tr("ประกาศคอลัมน์แบบ JSX", "Declare a column as JSX"), type: "<Table.Column title dataIndex … />", default: "-" },
            { property: "Table.ColumnGroup", description: tr("กลุ่มหัวคอลัมน์แบบ JSX", "Group header as JSX"), type: "<Table.ColumnGroup title>…</Table.ColumnGroup>", default: "-" },
            { property: "Table.Summary", description: tr("ตัว tfoot ของแถวสรุป มี .Row และ .Cell", "Renders the summary tfoot; has .Row and .Cell"), type: "{ fixed?: boolean | 'top' | 'bottom' }", default: "-" },
            { property: "Table.Summary.Cell", description: tr("เซลล์ของแถวสรุป", "One summary cell"), type: "{ index?, colSpan?, rowSpan?, align? }", default: "-" },
            { property: "Table.EXPAND_COLUMN", description: tr("วางในอาร์เรย์ columns เพื่อกำหนดตำแหน่งคอลัมน์ขยาย", "Put in columns to place the expand column"), type: "ColumnType", default: "-" },
            { property: "Table.SELECTION_COLUMN", description: tr("วางในอาร์เรย์ columns เพื่อกำหนดตำแหน่งคอลัมน์เลือก", "Put in columns to place the selection column"), type: "ColumnType", default: "-" },
            { property: "Table.SELECTION_ALL / SELECTION_INVERT / SELECTION_NONE", description: tr("คีย์ของเมนู selections มาตรฐาน", "Keys of the built-in selections menu items"), type: "string", default: "-" },
          ],
        },
      ]}
      related={[
        { title: tr("แบ่งหน้า", "Pagination"), path: "/components/pagination" },
        { title: tr("รายการ", "List"), path: "/components/list" },
        { title: tr("รายละเอียด", "Descriptions"), path: "/components/descriptions" },
      ]}
    />
  );
}
