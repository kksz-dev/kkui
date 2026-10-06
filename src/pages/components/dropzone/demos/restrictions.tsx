import { Dropzone } from "@/components/ui/dropzone";

export default function Demo() {
  return (
    <div className="space-y-4">
      <Dropzone multiple={false} maxFiles={1} maxSizeMB={1} accept="image/png" />
      <Dropzone disabled maxFiles={2} />
    </div>
  );
}
