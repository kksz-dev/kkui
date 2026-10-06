import { AudioLines } from "lucide-react";
import { InputSearch } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const onSearch = (value: string) => console.log(value);
  return (
    <div className="flex flex-col gap-3">
      <InputSearch placeholder="input search text" onSearch={onSearch} className="w-52" />
      <InputSearch placeholder="input search text" allowClear onSearch={onSearch} className="w-52" />
      <InputSearch addonBefore="https://" placeholder="input search text" allowClear onSearch={onSearch} className="w-80" />
      <InputSearch placeholder="input search text" onSearch={onSearch} enterButton />
      <InputSearch placeholder="input search text" enterButton="Search" size="lg" onSearch={onSearch} />
      <InputSearch
        placeholder="input search text"
        enterButton="Search"
        size="lg"
        suffix={<AudioLines className="text-primary" />}
        onSearch={onSearch}
      />
      <InputSearch placeholder="input search text" enterButton={<Button danger>Custom</Button>} onSearch={onSearch} />
    </div>
  );
}
