import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Slider",
  description: tr(
    "แถบเลื่อนสำหรับเลือกค่าตัวเลขหรือช่วงค่าภายในขอบเขตที่กำหนด",
    "A slider for picking a value — or a range of values — inside a given interval.",
  ),
  group: "Data Entry",
  keywords: ["range", "number", "track", "slider"],
} satisfies RouteMeta;
