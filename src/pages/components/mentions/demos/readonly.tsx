import { Mentions } from "@/components/ui/mentions";

const options = ["afc163", "zombiej", "yesmeck"].map((value) => ({ value, label: value }));

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <Mentions className="w-full" placeholder="this is disabled Mentions" disabled options={options} />
      <Mentions className="w-full" placeholder="this is readOnly Mentions" readOnly options={options} />
    </div>
  );
}
