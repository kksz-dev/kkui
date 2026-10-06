import { message } from "@/components/ui/message";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const openManual = () => {
    // duration 0 keeps the toast until it is closed — it gets its own close button
    const close = message.open({
      content: "Click me, or use the ✕ to dismiss",
      duration: 0,
      onClick: () => close(),
      onClose: () => message.info("Closed, and onClose ran"),
    });
  };

  return <Button onClick={openManual}>Persistent message</Button>;
}
