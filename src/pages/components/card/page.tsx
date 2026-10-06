import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import NoBorder from "./demos/no-border";
import noBorderCode from "./demos/no-border.tsx?raw";
import Simple from "./demos/simple";
import simpleCode from "./demos/simple.tsx?raw";
import Flexible from "./demos/flexible-content";
import flexibleCode from "./demos/flexible-content.tsx?raw";
import Grid from "./demos/grid";
import gridCode from "./demos/grid.tsx?raw";
import Loading from "./demos/loading";
import loadingCode from "./demos/loading.tsx?raw";
import Inner from "./demos/inner";
import innerCode from "./demos/inner.tsx?raw";
import Meta from "./demos/meta";
import metaCode from "./demos/meta.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="card"
      imports={["Card", "CardGrid", "CardMeta"]}
      whenToUse={tr(
        <ul>
          <li>ใช้การ์ดเพื่อแสดงเนื้อหาที่เกี่ยวกับเรื่องเดียวกัน เนื้อหาอาจประกอบด้วยหลายองค์ประกอบต่างชนิดต่างขนาดได้</li>
        </ul>,
        <ul>
          <li>A card can be used to display content related to a single subject. The content can consist of multiple elements of varying types and sizes.</li>
        </ul>,
      )}
      demos={[
        { title: tr("การ์ดพื้นฐาน", "Basic card"), description: tr("การ์ดพื้นฐานที่มีหัวข้อ เนื้อหา และมุมขวาบนสำหรับของเพิ่มเติม", "A basic card containing a title, content and an extra corner content."), code: basicCode, component: <Basic /> },
        { title: tr("ไม่มีเส้นขอบ", "No border"), description: tr("การ์ดไม่มีเส้นขอบบนพื้นหลังสีเทา", "A borderless card on a gray background."), code: noBorderCode, component: <NoBorder /> },
        { title: tr("การ์ดอย่างง่าย", "Simple card"), description: tr("การ์ดที่มีแค่ส่วนเนื้อหา", "A simple card only containing a content area."), code: simpleCode, component: <Simple /> },
        { title: tr("ปรับแต่งเนื้อหา", "Customized content"), description: tr(<>ใช้ <code>cover</code> และ <code>CardMeta</code> ทำการ์ดรูปภาพ <code>hoverable</code> ยกการ์ดขึ้นเมื่อชี้</>, <>Use <code>cover</code> and <code>CardMeta</code> for image cards. <code>hoverable</code> lifts the card on hover.</>), code: flexibleCode, component: <Flexible /> },
        { title: tr("การ์ดแบบกริด", "Grid card"), description: tr(<>ใช้ <code>CardGrid</code> วางช่องย่อยในตัวการ์ด</>, <>Use <code>CardGrid</code> tiles inside a card body.</>), code: gridCode, component: <Grid /> },
        { title: tr("การ์ดกำลังโหลด", "Loading card"), description: tr(<>แสดง skeleton ระหว่างรอข้อมูลด้วย <code>loading</code></>, <>Show a skeleton while fetching data with <code>loading</code>.</>), code: loadingCode, component: <Loading /> },
        { title: tr("การ์ดซ้อน", "Inner card"), description: tr(<>ซ้อนการ์ดด้วย <code>type="inner"</code></>, <>Nest cards with <code>type="inner"</code>.</>), code: innerCode, component: <Inner /> },
        { title: tr("รวมทุกอย่าง", "Support more content configs"), description: tr(<>ปก การกระทำ และ meta ในการ์ดเดียว</>, <>Cover, actions and meta together.</>), code: metaCode, component: <Meta /> },
      ]}
      api={[
        {
          title: "Card",
          rows: [
            { property: "title", description: tr("หัวข้อการ์ด", "Card title"), type: "ReactNode", default: "-" },
            { property: "extra", description: tr("เนื้อหามุมขวาบน", "Content to render in the top-right corner"), type: "ReactNode", default: "-" },
            { property: "cover", description: tr("ปกการ์ด (รูป วิดีโอ...)", "Card cover (image, video...)"), type: "ReactNode", default: "-" },
            { property: "actions", description: tr("รายการการกระทำด้านล่าง", "Action list rendered at the bottom"), type: "ReactNode[]", default: "-" },
            { property: "bordered", description: tr("เปิด/ปิดเส้นขอบ", "Toggle border"), type: "boolean", default: "true" },
            { property: "hoverable", description: tr("ยกขึ้นเมื่อชี้", "Lift up when hovering"), type: "boolean", default: "false" },
            { property: "loading", description: tr("แสดง skeleton", "Show skeleton placeholder"), type: "boolean", default: "false" },
            { property: "size", description: tr("ขนาดการ์ด", "Card size"), type: "default | small", default: "default" },
            { property: "type", description: tr("สไตล์การ์ดซ้อน (หัวสีเทา)", "Inner style (grey head)"), type: "inner", default: "-" },
            { property: "classNames", description: tr("ทับคลาสตามส่วน", "Semantic class overrides"), type: "{ head?, body?, actions?, cover? }", default: "-" },
          ],
        },
        {
          title: "CardGrid",
          rows: [
            { property: "hoverable", description: tr("ยกขึ้นเมื่อชี้", "Lift up when hovering"), type: "boolean", default: "true" },
            { property: "className", description: tr("ความกว้าง ฯลฯ (ค่าเริ่มต้น w-1/3)", "Width etc. (default w-1/3)"), type: "string", default: "-" },
          ],
        },
        {
          title: "CardMeta",
          rows: [
            { property: "avatar", description: tr("อวาตาร์หรือไอคอน", "Avatar or icon"), type: "ReactNode", default: "-" },
            { property: "title", description: tr("หัวข้อ", "Title"), type: "ReactNode", default: "-" },
            { property: "description", description: tr("คำอธิบาย", "Description"), type: "ReactNode", default: "-" },
          ],
        },
      ]}
    />
  );
}
