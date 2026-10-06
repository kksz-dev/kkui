import { Segmented } from "@/components/ui/segmented";
import { User, Shield, Sparkles } from "lucide-react";

export default function Demo() {
  return (
    <Segmented
      options={[
        {
          value: "user1",
          icon: <User className="size-4" />,
          label: (
            <div className="flex flex-col py-1 text-left">
              <span className="font-medium leading-tight">user1</span>
              <span className="text-xs text-text-tertiary">Standard</span>
            </div>
          ),
        },
        {
          value: "user2",
          icon: <Shield className="size-4 text-primary" />,
          label: (
            <div className="flex flex-col py-1 text-left">
              <span className="font-medium leading-tight">user2</span>
              <span className="text-xs text-text-tertiary">Admin</span>
            </div>
          ),
        },
        {
          value: "user3",
          icon: <Sparkles className="size-4 text-warning" />,
          label: (
            <div className="flex flex-col py-1 text-left">
              <span className="font-medium leading-tight">user3</span>
              <span className="text-xs text-text-tertiary">VIP</span>
            </div>
          ),
        },
      ]}
    />
  );
}
