import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Closable from "./demos/closable";
import closableCode from "./demos/closable.tsx?raw";
import Description from "./demos/description";
import descriptionCode from "./demos/description.tsx?raw";
import Icon from "./demos/icon";
import iconCode from "./demos/icon.tsx?raw";
import CloseText from "./demos/close-text";
import closeTextCode from "./demos/close-text.tsx?raw";
import Action from "./demos/action";
import actionCode from "./demos/action.tsx?raw";
import Banner from "./demos/banner";
import bannerCode from "./demos/banner.tsx?raw";
import LoopBanner from "./demos/loop-banner";
import loopBannerCode from "./demos/loop-banner.tsx?raw";
import ErrorBoundary from "./demos/error-boundary";
import errorBoundaryCode from "./demos/error-boundary.tsx?raw";
import SmoothClosed from "./demos/smooth-closed";
import smoothClosedCode from "./demos/smooth-closed.tsx?raw";
import CustomIcon from "./demos/custom-icon";
import customIconCode from "./demos/custom-icon.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="alert"
      imports={["Alert", "AlertErrorBoundary"]}
      whenToUse={tr(
        <>
          <p>ใช้ Alert เมื่อต้องแสดงข้อความที่ค้างอยู่บนหน้า โดยไม่ขัดจังหวะสิ่งที่ผู้ใช้กำลังทำ</p>
          <ul>
            <li>เป็นองค์ประกอบคงที่ เรนเดอร์อยู่ใน layout ไม่ลอยและไม่ปิดตัวเอง</li>
            <li>เลือก <code>success</code>, <code>info</code>, <code>warning</code> หรือ <code>error</code> เพื่อสื่อระดับความรุนแรงผ่านสีและไอคอน</li>
            <li>ใส่ <code>closable</code> เมื่อผู้ใช้ควรปิดเองได้ หรือ <code>banner</code> เมื่อต้องการให้พาดเต็มด้านบนของหน้า</li>
          </ul>
        </>,
        <>
          <p>Use an Alert when you need to show a message that stays on the page and does not interrupt what the user is doing.</p>
          <ul>
            <li>It is static: it renders inline in the layout and never floats or auto-dismisses.</li>
            <li>Pick <code>success</code>, <code>info</code>, <code>warning</code> or <code>error</code> to communicate severity through color and icon.</li>
            <li>Make it <code>closable</code> when the user should be able to dismiss it, or <code>banner</code> when it spans the top of a page.</li>
          </ul>
        </>,
      )}
      demos={[
        { title: tr("พื้นฐาน", "Basic"), description: tr(<>การใช้งานอย่างง่ายสำหรับข้อความสั้นๆ มีให้เลือก 4 <code>type</code></>, <>The simplest usage for short messages. Four <code>type</code>s are available.</>), code: basicCode, component: <Basic /> },
        { title: tr("ปิดได้", "Closable"), description: tr(<>ใส่ <code>closable</code> เพื่อแสดงปุ่มปิด <code>onClose</code> ทำงานตอนคลิก ส่วน <code>afterClose</code> ทำงานหลังแอนิเมชันยุบจบ</>, <>Add <code>closable</code> to show a close button. <code>onClose</code> fires on click, <code>afterClose</code> after the collapse animation.</>), code: closableCode, component: <Closable /> },
        { title: tr("คำอธิบายเพิ่มเติม", "Description"), description: tr(<>ใส่ <code>description</code> เพื่อให้ alert ใหญ่ขึ้นและบอกรายละเอียดได้มากขึ้น</>, <>Additional <code>description</code> for a bigger, more detailed alert.</>), code: descriptionCode, component: <Description /> },
        { title: tr("ไอคอน", "Icon"), description: tr(<>ไอคอนที่ตรงกับเนื้อหาช่วยให้เข้าใจเร็วขึ้น เปิดด้วย <code>showIcon</code></>, <>A relevant icon makes information clearer. Set <code>showIcon</code>.</>), code: iconCode, component: <Icon /> },
        { title: tr("ปุ่มปิดแบบกำหนดเอง", "Custom Close Text"), description: tr(<>เปลี่ยนไอคอนปิดเริ่มต้นผ่าน <code>closable.closeIcon</code></>, <>Replace the default close icon through <code>closable.closeIcon</code>.</>), code: closeTextCode, component: <CloseText /> },
        { title: tr("ปุ่มการกระทำ", "Custom Action"), description: tr(<>วางปุ่มหรือลิงก์ไว้ด้านขวาด้วย <code>action</code></>, <>Render buttons or links on the right with <code>action</code>.</>), code: actionCode, component: <Action /> },
        { title: tr("แบนเนอร์", "Banner"), description: tr(<><code>banner</code> ตัดเส้นขอบและมุมโค้งออก และใช้ type warning พร้อมไอคอนเป็นค่าเริ่มต้น</>, <><code>banner</code> removes border and radius and defaults to the warning type with an icon.</>), code: bannerCode, component: <Banner /> },
        { title: tr("แบนเนอร์ข้อความวิ่ง", "Loop Banner"), description: tr(<>ข้อความเลื่อนวนอยู่ในแบนเนอร์ ใช้ React node อะไรเป็นข้อความก็ได้</>, <>A scrolling message inside a banner. Any React node can be the message.</>), code: loopBannerCode, component: <LoopBanner /> },
        { title: tr("ErrorBoundary", "ErrorBoundary"), description: tr(<><code>AlertErrorBoundary</code> ดัก error ตอนเรนเดอร์ใน subtree ของตัวเอง แล้วแสดงเป็น alert แบบ error</>, <><code>AlertErrorBoundary</code> catches render errors in its subtree and shows them as an error alert.</>), code: errorBoundaryCode, component: <ErrorBoundary /> },
        { title: tr("ยุบก่อน unmount", "Smoothly Unmount"), description: tr(<>alert จะยุบตัวก่อน unmount ใช้ <code>afterClose</code> เพื่อ sync state ฝั่งเรา</>, <>The alert collapses before unmounting; use <code>afterClose</code> to sync your own state.</>), code: smoothClosedCode, component: <SmoothClosed /> },
        { title: tr("ไอคอนแบบกำหนดเอง", "Custom Icon"), description: tr(<>ส่ง <code>icon</code> เพื่อแทนไอคอนเริ่มต้นของแต่ละ type</>, <>Pass <code>icon</code> to override the default icon per type.</>), code: customIconCode, component: <CustomIcon /> },
      ]}
      api={[
        {
          title: "Alert",
          rows: [
            { property: "type", description: "Type of Alert styles", type: "success | info | warning | error", default: "info (warning when banner)" },
            { property: "message", description: "Content of Alert", type: "ReactNode", default: "-" },
            { property: "description", description: "Additional content of Alert", type: "ReactNode", default: "-" },
            { property: "showIcon", description: "Whether to show icon", type: "boolean", default: "false (true when banner)" },
            { property: "icon", description: "Custom icon, effective when showIcon is true", type: "ReactNode", default: "-" },
            { property: "closable", description: "Whether Alert can be closed, or close config", type: "boolean | { closeIcon?: ReactNode; afterClose?: () => void; disabled?: boolean }", default: "false" },
            { property: "closeIcon", description: "Custom close icon (shorthand)", type: "ReactNode", default: "<X />" },
            { property: "onClose", description: "Callback when Alert is closed", type: "(e: MouseEvent) => void", default: "-" },
            { property: "afterClose", description: "Called after the close animation ends", type: "() => void", default: "-" },
            { property: "banner", description: "Whether to show as banner", type: "boolean", default: "false" },
            { property: "action", description: "The action of Alert", type: "ReactNode", default: "-" },
            { property: "className", description: "Extra classes on the root", type: "string", default: "-" },
          ],
        },
        {
          title: "AlertErrorBoundary",
          rows: [
            { property: "message", description: "Custom error message to show", type: "ReactNode", default: "{{ error }}" },
            { property: "description", description: "Custom error description to show", type: "ReactNode", default: "{{ error stack }}" },
          ],
        },
      ]}
      related={[{ title: "Result", path: "/components/result" }, { title: "Message", path: "/components/message" }]}
    />
  );
}
