import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Size from "./demos/size";
import sizeCode from "./demos/size.tsx?raw";
import Addon from "./demos/addon";
import addonCode from "./demos/addon.tsx?raw";
import Formatter from "./demos/formatter";
import formatterCode from "./demos/formatter.tsx?raw";
import Keyboard from "./demos/keyboard";
import keyboardCode from "./demos/keyboard.tsx?raw";
import Wheel from "./demos/wheel";
import wheelCode from "./demos/wheel.tsx?raw";
import OutOfRange from "./demos/out-of-range";
import outOfRangeCode from "./demos/out-of-range.tsx?raw";
import Precision from "./demos/precision";
import precisionCode from "./demos/precision.tsx?raw";
import Prefix from "./demos/prefix";
import prefixCode from "./demos/prefix.tsx?raw";
import Status from "./demos/status";
import statusCode from "./demos/status.tsx?raw";
import Variant from "./demos/variant";
import variantCode from "./demos/variant.tsx?raw";
import Disabled from "./demos/disabled";
import disabledCode from "./demos/disabled.tsx?raw";
import Controls from "./demos/controls";
import controlsCode from "./demos/controls.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="input-number"
      imports={["InputNumber"]}
      whenToUse={tr(
        <>
          <p>กรอกตัวเลขในช่วงที่กำหนด ด้วยเมาส์หรือ keyboard</p>
          <ul>
            <li>เมื่อค่าที่ต้องกรอกเป็นตัวเลข</li>
            <li>เมื่อค่ามี step ที่ชัดเจน (จำนวน เปอร์เซ็นต์ ราคา) และผู้ใช้ได้ประโยชน์จากปุ่มเพิ่ม/ลด</li>
          </ul>
        </>,
        <>
          <p>Enter a number within a certain range with the mouse or keyboard.</p>
          <ul>
            <li>When a numeric value needs to be provided.</li>
            <li>When the value has a natural step (quantity, percentage, price) and users benefit from increment / decrement controls.</li>
          </ul>
        </>,
      )}
      demos={[
        { title: tr("พื้นฐาน", "Basic"), description: tr("ช่องกรอกที่รับเฉพาะตัวเลข", "Numeric-only input box."), code: basicCode, component: <Basic /> },
        { title: tr("ขนาด", "Sizes"), description: tr(<>มีสามขนาด: <code>lg</code>, <code>md</code> (ค่าเริ่มต้น), <code>sm</code></>, <>There are three sizes: <code>lg</code>, <code>md</code> (default), <code>sm</code>.</>), code: sizeCode, component: <Size /> },
        { title: tr("ส่วนต่อหน้า / ท้ายช่อง", "Pre / Post tab"), description: tr(<>ต่อเนื้อหาหน้า-หลังช่องด้วย <code>addonBefore</code> / <code>addonAfter</code></>, <>Attach content with <code>addonBefore</code> / <code>addonAfter</code>.</>), code: addonCode, component: <Addon /> },
        { title: tr("จัดรูปแบบค่า", "Formatter"), description: tr(<>แสดงค่าให้ตรงบริบทด้วย <code>formatter</code> และมักใช้คู่กับ <code>parser</code> เสมอ</>, <>Display value within it's situation with <code>formatter</code>, and we usually use <code>parser</code> at the same time.</>), code: formatterCode, component: <Formatter /> },
        { title: tr("keyboard", "Keyboard"), description: tr(<>เพิ่ม/ลดค่าด้วย ArrowUp / ArrowDown ปิดได้ด้วย <code>keyboard={"{false}"}</code></>, <>Control the step with ArrowUp / ArrowDown; disable it with <code>keyboard={"{false}"}</code>.</>), code: keyboardCode, component: <Keyboard /> },
        { title: tr("ล้อเมาส์", "Wheel"), description: tr(<><code>changeOnWheel</code> ให้หมุนล้อเมาส์เพื่อเพิ่ม/ลดค่าขณะ focus อยู่</>, <><code>changeOnWheel</code> steps the value with the mouse wheel while focused.</>), code: wheelCode, component: <Wheel /> },
        { title: tr("ค่านอกช่วง", "Out of range"), description: tr(<>ค่าที่เกิน <code>min</code> / <code>max</code> จะเป็นสีแดงระหว่างพิมพ์ และถูกดึงกลับเข้าช่วงเมื่อ blur</>, <>Values outside <code>min</code> / <code>max</code> turn red while typing and are clamped on blur.</>), code: outOfRangeCode, component: <OutOfRange /> },
        { title: tr("ทศนิยมความละเอียดสูง", "High precision decimals"), description: tr(<>เพิ่ม/ลดทศนิยมได้ตรงเป๊ะ (0.1 + 0.2 = 0.3) ตรึงจำนวนตำแหน่งด้วย <code>precision</code> หรือเปลี่ยน <code>decimalSeparator</code></>, <>Decimal steps stay exact (0.1 + 0.2 = 0.3). Fix decimals with <code>precision</code>, or change the <code>decimalSeparator</code>.</>), code: precisionCode, component: <Precision /> },
        { title: tr("prefix / suffix", "Prefix / Suffix"), description: tr(<>ใส่ไอคอน <code>prefix</code> หรือ <code>suffix</code> ไว้ในช่องกรอก</>, <>Add a <code>prefix</code> or <code>suffix</code> icon inside the input.</>), code: prefixCode, component: <Prefix /> },
        { title: tr("สถานะ", "Status"), description: tr(<>ใส่สถานะผ่าน <code>status</code>: <code>error</code> หรือ <code>warning</code></>, <>Add status with <code>status</code>: <code>error</code> or <code>warning</code>.</>), code: statusCode, component: <Status /> },
        { title: tr("รูปแบบ", "Variants"), description: tr(<>มีสี่รูปแบบ: <code>outlined</code>, <code>filled</code>, <code>borderless</code>, <code>underlined</code></>, <>Four variants: <code>outlined</code>, <code>filled</code>, <code>borderless</code>, <code>underlined</code>.</>), code: variantCode, component: <Variant /> },
        { title: tr("ปิดใช้งาน", "Disabled"), description: tr(<>กดปุ่มเพื่อสลับระหว่างใช้งานได้กับปิดใช้งาน ส่วน <code>readOnly</code> คงค่าไว้แต่ซ่อนปุ่มเพิ่ม/ลด</>, <>Click the button to toggle between available and disabled states; <code>readOnly</code> keeps the value but hides the controls.</>), code: disabledCode, component: <Disabled /> },
        { title: tr("ปุ่มเพิ่ม/ลด", "Controls"), description: tr(<>ซ่อนปุ่มเพิ่ม/ลดด้วย <code>controls={"{false}"}</code> หรือส่ง <code>upIcon</code> / <code>downIcon</code> ของตัวเอง</>, <>Hide the controls with <code>controls={"{false}"}</code> or pass custom <code>upIcon</code> / <code>downIcon</code>.</>), code: controlsCode, component: <Controls /> },
      ]}
      api={[
        {
          title: "InputNumber",
          description: "Extends React.ComponentProps<\"input\"> (except size, prefix, value, defaultValue, onChange, min, max, step, type).",
          rows: [
            { property: "addonAfter", description: "The label text displayed after (on the right side of) the input field", type: "ReactNode", default: "-" },
            { property: "addonBefore", description: "The label text displayed before (on the left side of) the input field", type: "ReactNode", default: "-" },
            { property: "changeOnBlur", description: "Trigger onChange when blur (commits typed text)", type: "boolean", default: "true" },
            { property: "changeOnWheel", description: "Allow control with mouse wheel while focused", type: "boolean", default: "false" },
            { property: "controls", description: "Whether to show +- controls, or set custom arrows icon", type: "boolean | { upIcon?: ReactNode; downIcon?: ReactNode }", default: "true" },
            { property: "decimalSeparator", description: "Decimal separator", type: "string", default: "." },
            { property: "defaultValue", description: "The initial value", type: "number | null", default: "-" },
            { property: "disabled", description: "If disable the input", type: "boolean", default: "false" },
            { property: "formatter", description: "Specifies the format of the value presented", type: "(value: string, info: { userTyping: boolean; input: string }) => string", default: "-" },
            { property: "keyboard", description: "If enable keyboard behavior (ArrowUp / ArrowDown)", type: "boolean", default: "true" },
            { property: "max", description: "The max value", type: "number", default: "-" },
            { property: "min", description: "The min value", type: "number", default: "-" },
            { property: "parser", description: "Specifies the value extracted from formatter", type: "(displayValue: string) => string", default: "-" },
            { property: "precision", description: "The precision of input value. Will use formatter when config of formatter", type: "number", default: "-" },
            { property: "prefix", description: "The prefix icon for the Input", type: "ReactNode", default: "-" },
            { property: "suffix", description: "The suffix icon for the Input", type: "ReactNode", default: "-" },
            { property: "readOnly", description: "If readonly the input", type: "boolean", default: "false" },
            { property: "size", description: "The height of input box", type: "sm | md | lg", default: "md" },
            { property: "status", description: "Set validation status", type: "error | warning", default: "-" },
            { property: "step", description: "The number to which the current value is increased or decreased. It can be an integer or decimal", type: "number", default: "1" },
            { property: "variant", description: "Variants of Input", type: "outlined | filled | borderless | underlined", default: "outlined" },
            { property: "value", description: "The current value (`null` when empty)", type: "number | null", default: "-" },
            { property: "onChange", description: "The callback triggered when the value is changed", type: "(value: number | null) => void", default: "-" },
            { property: "onPressEnter", description: "The callback function that is triggered when Enter key is pressed", type: "(e: KeyboardEvent) => void", default: "-" },
            { property: "onStep", description: "The callback function that is triggered when click up or down buttons / arrows", type: "(value: number, info: { offset: number; type: 'up' | 'down' }) => void", default: "-" },
            { property: "classNames", description: "Class names for inner slots (wrapper, input, prefix, suffix, controls, addonBefore, addonAfter)", type: "object", default: "-" },
          ],
        },
      ]}
      extra={tr(
        <>
          <h2>คำถามที่พบบ่อย</h2>
          <h3>ทำไม <code>value</code> ถึงกลายเป็น <code>null</code>?</h3>
          <p>ช่องว่างเปล่าไม่มีตัวเลข <code>onChange</code> จึงได้ <code>null</code> เหมือนกับ KKUI ส่วนข้อความที่ไม่ใช่ตัวเลข (เช่น <code>abc</code>) จะถูกคืนค่าเดิมตอน blur และไม่ยิง change</p>
        </>,
        <>
          <h2>FAQ</h2>
          <h3>Why does <code>value</code> become <code>null</code>?</h3>
          <p>An empty box has no number, so <code>onChange</code> receives <code>null</code> — the same as KKUI. Invalid text (e.g. <code>abc</code>) is reverted on blur and does not fire a change.</p>
        </>,
      )}
      related={[{ title: "Input", path: "/components/input" }]}
    />
  );
}
