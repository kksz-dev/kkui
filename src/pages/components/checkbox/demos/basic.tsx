import { Checkbox, type CheckboxChangeEvent } from "@/components/ui/checkbox";

export default function Demo() {
  const onChange = (e: CheckboxChangeEvent) => {
    console.log(`checked = ${e.target.checked}`);
  };
  return <Checkbox onChange={onChange}>Checkbox</Checkbox>;
}
