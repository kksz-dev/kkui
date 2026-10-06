import type { RouteMeta } from "@/types";
import { tr } from "@/i18n/locale";

export default {
  title: "Map",
  description: tr(
    "แผนที่ไทล์ ลากเลื่อน ซูม และปักหมุดพร้อมป๊อปอัป เขียนด้วย SVG/DOM ล้วน ไม่พึ่งไลบรารีแผนที่",
    "A tile map with panning, zooming and markers — no mapping library.",
  ),
  group: "Data Display",
  order: 25,
  keywords: ["map", "leaflet", "openstreetmap", "location", "marker"],
} satisfies RouteMeta;
