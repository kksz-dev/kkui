import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Sizes from "./demos/sizes";
import sizesCode from "./demos/sizes.tsx?raw";
import Controlled from "./demos/controlled";
import controlledCode from "./demos/controlled.tsx?raw";
import AllowClear from "./demos/allow-clear";
import allowClearCode from "./demos/allow-clear.tsx?raw";
import Disabled from "./demos/disabled";
import disabledCode from "./demos/disabled.tsx?raw";
import TextDemo from "./demos/text";
import textCode from "./demos/text.tsx?raw";
import Presets from "./demos/presets";
import presetsCode from "./demos/presets.tsx?raw";
import FormatDemo from "./demos/format";
import formatCode from "./demos/format.tsx?raw";
import TriggerDemo from "./demos/trigger";
import triggerCode from "./demos/trigger.tsx?raw";
import PanelRenderDemo from "./demos/panel-render";
import panelRenderCode from "./demos/panel-render.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="color-picker"
      imports={["ColorPicker"]}
      whenToUse={tr(
        <ul>
          <li>ใช้เลือกและปรับสีในหน้าจอที่ต้องให้ผู้ใช้กำหนดสีเอง</li>
          <li>รองรับ HEX, RGB และ HSB พร้อม alpha channel และชุดสี preset</li>
        </ul>,
        <ul>
          <li>Used for selecting and adjusting colors across user interfaces.</li>
          <li>Supports HEX, RGB, and HSB representations with alpha channel and presets.</li>
        </ul>,
      )}
      demos={[
        { title: tr("การใช้งานพื้นฐาน", "Basic"), description: tr("ใช้งานแบบง่ายที่สุด", "The simplest usage."), code: basicCode, component: <Basic /> },
        { title: tr("ขนาด", "Sizes"), description: tr(<>สามขนาด: <code>sm</code>, <code>md</code> (ค่าเริ่มต้น) และ <code>lg</code></>, <>Three sizes: <code>sm</code>, <code>md</code> (default), and <code>lg</code>.</>), code: sizesCode, component: <Sizes /> },
        { title: tr("โหมด controlled", "Controlled"), description: tr(<>คุมค่าสีเองด้วย <code>value</code> คู่กับ <code>onChange</code></>, <>Controlled color selection with <code>value</code> and <code>onChange</code>.</>), code: controlledCode, component: <Controlled /> },
        { title: tr("ล้างค่าได้", "Allow Clear"), description: tr(<>ใส่ <code>allowClear</code> เพื่อให้ล้างสีที่เลือกไว้ได้</>, <>Allow clearing the selected color with <code>allowClear</code>.</>), code: allowClearCode, component: <AllowClear /> },
        { title: tr("ปิดใช้งานและปิด alpha", "Disabled & Disabled Alpha"), description: tr(<>ปิดการโต้ตอบด้วย <code>disabled</code> หรือปิดเฉพาะ alpha channel ด้วย <code>disabledAlpha</code></>, <>Disable interaction with <code>disabled</code>, or disable the alpha channel via <code>disabledAlpha</code>.</>), code: disabledCode, component: <Disabled /> },
        { title: tr("แสดงข้อความ", "Show Text"), description: tr(<>แสดงค่าสีหรือข้อความที่กำหนดเองใน trigger ผ่าน <code>showText</code></>, <>Render the color value or custom text inside the trigger via <code>showText</code>.</>), code: textCode, component: <TextDemo /> },
        { title: tr("ชุดสีสำเร็จ", "Presets"), description: tr(<>แสดงจานสีที่เตรียมไว้ล่วงหน้าด้วย <code>presets</code></>, <>Display pre-configured color palettes using <code>presets</code>.</>), code: presetsCode, component: <Presets /> },
        { title: tr("รูปแบบค่าสี", "Color Formats"), description: tr(<>เลือกรูปแบบค่าสี (HEX, RGB, HSB) หรือปิดตัวเลือกรูปแบบทิ้ง</>, <>Configure color formats (HEX, RGB, HSB) or disable format selection.</>), code: formatCode, component: <FormatDemo /> },
        { title: tr("วิธีเปิด panel", "Trigger Mode"), description: tr(<>ตั้ง trigger เป็น <code>hover</code> หรือ <code>click</code></>, <>Set trigger mode to <code>hover</code> or <code>click</code>.</>), code: triggerCode, component: <TriggerDemo /> },
        { title: tr("กำหนด panel เอง", "Custom Panel Render"), description: tr(<>ปรับ popup panel เองผ่าน <code>panelRender</code></>, <>Customize the popup panel using <code>panelRender</code>.</>), code: panelRenderCode, component: <PanelRenderDemo /> },
      ]}
      api={[
        {
          title: "ColorPicker",
          rows: [
            { property: "allowClear", description: "Whether to allow clear color", type: "boolean", default: "false" },
            { property: "arrow", description: "Whether to show popup arrow", type: "boolean", default: "true" },
            { property: "defaultValue", description: "Default color value", type: "string", default: "#1677ff" },
            { property: "disabled", description: "Disable color picker", type: "boolean", default: "false" },
            { property: "disabledAlpha", description: "Disable alpha slider", type: "boolean", default: "false" },
            { property: "disabledFormat", description: "Disable format selector", type: "boolean", default: "false" },
            { property: "format", description: "Color format", type: "hex | rgb | hsb", default: "hex" },
            { property: "open", description: "Whether to show popup", type: "boolean", default: "false" },
            { property: "placement", description: "Popup placement position", type: "top | topLeft | topRight | bottom | bottomLeft | bottomRight | left | right", default: "bottomLeft" },
            { property: "presets", description: "Color preset palettes", type: "ColorPreset[]", default: "-" },
            { property: "showText", description: "Render color text beside swatch", type: "boolean | ((color: string) => ReactNode)", default: "false" },
            { property: "size", description: "Size of trigger", type: "sm | md | lg", default: "md" },
            { property: "trigger", description: "Trigger mode", type: "click | hover", default: "click" },
            { property: "value", description: "Color value (controlled)", type: "string", default: "-" },
            { property: "onChange", description: "Callback when color changes", type: "(color: string) => void", default: "-" },
            { property: "onChangeComplete", description: "Callback when color change is completed", type: "(color: string) => void", default: "-" },
            { property: "onFormatChange", description: "Callback when format changes", type: "(format: ColorFormat) => void", default: "-" },
            { property: "onOpenChange", description: "Callback when popup open changes", type: "(open: boolean) => void", default: "-" },
            { property: "panelRender", description: "Custom panel render function", type: "(panel: ReactNode, extra: { components: { Picker, Presets } }) => ReactNode", default: "-" },
          ],
        },
      ]}
      related={[{ title: "Rate", path: "/components/rate" }, { title: "Slider", path: "/components/slider" }]}
    />
  );
}
