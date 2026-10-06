import * as React from "react";
import { Button } from "@/components/ui/button";
import { Toaster, toast, type ToastPosition } from "@/components/ui/toast";

const positions: ToastPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

export default function PositionDemo() {
  const [position, setPosition] = React.useState<ToastPosition>("bottom-right");

  return (
    <div className="flex flex-wrap gap-2">
      {positions.map((next) => (
        <Button
          key={next}
          size="sm"
          type={position === next ? "primary" : "default"}
          onClick={() => {
            setPosition(next);
            toast.info(next);
          }}
        >
          {next}
        </Button>
      ))}
      <Toaster position={position} />
    </div>
  );
}
