import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Button type="primary" shape="circle" icon={<Search />} />
        <Button type="primary" shape="circle">A</Button>
        <Button type="primary" icon={<Search />}>Search</Button>
        <Button shape="circle" icon={<Search />} />
        <Button icon={<Search />}>Search</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button shape="circle" icon={<Search />} />
        <Button icon={<Search />}>Search</Button>
        <Button type="dashed" shape="circle" icon={<Search />} />
        <Button type="dashed" icon={<Search />}>Search</Button>
        <Button icon={<Search />} href="https://www.google.com" target="_blank" />
        <Button type="primary" icon={<Search />} iconPosition="end">Search</Button>
      </div>
    </div>
  );
}
