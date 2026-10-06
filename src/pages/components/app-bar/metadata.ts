import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "AppBar",
  description: tr(
    "แถบบนสุดของแอป: โลโก้ เมนูหลัก ปุ่มลัด และปุ่มเปิดเมนูฝั่งมือถือ",
    "Top application bar: brand, primary navigation, action slot and a mobile menu button.",
  ),
  group: "Navigation",
  order: 1,
  keywords: ["navbar", "header", "topbar", "appbar"],
} satisfies RouteMeta;
