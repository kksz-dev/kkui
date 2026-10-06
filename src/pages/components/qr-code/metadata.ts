import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "QRCode",
  description: tr("สร้างและแสดงภาพบาร์โค้ด Quick Response แบบ 2 มิติ", "Generate and display 2D Quick Response barcode images."),
  group: "Data Display",
  keywords: ["qr-code", "qrcode", "barcode", "canvas", "svg", "scanner"],
} satisfies RouteMeta;
