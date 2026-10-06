import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "TimePicker",
  description: tr(
    "กล่องเลือกเวลา (ชั่วโมง นาที วินาที)",
    "Time picker for selecting hour, minute, and second values."
  ),
  group: "Data Entry",
  order: 2,
} satisfies RouteMeta;
