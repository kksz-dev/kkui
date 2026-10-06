import * as React from "react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";

export default function PlaceholderDemo() {
  const [random, setRandom] = React.useState(Date.now());

  return (
    <div className="space-y-4">
      <Button onClick={() => setRandom(Date.now())}>Reload Image</Button>
      <div>
        <Image
          key={random}
          width={200}
          height={150}
          src={`https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80&t=${random}`}
          placeholder={
            <div className="flex size-full items-center justify-center bg-fill-tertiary text-xs text-text-tertiary">
              Loading...
            </div>
          }
          className="rounded-md shadow-sm"
        />
      </div>
    </div>
  );
}
