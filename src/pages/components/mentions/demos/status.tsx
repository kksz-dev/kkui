import { Mentions } from "@/components/ui/mentions";

const options = ["afc163", "zombiej", "yesmeck"].map((value) => ({ value, label: value }));

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <Mentions className="w-full" status="error" placeholder="error" options={options} />
      <Mentions className="w-full" status="warning" placeholder="warning" options={options} />
      <Mentions className="w-full" allowClear defaultValue="@afc163 with allowClear" options={options} />
    </div>
  );
}
