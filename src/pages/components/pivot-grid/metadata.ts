import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "PivotGrid",
  description: tr(
    "ตารางวิเคราะห์ข้อมูลหลายมิติ Cross-tabulation สรุปผลรวมตามมิติแถวและคอลัมน์อัตโนมัติ",
    "Multi-dimensional cross-tabulation matrix with automatic row, column, and grand total aggregations."
  ),
  group: "Data Display",
  order: 7,
} satisfies RouteMeta;
