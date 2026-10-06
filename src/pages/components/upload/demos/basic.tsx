import { Upload, type UploadProps } from "@/components/ui/upload";
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon } from "lucide-react";

/** Demo transport: nothing is sent anywhere, progress is reported on a timer. */
const simulate: UploadProps["customRequest"] = ({ file, onProgress, onSuccess }) => {
  let percent = 0;
  const timer = setInterval(() => {
    percent += 20;
    if (percent >= 100) {
      clearInterval(timer);
      onSuccess({ name: file.name });
    } else {
      onProgress({ percent });
    }
  }, 250);
  return { abort: () => clearInterval(timer) };
};

export default function Demo() {
  return (
    <Upload
      id="kk-upload-basic"
      customRequest={simulate}
      defaultFileList={[{ uid: "seed-1", name: "quarterly-report.pdf", status: "done" }]}
      onChange={({ file, fileList }) => console.log(file.name, file.status, fileList.length)}
    >
      <Button icon={<UploadIcon className="size-4" />}>Click to Upload</Button>
    </Upload>
  );
}
