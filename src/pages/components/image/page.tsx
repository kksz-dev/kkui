import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Fallback from "./demos/fallback";
import fallbackCode from "./demos/fallback.tsx?raw";
import Placeholder from "./demos/placeholder";
import placeholderCode from "./demos/placeholder.tsx?raw";
import PreviewGroup from "./demos/preview-group";
import previewGroupCode from "./demos/preview-group.tsx?raw";
import PreviewGroupItems from "./demos/preview-group-items";
import previewGroupItemsCode from "./demos/preview-group-items.tsx?raw";
import Controlled from "./demos/controlled";
import controlledCode from "./demos/controlled.tsx?raw";
import CustomToolbar from "./demos/custom-toolbar";
import customToolbarCode from "./demos/custom-toolbar.tsx?raw";
import CustomMask from "./demos/custom-mask";
import customMaskCode from "./demos/custom-mask.tsx?raw";
import NoPreview from "./demos/no-preview";
import noPreviewCode from "./demos/no-preview.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="image"
      imports={["Image", "ImagePreviewGroup", "type ImageProps", "type ImagePreviewConfig"]}
      whenToUse={tr(
        <>
          <p>
            เมื่อต้องแสดงรูปภาพและให้ผู้ใช้คลิกเพื่อขยายดูรายละเอียด
          </p>
          <ul>
            <li>รองรับ preview เต็มจอ ซูมเข้า/ออก หมุน 90° และพลิกแนวนอน/แนวตั้ง</li>
            <li>ลากเลื่อนรูปด้วยเมาส์เมื่อซูมอยู่ และซูมด้วยล้อเมาส์</li>
            <li>preview เป็นกลุ่มหลายรูป เลื่อนด้วยปุ่มลูกศรซ้าย/ขวา และมีตัวนับรูป</li>
            <li>โหลดไม่สำเร็จก็ตกไปที่รูป fallback ระหว่างโหลดมี placeholder คั่น</li>
          </ul>
        </>,
        <>
          <p>
            When you need to display pictures and allow users to click to enlarge and inspect them.
          </p>
          <ul>
            <li>Supports full-screen preview with zoom in/out, rotate 90°, and horizontal/vertical flipping.</li>
            <li>Supports mouse drag panning when zoomed and mouse wheel zooming.</li>
            <li>Group preview with multiple images, keyboard navigation (left/right arrows), and image counters.</li>
            <li>Graceful degradation with fallback image on load error and placeholder loading states.</li>
          </ul>
        </>,
      )}
      demos={[
        {
          title: tr("การใช้งานพื้นฐาน", "Basic Usage"),
          description: tr("คลิกที่รูปเพื่อเปิด preview เต็มจอพร้อมเครื่องมือครบชุด", "Click the image to open the full-featured preview overlay."),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("เมื่อโหลดรูปไม่สำเร็จ", "Fault Tolerance"),
          description: tr(<>แสดงรูป <code>fallback</code> เมื่อโหลด <code>src</code> ต้นฉบับไม่สำเร็จ</>, <>Display a <code>fallback</code> image when loading the original <code>src</code> fails.</>),
          code: fallbackCode,
          component: <Fallback />,
        },
        {
          title: tr("โหลดแบบค่อยเป็นค่อยไป", "Progressive Loading"),
          description: tr(<>แสดง skeleton จาก <code>placeholder</code> ระหว่างที่รูปกำลังโหลด</>, <>Show a <code>placeholder</code> skeleton while the image is loading.</>),
          code: placeholderCode,
          component: <Placeholder />,
        },
        {
          title: tr("กลุ่ม preview", "Preview Group"),
          description: tr(<>ครอบ <code>Image</code> หลายตัวด้วย <code>ImagePreviewGroup</code> เพื่อสลับดูเป็นแกลเลอรีเดียวกัน เลื่อนด้วย keyboard ได้</>, <>Wrap multiple <code>Image</code> components in <code>ImagePreviewGroup</code> for integrated gallery switching with keyboard navigation.</>),
          code: previewGroupCode,
          component: <PreviewGroup />,
        },
        {
          title: tr("กลุ่ม preview จาก items", "Preview Group with items"),
          description: tr(<>เปิดแกลเลอรีจากโค้ดโดยส่ง URL รูปเป็นอาร์เรย์ <code>items</code></>, <>Open an image gallery programmatically from an <code>items</code> array of image URLs.</>),
          code: previewGroupItemsCode,
          component: <PreviewGroupItems />,
        },
        {
          title: tr("คุม preview จากภายนอก", "Controlled Preview"),
          description: tr(<>สั่งเปิด/ปิดกล่อง preview จากปุ่มภายนอกด้วย <code>preview.visible</code></>, <>Control the preview dialog visibility from an external button using <code>preview.visible</code>.</>),
          code: controlledCode,
          component: <Controlled />,
        },
        {
          title: tr("toolbar แบบกำหนดเอง", "Custom Toolbar"),
          description: tr(<>ปรับปุ่มบน toolbar ด้านล่างด้วย <code>preview.toolbarRender</code> (เช่น เพิ่มปุ่ม Download)</>, <>Customize the bottom toolbar actions with <code>preview.toolbarRender</code> (e.g. adding a Download button).</>),
          code: customToolbarCode,
          component: <CustomToolbar />,
        },
        {
          title: tr("mask แบบกำหนดเอง", "Custom Mask"),
          description: tr(<>เปลี่ยนไอคอนและข้อความของ mask ตอน hover ด้วย <code>preview.mask</code></>, <>Customize the hover mask icon and text with <code>preview.mask</code>.</>),
          code: customMaskCode,
          component: <CustomMask />,
        },
        {
          title: tr("ปิด preview", "Disabled Preview"),
          description: tr(<>ตั้ง <code>preview={false}</code> เพื่อแสดงเป็นรูปนิ่งที่คลิกดูไม่ได้</>, <>Set <code>preview={false}</code> to render a static image without click preview.</>),
          code: noPreviewCode,
          component: <NoPreview />,
        },
      ]}
      api={[
        {
          title: "Image",
          rows: [
            { property: "src", description: "Image path", type: "string", default: "-" },
            { property: "alt", description: "Image description", type: "string", default: "-" },
            { property: "width", description: "Image width", type: "string | number", default: "-" },
            { property: "height", description: "Image height", type: "string | number", default: "-" },
            { property: "fallback", description: "Load failure fault-tolerant src", type: "string", default: "-" },
            { property: "placeholder", description: "Placeholder display while loading", type: "boolean | ReactNode", default: "-" },
            { property: "preview", description: "Preview configuration or boolean to toggle preview", type: "boolean | ImagePreviewConfig", default: "true" },
            { property: "rootClassName", description: "Class name on the wrapper div", type: "string", default: "-" },
            { property: "className", description: "Class name on the img element", type: "string", default: "-" },
            { property: "onError", description: "Callback when image load fails", type: "(e: Event) => void", default: "-" },
            { property: "onLoad", description: "Callback when image loads successfully", type: "(e: Event) => void", default: "-" },
          ],
        },
        {
          title: "ImagePreviewConfig",
          rows: [
            { property: "visible", description: "Whether the preview dialog is visible", type: "boolean", default: "false" },
            { property: "onVisibleChange", description: "Callback executed when visibility changes", type: "(visible: boolean, prevVisible: boolean) => void", default: "-" },
            { property: "src", description: "Custom preview image url", type: "string", default: "-" },
            { property: "mask", description: "Custom hover mask node", type: "ReactNode", default: "Preview" },
            { property: "scaleStep", description: "The scale step on zoom", type: "number", default: "0.5" },
            { property: "minScale", description: "Min scale", type: "number", default: "1" },
            { property: "maxScale", description: "Max scale", type: "number", default: "50" },
            { property: "movable", description: "Whether the image is draggable when zoomed", type: "boolean", default: "true" },
            { property: "toolbarRender", description: "Custom toolbar render function", type: "(originalNode, info) => ReactNode", default: "-" },
            { property: "countRender", description: "Custom count display in header", type: "(current: number, total: number) => ReactNode", default: "-" },
          ],
        },
        {
          title: "ImagePreviewGroup",
          rows: [
            { property: "items", description: "Array of image URLs or item objects", type: "(string | PreviewGroupItem)[]", default: "-" },
            { property: "preview", description: "Preview configuration for the group", type: "boolean | ImagePreviewConfig & { current, onChange }", default: "true" },
            { property: "children", description: "Images rendered inside the group", type: "ReactNode", default: "-" },
          ],
        },
      ]}
      related={[
        { title: "Avatar", path: "/components/avatar" },
        { title: "Carousel", path: "/components/carousel" },
      ]}
    />
  );
}
