import { useState } from "react";
import { Minus, Plus, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonGroup } from "@/components/ui/button";

const Box = () => <span className="block size-10 rounded-md bg-fill-secondary" />;

export default function Demo() {
  const [count, setCount] = useState(5);
  const [show, setShow] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Badge count={count}>
          <Box />
        </Badge>
        <ButtonGroup>
          <Button icon={<Minus />} onClick={() => setCount((c) => Math.max(0, c - 1))} />
          <Button icon={<Plus />} onClick={() => setCount((c) => c + 1)} />
          <Button icon={<RefreshCw />} onClick={() => setCount(Math.floor(Math.random() * 100))} />
        </ButtonGroup>
      </div>
      <div className="flex items-center gap-4">
        <Badge dot={show}>
          <Box />
        </Badge>
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} className="accent-primary" />
          Show dot
        </label>
      </div>
    </div>
  );
}
