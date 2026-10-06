import { Settings } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <Input addonBefore="http://" addonAfter=".com" defaultValue="mysite" />
      <Input
        addonBefore={
          <select className="bg-transparent outline-none" defaultValue="http://">
            <option>http://</option>
            <option>https://</option>
          </select>
        }
        addonAfter={
          <select className="bg-transparent outline-none" defaultValue=".com">
            <option>.com</option>
            <option>.jp</option>
            <option>.cn</option>
            <option>.org</option>
          </select>
        }
        defaultValue="mysite"
      />
      <Input addonAfter={<Settings className="size-4" />} defaultValue="mysite" />
      <Input addonBefore="http://" suffix=".com" defaultValue="mysite" />
    </div>
  );
}
