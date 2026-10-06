import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [inputValue, setInputValue] = useState(1);

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <Slider
          min={1}
          max={20}
          value={inputValue}
          onChange={setInputValue}
        />
      </div>
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          disabled={inputValue <= 1}
          onClick={() => setInputValue((v) => Math.max(1, v - 1))}
        >
          -
        </Button>
        <span className="w-8 text-center font-mono text-sm font-medium">{inputValue}</span>
        <Button
          size="sm"
          disabled={inputValue >= 20}
          onClick={() => setInputValue((v) => Math.min(20, v + 1))}
        >
          +
        </Button>
      </div>
    </div>
  );
}
