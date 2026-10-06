import { notification } from "@/components/ui/notification";
import { Button } from "@/components/ui/button";

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() =>
          notification.warning({
            message: "Sticky notice",
            description: "duration: 0 — this one waits for you.",
            duration: 0,
            onClose: () => notification.info({ message: "Closed", duration: 2 }),
          })
        }
      >
        Never auto close
      </Button>
      <Button onClick={() => notification.destroy()}>Destroy all</Button>
    </div>
  );
}
