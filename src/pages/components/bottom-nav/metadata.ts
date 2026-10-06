import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "BottomNav",
  description: tr(
    "แถบนำทางล่างสำหรับมือถือ ไอคอนพร้อมป้ายแจ้งเตือน และเผื่อพื้นที่ safe area",
    "Bottom navigation for mobile: icons with badges, safe-area aware.",
  ),
  group: "Navigation",
  order: 4,
  keywords: ["tabbar", "bottom navigation", "mobile"],
} satisfies RouteMeta;
