import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Spin",
  description: tr(
    "สปินเนอร์บอกสถานะกำลังโหลดของหน้าหรือบางส่วนของหน้า",
    "A spinner for displaying loading state of a page or a section."
  ),
  group: "Feedback",
  order: 4,
  keywords: ["spin", "spinner", "loading", "progress", "waiting"],
} satisfies RouteMeta;
