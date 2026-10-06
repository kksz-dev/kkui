import { Select } from "@/components/ui/select";

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Select
        defaultValue="lucy"
        className="w-30"
        onChange={handleChange}
        options={[
          { value: "jack", label: "Jack" },
          { value: "lucy", label: "Lucy" },
          { value: "Yiminghe", label: "yiminghe" },
          { value: "disabled", label: "Disabled", disabled: true },
        ]}
      />
      <Select defaultValue="lucy" className="w-30" disabled options={[{ value: "lucy", label: "Lucy" }]} />
      <Select defaultValue="lucy" className="w-30" loading options={[{ value: "lucy", label: "Lucy" }]} />
      <Select defaultValue="lucy" className="w-30" allowClear options={[{ value: "lucy", label: "Lucy" }]} placeholder="select it" />
    </div>
  );
}
