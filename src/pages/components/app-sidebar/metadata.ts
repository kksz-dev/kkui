import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "AppSidebar",
  description: tr(
    "แถบนำทางด้านข้างของแอป พับเป็นแถบไอคอนได้ รองรับเมนูซ้อนและโหมดลิ้นชักที่ caller ควบคุม",
    "Application sidebar with nested items, a collapsed icon rail, and a caller-controlled drawer mode.",
  ),
  group: "Navigation",
  order: 2,
  keywords: ["sidebar", "sider", "navigation", "menu"],
} satisfies RouteMeta;
