import { Upload, type UploadProps } from "@/components/ui/upload";
import { Button } from "@/components/ui/button";
import { CircleAlert, FileText, LoaderCircle } from "lucide-react";

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
  }, 250);
  return { abort: () => clearInterval(timer) };
};

export default function Demo() {
  return (
    <Upload
      multiple
      customRequest={simulate}
      defaultFileList={[
        { uid: "1", name: "contract.pdf", status: "done", size: 128_000 },
        { uid: "2", name: "photos.zip", status: "uploading", percent: 62, size: 4_200_000 },
        { uid: "3", name: "broken.docx", status: "error", size: 32_000 },
      ]}
      showUploadList={{
        showDownloadIcon: true,
        extra: (file) => `${Math.round((file.size ?? 0) / 1024)} KB`,
      }}
      iconRender={(file) =>
        file.status === "error" ? (
          <CircleAlert className="size-4 text-error" />
        ) : file.status === "uploading" ? (
          <LoaderCircle className="size-4 animate-spin text-primary" />
        ) : (
          <FileText className="size-4" />
        )
      }
      onDownload={(file) => console.log("download", file.name)}
      onRemove={(file) => window.confirm(`Remove ${file.name}?`)}
    >
      <Button>Add more files</Button>
    </Upload>
  );
}
