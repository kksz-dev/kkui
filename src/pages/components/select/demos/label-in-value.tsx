import { Select, type LabeledValue } from "@/components/ui/select";

const handleChange = (value: LabeledValue) => {
  console.log(value); // { value: "lucy", label: "Lucy (101)" }
};

export default function Demo() {
  return (
    <Select
      labelInValue
      defaultValue={{ value: "lucy", label: "Lucy (101)" }}
      className="w-30"
      onChange={handleChange}
      options={[
        { value: "jack", label: "Jack (100)" },
        { value: "lucy", label: "Lucy (101)" },
      ]}
    />
  );
}
