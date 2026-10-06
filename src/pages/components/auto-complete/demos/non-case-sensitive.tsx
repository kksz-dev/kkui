import { AutoComplete } from "@/components/ui/auto-complete";

const options = [{ value: "Burns Bay Road" }, { value: "Downing Street" }, { value: "Wall Street" }];

export default function Demo() {
  return (
    <AutoComplete
      className="w-50"
      options={options}
      placeholder="try to type `b`"
      filterOption={(inputValue, option) => option.value!.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
    />
  );
}
