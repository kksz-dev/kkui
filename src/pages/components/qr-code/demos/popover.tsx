import { QRCode } from "@/components/ui/qr-code";
import { Button } from "@/components/ui/button";
import { QrCode as QrIcon } from "lucide-react";

export default function Demo() {
  return (
    <div className="group relative inline-block">
      <Button icon={<QrIcon className="size-4" />}>
        Hover to scan QR code
      </Button>
      <div className="pointer-events-none absolute left-1/2 bottom-full z-50 mb-2 -translate-x-1/2 opacity-0 shadow-kk transition-all duration-mid group-hover:pointer-events-auto group-hover:opacity-100">
        <QRCode value="https://kkui.kksz.dev/" size={140} />
      </div>
    </div>
  );
}
