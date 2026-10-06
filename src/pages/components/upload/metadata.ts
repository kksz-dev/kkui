import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Upload",
  description: tr(
    "การอัปโหลดไฟล์ด้วยการคลิกหรือลากวาง",
    "File upload with click selection, drag and drop, and picture lists."
  ),
  group: "Data Entry",
  order: 3,
} satisfies RouteMeta;
