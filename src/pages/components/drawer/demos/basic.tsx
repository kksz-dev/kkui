import { useState } from "react";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Open Drawer
      </Button>
      <Drawer
        title="Basic Drawer"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
      >
        <p>Some contents in drawer...</p>
        <p>Some contents in drawer...</p>
      </Drawer>
    </>
  );
}