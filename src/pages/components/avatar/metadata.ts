import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Avatar",
  description: tr(
    "Avatar ใช้แทนบุคคลหรือวัตถุ รองรับรูปภาพ ไอคอน หรือตัวอักษร",
    "Avatars can be used to represent people or objects. It supports images, icons, or letters.",
  ),
  group: "Data Display",
  order: 5,
  keywords: ["avatar", "user", "profile", "image", "icon"],
} satisfies RouteMeta;
