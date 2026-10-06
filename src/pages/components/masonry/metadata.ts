import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Masonry",
  description: tr(
    "เลย์เอาต์การจัดเรียงการ์ดแบบน้ำตก (Waterfall Layout) ปรับความสูงตามเนื้อหาจริงอัตโนมัติ",
    "Responsive waterfall masonry grid distributing cards dynamically across columns."
  ),
  group: "Layout",
  order: 9,
} satisfies RouteMeta;
