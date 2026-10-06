import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Placement from "./demos/placement";
import placementCode from "./demos/placement.tsx?raw";
import Async from "./demos/async";
import asyncCode from "./demos/async.tsx?raw";
import CustomIcon from "./demos/custom-icon";
import customIconCode from "./demos/custom-icon.tsx?raw";
import Controlled from "./demos/controlled";
import controlledCode from "./demos/controlled.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="popconfirm"
      imports={["Popconfirm", "type PopconfirmProps"]}
      whenToUse={tr(
        <p>ใช้เมื่อการทำงานต้องการการยืนยันสั้น ๆ ด้วยการคลิก โดยไม่ต้องเปิด modal เต็มรูปแบบ เหมาะกับการยืนยันการลบหรือดำเนินการต่อที่ส่งผลกระทบ</p>,
        <p>Use when an action requires a simple click confirmation without a full modal dialog. Ideal for delete confirmations and impact operations.</p>,
      )}
      demos={[
        {
          title: tr("การใช้งานพื้นฐาน", "Basic Popconfirm"),
          description: tr("ถามยืนยันก่อนลบงานด้วยปุ่ม OK / Cancel", "Ask for confirmation before deleting a task."),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("ตำแหน่งการแสดงผล", "Placement"),
          description: tr("รองรับตำแหน่ง 12 ทิศทางรอบองค์ประกอบเป้าหมาย", "Supports 12 placement directions around the trigger element."),
          code: placementCode,
          component: <Placement />,
        },
        {
          title: tr("การทำงานแบบ Asynchronous", "Asynchronous Action"),
          description: tr("รองรับการคืนค่า Promise ใน onConfirm พร้อมแสดง loading indicator บนปุ่ม", "Supports returning a Promise in onConfirm with automatic loading state on the confirm button."),
          code: asyncCode,
          component: <Async />,
        },
        {
          title: tr("กำหนดไอคอนและปุ่มเอง", "Custom Icon & Styling"),
          description: tr("เปลี่ยนไอคอนการเตือน และเลือกรูปแบบปุ่มยืนยัน", "Customize the icon and confirm button type."),
          code: customIconCode,
          component: <CustomIcon />,
        },
        {
          title: tr("ควบคุมการเปิด/ปิด", "Controlled / Conditional"),
          description: tr("ควบคุมสถานะการเปิด/ปิดผ่าน state หรือเงื่อนไข", "Control open state conditionally with external state."),
          code: controlledCode,
          component: <Controlled />,
        },
      ]}
      api={[
        {
          title: "Popconfirm",
          rows: [
            { property: "title", description: "The title of the confirmation box", type: "ReactNode", default: "-" },
            { property: "description", description: "The description of confirmation", type: "ReactNode", default: "-" },
            { property: "icon", description: "Customize the popup icon", type: "ReactNode", default: "<HelpCircle />" },
            { property: "open", description: "Whether the popconfirm is visible (controlled)", type: "boolean", default: "-" },
            { property: "defaultOpen", description: "Whether the popconfirm is visible by default", type: "boolean", default: "false" },
            { property: "onOpenChange", description: "Callback executed when visibility changes", type: "(open: boolean) => void", default: "-" },
            { property: "onConfirm", description: "Callback when clicking confirm (supports returning Promise)", type: "(e: MouseEvent) => void | Promise<any>", default: "-" },
            { property: "onCancel", description: "Callback when clicking cancel", type: "(e: MouseEvent) => void", default: "-" },
            { property: "okText", description: "Text of the OK button", type: "ReactNode", default: "'OK'" },
            { property: "cancelText", description: "Text of the Cancel button", type: "ReactNode", default: "'Cancel'" },
            { property: "okType", description: "Button type of the OK button", type: "'primary' | 'default' | 'dashed' | 'link' | 'text' | 'danger'", default: "'primary'" },
            { property: "showCancel", description: "Whether to show the Cancel button", type: "boolean", default: "true" },
            { property: "placement", description: "The position of the popup relative to the target", type: "TooltipPlacement", default: "'top'" },
            { property: "trigger", description: "Tooltip trigger mode", type: "'hover' | 'focus' | 'click' | 'contextMenu' | Array", default: "'click'" },
            { property: "arrow", description: "Whether to show the arrow pointer", type: "boolean | { pointAtCenter?: boolean }", default: "true" },
            { property: "disabled", description: "Whether the trigger is disabled", type: "boolean", default: "false" },
          ],
        },
      ]}
    />
  );
}
