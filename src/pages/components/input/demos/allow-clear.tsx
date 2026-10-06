import { XCircle } from "lucide-react";
import { Input, InputTextArea } from "@/components/ui/input";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <Input placeholder="input with clear icon" allowClear onChange={(e) => console.log(e.target.value)} />
      <Input placeholder="custom clear icon" allowClear={{ clearIcon: <XCircle /> }} />
      <InputTextArea placeholder="textarea with clear icon" allowClear onChange={(e) => console.log(e.target.value)} />
    </div>
  );
}
