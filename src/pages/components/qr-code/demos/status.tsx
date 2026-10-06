import * as React from "react";
import { QRCode, type QRCodeStatus } from "@/components/ui/qr-code";
import { Segmented } from "@/components/ui/segmented";

export default function Demo() {
  const [status, setStatus] = React.useState<QRCodeStatus>("active");

  return (
    <div className="space-y-4">
      <QRCode
        value="https://kkui.kksz.dev/"
        status={status}
        onRefresh={() => {
          setStatus("loading");
          setTimeout(() => setStatus("active"), 1500);
        }}
      />
      <div>
        <Segmented
          value={status}
          onChange={(val) => setStatus(val as QRCodeStatus)}
          options={["active", "loading", "expired", "scanned"]}
        />
      </div>
    </div>
  );
}
