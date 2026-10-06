import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Table",
  description: tr(
    "ตารางแสดงข้อมูลระดับองค์กร พร้อมการเรียงลำดับ การเลือกแถว และแบ่งหน้า",
    "Enterprise table with sorting, row selection, expandable rows, and pagination."
  ),
  group: "Data Display",
  order: 1,
} satisfies RouteMeta;
