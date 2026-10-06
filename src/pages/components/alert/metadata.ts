import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Alert",
  description: tr("แสดงข้อความแจ้งเตือนที่ต้องการความสนใจ", "Display warning messages that require attention."),
  group: "Feedback",
  keywords: ["message", "banner", "warning", "error", "notice"],
} satisfies RouteMeta;
