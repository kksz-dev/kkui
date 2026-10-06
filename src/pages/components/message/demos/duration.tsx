import { message } from "@/components/ui/message";
import { Button } from "@/components/ui/button";

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() =>
          message.success("This message stays for 10 seconds", 10, () =>
            message.info("…and this fired from onClose"),
          )
        }
      >
        10s duration
      </Button>
      <Button onClick={() => message.info({ content: "Hover me to pause the timer", duration: 5 })}>
        Pause on hover
      </Button>
    </div>
  );
}
