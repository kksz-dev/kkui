import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Switch",
  description: tr("ตัวเลือกแบบสลับสถานะ", "Switching Selector."),
  group: "Data Entry",
  keywords: ["toggle", "state", "switch", "slider"],
} satisfies RouteMeta;
