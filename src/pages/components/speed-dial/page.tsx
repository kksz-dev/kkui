import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import DirectionsDemo from "./demos/directions";
import directionsCode from "./demos/directions.tsx?raw";
import HoverDemo from "./demos/hover";
import hoverCode from "./demos/hover.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="speed-dial"
      imports={['SpeedDial', 'type SpeedDialAction', 'type SpeedDialProps']}
      whenToUse={tr(
        <p>ใช้เมื่อมีคำสั่งหลักหลายอย่างที่ควรรวมไว้ใต้ปุ่มลอยปุ่มเดียว</p>,
        <p>Use when multiple related primary actions can be grouped under a single floating action button.</p>,
      )}
      demos={[
        {
          title: tr("ปุ่มลอยแบบกางเมนู", "Speed Dial FAB"),
          description: tr("ปุ่มลอยที่กางเมนูย่อยพร้อมอนิเมชัน", "Floating action button with animated expansion."),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("ทิศทางการกาง", "Directions"),
          description: tr("กางขึ้น ลง ซ้าย หรือขวา พร้อมป้ายกำกับที่ตามทิศ", "The rail opens up, down, left or right, and labels follow it."),
          code: directionsCode,
          component: <DirectionsDemo />,
        },
        {
          title: tr("เปิดด้วยการชี้", "Hover Trigger"),
          description: tr("เปิดเมื่อชี้ มีช่วงผ่อนผันตอนเมาส์เดินทาง และค้างไว้ระหว่างสั่งงาน", "Opens on hover with a grace period, and stays open while actions fire."),
          code: hoverCode,
          component: <HoverDemo />,
        },
      ]}
      api={[
        {
          title: "SpeedDial",
          rows: [
            { property: "actions", description: "Array of sub-action items", type: "SpeedDialAction[]", default: "[]" },
            { property: "direction", description: "Expand direction", type: "'up' | 'down' | 'left' | 'right'", default: "'up'" },
            { property: "trigger", description: "Trigger mode", type: "'click' | 'hover'", default: "'click'" },
            { property: "keepOpenOnAction", description: "Leave the dial open after an action fires", type: "boolean", default: "false" },
            { property: "open / onOpenChange", description: "Controlled open state", type: "boolean / (open) => void", default: "-" },
            { property: "aria-label", description: "Accessible name for the trigger and menu", type: "string", default: "'Quick actions'" },
          ],
        },
      ]}
    />
  );
}
