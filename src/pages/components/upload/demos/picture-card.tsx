import { useState } from "react";
import { Upload, type UploadFile, type UploadProps } from "@/components/ui/upload";
import { Modal } from "@/components/ui/modal";

/** Inline placeholder image so the demo never touches the network. */
const swatch = (hex: string) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%23${hex}'/%3E%3C/svg%3E`;

/** Demo transport: nothing is sent anywhere, progress is reported on a timer. */
const simulate: UploadProps["customRequest"] = ({ onProgress, onSuccess }) => {
  let percent = 0;
  const timer = setInterval(() => {
    percent += 20;
    if (percent >= 100) {
      clearInterval(timer);
      onSuccess({ ok: true });
    } else {
      onProgress({ percent });
    }
  }, 220);
  return { abort: () => clearInterval(timer) };
};

export default function Demo() {
  const [preview, setPreview] = useState<UploadFile | null>(null);

  return (
    <>
      <Upload
        listType="picture-card"
        accept="image/*"
        multiple
        maxCount={8}
        customRequest={simulate}
        showUploadList={{
          showDownloadIcon: true,
          extra: (file) => `${Math.round((file.size ?? 0) / 1024)} KB`,
        }}
        onPreview={(file) => setPreview(file)}
        onDownload={(file) => console.log("download", file.name)}
        defaultFileList={[
          { uid: "img-1", name: "sky.png", status: "done", size: 24576, url: swatch("1677ff") },
          { uid: "img-2", name: "leaf.png", status: "done", size: 18432, url: swatch("52c41a") },
          { uid: "img-3", name: "sunset.png", status: "error", size: 30720, url: swatch("faad14") },
        ]}
      />
      <Modal open={preview !== null} title={preview?.name} footer={null} onCancel={() => setPreview(null)}>
        {preview && <img src={preview.thumbUrl ?? preview.url} alt={preview.name} className="w-full rounded-md" />}
      </Modal>
    </>
  );
}
