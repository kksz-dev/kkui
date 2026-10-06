import { SpeedDial } from "@/components/ui/speed-dial";
import { Copy, Share2, Printer, Heart } from "lucide-react";
import { message } from "@/components/ui/message";

export default function Basic() {
  const actions = [
    { key: "copy", icon: <Copy className="size-4" />, title: "Copy Link", onClick: () => message.success("Link copied!") },
    { key: "share", icon: <Share2 className="size-4" />, title: "Share", onClick: () => message.info("Share clicked") },
    { key: "print", icon: <Printer className="size-4" />, title: "Print", onClick: () => message.info("Printing...") },
    { key: "like", icon: <Heart className="size-4" />, title: "Like", onClick: () => message.success("Liked!") },
  ];

  return (
    <div className="relative h-64 w-full rounded-xl border border-dashed border-border bg-bg-layout/50 flex items-center justify-center">
      <SpeedDial actions={actions} direction="up" />
    </div>
  );
}
