import { Avatar } from "@/components/ui/avatar";
import { User } from "lucide-react";

export default function ResponsiveDemo() {
  return (
    <div className="flex items-center gap-4">
      <Avatar
        size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
        icon={<User />}
      />
    </div>
  );
}
