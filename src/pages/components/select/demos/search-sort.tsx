import { Select } from "@/components/ui/select";

export default function Demo() {
  return (
    <Select
      showSearch
      className="w-50"
      placeholder="Search to Select"
      optionFilterProp="label"
      filterSort={(optionA, optionB) =>
        String(optionA?.label ?? "").toLowerCase().localeCompare(String(optionB?.label ?? "").toLowerCase())
      }
      options={[
        { value: "1", label: "Not Identified" },
        { value: "2", label: "Closed" },
        { value: "3", label: "Communicated" },
        { value: "4", label: "Identified" },
        { value: "5", label: "Resolved" },
        { value: "6", label: "Cancelled" },
      ]}
    />
  );
}
