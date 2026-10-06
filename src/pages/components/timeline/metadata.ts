import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Timeline",
  description: tr(
    "แสดงลำดับเหตุการณ์ของกิจกรรมในแนวตั้ง เรียงตามเวลา",
    "Vertical display timeline of an activity in chronological order."
  ),
  group: "Data Display",
  keywords: ["timeline", "history", "chronological", "activity", "log"],
} satisfies RouteMeta;
