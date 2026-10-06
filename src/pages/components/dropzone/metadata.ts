import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Dropzone",
  description: tr(
    "พื้นที่ลากวางอัปโหลดไฟล์หลายไฟล์ พร้อมแถบความคืบหน้าและการพรีวิวรูปภาพ",
    "Drag and drop multi-file upload zone with size validation and instant image previews."
  ),
  group: "Data Entry",
  order: 15,
} satisfies RouteMeta;
