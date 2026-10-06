import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import EventDemo from "./demos/event";
import eventCode from "./demos/event.tsx?raw";
import IconSlider from "./demos/icon-slider";
import iconSliderCode from "./demos/icon-slider.tsx?raw";
import DraggableTrack from "./demos/draggable-track";
import draggableTrackCode from "./demos/draggable-track.tsx?raw";
import TooltipDemo from "./demos/tooltip";
import tooltipCode from "./demos/tooltip.tsx?raw";
import TooltipAlways from "./demos/tooltip-always";
import tooltipAlwaysCode from "./demos/tooltip-always.tsx?raw";
import ControlTooltip from "./demos/control-tooltip";
import controlTooltipCode from "./demos/control-tooltip.tsx?raw";
import InputNumberDemo from "./demos/input-number";
import inputNumberCode from "./demos/input-number.tsx?raw";
import Graduated from "./demos/graduated";
import graduatedCode from "./demos/graduated.tsx?raw";
import MarksWithSteps from "./demos/marks-with-steps";
import marksWithStepsCode from "./demos/marks-with-steps.tsx?raw";
import Vertical from "./demos/vertical";
import verticalCode from "./demos/vertical.tsx?raw";
import Reverse from "./demos/reverse";
import reverseCode from "./demos/reverse.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="slider"
      imports={["Slider", "type SliderProps"]}
      whenToUse={tr(
        <>
          <ul>
            <li>ใช้กรอกค่าตัวเลขภายในช่วงที่กำหนด</li>
            <li>เมื่อต้องการค่าต่อเนื่องหรือค่าที่เป็นขั้น พร้อมเห็นผลทันทีระหว่างลาก</li>
            <li>เมื่อต้องเลือกช่วง (ค่าต่ำสุด–สูงสุด) ด้วยหัวจับสองอัน — โหมด <code>range</code></li>
          </ul>
          <p className="mt-2">
            ลากด้วยเมาส์/นิ้ว หรือโฟกัสที่หัวจับแล้วใช้ปุ่มลูกศร, <code>PageUp</code>/<code>PageDown</code> (ทีละ 10 ขั้น),
            <code>Home</code>/<code>End</code> ก็ได้
          </p>
        </>,
        <>
          <ul>
            <li>To input a value within a given range.</li>
            <li>When continuous or discrete numerical input is needed with immediate feedback while dragging.</li>
            <li>When selecting an interval with dual thumbs (<code>range</code> mode).</li>
          </ul>
          <p className="mt-2">
            Drag with mouse/touch, or focus a handle and use the arrow keys, <code>PageUp</code>/<code>PageDown</code>{" "}
            (10 steps at a time) and <code>Home</code>/<code>End</code>.
          </p>
        </>,
      )}
      demos={[
        {
          title: tr("พื้นฐาน", "Basic"),
          description: tr(
            <>สไลเดอร์หัวจับเดียว และแบบช่วงสองหัวจับด้วย <code>range</code></>,
            <>Basic slider and dual-thumb range slider via <code>range</code>.</>,
          ),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("อีเวนต์", "Events"),
          description: tr(
            <><code>onChange</code> ยิงระหว่างลาก ส่วน <code>onChangeComplete</code> ยิงเมื่อปล่อยมือ (หรือปล่อยปุ่มคีย์บอร์ด)</>,
            <><code>onChange</code> fires while sliding, <code>onChangeComplete</code> when the interaction ends (pointer up or key up).</>,
          ),
          code: eventCode,
          component: <EventDemo />,
        },
        {
          title: tr("สไลเดอร์พร้อมไอคอน", "Icon Slider"),
          description: tr(
            <>วางไอคอนสองข้างเพื่อบอกความหมายของค่าน้อย–มาก (แบบควบคุมด้วย <code>value</code>/<code>onChange</code>)</>,
            <>Put icons on both sides to express the low/high meaning of the value (controlled with <code>value</code>/<code>onChange</code>).</>,
          ),
          code: iconSliderCode,
          component: <IconSlider />,
        },
        {
          title: tr("ลากทั้งช่วง", "Draggable Track"),
          description: tr(
            <><code>range=&#123;&#123; draggableTrack: true &#125;&#125;</code> ให้ลากแถบทั้งช่วงพร้อมกันได้ และรองรับหัวจับมากกว่าสองอัน</>,
            <><code>range=&#123;&#123; draggableTrack: true &#125;&#125;</code> lets you drag the whole track at once, and supports more than two thumbs.</>,
          ),
          code: draggableTrackCode,
          component: <DraggableTrack />,
        },
        {
          title: tr("ปรับแต่งทูลทิป", "Customized Tooltip"),
          description: tr(
            <>ใช้ <code>tooltip.formatter</code> เปลี่ยนข้อความในทูลทิป ถ้าส่ง <code>null</code> จะไม่แสดงทูลทิปเลย</>,
            <>Use <code>tooltip.formatter</code> to customize the content; pass <code>null</code> to hide the tooltip entirely.</>,
          ),
          code: tooltipCode,
          component: <TooltipDemo />,
        },
        {
          title: tr("แสดงทูลทิปตลอดเวลา", "Always Show Tooltip"),
          description: tr(
            <><code>tooltip.open=true</code> ให้แสดงตลอด, <code>false</code> ให้ซ่อนตลอด</>,
            <><code>tooltip.open=true</code> keeps it visible, <code>false</code> keeps it hidden.</>,
          ),
          code: tooltipAlwaysCode,
          component: <TooltipAlways />,
        },
        {
          title: tr("ควบคุมทูลทิป", "Control Tooltip Display"),
          description: tr(
            <>สลับ <code>tooltip.open</code> เองได้ และย้ายตำแหน่งด้วย <code>tooltip.placement</code></>,
            <>Toggle <code>tooltip.open</code> yourself, and move it with <code>tooltip.placement</code>.</>,
          ),
          code: controlTooltipCode,
          component: <ControlTooltip />,
        },
        {
          title: tr("ซิงก์กับตัวเลข", "Synchronize with Input"),
          description: tr(
            "ผูกสไลเดอร์กับตัวควบคุมหรือช่องกรอกตัวเลขอื่น",
            "Synchronize the slider with other controls or a numeric input.",
          ),
          code: inputNumberCode,
          component: <InputNumberDemo />,
        },
        {
          title: tr("สเกลและขีดบอกค่า", "Graduated Slider"),
          description: tr(
            <>ใช้ <code>marks</code> ทำขีดบอกค่า (คลิกที่ป้ายเพื่อกระโดดไปค่านั้นได้) และ <code>included</code> เลือกว่าจะระบายแถบหรือไม่</>,
            <>Use <code>marks</code> for labelled ticks (click a label to jump to it) and <code>included</code> to toggle the filled track.</>,
          ),
          code: graduatedCode,
          component: <Graduated />,
        },
        {
          title: tr("ขีดบอกค่ากับ step", "Marks and Steps"),
          description: tr(
            <><code>step=&#123;null&#125;</code> ทำให้เลือกได้เฉพาะค่าใน <code>marks</code> ส่วน <code>dots</code> วาดจุดทุกขั้น</>,
            <><code>step=&#123;null&#125;</code> restricts the value to <code>marks</code> only, while <code>dots</code> draws a dot on every step point.</>,
          ),
          code: marksWithStepsCode,
          component: <MarksWithSteps />,
        },
        {
          title: tr("แนวตั้ง", "Vertical"),
          description: tr(
            <>โหมดแนวตั้งด้วย <code>vertical</code> (ค่าน้อยอยู่ล่าง) ตัวคอมโพเนนต์จะสูงเท่า parent</>,
            <>Vertical mode via <code>vertical</code> (min at the bottom); it fills the height of its parent.</>,
          ),
          code: verticalCode,
          component: <Vertical />,
        },
        {
          title: tr("กลับทิศ", "Reverse"),
          description: tr(
            <>สลับทิศทางด้วย <code>reverse</code> ทั้งการวาดและปุ่มลูกศร</>,
            <>Flip the direction with <code>reverse</code> — both the rendering and the arrow keys follow.</>,
          ),
          code: reverseCode,
          component: <Reverse />,
        },
      ]}
      api={[
        {
          title: "Slider",
          rows: [
            { property: "value", description: tr("ค่าปัจจุบัน (controlled)", "Current value (controlled)"), type: "number | number[]", default: "-" },
            { property: "defaultValue", description: tr("ค่าเริ่มต้นแบบ uncontrolled", "Initial value (uncontrolled)"), type: "number | number[]", default: "min | [min, min]" },
            { property: "min", description: tr("ค่าต่ำสุดที่เลื่อนได้", "Minimum value the slider can slide to"), type: "number", default: "0" },
            { property: "max", description: tr("ค่าสูงสุดที่เลื่อนได้", "Maximum value the slider can slide to"), type: "number", default: "100" },
            { property: "step", description: tr("ความละเอียดของการเลื่อน; null = เลือกได้เฉพาะค่าใน marks", "Granularity; null restricts the value to marks only"), type: "number | null", default: "1" },
            { property: "range", description: tr("โหมดสองหัวจับขึ้นไป; ส่งอ็อบเจกต์เพื่อเปิดการลากทั้งแถบ", "Dual (or N) thumb mode; pass an object to enable dragging the whole track"), type: "boolean | { draggableTrack?: boolean }", default: "false" },
            { property: "marks", description: tr("ขีดบอกค่า: { [value]: ReactNode | { style, label } } คลิกป้ายเพื่อกระโดดไปค่านั้น", "Ticks: { [value]: ReactNode | { style, label } }; clicking a label jumps to that value"), type: "SliderMarks", default: "-" },
            { property: "dots", description: tr("วาดจุดที่ทุกขั้นของ step บนราง", "Render a dot for every step point on the rail"), type: "boolean", default: "false" },
            { property: "included", description: tr("ระบายแถบจาก min ถึงหัวจับ (และทำให้ป้าย mark ที่อยู่ในช่วง active)", "Fill the track up to the handle (and mark labels inside the span become active)"), type: "boolean", default: "true" },
            { property: "vertical", description: tr("แสดงเป็นแนวตั้ง สูงเท่า parent", "Render vertically, filling the parent height"), type: "boolean", default: "false" },
            { property: "reverse", description: tr("กลับทิศทางของราง หัวจับ และปุ่มลูกศร", "Reverse the direction of the rail, handles and arrow keys"), type: "boolean", default: "false" },
            { property: "disabled", description: tr("ปิดการใช้งานทั้งเมาส์และคีย์บอร์ด", "Disable pointer and keyboard interaction"), type: "boolean", default: "false" },
            { property: "keyboard", description: tr("เปิด/ปิดการควบคุมด้วยคีย์บอร์ด (ลูกศร, PageUp/Down, Home/End)", "Enable keyboard control (arrows, PageUp/Down, Home/End)"), type: "boolean", default: "true" },
            { property: "autoFocus", description: tr("โฟกัสหัวจับแรกตอน mount", "Focus the first handle on mount"), type: "boolean", default: "false" },
            { property: "tooltip", description: tr("ตั้งค่าทูลทิปของหัวจับ", "Handle tooltip configuration"), type: "SliderTooltipProps", default: "-" },
            { property: "onChange", description: tr("ยิงทุกครั้งที่ค่าเปลี่ยน (ระหว่างลาก)", "Fires whenever the value changes (while dragging)"), type: "(value: number | number[]) => void", default: "-" },
            { property: "onChangeComplete", description: tr("ยิงเมื่อจบการโต้ตอบ (ปล่อยเมาส์/ปุ่ม)", "Fires when the interaction ends (pointer up / key up)"), type: "(value: number | number[]) => void", default: "-" },
            { property: "onFocus", description: tr("ยิงเมื่อหัวจับได้โฟกัส", "Fires when a handle receives focus"), type: "(e: FocusEvent<HTMLDivElement>) => void", default: "-" },
            { property: "onBlur", description: tr("ยิงเมื่อหัวจับเสียโฟกัส", "Fires when a handle loses focus"), type: "(e: FocusEvent<HTMLDivElement>) => void", default: "-" },
            { property: "id", description: tr("id ของ element ราก", "id of the root element"), type: "string", default: "-" },
            { property: "className / style", description: tr("คลาส/สไตล์ของ element ราก", "Class / style of the root element"), type: "string | CSSProperties", default: "-" },
            { property: "classNames", description: tr("คลาสรายส่วน: root, rail, tracks, track, handle", "Per-part classes: root, rail, tracks, track, handle"), type: "Partial<Record<SliderSemantic, string>>", default: "-" },
            { property: "styles", description: tr("สไตล์รายส่วน: root, rail, tracks, track, handle", "Per-part styles: root, rail, tracks, track, handle"), type: "Partial<Record<SliderSemantic, CSSProperties>>", default: "-" },
          ],
        },
        {
          title: "SliderTooltipProps",
          description: tr("รูปแบบของพร็อพ `tooltip`", "Shape of the `tooltip` prop."),
          rows: [
            { property: "open", description: tr("บังคับแสดง (true) หรือซ่อน (false); ไม่ใส่ = แสดงตอน hover/ลาก/โฟกัส", "Force visible (true) or hidden (false); omit for hover/drag/focus"), type: "boolean", default: "-" },
            { property: "formatter", description: tr("จัดรูปแบบข้อความ; null = ไม่แสดงทูลทิป", "Format the content; null removes the tooltip"), type: "null | ((value?: number) => ReactNode)", default: "(value) => value" },
            { property: "placement", description: tr("ตำแหน่งของทูลทิปเทียบกับหัวจับ", "Position relative to the handle"), type: "top | bottom | left | right", default: "top (vertical: right)" },
            { property: "autoAdjustOverflow", description: tr("ขยับทูลทิปอัตโนมัติเมื่อจะล้นขอบจอ", "Shift the tooltip when it would overflow the viewport"), type: "boolean", default: "true" },
          ],
        },
      ]}
      extra={tr(
        <>
          <h2>หมายเหตุ</h2>
          <h3>marks รับสองรูปแบบ</h3>
          <p>
            <code>{`{ 26: "26°C" }`}</code> สำหรับป้ายธรรมดา หรือ <code>{`{ 100: { style, label } }`}</code> เมื่ออยากใส่สไตล์เฉพาะป้ายนั้น
            ตำแหน่งของป้ายคำนวณจากค่าเสมอ ไม่ใช่การแบ่งเท่าๆ กัน
          </p>
          <h3>หัวจับข้ามกันได้</h3>
          <p>ในโหมด range หัวจับลากข้ามกันได้ ค่าที่ส่งออกจะเรียงจากน้อยไปมากเสมอ และโฟกัสจะติดตามหัวจับที่กำลังลาก</p>
        </>,
        <>
          <h2>Notes</h2>
          <h3>marks accepts two shapes</h3>
          <p>
            <code>{`{ 26: "26°C" }`}</code> for a plain label, or <code>{`{ 100: { style, label } }`}</code> to style one
            label. Labels are always positioned by their value, never evenly spread.
          </p>
          <h3>Handles may cross</h3>
          <p>
            In range mode handles can be dragged past each other; the emitted value is always sorted ascending and focus
            follows the handle you are dragging.
          </p>
        </>,
      )}
      related={[
        { title: "Switch", path: "/components/switch" },
        { title: "Rate", path: "/components/rate" },
        { title: "InputNumber", path: "/components/input-number" },
      ]}
    />
  );
}
