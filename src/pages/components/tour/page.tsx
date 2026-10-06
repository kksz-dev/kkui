import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import NonModal from "./demos/non-modal";
import nonModalCode from "./demos/non-modal.tsx?raw";
import Placement from "./demos/placement";
import placementCode from "./demos/placement.tsx?raw";
import CustomIndicator from "./demos/custom-indicator";
import customIndicatorCode from "./demos/custom-indicator.tsx?raw";
import ActionsRender from "./demos/actions-render";
import actionsRenderCode from "./demos/actions-render.tsx?raw";
import CustomMask from "./demos/custom-mask";
import customMaskCode from "./demos/custom-mask.tsx?raw";
import Primary from "./demos/primary";
import primaryCode from "./demos/primary.tsx?raw";
import Gap from "./demos/gap";
import gapCode from "./demos/gap.tsx?raw";
import Cover from "./demos/cover";
import coverCode from "./demos/cover.tsx?raw";
import DisabledInteraction from "./demos/disabled-interaction";
import disabledInteractionCode from "./demos/disabled-interaction.tsx?raw";
import Controlled from "./demos/controlled";
import controlledCode from "./demos/controlled.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="tour"
      imports={["Tour", "type TourStep", "type TourProps", "type TourPlacement"]}
      whenToUse={tr(
        <>
          <p>ใช้แนะนำการใช้งานทีละขั้น พาผู้ใช้ใหม่ทำความรู้จักระบบ หรือแนะนำฟีเจอร์ใหม่</p>
          <ul>
            <li>เน้นปุ่ม ฟอร์ม หรือเมนูสำคัญด้วยหน้ากากเจาะช่อง (spotlight)</li>
            <li>แสดงการ์ดคำอธิบายพร้อมหัวข้อ รูปประกอบ และตัวบอกความคืบหน้า</li>
            <li>คำนวณตำแหน่งการ์ดอัตโนมัติ เลื่อนเป้าหมายเข้าจอ และรองรับสไตล์ primary</li>
          </ul>
        </>,
        <>
          <p>Used for guided tutorials, onboarding walkthroughs, or introducing a new feature.</p>
          <ul>
            <li>Highlights key buttons, forms, or navigation items with a spotlight mask.</li>
            <li>Shows step cards with titles, explanations, media, and progress indicators.</li>
            <li>Computes placement automatically, scrolls the target into view, and supports a primary style.</li>
          </ul>
        </>,
      )}
      demos={[
        {
          title: tr("พื้นฐาน", "Basic"),
          description: tr(<>ทัวร์แนะนำทีละขั้นแบบพื้นฐานที่สุด</>, <>The most basic step-by-step walkthrough.</>),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("ไม่มีหน้ากาก", "Non-Modal"),
          description: tr(<>ปิดหน้ากากพื้นหลังด้วย <code>{"mask={false}"}</code> ผู้ใช้ยังกดของอื่นได้ตามปกติ</>, <>Turn the backdrop off with <code>{"mask={false}"}</code>; the rest of the page stays clickable.</>),
          code: nonModalCode,
          component: <NonModal />,
        },
        {
          title: tr("ตำแหน่ง", "Placement"),
          description: tr(<>ย้ายตำแหน่งการ์ดเทียบกับเป้าหมาย และให้ลูกศรชี้กลางเป้าหมายด้วย <code>{"arrow={{ pointAtCenter: true }}"}</code></>, <>Move the card relative to the target, and let the arrow track the target center with <code>{"arrow={{ pointAtCenter: true }}"}</code>.</>),
          code: placementCode,
          component: <Placement />,
        },
        {
          title: tr("ตัวบอกขั้นเอง", "Custom Indicator"),
          description: tr(<>เปลี่ยนวิธีแสดงความคืบหน้าด้วย <code>indicatorsRender</code></>, <>Customize the progress indicator with <code>indicatorsRender</code>.</>),
          code: customIndicatorCode,
          component: <CustomIndicator />,
        },
        {
          title: tr("ปุ่มท้ายการ์ดเอง", "Actions Render"),
          description: tr(
            <>
              <code>actionsRender</code> ได้ปุ่มมาตรฐานมาเป็นพารามิเตอร์ จึงเพิ่มปุ่ม "ข้าม" หรือจัดวางใหม่ได้
              ส่วน <code>nextButtonProps.onClick</code> จะถูกเรียกเพิ่ม ไม่ทับการเลื่อนขั้น
            </>,
            <>
              <code>actionsRender</code> receives the default buttons, so you can add a Skip button or rearrange them.
              A <code>nextButtonProps.onClick</code> runs in addition to step navigation, never instead of it.
            </>,
          ),
          code: actionsRenderCode,
          component: <ActionsRender />,
        },
        {
          title: tr("หน้ากากแบบกำหนดเอง", "Custom Mask"),
          description: tr(<>ตั้งสีหน้ากากด้วย <code>mask.color</code> และปิดการคลิกหน้ากากเพื่อจบทัวร์ด้วย <code>mask.closable</code></>, <>Set the backdrop color with <code>mask.color</code>, and stop mask clicks from ending the tour with <code>mask.closable</code>.</>),
          code: customMaskCode,
          component: <CustomMask />,
        },
        {
          title: tr("สไตล์ primary", "Primary Type"),
          description: tr(<>ใช้ <code>type="primary"</code> เมื่ออยากให้การ์ดเด่นด้วยสีแบรนด์</>, <>Use <code>type="primary"</code> for a brand-colored guide card.</>),
          code: primaryCode,
          component: <Primary />,
        },
        {
          title: tr("ระยะเจาะช่อง", "Custom Gap"),
          description: tr(<>ปรับระยะและความมนของช่องเจาะด้วย <code>gap</code></>, <>Adjust the padding and corner radius of the cut-out with <code>gap</code>.</>),
          code: gapCode,
          component: <Gap />,
        },
        {
          title: tr("รูปประกอบ", "Cover Media"),
          description: tr(<>ใส่รูปหรือแบนเนอร์ในขั้นตอนด้วย <code>cover</code></>, <>Add an image or banner to a step with <code>cover</code>.</>),
          code: coverCode,
          component: <Cover />,
        },
        {
          title: tr("ล็อกไม่ให้กดเป้าหมาย", "Disabled Interaction"),
          description: tr(<><code>disabledInteraction</code> วางตัวกันคลิกทับช่องเจาะ ทำให้กดปุ่มเป้าหมายไม่ได้ระหว่างทัวร์</>, <><code>disabledInteraction</code> puts a blocker over the cut-out, so the highlighted control cannot be clicked during the step.</>),
          code: disabledInteractionCode,
          component: <DisabledInteraction />,
        },
        {
          title: tr("ควบคุมจากภายนอก", "Controlled"),
          description: tr(<>คุมขั้นที่กำลังแสดงและสถานะเปิด/ปิดจาก state ภายนอก</>, <>Drive the active step and the open state from outside state.</>),
          code: controlledCode,
          component: <Controlled />,
        },
      ]}
      api={[
        {
          title: "Tour",
          rows: [
            { property: "steps", description: tr("รายการขั้นตอน", "List of steps"), type: "TourStep[]", default: "[]" },
            { property: "open", description: tr("เปิดทัวร์อยู่หรือไม่", "Whether the tour is open"), type: "boolean", default: "false" },
            { property: "current", description: tr("ขั้นปัจจุบัน (controlled)", "Current step index (controlled)"), type: "number", default: "-" },
            { property: "defaultCurrent", description: tr("ขั้นเริ่มต้น (uncontrolled)", "Initial step index (uncontrolled)"), type: "number", default: "0" },
            { property: "type", description: tr("สไตล์ของการ์ด", "Visual style of the card"), type: "default | primary", default: "default" },
            { property: "mask", description: tr("หน้ากากพื้นหลัง: ปิดด้วย false หรือกำหนดสี/สไตล์/การคลิกปิด", "Backdrop: `false` to disable, or an object for color / style / click-to-close"), type: "boolean | { color?: string; style?: CSSProperties; closable?: boolean }", default: "true" },
            { property: "arrow", description: tr("แสดงลูกศร และให้ชี้กลางเป้าหมายด้วย pointAtCenter", "Show the arrow; `pointAtCenter` makes it track the target center"), type: "boolean | { pointAtCenter?: boolean }", default: "true" },
            { property: "placement", description: tr("ตำแหน่งเริ่มต้นของการ์ดเทียบกับเป้าหมาย", "Default card placement relative to the target"), type: "TourPlacement", default: "bottom" },
            { property: "indicatorsRender", description: tr("เรนเดอร์ตัวบอกความคืบหน้าเอง", "Custom progress indicator renderer"), type: "(current: number, total: number) => ReactNode", default: "-" },
            { property: "actionsRender", description: tr("เรนเดอร์ปุ่มท้ายการ์ดเอง โดยได้ปุ่มมาตรฐานมาเป็นพารามิเตอร์แรก", "Custom footer actions; receives the default buttons as the first argument"), type: "(originNode: ReactNode, info: { current: number; total: number }) => ReactNode", default: "-" },
            { property: "closeIcon", description: tr("ไอคอนปิดของทุกขั้น ส่ง null เพื่อซ่อนปุ่มปิด", "Close icon for every step; pass `null` to hide the close button"), type: "ReactNode", default: "<X />" },
            { property: "disabledInteraction", description: tr("กันไม่ให้คลิก element ที่ถูกเน้น", "Block interaction with the spotlighted element"), type: "boolean", default: "false" },
            { property: "gap", description: tr("ระยะและความมนของช่องเจาะรอบเป้าหมาย", "Offset and corner radius of the cut-out around the target"), type: "{ offset?: number | [number, number]; radius?: number }", default: "{ offset: 6, radius: 6 }" },
            { property: "animated", description: tr("ให้ช่องเจาะและการ์ดเคลื่อนแบบมีทรานซิชันเวลาเปลี่ยนขั้น", "Animate the spotlight and the card as the step changes"), type: "boolean", default: "true" },
            { property: "scrollIntoViewOptions", description: tr("พฤติกรรมการเลื่อนเป้าหมายเข้าจอ ใช้กับทุกขั้นที่ไม่ได้กำหนดเอง", "Scroll behavior for targets, for every step that does not set its own"), type: "boolean | ScrollIntoViewOptions", default: "{ behavior: 'smooth', block: 'center' }" },
            { property: "getPopupContainer", description: tr("คืน element ที่จะใช้เป็นที่เรนเดอร์ทัวร์", "Returns the element the tour is rendered into"), type: "(triggerNode?: HTMLElement) => HTMLElement", default: "document.body" },
            { property: "zIndex", description: tr("z-index ของชั้นทัวร์", "z-index of the tour layer"), type: "number", default: "1001" },
            { property: "rootClassName", description: tr("คลาสของ element ครอบทั้งทัวร์", "Class name of the tour root element"), type: "string", default: "-" },
            { property: "onChange", description: tr("เรียกเมื่อเปลี่ยนขั้น", "Fires when the step changes"), type: "(current: number) => void", default: "-" },
            { property: "onClose", description: tr("เรียกเมื่อทัวร์ถูกปิด", "Fires when the tour closes"), type: "(current: number) => void", default: "-" },
            { property: "onFinish", description: tr("เรียกเมื่อกดจบที่ขั้นสุดท้าย", "Fires when the last step finishes"), type: "() => void", default: "-" },
          ],
        },
        {
          title: "TourStep",
          description: tr("ค่าตั้งของแต่ละขั้น ทับค่าระดับ Tour ได้", "Per-step config; overrides the Tour-level value."),
          rows: [
            { property: "target", description: tr("element เป้าหมาย: ref, DOM element หรือฟังก์ชันที่คืน element", "Target element: a ref, a DOM element, or a getter"), type: "HTMLElement | RefObject | (() => HTMLElement | null)", default: "-" },
            { property: "title", description: tr("หัวข้อของขั้น", "Step title"), type: "ReactNode", default: "-" },
            { property: "description", description: tr("คำอธิบายของขั้น", "Step description"), type: "ReactNode", default: "-" },
            { property: "cover", description: tr("รูปหรือสื่อประกอบด้านบนการ์ด", "Cover image or media at the top of the card"), type: "ReactNode", default: "-" },
            { property: "placement", description: tr("ตำแหน่งการ์ดของขั้นนี้", "Card placement for this step"), type: "TourPlacement", default: "Tour placement" },
            { property: "arrow", description: tr("ลูกศรของขั้นนี้", "Arrow config for this step"), type: "boolean | { pointAtCenter?: boolean }", default: "-" },
            { property: "mask", description: tr("หน้ากากของขั้นนี้", "Mask config for this step"), type: "boolean | { color?: string; style?: CSSProperties; closable?: boolean }", default: "-" },
            { property: "type", description: tr("สไตล์การ์ดของขั้นนี้", "Card style for this step"), type: "default | primary", default: "-" },
            { property: "closable", description: tr("แสดงปุ่มปิดหรือไม่ ใส่เป็นอ็อบเจกต์เพื่อกำหนดไอคอน/aria-label เองได้", "Whether the close button shows; pass an object to set its icon / aria-label"), type: "boolean | { closeIcon?: ReactNode; 'aria-label'?: string }", default: "true" },
            { property: "closeIcon", description: tr("ไอคอนปิดของขั้นนี้", "Close icon for this step"), type: "ReactNode", default: "-" },
            { property: "total", description: tr("จำนวนขั้นที่ใช้แสดงในตัวบอกความคืบหน้าและ actionsRender", "Step count reported to the indicators and to actionsRender"), type: "number", default: "steps.length" },
            { property: "nextButtonProps", description: tr("พร็อพของปุ่มถัดไป (onClick ถูกเรียกเพิ่ม ไม่ทับการเลื่อนขั้น)", "Props for the next button (its onClick runs in addition to navigation)"), type: "ButtonProps", default: "-" },
            { property: "prevButtonProps", description: tr("พร็อพของปุ่มย้อนกลับ", "Props for the previous button"), type: "ButtonProps", default: "-" },
            { property: "scrollIntoViewOptions", description: tr("พฤติกรรมการเลื่อนเข้าจอของขั้นนี้", "Scroll-into-view behavior for this step"), type: "boolean | ScrollIntoViewOptions", default: "-" },
            { property: "onClose", description: tr("เรียกเมื่อปิดทัวร์จากขั้นนี้", "Fires when the tour is closed from this step"), type: "() => void", default: "-" },
            { property: "className", description: tr("คลาสของการ์ดในขั้นนี้", "Class name of the card for this step"), type: "string", default: "-" },
            { property: "style", description: tr("สไตล์ของการ์ดในขั้นนี้", "Style of the card for this step"), type: "CSSProperties", default: "-" },
          ],
        },
      ]}
      related={[
        { title: "Tooltip", path: "/components/tooltip" },
        { title: "Popover", path: "/components/popover" },
        { title: "Steps", path: "/components/steps" },
      ]}
    />
  );
}
