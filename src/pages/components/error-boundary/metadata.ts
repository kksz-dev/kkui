import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "ErrorBoundary",
  description: tr(
    "กันไม่ให้ error ในส่วนเดียวพาทั้งหน้าขาว แสดงกล่องแจ้งพร้อมปุ่มลองใหม่",
    "Keeps one failing section from blanking the page: shows a panel with a retry.",
  ),
  group: "Feedback",
  order: 7,
  keywords: ["error", "boundary", "fallback", "crash"],
} satisfies RouteMeta;
