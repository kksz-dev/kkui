import { RadioGroup } from "@/components/ui/radio";

const options = [
  { label: "Apple", value: "Apple" },
  { label: "Pear", value: "Pear" },
  { label: "Orange", value: "Orange" },
];

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <RadioGroup block options={options} defaultValue="Apple" />
      <RadioGroup block options={options} defaultValue="Apple" optionType="button" />
      <RadioGroup block options={options} defaultValue="Pear" optionType="button" buttonStyle="solid" />
    </div>
  );
}
