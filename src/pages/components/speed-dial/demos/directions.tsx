import { SpeedDial } from "@/components/ui/speed-dial";
import { Copy, Pencil, Share2, Trash2 } from "lucide-react";

const actions = [
  { key: "edit", icon: <Pencil className="size-4" />, title: "Edit" },
  { key: "copy", icon: <Copy className="size-4" />, title: "Duplicate" },
  { key: "share", icon: <Share2 className="size-4" />, title: "Share" },
  { key: "delete", icon: <Trash2 className="size-4" />, title: "Delete", danger: true },
];

export default function DirectionsDemo() {
  return (
    <div className="grid min-h-[280px] grid-cols-2 place-items-center gap-6 sm:grid-cols-4">
      {(["up", "down", "left", "right"] as const).map((direction) => (
        <div key={direction} className="flex flex-col items-center gap-2">
          <SpeedDial actions={actions} direction={direction} />
          <span className="text-xs text-text-tertiary">{direction}</span>
        </div>
      ))}
    </div>
  );
}
