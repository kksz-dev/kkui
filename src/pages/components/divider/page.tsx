import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import WithText from "./demos/with-text";
import withTextCode from "./demos/with-text.tsx?raw";
import Plain from "./demos/plain";
import plainCode from "./demos/plain.tsx?raw";
import Vertical from "./demos/vertical";
import verticalCode from "./demos/vertical.tsx?raw";
import Size from "./demos/size";
import sizeCode from "./demos/size.tsx?raw";
import CustomizeStyle from "./demos/customize-style";
import customizeStyleCode from "./demos/customize-style.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="divider"
      imports={["Divider"]}
      whenToUse={tr(
        <ul>
          <li>คั่นส่วนต่าง ๆ ของบทความ</li>
          <li>คั่นข้อความและลิงก์ที่อยู่ในบรรทัดเดียวกัน เช่น คอลัมน์ปุ่มจัดการในตาราง</li>
        </ul>,
        <ul>
          <li>Divide sections of an article.</li>
          <li>Divide inline text and links such as the operation column of a table.</li>
        </ul>,
      )}
      demos={[
        { title: tr("แนวนอน", "Horizontal"), description: tr(<>Divider เป็นแนวนอน (<code>horizontal</code>) โดยปริยาย ใส่ข้อความไว้ข้างในได้ หรือเปลี่ยนเป็นเส้นประด้วย <code>dashed</code> / <code>variant="dotted"</code></>, <>Divider is <code>horizontal</code> by default. You can add text within Divider, or switch to <code>dashed</code> / <code>variant="dotted"</code>.</>), code: basicCode, component: <Basic /> },
        { title: tr("เส้นแบ่งพร้อมหัวข้อ", "Divider with title"), description: tr(<>เส้นแบ่งที่มี title ข้างใน ตั้ง <code>orientation="left|right"</code> (หรือชื่อพ้อง <code>"start"|"end"</code>) เพื่อจัดตำแหน่ง และ <code>orientationMargin</code> คุมระยะห่างจากขอบ</>, <>Divider with inner title, set <code>orientation="left|right"</code> (or the <code>"start"|"end"</code> aliases) to align it. <code>orientationMargin</code> controls the gap from the edge.</>), code: withTextCode, component: <WithText /> },
        { title: tr("ข้อความแบบไม่ใช่หัวข้อ", "Text without heading style"), description: tr(<>ใช้ <code>plain</code> เพื่อให้ title แสดงเป็นข้อความธรรมดา</>, <>Use <code>plain</code> to set the title as plain text.</>), code: plainCode, component: <Plain /> },
        { title: tr("แนวตั้ง", "Vertical"), description: tr(<>ใช้ <code>type="vertical"</code> เพื่อทำเส้นแบ่งแนวตั้งระหว่างองค์ประกอบในบรรทัดเดียวกัน</>, <>Use <code>type="vertical"</code> to make a vertical divider between inline elements.</>), code: verticalCode, component: <Vertical /> },
        { title: tr("ขนาด", "Size"), description: tr(<>ตั้ง <code>size</code> เพื่อเปลี่ยนระยะห่างแนวตั้ง: <code>sm</code> 8px, <code>md</code> 16px, <code>lg</code> 24px</>, <>Set <code>size</code> to change the vertical spacing: <code>sm</code> 8px, <code>md</code> 16px, <code>lg</code> 24px.</>), code: sizeCode, component: <Size /> },
        { title: tr("ปรับแต่งสไตล์", "Customize style"), description: tr(<>สีของเส้นตามคลาส <code>border-*</code> จึงใช้สีจาก token หรือชุดสีสำเร็จรูปตัวไหนก็ได้</>, <>The line color follows <code>border-*</code> classes, so any token or preset palette color works.</>), code: customizeStyleCode, component: <CustomizeStyle /> },
      ]}
      api={[
        {
          title: "Divider",
          rows: [
            { property: "children", description: tr("ข้อความหัวข้อที่อยู่ในเส้นแบ่ง", "The wrapped title"), type: "ReactNode", default: "-" },
            { property: "className", description: tr("className ของคอนเทนเนอร์", "The className of container"), type: "string", default: "-" },
            { property: "dashed", description: tr("เส้นประหรือไม่ (ชื่อย่อของ variant=\"dashed\")", "Whether line is dashed (shorthand for variant=\"dashed\")"), type: "boolean", default: "false" },
            { property: "variant", description: tr("รูปแบบของเส้น", "Line style"), type: "solid | dashed | dotted", default: "solid" },
            { property: "orientation", description: tr("ตำแหน่งของ title ในเส้นแบ่ง; `start` / `end` เป็นชื่อพ้องของ `left` / `right`", "The position of title inside divider; `start` / `end` are aliases of `left` / `right`"), type: "left | right | center | start | end", default: "center" },
            { property: "orientationMargin", description: tr("ระยะห่างระหว่าง title กับขอบที่ใกล้ที่สุด ใช้กับ left/start และ right/end เท่านั้น", "The margin between the title and its closest border; only for left/start and right/end"), type: "string | number", default: "-" },
            { property: "plain", description: tr("แสดง title เป็นข้อความธรรมดา", "Divider text show as plain style"), type: "boolean", default: "false" },
            { property: "size", description: tr("ระยะห่างแนวตั้งของเส้นแบ่งแนวนอน (8 / 16 / 24px)", "Vertical spacing of a horizontal divider (8 / 16 / 24px)"), type: "sm | md | lg", default: "md" },
            { property: "type", description: tr("ทิศทางของเส้นแบ่ง", "The direction type of divider"), type: "horizontal | vertical", default: "horizontal" },
          ],
        },
      ]}
      related={[{ title: "Space", path: "/components/space" }, { title: "Typography", path: "/components/typography" }]}
    />
  );
}
