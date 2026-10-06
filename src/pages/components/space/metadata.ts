import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Space",
  description: tr("กำหนดระยะห่างระหว่างคอมโพเนนต์", "Set components spacing."),
  group: "Layout",
  order: 4,
  keywords: ["gap", "spacing", "compact", "group", "inline"],
} satisfies RouteMeta;
