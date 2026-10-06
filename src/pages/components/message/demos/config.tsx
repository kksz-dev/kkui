import { message } from "@/components/ui/message";
import { Button } from "@/components/ui/button";

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() => {
          message.config({ top: 120, maxCount: 3, duration: 2 });
          message.info("top: 120, maxCount: 3");
        }}
      >
        Apply config
      </Button>
      <Button
        onClick={() => {
          message.config({ top: 16, maxCount: undefined, duration: 3 });
          message.info("Back to the defaults");
        }}
      >
        Reset
      </Button>
      <Button
        onClick={() => {
          for (let i = 1; i <= 5; i += 1) message.info(`Message #${i}`);
        }}
      >
        Fire 5 messages
      </Button>
    </div>
  );
}
