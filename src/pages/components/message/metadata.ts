import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Message",
  description: tr(
    "การแจ้งเตือนสั้นๆ บริเวณกึ่งกลางด้านบนของหน้าจอ",
    "Global toast messages positioned at the top center."
  ),
  group: "Feedback",
  order: 3,
} satisfies RouteMeta;
