import { useState } from "react";
import { Upload, type UploadFile, type UploadProps } from "@/components/ui/upload";
import { Button } from "@/components/ui/button";

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
  const [fileList, setFileList] = useState<UploadFile[]>([
    { uid: "seed-1", name: "readme.md", status: "done" },
  ]);

  return (
    <div className="space-y-3">
      <Upload
        multiple
        maxCount={3}
        fileList={fileList}
        customRequest={simulate}
        onChange={({ fileList: next }) => setFileList(next)}
      >
        <Button>Select (max 3)</Button>
      </Upload>

      <div className="text-xs text-text-secondary">
        {fileList.length} file(s): {fileList.map((f) => `${f.name} ${Math.round(f.percent ?? 0)}%`).join(" · ") || "—"}
      </div>
      <Button size="sm" onClick={() => setFileList([])}>
        Clear
      </Button>
    </div>
  );
}
