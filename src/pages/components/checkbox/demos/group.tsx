import { CheckboxGroup, type CheckboxValueType } from "@/components/ui/checkbox";

const plainOptions = ["Apple", "Pear", "Orange"];
const options = [
  { label: "Apple", value: "Apple" },
  { label: "Pear", value: "Pear" },
  { label: "Orange", value: "Orange" },
];
const optionsWithDisabled = [
  { label: "Apple", value: "Apple" },
  { label: "Pear", value: "Pear" },
  { label: "Orange", value: "Orange", disabled: false },
];

export default function Demo() {
  const onChange = (checkedValues: CheckboxValueType[]) => {
    console.log("checked = ", checkedValues);
  };
  return (
    <div className="flex flex-col gap-4">
      <CheckboxGroup options={plainOptions} defaultValue={["Apple"]} onChange={onChange} />
      <CheckboxGroup options={options} defaultValue={["Pear"]} onChange={onChange} />
      <CheckboxGroup options={optionsWithDisabled} disabled defaultValue={["Apple"]} onChange={onChange} />
    </div>
  );
}
