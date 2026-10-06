import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import ActionDemo from "./demos/action";
import actionCode from "./demos/action.tsx?raw";
import PositionDemo from "./demos/position";
import positionCode from "./demos/position.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="toast"
      imports={["Toaster", "toast", "type ToastOptions"]}
      whenToUse={tr(
        <p>ใช้บอกผลของสิ่งที่ผู้ใช้เพิ่งทำ โดยไม่ขวางงานถัดไป — วาง <code>{"<Toaster />"}</code> ครั้งเดียว แล้วเรียก <code>toast()</code> จากที่ไหนก็ได้</p>,
        <p>Use to report the outcome of something the user just did without blocking the next action. Render <code>{"<Toaster />"}</code> once, then call <code>toast()</code> from anywhere.</p>,
      )}
      demos={[
        {
          title: tr("ตำแหน่ง", "Position"),
          description: tr("เลือกหนึ่งในหกตำแหน่งรอบ viewport", "Choose any of the six viewport positions."),
          code: positionCode,
          component: <PositionDemo />,
        },
        {
          title: tr("ชนิดพื้นฐาน", "Types"),
          description: tr("default / success / error / warning / info ซ้อนกันเป็นกอง ชี้เพื่อกาง", "default, success, error, warning and info stack up; hover to fan them out."),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("ปุ่มและ promise", "Actions and promises"),
          description: tr("ใส่ปุ่ม undo หรือผูกกับ promise ให้เปลี่ยนสถานะเอง", "Attach an undo button, or hand it a promise and let it swap itself."),
          code: actionCode,
          component: <ActionDemo />,
        },
      ]}
      api={[
        {
          title: "toast",
          rows: [
            { property: "toast(title, options?)", description: "Show a toast", type: "(title, ToastOptions) => id", default: "-" },
            { property: "toast.success / error / warning / info / loading", description: "Typed shorthands", type: "(title, options?) => id", default: "-" },
            { property: "toast.promise", description: "Loading, then success or error", type: "(promise, { loading, success, error }) => promise", default: "-" },
            { property: "toast.dismiss", description: "Close one, or all with no argument", type: "(id?) => void", default: "-" },
          ],
        },
        {
          title: "ToastOptions",
          rows: [
            { property: "description", description: "Secondary line", type: "ReactNode", default: "-" },
            { property: "duration", description: "ms; 0 keeps it open (loading defaults to 0)", type: "number", default: "4000" },
            { property: "action / cancel", description: "Buttons in the card", type: "{ label, onClick }", default: "-" },
            { property: "icon", description: "Replace the type icon", type: "ReactNode", default: "-" },
            { property: "id", description: "Reuse an id to update a toast in place", type: "string | number", default: "auto" },
            { property: "onDismiss / onAutoClose", description: "Lifecycle callbacks", type: "(id) => void", default: "-" },
          ],
        },
        {
          title: "Toaster",
          rows: [
            { property: "position", description: "Corner or centre, top or bottom", type: "ToastPosition", default: "'bottom-right'" },
            { property: "stacked", description: "Cards peek out behind the front one until hovered", type: "boolean", default: "true" },
            { property: "visibleToasts", description: "How many stay mounted", type: "number", default: "4" },
            { property: "pauseOnHover", description: "Pause timers while hovered or focused, then resume the remaining time", type: "boolean", default: "true" },
            { property: "closeButton", description: "Show the close control", type: "boolean", default: "true" },
            { property: "gap", description: "Gap between expanded cards in px", type: "number", default: "12" },
            { property: "width", description: "Card width in px", type: "number", default: "356" },
          ],
        },
      ]}
      related={[{ path: "/components/message", title: "Message" }, { path: "/components/notification", title: "Notification" }]}
    />
  );
}
