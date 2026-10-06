import { Copy, Search } from "lucide-react";
import { SpaceCompact } from "@/components/ui/space";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Demo() {
  return (
    <div className="flex flex-col items-start gap-4">
      <SpaceCompact block>
        <Input className="w-1/5" defaultValue="0571" />
        <Input className="w-[30%]" defaultValue="26888888" />
      </SpaceCompact>
      <SpaceCompact block>
        <Input className="w-[calc(100%-200px)]" defaultValue="https://kkui.kksz.dev" />
        <Button type="primary">Submit</Button>
      </SpaceCompact>
      <SpaceCompact block>
        <Input className="w-[calc(100%-200px)]" defaultValue="git@github.com:kksz-dev/kkui.git" />
        <Button icon={<Copy />} aria-label="Copy" />
      </SpaceCompact>
      <SpaceCompact>
        <Input placeholder="Search" />
        <Button type="primary" icon={<Search />} aria-label="Search" />
      </SpaceCompact>
      <SpaceCompact>
        <Button>Cancel</Button>
        <Button type="primary">Submit</Button>
      </SpaceCompact>
      <SpaceCompact direction="vertical">
        <Button>Button 1</Button>
        <Button>Button 2</Button>
        <Button>Button 3</Button>
      </SpaceCompact>
    </div>
  );
}
