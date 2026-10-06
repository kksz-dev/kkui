import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [visible, setVisible] = useState(true);
  return (
    <div className="flex flex-col gap-4">
      {visible && (
        <Alert
          message="Alert Message Text"
          type="success"
          closable
          afterClose={() => setVisible(false)}
        />
      )}
      <p className="text-text-secondary">placeholder text here</p>
      <Button type="primary" disabled={visible} onClick={() => setVisible(true)} className="self-start">
        Reset
      </Button>
    </div>
  );
}
