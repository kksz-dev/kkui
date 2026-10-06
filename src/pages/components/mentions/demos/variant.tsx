import { Mentions } from "@/components/ui/mentions";

const options = ["afc163", "zombiej", "yesmeck"].map((value) => ({ value, label: value }));

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <Mentions className="w-full" placeholder="Outlined" options={options} />
      <Mentions className="w-full" placeholder="Filled" variant="filled" options={options} />
      <Mentions className="w-full" placeholder="Borderless" variant="borderless" options={options} />
      <Mentions className="w-full" placeholder="Underlined" variant="underlined" options={options} />
    </div>
  );
}
