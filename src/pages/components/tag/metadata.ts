import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Tag",
  description: tr("ใช้ติดป้ายและจัดหมวดหมู่", "Used for marking and categorization."),
  group: "Data Display",
  keywords: ["label", "chip", "category", "checkable"],
} satisfies RouteMeta;
