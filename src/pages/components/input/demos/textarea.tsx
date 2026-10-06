import { InputTextArea } from "@/components/ui/input";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <InputTextArea rows={4} placeholder="maxLength is 6" maxLength={6} />
      <InputTextArea rows={4} placeholder="disabled" disabled />
    </div>
  );
}
