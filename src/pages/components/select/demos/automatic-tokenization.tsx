import { Select, type SelectOptionType } from "@/components/ui/select";

const options: SelectOptionType[] = [];
for (let i = 10; i < 36; i++) {
  options.push({ value: i.toString(36) + i, label: i.toString(36) + i });
}

const handleChange = (value: string[]) => {
  console.log(`selected ${value}`);
};

export default function Demo() {
  return (
    <Select
      mode="tags"
      className="w-full"
      placeholder='Paste "a10,b11 c12" to create three tags'
      onChange={handleChange}
      tokenSeparators={[",", " "]}
      options={options}
    />
  );
}
