import { Select } from "@/components/ui/select";

const onChange = (value: string) => {
  console.log(`selected ${value}`);
};

const onSearch = (value: string) => {
  console.log("search:", value);
};

export default function Demo() {
  return (
    <Select
      showSearch
      placeholder="Select a person"
      optionFilterProp="label"
      onChange={onChange}
      onSearch={onSearch}
      className="w-50"
      options={[
        { value: "jack", label: "Jack" },
        { value: "lucy", label: "Lucy" },
        { value: "tom", label: "Tom" },
      ]}
    />
  );
}
