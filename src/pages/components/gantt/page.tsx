import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import DependenciesDemo from "./demos/dependencies";
import dependenciesCode from "./demos/dependencies.tsx?raw";
import EditableDemo from "./demos/editable";
import editableCode from "./demos/editable.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="gantt"
      defaultDemoSize="full"
      imports={['Gantt', 'type GanttTask', 'type GanttProps']}
      whenToUse={tr(
        <p>ใช้เห็นภาพแผนงานหลายเฟส ไทม์ไลน์ และหมุดหมายส่งมอบ</p>,
        <p>Use to visualize complex multi-phase project workflows, timelines, and deliverable milestones.</p>,
      )}
      demos={[
        {
          title: tr("แผนภูมิแกนต์ของโครงการ", "Project Gantt Chart"),
          description: tr("ไทม์ไลน์งาน ช่วงเวลา และเปอร์เซ็นต์ความคืบหน้า", "Visual roadmap of tasks, duration spans, and completion percentage."),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("งานย่อย เส้นเชื่อม และหมุดหมาย", "Tree, Dependencies and Milestones"),
          description: tr("พับงานแม่ได้ ลูกศรวิ่งตามลำดับงาน และหมุดหมายแสดงเป็นสี่เหลี่ยมข้าวหลามตัด", "Parent rows fold, arrows follow the dependency links, and a milestone renders as a diamond."),
          code: dependenciesCode,
          component: <DependenciesDemo />,
        },
        {
          title: tr("ลากปรับแท่งงาน", "Draggable Bars"),
          description: tr("ลากแท่งเพื่อเลื่อนงาน หรือจับขอบเพื่อยืด/หดช่วงเวลา", "Drag a bar to move it, or grab either edge to change its span."),
          code: editableCode,
          component: <EditableDemo />,
        },
      ]}
      api={[
        {
          title: "Gantt",
          rows: [
            { property: "tasks", description: "Array of Gantt task items", type: "GanttTask[]", default: "[]" },
            { property: "startDate", description: "Base start date string (YYYY-MM-DD)", type: "string", default: "today" },
            { property: "totalDays", description: "Total timeline span in days", type: "number", default: "30" },
            { property: "scale", description: "Timeline zoom", type: "'day' | 'week' | 'month'", default: "'day'" },
            { property: "dayWidth", description: "Pixel width of one day", type: "number", default: "by scale" },
            { property: "showDependencies", description: "Draw arrows between linked tasks", type: "boolean", default: "true" },
            { property: "editable", description: "Allow bars to be dragged and resized", type: "boolean", default: "false" },
            { property: "onTaskChange", description: "A bar was moved or resized", type: "(task, { startDate, endDate }) => void", default: "-" },
            { property: "onTaskClick", description: "A bar was clicked", type: "(task) => void", default: "-" },
            { property: "sidebarWidth / rowHeight", description: "Layout sizing", type: "number", default: "240 / 40" },
          ],
        },
      ]}
    />
  );
}
