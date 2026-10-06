import { Upload, type UploadProps } from "@/components/ui/upload";
import { Button } from "@/components/ui/button";
import { message } from "@/components/ui/message";

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

/**
 * PNG only, 2MB max.
 * wrong type -> Upload.LIST_IGNORE, the file never enters the list.
 * too large  -> false, the file is listed but never uploaded.
 */
const beforeUpload: UploadProps["beforeUpload"] = (file) => {
  if (file.type !== "image/png") {
    message.error(`${file.name} is not a PNG file`);
    return Upload.LIST_IGNORE;
  }
  if (file.size > 2 * 1024 * 1024) {
    message.error(`${file.name} is larger than 2MB`);
    return false;
  }
  return true;
};

export default function Demo() {
  return (
    <Upload
      multiple
      accept="image/*"
      beforeUpload={beforeUpload}
      customRequest={simulate}
      onRemove={(file) => {
        message.info(`Removed ${file.name}`);
        return true;
      }}
    >
      <Button>Upload PNG only</Button>
    </Upload>
  );
}
