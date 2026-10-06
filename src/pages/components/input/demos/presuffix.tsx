import { Info, User } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder="Enter your username"
        prefix={<User className="text-text-quaternary" />}
        suffix={<Info className="text-text-quaternary" />}
      />
      <Input prefix="￥" suffix="RMB" />
      <Input prefix="￥" suffix="RMB" disabled />
    </div>
  );
}
