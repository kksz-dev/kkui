import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import RangePickerDemo from "./demos/range-picker";
import rangePickerCode from "./demos/range-picker.tsx?raw";
import Size from "./demos/size";
import sizeCode from "./demos/size.tsx?raw";
import Disabled from "./demos/disabled";
import disabledCode from "./demos/disabled.tsx?raw";
import HourAndMinute from "./demos/hour-and-minute";
import hourAndMinuteCode from "./demos/hour-and-minute.tsx?raw";
import TwelveHours from "./demos/twelve-hours";
import twelveHoursCode from "./demos/twelve-hours.tsx?raw";
import IntervalOptions from "./demos/interval-options";
import intervalOptionsCode from "./demos/interval-options.tsx?raw";
import Addon from "./demos/addon";
import addonCode from "./demos/addon.tsx?raw";
import Controlled from "./demos/controlled";
import controlledCode from "./demos/controlled.tsx?raw";
import Status from "./demos/status";
import statusCode from "./demos/status.tsx?raw";
import Variant from "./demos/variant";
import variantCode from "./demos/variant.tsx?raw";
import PrefixSuffix from "./demos/prefix-suffix";
import prefixSuffixCode from "./demos/prefix-suffix.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="time-picker"
      imports={["TimePicker", "TimeRangePicker", "type TimePickerProps", "type TimeRangePickerProps"]}
      whenToUse={tr(
        <>
          <p>ใช้เมื่อผู้ใช้ต้องเลือกเวลาในฟอร์ม กดเลือกจากคอลัมน์ชั่วโมง/นาที/วินาที หรือพิมพ์ลงช่องตรงๆ ก็ได้</p>
          <p className="mt-2">
            ค่าที่ส่งเข้า-ออกเป็น <code>Dayjs</code> และ <code>onChange</code> จะให้สตริงตาม <code>format</code> มาด้วยเสมอ
          </p>
        </>,
        <>
          <p>
            Use when the user needs to select a time in a form — pick from the hour / minute / second columns, or type
            straight into the field.
          </p>
          <p className="mt-2">
            Values are <code>Dayjs</code> objects; <code>onChange</code> always hands you the formatted string as well.
          </p>
        </>,
      )}
      demos={[
        {
          title: tr("พื้นฐาน", "Basic"),
          description: tr(
            <>คลิกเพื่อเปิดแผง เลือกชั่วโมง/นาที/วินาที แล้วกด OK เพื่อยืนยัน</>,
            <>Click to open the panel, pick hour / minute / second, then confirm with OK.</>,
          ),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("เลือกช่วงเวลา", "Range Picker"),
          description: tr(
            <><code>TimePicker.RangePicker</code> เลือกเวลาเริ่ม–สิ้นสุด สลับข้างได้จากหัวแผง และ <code>order</code> จะจัดเรียงให้อัตโนมัติ</>,
            <><code>TimePicker.RangePicker</code> picks a start and an end; switch sides from the panel header, and <code>order</code> sorts them for you.</>,
          ),
          code: rangePickerCode,
          component: <RangePickerDemo />,
        },
        {
          title: tr("ขนาด", "Size"),
          description: tr(
            <>สามขนาด: <code>lg</code> (40px), <code>md</code> (32px ค่าเริ่มต้น), <code>sm</code> (24px)</>,
            <>Three sizes: <code>lg</code> (40px), <code>md</code> (32px, default), <code>sm</code> (24px).</>,
          ),
          code: sizeCode,
          component: <Size />,
        },
        {
          title: tr("ปิดใช้งานและจำกัดเวลา", "Disabled"),
          description: tr(
            <><code>disabled</code> ปิดทั้งตัว ส่วน <code>disabledTime</code> ปิดเฉพาะบางตัวเลือก และ <code>hideDisabledOptions</code> ซ่อนตัวเลือกที่ปิดไปเลย</>,
            <><code>disabled</code> turns the whole control off, <code>disabledTime</code> blocks single options, and <code>hideDisabledOptions</code> hides them altogether.</>,
          ),
          code: disabledCode,
          component: <Disabled />,
        },
        {
          title: tr("เลือกเฉพาะชั่วโมง/นาที", "Hour and Minute"),
          description: tr(
            <>คอลัมน์ที่แสดงมาจาก <code>showHour</code>/<code>showMinute</code>/<code>showSecond</code> ถ้าไม่ระบุจะเดาจาก <code>format</code></>,
            <>Columns come from <code>showHour</code>/<code>showMinute</code>/<code>showSecond</code>; when omitted they are inferred from <code>format</code>.</>,
          ),
          code: hourAndMinuteCode,
          component: <HourAndMinute />,
        },
        {
          title: tr("ระบบ 12 ชั่วโมง", "12 Hours"),
          description: tr(
            <><code>use12Hours</code> เพิ่มคอลัมน์ AM/PM และเปลี่ยนรูปแบบเริ่มต้นเป็น <code>h:mm:ss A</code></>,
            <><code>use12Hours</code> adds the AM/PM column and switches the default format to <code>h:mm:ss A</code>.</>,
          ),
          code: twelveHoursCode,
          component: <TwelveHours />,
        },
        {
          title: tr("ช่วงตัวเลือก", "Interval Options"),
          description: tr(
            <><code>hourStep</code>/<code>minuteStep</code>/<code>secondStep</code> กำหนดระยะห่างของตัวเลือก และ <code>changeOnScroll</code> ให้เลือกตามที่เลื่อนถึง</>,
            <><code>hourStep</code>/<code>minuteStep</code>/<code>secondStep</code> set the option interval; <code>changeOnScroll</code> selects whatever you scroll to.</>,
          ),
          code: intervalOptionsCode,
          component: <IntervalOptions />,
        },
        {
          title: tr("ส่วนต่อท้ายแผง", "Addon"),
          description: tr(
            <><code>renderExtraFooter</code> เติมแถบด้านล่างแผง และ <code>cellRender</code> เปลี่ยนหน้าตาของแต่ละตัวเลือก</>,
            <><code>renderExtraFooter</code> adds a strip under the panel, and <code>cellRender</code> re-renders single options.</>,
          ),
          code: addonCode,
          component: <Addon />,
        },
        {
          title: tr("แบบควบคุมค่า", "Controlled"),
          description: tr(
            <>ผูก <code>value</code> กับ <code>onChange</code> ถ้าไม่อยากให้ต้องกด OK ให้ใส่ <code>needConfirm=&#123;false&#125;</code></>,
            <>Bind <code>value</code> to <code>onChange</code>; add <code>needConfirm=&#123;false&#125;</code> to commit without the OK button.</>,
          ),
          code: controlledCode,
          component: <Controlled />,
        },
        {
          title: tr("สถานะ", "Status"),
          description: tr(
            <><code>status</code> ใส่กรอบแดง/เหลืองสำหรับผลการตรวจสอบฟอร์ม</>,
            <><code>status</code> paints the validation border red or amber.</>,
          ),
          code: statusCode,
          component: <Status />,
        },
        {
          title: tr("รูปแบบกล่อง", "Variant"),
          description: tr(
            <>สี่รูปแบบ: <code>outlined</code>, <code>filled</code>, <code>borderless</code>, <code>underlined</code></>,
            <>Four variants: <code>outlined</code>, <code>filled</code>, <code>borderless</code>, <code>underlined</code>.</>,
          ),
          code: variantCode,
          component: <Variant />,
        },
        {
          title: tr("ไอคอนหน้า-หลัง", "Prefix and Suffix"),
          description: tr(
            <><code>prefix</code>, <code>suffixIcon</code> และ <code>allowClear=&#123;&#123; clearIcon &#125;&#125;</code> เปลี่ยนไอคอนได้ทั้งหมด</>,
            <><code>prefix</code>, <code>suffixIcon</code> and <code>allowClear=&#123;&#123; clearIcon &#125;&#125;</code> replace every icon.</>,
          ),
          code: prefixSuffixCode,
          component: <PrefixSuffix />,
        },
      ]}
      api={[
        {
          title: "TimePicker",
          rows: [
            { property: "value", description: tr("เวลาที่เลือก (controlled)", "Selected time (controlled)"), type: "Dayjs | null", default: "-" },
            { property: "defaultValue", description: tr("เวลาเริ่มต้นแบบ uncontrolled", "Initial time (uncontrolled)"), type: "Dayjs | null", default: "-" },
            { property: "onChange", description: tr("ยิงเมื่อค่าถูกยืนยัน (OK, Now, พิมพ์เอง หรือทุกครั้งที่เลือกเมื่อ needConfirm=false)", "Fires when the value is confirmed (OK, Now, typing, or every pick when needConfirm=false)"), type: "(time: Dayjs | null, timeString: string) => void", default: "-" },
            { property: "onSelect", description: tr("ยิงทุกครั้งที่เลือกจากคอลัมน์ ก่อนการยืนยัน", "Fires on every column pick, before confirmation"), type: "(time: Dayjs) => void", default: "-" },
            { property: "format", description: tr("รูปแบบการแสดงผลและการพิมพ์ (dayjs)", "Display + typing format (dayjs)"), type: "string", default: "HH:mm:ss" },
            { property: "placeholder", description: tr("ข้อความเมื่อยังไม่เลือก", "Placeholder text"), type: "string", default: "Select time" },
            { property: "open / defaultOpen", description: tr("ควบคุมการเปิดแผง", "Control the panel visibility"), type: "boolean", default: "false" },
            { property: "onOpenChange", description: tr("ยิงเมื่อแผงเปิด/ปิด", "Fires when the panel opens or closes"), type: "(open: boolean) => void", default: "-" },
            { property: "placement", description: tr("ตำแหน่งของแผงเทียบกับกล่อง", "Panel position relative to the input"), type: "bottomLeft | bottomRight | topLeft | topRight", default: "bottomLeft" },
            { property: "size", description: tr("ความสูง 24 / 32 / 40px", "Height 24 / 32 / 40px"), type: "sm | md | lg", default: "md" },
            { property: "variant", description: tr("รูปแบบกล่อง", "Input variant"), type: "outlined | borderless | filled | underlined", default: "outlined" },
            { property: "status", description: tr("สถานะการตรวจสอบ", "Validation status"), type: "error | warning", default: "-" },
            { property: "disabled", description: tr("ปิดใช้งาน", "Disable the picker"), type: "boolean", default: "false" },
            { property: "allowClear", description: tr("แสดงปุ่มล้างค่า ส่งอ็อบเจกต์เพื่อเปลี่ยนไอคอน", "Show the clear button; pass an object to replace the icon"), type: "boolean | { clearIcon?: ReactNode }", default: "true" },
            { property: "use12Hours", description: tr("ระบบ 12 ชั่วโมงพร้อมคอลัมน์ AM/PM (เดาจาก format ได้)", "12-hour clock with an AM/PM column (inferred from format)"), type: "boolean", default: "false" },
            { property: "showHour / showMinute / showSecond", description: tr("แสดงคอลัมน์นั้นหรือไม่ ไม่ระบุ = เดาจาก format", "Show that column; when omitted it is inferred from format"), type: "boolean", default: "true" },
            { property: "hourStep / minuteStep / secondStep", description: tr("ระยะห่างของตัวเลือกในแต่ละคอลัมน์", "Interval between options in each column"), type: "number", default: "1" },
            { property: "showNow", description: tr("แสดงปุ่มลัด Now ในแถบล่าง", "Show the Now shortcut in the footer"), type: "boolean", default: "true" },
            { property: "needConfirm", description: tr("ต้องกด OK ก่อนค่าจะถูกยืนยัน", "Require the OK button before committing"), type: "boolean", default: "true" },
            { property: "changeOnScroll", description: tr("เลือกตัวเลือกที่เลื่อนไปถึงโดยไม่ต้องคลิก", "Select the option you scroll to, without clicking"), type: "boolean", default: "false" },
            { property: "disabledTime", description: tr("กำหนดชั่วโมง/นาที/วินาทีที่เลือกไม่ได้", "Specify hours / minutes / seconds that cannot be selected"), type: "(now: Dayjs) => DisabledTimeConfig", default: "-" },
            { property: "hideDisabledOptions", description: tr("ซ่อนตัวเลือกที่ถูกปิดแทนการทำให้จาง", "Hide disabled options instead of dimming them"), type: "boolean", default: "false" },
            { property: "minDate / maxDate", description: tr("ขอบเขตของเวลาที่เลือกได้ (ใช้ร่วมกับ disabledTime)", "Bounds of the selectable time (combined with disabledTime)"), type: "Dayjs", default: "-" },
            { property: "inputReadOnly", description: tr("ห้ามพิมพ์ในช่อง เลือกได้จากแผงเท่านั้น", "Block typing; only the panel can change the value"), type: "boolean", default: "false" },
            { property: "autoFocus", description: tr("โฟกัสช่องกรอกตอน mount", "Focus the input on mount"), type: "boolean", default: "false" },
            { property: "renderExtraFooter", description: tr("เนื้อหาเพิ่มใต้แผง", "Extra content under the panel"), type: "() => ReactNode", default: "-" },
            { property: "cellRender", description: tr("เรนเดอร์ตัวเลือกในคอลัมน์เอง", "Custom render for a column option"), type: "(value, info: { type, originNode }) => ReactNode", default: "-" },
            { property: "prefix", description: tr("เนื้อหาหน้าช่องกรอก", "Content before the input"), type: "ReactNode", default: "-" },
            { property: "suffixIcon", description: tr("ไอคอนท้ายช่อง แทนรูปนาฬิกา", "Icon at the end, replacing the clock"), type: "ReactNode", default: "<Clock />" },
            { property: "className / style", description: tr("คลาส/สไตล์ของกล่อง", "Class / style of the input box"), type: "string | CSSProperties", default: "-" },
            { property: "popupClassName / popupStyle", description: tr("คลาส/สไตล์ของแผง", "Class / style of the panel"), type: "string | CSSProperties", default: "-" },
            { property: "id / name", description: tr("id และ name ของ input จริง (ส่งไปกับฟอร์มได้)", "id and name of the underlying input (submits with the form)"), type: "string", default: "-" },
            { property: "onFocus / onBlur", description: tr("อีเวนต์โฟกัสของช่องกรอก", "Focus events of the input"), type: "(e: FocusEvent<HTMLInputElement>) => void", default: "-" },
          ],
        },
        {
          title: "TimePicker.RangePicker",
          description: tr(
            "รับพร็อพเดียวกับ TimePicker (ยกเว้นที่ระบุด้านล่าง)",
            "Accepts the same props as TimePicker, except for the ones listed below.",
          ),
          rows: [
            { property: "value", description: tr("ช่วงเวลาที่เลือก (controlled)", "Selected range (controlled)"), type: "[Dayjs | null, Dayjs | null] | null", default: "-" },
            { property: "defaultValue", description: tr("ช่วงเวลาเริ่มต้น", "Initial range"), type: "[Dayjs | null, Dayjs | null] | null", default: "-" },
            { property: "onChange", description: tr("ยิงเมื่อเลือกครบทั้งสองข้าง หรือเมื่อกดล้างค่า", "Fires when both sides are chosen, or when cleared"), type: "(times: [Dayjs, Dayjs] | null, timeStrings: [string, string]) => void", default: "-" },
            { property: "onSelect", description: tr("ยิงทุกครั้งที่เลือก พร้อมบอกว่าเป็นข้างไหน", "Fires on every pick, telling you which side"), type: "(time: Dayjs, type: 'start' | 'end') => void", default: "-" },
            { property: "placeholder", description: tr("ข้อความของทั้งสองช่อง", "Placeholder of both inputs"), type: "[string, string]", default: '["Start time", "End time"]' },
            { property: "disabled", description: tr("ปิดใช้งานทั้งคู่ หรือแยกทีละข้าง", "Disable both, or each side separately"), type: "boolean | [boolean, boolean]", default: "false" },
            { property: "disabledTime", description: tr("จำกัดตัวเลือกแยกตามข้างที่กำลังเลือก", "Restrict options per side being edited"), type: "(now: Dayjs, type: 'start' | 'end') => DisabledTimeConfig", default: "-" },
            { property: "order", description: tr("เรียงค่าจากน้อยไปมากให้อัตโนมัติเมื่อเลือกครบ", "Sort the two values ascending once both are picked"), type: "boolean", default: "true" },
            { property: "separator", description: tr("ตัวคั่นระหว่างสองช่อง", "Separator between the two inputs"), type: "ReactNode", default: "<ArrowRight />" },
          ],
        },
        {
          title: "DisabledTimeConfig",
          description: tr("ค่าที่คืนจาก `disabledTime`", "The object returned from `disabledTime`."),
          rows: [
            { property: "disabledHours", description: tr("ชั่วโมงที่เลือกไม่ได้", "Hours that cannot be selected"), type: "() => number[]", default: "-" },
            { property: "disabledMinutes", description: tr("นาทีที่เลือกไม่ได้ ตามชั่วโมงที่เลือกอยู่", "Minutes that cannot be selected, given the chosen hour"), type: "(hour: number) => number[]", default: "-" },
            { property: "disabledSeconds", description: tr("วินาทีที่เลือกไม่ได้ ตามชั่วโมง/นาทีที่เลือกอยู่", "Seconds that cannot be selected, given the chosen hour and minute"), type: "(hour: number, minute: number) => number[]", default: "-" },
          ],
        },
      ]}
      extra={tr(
        <>
          <h2>หมายเหตุ</h2>
          <h3>พิมพ์เวลาเองได้</h3>
          <p>
            ช่องกรอกเป็น <code>input</code> จริง พิมพ์ตาม <code>format</code> แล้วกด Enter หรือคลิกออกเพื่อยืนยัน ถ้าอ่านค่าไม่ได้จะย้อนกลับเป็นค่าเดิม
            ปิดการพิมพ์ด้วย <code>inputReadOnly</code>
          </p>
          <h3>ค่าเป็น Dayjs เสมอ</h3>
          <p>
            ส่วนของวันที่จะยึดตามค่าเดิม (หรือวันนี้ถ้ายังว่าง) เปลี่ยนเฉพาะเวลา — เอาไปรวมกับ DatePicker ได้ตรงๆ
          </p>
        </>,
        <>
          <h2>Notes</h2>
          <h3>The field is typeable</h3>
          <p>
            The trigger is a real <code>input</code>: type a value in the given <code>format</code> and press Enter (or
            click away) to commit. Unparseable text reverts to the previous value. Use <code>inputReadOnly</code> to turn
            typing off.
          </p>
          <h3>Values stay Dayjs</h3>
          <p>
            The date part is kept from the current value (or today when empty) and only the time is replaced, so the
            result composes directly with DatePicker.
          </p>
        </>,
      )}
      related={[
        { title: "DatePicker", path: "/components/date-picker" },
        { title: "Calendar", path: "/components/calendar" },
        { title: "Select", path: "/components/select" },
      ]}
    />
  );
}
