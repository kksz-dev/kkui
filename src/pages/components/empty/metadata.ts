import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Empty",
  description: tr("สถานะว่างสำหรับตอนที่ไม่มีข้อมูลให้แสดง", "Empty state placeholder when there is no data to display."),
  group: "Data Display",
  order: 10,
  keywords: ["empty", "nodata", "placeholder", "blank"],
} satisfies RouteMeta;
