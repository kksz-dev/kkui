import { Select } from "@/components/ui/select";

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

export default function Demo() {
  return (
    <Select
      defaultValue="lucy"
      className="w-50"
      onChange={handleChange}
      options={[
        {
          label: <span>manager</span>,
          title: "manager",
          options: [
            { label: <span>Jack</span>, value: "Jack" },
            { label: <span>Lucy</span>, value: "Lucy" },
          ],
        },
        {
          label: <span>engineer</span>,
          title: "engineer",
          options: [
            { label: <span>Chloe</span>, value: "Chloe" },
            { label: <span>Lucas</span>, value: "Lucas" },
          ],
        },
      ]}
    />
  );
}
