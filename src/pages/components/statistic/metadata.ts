import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Statistic",
  description: tr("แสดงตัวเลขสถิติให้อ่านง่าย", "Display statistic numbers clearly."),
  group: "Data Display",
  keywords: ["statistic", "number", "count", "countdown", "timer", "kpi"],
} satisfies RouteMeta;
