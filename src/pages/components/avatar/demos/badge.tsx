import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

export default function BadgeDemo() {
  return (
    <div className="flex items-center gap-6">
      <Badge count={1}>
        <Avatar shape="square" icon={<User />} />
      </Badge>
      <Badge dot>
        <Avatar shape="square" icon={<User />} />
      </Badge>
      <Badge count={5}>
        <Avatar shape="circle" icon={<User />} />
      </Badge>
    </div>
  );
}
