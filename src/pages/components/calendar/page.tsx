import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import CellRenderDemo from "./demos/cell-render";
import cellRenderCode from "./demos/cell-render.tsx?raw";
import MiniDemo from "./demos/mini";
import miniCode from "./demos/mini.tsx?raw";
import ValidRangeDemo from "./demos/valid-range";
import validRangeCode from "./demos/valid-range.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="calendar"
      imports={['Calendar', 'type CalendarProps']}
      whenToUse={tr(
        <p>ใช้ดูตารางเวลา กิจกรรมรายเดือน หรือภาพรวมของนัดหมาย</p>,
        <p>Use for viewing schedules, monthly events, or agenda overviews.</p>,
      )}
      demos={[
        { title: tr("ปฏิทินพื้นฐาน", "Basic Calendar"), description: tr("มุมมองปฏิทินที่สลับระหว่างรายเดือนกับรายปีได้", "Calendar view with month and year switching."), code: basicCode, component: <Basic />, size: "full" },
        {
          title: tr("เนื้อหาในช่องวัน", "Cell Content"),
          description: tr("ใส่เนื้อหาของตัวเองลงในช่องวันผ่าน cellRender", "Fill day cells with your own content through cellRender."),
          code: cellRenderCode,
          component: <CellRenderDemo />,
          size: "full",
        },
        {
          title: tr("ปฏิทินขนาดเล็ก", "Mini Calendar"),
          description: tr("แบบย่อจะไม่มีปุ่มสลับ mode และแจ้งกลับทุกครั้งที่ค่าเปลี่ยน", "The compact form drops the mode switch and reports every change."),
          code: miniCode,
          component: <MiniDemo />,
          size: "standard",
        },
        {
          title: tr("ช่วงที่เลือกได้และ header เอง", "Valid Range and Custom Header"),
          description: tr("จำกัดช่วงวันที่เลือกได้ และแทนแถบ header ด้วยของตัวเอง", "Restrict the selectable window and replace the header bar."),
          code: validRangeCode,
          component: <ValidRangeDemo />,
          size: "full",
        },
      ]}
      api={[{'title': 'Calendar', 'rows': [{'property': 'mode', 'description': 'Display mode', 'type': 'month | year', 'default': 'month'}, {'property': 'fullscreen', 'description': 'Whether to display in full screen', 'type': 'boolean', 'default': 'true'}, {'property': 'onSelect', 'description': 'A cell was picked', 'type': '(date, info) => void', 'default': '-'}, {'property': 'onChange', 'description': 'Selected value changed', 'type': '(date) => void', 'default': '-'}, {'property': 'onPanelChange', 'description': 'Panel date or mode changed', 'type': '(date, mode) => void', 'default': '-'}, {'property': 'validRange', 'description': 'Selectable window; navigation stops at its edges', 'type': '[Dayjs, Dayjs]', 'default': '-'}, {'property': 'cellRender', 'description': 'Content under the date number', 'type': '(date, info) => ReactNode', 'default': '-'}, {'property': 'fullCellRender', 'description': 'Replace the whole cell', 'type': '(date, info) => ReactNode', 'default': '-'}, {'property': 'headerRender', 'description': 'Replace the header bar', 'type': '(info) => ReactNode', 'default': '-'}, {'property': 'disabledDate', 'description': 'Disable individual dates', 'type': '(date) => boolean', 'default': '-'}, {'property': 'locale', 'description': 'Weekday names, mode labels and formats', 'type': 'Partial<CalendarLocale>', 'default': 'English'}]}]}
    />
  );
}
