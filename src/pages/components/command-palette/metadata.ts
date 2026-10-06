import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "CommandPalette",
  description: tr(
    "กล่องคำสั่งด่วนแบบ ⌘K ค้นหาและสั่งงานได้จากคีย์บอร์ดล้วน",
    "A ⌘K command box: search and run anything from the keyboard.",
  ),
  group: "Navigation",
  order: 5,
  keywords: ["command", "palette", "spotlight", "search"],
} satisfies RouteMeta;
