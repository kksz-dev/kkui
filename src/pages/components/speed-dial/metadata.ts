import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "SpeedDial",
  description: tr(
    "ปุ่มลอยกระจายคำสั่ง Floating Action Hub พร้อมการหมุนและแอนิเมชันสปริง",
    "Floating Action Button hub that springs out contextual actions with tooltips."
  ),
  group: "Navigation",
  order: 10,
} satisfies RouteMeta;
