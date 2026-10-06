import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Icon from "./demos/icon";
import iconCode from "./demos/icon.tsx?raw";
import Status from "./demos/status";
import statusCode from "./demos/status.tsx?raw";
import Type from "./demos/type";
import typeCode from "./demos/type.tsx?raw";
import Size from "./demos/size";
import sizeCode from "./demos/size.tsx?raw";
import Color from "./demos/color";
import colorCode from "./demos/color.tsx?raw";
import Download from "./demos/download";
import downloadCode from "./demos/download.tsx?raw";
import ErrorLevel from "./demos/error-level";
import errorLevelCode from "./demos/error-level.tsx?raw";
import Popover from "./demos/popover";
import popoverCode from "./demos/popover.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="qr-code"
      imports={["QRCode"]}
      whenToUse={tr(
        <>
          <p>ใช้เมื่อต้องสร้างและแสดง QR Code แบบ 2 มิติสำหรับสแกนด้วยอุปกรณ์พกพาหรือแชร์ URL อย่างรวดเร็ว</p>
          <ul>
            <li>ใช้แสดงลิงก์, authentication token, ข้อมูลชำระเงิน หรือ URL สำหรับดาวน์โหลดบนมือถือ</li>
            <li>ฝังโลโก้ไว้กลาง QR Code พร้อมเว้นพื้นหลังให้อัตโนมัติ</li>
            <li>สื่อสถานะหมดอายุ สแกนแล้ว หรือกำลังโหลดผ่าน prop <code>status</code></li>
          </ul>
        </>,
        <>
          <p>When you need to generate and display a scannable 2D QR barcode for mobile devices or fast URL sharing.</p>
          <ul>
            <li>To present links, authentication tokens, payment details, or mobile download URLs.</li>
            <li>Embed a custom logo icon in the center of the QR code with automatic background excavation.</li>
            <li>Communicate expired, scanned, or loading states via the <code>status</code> property.</li>
          </ul>
        </>,
      )}
      demos={[
        { title: tr("พื้นฐาน", "Basic"), description: tr("สร้าง QR Code แบบง่ายจากค่าข้อความ", "The simplest QR Code generated from a text value."), code: basicCode, component: <Basic /> },
        { title: tr("ใส่ไอคอน", "With Icon"), description: tr("ฝังไอคอนแบรนด์หรือโลโก้ไว้ตรงกลาง", "Embed a brand icon or logo in the center."), code: iconCode, component: <Icon /> },
        { title: tr("สถานะ", "Status"), description: tr(<>มี 4 สถานะ: <code>active</code>, <code>expired</code>, <code>loading</code> และ <code>scanned</code></>, <>Four states: <code>active</code>, <code>expired</code>, <code>loading</code>, and <code>scanned</code>.</>), code: statusCode, component: <Status /> },
        { title: tr("ประเภทการเรนเดอร์", "Render Type"), description: tr(<>สลับโหมดเรนเดอร์ระหว่าง <code>canvas</code> และ <code>svg</code></>, <>Switch between <code>canvas</code> and <code>svg</code> render modes.</>), code: typeCode, component: <Type /> },
        { title: tr("กำหนดขนาด", "Custom Size"), description: tr("ปรับขนาด QR Code แบบ dynamic", "Adjust the size of the QR Code dynamically."), code: sizeCode, component: <Size /> },
        { title: tr("กำหนดสี", "Custom Color"), description: tr("ปรับสีพื้นหน้าและพื้นหลัง", "Customize foreground and background colors."), code: colorCode, component: <Color /> },
        { title: tr("ดาวน์โหลด", "Download"), description: tr("Export และดาวน์โหลด QR Code เป็นรูปภาพ", "Export and download the generated QR Code as an image."), code: downloadCode, component: <Download /> },
        { title: tr("ระดับการแก้ไขข้อผิดพลาด", "Error Level"), description: tr("กำหนดระดับการแก้ไขข้อผิดพลาดได้ (L, M, Q, H)", "Configurable error correction levels (L, M, Q, H)."), code: errorLevelCode, component: <ErrorLevel /> },
        { title: tr("แสดงใน Popover", "Popover Trigger"), description: tr("แสดง QR Code ใน popover เมื่อ hover", "Trigger a QR code on hover inside a popover."), code: popoverCode, component: <Popover /> },
      ]}
      api={[
        {
          title: "QRCode",
          rows: [
            { property: "value", description: "The value to encode in the QR code", type: "string", default: "-" },
            { property: "type", description: "Render type", type: "'canvas' | 'svg'", default: "'canvas'" },
            { property: "size", description: "Size of the QR code in pixels", type: "number", default: "160" },
            { property: "icon", description: "URL of the centered icon logo", type: "string", default: "-" },
            { property: "iconSize", description: "Size of the icon logo in pixels or { width, height }", type: "number | { width: number; height: number }", default: "40" },
            { property: "color", description: "Foreground color", type: "string", default: "'#000000'" },
            { property: "bgColor", description: "Background color", type: "string", default: "'transparent'" },
            { property: "bordered", description: "Whether to wrap in bordered card with padding", type: "boolean", default: "true" },
            { property: "errorLevel", description: "Error correction level", type: "'L' | 'M' | 'Q' | 'H'", default: "'M'" },
            { property: "status", description: "Current status overlay", type: "'active' | 'expired' | 'loading' | 'scanned'", default: "'active'" },
            { property: "onRefresh", description: "Callback triggered when clicking refresh button", type: "() => void", default: "-" },
            { property: "statusRender", description: "Custom overlay renderer function", type: "(info: { status, onRefresh }) => ReactNode", default: "-" },
            { property: "className", description: "Extra classes on container", type: "string", default: "-" },
          ],
        },
      ]}
      related={[{ title: "Card", path: "/components/card" }, { title: "Watermark", path: "/components/watermark" }]}
    />
  );
}
