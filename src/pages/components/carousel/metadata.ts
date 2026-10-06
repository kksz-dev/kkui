import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Carousel",
  description: tr(
    "สไลด์ข้อความหรือรูปภาพ แสดงทีละสไลด์",
    "A carousel of text or images. One slide is shown at a time."
  ),
  group: "Data Display",
  order: 2,
  keywords: ["carousel", "slider", "banner", "swiper", "slideshow"],
} satisfies RouteMeta;
