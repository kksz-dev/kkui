import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Half from "./demos/half";
import halfCode from "./demos/half.tsx?raw";
import TextDemo from "./demos/text";
import textCode from "./demos/text.tsx?raw";
import ReadOnly from "./demos/read-only";
import readOnlyCode from "./demos/read-only.tsx?raw";
import Clear from "./demos/clear";
import clearCode from "./demos/clear.tsx?raw";
import OtherCharacter from "./demos/other-character";
import otherCharacterCode from "./demos/other-character.tsx?raw";
import CustomCharacter from "./demos/custom-character";
import customCharacterCode from "./demos/custom-character.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="rate"
      imports={["Rate"]}
      whenToUse={tr(
        <ul>
          <li>ใช้แสดงคะแนนหรือผลการประเมิน</li>
          <li>ใช้ให้ผู้ใช้ให้คะแนนบางอย่างอย่างรวดเร็ว</li>
        </ul>,
        <ul>
          <li>Show evaluation and score ratings.</li>
          <li>A quick rating operation on something.</li>
        </ul>,
      )}
      demos={[
        { title: tr("การใช้งานพื้นฐาน", "Basic"), description: tr("ตัวอย่างที่ง่ายที่สุด", "The simplest usage."), code: basicCode, component: <Basic /> },
        { title: tr("ครึ่งดาว", "Half Star"), description: tr(<>เลือกครึ่งดาวได้ด้วย <code>allowHalf</code></>, <>Support selecting half star via <code>allowHalf</code>.</>), code: halfCode, component: <Half /> },
        { title: tr("แสดงข้อความกำกับ", "Show Copywriting"), description: tr(<>ใส่ข้อความกำกับแต่ละระดับด้วย <code>tooltips</code> คู่กับ <code>onChange</code></>, <>Add copywriting in conjunction with <code>tooltips</code> and <code>onChange</code>.</>), code: textCode, component: <TextDemo /> },
        { title: tr("อ่านอย่างเดียว", "Read Only"), description: tr(<><code>disabled</code> ทำให้แสดงผลอย่างเดียว คลิกเปลี่ยนค่าไม่ได้</>, <>Read only, cannot interact via <code>disabled</code>.</>), code: readOnlyCode, component: <ReadOnly /> },
        { title: tr("ล้างคะแนน", "Clear Star"), description: tr(<><code>allowClear</code> กำหนดว่าคลิกดาวเดิมซ้ำแล้วล้างคะแนนได้หรือไม่</>, <>Allow or disallow clearing the rating when clicking again via <code>allowClear</code>.</>), code: clearCode, component: <Clear /> },
        { title: tr("เปลี่ยนสัญลักษณ์", "Other Character"), description: tr(<>เปลี่ยนดาวเป็นตัวอักษร สัญลักษณ์ หรือไอคอนของเราเองก็ได้</>, <>Replace the default star with other characters like letters, symbols, or custom icons.</>), code: otherCharacterCode, component: <OtherCharacter /> },
        { title: tr("กำหนดสัญลักษณ์ด้วยฟังก์ชัน", "Custom Character Function"), description: tr(<>ส่งฟังก์ชัน <code>{"character={({ index }) => ...}"}</code> เพื่อ render สัญลักษณ์ต่างกันในแต่ละตำแหน่ง</>, <>Render characters dynamically using a function <code>{"character={({ index }) => ...}"}</code>.</>), code: customCharacterCode, component: <CustomCharacter /> },
      ]}
      api={[
        {
          title: "Rate",
          rows: [
            { property: "allowClear", description: "Whether to allow clear when click again", type: "boolean", default: "true" },
            { property: "allowHalf", description: "Whether to allow semi selection", type: "boolean", default: "false" },
            { property: "autoFocus", description: "If get focus when component mounted", type: "boolean", default: "false" },
            { property: "character", description: "The custom character of rate", type: "ReactNode | ((props: { index: number; value: number }) => ReactNode)", default: "<Star />" },
            { property: "count", description: "Star count", type: "number", default: "5" },
            { property: "defaultValue", description: "The default value", type: "number", default: "0" },
            { property: "disabled", description: "If read only, unable to interact", type: "boolean", default: "false" },
            { property: "tooltips", description: "Customize tooltip by each character", type: "string[]", default: "-" },
            { property: "value", description: "The current value (controlled)", type: "number", default: "-" },
            { property: "onChange", description: "Callback when select value", type: "(value: number) => void", default: "-" },
            { property: "onHoverChange", description: "Callback when hover item", type: "(value: number) => void", default: "-" },
            { property: "onKeyDown", description: "Callback when key down", type: "(event: React.KeyboardEvent) => void", default: "-" },
          ],
        },
      ]}
      related={[{ title: "Slider", path: "/components/slider" }, { title: "Switch", path: "/components/switch" }]}
    />
  );
}
