import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Result",
  description: tr("แจ้งผลลัพธ์ของขั้นตอนการทำงานทั้งชุด", "Used to feed back the results of a series of operational tasks."),
  group: "Feedback",
  keywords: ["success", "error", "404", "403", "500", "exception"],
} satisfies RouteMeta;
