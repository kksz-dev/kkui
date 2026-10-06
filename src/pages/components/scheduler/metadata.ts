import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Scheduler",
  description: tr(
    "ปฏิทินตารางนัดหมายและจัดการเหตุการณ์ รองรับมุมมอง Month, Week, Day และสร้างนัดหมาย",
    "Interactive calendar scheduler with Month, Week, Day, Agenda views, event colors, and quick creation modal."
  ),
  group: "Data Display",
  order: 5,
} satisfies RouteMeta;
