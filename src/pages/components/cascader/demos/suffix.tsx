import { Smile, User } from "lucide-react";
import { Cascader } from "@/components/ui/cascader";

const options = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [{ value: "hangzhou", label: "Hangzhou", children: [{ value: "xihu", label: "West Lake" }] }],
  },
];

export default function Demo() {
  return (
    <div className="flex flex-col items-start gap-2">
      <Cascader prefix={<User className="text-text-tertiary" />} options={options} placeholder="Please select" />
      <Cascader suffixIcon={<Smile />} options={options} placeholder="Please select" />
    </div>
  );
}
