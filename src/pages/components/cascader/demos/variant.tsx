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
      <Cascader options={options} placeholder="Outlined" className="w-56" />
      <Cascader options={options} placeholder="Filled" variant="filled" className="w-56" />
      <Cascader options={options} placeholder="Borderless" variant="borderless" className="w-56" />
      <Cascader options={options} placeholder="Underlined" variant="underlined" className="w-56" />
    </div>
  );
}
