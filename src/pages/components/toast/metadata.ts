import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Toast",
  description: tr(
    "แจ้งเตือนแบบซ้อนกองที่มุมจอ ปัดทิ้งได้ และมี API สำหรับ promise",
    "Stacked corner notifications: swipe to dismiss, with a promise API.",
  ),
  group: "Feedback",
  order: 6,
  keywords: ["toast", "sonner", "snackbar", "notification"],
} satisfies RouteMeta;
