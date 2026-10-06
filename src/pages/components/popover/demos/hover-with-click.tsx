import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover } from "@/components/ui/popover";

export default function Demo() {
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const hide = () => {
    setClicked(false);
    setHovered(false);
  };

  return (
    <Popover
      content="This is hover content."
      title="Hover title"
      trigger="hover"
      open={hovered}
      onOpenChange={(v) => setHovered(v && !clicked)}
    >
      <Popover
        content={
          <div>
            This is click content.
            <button type="button" className="ml-2 text-primary hover:text-primary-hover" onClick={hide}>
              Close
            </button>
          </div>
        }
        title="Click title"
        trigger="click"
        open={clicked}
        onOpenChange={(v) => {
          setClicked(v);
          setHovered(false);
        }}
      >
        <Button>Hover and click / 悬停并单击</Button>
      </Popover>
    </Popover>
  );
}
