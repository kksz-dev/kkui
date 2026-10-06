import { useState } from "react";
import { Affix } from "@/components/ui/affix";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [top, setTop] = useState(100);
  const [bottom, setBottom] = useState(100);

  return (
    <div className="flex flex-col gap-4">
      <Affix offsetTop={top}>
        <Button type="primary" onClick={() => setTop(top + 10)}>
          Affix top
        </Button>
      </Affix>
      <Affix offsetBottom={bottom}>
        <Button type="primary" onClick={() => setBottom(bottom + 10)}>
          Affix bottom
        </Button>
      </Affix>
    </div>
  );
}
