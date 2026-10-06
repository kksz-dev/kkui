import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Combobox",
  description: tr(
    "ช่องเลือกที่ค้นหาในตัว รองรับกลุ่ม คำอธิบาย และสร้างค่าใหม่ที่ยังไม่มีในรายการ",
    "A select that searches inside itself, with groups, descriptions and creating values that are not on the list.",
  ),
  group: "Data Entry",
  order: 21,
  keywords: ["combobox", "search select", "autocomplete"],
} satisfies RouteMeta;
