import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Chart",
  description: tr(
    "กราฟเส้น พื้นที่ แท่ง โดนัท และ sparkline วาดด้วย SVG ใช้สีจากโทเคน chart-1..5",
    "Line, area, bar, donut and sparkline charts drawn in SVG from the chart-1..5 tokens.",
  ),
  group: "Data Display",
  order: 24,
  keywords: ["chart", "graph", "line", "bar", "donut", "sparkline", "analytics"],
} satisfies RouteMeta;
