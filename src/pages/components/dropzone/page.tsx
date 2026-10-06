import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import UploadProgress from "./demos/upload-progress";
import uploadProgressCode from "./demos/upload-progress.tsx?raw";
import Restrictions from "./demos/restrictions";
import restrictionsCode from "./demos/restrictions.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="dropzone"
      imports={["Dropzone", "type DropzoneFile", "type DropzoneProps"]}
      whenToUse={tr(
        <>
          <p>Dropzone คือพื้นที่ลากวางสำเร็จรูปของ KKUI: กรอบเส้นประขนาดใหญ่ พร้อมคิวไฟล์ที่มีภาพย่อ ขนาดไฟล์ และแถบความคืบหน้าในตัว</p>
          <ul>
            <li>ใช้เมื่ออยากได้หน้าตาลากวางแบบสำเร็จรูป ไม่ต้องประกอบเอง</li>
            <li>ถ้าต้องการชั้นส่งข้อมูลเต็มรูปแบบ (action, headers, customRequest, listType หลายแบบ) ให้ใช้ <code>Upload</code> แทน</li>
            <li>ตรวจชนิดไฟล์ด้วย <code>accept</code> และขนาดด้วย <code>maxSizeMB</code> ไฟล์ที่ใหญ่เกินจะขึ้นสถานะ <code>error</code> ค้างไว้ให้เห็น</li>
          </ul>
        </>,
        <>
          <p>Dropzone is the batteries-included drop area: one large dashed panel plus a file queue with thumbnails, sizes and progress bars.</p>
          <ul>
            <li>Reach for it when you want a ready-made drag and drop surface instead of assembling one.</li>
            <li>Use <code>Upload</code> instead when you need the full transport layer (action, headers, customRequest, several list types).</li>
            <li><code>accept</code> filters types and <code>maxSizeMB</code> caps the size; oversized files stay in the queue with an <code>error</code> status.</li>
          </ul>
        </>,
      )}
      demos={[
        {
          title: tr("พื้นฐาน", "Basic"),
          description: tr(
            <>ลากไฟล์มาวางหรือคลิกเพื่อเลือก ไฟล์จะเข้าคิวรอ (สถานะ <code>done</code>) เพราะยังไม่ได้ต่อ <code>onUpload</code></>,
            <>Drop files or click to pick them. Without <code>onUpload</code> files are only staged, so they land as <code>done</code>.</>,
          ),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("ความคืบหน้าการอัปโหลด", "Upload Progress"),
          description: tr(
            <><code>onUpload</code> คือชั้นส่งข้อมูล คืน Promise และรายงานเปอร์เซ็นต์ผ่าน <code>onProgress</code> เดโมนี้จำลองด้วยตัวจับเวลา ไม่ได้ยิงเครือข่ายจริง</>,
            <><code>onUpload</code> is the transport: return a promise and report percentages through <code>onProgress</code>. This demo fakes it on a timer, no network request is made.</>,
          ),
          code: uploadProgressCode,
          component: <UploadProgress />,
        },
        {
          title: tr("ข้อจำกัดและปิดใช้งาน", "Restrictions"),
          description: tr(
            <>จำกัดเป็น PNG ไฟล์เดียวไม่เกิน 1MB ไฟล์ที่ใหญ่เกินจะแสดงสถานะผิดพลาด ส่วนอันล่างถูก <code>disabled</code></>,
            <>One PNG up to 1MB: anything larger is queued with an error. The second one is <code>disabled</code>.</>,
          ),
          code: restrictionsCode,
          component: <Restrictions />,
        },
      ]}
      api={[
        {
          title: "Dropzone",
          description: tr("ขยายจาก React.ComponentProps<\"div\"> (ยกเว้น onChange)", "Extends React.ComponentProps<\"div\"> (except onChange)."),
          rows: [
            { property: "accept", description: tr("ชนิดไฟล์ที่รับ ใช้ทั้งกับ input และไฟล์ที่ลากมาวาง", "Accepted types, applied to the input and to dropped files"), type: "string", default: "-" },
            { property: "maxFiles", description: tr("จำนวนไฟล์สูงสุดในคิว", "Maximum number of files in the queue"), type: "number", default: "5" },
            { property: "maxSizeMB", description: tr("ขนาดสูงสุดต่อไฟล์ ไฟล์ที่เกินจะได้สถานะ error", "Max size per file; anything larger is queued as error"), type: "number", default: "10" },
            { property: "multiple", description: tr("รับหลายไฟล์ต่อครั้ง", "Accept several files at a time"), type: "boolean", default: "true" },
            { property: "disabled", description: tr("ปิดทั้งการคลิกและการลากวาง", "Block clicking and dropping"), type: "boolean", default: "false" },
            { property: "onFilesChange", description: tr("เรียกทุกครั้งที่คิวเปลี่ยน ทั้งเพิ่ม คืบหน้า และลบ", "Fires whenever the queue changes: add, progress, remove"), type: "(files: DropzoneFile[]) => void", default: "-" },
            { property: "onUpload", description: tr("ชั้นส่งข้อมูล ถ้าไม่ใส่ไฟล์จะเข้าคิวเป็น done ทันที", "The transport; without it files are staged as done immediately"), type: "(file: File, onProgress: (percent: number) => void) => Promise<void>", default: "-" },
            { property: "onDrop", description: tr("อีเวนต์ drop ดิบ ก่อนไฟล์จะเข้าคิว", "The raw drop event, before files are queued"), type: "(event: React.DragEvent) => void", default: "-" },
            { property: "className", description: tr("คลาสเพิ่มเติมบนพื้นที่ลากวาง", "Extra classes on the drop area"), type: "string", default: "-" },
          ],
        },
        {
          title: "DropzoneFile",
          description: tr("รูปร่างของแต่ละไฟล์ในคิว (ใช้คำเดียวกับ UploadFile)", "Shape of every queued file, using the same vocabulary as UploadFile"),
          rows: [
            { property: "id", description: tr("คีย์ประจำไฟล์", "Unique key of the file"), type: "string", default: "auto" },
            { property: "file", description: tr("File ต้นฉบับ", "The original File"), type: "File", default: "-" },
            { property: "name / size", description: tr("ชื่อและขนาดเป็นไบต์", "Name and size in bytes"), type: "string / number", default: "-" },
            { property: "percent", description: tr("ความคืบหน้า 0-100 มาจาก onProgress", "Progress 0-100, driven by onProgress"), type: "number", default: "0" },
            { property: "status", description: tr("สถานะไฟล์", "File status"), type: "uploading | done | error", default: "-" },
            { property: "previewUrl", description: tr("objectURL ของไฟล์รูป", "objectURL of an image file"), type: "string", default: "-" },
            { property: "error", description: tr("ข้อความผิดพลาด เช่น ไฟล์ใหญ่เกิน", "Error message, e.g. the size cap"), type: "string", default: "-" },
          ],
        },
      ]}
      related={[
        { title: "Upload", path: "/components/upload" },
        { title: "Progress", path: "/components/progress" },
      ]}
    />
  );
}
