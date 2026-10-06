import { Avatar } from "@/components/ui/avatar";
import { User } from "lucide-react";

export default function Type() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Avatar icon={<User />} />
      <Avatar>U</Avatar>
      <Avatar size="md">USER</Avatar>
      <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" />
      <Avatar style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}>U</Avatar>
      <Avatar style={{ backgroundColor: "#87d068" }} icon={<User />} />
    </div>
  );
}
