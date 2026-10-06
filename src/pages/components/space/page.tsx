import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Vertical from "./demos/vertical";
import verticalCode from "./demos/vertical.tsx?raw";
import Size from "./demos/size";
import sizeCode from "./demos/size.tsx?raw";
import Align from "./demos/align";
import alignCode from "./demos/align.tsx?raw";
import CustomSize from "./demos/custom-size";
import customSizeCode from "./demos/custom-size.tsx?raw";
import Wrap from "./demos/wrap";
import wrapCode from "./demos/wrap.tsx?raw";
import Split from "./demos/split";
import splitCode from "./demos/split.tsx?raw";
import Compact from "./demos/compact";
import compactCode from "./demos/compact.tsx?raw";
import CompactSize from "./demos/compact-size";
import compactSizeCode from "./demos/compact-size.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="space"
      imports={["Space", "SpaceCompact"]}
      whenToUse={tr(
        <>
          <ul>
            <li>ใช้เว้นระยะห่างระหว่างคอมโพเนนต์ให้สม่ำเสมอ ไม่ให้ชิดติดกัน</li>
            <li>
              ใช้ <code>SpaceCompact</code> เมื่อต้องการให้ฟอร์มคอนโทรลที่อยู่ติดกันเชื่อมเป็นชิ้นเดียว (ลบมุมด้านในและซ้อนเส้นขอบที่ชนกัน)
            </li>
          </ul>
          <p className="mt-2">
            Space กับ Flex: <code>Space</code> ใช้กับ inline element และห่อ child แต่ละตัวไว้ในกล่องของมันเอง ส่วน{" "}
            <code>Flex</code> ใช้จัด layout ของ block-level element และใส่ <code>gap</code> ให้ children โดยตรง
          </p>
        </>,
        <>
          <ul>
            <li>Avoid components clinging together and set a unified space.</li>
            <li>Use <code>SpaceCompact</code> when child form components are compactly connected and the border is collapsed.</li>
          </ul>
          <p className="mt-2">
            Space vs Flex: <code>Space</code> is for inline elements and wraps every child in an item box; <code>Flex</code>{" "}
            is for block-level layout and applies <code>gap</code> directly.
          </p>
        </>,
      )}
      demos={[
        { title: tr("การใช้งานพื้นฐาน", "Basic Usage"), description: tr(<>เว้นระยะแนวนอนระหว่างคอมโพเนนต์ที่อยู่ติดกัน</>, <>Crowded components horizontal spacing.</>), code: basicCode, component: <Basic /> },
        { title: tr("แนวตั้ง", "Vertical Space"), description: tr(<>เว้นระยะแนวตั้งด้วย <code>direction="vertical"</code></>, <>Crowded components vertical spacing with <code>direction="vertical"</code>.</>), code: verticalCode, component: <Vertical /> },
        { title: tr("ขนาดระยะห่าง", "Space Size"), description: tr(<><code>sm</code> 8px, <code>md</code> 16px, <code>lg</code> 24px</>, <><code>sm</code> 8px, <code>md</code> 16px, <code>lg</code> 24px.</>), code: sizeCode, component: <Size /> },
        { title: tr("การจัดตำแหน่ง", "Align"), description: tr(<>กำหนดการจัดวางของรายการด้วย <code>align</code></>, <>Config item align with <code>align</code>.</>), code: alignCode, component: <Align /> },
        { title: tr("กำหนดขนาดเอง", "Customize Size"), description: tr(<>กำหนดระยะห่างเป็นตัวเลข (px) หรือ tuple <code>[horizontal, vertical]</code></>, <>Custom spacing size by number, or a <code>[horizontal, vertical]</code> tuple.</>), code: customSizeCode, component: <CustomSize /> },
        { title: tr("ขึ้นบรรทัดใหม่", "Wrap"), description: tr(<>ขึ้นบรรทัดใหม่อัตโนมัติด้วย <code>wrap</code></>, <>Auto wrap line with <code>wrap</code>.</>), code: wrapCode, component: <Wrap /> },
        { title: tr("ตัวคั่น", "Split"), description: tr(<>แทรก node จาก <code>split</code> คั่นระหว่างรายการ</>, <>Render a <code>split</code> node between items.</>), code: splitCode, component: <Split /> },
        { title: tr("โหมดกระชับ", "Compact Mode"), description: tr(<><code>SpaceCompact</code> เชื่อมปุ่มและช่องกรอกเข้าด้วยกัน: ลบมุมด้านในและซ้อนเส้นขอบที่ชนกัน ใส่ <code>direction="vertical"</code> เพื่อเรียงลงแนวตั้ง</>, <><code>SpaceCompact</code> attaches buttons and inputs: inner radius is removed and adjacent borders overlap. Set <code>direction="vertical"</code> to stack.</>), code: compactCode, component: <Compact /> },
        { title: tr("ขนาดโหมดกระชับ", "Compact Size"), description: tr(<><code>size</code> บังคับความสูง/ขนาดตัวอักษรของลูกโดยตรงจากคอนเทนเนอร์ และยังส่งผ่าน context ให้คอนโทรลอ่านด้วย <code>useSpaceCompact()</code> ได้</>, <><code>size</code> forces the height / font size of the direct children from the container, and is still published on context for controls that read <code>useSpaceCompact()</code>.</>), code: compactSizeCode, component: <CompactSize /> },
      ]}
      api={[
        {
          title: "Space",
          description: tr("สืบทอดจาก React.ComponentProps<\"div\">", "Extends React.ComponentProps<\"div\">."),
          rows: [
            { property: "align", description: tr("การจัดวางรายการตามแกนขวาง", "Align items"), type: "start | end | center | baseline", default: "center (horizontal)" },
            { property: "classNames", description: tr("class name ของส่วนย่อย (กล่องห่อแต่ละรายการ)", "Semantic class names (item wrapper)"), type: "{ item?: string }", default: "-" },
            { property: "direction", description: tr("ทิศทางการเรียง", "The space direction"), type: "vertical | horizontal", default: "horizontal" },
            { property: "size", description: tr("ระยะห่าง: preset หรือตัวเลข (px); tuple กำหนด [แนวนอน, แนวตั้ง]", "The space size: preset or number (px); a tuple sets [horizontal, vertical]"), type: "sm | md | lg | number | [SpaceSize, SpaceSize]", default: "sm" },
            { property: "split", description: tr("node ที่แทรกคั่นระหว่างรายการ", "Node rendered between items"), type: "ReactNode", default: "-" },
            { property: "wrap", description: tr("ขึ้นบรรทัดใหม่อัตโนมัติ (มีผลเฉพาะแนวนอน)", "Auto wrap line, effective when horizontal"), type: "boolean", default: "false" },
          ],
        },
        {
          title: "SpaceCompact",
          description: tr("สืบทอดจาก React.ComponentProps<\"div\">", "Extends React.ComponentProps<\"div\">."),
          rows: [
            { property: "block", description: tr("ขยายความกว้างเต็ม parent", "Fit width to its parent's width"), type: "boolean", default: "false" },
            { property: "direction", description: tr("ทิศทางการเรียง", "Set direction of layout"), type: "vertical | horizontal", default: "horizontal" },
            { property: "size", description: tr("ขนาดของคอนโทรลลูก — คอนเทนเนอร์บังคับ height/font-size ให้ลูกโดยตรง (24 / 32 / 40px) และเผยแพร่ผ่าน useSpaceCompact()", "Size of the child controls — the container forces height/font-size on its direct children (24 / 32 / 40px) and publishes it via useSpaceCompact()"), type: "sm | md | lg", default: "-" },
          ],
        },
        {
          title: "useSpaceCompact",
          description: tr("Hook คืนค่า { size, direction } หรือ null ของ SpaceCompact ที่ใกล้ที่สุด", "Hook that returns { size, direction } | null for the nearest SpaceCompact."),
          rows: [{ property: "return", description: tr("ค่า context ของ compact หรือ null เมื่ออยู่นอก SpaceCompact", "Compact context or null when outside"), type: "SpaceCompactItem | null", default: "-" }],
        },
      ]}
      related={[{ title: "Flex", path: "/components/flex" }, { title: "Divider", path: "/components/divider" }, { title: "Button", path: "/components/button" }]}
    />
  );
}
