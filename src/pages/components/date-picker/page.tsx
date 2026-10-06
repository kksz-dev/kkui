import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import RangePickerDemo from "./demos/range-picker";
import rangePickerCode from "./demos/range-picker.tsx?raw";
import PickersDemo from "./demos/pickers";
import pickersCode from "./demos/pickers.tsx?raw";
import ShowTimeDemo from "./demos/show-time";
import showTimeCode from "./demos/show-time.tsx?raw";
import PresetsDemo from "./demos/presets";
import presetsCode from "./demos/presets.tsx?raw";
import RangePresetsDemo from "./demos/range-presets";
import rangePresetsCode from "./demos/range-presets.tsx?raw";
import StatusDemo from "./demos/status";
import statusCode from "./demos/status.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="date-picker"
      imports={['DatePicker', 'type DatePickerProps', 'type RangePickerProps']}
      whenToUse={tr(
        <p>ใช้เมื่อผู้ใช้ต้องกรอกหรือเลือกวันที่ ช่วงวันที่ ปี เดือน หรือวันที่พร้อมเวลา</p>,
        <p>Use when the user needs to enter or select a date, date range, year, month, or datetime timestamp.</p>,
      )}
      demos={[
        {
          title: tr("DatePicker พื้นฐาน", "Basic DatePicker"),
          description: tr("ตัวเลือกวันที่แบบ popup ปฏิทินมาตรฐาน", "Standard calendar popup date selector."),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("เลือกช่วงวันที่", "RangePicker"),
          description: tr("เลือกวันเริ่มต้นและวันสิ้นสุดในตัวเดียวกัน", "Select start and end dates within a combined range picker."),
          code: rangePickerCode,
          component: <RangePickerDemo />,
        },
        {
          title: tr("โหมดอื่นของ picker", "Other Picker Modes"),
          description: tr("เลือกเป็นเดือน ปี ไตรมาส หรือสัปดาห์", "Select by Month, Year, Quarter, or Week."),
          code: pickersCode,
          component: <PickersDemo />,
        },
        {
          title: tr("เลือกวันที่พร้อมเวลา (showTime)", "DateTime Selection (showTime)"),
          description: tr("เลือกทั้งวันที่และเวลา พร้อมตัวเลือกชั่วโมง/นาที", "Select both date and time with hour/minute selector."),
          code: showTimeCode,
          component: <ShowTimeDemo />,
        },
        {
          title: tr("ตัวเลือกสำเร็จรูป", "Presets"),
          description: tr("ปุ่ม preset สำหรับเลือกวันที่ได้เร็วขึ้น", "Quick preset buttons for fast date selection."),
          code: presetsCode,
          component: <PresetsDemo />,
        },
        {
          title: tr("preset ช่วงวันที่พร้อมยืนยัน", "Range Presets with Confirm"),
          description: tr("แถบ preset ด้านข้างพร้อมปุ่ม OK/Cancel — ช่วงวันที่จะมีผลเมื่อกดยืนยันแล้วเท่านั้น", "Preset sidebar plus an OK/Cancel footer — the range only applies once confirmed."),
          code: rangePresetsCode,
          component: <RangePresetsDemo />,
        },
        {
          title: tr("สถานะและรูปแบบ", "Status and Variants"),
          description: tr("สไตล์ error/warning ของ validation และ variant แบบ borderless/filled", "Validation error/warning styles and borderless/filled variants."),
          code: statusCode,
          component: <StatusDemo />,
        },
      ]}
      api={[
        {
          title: "DatePicker",
          rows: [
            { property: "value", description: "Controlled selected date value", type: "Dayjs | null", default: "-" },
            { property: "defaultValue", description: "Default initial date", type: "Dayjs | null", default: "-" },
            { property: "onChange", description: "Callback when date is changed", type: "(date: Dayjs, dateString: string) => void", default: "-" },
            { property: "picker", description: "Picker mode", type: "'date' | 'week' | 'month' | 'quarter' | 'year'", default: "'date'" },
            { property: "showTime", description: "Enable time picker input", type: "boolean", default: "false" },
            { property: "format", description: "Display date format string", type: "string", default: "'YYYY-MM-DD'" },
            { property: "presets", description: "Preset quick date buttons array", type: "Array<{ label, value }>", default: "-" },
            { property: "disabledDate", description: "Specify dates that cannot be selected", type: "(currentDate: Dayjs) => boolean", default: "-" },
            { property: "allowClear", description: "Whether to show clear button", type: "boolean", default: "true" },
            { property: "variant", description: "Visual variant style", type: "'outlined' | 'filled' | 'borderless'", default: "'outlined'" },
            { property: "status", description: "Validation status", type: "'error' | 'warning'", default: "-" },
          ],
        },
        {
          title: "DatePicker.RangePicker",
          rows: [
            { property: "value", description: "Controlled date range tuple", type: "[Dayjs, Dayjs]", default: "-" },
            { property: "onChange", description: "Callback on range change", type: "(dates, dateStrings) => void", default: "-" },
            { property: "placeholder", description: "Range placeholder array", type: "[string, string]", default: "['Start date', 'End date']" },
            { property: "presets", description: "Preset ranges listed beside the panel", type: "{ label, value: [Dayjs, Dayjs] }[]", default: "-" },
            { property: "needConfirm", description: "Hold the range until OK is pressed", type: "boolean", default: "showTime" },
            { property: "showTime", description: "Add hour/minute/second columns for both ends", type: "boolean | { showSecond }", default: "false" },
            { property: "disabled", description: "Disable the picker, or only one end of it", type: "boolean | [boolean, boolean]", default: "false" },
            { property: "separator", description: "Node drawn between the two inputs", type: "ReactNode", default: "arrow icon" },
            { property: "renderExtraFooter", description: "Extra node rendered in the footer bar", type: "() => ReactNode", default: "-" },
          ],
        },
      ]}
    />
  );
}
