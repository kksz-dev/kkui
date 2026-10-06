import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Collapse",
  description: tr("พื้นที่เนื้อหาที่ขยายและยุบได้", "A content area which can be collapsed and expanded."),
  group: "Data Display",
  keywords: ["collapse", "accordion", "panel", "fold", "drawer"],
} satisfies RouteMeta;
