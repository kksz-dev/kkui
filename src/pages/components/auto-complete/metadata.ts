import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "AutoComplete",
  description: tr("ช่องกรอกข้อความพร้อมคำแนะนำอัตโนมัติ", "Autocomplete function of input field."),
  group: "Data Entry",
  keywords: ["suggest", "typeahead", "combobox"],
} satisfies RouteMeta;
