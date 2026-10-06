import { useState } from "react";
import { Upload, type UploadFile, type UploadProps } from "@/components/ui/upload";
import { Modal } from "@/components/ui/modal";

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

export default function Demo() {
  const [preview, setPreview] = useState<UploadFile | null>(null);

  return (
    <>
      <Upload
        listType="picture-card"
        accept="image/png,image/jpeg"
        capture="user"
        maxCount={1}
        customRequest={simulate}
        onPreview={(file) => setPreview(file)}
      />
      <Modal open={preview !== null} title={preview?.name} footer={null} onCancel={() => setPreview(null)}>
        {preview && <img src={preview.thumbUrl ?? preview.url} alt={preview.name} className="w-full rounded-md" />}
      </Modal>
    </>
  );
}
