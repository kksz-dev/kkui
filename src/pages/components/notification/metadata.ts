import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Notification",
  description: tr(
    "การแจ้งเตือนแบบการ์ดพร้อมหัวข้อและคำอธิบายบริเวณมุมหน้าจอ",
    "Rich floating notification cards with title and description at screen corners."
  ),
  group: "Feedback",
  order: 4,
} satisfies RouteMeta;
