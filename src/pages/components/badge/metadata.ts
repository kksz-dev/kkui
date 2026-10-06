import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Badge",
  description: tr(
    "ตัวเลขขนาดเล็กหรือสถานะกำกับ element ใน UI",
    "Small numerical value or status descriptor for UI elements.",
  ),
  group: "Data Display",
  keywords: ["count", "dot", "status", "ribbon", "notification"],
} satisfies RouteMeta;
