import { Smile, Meh, User } from "lucide-react";
import { Select } from "@/components/ui/select";

const options = [
  { value: "jack", label: "Jack" },
  { value: "lucy", label: "Lucy" },
  { value: "Yiminghe", label: "yiminghe" },
];

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Select prefix={<User className="text-text-tertiary" />} defaultValue="lucy" className="w-40" options={options} />
      <Select suffixIcon={<Smile />} defaultValue="lucy" className="w-30" options={options} />
      <Select suffixIcon={<Meh />} mode="multiple" defaultValue={["lucy"]} className="w-40" options={options} />
      <Select suffixIcon={null} defaultValue="lucy" className="w-30" options={options} />
    </div>
  );
}
