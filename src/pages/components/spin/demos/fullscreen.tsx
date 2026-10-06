import * as React from "react";
import { Spin } from "@/components/ui/spin";
import { Button } from "@/components/ui/button";

export default function Fullscreen() {
  const [spinning, setSpinning] = React.useState(false);

  const showFullscreen = () => {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 2000);
  };

  return (
    <div>
      <Button type="primary" onClick={showFullscreen}>
        Show Fullscreen Spin (2s)
      </Button>
      <Spin fullscreen spinning={spinning} tip="Loading page resources..." />
    </div>
  );
}
