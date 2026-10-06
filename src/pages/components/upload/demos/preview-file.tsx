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

/** Build the thumbnail by hand: the image squared off with a caption stamped on it. */
const previewFile: UploadProps["previewFile"] = async (file) => {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = 96;
  canvas.height = 96;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.drawImage(bitmap, 0, 0, 96, 96);
  ctx.fillStyle = "rgba(0,0,0,.55)";
  ctx.fillRect(0, 72, 96, 24);
  ctx.fillStyle = "#fff";
  ctx.font = "12px sans-serif";
  ctx.fillText("PREVIEW", 10, 89);
  bitmap.close();
  return canvas.toDataURL();
};

export default function Demo() {
  return (
    <Upload
      listType="picture-card"
      accept="image/*"
      multiple
      previewFile={previewFile}
      isImageUrl={(file) => Boolean(file.type?.startsWith("image/") || file.thumbUrl?.startsWith("data:image/"))}
      customRequest={simulate}
    />
  );
}
