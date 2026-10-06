import { Select, type SelectOptionType } from "@/components/ui/select";

const options: SelectOptionType[] = [];
for (let i = 0; i < 10000; i++) {
  const value = `${i.toString(36)}${i}`;
  options.push({ label: value, value, disabled: i === 10 });
}

const handleChange = (value: string[]) => {
  console.log(`selected ${value}`);
};

export default function Demo() {
  return (
    <Select
      mode="multiple"
      className="w-full"
      placeholder="Please select"
      defaultValue={["a10", "c12"]}
      onChange={handleChange}
      options={options}
    />
  );
}
