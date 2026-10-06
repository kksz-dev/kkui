import * as React from "react";
import { QRCode } from "@/components/ui/qr-code";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function Demo() {
  const qrRef = React.useRef<HTMLDivElement>(null);

  const downloadQRCode = () => {
    const container = qrRef.current;
    if (!container) return;
    const canvas = container.querySelector("canvas");
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.download = "kkui-qrcode.png";
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-4">
      <QRCode ref={qrRef} value="https://kkui.kksz.dev/" />
      <div>
        <Button size="sm" icon={<Download className="size-3.5" />} onClick={downloadQRCode}>
          Download QR Code
        </Button>
      </div>
    </div>
  );
}
