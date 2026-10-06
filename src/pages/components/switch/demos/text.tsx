import { Switch } from "@/components/ui/switch";
import { Check, X } from "lucide-react";

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked />
      <Switch checkedChildren="1" unCheckedChildren="0" />
      <Switch
        checkedChildren={<Check className="size-3" />}
        unCheckedChildren={<X className="size-3" />}
        defaultChecked
      />
    </div>
  );
}
