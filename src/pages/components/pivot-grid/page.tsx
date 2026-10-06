import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import NestedDemo from "./demos/nested";
import nestedCode from "./demos/nested.tsx?raw";
import FieldChooserDemo from "./demos/field-chooser";
import field_chooserCode from "./demos/field-chooser.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="pivot-grid"
      defaultDemoSize="full"
      imports={['PivotGrid', 'type PivotGridField', 'type PivotGridProps']}
      whenToUse={tr(
        <p>ใช้วิเคราะห์ข้อมูลหลายมิติ ตารางยอดขาย และรายงานแบบไขว้</p>,
        <p>Use for multi-dimensional business analytics, sales matrices, and cross-tabulated reports.</p>,
      )}
      demos={[
        {
          title: tr("ตารางไขว้ (Pivot)", "Cross-tabulation PivotGrid"),
          description: tr("สรุปข้อมูลหลายมิติ แสดงจุดตัดแถว/คอลัมน์และยอดรวม", "Multi-dimensional aggregation showing row/column intersections and grand totals."),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("ฟิลด์ซ้อนและหลายค่าวัด", "Nested Fields and Multiple Measures"),
          description: tr("ฟิลด์แถวสองชั้น ฟิลด์คอลัมน์สองชั้น และค่าวัดสองตัวต่อช่อง", "Two row fields, two column fields and two measures per intersection."),
          code: nestedCode,
          component: <NestedDemo />,
        },
        {
          title: tr("เลือกฟิลด์และเจาะข้อมูล", "Field Chooser and Drill-down"),
          description: tr("ย้ายฟิลด์ระหว่างพื้นที่ แล้วคลิกช่องเพื่อดูรายการที่อยู่เบื้องหลัง", "Move fields between areas, then click a cell for the records behind it."),
          code: field_chooserCode,
          component: <FieldChooserDemo />,
        },
      ]}
      api={[
        {
          title: "PivotGrid",
          rows: [
            { property: "dataSource", description: "Array of data records", type: "T[]", default: "[]" },
            { property: "fields", description: "Dimension field configurations (row, column, data)", type: "PivotGridField[]", default: "[]" },
            { property: "showRowTotals / showColumnTotals / showGrandTotal", description: "Total placement", type: "boolean", default: "true" },
            { property: "fieldChooser", description: "Let the user move fields between areas", type: "boolean", default: "false" },
            { property: "onFieldsChange", description: "Field areas changed (controlled mode)", type: "(fields) => void", default: "-" },
            { property: "onCellClick", description: "Drill-down: rowPath, columnPath, field and matching records", type: "(info) => void", default: "-" },
          ],
        },
      ]}
    />
  );
}
