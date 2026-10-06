import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Type from "./demos/type";
import typeCode from "./demos/type.tsx?raw";
import AutoSize from "./demos/auto-size";
import autoSizeCode from "./demos/auto-size.tsx?raw";
import BadgeDemo from "./demos/badge";
import badgeCode from "./demos/badge.tsx?raw";
import GroupDemo from "./demos/group";
import groupCode from "./demos/group.tsx?raw";
import ResponsiveDemo from "./demos/responsive";
import responsiveCode from "./demos/responsive.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="avatar"
      imports={["Avatar", "AvatarGroup"]}
      whenToUse={tr(
        <>
          <p>
            Avatar ใช้แทนบุคคลหรือวัตถุ รองรับรูปภาพ ไอคอน หรือตัวอักษร
          </p>
          <p className="mt-2">
            แสดงได้ทั้งรูปวงกลมและสี่เหลี่ยม พร้อมขนาด preset หรือขนาดที่กำหนดเอง
          </p>
        </>,
        <>
          <p>
            Avatars can be used to represent people or objects. It supports images,
            icons, or letters.
          </p>
          <p className="mt-2">
            Avatars can be displayed in circle or square shapes, and in various preset sizes or custom dimensions.
          </p>
        </>,
      )}
      demos={[
        {
          title: tr("พื้นฐาน", "Basic"),
          description: tr(<>มีให้เลือก 3 ขนาดและ 2 รูปทรง</>, <>Three sizes and two shapes are available.</>),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("ชนิด", "Type"),
          description: tr(<>รองรับ Avatar แบบรูปภาพ ไอคอน และตัวอักษร โดยปรับสีพื้นหลังของแบบตัวอักษรได้</>, <>Image, Icon, and letter avatars are supported. Letter avatar background color can be customized.</>),
          code: typeCode,
          component: <Type />,
        },
        {
          title: tr("ปรับขนาดตัวอักษรอัตโนมัติ", "Autoset Font Size"),
          description: tr(<>Avatar แบบตัวอักษรจะลด font-size อัตโนมัติตามความกว้างของ container</>, <>For letter avatars, font-size scales down automatically according to container width.</>),
          code: autoSizeCode,
          component: <AutoSize />,
        },
        {
          title: tr("ใช้ร่วมกับ Badge", "With Badge"),
          description: tr(<>ใช้คู่กับ Badge ในงานแจ้งเตือนหรือข้อความ</>, <>Usually used in notification or message scenarios combined with Badge.</>),
          code: badgeCode,
          component: <BadgeDemo />,
        },
        {
          title: tr("กลุ่ม Avatar", "Avatar.Group"),
          description: tr(<>แสดง Avatar เป็นกลุ่ม กำหนดจำนวนสูงสุดและแสดงรายการที่เกินใน popover ได้</>, <>Avatar group display with max count and popover overflow support.</>),
          code: groupCode,
          component: <GroupDemo />,
        },
        {
          title: tr("ขนาดแบบ Responsive", "Responsive Size"),
          description: tr(<>กำหนดขนาด Avatar ตาม breakpoint ของหน้าจอได้</>, <>Avatar size can be configured responsively based on screen breakpoints.</>),
          code: responsiveCode,
          component: <ResponsiveDemo />,
        },
      ]}
      api={[
        {
          title: "Avatar",
          rows: [
            { property: "alt", description: "Alternative text of image", type: "string", default: "-" },
            { property: "crossOrigin", description: "CORS settings for image", type: "'anonymous' | 'use-credentials' | ''", default: "-" },
            { property: "draggable", description: "Whether the image is draggable", type: "boolean | 'true' | 'false'", default: "-" },
            { property: "gap", description: "Letter avatar pixel distance to boundary", type: "number", default: "4" },
            { property: "icon", description: "Custom icon element", type: "ReactNode", default: "-" },
            { property: "onError", description: "Handler when image fails to load; return false to show fallback", type: "() => boolean", default: "-" },
            { property: "shape", description: "Shape of avatar", type: "'circle' | 'square'", default: "'circle'" },
            { property: "size", description: "Size of avatar (preset, number or responsive object)", type: "number | 'sm' | 'md' | 'lg' | object", default: "'md'" },
            { property: "src", description: "Address of image or custom image element", type: "string | ReactNode", default: "-" },
            { property: "srcSet", description: "Source set list of image", type: "string", default: "-" },
          ],
        },
        {
          title: "AvatarGroup",
          rows: [
            { property: "max", description: "Config options for max count and excess avatar popover", type: "{ count?: number; style?: CSSProperties; className?: string; popover?: object }", default: "-" },
            { property: "maxCount", description: "Max avatars to show (shorthand for max.count)", type: "number", default: "-" },
            { property: "maxStyle", description: "Style of excess counter avatar", type: "CSSProperties", default: "-" },
            { property: "shape", description: "Shape of all avatars in group", type: "'circle' | 'square'", default: "'circle'" },
            { property: "size", description: "Size of all avatars in group", type: "number | 'sm' | 'md' | 'lg' | object", default: "'md'" },
          ],
        },
      ]}
      related={[
        { title: "Badge", path: "/components/badge" },
        { title: "Tag", path: "/components/tag" },
      ]}
    />
  );
}
