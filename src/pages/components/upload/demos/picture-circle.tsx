import { Upload, type UploadProps } from "@/components/ui/upload";

const swatch = (hex: string) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%23${hex}'/%3E%3C/svg%3E`;

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
    <Upload
      listType="picture-circle"
      accept="image/*"
      multiple
      maxCount={4}
      customRequest={simulate}
      defaultFileList={[{ uid: "member-1", name: "amy.png", status: "done", url: swatch("722ed1") }]}
    />
  );
}
