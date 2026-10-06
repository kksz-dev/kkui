import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Calendar",
  description: tr(
    "ปฏิทินแสดงผลแบบเต็มหน้าจอหรือแบบการ์ด",
    "Full calendar view for displaying schedules and events."
  ),
  group: "Data Display",
  order: 2,
} satisfies RouteMeta;
