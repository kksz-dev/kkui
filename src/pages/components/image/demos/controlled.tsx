import * as React from "react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";

export default function ControlledDemo() {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="space-y-4">
      <Button type="primary" onClick={() => setVisible(true)}>
        Open Preview Outside
      </Button>
      <div>
        <Image
          width={200}
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
          alt="Abstract geometry"
          preview={{
            visible,
            onVisibleChange: (value) => setVisible(value),
          }}
          className="rounded-md"
        />
      </div>
    </div>
  );
}
