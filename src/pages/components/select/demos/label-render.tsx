import { Select, type LabeledValue } from "@/components/ui/select";

const labelRender = ({ label, value }: LabeledValue) => {
  if (label) return label;
  return <span>No option match value: {value}</span>;
};

export default function Demo() {
  return (
    <div className="flex flex-col gap-2">
      <Select
        labelRender={labelRender}
        defaultValue="1"
        className="w-full"
        options={[
          { label: "gold", value: "1" },
          { label: "lime", value: "2" },
        ]}
      />
      <Select labelRender={labelRender} defaultValue="1" className="w-full" options={[]} />
    </div>
  );
}
