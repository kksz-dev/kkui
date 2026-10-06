import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import CustomSvg from "./demos/custom-svg";
import customSvgCode from "./demos/custom-svg.tsx?raw";
import OnDemand from "./demos/on-demand";
import onDemandCode from "./demos/on-demand.tsx?raw";
import Iconfont from "./demos/iconfont";
import iconfontCode from "./demos/iconfont.tsx?raw";
import TwoTone from "./demos/two-tone";
import twoToneCode from "./demos/two-tone.tsx?raw";
import IconList from "./demos/icon-list";
import iconListCode from "./demos/icon-list.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="icon"
      imports={[
        "Icon",
        "createFromIconfontCN",
        "setTwoToneColor",
        "getTwoToneColor",
        "twoToneIconNames",
        "fetchIconSvg",
        "getCachedIconSvg",
        "type IconProps",
        "type TwoToneIconName",
        "type CustomIconOptions",
      ]}
      whenToUse={tr(
        <>
          <p>
            KKUI ใช้{" "}
            <a href="https://lucide.dev" target="_blank" rel="noreferrer" className="text-primary hover:underline">
              Lucide Icons
            </a>{" "}
            เป็นชุดไอคอนมาตรฐาน และมี <code>Icon</code> เป็นตัวห่อสำหรับจัดขนาด หมุน พลิก และลงสี
          </p>
          <ul>
            <li>ส่งไอคอนที่ import มาแล้วเป็น children หรือ <code>icon</code> — ทำงานออฟไลน์ 100%</li>
            <li><code>name</code> ดึงไอคอนจาก Iconify ทีละดวงตอนใช้งานจริง จึงไม่ต้องรวมชุดไอคอนทั้งชุดเข้าบันเดิล</li>
            <li><code>twoTone</code> คือไอคอนสองโทนที่ฝังมาในตัว ปรับสีได้ทั้งรายดวงและทั้งแอป</li>
            <li><code>createFromIconfontCN</code> ต่อกับ sprite ของ iconfont.cn</li>
          </ul>
        </>,
        <>
          <p>
            KKUI uses{" "}
            <a href="https://lucide.dev" target="_blank" rel="noreferrer" className="text-primary hover:underline">
              Lucide Icons
            </a>{" "}
            as the standard icon set, with <code>Icon</code> as the wrapper handling size, rotation, flip and color.
          </p>
          <ul>
            <li>Pass an imported icon as children or via <code>icon</code> — fully offline.</li>
            <li><code>name</code> fetches one icon from Iconify on demand, so no icon set is bundled.</li>
            <li><code>twoTone</code> renders a built-in two-tone glyph, recolorable per icon or app-wide.</li>
            <li><code>createFromIconfontCN</code> wires up an iconfont.cn sprite.</li>
          </ul>
        </>,
      )}
      demos={[
        {
          title: tr("รายการไอคอนและชื่อเทียบ", "Icon Library & Mapping"),
          description: tr(
            <>รายการไอคอน Lucide ยอดนิยม พร้อมชื่อแบบคลาสสิก คลิกการ์ดเพื่อคัดลอกบรรทัด import</>,
            <>Popular Lucide icons mapped to classic icon names. Click a card to copy its import statement.</>,
          ),
          code: iconListCode,
          component: <IconList />,
          full: true,
        },
        {
          title: tr("พื้นฐาน", "Basic Usage"),
          description: tr(
            <><code>spin</code> หมุนต่อเนื่อง, <code>rotate</code> กำหนดองศา, <code>size</code> กำหนดขนาด, <code>color</code> กำหนดสี</>,
            <><code>spin</code> rotates continuously, <code>rotate</code> sets degrees, <code>size</code> sets dimensions, <code>color</code> sets the color.</>,
          ),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("SVG ของคุณเอง", "Custom SVG Icon"),
          description: tr(
            <>ส่งคอมโพเนนต์ SVG ของคุณเองผ่าน <code>component</code> หรือส่งเส้น path ผ่าน <code>path</code></>,
            <>Render your own SVG component through <code>component</code>, or a raw outline through <code>path</code>.</>,
          ),
          code: customSvgCode,
          component: <CustomSvg />,
        },
        {
          title: tr("โหลดทีละดวงจาก Iconify", "On-demand Iconify"),
          description: tr(
            <>
              <code>name</code> ดึงเฉพาะไอคอนที่ใช้จริง แล้วแคชไว้ทั้งในหน่วยความจำและ <code>localStorage</code>{" "}
              ระหว่างรอจะกันพื้นที่ไว้ตามขนาดจริง และถ้าออฟไลน์จะถอยไปใช้ไอคอนที่ส่งเข้ามาเป็น children
            </>,
            <>
              <code>name</code> fetches only the icons you actually use and caches them in memory and{" "}
              <code>localStorage</code>. The placeholder reserves the final size, and an offline lookup falls back
              to the icon passed as children.
            </>,
          ),
          code: onDemandCode,
          component: <OnDemand />,
        },
        {
          title: tr("Iconfont CN", "Iconfont CN"),
          description: tr(
            <>โหลด sprite จากโปรเจกต์ iconfont.cn ด้วย <code>createFromIconfontCN</code> แล้วอ้างถึงด้วยชื่อ symbol</>,
            <>Load a sprite from an iconfont.cn project with <code>createFromIconfontCN</code> and reference each symbol by id.</>,
          ),
          code: iconfontCode,
          component: <Iconfont />,
        },
        {
          title: tr("สองโทน", "Two Tone"),
          description: tr(
            <>
              <code>twoTone</code> เลือกไอคอนสองโทนที่ฝังมาในตัว <code>twoToneColor</code> กำหนดสีหลัก
              หรือคู่ <code>[หลัก, รอง]</code> ส่วน <code>setTwoToneColor()</code> เปลี่ยนค่าเริ่มต้นทั้งแอป
            </>,
            <>
              <code>twoTone</code> picks a built-in two-tone glyph, <code>twoToneColor</code> sets the primary color or a{" "}
              <code>[primary, secondary]</code> pair, and <code>setTwoToneColor()</code> changes the app-wide default.
            </>,
          ),
          code: twoToneCode,
          component: <TwoTone />,
        },
      ]}
      api={[
        {
          title: "Icon",
          description: tr(
            "ขยายจาก React.ComponentProps<\"span\"> (ยกเว้น `color`) รองรับ `ref` ไปยัง span หลัก",
            "Extends React.ComponentProps<\"span\"> (except `color`); `ref` reaches the root span.",
          ),
          rows: [
            { property: "name", description: tr("รหัสไอคอน Iconify เช่น \"solar:shield-check-bold\" ถ้าไม่มี prefix จะถือว่าเป็น lucide", "Iconify id, e.g. \"solar:shield-check-bold\"; without a prefix it is treated as lucide"), type: "string", default: "-" },
            { property: "twoTone", description: tr("ไอคอนสองโทนที่ฝังมาในตัว (ไม่ต้องต่อเน็ต) มี 11 ชื่อ ดูรายการจาก `twoToneIconNames`", "Built-in two-tone glyph, rendered offline; 11 names, listed by `twoToneIconNames`"), type: "TwoToneIconName", default: "-" },
            { property: "twoToneColor", description: tr("สีของไอคอนสองโทน: สีหลัก หรือคู่ [หลัก, รอง]", "Two-tone colors: a primary color or a [primary, secondary] pair"), type: "string | [string, string]", default: "setTwoToneColor()" },
            { property: "icon", description: tr("ไอคอนแบบ element และเป็นตัวสำรองของ `name`", "Icon element, also the fallback for `name`"), type: "ReactNode", default: "-" },
            { property: "children", description: tr("เนื้อหาไอคอน (element จาก lucide หรือ SVG ดิบ) และเป็นตัวสำรองของ `name`", "Icon content (a lucide element or raw SVG), also the fallback for `name`"), type: "ReactNode", default: "-" },
            { property: "component", description: tr("คอมโพเนนต์ SVG ที่จะเรนเดอร์", "Custom SVG component to render"), type: "ComponentType<SVGProps>", default: "-" },
            { property: "path", description: tr("ค่า `d` ของ path สำหรับวาด SVG ตรงๆ", "Raw SVG path `d` string"), type: "string", default: "-" },
            { property: "viewBox", description: tr("viewBox ที่ใช้คู่กับ `path`", "viewBox used together with `path`"), type: "string", default: "0 0 24 24" },
            { property: "spin", description: tr("หมุนต่อเนื่อง", "Rotate continuously"), type: "boolean", default: "false" },
            { property: "rotate", description: tr("หมุนกี่องศา", "Rotation in degrees"), type: "number", default: "-" },
            { property: "flip", description: tr("พลิกแนวนอน/แนวตั้ง", "Flip horizontally / vertically"), type: "horizontal | vertical | both", default: "-" },
            { property: "size", description: tr("ขนาดไอคอน (ตัวเลข = px)", "Icon size (a number means px)"), type: "number | string", default: "1em" },
            { property: "color", description: tr("สีไอคอน (กำหนด currentColor)", "Icon color (sets currentColor)"), type: "string", default: "-" },
            { property: "className", description: tr("คลาสของ element หลัก", "Class name of the root element"), type: "string", default: "-" },
            { property: "style", description: tr("สไตล์ของ element หลัก", "Style of the root element"), type: "CSSProperties", default: "-" },
          ],
        },
        {
          title: "createFromIconfontCN",
          description: tr(
            "คืนคอมโพเนนต์ไอคอนที่ผูกกับ sprite ของ iconfont.cn รับพร็อพของ Icon ได้ทั้งหมด บวก `type`",
            "Returns an icon component bound to an iconfont.cn sprite. Accepts every Icon prop plus `type`.",
          ),
          rows: [
            { property: "scriptUrl", description: tr("URL ของสคริปต์ sprite ที่สร้างจาก iconfont.cn (ใส่หลายอันได้)", "URL(s) of the sprite script generated on iconfont.cn"), type: "string | string[]", default: "-" },
            { property: "extraCommonProps", description: tr("พร็อพที่ใส่ให้ทุกไอคอนที่สร้างจากตัวนี้", "Props applied to every icon produced"), type: "Partial<IconProps>", default: "-" },
            { property: "type", description: tr("ชื่อ symbol ใน sprite (ไม่ต้องมี #) — พร็อพของคอมโพเนนต์ที่ได้", "Symbol id in the sprite (no leading #) — prop of the returned component"), type: "string", default: "-" },
          ],
        },
        {
          title: "Helpers",
          rows: [
            { property: "setTwoToneColor(color)", description: tr("ตั้งสีสองโทนเริ่มต้นของทั้งแอป ไอคอนที่แสดงอยู่จะอัปเดตทันที", "Set the app-wide default two-tone color; mounted icons update immediately"), type: "(color: string | [string, string]) => void", default: "-" },
            { property: "getTwoToneColor()", description: tr("อ่านสีสองโทนเริ่มต้นปัจจุบัน", "Read the current default two-tone color"), type: "() => string | [string, string]", default: "var(--color-primary)" },
            { property: "twoToneIconNames", description: tr("รายชื่อไอคอนสองโทนที่มีให้ใช้", "Names of every built-in two-tone glyph"), type: "TwoToneIconName[]", default: "-" },
            { property: "fetchIconSvg(name, signal?)", description: tr("ดึง SVG จาก Iconify พร้อมแคชและยกเลิกได้ (ใช้ล่วงหน้าเพื่อพรีโหลดได้)", "Fetch an SVG from Iconify with caching and abort support; useful for preloading"), type: "(name: string, signal?: AbortSignal) => Promise<string>", default: "-" },
            { property: "getCachedIconSvg(name)", description: tr("อ่านไอคอนที่แคชไว้แบบ synchronous (หน่วยความจำ แล้วค่อย localStorage)", "Read an already-cached icon synchronously (memory, then localStorage)"), type: "(name: string) => string | null", default: "-" },
          ],
        },
      ]}
      extra={tr(
        <>
          <h2>การโหลดไอคอนจาก Iconify ทำงานอย่างไร</h2>
          <p>
            <code>name</code> ตั้งใจให้โหลดทีละดวงตอนใช้จริง บันเดิลจึงไม่บวมตามจำนวนชุดไอคอน ลำดับการทำงานคือ
            แคชในหน่วยความจำ → <code>localStorage</code> (คีย์ <code>kkui-icon:*</code>) → เรียก{" "}
            <code>api.iconify.design</code> ครั้งเดียวต่อไอคอน คำขอที่ยังไม่เสร็จจะถูก <code>AbortController</code> ยกเลิกเมื่อคอมโพเนนต์ถูกถอด
          </p>
          <p>
            ระหว่างรอ จะมีกล่อง shimmer ขนาดเท่าไอคอนจริงกันไม่ให้เลย์เอาต์กระตุก ถ้าโหลดไม่สำเร็จ (ออฟไลน์ ถูกบล็อก หรือชื่อผิด)
            จะใช้ไอคอนที่ส่งมาเป็น children/<code>icon</code>/<code>component</code>/<code>path</code> แทน และถ้าไม่ได้ส่งอะไรมาเลย
            จะเหลือกรอบเส้นประขนาดเท่าเดิมไว้ ดังนั้นหน้าจอที่ต้องใช้งานออฟไลน์ให้ส่งไอคอนที่ import มาแล้วเสมอ
          </p>
        </>,
        <>
          <h2>How the Iconify lookup behaves</h2>
          <p>
            <code>name</code> loads one icon at a time on purpose, so the bundle never grows with the icon set. The
            order is: in-memory cache → <code>localStorage</code> (keys <code>kkui-icon:*</code>) → a single request to{" "}
            <code>api.iconify.design</code> per icon. In-flight requests are cancelled by an{" "}
            <code>AbortController</code> when the component unmounts.
          </p>
          <p>
            While loading, a shimmer box of the final size keeps the layout stable. If the lookup fails (offline,
            blocked, or an unknown name), the icon passed as children / <code>icon</code> / <code>component</code> /{" "}
            <code>path</code> is used instead; with nothing to fall back on, a dashed box of the same size remains. For
            screens that must work offline, always pass an imported icon.
          </p>
        </>,
      )}
      related={[
        { title: tr("คลังไอคอน Iconify", "Iconify Browser"), path: "/icons" },
        { title: "Button", path: "/components/button" },
        { title: "Typography", path: "/components/typography" },
      ]}
    />
  );
}
