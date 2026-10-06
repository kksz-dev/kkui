import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Color from "./demos/color";
import colorCode from "./demos/color.tsx?raw";
import PendingReverse from "./demos/pending-reverse";
import pendingReverseCode from "./demos/pending-reverse.tsx?raw";
import Alternate from "./demos/alternate";
import alternateCode from "./demos/alternate.tsx?raw";
import Custom from "./demos/custom";
import customCode from "./demos/custom.tsx?raw";
import Right from "./demos/right";
import rightCode from "./demos/right.tsx?raw";
import Label from "./demos/label";
import labelCode from "./demos/label.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="timeline"
      imports={["Timeline", "TimelineItem"]}
      whenToUse={tr(
        <>
          <p>
            แสดงลำดับเหตุการณ์ของกิจกรรมในแนวตั้ง เรียงตามเวลา
          </p>
          <ul>
            <li>เมื่อข้อมูลชุดหนึ่งต้องเรียงตามเวลา (จากเก่าไปใหม่หรือใหม่ไปเก่า)</li>
            <li>เมื่อต้องแสดง timestamp คู่กับสถานะงาน ประวัติการ release หรือ commit log</li>
            <li>เมื่อต้องแสดง audit trail หรือ log การทำงานหลายขั้นตอน</li>
          </ul>
        </>,
        <>
          <p>
            Vertical display timeline of an activity in chronological order.
          </p>
          <ul>
            <li>When a series of information needs to be ordered by time (ascending or descending).</li>
            <li>When you need to display timestamps alongside task status, release history or commit logs.</li>
            <li>When displaying audit trails or multi-step execution logs.</li>
          </ul>
        </>,
      )}
      demos={[
        { title: tr("พื้นฐาน", "Basic"), description: tr("Timeline พื้นฐาน", "Basic timeline."), code: basicCode, component: <Basic /> },
        { title: tr("สี", "Color"), description: tr(<>กำหนดสีของจุด <code>green</code> คือเสร็จแล้วหรือสำเร็จ <code>red</code> คือคำเตือนหรือข้อผิดพลาด ส่วน <code>blue</code> คือกำลังดำเนินการหรือสถานะเริ่มต้น</>, <>Set the color of circles. <code>green</code> means completed or success status, <code>red</code> means warning or error, and <code>blue</code> means ongoing or other default status.</>), code: colorCode, component: <Color /> },
        { title: tr("โหนดสุดท้ายและการกลับลำดับ", "Last node & Reversing"), description: tr(<>เมื่อตั้ง <code>pending</code> เป็น true หรือเป็น ReactNode โหนดสุดท้ายจะอยู่ในสถานะกำลังโหลดพร้อมเส้นประ ใส่ <code>reverse</code> เพื่อกลับลำดับการเรียง</>, <>When <code>pending</code> is set to true or a ReactNode, the last node is in a loading state with a dashed line. Set <code>reverse</code> to flip the sort order.</>), code: pendingReverseCode, component: <PendingReverse /> },
        { title: tr("สลับซ้ายขวา", "Alternate"), description: tr(<>Timeline แบบสลับซ้ายขวาด้วย <code>mode="alternate"</code></>, <>Alternate timeline with <code>mode="alternate"</code>.</>), code: alternateCode, component: <Alternate /> },
        { title: tr("กำหนดเอง", "Custom"), description: tr("กำหนดไอคอนของจุดบน timeline เอง", "Set a custom node icon for a timeline dot."), code: customCode, component: <Custom /> },
        { title: tr("ชิดขวา", "Right alternate"), description: tr(<>Timeline ชิดขวาด้วย <code>mode="right"</code></>, <>Right aligned timeline with <code>mode="right"</code>.</>), code: rightCode, component: <Right /> },
        { title: tr("ป้ายกำกับ", "Label"), description: tr("ใช้ label แสดง timestamp หรือสถานะไว้ฝั่งตรงข้ามกับเนื้อหา", "Use label to display timestamp or status opposite to the content."), code: labelCode, component: <Label /> },
      ]}
      api={[
        {
          title: "Timeline",
          description: "Timeline container component.",
          rows: [
            { property: "items", description: "Configure timeline items", type: "TimelineItemProps[]", default: "[]" },
            { property: "mode", description: "By sending alternate the timeline items will center and alternate between left and right", type: "left | alternate | right", default: "left" },
            { property: "pending", description: "Set the last ghost node's existence or its content", type: "boolean | ReactNode", default: "false" },
            { property: "pendingDot", description: "Set the dot of the last ghost node", type: "ReactNode", default: "<Loader2 />" },
            { property: "reverse", description: "Whether reverse nodes or not", type: "boolean", default: "false" },
          ],
        },
        {
          title: "TimelineItemProps",
          description: "Configuration object for each node in `items`.",
          rows: [
            { property: "children", description: "Item content", type: "ReactNode", default: "-" },
            { property: "className", description: "Custom class name for the item", type: "string", default: "-" },
            { property: "color", description: "Set the circle's color to blue, red, green, gray or other custom css color", type: "blue | red | green | gray | string", default: "blue" },
            { property: "dot", description: "Customize timeline dot", type: "ReactNode", default: "-" },
            { property: "label", description: "Set the label content", type: "ReactNode", default: "-" },
            { property: "position", description: "Customize node position", type: "left | right", default: "-" },
          ],
        },
      ]}
      related={[
        { title: "Steps", path: "/components/steps" },
        { title: "Badge", path: "/components/badge" },
      ]}
    />
  );
}
