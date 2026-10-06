import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Image",
  description: tr(
    "รูปภาพที่กดดูแบบ preview ได้ พร้อมซูม หมุน พลิก และรวมเป็นแกลเลอรี",
    "Previewable image component with zoom, rotate, flip, and gallery groups."
  ),
  group: "Data Display",
  order: 5,
  keywords: ["image", "photo", "picture", "preview", "gallery", "zoom"],
} satisfies RouteMeta;
