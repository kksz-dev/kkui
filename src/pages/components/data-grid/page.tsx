import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import GroupingDemo from "./demos/grouping";
import groupingCode from "./demos/grouping.tsx?raw";
import MasterDetailDemo from "./demos/master-detail";
import masterDetailCode from "./demos/master-detail.tsx?raw";
import VirtualDemo from "./demos/virtual";
import virtualCode from "./demos/virtual.tsx?raw";
import LoadingStateDemo from "./demos/loading-state";
import loadingStateCode from "./demos/loading-state.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="data-grid"
      defaultDemoSize="full"
      imports={["DataGrid", "type DataGridColumn", "type DataGridProps"]}
      whenToUse={tr(
        <p>ใช้กับชุดข้อมูลองค์กรที่ต้องการตรึงคอลัมน์ จัดกลุ่ม กรอง สรุปยอด แถวรายละเอียด และส่งออก CSV ฝั่งเบราว์เซอร์</p>,
        <p>
          Use when dealing with complex enterprise datasets requiring column pinning, grouping, filtering, summaries,
          master-detail rows, and client-side CSV exports.
        </p>,
      )}
      demos={[
        {
          title: tr("ตารางข้อมูลระดับองค์กร", "Enterprise DataGrid"),
          description: tr("ตารางครบเครื่อง ตรึงคอลัมน์ สรุปยอด และแถบเครื่องมือ", "Full-featured data grid with column pinning, summaries, and toolbar controls."),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("จัดกลุ่มและสรุปยอด", "Grouping and Summaries"),
          description: tr("จัดกลุ่มแถวตามคอลัมน์ พับกลุ่มได้ และแถวสรุปยังคำนวณต่อ", "Group rows by one or more columns; group headers fold and the footer keeps aggregating."),
          code: groupingCode,
          component: <GroupingDemo />,
        },
        {
          title: tr("แถวรายละเอียดและคอลัมน์ตรึง", "Master-Detail and Pinned Columns"),
          description: tr("กางแถวเพื่อดูรายละเอียด โดยคอลัมน์แรกและสุดท้ายยังตรึงอยู่", "Expand a row for its detail panel while the first and last columns stay pinned."),
          code: masterDetailCode,
          component: <MasterDetailDemo />,
        },
        {
          title: tr("เลื่อนแบบ virtual", "Virtual Scrolling"),
          description: tr("5,000 แถว เรนเดอร์เฉพาะที่มองเห็น แทนการแบ่งหน้า", "5,000 rows rendered through a fixed-height window instead of pagination."),
          code: virtualCode,
          component: <VirtualDemo />,
        },
        {
          title: tr("สถานะกำลังโหลดและไม่มีข้อมูล", "Loading and Empty States"),
          description: tr("เนื้อตารางจางลงพร้อมตัวหมุนระหว่างรอข้อมูล", "The body dims behind a spinner while data is in flight."),
          code: loadingStateCode,
          component: <LoadingStateDemo />,
        },
      ]}
      api={[
        {
          title: "DataGrid",
          rows: [
            { property: "columns", description: "Array of column definition objects", type: "DataGridColumn[]", default: "[]" },
            { property: "dataSource", description: "Array of data records", type: "T[]", default: "[]" },
            { property: "rowKey", description: "Unique key identifier in each row", type: "string | (record) => string", default: "'id'" },
            { property: "loading", description: "Dim the body and show a spinner", type: "boolean", default: "false" },
            { property: "pagination", description: "Pager config, or false to switch it off", type: "boolean | { pageSize, current, pageSizeOptions }", default: "true" },
            { property: "selectable", description: "Enable multi-row checkbox selection", type: "boolean", default: "true" },
            { property: "selectedRowKeys", description: "Controlled selection", type: "(string | number)[]", default: "-" },
            { property: "groupBy", description: "Column keys to group rows by", type: "string[]", default: "[]" },
            { property: "onGroupByChange", description: "Grouping changed from the column menu or a chip", type: "(keys) => void", default: "-" },
            { property: "expandable", description: "Master-detail row renderer", type: "{ expandedRowRender, rowExpandable, defaultExpandedRowKeys }", default: "-" },
            { property: "virtual", description: "Window the rows instead of paginating", type: "boolean", default: "false" },
            { property: "height", description: "Body height; required with virtual", type: "number", default: "-" },
            { property: "columnChooser", description: "Show the column visibility menu", type: "boolean", default: "true" },
            { property: "density", description: "Row density", type: "'compact' | 'middle' | 'comfortable'", default: "'middle'" },
            { property: "showSummary", description: "Render the aggregate footer row (sum, avg, count, min, max)", type: "boolean", default: "true" },
            { property: "toolbar", description: "Show the toolbar: search, columns, density, fullscreen, CSV export", type: "boolean", default: "true" },
            { property: "onChange", description: "Sort / filter / page / grouping changed", type: "(state: DataGridState) => void", default: "-" },
            { property: "onRowClick", description: "A body row was clicked", type: "(record, index) => void", default: "-" },
          ],
        },
        {
          title: "DataGridColumn",
          rows: [
            { property: "key", description: "Column identity", type: "string", default: "-" },
            { property: "dataIndex", description: "Field read from the record", type: "string", default: "key" },
            { property: "width / minWidth", description: "Sizing hints; width is also set by dragging the header edge", type: "number | string", default: "-" },
            { property: "pin", description: "Freeze the column on one side", type: "'left' | 'right' | false", default: "false" },
            { property: "sortable", description: "Show the sort control", type: "boolean", default: "true" },
            { property: "sorter", description: "Custom comparator", type: "(a, b) => number", default: "-" },
            { property: "filterable", description: "Offer a per-column filter box", type: "boolean", default: "false" },
            { property: "groupable", description: "Offer grouping in the column menu", type: "boolean", default: "false" },
            { property: "resizable", description: "Allow width dragging", type: "boolean", default: "true" },
            { property: "hidden", description: "Start hidden in the column chooser", type: "boolean", default: "false" },
            { property: "render", description: "Cell renderer", type: "(value, record, index) => ReactNode", default: "-" },
            { property: "summary", description: "Footer aggregate", type: "'sum' | 'avg' | 'count' | 'min' | 'max' | (rows) => ReactNode", default: "-" },
            { property: "exportTitle", description: "Plain-text header used by CSV export", type: "string", default: "title" },
          ],
        },
      ]}
    />
  );
}
