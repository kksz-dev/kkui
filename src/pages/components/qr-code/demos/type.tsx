import { QRCode } from "@/components/ui/qr-code";

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-6">
      <div>
        <div className="mb-2 text-xs text-text-secondary">Canvas Render:</div>
        <QRCode value="https://kkui.kksz.dev/" type="canvas" />
      </div>
      <div>
        <div className="mb-2 text-xs text-text-secondary">SVG Render:</div>
        <QRCode value="https://kkui.kksz.dev/" type="svg" />
      </div>
    </div>
  );
}
