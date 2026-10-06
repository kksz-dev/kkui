import { InputSearch } from "@/components/ui/input";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <InputSearch placeholder="input search loading default" loading />
      <InputSearch placeholder="input search loading with enterButton" loading enterButton />
      <InputSearch placeholder="input search text" enterButton="Search" size="lg" loading />
    </div>
  );
}
