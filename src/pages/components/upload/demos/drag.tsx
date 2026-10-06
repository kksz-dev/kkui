import { Upload, type UploadProps } from "@/components/ui/upload";

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
    <div className="space-y-4">
      <Upload.Dragger
        multiple
        customRequest={simulate}
        style={{ maxWidth: 420 }}
        onDrop={(event) => console.log("dropped", event.dataTransfer.files.length, "file(s)")}
      />

      <Upload.Dragger multiple openFileDialogOnClick={false} customRequest={simulate} style={{ maxWidth: 420 }}>
        <span className="text-sm text-text">Drop only — clicking does not open the file dialog</span>
      </Upload.Dragger>
    </div>
  );
}
