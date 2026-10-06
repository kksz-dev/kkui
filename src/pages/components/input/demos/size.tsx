import { User } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <Input size="lg" placeholder="large size" prefix={<User />} />
      <Input placeholder="default size" prefix={<User />} />
      <Input size="sm" placeholder="small size" prefix={<User />} />
    </div>
  );
}
