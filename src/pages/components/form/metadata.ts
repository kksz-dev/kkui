import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Form",
  description: tr(
    "ฟอร์มจัดการข้อมูล การตรวจสอบความถูกต้อง และการส่งข้อมูล",
    "High performance form with validation, layout management, and state hooks."
  ),
  group: "Data Entry",
  order: 4,
} satisfies RouteMeta;
