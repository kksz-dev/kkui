import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Progress",
  description: tr("แสดงความคืบหน้าปัจจุบันของขั้นตอนการทำงาน", "Display the current progress of an operation flow."),
  group: "Feedback",
  order: 6,
  keywords: ["progress", "bar", "circle", "percent", "rate", "dashboard"],
} satisfies RouteMeta;
