import { SpeedDial } from "@/components/ui/speed-dial";
import { Bell, MessageSquare, Star } from "lucide-react";

export default function HoverDemo() {
  return (
    <div className="flex min-h-[200px] items-end justify-center">
      <SpeedDial
        trigger="hover"
        keepOpenOnAction
        aria-label="Notifications"
        actions={[
          { key: "star", icon: <Star className="size-4" />, title: "Star" },
          { key: "chat", icon: <MessageSquare className="size-4" />, title: "Comment" },
          { key: "bell", icon: <Bell className="size-4" />, title: "Subscribe", disabled: true },
        ]}
      />
    </div>
  );
}
