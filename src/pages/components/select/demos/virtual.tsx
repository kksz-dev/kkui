import { Select } from "@/components/ui/select";

const options = Array.from({ length: 5000 }, (_, i) => ({
  value: `option-${i + 1}`,
  label: `Option ${i + 1}`,
}));

export default function VirtualDemo() {
  return (
    <Select
      options={options}
      showSearch
      placeholder="5,000 options"
      className="w-64"
      onChange={(value) => console.log(value)}
    />
  );
}
