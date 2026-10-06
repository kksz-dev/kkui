import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import AsyncClose from "./demos/async-close";
import asyncCloseCode from "./demos/async-close.tsx?raw";
import CustomFooter from "./demos/custom-footer";
import customFooterCode from "./demos/custom-footer.tsx?raw";
import Statics from "./demos/statics";
import staticsCode from "./demos/statics.tsx?raw";
import Confirm from "./demos/confirm";
import confirmCode from "./demos/confirm.tsx?raw";
import UseModal from "./demos/use-modal";
import useModalCode from "./demos/use-modal.tsx?raw";
import Width from "./demos/width";
import widthCode from "./demos/width.tsx?raw";
import Position from "./demos/position";
import positionCode from "./demos/position.tsx?raw";
import DestroyAll from "./demos/destroy-all";
import destroyAllCode from "./demos/destroy-all.tsx?raw";
import Form from "./demos/form";
import formCode from "./demos/form.tsx?raw";
import Loading from "./demos/loading";
import loadingCode from "./demos/loading.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="modal"
      imports={["Modal", "useModal", "type ModalProps", "type ModalFuncProps"]}
      whenToUse={tr(
        <>
          <p>ใช้เมื่อต้องให้ผู้ใช้ทำอะไรบางอย่างให้จบก่อน โดยไม่พาออกจากหน้าปัจจุบัน</p>
          <ul>
            <li>ยืนยันการกระทำที่ย้อนกลับยาก (ลบ ปิดงาน ส่งข้อมูล) ใช้ <code>Modal.confirm</code></li>
            <li>ฟอร์มสั้นๆ หรือรายละเอียดที่ไม่คุ้มจะเปิดหน้าใหม่ ใช้ <code>&lt;Modal&gt;</code> แบบมีสถานะ</li>
            <li>เนื้อหายาวหรือมีหลายขั้นตอนให้ใช้ <code>Drawer</code> แทน ส่วนคำถามสั้นๆ ข้างปุ่มใช้ <code>Popconfirm</code></li>
            <li>ในคอมโพเนนต์แนะนำ <code>Modal.useModal()</code> เพื่อให้กล่องอยู่ในทรี React (theme/context ตรงกัน)</li>
          </ul>
        </>,
        <>
          <p>Use it when the user has to finish something before moving on, without leaving the page.</p>
          <ul>
            <li>Confirm an action that is hard to undo (delete, close, submit) with <code>Modal.confirm</code>.</li>
            <li>Short forms or details that do not deserve their own route: a stateful <code>&lt;Modal&gt;</code>.</li>
            <li>Long or multi-step content belongs in a <code>Drawer</code>; a one-line question next to a button belongs in a <code>Popconfirm</code>.</li>
            <li>Inside components prefer <code>Modal.useModal()</code> so the dialog stays in the React tree.</li>
          </ul>
        </>,
      )}
      demos={[
        {
          title: tr("การใช้งานพื้นฐาน", "Basic"),
          description: tr(
            <>ควบคุมด้วย <code>open</code> + <code>onCancel</code>; <code>afterClose</code> ทำงานหลังแอนิเมชันปิดจบ</>,
            <>Driven by <code>open</code> + <code>onCancel</code>; <code>afterClose</code> runs once the exit animation finished.</>,
          ),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("ปิดแบบอะซิงโครนัส", "Async close"),
          description: tr(
            <><code>confirmLoading</code> ทำให้ปุ่ม OK หมุนรอ และปิดปุ่ม Cancel ระหว่างนั้น</>,
            <><code>confirmLoading</code> spins the OK button and disables Cancel while the request is in flight.</>,
          ),
          code: asyncCloseCode,
          component: <AsyncClose />,
        },
        {
          title: tr("ส่วนท้ายกำหนดเอง", "Custom footer"),
          description: tr(
            <><code>footer</code> รับได้ทั้งโหนด ฟังก์ชัน (ได้ <code>OkBtn</code>/<code>CancelBtn</code> มาใช้) หรือ <code>null</code> เพื่อไม่แสดง</>,
            <><code>footer</code> takes a node, a render function (you get <code>OkBtn</code>/<code>CancelBtn</code>) or <code>null</code>.</>,
          ),
          code: customFooterCode,
          component: <CustomFooter />,
        },
        {
          title: tr("กล่องข้อความสำเร็จรูป", "Static dialogs"),
          description: tr(
            <><code>Modal.info / success / error / warning</code> แสดงเฉพาะปุ่ม OK ตามมาตรฐาน เปิด Cancel ได้ด้วย <code>okCancel</code></>,
            <><code>Modal.info / success / error / warning</code> show only OK, as they should; <code>okCancel</code> brings Cancel back.</>,
          ),
          code: staticsCode,
          component: <Statics />,
        },
        {
          title: tr("ยืนยันการทำงาน", "Confirm"),
          description: tr(
            <><code>Modal.confirm</code> รอ Promise จาก <code>onOk</code> ก่อนปิด และเลือกปุ่มที่โฟกัสได้ด้วย <code>autoFocusButton</code></>,
            <><code>Modal.confirm</code> waits for the <code>onOk</code> promise before closing; <code>autoFocusButton</code> picks the focused button.</>,
          ),
          code: confirmCode,
          component: <Confirm />,
        },
        {
          title: tr("ฮุก useModal", "useModal hook"),
          description: tr(
            <><code>const [modal, contextHolder] = Modal.useModal()</code> — คืน <code>destroy</code>/<code>update</code> ต่ออินสแตนซ์</>,
            <><code>const [modal, contextHolder] = Modal.useModal()</code> — each call returns <code>destroy</code>/<code>update</code>.</>,
          ),
          code: useModalCode,
          component: <UseModal />,
        },
        {
          title: tr("ความกว้าง", "Width"),
          description: tr(<>ตัวเลขคือพิกเซล ส่วนสตริงใช้ตามที่ส่งมา</>, <>Numbers are pixels, strings are used as given.</>),
          code: widthCode,
          component: <Width />,
        },
        {
          title: tr("ตำแหน่ง", "Position"),
          description: tr(
            <><code>centered</code> จัดกลางแนวตั้ง หรือปรับระยะเองผ่าน <code>wrapClassName</code></>,
            <><code>centered</code> centers vertically; <code>wrapClassName</code> tunes the offset yourself.</>,
          ),
          code: positionCode,
          component: <Position />,
        },
        {
          title: tr("ปิดทั้งหมด", "Destroy all"),
          description: tr(
            <><code>Modal.destroyAll()</code> ปิดทุกกล่องที่เปิดด้วย API แบบสถิต</>,
            <><code>Modal.destroyAll()</code> closes every dialog opened through the static API.</>,
          ),
          code: destroyAllCode,
          component: <DestroyAll />,
        },
        {
          title: tr("ฟอร์มในกล่อง", "Modal with form"),
          description: tr(
            <><code>destroyOnClose</code> ถอดเนื้อหาออกตอนปิด ค่าที่กรอกไว้จึงถูกล้าง (ไม่ใส่ = จำค่าเดิม)</>,
            <><code>destroyOnClose</code> unmounts the content on close so the fields reset; without it they keep their state.</>,
          ),
          code: formCode,
          component: <Form />,
        },
        {
          title: tr("กำลังโหลด", "Loading"),
          description: tr(
            <><code>loading</code> แสดงโครงร่างแทนเนื้อหา และ <code>modalRender</code> ห่อกล่องด้วยอิลิเมนต์ของเราเอง</>,
            <><code>loading</code> swaps the body for a skeleton and <code>modalRender</code> wraps the panel in your own element.</>,
          ),
          code: loadingCode,
          component: <Loading />,
        },
      ]}
      api={[
        {
          title: "Modal",
          rows: [
            { property: "open", description: tr("แสดงกล่องหรือไม่", "Whether the dialog is visible"), type: "boolean", default: "false" },
            { property: "title", description: tr("หัวข้อ (ผูกกับ aria-labelledby)", "Title, wired to aria-labelledby"), type: "ReactNode", default: "-" },
            { property: "footer", description: tr("ส่วนท้าย; null = ไม่มี, ฟังก์ชันจะได้ OkBtn/CancelBtn", "Footer; null removes it, a function receives OkBtn/CancelBtn"), type: "ReactNode | ((p: { OkBtn, CancelBtn }) => ReactNode)", default: "-" },
            { property: "onOk", description: tr("กดปุ่ม OK; คืน Promise เพื่อให้ปุ่มหมุนรอ", "OK handler; return a promise to keep the button spinning"), type: "(e) => void | Promise<unknown>", default: "-" },
            { property: "onCancel", description: tr("กด Cancel, ปุ่มปิด, มาสก์ หรือ Escape", "Cancel button, close icon, mask click or Escape"), type: "(e) => void", default: "-" },
            { property: "confirmLoading", description: tr("สถานะโหลดของปุ่ม OK", "Loading state of the OK button"), type: "boolean", default: "false" },
            { property: "okText / cancelText", description: tr("ข้อความบนปุ่ม", "Button labels"), type: "ReactNode", default: "OK / Cancel" },
            { property: "okType", description: tr("ชนิดปุ่ม OK", "Type of the OK button"), type: "ButtonProps[\"type\"]", default: "primary" },
            { property: "okButtonProps / cancelButtonProps", description: tr("พร็อพเพิ่มเติมของปุ่ม", "Extra props for the buttons"), type: "ButtonProps", default: "-" },
            { property: "centered", description: tr("จัดกลางแนวตั้ง", "Center vertically"), type: "boolean", default: "false" },
            { property: "width", description: tr("ความกว้างของกล่อง", "Width of the dialog"), type: "number | string", default: "520" },
            { property: "closable", description: tr("แสดงปุ่มปิด", "Show the close button"), type: "boolean", default: "true" },
            { property: "closeIcon", description: tr("ไอคอนปิดกำหนดเอง, false = ซ่อน", "Custom close icon, false hides it"), type: "ReactNode | boolean", default: "-" },
            { property: "mask", description: tr("แสดงฉากหลังทึบ (และล็อกสกรอลล์)", "Render the mask (and lock page scroll)"), type: "boolean", default: "true" },
            { property: "maskClosable", description: tr("คลิกฉากหลังแล้วปิด", "Close when the mask is clicked"), type: "boolean", default: "true" },
            { property: "keyboard", description: tr("กด Escape แล้วปิด", "Close on Escape"), type: "boolean", default: "true" },
            { property: "destroyOnClose", description: tr("ถอดเนื้อหาออกจาก DOM หลังปิด", "Unmount the children after close"), type: "boolean", default: "false" },
            { property: "forceRender", description: tr("เรนเดอร์ล่วงหน้า (ซ่อนไว้) ก่อนเปิดครั้งแรก", "Render (hidden) before the first open"), type: "boolean", default: "false" },
            { property: "afterClose", description: tr("เรียกหลังแอนิเมชันปิดจบ", "Called after the close animation"), type: "() => void", default: "-" },
            { property: "afterOpenChange", description: tr("เรียกเมื่อสถานะเปิด/ปิดนิ่งแล้ว", "Called when the open state settled"), type: "(open: boolean) => void", default: "-" },
            { property: "focusTriggerAfterClose", description: tr("คืนโฟกัสให้อิลิเมนต์เดิมหลังปิด", "Return focus to the trigger after close"), type: "boolean", default: "true" },
            { property: "loading", description: tr("แสดงโครงร่างแทนเนื้อหา", "Show a skeleton instead of the body"), type: "boolean", default: "false" },
            { property: "modalRender", description: tr("ห่อแผงกล่องด้วยอิลิเมนต์อื่น", "Wrap the dialog panel"), type: "(node: ReactNode) => ReactNode", default: "-" },
            { property: "getContainer", description: tr("ที่ตั้งของ portal; false = เรนเดอร์ตรงจุดที่เขียน", "Portal target; false renders in place"), type: "HTMLElement | (() => HTMLElement) | false", default: "document.body" },
            { property: "className", description: tr("คลาสของแผงกล่อง", "Class on the dialog panel"), type: "string", default: "-" },
            { property: "rootClassName", description: tr("คลาสของทั้งฉากหลังและตัวห่อ", "Class on both mask and wrapper"), type: "string", default: "-" },
            { property: "wrapClassName", description: tr("คลาสของตัวห่อที่เลื่อนได้", "Class on the scrollable wrapper"), type: "string", default: "-" },
            { property: "classNames", description: tr("คลาสรายส่วน", "Per-slot classes"), type: "{ header, body, footer, mask, wrapper, content }", default: "-" },
            { property: "styles", description: tr("สไตล์รายส่วน", "Per-slot styles"), type: "{ header, body, footer, mask, wrapper, content }", default: "-" },
            { property: "bodyStyle", description: tr("ทางลัดของ styles.body", "Shorthand for styles.body"), type: "CSSProperties", default: "-" },
            { property: "zIndex", description: tr("ระดับชั้นของฉากหลัง (ตัวกล่องคือ +1)", "z-index of the mask (the dialog sits at +1)"), type: "number", default: "1000" },
          ],
        },
        {
          title: "Modal.method",
          description: tr(
            "ทุกเมธอดคืน { destroy, update } — info/success/error/warning แสดงปุ่ม OK อย่างเดียว ส่วน confirm มี Cancel ด้วย",
            "Every method returns { destroy, update }. info/success/error/warning show OK only; confirm also shows Cancel.",
          ),
          rows: [
            { property: "Modal.confirm(props)", description: tr("กล่องยืนยัน (OK + Cancel)", "Confirmation dialog (OK + Cancel)"), type: "(props: ModalFuncProps) => { destroy, update }", default: "-" },
            { property: "Modal.info / success / error / warning(props)", description: tr("กล่องแจ้งข้อมูล (OK อย่างเดียว)", "Announcement dialog (OK only)"), type: "(props: ModalFuncProps) => { destroy, update }", default: "-" },
            { property: "Modal.destroyAll()", description: tr("ปิดกล่องทั้งหมดของ API แบบสถิต", "Close every dialog of the static API"), type: "() => void", default: "-" },
            { property: "Modal.useModal()", description: tr("ฮุกที่คืน [modal, contextHolder]", "Hook returning [modal, contextHolder]"), type: "() => [ModalHookApi, ReactElement]", default: "-" },
          ],
        },
        {
          title: "ModalFuncProps",
          rows: [
            { property: "title / content", description: tr("หัวข้อและเนื้อหา", "Title and content"), type: "ReactNode", default: "-" },
            { property: "icon", description: tr("ไอคอนกำหนดเอง", "Custom icon"), type: "ReactNode", default: "by type" },
            { property: "okCancel", description: tr("แสดงปุ่ม Cancel", "Show the Cancel button"), type: "boolean", default: "confirm: true, others: false" },
            { property: "okText / cancelText", description: tr("ข้อความบนปุ่ม", "Button labels"), type: "ReactNode", default: "OK / Cancel" },
            { property: "okType", description: tr("ชนิดปุ่ม OK", "Type of the OK button"), type: "ButtonProps[\"type\"]", default: "primary" },
            { property: "okButtonProps / cancelButtonProps", description: tr("พร็อพเพิ่มเติมของปุ่ม เช่น danger", "Extra button props, e.g. danger"), type: "ButtonProps", default: "-" },
            { property: "autoFocusButton", description: tr("ปุ่มที่ได้โฟกัสตอนเปิด", "Which button receives focus"), type: "\"ok\" | \"cancel\" | null", default: "ok" },
            { property: "onOk / onCancel", description: tr("คืน Promise ได้ กล่องจะรอจนเสร็จ", "May return a promise; the dialog waits for it"), type: "() => void | Promise<unknown>", default: "-" },
            { property: "afterClose", description: tr("เรียกหลังกล่องถูกถอดออก", "Called after the dialog was removed"), type: "() => void", default: "-" },
            { property: "centered / width / className / zIndex", description: tr("เหมือนพร็อพชื่อเดียวกันของ Modal", "Same as the matching Modal props"), type: "boolean | number | string", default: "centered: true, width: 416" },
            { property: "closable / mask / maskClosable / keyboard", description: tr("เหมือนพร็อพชื่อเดียวกันของ Modal", "Same as the matching Modal props"), type: "boolean", default: "closable: false, maskClosable: false" },
            { property: "getContainer", description: tr("ที่ตั้งของ portal", "Portal target"), type: "HTMLElement | (() => HTMLElement) | false", default: "document.body" },
          ],
        },
      ]}
      related={[
        { title: "Drawer", path: "/components/drawer" },
        { title: "Popconfirm", path: "/components/popconfirm" },
        { title: "App", path: "/components/app" },
      ]}
    />
  );
}
