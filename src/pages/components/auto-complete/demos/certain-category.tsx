import { User } from "lucide-react";
import { AutoComplete } from "@/components/ui/auto-complete";
import { Input } from "@/components/ui/input";

const renderTitle = (title: string) => (
  <span>
    {title}
    <a className="float-right text-primary" href="https://www.google.com/search?q=KKUI" target="_blank" rel="noopener noreferrer">
      more
    </a>
  </span>
);

const renderItem = (title: string, count: number) => ({
  value: title,
  label: (
    <div className="flex justify-between">
      {title}
      <span className="flex items-center gap-1 text-text-tertiary">
        <User className="size-3.5" /> {count}
      </span>
    </div>
  ),
});

const options = [
  { label: renderTitle("Libraries"), options: [renderItem("KKUI", 10000), renderItem("KKUI Components", 10600)] },
  { label: renderTitle("Solutions"), options: [renderItem("KKUI Pro FAQ", 60100), renderItem("KKUI Enterprise FAQ", 30010)] },
  { label: renderTitle("Articles"), options: [renderItem("KKUI Design Guidelines", 100000)] },
];

export default function Demo() {
  return (
    <AutoComplete popupClassName="[&_[data-slot=select-group]]:overflow-visible" popupMatchSelectWidth={500} className="w-62.5" options={options} size="lg">
      <Input size="lg" placeholder="input here" />
    </AutoComplete>
  );
}
