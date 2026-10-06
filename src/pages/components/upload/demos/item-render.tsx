import { useRef, useState } from "react";
import { Upload, type UploadFile, type UploadProps } from "@/components/ui/upload";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";

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
  const [fileList, setFileList] = useState<UploadFile[]>([
    { uid: "1", name: "chapter-1.md", status: "done" },
    { uid: "2", name: "chapter-2.md", status: "done" },
    { uid: "3", name: "chapter-3.md", status: "done" },
  ]);
  const dragging = useRef<string | null>(null);

  const move = (fromUid: string, toUid: string) =>
    setFileList((prev) => {
      const from = prev.findIndex((f) => f.uid === fromUid);
      const to = prev.findIndex((f) => f.uid === toUid);
      if (from < 0 || to < 0 || from === to) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });

  const itemRender: UploadProps["itemRender"] = (originNode, file) => (
    <div
      draggable
      onDragStart={() => {
        dragging.current = file.uid;
      }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (dragging.current) move(dragging.current, file.uid);
        dragging.current = null;
      }}
      className="flex items-center gap-1 rounded-md transition-colors duration-mid ease-kk-in-out hover:bg-fill-quaternary"
    >
      <GripVertical className="size-4 shrink-0 cursor-grab text-text-quaternary" />
      <div className="min-w-0 flex-1">{originNode}</div>
    </div>
  );

  return (
    <Upload
      multiple
      fileList={fileList}
      customRequest={simulate}
      itemRender={itemRender}
      onChange={({ fileList: next }) => setFileList(next)}
    >
      <Button>Upload, then drag rows to reorder</Button>
    </Upload>
  );
}
