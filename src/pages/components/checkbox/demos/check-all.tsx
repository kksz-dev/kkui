import { useState } from "react";
import { Checkbox, CheckboxGroup, type CheckboxChangeEvent, type CheckboxValueType } from "@/components/ui/checkbox";

const plainOptions = ["Apple", "Pear", "Orange"];
const defaultCheckedList = ["Apple", "Orange"];

export default function Demo() {
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>(defaultCheckedList);

  const checkAll = plainOptions.length === checkedList.length;
  const indeterminate = checkedList.length > 0 && checkedList.length < plainOptions.length;

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(e.target.checked ? plainOptions : []);
  };

  return (
    <div className="flex flex-col gap-2">
      <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
        Check all
      </Checkbox>
      <div className="border-t border-border-secondary" />
      <CheckboxGroup options={plainOptions} value={checkedList} onChange={setCheckedList} />
    </div>
  );
}
