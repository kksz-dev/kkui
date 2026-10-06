import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import TimeGridDemo from "./demos/time-grid";
import time_gridCode from "./demos/time-grid.tsx?raw";
import AgendaDemo from "./demos/agenda";
import agendaCode from "./demos/agenda.tsx?raw";
import EditableDemo from "./demos/editable";
import editableCode from "./demos/editable.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="scheduler"
      imports={['Scheduler', 'type SchedulerEvent', 'type SchedulerProps']}
      whenToUse={tr(
        <p>ใช้แสดงตารางเวลา การจองห้อง การประชุม และกิจกรรมบนปฏิทิน</p>,
        <p>Use when presenting timeline schedules, room bookings, meetings, and calendar events.</p>,
      )}
      demos={[
        {
          title: tr("ปฏิทินนัดหมาย", "Calendar Scheduler"),
          description: tr("ปฏิทินโต้ตอบได้ พร้อมป้ายกิจกรรมและกล่องสร้างรายการ", "Interactive calendar view with event badges and modal creation."),
          code: basicCode,
          component: <Basic />,
          size: "full",
        },
        {
          title: tr("มุมมองสัปดาห์และรายวัน", "Week and Day Time Grid"),
          description: tr("ตารางรายชั่วโมงที่วางกิจกรรมตามเวลาจริง พร้อมแถวกิจกรรมทั้งวัน", "Hour rows with positioned events, plus a lane for all-day entries."),
          code: time_gridCode,
          component: <TimeGridDemo />,
          size: "full",
        },
        {
          title: tr("รายการตามวัน", "Agenda"),
          description: tr("ลิสต์เฉพาะวันที่มีกิจกรรมจริง", "A flat list of the days that actually have something on them."),
          code: agendaCode,
          component: <AgendaDemo />,
          size: "standard",
        },
        {
          title: tr("ควบคุมค่าและแก้ไขได้", "Controlled and Editable"),
          description: tr("หน้าเพจถือรายการกิจกรรมเอง ตัวปฏิทินเพิ่ม/แก้/ลบผ่าน callback", "The page owns the event list; the scheduler adds, edits and deletes through callbacks."),
          code: editableCode,
          component: <EditableDemo />,
          size: "full",
        },
      ]}
      api={[
        {
          title: "Scheduler",
          rows: [
            { property: "onEventClick", description: "An event chip was clicked", type: "(event) => void", default: "-" },
            { property: "events", description: "Controlled event list", type: "SchedulerEvent[]", default: "-" },
            { property: "defaultEvents", description: "Uncontrolled initial events", type: "SchedulerEvent[]", default: "[]" },
            { property: "view / defaultView", description: "Active calendar view", type: "'month' | 'week' | 'day' | 'agenda'", default: "'month'" },
            { property: "date / defaultDate", description: "Focused date (YYYY-MM-DD or Date)", type: "string | Date", default: "today" },
            { property: "hourRange", description: "Hours drawn by the week and day grids", type: "[number, number]", default: "[7, 20]" },
            { property: "dayMaxEvents", description: "Events shown in a month cell before \"+N more\"", type: "number", default: "3" },
            { property: "editable", description: "Show New Event and the edit/delete controls", type: "boolean", default: "true" },
            { property: "onEventAdd / onEventChange / onEventDelete", description: "Event mutations", type: "(event) => void", default: "-" },
            { property: "onCellClick", description: "An empty cell was clicked (date, time)", type: "(date, time?) => void", default: "-" },
            { property: "locale", description: "Every printed string", type: "Partial<SchedulerLocale>", default: "English" },
          ],
        },
      ]}
    />
  );
}
