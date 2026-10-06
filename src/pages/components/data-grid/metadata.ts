import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "DataGrid",
  description: tr(
    "ตารางจัดการข้อมูลขั้นสูงระดับ Enterprise รองรับ Column Pinning, Sorting, Grouping, Summaries และ Export CSV",
    "Enterprise DataGrid with column pinning, resizing, multi-column sorting, summaries, density switcher, and CSV export."
  ),
  group: "Data Display",
  order: 2,
} satisfies RouteMeta;
