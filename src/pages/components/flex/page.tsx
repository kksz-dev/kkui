import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Align from "./demos/align";
import alignCode from "./demos/align.tsx?raw";
import Gap from "./demos/gap";
import gapCode from "./demos/gap.tsx?raw";
import Wrap from "./demos/wrap";
import wrapCode from "./demos/wrap.tsx?raw";
import Combination from "./demos/combination";
import combinationCode from "./demos/combination.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="flex"
      imports={["Flex"]}
      whenToUse={tr(
        <>
          <ul>
            <li>ใช้กำหนดระยะห่างระหว่าง element</li>
            <li>ใช้จัดตำแหน่งทั้งแนวนอนและแนวตั้งได้หลายรูปแบบ</li>
          </ul>
          <p className="mt-2">
            ต่างจาก Space ตรงที่ <code>Space</code> ใช้กับ inline element และห่อ child แต่ละตัวไว้ในกล่องของมันเอง ส่วน{" "}
            <code>Flex</code> ใช้จัด layout ของ block-level element และใส่{" "}
            <code>gap</code> ให้ children โดยตรง
          </p>
        </>,
        <>
          <ul>
            <li>Good for setting spacing between elements.</li>
            <li>Suitable for setting various horizontal and vertical alignments.</li>
          </ul>
          <p className="mt-2">
            Difference with Space: <code>Space</code> is used to set the spacing between inline elements and wraps each
            child in an item box. <code>Flex</code> is used to set the layout of block-level elements and applies{" "}
            <code>gap</code> directly to the children.
          </p>
        </>,
      )}
      demos={[
        { title: tr("การใช้งานพื้นฐาน", "Basic"), description: tr(<>เรียง children แนวนอน หรือแนวตั้งด้วย <code>vertical</code></>, <>Layout children horizontally, or vertically with <code>vertical</code>.</>), code: basicCode, component: <Basic /> },
        { title: tr("การจัดตำแหน่ง", "Align"), description: tr(<>กำหนดการจัดวางด้วย <code>justify</code> และ <code>align</code></>, <>Set align method with <code>justify</code> and <code>align</code>.</>), code: alignCode, component: <Align />, full: true },
        { title: tr("ระยะห่าง", "Gap"), description: tr(<>ตั้งระยะห่างระหว่างรายการ: <code>sm</code> 8px, <code>md</code> 16px, <code>lg</code> 24px หรือใส่ตัวเลข / ค่าความยาว CSS</>, <>Set gap between items: <code>sm</code> 8px, <code>md</code> 16px, <code>lg</code> 24px, or a number / CSS length.</>), code: gapCode, component: <Gap /> },
        { title: tr("ขึ้นบรรทัดใหม่", "Wrap"), description: tr(<>ขึ้นบรรทัดใหม่อัตโนมัติด้วย <code>wrap</code></>, <>Auto wrap line with <code>wrap</code>.</>), code: wrapCode, component: <Wrap /> },
        { title: tr("ใช้ร่วมกัน", "Combination"), description: tr(<>ผสม <code>flex</code>, <code>component</code> และ Flex ซ้อนกัน เพื่อประกอบเป็น layout ของการ์ด</>, <>Compose <code>flex</code>, <code>component</code> and nested Flex to build a card layout.</>), code: combinationCode, component: <Combination />, full: true },
      ]}
      api={[
        {
          title: "Flex",
          description: tr("สืบทอดจาก React.ComponentProps<\"div\">", "Extends React.ComponentProps<\"div\">."),
          rows: [
            { property: "vertical", description: tr("เรียงแนวตั้ง (flex-direction: column)", "Is direction of the flex vertical, use flex-direction: column"), type: "boolean", default: "false" },
            { property: "wrap", description: tr("แสดงในบรรทัดเดียวหรือขึ้นหลายบรรทัด (true = wrap)", "Set whether the element is displayed in a single line or in multiple lines (true = wrap)"), type: "boolean | 'nowrap' | 'wrap' | 'wrap-reverse'", default: "nowrap" },
            { property: "justify", description: tr("การจัดวางตามแนวแกนหลัก (justify-content)", "Sets the alignment of elements in the direction of the main axis"), type: "CSS justify-content", default: "normal" },
            { property: "align", description: tr("การจัดวางตามแนวแกนขวาง (align-items)", "Sets the alignment of elements in the direction of the cross axis"), type: "CSS align-items", default: "normal" },
            { property: "flex", description: tr("ค่า CSS flex shorthand ที่ใส่ให้คอนเทนเนอร์นี้เอง (เมื่อซ้อนอยู่ใน flex อีกชั้น)", "Flex CSS shorthand properties applied to this container itself (when nested in another flex parent)"), type: "CSS flex", default: "-" },
            { property: "gap", description: tr("ระยะห่างระหว่างรายการ: preset sm 8px / md 16px / lg 24px, ตัวเลข (px) หรือค่าความยาว CSS", "Sets the gap between items: preset sm 8px / md 16px / lg 24px, a number (px) or a CSS length"), type: "sm | md | lg | number | string", default: "-" },
            { property: "component", description: tr("เรนเดอร์เป็น element อื่น เช่น section, ul", "Custom element type, e.g. section, ul"), type: "React.ElementType", default: "div" },
          ],
        },
      ]}
      related={[{ title: "Space", path: "/components/space" }, { title: "Grid", path: "/components/grid" }]}
    />
  );
}
