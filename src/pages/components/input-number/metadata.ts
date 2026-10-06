import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "InputNumber",
  description: tr(
    "กรอกตัวเลขในช่วงที่กำหนด ด้วยเมาส์หรือ keyboard",
    "Enter a number within certain range with the mouse or keyboard."
  ),
  group: "Data Entry",
  keywords: ["number", "numeric", "step", "spinner"],
} satisfies RouteMeta;
