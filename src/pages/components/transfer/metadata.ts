import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Transfer",
  description: tr("กล่องเลือกและย้ายรายการระหว่างสองคอลัมน์", "Double column transfer choice box."),
  group: "Data Entry",
  keywords: ["transfer", "shuttle", "dual-list", "picker", "move"],
} satisfies RouteMeta;
