import { DatePicker } from "@/components/ui/date-picker";

export default function StatusDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <DatePicker status="error" placeholder="Error status" />
      <DatePicker status="warning" placeholder="Warning status" />
      <DatePicker variant="filled" placeholder="Filled variant" />
      <DatePicker variant="borderless" placeholder="Borderless variant" />
    </div>
  );
}
