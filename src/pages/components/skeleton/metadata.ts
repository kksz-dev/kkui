import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Skeleton",
  description: tr(
    "แสดง placeholder ในพื้นที่นั้นระหว่างรอเนื้อหาโหลด",
    "Provide a placeholder at the area while you wait for content to load."
  ),
  group: "Feedback",
  order: 5,
  keywords: ["skeleton", "placeholder", "loading", "shimmer", "bone"],
} satisfies RouteMeta;
