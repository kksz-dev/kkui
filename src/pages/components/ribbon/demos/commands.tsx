import * as React from "react";
import { Ribbon, type RibbonTab } from "@/components/ui/ribbon";
import { Bold, Italic, Underline, ClipboardPaste, Copy, Scissors } from "lucide-react";

export default function Commands() {
  const [bold, setBold] = React.useState(true);
  const [last, setLast] = React.useState("-");

  const tabs: RibbonTab[] = [
    {
      key: "home",
      label: "Home",
      groups: [
        {
          key: "clipboard",
          title: "Clipboard",
          items: [
            { key: "paste", icon: <ClipboardPaste className="size-5" />, label: "Paste", size: "lg", onClick: () => setLast("Paste") },
            { key: "cut", icon: <Scissors className="size-3.5" />, label: "Cut", onClick: () => setLast("Cut") },
            { key: "copy", icon: <Copy className="size-3.5" />, label: "Copy", disabled: true },
          ],
        },
        {
          key: "font",
          title: "Font",
          items: [
            { key: "bold", icon: <Bold className="size-3.5" />, label: "Bold", active: bold, onClick: () => setBold((v) => !v) },
            { key: "italic", icon: <Italic className="size-3.5" />, label: "Italic", onClick: () => setLast("Italic") },
            { key: "underline", icon: <Underline className="size-3.5" />, label: "Underline", disabled: true },
          ],
        },
      ],
    },
  ];

  return (
    <div className="space-y-3">
      <Ribbon tabs={tabs} />
      <p className="text-sm text-text-secondary">
        Last command: <span className="font-medium text-text">{last}</span> · Bold is {bold ? "on" : "off"}
      </p>
    </div>
  );
}
