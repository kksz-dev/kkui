import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Mentions",
  description: tr("ใช้กล่าวถึงบุคคลหรือสิ่งต่าง ๆ ภายในช่องกรอกข้อมูล", "Used to mention someone or something in an input."),
  group: "Data Entry",
  keywords: ["@", "mention", "tag", "autocomplete", "textarea"],
} satisfies RouteMeta;
