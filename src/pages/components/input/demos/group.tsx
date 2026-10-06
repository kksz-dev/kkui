import { Copy } from "lucide-react";
import { Input, InputGroup, InputSearch } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <InputGroup compact>
        <Input className="w-1/5" defaultValue="0571" />
        <Input className="w-3/5" defaultValue="26888888" />
      </InputGroup>
      <InputGroup compact>
        <Input className="w-[calc(100%_-_200px)]" defaultValue="https://kkui.kksz.dev" />
        <Button type="primary">Submit</Button>
      </InputGroup>
      <InputGroup compact>
        <Input className="w-[calc(100%_-_200px)]" defaultValue="git@github.com:kksz-dev/kkui.git" />
        <Button icon={<Copy />} aria-label="copy" />
      </InputGroup>
      <InputGroup compact>
        <Input className="w-1/2" defaultValue="input content" />
        <InputSearch className="w-1/2" placeholder="search" enterButton />
      </InputGroup>
      <InputGroup>
        <Input placeholder="not compact" />
        <Input placeholder="gap between" />
      </InputGroup>
    </div>
  );
}
