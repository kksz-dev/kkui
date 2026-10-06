import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "List",
  description: tr("แสดงข้อมูลแบบรายการอย่างเรียบง่าย", "Simple list information display."),
  group: "Data Display",
  keywords: ["list", "feed", "items", "collection", "grid", "infinite"],
} satisfies RouteMeta;
