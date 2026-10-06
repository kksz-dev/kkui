import { Select } from "@/components/ui/select";

export default function Demo() {
  return (
    <div className="flex flex-col gap-2">
      <Select status="error" className="w-full" placeholder="Error" />
      <Select status="warning" className="w-full" placeholder="Warning multiple" mode="multiple" />
    </div>
  );
}
