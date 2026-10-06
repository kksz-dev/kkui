import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Avatar from "./demos/avatar";
import avatarCode from "./demos/avatar.tsx?raw";
import PictureCard from "./demos/picture-card";
import pictureCardCode from "./demos/picture-card.tsx?raw";
import PictureCircle from "./demos/picture-circle";
import pictureCircleCode from "./demos/picture-circle.tsx?raw";
import PictureStyle from "./demos/picture-style";
import pictureStyleCode from "./demos/picture-style.tsx?raw";
import DefaultFileList from "./demos/default-file-list";
import defaultFileListCode from "./demos/default-file-list.tsx?raw";
import ControlledFileList from "./demos/controlled-file-list";
import controlledFileListCode from "./demos/controlled-file-list.tsx?raw";
import UploadManually from "./demos/upload-manually";
import uploadManuallyCode from "./demos/upload-manually.tsx?raw";
import Drag from "./demos/drag";
import dragCode from "./demos/drag.tsx?raw";
import Directory from "./demos/directory";
import directoryCode from "./demos/directory.tsx?raw";
import MaxCount from "./demos/max-count";
import maxCountCode from "./demos/max-count.tsx?raw";
import CustomRequest from "./demos/custom-request";
import customRequestCode from "./demos/custom-request.tsx?raw";
import TransformFile from "./demos/transform-file";
import transformFileCode from "./demos/transform-file.tsx?raw";
import PreviewFile from "./demos/preview-file";
import previewFileCode from "./demos/preview-file.tsx?raw";
import ProgressBar from "./demos/progress-bar";
import progressBarCode from "./demos/progress-bar.tsx?raw";
import ItemRender from "./demos/item-render";
import itemRenderCode from "./demos/item-render.tsx?raw";
import PngOnly from "./demos/png-only";
import pngOnlyCode from "./demos/png-only.tsx?raw";
import Disabled from "./demos/disabled";
import disabledCode from "./demos/disabled.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="upload"
      imports={["Upload", "type UploadProps", "type UploadFile", "type UploadRequestOption"]}
      whenToUse={tr(
        <>
          <p>ใช้เมื่อต้องอัปโหลดไฟล์ไปเก็บบนเซิร์ฟเวอร์ ทั้งแบบเลือกจากเครื่อง ลากวาง หรือเลือกทั้งโฟลเดอร์</p>
          <ul>
            <li>อัปโหลดจริงผ่าน XHR ในตัว: กำหนด <code>action</code> แล้วส่วนที่เหลือ (<code>method</code>, <code>headers</code>, <code>data</code>, <code>name</code>, <code>withCredentials</code>) จะถูกประกอบเป็น multipart ให้อัตโนมัติ พร้อมรายงานความคืบหน้าต่อไฟล์</li>
            <li>ถ้าใช้ SDK ของ S3/OSS หรือ fetch เอง ให้แทนที่ทั้งชั้นด้วย <code>customRequest</code></li>
            <li><code>beforeUpload</code> ใช้ตรวจไฟล์ก่อนส่ง คืน <code>false</code> เพื่อค้างไว้ในรายการโดยไม่อัปโหลด คืนไฟล์ใหม่เพื่อแปลงก่อนส่ง หรือคืน <code>Upload.LIST_IGNORE</code> เพื่อทิ้งไฟล์นั้นไปเลย</li>
            <li>ลบไฟล์ระหว่างอัปโหลดจะ <code>abort()</code> คำขอนั้นให้เอง</li>
          </ul>
        </>,
        <>
          <p>Use it to send files to a server, whether picked from disk, dropped on the page, or taken from a whole folder.</p>
          <ul>
            <li>The built-in XHR transport does real uploads: set <code>action</code> and the rest (<code>method</code>, <code>headers</code>, <code>data</code>, <code>name</code>, <code>withCredentials</code>) is assembled into a multipart request that reports per-file progress.</li>
            <li>Replace the whole transport with <code>customRequest</code> when you upload through an S3/OSS SDK or your own fetch wrapper.</li>
            <li><code>beforeUpload</code> validates before sending: return <code>false</code> to keep the file listed but unsent, return a new file to transform it, or return <code>Upload.LIST_IGNORE</code> to drop it completely.</li>
            <li>Removing a file while it is in flight calls <code>abort()</code> on its request.</li>
          </ul>
        </>,
      )}
      demos={[
        {
          title: tr("พื้นฐาน", "Basic"),
          description: tr(
            <>คลิกปุ่มเพื่อเลือกไฟล์ เดโมนี้ใช้ <code>customRequest</code> จำลองความคืบหน้าด้วยตัวจับเวลา ไม่ได้ยิงเครือข่ายจริง</>,
            <>Click the button to pick files. This demo fakes progress on a timer through <code>customRequest</code>, no network request is made.</>,
          ),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("รูปโปรไฟล์", "Avatar"),
          description: tr(
            <><code>listType="picture-card"</code> คู่กับ <code>maxCount=&#123;1&#125;</code> และ <code>onPreview</code> เปิดรูปใน Modal</>,
            <><code>listType="picture-card"</code> with <code>maxCount=&#123;1&#125;</code>; <code>onPreview</code> opens the image in a Modal.</>,
          ),
          code: avatarCode,
          component: <Avatar />,
        },
        {
          title: tr("ผนังรูปแบบการ์ด", "Picture Card Wall"),
          description: tr(
            <>อัปโหลดหลายรูปเรียงเป็นตาราง ปุ่มเพิ่มจะหายไปเมื่อครบ <code>maxCount</code> และ <code>showUploadList</code> เปิดไอคอนดาวน์โหลดกับข้อความเสริม</>,
            <>A grid of images. The add tile disappears at <code>maxCount</code>, and <code>showUploadList</code> turns on the download icon plus an extra label.</>,
          ),
          code: pictureCardCode,
          component: <PictureCard />,
          full: true,
        },
        {
          title: tr("การ์ดวงกลม", "Picture Circle"),
          description: tr(
            <><code>listType="picture-circle"</code> เหมาะกับรูปคนหรือโลโก้</>,
            <><code>listType="picture-circle"</code> suits avatars and logos.</>,
          ),
          code: pictureCircleCode,
          component: <PictureCircle />,
        },
        {
          title: tr("แบบรูปภาพ", "Picture Style"),
          description: tr(
            <><code>listType="picture"</code> แสดงภาพย่อหน้าชื่อไฟล์ในรายการแนวตั้ง</>,
            <><code>listType="picture"</code> puts a thumbnail in front of every row of the list.</>,
          ),
          code: pictureStyleCode,
          component: <PictureStyle />,
        },
        {
          title: tr("รายการไฟล์เริ่มต้น", "Default File List"),
          description: tr(
            <><code>defaultFileList</code> ใส่ไฟล์ที่มีอยู่แล้ว พร้อม <code>iconRender</code> และ <code>onRemove</code> ที่ถามยืนยันก่อนลบ</>,
            <><code>defaultFileList</code> seeds existing files; <code>iconRender</code> customises the icon and <code>onRemove</code> asks before deleting.</>,
          ),
          code: defaultFileListCode,
          component: <DefaultFileList />,
        },
        {
          title: tr("ควบคุมรายการไฟล์", "Controlled File List"),
          description: tr(
            <>ส่ง <code>fileList</code> เข้ามาแล้วอัปเดตจาก <code>onChange</code> เอง ทำให้กรอง เรียง หรือล้างรายการได้เต็มที่</>,
            <>Pass <code>fileList</code> in and update it from <code>onChange</code> to filter, sort, or clear the list yourself.</>,
          ),
          code: controlledFileListCode,
          component: <ControlledFileList />,
        },
        {
          title: tr("อัปโหลดเอง", "Upload Manually"),
          description: tr(
            <><code>beforeUpload</code> คืน <code>false</code> ไฟล์จะค้างในรายการโดยยังไม่ส่ง แล้วค่อยกดปุ่มเพื่อเริ่ม (เดโมนี้จำลองความคืบหน้าด้วยตัวจับเวลา)</>,
            <><code>beforeUpload</code> returning <code>false</code> keeps files queued without sending them; the button starts the transfer (progress is simulated on a timer).</>,
          ),
          code: uploadManuallyCode,
          component: <UploadManually />,
        },
        {
          title: tr("ลากวาง", "Drag and Drop"),
          description: tr(
            <><code>Upload.Dragger</code> รับไฟล์ที่ลากมาวาง ส่ง <code>style</code> และ children ได้ตามปกติ ตัวที่สองปิด <code>openFileDialogOnClick</code> จึงรับเฉพาะการวาง</>,
            <><code>Upload.Dragger</code> accepts dropped files and still forwards <code>style</code> and children. The second one turns <code>openFileDialogOnClick</code> off, so it only accepts drops.</>,
          ),
          code: dragCode,
          component: <Drag />,
        },
        {
          title: tr("อัปโหลดโฟลเดอร์", "Upload Directory"),
          description: tr(
            <><code>directory</code> เลือกทั้งโฟลเดอร์ และเมื่อวางโฟลเดอร์ลงมา จะไล่อ่านไฟล์ในโฟลเดอร์ย่อยผ่าน <code>webkitGetAsEntry</code></>,
            <><code>directory</code> picks whole folders; dropped folders are walked recursively through <code>webkitGetAsEntry</code>.</>,
          ),
          code: directoryCode,
          component: <Directory />,
        },
        {
          title: tr("จำกัดจำนวน", "Max Count"),
          description: tr(
            <><code>maxCount=&#123;1&#125;</code> จะแทนที่ไฟล์เดิมเสมอ ส่วนค่าอื่นจะตัดไฟล์ส่วนเกินทิ้ง</>,
            <><code>maxCount=&#123;1&#125;</code> always replaces the current file; any other value trims the extras.</>,
          ),
          code: maxCountCode,
          component: <MaxCount />,
        },
        {
          title: tr("กำหนดการส่งเอง", "Custom Request"),
          description: tr(
            <><code>customRequest</code> รับ <code>action</code>, <code>method</code>, <code>headers</code>, <code>data</code>, <code>filename</code> และ <code>withCredentials</code> ที่ประกอบไว้แล้ว เดโมนี้แค่พิมพ์ค่าออกมาแทนการยิงจริง</>,
            <><code>customRequest</code> receives the resolved <code>action</code>, <code>method</code>, <code>headers</code>, <code>data</code>, <code>filename</code> and <code>withCredentials</code>. This demo prints them instead of sending anything.</>,
          ),
          code: customRequestCode,
          component: <CustomRequest />,
          full: true,
        },
        {
          title: tr("แปลงไฟล์ก่อนส่ง", "Transform File"),
          description: tr(
            <>คืน <code>File</code> ตัวใหม่จาก <code>beforeUpload</code> เพื่อเปลี่ยนชื่อ บีบอัด หรือครอบรูปก่อนอัปโหลด</>,
            <>Return a new <code>File</code> from <code>beforeUpload</code> to rename, compress, or crop before uploading.</>,
          ),
          code: transformFileCode,
          component: <TransformFile />,
        },
        {
          title: tr("สร้างภาพย่อเอง", "Custom Preview File"),
          description: tr(
            <><code>previewFile</code> สร้างภาพย่อด้วย canvas เอง และ <code>isImageUrl</code> บอกว่าไฟล์ไหนควรแสดงเป็นรูป</>,
            <><code>previewFile</code> builds the thumbnail on a canvas, and <code>isImageUrl</code> decides which files render as images.</>,
          ),
          code: previewFileCode,
          component: <PreviewFile />,
        },
        {
          title: tr("แถบความคืบหน้า", "Custom Progress Bar"),
          description: tr(
            <><code>progress</code> ส่งต่อไปยัง <code>Progress</code> ตรงๆ ปรับความหนา สี และรูปแบบตัวเลขได้</>,
            <><code>progress</code> is forwarded straight to <code>Progress</code>, so stroke width, colors and the number format are all yours.</>,
          ),
          code: progressBarCode,
          component: <ProgressBar />,
        },
        {
          title: tr("เรนเดอร์รายการเอง", "Custom Item Render"),
          description: tr(
            <><code>itemRender</code> ครอบแถวเดิมไว้ได้ทั้งแถว เดโมนี้เพิ่มหูจับเพื่อลากสลับลำดับไฟล์</>,
            <><code>itemRender</code> wraps the original row; here it adds a handle so rows can be dragged into a new order.</>,
          ),
          code: itemRenderCode,
          component: <ItemRender />,
        },
        {
          title: tr("จำกัดชนิดไฟล์", "Restrict File Type"),
          description: tr(
            <>รับเฉพาะ PNG ไม่เกิน 2MB ไฟล์ผิดชนิดถูกทิ้งด้วย <code>Upload.LIST_IGNORE</code> ส่วนไฟล์ใหญ่เกินยังอยู่ในรายการแต่ไม่ถูกส่ง</>,
            <>PNG under 2MB only. The wrong type is dropped with <code>Upload.LIST_IGNORE</code>; an oversized file stays listed but is never sent.</>,
          ),
          code: pngOnlyCode,
          component: <PngOnly />,
        },
        {
          title: tr("ปิดใช้งาน", "Disabled"),
          description: tr(
            <><code>disabled</code> ปิดทั้งการคลิกและการลากวาง ใช้คู่กับ <code>showUploadList</code> เพื่อซ่อนปุ่มลบ</>,
            <><code>disabled</code> blocks both clicking and dropping; pair it with <code>showUploadList</code> to hide the remove button.</>,
          ),
          code: disabledCode,
          component: <Disabled />,
        },
      ]}
      api={[
        {
          title: "Upload",
          rows: [
            { property: "action", description: tr("URL ปลายทาง หรือฟังก์ชันที่คืน URL ต่อไฟล์", "Upload url, or a resolver called per file"), type: "string | (file) => string | Promise<string>", default: "-" },
            { property: "method", description: tr("HTTP method ของคำขอ", "HTTP method of the request"), type: "post | put | patch", default: "post" },
            { property: "headers", description: tr("HTTP headers ที่แนบไปกับคำขอ", "HTTP headers sent with the request"), type: "Record<string, string>", default: "-" },
            { property: "data", description: tr("ฟิลด์เพิ่มเติมใน form data หรือฟังก์ชันต่อไฟล์", "Extra form fields, or a resolver called per file"), type: "object | (file) => object | Promise<object>", default: "-" },
            { property: "name", description: tr("ชื่อฟิลด์ของไฟล์ใน form data", "Form field name of the file itself"), type: "string", default: "file" },
            { property: "withCredentials", description: tr("ส่งคุกกี้ไปกับคำขอ", "Send cookies with the request"), type: "boolean", default: "false" },
            { property: "customRequest", description: tr("แทนที่ชั้นส่งข้อมูลทั้งหมด", "Replace the whole transport layer"), type: "(option: UploadRequestOption) => void | { abort() }", default: "-" },
            { property: "fileList", description: tr("รายการไฟล์แบบควบคุม", "Controlled list of files"), type: "UploadFile[]", default: "-" },
            { property: "defaultFileList", description: tr("รายการไฟล์เริ่มต้นแบบไม่ควบคุม", "Uncontrolled initial list"), type: "UploadFile[]", default: "[]" },
            { property: "onChange", description: tr("เรียกทุกครั้งที่เพิ่ม คืบหน้า สำเร็จ ล้มเหลว หรือถูกลบ", "Fires on add, progress, success, error and remove"), type: "(info: { file, fileList, event? }) => void", default: "-" },
            { property: "beforeUpload", description: tr("ตรวจ/แปลงไฟล์ก่อนส่ง — false = ไม่ส่งแต่คงไว้ในรายการ, File = ใช้ไฟล์ใหม่, Upload.LIST_IGNORE = ทิ้งไฟล์", "Validate or transform before sending — false keeps it listed unsent, a File replaces it, Upload.LIST_IGNORE drops it"), type: "(file, fileList) => boolean | string | File | Blob | Promise<...>", default: "-" },
            { property: "maxCount", description: tr("จำนวนไฟล์สูงสุด ถ้าเป็น 1 จะแทนที่ไฟล์เดิม", "Max number of files; 1 replaces the current file"), type: "number", default: "-" },
            { property: "listType", description: tr("รูปแบบรายการไฟล์", "How the list is rendered"), type: "text | picture | picture-card | picture-circle", default: "text" },
            { property: "showUploadList", description: tr("แสดงรายการไฟล์ หรือกำหนดไอคอนแต่ละปุ่ม", "Show the list, or configure its icons"), type: "boolean | ShowUploadListInterface", default: "true" },
            { property: "itemRender", description: tr("เรนเดอร์แถวเอง โดยยังเรียกใช้ปุ่มเดิมได้ผ่าน actions", "Render a row yourself, driving the built-in buttons through actions"), type: "(originNode, file, fileList, actions) => ReactNode", default: "-" },
            { property: "iconRender", description: tr("กำหนดไอคอนหน้าชื่อไฟล์", "Custom icon in front of the file name"), type: "(file, listType) => ReactNode", default: "-" },
            { property: "previewFile", description: tr("สร้าง thumbUrl ของไฟล์ที่เพิ่งเลือก", "Build the thumbnail of a freshly picked file"), type: "(file: File | Blob) => Promise<string>", default: "objectURL" },
            { property: "isImageUrl", description: tr("ตัดสินว่าไฟล์ควรแสดงเป็นรูปหรือไม่", "Decide whether a file renders as an image"), type: "(file: UploadFile) => boolean", default: "type + extension" },
            { property: "progress", description: tr("คอนฟิกที่ส่งต่อให้ Progress ในแถบความคืบหน้า", "Config forwarded to the inline Progress"), type: 'Omit<ProgressProps, "percent">', default: "{ size: small, strokeWidth: 2 }" },
            { property: "type", description: tr("โหมดของตัวกด: ปุ่มเลือกไฟล์ หรือพื้นที่ลากวาง", "Trigger mode: a picker or a drop area"), type: "select | drag", default: "select" },
            { property: "accept", description: tr("ชนิดไฟล์ที่รับ ใช้ทั้งกับ input และไฟล์ที่ลากมาวาง", "Accepted types, applied to the input and to dropped files"), type: "string", default: "-" },
            { property: "multiple", description: tr("เลือกได้หลายไฟล์", "Allow picking several files"), type: "boolean", default: "false" },
            { property: "directory", description: tr("เลือกทั้งโฟลเดอร์ (รวมโฟลเดอร์ย่อยเมื่อลากมาวาง)", "Pick whole folders, sub-folders included when dropped"), type: "boolean", default: "false" },
            { property: "capture", description: tr("ส่งต่อไปยัง input เพื่อเรียกกล้องบนมือถือ", "Forwarded to the input to open the camera on mobile"), type: 'boolean | "user" | "environment"', default: "-" },
            { property: "openFileDialogOnClick", description: tr("คลิกแล้วเปิดหน้าต่างเลือกไฟล์", "Open the file dialog on click"), type: "boolean", default: "true" },
            { property: "disabled", description: tr("ปิดทั้งการคลิกและการลากวาง", "Block clicking and dropping"), type: "boolean", default: "false" },
            { property: "id", description: tr("id ของ input ไฟล์ (ใช้ผูกกับ label)", "id of the file input, for pairing with a label"), type: "string", default: "-" },
            { property: "onPreview", description: tr("กดไอคอนพรีวิวหรือชื่อไฟล์ (ไม่ใส่จะเปิดในแท็บใหม่)", "Preview icon or file name clicked; without it the url opens in a new tab"), type: "(file: UploadFile) => void", default: "-" },
            { property: "onDownload", description: tr("กดไอคอนดาวน์โหลด (ไม่ใส่จะดาวน์โหลดจาก url)", "Download icon clicked; without it the url is downloaded"), type: "(file: UploadFile) => void", default: "-" },
            { property: "onRemove", description: tr("ก่อนลบไฟล์ คืน false เพื่อยกเลิกการลบ", "Before a file is removed; return false to cancel"), type: "(file) => void | boolean | Promise<void | boolean>", default: "-" },
            { property: "onDrop", description: tr("อีเวนต์ drop ดิบ ก่อนไฟล์จะเข้าคิว", "The raw drop event, before files are queued"), type: "(event: React.DragEvent) => void", default: "-" },
            { property: "children", description: tr("ตัวกด — ปุ่ม, การ์ด หรือเนื้อหาในพื้นที่ลากวาง", "The trigger: a button, a tile, or the contents of the drop area"), type: "ReactNode", default: "-" },
            { property: "className / style", description: tr("คลาสและสไตล์บน wrapper", "Classes and style on the wrapper"), type: "string / CSSProperties", default: "-" },
            { property: "Upload.LIST_IGNORE", description: tr("ค่าคงที่สำหรับคืนจาก beforeUpload เพื่อทิ้งไฟล์", "Static value returned from beforeUpload to drop a file"), type: "string", default: "-" },
          ],
        },
        {
          title: "UploadFile",
          description: tr("รูปร่างของแต่ละไฟล์ใน fileList", "Shape of every entry in fileList"),
          rows: [
            { property: "uid", description: tr("คีย์ประจำไฟล์ ต้องไม่ซ้ำ", "Unique key of the file"), type: "string", default: "auto" },
            { property: "name", description: tr("ชื่อไฟล์ที่แสดง", "File name shown in the list"), type: "string", default: "-" },
            { property: "size", description: tr("ขนาดเป็นไบต์", "Size in bytes"), type: "number", default: "-" },
            { property: "type", description: tr("MIME type", "MIME type"), type: "string", default: "-" },
            { property: "lastModified", description: tr("เวลาที่แก้ไขไฟล์ล่าสุด", "Last modified timestamp"), type: "number", default: "-" },
            { property: "percent", description: tr("ความคืบหน้า 0-100 อัปเดตระหว่างอัปโหลด", "Progress 0-100, updated while uploading"), type: "number", default: "0" },
            { property: "status", description: tr("สถานะไฟล์ (removed เห็นได้ใน onChange เท่านั้น)", "File status (removed is only seen in onChange)"), type: "uploading | done | error | removed", default: "-" },
            { property: "url", description: tr("URL ของไฟล์ที่อัปโหลดแล้ว ใช้พรีวิวและดาวน์โหลด", "Url of an uploaded file, used by preview and download"), type: "string", default: "-" },
            { property: "thumbUrl", description: tr("URL ภาพย่อสำหรับ listType แบบรูป", "Thumbnail url for the picture list types"), type: "string", default: "previewFile" },
            { property: "response", description: tr("บอดี้ที่ถอดรหัสแล้วจาก onSuccess", "Parsed body handed to onSuccess"), type: "unknown", default: "-" },
            { property: "error", description: tr("ข้อผิดพลาดจากชั้นส่งข้อมูล", "Error raised by the transport"), type: "unknown", default: "-" },
            { property: "originFileObj", description: tr("File ต้นฉบับ (มีเมื่อเลือกไฟล์ใน session นี้)", "The original File, present for files picked in this session"), type: "File & { uid }", default: "-" },
          ],
        },
        {
          title: "showUploadList",
          description: tr("ส่งเป็นอ็อบเจกต์เพื่อคุมไอคอนของแต่ละแถว", "Pass an object to control the per-row icons"),
          rows: [
            { property: "showPreviewIcon", description: tr("แสดงไอคอนพรีวิว", "Show the preview icon"), type: "boolean", default: "true" },
            { property: "showRemoveIcon", description: tr("แสดงไอคอนลบ", "Show the remove icon"), type: "boolean", default: "true" },
            { property: "showDownloadIcon", description: tr("แสดงไอคอนดาวน์โหลด", "Show the download icon"), type: "boolean", default: "false" },
            { property: "previewIcon", description: tr("ไอคอนพรีวิวแบบกำหนดเอง", "Custom preview icon"), type: "ReactNode | (file) => ReactNode", default: "-" },
            { property: "removeIcon", description: tr("ไอคอนลบแบบกำหนดเอง", "Custom remove icon"), type: "ReactNode | (file) => ReactNode", default: "-" },
            { property: "downloadIcon", description: tr("ไอคอนดาวน์โหลดแบบกำหนดเอง", "Custom download icon"), type: "ReactNode | (file) => ReactNode", default: "-" },
            { property: "extra", description: tr("ข้อความเสริมท้ายชื่อไฟล์ เช่น ขนาดไฟล์", "Extra node after the file name, e.g. the file size"), type: "ReactNode | (file) => ReactNode", default: "-" },
          ],
        },
        {
          title: "UploadRequestOption",
          description: tr("อาร์กิวเมนต์ที่ customRequest ได้รับ", "The argument handed to customRequest"),
          rows: [
            { property: "file", description: tr("ไฟล์ที่จะส่ง (หลังผ่าน beforeUpload แล้ว)", "The file to send, after beforeUpload"), type: "File & { uid }", default: "-" },
            { property: "filename", description: tr("ชื่อฟิลด์ของไฟล์ (มาจากพร็อพ name)", "Form field name of the file (the name prop)"), type: "string", default: "file" },
            { property: "action", description: tr("URL ที่ resolve แล้ว", "The resolved url"), type: "string", default: "-" },
            { property: "method / headers / data / withCredentials", description: tr("ค่าที่ resolve แล้วจากพร็อพชื่อเดียวกัน", "Resolved values of the props with the same names"), type: "string / object / object / boolean", default: "-" },
            { property: "onProgress", description: tr("รายงานความคืบหน้ากลับมาที่รายการไฟล์", "Report progress back into the list"), type: "(event: { percent: number }) => void", default: "-" },
            { property: "onSuccess", description: tr("จบงานสำเร็จ ตั้ง status เป็น done", "Finish successfully, sets status to done"), type: "(body: unknown, xhr?: XMLHttpRequest) => void", default: "-" },
            { property: "onError", description: tr("จบงานล้มเหลว ตั้ง status เป็น error", "Fail the upload, sets status to error"), type: "(error: Error, body?: unknown) => void", default: "-" },
          ],
        },
        {
          title: "Upload.Dragger",
          description: tr("เท่ากับ Upload ที่ type=\"drag\" รับพร็อพเดียวกันทั้งหมด รวม style และ children", "Upload with type=\"drag\". It takes every Upload prop, style and children included."),
          rows: [
            { property: "children", description: tr("เนื้อหาในพื้นที่ลากวาง ถ้าไม่ใส่จะใช้ข้อความเริ่มต้น", "Contents of the drop area; a default hint is used when omitted"), type: "ReactNode", default: "-" },
            { property: "style", description: tr("สไตล์บน wrapper เช่นจำกัดความกว้าง", "Style on the wrapper, e.g. to cap its width"), type: "CSSProperties", default: "-" },
            { property: "openFileDialogOnClick", description: tr("ตั้งเป็น false เพื่อรับเฉพาะการลากวาง", "Set to false to accept drops only"), type: "boolean", default: "true" },
          ],
        },
      ]}
      extra={tr(
        <>
          <h2>คำถามที่พบบ่อย</h2>
          <h3>ทำไมไฟล์ที่อัปโหลดเสร็จถึงเป็น <code>done</code> ไม่ใช่ <code>success</code>?</h3>
          <p>สถานะทั้งชุดมีแค่ <code>uploading</code>, <code>done</code>, <code>error</code> และ <code>removed</code> เพื่อให้ตรงกันทั้งคอมโพเนนต์ — <code>removed</code> จะเห็นได้เฉพาะใน <code>onChange(&#123; file &#125;)</code> เพราะไฟล์นั้นออกจากรายการไปแล้ว</p>
          <h3>อัปโหลดไปแล้วอยากยกเลิกกลางคัน</h3>
          <p>กดปุ่มลบได้เลย คอมโพเนนต์จะเรียก <code>abort()</code> ของคำขอนั้น ถ้าเขียน <code>customRequest</code> เอง ให้คืน <code>&#123; abort &#125;</code> ออกมาด้วย</p>
          <h3>ต้องการอัปโหลดขึ้น S3 โดยตรง</h3>
          <p>ใช้ <code>action</code> เป็นฟังก์ชันเพื่อขอ presigned url ต่อไฟล์ หรือเขียน <code>customRequest</code> เรียก SDK เองทั้งก้อน</p>
        </>,
        <>
          <h2>FAQ</h2>
          <h3>Why is a finished file <code>done</code> and not <code>success</code>?</h3>
          <p>There are only four statuses — <code>uploading</code>, <code>done</code>, <code>error</code> and <code>removed</code> — so every part of the component agrees. <code>removed</code> only shows up in <code>onChange(&#123; file &#125;)</code>, since that file has already left the list.</p>
          <h3>How do I cancel an upload halfway through?</h3>
          <p>Remove the file: the component calls <code>abort()</code> on its request. A custom transport joins in by returning <code>&#123; abort &#125;</code>.</p>
          <h3>Can I upload straight to S3?</h3>
          <p>Make <code>action</code> a function that fetches a presigned url per file, or take over the whole call with <code>customRequest</code>.</p>
        </>,
      )}
      related={[
        { title: "Dropzone", path: "/components/dropzone" },
        { title: "Progress", path: "/components/progress" },
        { title: "Image", path: "/components/image" },
      ]}
    />
  );
}
