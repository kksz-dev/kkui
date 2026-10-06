import { ImagePreviewGroup } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import * as React from "react";

export default function PreviewGroupItemsDemo() {
  const [visible, setVisible] = React.useState(false);

  const items = [
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setVisible(true)}>
        Preview 3 Photos
      </Button>
      <ImagePreviewGroup
        items={items}
        preview={{
          visible,
          onVisibleChange: (val) => setVisible(val),
        }}
      />
    </div>
  );
}
