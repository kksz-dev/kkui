import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import ColorVariant from "./demos/color-variant";
import colorVariantCode from "./demos/color-variant.tsx?raw";
import Icon from "./demos/icon";
import iconCode from "./demos/icon.tsx?raw";
import Size from "./demos/size";
import sizeCode from "./demos/size.tsx?raw";
import Disabled from "./demos/disabled";
import disabledCode from "./demos/disabled.tsx?raw";
import Loading from "./demos/loading";
import loadingCode from "./demos/loading.tsx?raw";
import Ghost from "./demos/ghost";
import ghostCode from "./demos/ghost.tsx?raw";
import Danger from "./demos/danger";
import dangerCode from "./demos/danger.tsx?raw";
import Block from "./demos/block";
import blockCode from "./demos/block.tsx?raw";
import Group from "./demos/group";
import groupCode from "./demos/group.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="button"
      imports={["Button", "ButtonGroup"]}
      whenToUse={tr(
        <>
          <p>ปุ่มหมายถึงการกระทำหนึ่งอย่าง (หรือชุดของการกระทำ) เมื่อคลิกจะเรียกใช้ตรรกะทางธุรกิจที่ผูกไว้</p>
          <p className="mt-2">KKUI มี <code>type</code> แบบย่อ 5 แบบ และเมทริกซ์ <code>variant</code> × <code>color</code>:</p>
          <ul>
            <li>ปุ่ม Primary: ใช้กับการกระทำหลัก ในหนึ่งส่วนควรมีปุ่ม primary ได้มากสุดหนึ่งปุ่ม</li>
            <li>ปุ่ม Default: ใช้กับชุดการกระทำที่ไม่มีลำดับความสำคัญ</li>
            <li>ปุ่ม Dashed: มักใช้กับการ "เพิ่ม" รายการ</li>
            <li>ปุ่ม Text: ใช้กับการกระทำที่รองที่สุด</li>
            <li>ปุ่ม Link: ใช้กับลิงก์ภายนอก</li>
          </ul>
          <p className="mt-2">และมีพร็อพเสริมอีก 4 ตัว: <code>danger</code>, <code>ghost</code>, <code>disabled</code>, <code>loading</code></p>
        </>,
        <>
          <p>A button means an operation (or a series of operations). Clicking a button will trigger its corresponding business logic.</p>
          <p className="mt-2">KKUI provides 5 shorthand <code>type</code>s and a <code>variant</code> × <code>color</code> matrix:</p>
          <ul>
            <li>Primary button: used for the main action, there can be at most one primary button in a section.</li>
            <li>Default button: used for a series of actions without priority.</li>
            <li>Dashed button: commonly used for adding more actions.</li>
            <li>Text button: used for the most secondary action.</li>
            <li>Link button: used for external links.</li>
          </ul>
          <p className="mt-2">And 4 other properties additionally: <code>danger</code>, <code>ghost</code>, <code>disabled</code>, <code>loading</code>.</p>
        </>,
      )}
      demos={[
        { title: tr("ประเภท", "Type"), description: tr(<>มีปุ่ม <code>primary</code>, <code>default</code>, <code>dashed</code>, <code>text</code> และ <code>link</code></>, <>There are <code>primary</code>, <code>default</code>, <code>dashed</code>, <code>text</code> and <code>link</code> buttons.</>), code: basicCode, component: <Basic /> },
        { title: tr("สีและรูปแบบ", "Color & Variant"), description: tr(<>ตั้ง <code>variant</code> (solid / outlined / dashed / filled / text / link) คู่กับ <code>color</code> ได้ครบเมทริกซ์</>, <>Set <code>variant</code> (solid / outlined / dashed / filled / text / link) with <code>color</code> for a full matrix.</>), code: colorVariantCode, component: <ColorVariant /> },
        { title: tr("ไอคอน", "Icon"), description: tr(<>ส่ง <code>icon</code>; ถ้าไม่มี children ปุ่มจะเป็นสี่เหลี่ยมจัตุรัส <code>iconPosition</code> ย้ายไอคอนไปท้าย</>, <>Pass <code>icon</code>; when children are omitted the button becomes square. <code>iconPosition</code> flips it to the end.</>), code: iconCode, component: <Icon /> },
        { title: tr("ขนาด", "Size"), description: tr(<>สามขนาด: <code>lg</code> (40px), <code>md</code> (32px ค่าเริ่มต้น), <code>sm</code> (24px)</>, <>Three sizes: <code>lg</code> (40px), <code>md</code> (32px, default), <code>sm</code> (24px).</>), code: sizeCode, component: <Size /> },
        { title: tr("ปิดใช้งาน", "Disabled"), description: tr(<>ใส่ <code>disabled</code> เพื่อให้ปุ่มใช้งานและคลิกไม่ได้</>, <>Add <code>disabled</code> to make a button unusable and un-clickable.</>), code: disabledCode, component: <Disabled /> },
        { title: tr("กำลังโหลด", "Loading"), description: tr(<><code>loading</code> แสดงสปินเนอร์และกันการคลิก ส่งเป็นอ็อบเจกต์ <code>{"{ delay, icon }"}</code> เพื่อหน่วงเวลาหรือเปลี่ยนสปินเนอร์ และสปินเนอร์จะไปอยู่ฝั่งเดียวกับ <code>iconPosition</code></>, <><code>loading</code> shows a spinner and blocks clicks. Pass <code>{"{ delay, icon }"}</code> to delay or replace the spinner; it renders on the <code>iconPosition</code> side.</>), code: loadingCode, component: <Loading /> },
        { title: tr("โปร่งใส (ghost)", "Ghost"), description: tr(<><code>ghost</code> ทำให้พื้นหลังโปร่งใส สำหรับวางบนพื้นสี</>, <><code>ghost</code> makes the background transparent, for buttons on colored backgrounds.</>), code: ghostCode, component: <Ghost /> },
        { title: tr("อันตราย", "Danger"), description: tr(<><code>danger</code> คือทางลัดของ <code>color="danger"</code></>, <><code>danger</code> is a shorthand for <code>color="danger"</code>.</>), code: dangerCode, component: <Danger /> },
        { title: tr("เต็มความกว้าง", "Block"), description: tr(<><code>block</code> ทำให้ปุ่มกว้างเท่า parent</>, <><code>block</code> fits the button to the width of its parent.</>), code: blockCode, component: <Block /> },
        { title: tr("กลุ่มปุ่ม", "Button Group"), description: tr(<>ต่อปุ่มติดกันด้วย <code>ButtonGroup</code> และตั้ง <code>size</code> ทีเดียวให้ทั้งกลุ่ม</>, <>Attach buttons with <code>ButtonGroup</code>; its <code>size</code> applies to every button inside.</>), code: groupCode, component: <Group /> },
      ]}
      api={[
        {
          title: "Button",
          description: tr("ขยายจาก React.ComponentProps<\"button\"> (ยกเว้น `type` ดั้งเดิม ให้ใช้ `htmlType`)", "Extends React.ComponentProps<\"button\"> (except native `type`, use `htmlType`)."),
          rows: [
            { property: "type", description: tr("ทางลัดของคู่ variant/color", "Shorthand for variant/color pairs"), type: "default | primary | dashed | text | link", default: "default" },
            { property: "variant", description: tr("รูปแบบการแสดงผล ทับ `type`", "Visual style, overrides `type`"), type: "solid | outlined | dashed | filled | text | link", default: "-" },
            { property: "color", description: tr("สีเชิงความหมาย ทับ `type`", "Semantic color, overrides `type`"), type: "default | primary | danger", default: "-" },
            { property: "danger", description: "Red styling (color=\"danger\")", type: "boolean", default: "false" },
            { property: "ghost", description: tr("พื้นหลังโปร่งใส คงเส้นขอบ/ตัวอักษร", "Transparent background, keeps border/text"), type: "boolean", default: "false" },
            { property: "size", description: tr("ความสูง 24 / 32 / 40px", "Height 24 / 32 / 40px"), type: "sm | md | lg", default: "md" },
            { property: "shape", description: tr("รูปทรงมุม", "Border radius preset"), type: "default | circle | round", default: "default" },
            { property: "block", description: tr("กว้างเท่า parent", "Fit width of parent"), type: "boolean", default: "false" },
            { property: "loading", description: tr("แสดงสปินเนอร์และปิดการคลิก; รูปแบบอ็อบเจกต์หน่วงเวลาก่อนแสดง (delay) หรือเปลี่ยนไอคอนสปินเนอร์ (icon)", "Show spinner + disable; the object form delays the spinner (delay) or replaces it (icon)"), type: "boolean | { delay?: number; icon?: ReactNode }", default: "false" },
            { property: "autoInsertSpace", description: tr("แทรกช่องว่างระหว่างอักษรจีน 2 ตัวที่เป็นข้อความทั้งปุ่ม", "Insert a space between the two characters of a 2-Chinese-character label"), type: "boolean", default: "true" },
            { property: "icon", description: tr("ไอคอน", "Icon element"), type: "ReactNode", default: "-" },
            { property: "iconPosition", description: tr("ตำแหน่งไอคอน (สปินเนอร์ตอน loading ก็ไปอยู่ฝั่งเดียวกัน)", "Where the icon is placed (the loading spinner follows it)"), type: "start | end", default: "start" },
            { property: "href", description: tr("เรนเดอร์เป็น <a>", "Render as anchor"), type: "string", default: "-" },
            { property: "target", description: tr("target ของลิงก์ (ใช้กับ href)", "Anchor target (with href)"), type: "string", default: "-" },
            { property: "htmlType", description: tr("type ของ button จริง", "Native button type"), type: "button | submit | reset", default: "button" },
            { property: "disabled", description: tr("สถานะปิดใช้งาน", "Disabled state"), type: "boolean", default: "false" },
            { property: "asChild", description: tr("ผสานพร็อพ (รวม ref และ wave) เข้า child element", "Merge props (including ref and the wave handler) into the child element"), type: "boolean", default: "false" },
            { property: "style", description: tr("สไตล์อินไลน์ — ถูกผสานทับตัวแปรสีของ wave ไม่ทับทิ้ง", "Inline style — merged on top of the wave color variable, never replacing it"), type: "CSSProperties", default: "-" },
            { property: "onClick", description: tr("ตัวจัดการคลิก", "Click handler"), type: "MouseEventHandler", default: "-" },
          ],
        },
        {
          title: "ButtonGroup",
          rows: [
            { property: "size", description: tr("ขนาดของทุกปุ่มในกลุ่มที่ไม่ได้ตั้ง size เอง", "Size for every Button inside that does not set its own"), type: "sm | md | lg", default: "-" },
            { property: "className", description: tr("คลาสเพิ่มเติมบน wrapper", "Extra classes on the wrapper"), type: "string", default: "-" },
          ],
        },
      ]}
      extra={tr(
        <>
          <h2>คำถามที่พบบ่อย</h2>
          <h3>ทำไม <code>type</code> ไม่ใช่แอตทริบิวต์ดั้งเดิมของ button?</h3>
          <p>เพราะ <code>type</code> เป็นทางลัดของรูปแบบการแสดงผล ถ้าต้องการ submit ฟอร์มใช้ <code>htmlType="submit"</code> หรือใช้ <code>asChild</code> เพื่อเรนเดอร์เป็น element อื่น</p>
        </>,
        <>
          <h2>FAQ</h2>
          <h3>Why is <code>type</code> not the native attribute?</h3>
          <p>Because <code>type</code> is the visual shorthand. Use <code>htmlType="submit"</code> for forms, or <code>asChild</code> to render any element.</p>
        </>,
      )}
      related={[{ title: "Space", path: "/components/space" }, { title: "Dropdown", path: "/components/dropdown" }]}
    />
  );
}
