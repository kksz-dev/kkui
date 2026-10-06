import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Variant from "./demos/variant";
import variantCode from "./demos/variant.tsx?raw";
import Size from "./demos/size";
import sizeCode from "./demos/size.tsx?raw";
import Presuffix from "./demos/presuffix";
import presuffixCode from "./demos/presuffix.tsx?raw";
import Addon from "./demos/addon";
import addonCode from "./demos/addon.tsx?raw";
import Search from "./demos/search";
import searchCode from "./demos/search.tsx?raw";
import SearchLoading from "./demos/search-loading";
import searchLoadingCode from "./demos/search-loading.tsx?raw";
import Textarea from "./demos/textarea";
import textareaCode from "./demos/textarea.tsx?raw";
import Autosize from "./demos/autosize";
import autosizeCode from "./demos/autosize.tsx?raw";
import Status from "./demos/status";
import statusCode from "./demos/status.tsx?raw";
import AllowClear from "./demos/allow-clear";
import allowClearCode from "./demos/allow-clear.tsx?raw";
import Password from "./demos/password";
import passwordCode from "./demos/password.tsx?raw";
import Otp from "./demos/otp";
import otpCode from "./demos/otp.tsx?raw";
import ShowCount from "./demos/show-count";
import showCountCode from "./demos/show-count.tsx?raw";
import Disabled from "./demos/disabled";
import disabledCode from "./demos/disabled.tsx?raw";
import Group from "./demos/group";
import groupCode from "./demos/group.tsx?raw";

const sharedRows = [
  { property: "size", description: "Height 24 / 32 / 40px", type: "sm | md | lg", default: "md" },
  { property: "variant", description: "Visual style", type: "outlined | filled | borderless | underlined", default: "outlined" },
  { property: "status", description: "Validation status", type: "error | warning", default: "-" },
  { property: "allowClear", description: "Show a clear icon when the value is not empty", type: "boolean | { clearIcon: ReactNode }", default: "false" },
  { property: "showCount", description: "Show a character counter", type: "boolean | { formatter: (info: { value, count, maxLength }) => ReactNode }", default: "false" },
  { property: "count", description: "Character count config: `show`, `max`, `strategy`, `exceedFormatter`", type: "InputCountConfig", default: "-" },
  { property: "maxLength", description: "Max length (native)", type: "number", default: "-" },
  { property: "value", description: "Controlled value", type: "string", default: "-" },
  { property: "defaultValue", description: "Initial value", type: "string", default: "-" },
  { property: "disabled", description: "Disabled state", type: "boolean", default: "false" },
  { property: "readOnly", description: "Read only state", type: "boolean", default: "false" },
  { property: "onChange", description: "Value change callback (native event)", type: "(e: ChangeEvent) => void", default: "-" },
  { property: "onPressEnter", description: "Called when Enter is pressed", type: "(e: KeyboardEvent) => void", default: "-" },
  { property: "onClear", description: "Called when the clear icon is clicked", type: "() => void", default: "-" },
  { property: "classNames", description: "Class names for inner slots (wrapper, input, prefix, suffix, count, addonBefore, addonAfter)", type: "InputClassNames", default: "-" },
];

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="input"
      imports={["Input", "InputTextArea", "InputSearch", "InputPassword", "InputOTP", "InputGroup"]}
      whenToUse={tr(
        <>
          <p>ช่องข้อความคือตัวรับค่าจากผู้ใช้ที่พื้นฐานที่สุด กรอกหรือแก้ไขค่าได้ทั้งจาก keyboard และเมาส์</p>
          <ul>
            <li>ต้องให้ผู้ใช้กรอกข้อมูลในฟอร์ม</li>
            <li>ต้องมีช่องค้นหา</li>
            <li>ข้อความหลายบรรทัด (<code>InputTextArea</code>), ข้อความที่ปิดบัง (<code>InputPassword</code>) หรือรหัสใช้ครั้งเดียว (<code>InputOTP</code>)</li>
          </ul>
        </>,
        <>
          <p>A basic widget for getting the user input is a text field. Keyboard and mouse can be used for providing or changing data.</p>
          <ul>
            <li>A user input in a form field is needed.</li>
            <li>A search input is required.</li>
            <li>Multi-line text (<code>InputTextArea</code>), masked text (<code>InputPassword</code>) or one-time codes (<code>InputOTP</code>).</li>
          </ul>
        </>,
      )}
      demos={[
        { title: tr("การใช้งานพื้นฐาน", "Basic usage"), description: tr("ตัวอย่างการใช้งานพื้นฐาน", "Basic usage example."), code: basicCode, component: <Basic /> },
        { title: tr("รูปแบบ", "Variants"), description: tr(<>มีสี่รูปแบบ: <code>outlined</code> (ค่าเริ่มต้น), <code>filled</code>, <code>borderless</code>, <code>underlined</code></>, <>Four variants: <code>outlined</code> (default), <code>filled</code>, <code>borderless</code>, <code>underlined</code>.</>), code: variantCode, component: <Variant /> },
        { title: tr("สามขนาด", "Three sizes"), description: tr(<>มีสามขนาด: <code>lg</code> (40px), <code>md</code> (32px ค่าเริ่มต้น) และ <code>sm</code> (24px)</>, <>There are three sizes: <code>lg</code> (40px), <code>md</code> (32px, default) and <code>sm</code> (24px).</>), code: sizeCode, component: <Size /> },
        { title: tr("prefix และ suffix", "Prefix and suffix"), description: tr(<>ใส่ไอคอนหรือข้อความไว้ในช่องกรอกด้วย <code>prefix</code> หรือ <code>suffix</code></>, <>Add a <code>prefix</code> or <code>suffix</code> icon or text inside the input.</>), code: presuffixCode, component: <Presuffix /> },
        { title: tr("ส่วนต่อหน้า / ท้ายช่อง", "Pre / Post tab"), description: tr(<>ใช้ <code>addonBefore</code> และ <code>addonAfter</code> ต่อเนื้อหาเข้ากับช่องกรอก</>, <>Using <code>addonBefore</code> and <code>addonAfter</code> to attach content to the input.</>), code: addonCode, component: <Addon /> },
        { title: tr("ช่องค้นหา", "Search box"), description: tr(<>ตัวอย่างการทำช่องค้นหาโดยรวมช่องกรอกปกติเข้ากับปุ่มค้นหา <code>enterButton</code> รับได้ทั้ง boolean, node หรือ <code>Button</code> ที่กำหนดเอง</>, <>Example of creating a search box by grouping a standard input with a search button. <code>enterButton</code> takes a boolean, a node, or a custom <code>Button</code>.</>), code: searchCode, component: <Search /> },
        { title: tr("ช่องค้นหาแบบกำลังโหลด", "Search box with loading"), description: tr(<>ช่องค้นหาที่ใส่ <code>loading</code> เพื่อบอกว่ากำลังรอผลอยู่</>, <>Search box with <code>loading</code> to indicate an in-flight request.</>), code: searchLoadingCode, component: <SearchLoading /> },
        { title: tr("TextArea", "TextArea"), description: tr(<>สำหรับข้อความหลายบรรทัด ใช้ <code>rows</code> กำหนดความสูงเริ่มต้น</>, <>For multi-line input, <code>rows</code> sets the initial height.</>), code: textareaCode, component: <Textarea /> },
        { title: tr("ปรับความสูงอัตโนมัติ", "Autosizing the height"), description: tr(<><code>autoSize</code> ส่งเป็น boolean หรืออ็อบเจกต์ที่มี <code>minRows</code> / <code>maxRows</code> ก็ได้</>, <><code>autoSize</code> can be a boolean or an object with <code>minRows</code> / <code>maxRows</code>.</>), code: autosizeCode, component: <Autosize /> },
        { title: tr("สถานะ", "Status"), description: tr(<>ใส่สถานะให้ Input ด้วย <code>status</code> ซึ่งเป็น <code>error</code> หรือ <code>warning</code></>, <>Add status to Input with <code>status</code>, which could be <code>error</code> or <code>warning</code>.</>), code: statusCode, component: <Status /> },
        { title: tr("ปุ่มล้างค่า", "With clear icon"), description: tr(<>ช่องกรอกที่มีไอคอนล้างค่า กดแล้วลบข้อความทั้งหมด</>, <>Input box with the remove icon, click the icon to delete everything.</>), code: allowClearCode, component: <AllowClear /> },
        { title: tr("ช่องรหัสผ่าน", "Password box"), description: tr(<>ช่องกรอกแบบรหัสผ่าน คุมปุ่มสลับการมองเห็นได้ด้วย <code>visibilityToggle</code></>, <>Input type of password; visibility toggle can be controlled with <code>visibilityToggle</code>.</>), code: passwordCode, component: <Password /> },
        { title: tr("OTP", "OTP"), description: tr(<>ช่องกรอกรหัสใช้ครั้งเดียว สร้างบน <code>OneTimePasswordField</code> ของ KKUI ทั้งการวาง ปุ่มลูกศร และ backspace ทำงานเหมือน KKUI</>, <>One time password input. Built on KKUI <code>OneTimePasswordField</code>: paste, arrow keys and backspace behave like KKUI.</>), code: otpCode, component: <Otp /> },
        { title: tr("นับจำนวนตัวอักษร", "With character counting"), description: tr(<>แสดงจำนวนตัวอักษรผ่าน <code>showCount</code> หรือตั้งละเอียดกว่าด้วย config <code>count</code></>, <>Show character counting via <code>showCount</code> or the richer <code>count</code> config.</>), code: showCountCode, component: <ShowCount /> },
        { title: tr("ปิดใช้งานและอ่านอย่างเดียว", "Disabled and read only"), description: tr(<><code>disabled</code> และ <code>readOnly</code> ใช้ได้ทั้ง Input และ TextArea</>, <><code>disabled</code> and <code>readOnly</code> across Input and TextArea.</>), code: disabledCode, component: <Disabled /> },
        { title: tr("กลุ่มแบบชิดกัน", "Compact group"), description: tr(<><code>InputGroup compact</code> ต่อช่องกรอกกับปุ่มให้ติดกัน คล้าย <code>Space.Compact</code></>, <><code>InputGroup compact</code> attaches inputs and buttons together, like <code>Space.Compact</code>.</>), code: groupCode, component: <Group /> },
      ]}
      api={[
        {
          title: "Input",
          description: "Extends React.ComponentProps<\"input\"> (except size, prefix, value, defaultValue, onChange).",
          rows: [
            { property: "prefix", description: "Prefix icon or text inside the input", type: "ReactNode", default: "-" },
            { property: "suffix", description: "Suffix icon or text inside the input", type: "ReactNode", default: "-" },
            { property: "addonBefore", description: "Label or content attached before the input", type: "ReactNode", default: "-" },
            { property: "addonAfter", description: "Label or content attached after the input", type: "ReactNode", default: "-" },
            ...sharedRows,
          ],
        },
        {
          title: "InputTextArea",
          description: "Same as Input (without prefix/suffix/addons), plus:",
          rows: [
            { property: "autoSize", description: "Height auto-adjusts to content; object clamps rows", type: "boolean | { minRows?: number; maxRows?: number }", default: "false" },
            { property: "rows", description: "Initial visible lines", type: "number", default: "2" },
            { property: "onResize", description: "Called when the textarea size changes", type: "({ width, height }) => void", default: "-" },
          ],
        },
        {
          title: "InputSearch",
          description: "Same as Input, plus:",
          rows: [
            { property: "enterButton", description: "Show a search button after the input; `true` for the icon button, node for a primary button, or a custom `<Button>`", type: "boolean | ReactNode", default: "false" },
            { property: "loading", description: "Search box with loading", type: "boolean", default: "false" },
            { property: "onSearch", description: "Called when the search icon / button is clicked, Enter is pressed, or the value is cleared", type: "(value: string, event?: SyntheticEvent, info?: { source: \"input\" | \"clear\" }) => void", default: "-" },
          ],
        },
        {
          title: "InputPassword",
          description: "Same as Input, plus:",
          rows: [
            { property: "iconRender", description: "Custom toggle icon", type: "(visible: boolean) => ReactNode", default: "(visible) => visible ? <Eye /> : <EyeOff />" },
            { property: "visibilityToggle", description: "Whether to show the toggle button, or control it", type: "boolean | { visible: boolean; onVisibleChange: (visible: boolean) => void }", default: "true" },
          ],
        },
        {
          title: "InputOTP",
          rows: [
            { property: "length", description: "Number of cells", type: "number", default: "6" },
            { property: "value", description: "Controlled value", type: "string", default: "-" },
            { property: "defaultValue", description: "Initial value", type: "string", default: "-" },
            { property: "formatter", description: "Transform typed characters", type: "(value: string) => string", default: "-" },
            { property: "mask", description: "Hide characters: `true` for password dots or a custom character", type: "boolean | string", default: "false" },
            { property: "separator", description: "Node rendered between cells", type: "ReactNode | (index: number) => ReactNode", default: "-" },
            { property: "size", description: "Cell size", type: "sm | md | lg", default: "md" },
            { property: "variant", description: "Visual style", type: "outlined | filled | borderless | underlined", default: "outlined" },
            { property: "status", description: "Validation status", type: "error | warning", default: "-" },
            { property: "disabled", description: "Disabled state", type: "boolean", default: "false" },
            { property: "autoFocus", description: "Focus first cell on mount", type: "boolean", default: "false" },
            { property: "type", description: "Native input type of the cells", type: "text | password", default: "text" },
            { property: "onChange", description: "Called when all cells are filled", type: "(value: string) => void", default: "-" },
            { property: "onInput", description: "Called on every keystroke with per-cell values", type: "(value: string[]) => void", default: "-" },
          ],
        },
        {
          title: "InputGroup",
          rows: [
            { property: "compact", description: "Attach children (collapse borders / radius)", type: "boolean", default: "false" },
            { property: "size", description: "Data attribute for the group size", type: "sm | md | lg", default: "-" },
          ],
        },
      ]}
      extra={tr(
        <>
          <h2>คำถามที่พบบ่อย</h2>
          <h3>ทำไม <code>Input</code> ถึงเสีย focus เมื่อใส่ prefix?</h3>
          <p>element ที่มีเส้นขอบคือ <code>span</code> ที่ครอบอยู่ ตัว wrapper จะส่งต่อการคลิกไปยัง input จริง ดังนั้นส่ง <code>ref</code> เข้าไปก็ยังชี้ที่ <code>&lt;input&gt;</code> เหมือนเดิม</p>
        </>,
        <>
          <h2>FAQ</h2>
          <h3>Why does <code>Input</code> lose focus when I add a prefix?</h3>
          <p>The bordered element is a wrapper <code>span</code>; the wrapper forwards clicks to the native input, so pass <code>ref</code> and it still points at the <code>&lt;input&gt;</code>.</p>
        </>,
      )}
      related={[{ title: "Input Number", path: "/components/input-number" }, { title: "Mentions", path: "/components/mentions" }]}
    />
  );
}
