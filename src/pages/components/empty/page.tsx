import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Simple from "./demos/simple";
import simpleCode from "./demos/simple.tsx?raw";
import Customize from "./demos/customize";
import customizeCode from "./demos/customize.tsx?raw";
import NoDescription from "./demos/no-description";
import noDescriptionCode from "./demos/no-description.tsx?raw";
import ConfigDemo from "./demos/config";
import configCode from "./demos/config.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="empty"
      imports={["Empty", "EMPTY_IMAGE_DEFAULT", "EMPTY_IMAGE_SIMPLE"]}
      whenToUse={tr(
        <>
          <p>เมื่อไม่มีข้อมูลให้แสดง ใช้สถานะ Empty เพื่อบอกผู้ใช้ว่าควรทำอะไรต่อ</p>
          <p className="mt-2">
            ใช้กับตาราง รายการ หรือเมนู select ที่ยังไม่มีข้อมูล และผลการค้นหาที่ไม่ตรงสักรายการ
          </p>
        </>,
        <>
          <p>When there is no data to display, use Empty state to guide the user.</p>
          <p className="mt-2">
            Use when initializing a table, list, select menu, or search query result where 0 items match.
          </p>
        </>,
      )}
      demos={[
        {
          title: tr("การใช้งานพื้นฐาน", "Basic Usage"),
          description: tr(<>ใช้งานแบบง่ายที่สุด พร้อมรูปและข้อความเริ่มต้น</>, <>Simplest usage with default image and description.</>),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("เลือกรูป", "Choose Image"),
          description: tr(<>เปลี่ยนสไตล์รูปได้โดยตั้ง <code>image={'{Empty.PRESENTED_IMAGE_SIMPLE}'}</code></>, <>You can choose another style of image by setting <code>image={'{Empty.PRESENTED_IMAGE_SIMPLE}'}</code>.</>),
          code: simpleCode,
          component: <Simple />,
        },
        {
          title: tr("ปรับแต่งเอง", "Customize"),
          description: tr(<>กำหนดรูป ข้อความ และปุ่มการกระทำเองได้</>, <>Customize image, description and action buttons.</>),
          code: customizeCode,
          component: <Customize />,
        },
        {
          title: tr("ไม่แสดงข้อความ", "No Description"),
          description: tr(<>ตั้ง <code>description={'{false}'}</code> เพื่อซ่อนข้อความใต้รูป</>, <>Set <code>description={'{false}'}</code> to hide the description text.</>),
          code: noDescriptionCode,
          component: <NoDescription />,
        },
        {
          title: tr("อยู่ในคอนเทนเนอร์", "In Container"),
          description: tr(<>วางสถานะ Empty ไว้ใน card หรือ container</>, <>Empty state placed inside a card or container view.</>),
          code: configCode,
          component: <ConfigDemo />,
          full: true,
        },
      ]}
      api={[
        {
          title: "Empty",
          rows: [
            { property: "description", description: "Customize description text, or set false to hide", type: "ReactNode | false", default: "'No data'" },
            { property: "image", description: "Customize image node or image URL", type: "ReactNode | string", default: "EMPTY_IMAGE_DEFAULT" },
            { property: "imageStyle", description: "The style of image container", type: "CSSProperties", default: "-" },
            { property: "classNames", description: "Custom class names for inner elements", type: "{ root?: string; image?: string; description?: string; footer?: string }", default: "-" },
            { property: "styles", description: "Custom inline styles for inner elements", type: "{ root?: CSSProperties; image?: CSSProperties; description?: CSSProperties; footer?: CSSProperties }", default: "-" },
          ],
        },
      ]}
      related={[
        { title: "Result", path: "/components/result" },
        { title: "Card", path: "/components/card" },
      ]}
    />
  );
}
