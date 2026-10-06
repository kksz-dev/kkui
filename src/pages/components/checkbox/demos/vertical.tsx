import { CheckboxGroup } from "@/components/ui/checkbox";

export default function Demo() {
  return (
    <CheckboxGroup
      direction="vertical"
      defaultValue={["b"]}
      options={[
        { label: "Option A", value: "a" },
        { label: "Option B", value: "b" },
        { label: "Option C", value: "c", disabled: true },
      ]}
    />
  );
}
