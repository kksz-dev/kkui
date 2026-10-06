import { Upload, type UploadProps } from "@/components/ui/upload";
import { Button } from "@/components/ui/button";

/** Demo transport: nothing is sent anywhere, progress is reported on a timer. */
const simulate: UploadProps["customRequest"] = ({ onProgress, onSuccess }) => {
  let percent = 0;
  const timer = setInterval(() => {
    percent += 5;
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
    <Upload
      multiple
      customRequest={simulate}
      progress={{
        strokeWidth: 4,
        showInfo: true,
        strokeColor: { from: "var(--kk-primary)", to: "var(--kk-success)" },
        format: (percent) => `${Math.round(percent ?? 0)}%`,
      }}
    >
      <Button>Upload with a custom progress bar</Button>
    </Upload>
  );
}
