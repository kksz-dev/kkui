import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Complex from "./demos/complex";
import complexCode from "./demos/complex.tsx?raw";
import Active from "./demos/active";
import activeCode from "./demos/active.tsx?raw";
import ElementDemo from "./demos/element";
import elementCode from "./demos/element.tsx?raw";
import ChildrenDemo from "./demos/children";
import childrenCode from "./demos/children.tsx?raw";
import ListDemo from "./demos/list";
import listCode from "./demos/list.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="skeleton"
      imports={[
        "Skeleton",
        "SkeletonAvatar",
        "SkeletonButton",
        "SkeletonInput",
        "SkeletonImage",
        "SkeletonNode",
      ]}
      whenToUse={tr(
        <>
          <p>
            Skeleton ใช้แสดง placeholder แทนเนื้อหาระหว่างรอข้อมูลโหลด
            หรือใช้จำลองโครงของเนื้อหาที่ยังไม่มีจริง
          </p>
          <p className="mt-2">
            เหมาะกว่าสปินเนอร์ทั่วไปเมื่อต้องโหลดรายการที่ซับซ้อน การ์ด หรือหน้าโปรไฟล์ที่มีหลายส่วน
          </p>
        </>,
        <>
          <p>
            Skeleton is used to provide a placeholder preview while you wait for content to load,
            or to visualize content that does not exist yet.
          </p>
          <p className="mt-2">
            It is preferred over a generic spinner when loading complex lists, card containers, or detailed profile layouts.
          </p>
        </>,
      )}
      demos={[
        {
          title: tr("พื้นฐาน", "Basic"),
          description: tr(<>โครงพื้นฐานที่สุด มี placeholder ของหัวข้อและย่อหน้า</>, <>Simplest skeleton with title and paragraph placeholders.</>),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("ผสมหลายส่วน", "Complex Combination"),
          description: tr(<>Skeleton ที่มี avatar และย่อหน้าหลายบรรทัด</>, <>Skeleton with avatar and multi-row paragraph.</>),
          code: complexCode,
          component: <Complex />,
        },
        {
          title: tr("แอนิเมชัน", "Active Animation"),
          description: tr(<>ใส่ <code>active</code> เพื่อแสดงแถบไล่สีวิ่งแบบ shimmer</>, <>Add <code>active</code> to display animated shimmer gradient effect.</>),
          code: activeCode,
          component: <Active />,
        },
        {
          title: tr("อิลิเมนต์ย่อย", "Element"),
          description: tr(<>placeholder แยกชิ้น: Button, Avatar, Input, Image และ Node</>, <>Modular placeholder elements: Button, Avatar, Input, Image, and Node.</>),
          code: elementCode,
          component: <ElementDemo />,
        },
        {
          title: tr("ครอบคอมโพเนนต์จริง", "Contains Sub Component"),
          description: tr(<>ครอบคอมโพเนนต์จริงไว้ใน Skeleton แล้วสลับสถานะ <code>loading</code></>, <>Wrap real components inside Skeleton and toggle <code>loading</code> state.</>),
          code: childrenCode,
          component: <ChildrenDemo />,
        },
        {
          title: tr("โหลดรายการ", "List Loading"),
          description: tr(<>จำลองการโหลดรายการด้วย skeleton หลายชิ้น</>, <>Simulate list loading with multiple skeleton items.</>),
          code: listCode,
          component: <ListDemo />,
          full: true,
        },
      ]}
      api={[
        {
          title: "Skeleton",
          rows: [
            { property: "active", description: "Show shimmer animation", type: "boolean", default: "false" },
            { property: "avatar", description: "Show avatar placeholder or avatar configuration", type: "boolean | SkeletonAvatarProps", default: "false" },
            { property: "loading", description: "Display children when false", type: "boolean", default: "true" },
            { property: "paragraph", description: "Show paragraph placeholder or configuration", type: "boolean | SkeletonParagraphProps", default: "true" },
            { property: "round", description: "Show paragraph and title with rounded radius", type: "boolean", default: "false" },
            { property: "title", description: "Show title placeholder or configuration", type: "boolean | SkeletonTitleProps", default: "true" },
          ],
        },
        {
          title: "Skeleton.Button",
          rows: [
            { property: "active", description: "Show shimmer animation", type: "boolean", default: "false" },
            { property: "block", description: "Fit width of parent", type: "boolean", default: "false" },
            { property: "shape", description: "Shape of button", type: "'circle' | 'round' | 'square' | 'default'", default: "'default'" },
            { property: "size", description: "Size of button", type: "'small' | 'default' | 'large'", default: "'default'" },
          ],
        },
        {
          title: "Skeleton.Avatar",
          rows: [
            { property: "active", description: "Show shimmer animation", type: "boolean", default: "false" },
            { property: "shape", description: "Shape of avatar", type: "'circle' | 'square'", default: "'circle'" },
            { property: "size", description: "Size of avatar", type: "'small' | 'default' | 'large' | number", default: "'default'" },
          ],
        },
        {
          title: "Skeleton.Input",
          rows: [
            { property: "active", description: "Show shimmer animation", type: "boolean", default: "false" },
            { property: "block", description: "Fit width of parent", type: "boolean", default: "false" },
            { property: "size", description: "Size of input", type: "'small' | 'default' | 'large'", default: "'default'" },
          ],
        },
        {
          title: "Skeleton.Image",
          rows: [
            { property: "active", description: "Show shimmer animation", type: "boolean", default: "false" },
          ],
        },
        {
          title: "Skeleton.Node",
          rows: [
            { property: "active", description: "Show shimmer animation", type: "boolean", default: "false" },
          ],
        },
      ]}
      related={[
        { title: "Spin", path: "/components/spin" },
        { title: "Progress", path: "/components/progress" },
      ]}
    />
  );
}
