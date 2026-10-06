import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "DatePicker",
  description: tr(
    "กล่องเลือกวันที่และช่วงวันที่แบบยืดหยุ่น",
    "Date picker and range picker with presets, validation, and formats."
  ),
  group: "Data Entry",
  order: 1,
} satisfies RouteMeta;
