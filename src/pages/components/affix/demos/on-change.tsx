import { useState } from "react";
import { Affix } from "@/components/ui/affix";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [affixed, setAffixed] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <Affix offsetTop={120} onChange={(v) => setAffixed(v)}>
        <Button>120px to affix top</Button>
      </Affix>
      <span className="text-sm text-text-secondary">
        affixed: <span className="font-mono">{String(affixed)}</span>
      </span>
    </div>
  );
}
