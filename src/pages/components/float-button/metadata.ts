import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "FloatButton",
  description: tr(
    "ปุ่มลอยสำหรับคำสั่งด่วนหรือปุ่มกลับสู่ด้านบน (BackTop)",
    "Floating action buttons for global shortcuts and BackTop triggers."
  ),
  group: "General",
  order: 3,
} satisfies RouteMeta;
