import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Radio",
  description: tr("ใช้เลือกค่าเดียวจากหลายตัวเลือก", "Used to select a single state from multiple options."),
  group: "Data Entry",
  keywords: ["radio", "option", "single", "button group"],
} satisfies RouteMeta;
