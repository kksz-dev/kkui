import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "PageHeader",
  description: tr(
    "หัวหน้าเพจ: เส้นทาง ชื่อเรื่อง คำอธิบาย แท็ก และปุ่มการกระทำ",
    "Page header: breadcrumb, title, subtitle, tags and the page's actions.",
  ),
  group: "Navigation",
  order: 3,
  keywords: ["page header", "title", "toolbar"],
} satisfies RouteMeta;
