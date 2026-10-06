import { Icon } from "@/components/ui/icon";
import { Loader2, Heart, Settings, Smile } from "lucide-react";

export default function BasicDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6 text-2xl">
      <Icon>
        <Smile className="size-6 text-primary" />
      </Icon>
      <Icon spin>
        <Loader2 className="size-6 text-primary" />
      </Icon>
      <Icon rotate={180}>
        <Settings className="size-6 text-warning" />
      </Icon>
      <Icon color="var(--color-error)" size={28}>
        <Heart className="size-7 fill-current" />
      </Icon>
    </div>
  );
}
