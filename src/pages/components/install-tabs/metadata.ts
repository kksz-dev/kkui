import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "InstallTabs",
  description: tr(
    "คำสั่งติดตั้งแยกแท็บตาม package manager จำค่าที่ผู้อ่านเลือกไว้",
    "The install command per package manager, remembering the reader's choice.",
  ),
  group: "Other",
  order: 8,
  keywords: ["install", "npm", "pnpm", "bun", "yarn", "code"],
} satisfies RouteMeta;
