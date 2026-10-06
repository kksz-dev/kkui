import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Affix",
  description: tr("ตรึงองค์ประกอบไว้กับ viewport ขณะเลื่อนหน้า", "Stick an element to the viewport."),
  group: "Other",
  keywords: ["sticky", "fixed", "pin", "scroll"],
} satisfies RouteMeta;
