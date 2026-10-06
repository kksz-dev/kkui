import { Upload, type UploadProps } from "@/components/ui/upload";

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
  return (
    <Upload.Dragger directory customRequest={simulate} style={{ maxWidth: 420 }}>
      <span className="text-base text-text">Click or drop a folder here</span>
      <span className="mt-1 text-sm text-text-secondary">Every file inside is queued, sub-folders included.</span>
    </Upload.Dragger>
  );
}
