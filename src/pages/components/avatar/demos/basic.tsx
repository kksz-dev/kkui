import { Avatar } from "@/components/ui/avatar";
import { User } from "lucide-react";

export default function Basic() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Avatar size={64} icon={<User />} />
        <Avatar size="lg" icon={<User />} />
        <Avatar size="md" icon={<User />} />
        <Avatar size="sm" icon={<User />} />
      </div>
      <div className="flex items-center gap-4">
        <Avatar shape="square" size={64} icon={<User />} />
        <Avatar shape="square" size="lg" icon={<User />} />
        <Avatar shape="square" size="md" icon={<User />} />
        <Avatar shape="square" size="sm" icon={<User />} />
      </div>
    </div>
  );
}
