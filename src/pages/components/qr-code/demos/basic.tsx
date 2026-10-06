import * as React from "react";
import { QRCode } from "@/components/ui/qr-code";

export default function Demo() {
  const [text, setText] = React.useState("https://kkui.kksz.dev/");

  return (
    <div className="space-y-4">
      <QRCode value={text} />
      <div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to encode"
          className="h-control w-64 rounded-md border border-border bg-bg-container px-3 text-sm text-text outline-none focus-visible:ring-[3px] focus-visible:ring-primary/30"
        />
      </div>
    </div>
  );
}
