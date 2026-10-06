import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import ComponentSize from "./demos/component-size";
import componentSizeCode from "./demos/component-size.tsx?raw";
import Compact from "./demos/compact";
import compactCode from "./demos/compact.tsx?raw";
import DarkAlgorithm from "./demos/dark-algorithm";
import darkAlgorithmCode from "./demos/dark-algorithm.tsx?raw";
import Locale from "./demos/locale";
import localeCode from "./demos/locale.tsx?raw";
import Disabled from "./demos/disabled";
import disabledCode from "./demos/disabled.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="config-provider"
      imports={["ConfigProvider"]}
      whenToUse={tr(
        <ul>
          <li>ตั้งสีหลัก ความมน ขนาดฟอนต์ ให้ทั้งแอปในที่เดียว โดยไม่ต้องแก้ทีละคอมโพเนนต์</li>
          <li>บังคับขนาดคอนโทรล (sm / md / lg) หรือปิดการใช้งานทั้งฟอร์มพร้อมกัน</li>
          <li>สลับภาษาไทย/อังกฤษของข้อความในตัวคอมโพเนนต์ เช่น ตาราง ตัวกรอง Modal</li>
          <li>กำหนดว่า popup (Select / DatePicker / Dropdown) จะไปแขวนที่ element ไหน เวลาอยู่ใน container ที่ scroll เอง</li>
        </ul>,
        <ul>
          <li>Set the primary color, radius and font size for the whole app in one place.</li>
          <li>Force a control size (sm / md / lg) or disable a whole form at once.</li>
          <li>Switch the built-in copy of components (table filters, modal buttons…) between Thai and English.</li>
          <li>Decide where popups (Select / DatePicker / Dropdown) mount when they live inside a scrolling container.</li>
        </ul>,
      )}
      demos={[
        {
          title: tr("โทเคนธีม", "Theme token"),
          description: tr(
            <>
              ส่ง <code>theme.token</code> เพื่อทับค่าโทเคน — <code>colorPrimary</code> จะไล่เฉดชุด hover / active / bg /
              border ให้อัตโนมัติ
            </>,
            <>
              Pass <code>theme.token</code> to override design tokens. <code>colorPrimary</code> derives the whole
              hover / active / bg / border ramp automatically.
            </>,
          ),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("ขนาดคอนโทรล", "Component size"),
          description: tr(
            <>
              <code>componentSize</code> เป็นค่าเริ่มต้นของทุกคอนโทรลใต้ provider — คอมโพเนนต์ที่ระบุ <code>size</code>{" "}
              เองยังชนะเสมอ
            </>,
            <>
              <code>componentSize</code> becomes the default for every control below the provider; an explicit{" "}
              <code>size</code> on a component still wins.
            </>,
          ),
          code: componentSizeCode,
          component: <ComponentSize />,
        },
        {
          title: tr("โหมดกระชับ", "Compact algorithm"),
          description: tr(
            <>
              <code>compactAlgorithm</code> ลดความสูงคอนโทรลและขนาดฟอนต์ เหมาะกับหน้าจอที่อัดข้อมูลหนาแน่น
            </>,
            <>
              <code>compactAlgorithm</code> shrinks control heights and font size — useful for dense, data-heavy
              screens.
            </>,
          ),
          code: compactCode,
          component: <Compact />,
        },
        {
          title: tr("โทเคนโหมดมืดเฉพาะส่วน", "Scoped dark tokens"),
          description: tr(
            <>
              ใส่ <code>darkAlgorithm</code> ให้เฉพาะบางส่วนของหน้า โดยไม่ต้องสลับธีมทั้งเว็บ
            </>,
            <>
              Apply <code>darkAlgorithm</code> to one subtree without switching the whole site theme.
            </>,
          ),
          code: darkAlgorithmCode,
          component: <DarkAlgorithm />,
        },
        {
          title: tr("ภาษา", "Locale"),
          description: tr(
            <>
              ส่ง <code>locale</code> (มี <code>thTH</code> และ <code>enUS</code> มาให้) แล้วอ่านผ่าน{" "}
              <code>useConfig()</code> ในคอมโพเนนต์ของคุณเองได้ด้วย
            </>,
            <>
              Pass <code>locale</code> (<code>thTH</code> and <code>enUS</code> ship with the library) and read it from
              your own components through <code>useConfig()</code>.
            </>,
          ),
          code: localeCode,
          component: <Locale />,
        },
        {
          title: tr("ปิดการใช้งานทั้งกลุ่ม", "Disable a subtree"),
          description: tr(
            <>
              <code>componentDisabled</code> คู่กับ hook <code>useComponentDisabled()</code> ใช้ปิดฟอร์มทั้งชุดตอนกำลัง
              submit
            </>,
            <>
              <code>componentDisabled</code> together with the <code>useComponentDisabled()</code> hook disables a whole
              form while it is submitting.
            </>,
          ),
          code: disabledCode,
          component: <Disabled />,
        },
      ]}
      api={[
        {
          title: "ConfigProvider",
          rows: [
            {
              property: "theme",
              description: tr(
                "โทเคน อัลกอริทึม และค่าเฉพาะคอมโพเนนต์",
                "Design tokens, algorithms and per-component overrides",
              ),
              type: "{ token?: ThemeToken; algorithm?: ThemeAlgorithm | ThemeAlgorithm[]; components?: Record<string, ThemeToken>; inherit?: boolean }",
              default: "-",
            },
            {
              property: "componentSize",
              description: tr("ขนาดเริ่มต้นของคอนโทรลทั้งหมด", "Default size for all controls"),
              type: "sm | md | lg",
              default: "md",
            },
            {
              property: "componentDisabled",
              description: tr("ปิดการใช้งานคอนโทรลทั้งหมดใต้ provider", "Disable every control below the provider"),
              type: "boolean",
              default: "false",
            },
            {
              property: "direction",
              description: tr("ทิศทางการอ่าน", "Text direction"),
              type: "ltr | rtl",
              default: "ltr",
            },
            {
              property: "locale",
              description: tr("ชุดข้อความในตัวคอมโพเนนต์", "Built-in component copy"),
              type: "KkLocale",
              default: "enUS",
            },
            {
              property: "getPopupContainer",
              description: tr("จุดแขวน popup ของ Select / DatePicker / Dropdown", "Mount node for popups"),
              type: "(triggerNode?: HTMLElement) => HTMLElement",
              default: "-",
            },
            {
              property: "getTargetContainer",
              description: tr("คอนเทนเนอร์ที่ Affix / Anchor ใช้ฟัง scroll", "Scroll container for Affix / Anchor"),
              type: "() => HTMLElement",
              default: "window",
            },
            {
              property: "renderEmpty",
              description: tr("สถานะว่างเปล่าแบบกำหนดเอง", "Custom empty state"),
              type: "(componentName?: string) => ReactNode",
              default: "-",
            },
            {
              property: "space",
              description: tr("ระยะห่างเริ่มต้นของ Space", "Default Space size"),
              type: "{ size: sm | md | lg | number }",
              default: "{ size: 'md' }",
            },
            {
              property: "form",
              description: tr("ค่าเริ่มต้นของฟอร์ม", "Form defaults"),
              type: "{ requiredMark?: boolean | 'optional'; colon?: boolean }",
              default: "-",
            },
            {
              property: "wave",
              description: tr("ปิดเอฟเฟกต์ระลอกตอนคลิก", "Turn off the click ripple"),
              type: "{ disabled: boolean }",
              default: "{ disabled: false }",
            },
            {
              property: "applyToRoot",
              description: tr(
                "เขียนโทเคนลง :root (ค่าเริ่มต้นสำหรับ provider ชั้นนอกสุด) เพื่อให้ popup ที่ portal ออกไปได้ธีมด้วย",
                "Write tokens onto :root (default for the outermost provider) so portalled popups inherit them",
              ),
              type: "boolean",
              default: "true (outermost)",
            },
          ],
        },
        {
          title: "ThemeToken",
          rows: [
            { property: "colorPrimary", description: tr("สีหลัก — ไล่เฉดที่เหลือให้อัตโนมัติ", "Primary color — the rest of the ramp is derived"), type: "string", default: "#1677ff" },
            { property: "colorSuccess / colorWarning / colorError / colorInfo", description: tr("สีสถานะ", "Status colors"), type: "string", default: "-" },
            { property: "colorText / colorTextSecondary / colorTextTertiary / colorTextQuaternary", description: tr("ลำดับสีตัวอักษร", "Text color scale"), type: "string", default: "-" },
            { property: "colorBorder / colorBorderSecondary", description: tr("สีเส้นขอบ", "Border colors"), type: "string", default: "-" },
            { property: "colorBgContainer / colorBgElevated / colorBgLayout / colorBgMask", description: tr("สีพื้นหลัง", "Background colors"), type: "string", default: "-" },
            { property: "borderRadius / borderRadiusSM / borderRadiusLG", description: tr("ความมนของมุม (px)", "Corner radius (px)"), type: "number", default: "6 / 4 / 8" },
            { property: "fontSize / fontSizeSM / fontSizeLG", description: tr("ขนาดฟอนต์ (px)", "Font size (px)"), type: "number", default: "14 / 12 / 16" },
            { property: "fontFamily / fontFamilyCode", description: tr("ฟอนต์", "Font stacks"), type: "string", default: "-" },
            { property: "controlHeight / controlHeightSM / controlHeightLG", description: tr("ความสูงคอนโทรล (px)", "Control height (px)"), type: "number", default: "32 / 24 / 40" },
            { property: "lineWidth / lineHeight", description: tr("ความหนาเส้นและ line-height", "Line width and line height"), type: "number", default: "1 / 1.5714" },
            { property: "motionDurationFast / Mid / Slow", description: tr("ความเร็วแอนิเมชัน", "Motion durations"), type: "string", default: "0.1s / 0.2s / 0.3s" },
            { property: "wireframe", description: tr("โหมดไร้เงา", "Flat, shadowless mode"), type: "boolean", default: "false" },
          ],
        },
        {
          title: "Algorithms & hooks",
          rows: [
            { property: "defaultAlgorithm", description: tr("ค่ามาตรฐาน", "Baseline tokens"), type: "ThemeAlgorithm", default: "-" },
            { property: "darkAlgorithm", description: tr("ชุดโทเคนโหมดมืด", "Dark token set"), type: "ThemeAlgorithm", default: "-" },
            { property: "compactAlgorithm", description: tr("ชุดโทเคนแบบกระชับ", "Compact token set"), type: "ThemeAlgorithm", default: "-" },
            { property: "useConfig()", description: tr("อ่านค่าคอนฟิกที่มีผลอยู่", "Read the effective config"), type: "() => ConfigConsumerProps", default: "-" },
            { property: "useComponentSize(size?)", description: tr("รวมขนาดของคอมโพเนนต์กับค่าเริ่มต้น", "Merge a component size with the provider default"), type: "(size?: ComponentSize) => ComponentSize", default: "-" },
            { property: "useComponentDisabled(disabled?)", description: tr("รวมสถานะปิดใช้งาน", "Merge a disabled flag with the provider default"), type: "(disabled?: boolean) => boolean", default: "-" },
            { property: "useLocale(component)", description: tr("อ่านข้อความของคอมโพเนนต์นั้น", "Read the copy for one component"), type: "(key: keyof KkLocale) => KkLocale[key]", default: "-" },
            { property: "theme.useToken()", description: tr("อ่านโทเคนที่มีผลอยู่", "Read the tokens in effect"), type: "() => { token: ThemeToken }", default: "-" },
            { property: "tokensToCssVars(token)", description: tr("แปลงโทเคนเป็น CSS variables", "Convert tokens to CSS custom properties"), type: "(token: ThemeToken) => Record<string, string>", default: "-" },
          ],
        },
      ]}
      related={[
        { title: "Theme", path: "/docs/theme" },
        { title: "Form", path: "/components/form" },
      ]}
    />
  );
}
