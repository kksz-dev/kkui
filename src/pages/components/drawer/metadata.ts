import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Drawer",
  description: tr(
    "แผงเลื่อนเปิดจากขอบหน้าจอ สำหรับดูรายละเอียดหรือกรอกข้อมูลเพิ่มเติม",
    "Sliding panel from screen edges for side content or detail views."
  ),
  group: "Feedback",
  order: 2,
} satisfies RouteMeta;
