import type { RouteMeta } from "@/types";

export default {
  title: "Portal",
  description: {
    th: "ย้าย children ไป render ที่ DOM node อื่น ใช้เป็นฐานของ popup ทุกตัวในไลบรารี",
    en: "Render children into another DOM node — the base every popup in the library sits on.",
  },
  group: "Other",
  order: 2,
  keywords: ["portal", "createPortal", "overlay", "teleport", "container"],
} satisfies RouteMeta;
