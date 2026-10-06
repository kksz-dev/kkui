import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Flex",
  description: tr("คอนเทนเนอร์ flex สำหรับจัดวางและจัดตำแหน่ง", "A flex layout container for alignment."),
  group: "Layout",
  order: 2,
  keywords: ["flexbox", "layout", "align", "justify", "gap"],
} satisfies RouteMeta;
