import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Ribbon",
  description: tr(
    "แถบคำสั่งแบ่งแท็บและหมวดหมู่ สไตล์ Office Command Ribbon",
    "Tabbed contextual command ribbon / action toolbar for rich applications."
  ),
  group: "Layout",
  order: 11,
  keywords: ["toolbar", "command bar", "office", "tabs", "contextual", "quick access"],
} satisfies RouteMeta;
