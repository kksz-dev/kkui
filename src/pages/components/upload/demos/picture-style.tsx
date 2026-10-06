import { Upload, type UploadProps } from "@/components/ui/upload";
import { Button } from "@/components/ui/button";

const swatch = (hex: string) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%23${hex}'/%3E%3C/svg%3E`;

/** Demo transport: nothing is sent anywhere, progress is reported on a timer. */
const simulate: UploadProps["customRequest"] = ({ onProgress, onSuccess }) => {
  let percent = 0;
  const timer = setInterval(() => {
    percent += 10;
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
      listType="picture"
      accept="image/*"
      multiple
      customRequest={simulate}
      defaultFileList={[
        { uid: "p-1", name: "banner.png", status: "done", url: swatch("13c2c2") },
        { uid: "p-2", name: "hero.png", status: "error", url: swatch("ff4d4f") },
      ]}
    >
      <Button>Upload</Button>
    </Upload>
  );
}
