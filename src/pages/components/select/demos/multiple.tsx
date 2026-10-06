import { Select, type SelectOptionType } from "@/components/ui/select";

const options: SelectOptionType[] = [];
for (let i = 10; i < 36; i++) {
  options.push({ label: i.toString(36) + i, value: i.toString(36) + i });
}

const handleChange = (value: string[]) => {
  console.log(`selected ${value}`);
};

export default function Demo() {
  return (
    <div className="flex flex-col gap-2">
      <Select mode="multiple" allowClear className="w-full" placeholder="Please select" defaultValue={["a10", "c12"]} onChange={handleChange} options={options} />
      <Select mode="multiple" disabled className="w-full" placeholder="Please select" defaultValue={["a10", "c12"]} onChange={handleChange} options={options} />
    </div>
  );
}
