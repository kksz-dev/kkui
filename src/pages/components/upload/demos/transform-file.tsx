import { Upload, type UploadProps } from "@/components/ui/upload";
import { Button } from "@/components/ui/button";

/** Demo transport: nothing is sent anywhere, progress is reported on a timer. */
const simulate: UploadProps["customRequest"] = ({ onProgress, onSuccess }) => {
  let percent = 0;
  const timer = setInterval(() => {
    percent += 25;
    if (percent >= 100) {
      clearInterval(timer);
      onSuccess({ ok: true });
    } else {
      onProgress({ percent });
    }
  }, 200);
  return { abort: () => clearInterval(timer) };
};

/** Returning a File from beforeUpload replaces what gets uploaded — and what the list shows. */
const rename: UploadProps["beforeUpload"] = (file) =>
  new File([file], `${Date.now()}-${file.name.replace(/\s+/g, "-").toLowerCase()}`, { type: file.type });

export default function Demo() {
  return (
    <Upload multiple beforeUpload={rename} customRequest={simulate}>
      <Button>Upload (files are renamed first)</Button>
    </Upload>
  );
}
