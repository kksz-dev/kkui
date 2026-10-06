import { Checkbox, CheckboxGroup, type CheckboxValueType } from "@/components/ui/checkbox";

export default function Demo() {
  const onChange = (checkedValues: CheckboxValueType[]) => {
    console.log("checked = ", checkedValues);
  };
  return (
    <CheckboxGroup className="grid w-full grid-cols-3 gap-y-2" onChange={onChange}>
      <Checkbox value="A">A</Checkbox>
      <Checkbox value="B">B</Checkbox>
      <Checkbox value="C">C</Checkbox>
      <Checkbox value="D">D</Checkbox>
      <Checkbox value="E">E</Checkbox>
    </CheckboxGroup>
  );
}
