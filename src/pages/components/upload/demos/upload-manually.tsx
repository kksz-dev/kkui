import { useState } from "react";
import { Upload, type UploadFile } from "@/components/ui/upload";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  /** Simulated: the queue is walked from 0 to 100% on a timer, nothing leaves the browser. */
  const startUpload = () => {
    setUploading(true);
    let percent = 0;
    const timer = setInterval(() => {
      percent += 10;
      const status: UploadFile["status"] = percent >= 100 ? "done" : "uploading";
      setFileList((prev) => prev.map((file) => ({ ...file, percent, status })));
      if (percent >= 100) {
        clearInterval(timer);
        setUploading(false);
      }
    }, 200);
  };

  return (
    <div className="space-y-3">
      <Upload
        multiple
        fileList={fileList}
        beforeUpload={() => false}
        onChange={({ fileList: next }) => setFileList(next)}
      >
        <Button>Select Files</Button>
      </Upload>

      <Button type="primary" disabled={fileList.length === 0} loading={uploading} onClick={startUpload}>
        {uploading ? "Uploading" : "Start Upload"}
      </Button>
    </div>
  );
}
