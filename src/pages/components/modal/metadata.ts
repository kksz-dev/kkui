import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Modal",
  description: tr(
    "หน้าต่างป๊อปอัปสำหรับแจ้งข้อมูล ยืนยันการทำงาน หรือจัดการฟอร์ม",
    "Modal dialogs for critical confirmations, alerts, or complex forms."
  ),
  group: "Feedback",
  order: 1,
} satisfies RouteMeta;
