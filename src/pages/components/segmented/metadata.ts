import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Segmented",
  description: tr(
    "สลับระหว่างตัวเลือกที่เลือกได้ทีละอย่างในแถบเดียว",
    "Segmented Controls allow users to switch between linear sets of mutually exclusive options."
  ),
  group: "Data Display",
  keywords: ["segmented", "tabs", "switch", "toggle", "button group", "radio"],
} satisfies RouteMeta;
