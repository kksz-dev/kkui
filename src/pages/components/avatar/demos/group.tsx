import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { User } from "lucide-react";

export default function GroupDemo() {
  return (
    <div className="flex flex-col gap-6">
      <AvatarGroup>
        <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" />
        <Avatar style={{ backgroundColor: "#f56a00" }}>K</Avatar>
        <Avatar style={{ backgroundColor: "#87d068" }} icon={<User />} />
        <Avatar style={{ backgroundColor: "#1677ff" }} icon={<User />} />
      </AvatarGroup>

      <AvatarGroup
        max={{
          count: 2,
          style: { color: "#f56a00", backgroundColor: "#fde3cf" },
          popover: { placement: "top" },
        }}
      >
        <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" />
        <Avatar style={{ backgroundColor: "#f56a00" }}>K</Avatar>
        <Avatar style={{ backgroundColor: "#87d068" }} icon={<User />} />
        <Avatar style={{ backgroundColor: "#1677ff" }} icon={<User />} />
      </AvatarGroup>

      <AvatarGroup size="lg" shape="square">
        <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" />
        <Avatar style={{ backgroundColor: "#f56a00" }}>K</Avatar>
        <Avatar style={{ backgroundColor: "#87d068" }} icon={<User />} />
      </AvatarGroup>
    </div>
  );
}
