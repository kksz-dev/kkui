import { Clock } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <Input status="error" placeholder="Error" />
      <Input status="warning" placeholder="Warning" />
      <Input status="error" prefix={<Clock />} placeholder="Error with prefix" />
      <Input status="warning" prefix={<Clock />} placeholder="Warning with prefix" />
    </div>
  );
}
