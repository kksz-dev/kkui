import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "StatCard",
  description: tr(
    "การ์ดสรุปตัวเลขสถิติและ KPI พร้อมตัวเลขนับขึ้นแอนิเมชัน เทรนด์ และ Sparkline",
    "KPI metric statistic card with animated CountUp numbers, trend indicators, and SVG mini sparklines."
  ),
  group: "Data Display",
  order: 8,
} satisfies RouteMeta;
