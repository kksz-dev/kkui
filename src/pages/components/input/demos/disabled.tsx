import { Input, InputTextArea } from "@/components/ui/input";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <Input placeholder="disabled" disabled />
      <Input placeholder="readOnly" readOnly defaultValue="read only value" />
      <Input placeholder="filled disabled" variant="filled" disabled defaultValue="filled" />
      <InputTextArea placeholder="disabled textarea" disabled />
    </div>
  );
}
