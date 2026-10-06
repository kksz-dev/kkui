import * as React from "react";
import { QRCode, type QRCodeErrorLevel } from "@/components/ui/qr-code";
import { Segmented } from "@/components/ui/segmented";

export default function Demo() {
  const [level, setLevel] = React.useState<QRCodeErrorLevel>("M");

  return (
    <div className="space-y-4">
      <QRCode
        value="https://kkui.kksz.dev/components/qr-code?ref=benchmark_test_query"
        errorLevel={level}
      />
      <div className="flex items-center gap-3">
        <span className="text-xs text-text-secondary">Error Level:</span>
        <Segmented
          size="sm"
          value={level}
          onChange={(val) => setLevel(val as QRCodeErrorLevel)}
          options={[
            { label: "L (7%)", value: "L" },
            { label: "M (15%)", value: "M" },
            { label: "Q (25%)", value: "Q" },
            { label: "H (30%)", value: "H" },
          ]}
        />
      </div>
    </div>
  );
}
