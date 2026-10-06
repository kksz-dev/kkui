import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import MultiLine from "./demos/multi-line";
import multiLineCode from "./demos/multi-line.tsx?raw";
import ImageDemo from "./demos/image";
import imageCode from "./demos/image.tsx?raw";
import Custom from "./demos/custom";
import customCode from "./demos/custom.tsx?raw";
import ModalDemo from "./demos/modal";
import modalCode from "./demos/modal.tsx?raw";
import Inherit from "./demos/inherit";
import inheritCode from "./demos/inherit.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="watermark"
      imports={["Watermark", "useWatermark", "useWatermarkPanelRef", "type WatermarkProps"]}
      whenToUse={tr(
        <>
          <p>ใช้เมื่อต้องปกป้องลิขสิทธิ์ ทรัพย์สินทางปัญญา หรือเอกสารลับภายใน ด้วยลายน้ำที่ปูซ้ำเป็นพื้นหลัง</p>
          <ul>
            <li>ใส่ข้อความลิขสิทธิ์ รหัสพนักงาน หรือชั้นความลับลงบนหน้าจอ</li>
            <li>รองรับข้อความบรรทัดเดียว หลายบรรทัด (array) หรือรูปโลโก้</li>
            <li>มี <code>MutationObserver</code> คอยกู้ชั้นลายน้ำคืนอัตโนมัติ ถ้าถูกลบหรือแก้ผ่าน DevTools</li>
            <li><code>inherit</code> (ค่าเริ่มต้น) ทำให้ Modal / Drawer ที่อยู่ใน subtree นี้พิมพ์ลายน้ำเดียวกันบนแผงของตัวเอง</li>
          </ul>
        </>,
        <>
          <p>When you need to protect copyright, intellectual property, or confidential internal documents with a repeating background pattern.</p>
          <ul>
            <li>Add copyright text, employee identifiers, or classification banners to a page.</li>
            <li>Supports a single line, an array of lines, or an image logo.</li>
            <li>A built-in <code>MutationObserver</code> restores the watermark layer if it is removed or edited in DevTools.</li>
            <li><code>inherit</code> (on by default) makes Modal / Drawer inside the subtree paint the same watermark on their own panel.</li>
          </ul>
        </>,
      )}
      demos={[
        {
          title: tr("พื้นฐาน", "Basic"),
          description: tr(<>ลายน้ำข้อความบรรทัดเดียวผ่าน <code>content</code></>, <>A single line of watermark text via <code>content</code>.</>),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("หลายบรรทัด", "Multi-line"),
          description: tr(<>ส่ง array ของสตริงให้ <code>content</code> เพื่อได้ลายน้ำหลายบรรทัด</>, <>Pass an array of strings to <code>content</code> for a multi-line mark.</>),
          code: multiLineCode,
          component: <MultiLine />,
        },
        {
          title: tr("ลายน้ำรูปภาพ", "Image Watermark"),
          description: tr(<>ใช้ <code>image</code> คู่กับ <code>width</code>/<code>height</code> เพื่อปูโลโก้แทนข้อความ</>, <>Use <code>image</code> with <code>width</code>/<code>height</code> to tile a logo instead of text.</>),
          code: imageCode,
          component: <ImageDemo />,
        },
        {
          title: tr("ปรับแต่ง", "Custom Configuration"),
          description: tr(<>ปรับ <code>rotate</code>, <code>gap</code> และ <code>font</code> แบบโต้ตอบได้</>, <>Interactive controls for <code>rotate</code>, <code>gap</code> and <code>font</code>.</>),
          code: customCode,
          component: <Custom />,
          full: true,
        },
        {
          title: tr("ลายน้ำใน Modal", "Inside Modal"),
          description: tr(<>Modal เรนเดอร์ผ่าน portal แต่ยังได้ลายน้ำเดียวกัน เพราะ <code>inherit</code> เปิดอยู่</>, <>The Modal renders through a portal yet still gets the same watermark, because <code>inherit</code> is on.</>),
          code: modalCode,
          component: <ModalDemo />,
        },
        {
          title: tr("ส่งต่อให้ป็อปอัป", "Inherit"),
          description: tr(<>สลับ <code>inherit</code> เพื่อดูว่าแผง Drawer พิมพ์ลายน้ำตามหรือไม่ ป็อปอัปของคุณเองก็ทำได้ด้วย <code>useWatermarkPanelRef()</code></>, <>Toggle <code>inherit</code> to see whether the Drawer panel repaints the mark. Your own popups can opt in with <code>useWatermarkPanelRef()</code>.</>),
          code: inheritCode,
          component: <Inherit />,
        },
      ]}
      api={[
        {
          title: "Watermark",
          description: tr("ขยายจาก React.ComponentProps<\"div\"> (ยกเว้น `content`)", "Extends React.ComponentProps<\"div\"> (except `content`)."),
          rows: [
            { property: "content", description: tr("ข้อความลายน้ำ บรรทัดเดียวหรือหลายบรรทัด", "Watermark text, single or multi-line"), type: "string | string[]", default: "-" },
            { property: "image", description: tr("URL รูปลายน้ำ (ทับ content)", "Watermark image URL (overrides content)"), type: "string", default: "-" },
            { property: "width", description: tr("ความกว้างของหนึ่งลายน้ำ (px)", "Width of one mark in px"), type: "number", default: "auto" },
            { property: "height", description: tr("ความสูงของหนึ่งลายน้ำ (px)", "Height of one mark in px"), type: "number", default: "auto" },
            { property: "rotate", description: tr("องศาการหมุนลายน้ำ", "Rotation angle in degrees"), type: "number", default: "-22" },
            { property: "zIndex", description: tr("z-index ของชั้นลายน้ำ", "z-index of the watermark layer"), type: "number", default: "9" },
            { property: "gap", description: tr("ระยะห่างระหว่างลายน้ำ [x, y]", "Spacing between marks [x, y]"), type: "[number, number]", default: "[100, 100]" },
            { property: "offset", description: tr("ระยะเยื้องของลายน้ำแรกจากมุมซ้ายบน [x, y]", "Offset of the first mark from the top-left [x, y]"), type: "[number, number]", default: "[gap[0]/2, gap[1]/2]" },
            { property: "font", description: tr("การตั้งค่าตัวอักษรของลายน้ำข้อความ", "Typography of the text mark"), type: "WatermarkFont", default: "-" },
            { property: "inherit", description: tr("ให้ Modal / Drawer / ป็อปอัปใน subtree พิมพ์ลายน้ำเดียวกัน", "Let Modal / Drawer / popups in the subtree repaint the same watermark"), type: "boolean", default: "true" },
            { property: "className", description: tr("คลาสของ element หลัก", "Class name of the root element"), type: "string", default: "-" },
            { property: "rootClassName", description: tr("คลาสเพิ่มเติมของ element หลัก ใช้ร่วมกับ className", "Extra class on the root element, applied with className"), type: "string", default: "-" },
            { property: "style", description: tr("สไตล์ของ element หลัก", "Style of the root element"), type: "CSSProperties", default: "-" },
          ],
        },
        {
          title: "WatermarkFont",
          description: tr("การตั้งค่าตัวอักษรของลายน้ำ", "Typography settings of the watermark."),
          rows: [
            { property: "color", description: tr("สีตัวอักษร (ปรับตามธีมสว่าง/มืดอัตโนมัติ)", "Font color (follows light/dark theme by default)"), type: "string", default: "rgba(0,0,0,.15)" },
            { property: "fontSize", description: tr("ขนาดตัวอักษร (px)", "Font size in px"), type: "number | string", default: "16" },
            { property: "fontWeight", description: tr("น้ำหนักตัวอักษร", "Font weight"), type: "normal | light | weight | number | string", default: "normal" },
            { property: "fontFamily", description: tr("ชุดแบบอักษร", "Font family"), type: "string", default: "sans-serif" },
            { property: "fontStyle", description: tr("รูปแบบตัวอักษร", "Font style"), type: "none | normal | italic | oblique", default: "normal" },
            { property: "textAlign", description: tr("การจัดวางข้อความ", "Text alignment"), type: "start | end | left | right | center", default: "center" },
          ],
        },
        {
          title: "Hooks",
          description: tr("สำหรับต่อลายน้ำเข้ากับ surface ที่เรนเดอร์ผ่าน portal เอง", "For wiring the watermark into your own portalled surfaces."),
          rows: [
            { property: "useWatermark()", description: tr("คืนค่าลายน้ำที่ครอบ subtree นี้ ({ url, zIndex, offsetX, offsetY }) หรือ null", "Returns the watermark surrounding this subtree ({ url, zIndex, offsetX, offsetY }) or null"), type: "() => WatermarkLayer | null", default: "-" },
            { property: "useWatermarkPanelRef()", description: tr("ref callback ที่พิมพ์ลายน้ำลงบนแผงป็อปอัป — Modal และ Drawer ของ KKUI ใช้ตัวนี้อยู่แล้ว", "Ref callback that paints the watermark onto a popup panel — KKUI Modal and Drawer already use it"), type: "<T extends HTMLElement>() => RefCallback<T>", default: "-" },
          ],
        },
      ]}
      extra={tr(
        <>
          <h2>ลายน้ำกับ portal ทำงานอย่างไร</h2>
          <p>
            React context ส่งข้ามผ่าน portal ได้ ดังนั้น <code>Watermark</code> จึงส่งข้อมูลลายน้ำ (data URL ของ tile) ลงไปทาง context
            แล้ว Modal / Drawer อ่านผ่าน <code>useWatermarkPanelRef()</code> เพื่อวางชั้นลายน้ำบนแผงของตัวเอง
            ป็อปอัปที่คุณเขียนเองก็เรียก hook เดียวกันแล้วผูกกับ <code>ref</code> ของ element ได้ทันที
          </p>
        </>,
        <>
          <h2>How the portal case works</h2>
          <p>
            React context crosses portals, so <code>Watermark</code> publishes the generated tile through
            context and Modal / Drawer pick it up with <code>useWatermarkPanelRef()</code> to paint a layer on
            their own panel. Your own popup can call the same hook and attach it as the element <code>ref</code>.
          </p>
        </>,
      )}
      related={[{ title: "QRCode", path: "/components/qr-code" }, { title: "Card", path: "/components/card" }]}
    />
  );
}
