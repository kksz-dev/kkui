import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import LineDemo from "./demos/line";
import lineCode from "./demos/line.tsx?raw";
import CircleDemo from "./demos/circle";
import circleCode from "./demos/circle.tsx?raw";
import MiniDemo from "./demos/mini";
import miniCode from "./demos/mini.tsx?raw";
import DashboardDemo from "./demos/dashboard";
import dashboardCode from "./demos/dashboard.tsx?raw";
import DynamicDemo from "./demos/dynamic";
import dynamicCode from "./demos/dynamic.tsx?raw";
import FormatDemo from "./demos/format";
import formatCode from "./demos/format.tsx?raw";
import GradientDemo from "./demos/gradient";
import gradientCode from "./demos/gradient.tsx?raw";
import StepsDemo from "./demos/steps";
import stepsCode from "./demos/steps.tsx?raw";
import LinecapDemo from "./demos/linecap";
import linecapCode from "./demos/linecap.tsx?raw";
import SuccessDemo from "./demos/success";
import successCode from "./demos/success.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="progress"
      imports={["Progress"]}
      whenToUse={tr(
        <>
          <p>
            Progress ใช้แสดงสถานะความสำเร็จของขั้นตอนการทำงาน เช่น การ upload, รัน task, download หรือกรอกฟอร์ม
          </p>
          <p className="mt-2">
            รองรับแบบเส้น วงกลม และ dashboard รวมถึง gradient, steps และส่วนแสดงความสำเร็จ
          </p>
        </>,
        <>
          <p>
            Progress is used to display the completion status of an operation flow (uploading, task execution, downloads, forms).
          </p>
          <p className="mt-2">
            It supports linear, circular, and dashboard styles, along with custom gradients, steps, and success segments.
          </p>
        </>,
      )}
      demos={[
        {
          title: tr("แถบ Progress", "Progress Bar"),
          description: tr(<>แถบ Progress แบบเส้นมาตรฐานที่แสดงได้หลายสถานะ</>, <>A standard linear progress bar with different statuses.</>),
          code: lineCode,
          component: <LineDemo />,
        },
        {
          title: tr("Progress แบบวงกลม", "Circular Progress Bar"),
          description: tr(<>Progress แบบวงกลมพร้อมไอคอนสถานะ</>, <>A circular progress bar with status icons.</>),
          code: circleCode,
          component: <CircleDemo />,
        },
        {
          title: tr("ขนาดเล็ก", "Mini Size"),
          description: tr(<>ลดขนาดแถบ Progress และตัวบอกสถานะแบบวงกลมด้วย <code>size="small"</code></>, <>Smaller progress bars and circular indicators with <code>size="small"</code>.</>),
          code: miniCode,
          component: <MiniDemo />,
        },
        {
          title: tr("Dashboard", "Dashboard"),
          description: tr(<>Progress แบบวงกลมสไตล์ dashboard ที่เว้นช่องด้านล่าง</>, <>A dashboard style circular progress with a bottom opening.</>),
          code: dashboardCode,
          component: <DashboardDemo />,
        },
        {
          title: tr("เปลี่ยนค่า", "Dynamic"),
          description: tr(<>แถบ Progress ที่ปรับตามสถานะภายนอก</>, <>A dynamic progress bar that responds to external state changes.</>),
          code: dynamicCode,
          component: <DynamicDemo />,
        },
        {
          title: tr("กำหนดข้อความ", "Custom Text Format"),
          description: tr(<>ปรับข้อความด้วย callback <code>format</code></>, <>You can customize the text info using the <code>format</code> callback.</>),
          code: formatCode,
          component: <FormatDemo />,
        },
        {
          title: tr("ไล่ระดับสี", "Custom Color Gradient"),
          description: tr(<>กำหนด gradient ให้เส้น Progress แบบเส้นและวงกลม</>, <>Linear and circular progress with custom gradient strokes.</>),
          code: gradientCode,
          component: <GradientDemo />,
        },
        {
          title: tr("แบ่งเป็นขั้น", "Segmented Steps"),
          description: tr(<>แบ่งแถบ Progress ออกเป็นหลายขั้น</>, <>A progress bar divided into multiple steps.</>),
          code: stepsCode,
          component: <StepsDemo />,
        },
        {
          title: tr("ปลายเส้น", "Stroke Linecap"),
          description: tr(<>กำหนดปลายเส้นเป็น <code>round</code>, <code>butt</code> หรือ <code>square</code></>, <>Customize stroke ends with <code>round</code>, <code>butt</code>, or <code>square</code>.</>),
          code: linecapCode,
          component: <LinecapDemo />,
        },
        {
          title: tr("ส่วนที่สำเร็จ", "Success Segment"),
          description: tr(<>แสดงส่วนย่อยที่สำเร็จแล้วภายในแถบ Progress</>, <>Display a sub-progress success segment inside the progress bar.</>),
          code: successCode,
          component: <SuccessDemo />,
        },
      ]}
      api={[
        {
          title: "Progress",
          rows: [
            { property: "format", description: "Template function of the content", type: "(percent?: number, successPercent?: number) => ReactNode", default: "-" },
            { property: "gapDegree", description: "The gap degree of dashboard progress (0 - 295)", type: "number", default: "75" },
            { property: "gapPosition", description: "The gap position of dashboard progress", type: "'top' | 'bottom' | 'left' | 'right'", default: "'bottom'" },
            { property: "percent", description: "Completion percentage", type: "number", default: "0" },
            { property: "showInfo", description: "Whether to display the progress text info", type: "boolean", default: "true" },
            { property: "size", description: "Progress bar size", type: "number | [number, number] | 'small' | 'default' | { width?: number, height?: number }", default: "'default'" },
            { property: "status", description: "The status of progress", type: "'normal' | 'active' | 'success' | 'exception'", default: "-" },
            { property: "steps", description: "The total step count or step configuration", type: "number | { count: number, gap?: number }", default: "-" },
            { property: "strokeColor", description: "Color of progress stroke (string, gradient or array of colors)", type: "string | ProgressGradient | string[]", default: "-" },
            { property: "strokeLinecap", description: "Style of stroke ends", type: "'round' | 'butt' | 'square'", default: "'round'" },
            { property: "strokeWidth", description: "Width / thickness of progress stroke", type: "number", default: "8 (line) / 6 (circle)" },
            { property: "success", description: "Config of success segment", type: "{ percent?: number, strokeColor?: string }", default: "-" },
            { property: "trailColor", description: "Color of unfilled trail path", type: "string", default: "-" },
            { property: "type", description: "Type of progress", type: "'line' | 'circle' | 'dashboard'", default: "'line'" },
          ],
        },
      ]}
      related={[
        { title: "Spin", path: "/components/spin" },
        { title: "Skeleton", path: "/components/skeleton" },
      ]}
    />
  );
}
