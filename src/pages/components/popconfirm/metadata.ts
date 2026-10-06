import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Popconfirm",
  description: tr(
    "กล่องยืนยันการทำงานแบบ Popover ขนาดกะทัดรัด",
    "Compact popover confirmation dialog bound to target elements."
  ),
  group: "Feedback",
  order: 5,
} satisfies RouteMeta;
