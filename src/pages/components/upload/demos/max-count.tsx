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

export default function Demo() {
  return (
    <div className="space-y-4">
      <Upload maxCount={1} customRequest={simulate}>
        <Button>Upload (max 1, replaces)</Button>
      </Upload>

      <Upload maxCount={3} multiple customRequest={simulate}>
        <Button>Upload (max 3, extra files are dropped)</Button>
      </Upload>
    </div>
  );
}
