import { Upload } from "@/components/ui/upload";
import { Button } from "@/components/ui/button";

const swatch = (hex: string) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%23${hex}'/%3E%3C/svg%3E`;

export default function Demo() {
  return (
    <div className="space-y-4">
      <Upload
        disabled
        showUploadList={{ showRemoveIcon: false }}
        defaultFileList={[{ uid: "1", name: "locked.pdf", status: "done" }]}
      >
        <Button disabled>Click to Upload</Button>
      </Upload>

      <Upload
        disabled
        listType="picture-card"
        showUploadList={{ showRemoveIcon: false, showPreviewIcon: false }}
        defaultFileList={[{ uid: "2", name: "locked.png", status: "done", url: swatch("bfbfbf") }]}
      />

      <Upload.Dragger disabled style={{ maxWidth: 420 }} />
    </div>
  );
}
