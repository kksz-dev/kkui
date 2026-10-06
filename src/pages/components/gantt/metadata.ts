import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Gantt",
  description: tr(
    "แผนผังกำหนดการโครงการ แสดงแถบระยะเวลา วันเริ่มต้น-สิ้นสุด และความคืบหน้ารายงาน",
    "Gantt project schedule chart with duration bars, start/end dates, and progress indicators."
  ),
  group: "Data Display",
  order: 6,
} satisfies RouteMeta;
