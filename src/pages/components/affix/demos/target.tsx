import { useRef } from "react";
import { Affix } from "@/components/ui/affix";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const container = useRef<HTMLDivElement>(null);

  return (
    <div ref={container} className="h-[100px] overflow-y-auto rounded-md bg-fill-quaternary kk-scrollbar">
      <div className="h-[400px] pt-[60px] pl-2">
        <Affix target={() => container.current} offsetTop={0}>
          <Button type="primary">Fixed at the top of container</Button>
        </Affix>
      </div>
    </div>
  );
}
