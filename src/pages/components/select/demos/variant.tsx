import { Select } from "@/components/ui/select";

const options = [
  { value: "jack", label: "Jack" },
  { value: "lucy", label: "Lucy" },
  { value: "Yiminghe", label: "yiminghe" },
];

export default function Demo() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Select defaultValue="lucy" className="w-30" options={options} />
        <Select defaultValue="lucy" variant="filled" className="w-30" options={options} />
        <Select defaultValue="lucy" variant="borderless" className="w-30" options={options} />
        <Select defaultValue="lucy" variant="underlined" className="w-30" options={options} />
      </div>
      <div className="flex gap-2">
        <Select mode="multiple" defaultValue={["lucy"]} className="w-30" options={options} />
        <Select mode="multiple" defaultValue={["lucy"]} variant="filled" className="w-30" options={options} />
        <Select mode="multiple" defaultValue={["lucy"]} variant="borderless" className="w-30" options={options} />
        <Select mode="multiple" defaultValue={["lucy"]} variant="underlined" className="w-30" options={options} />
      </div>
    </div>
  );
}
