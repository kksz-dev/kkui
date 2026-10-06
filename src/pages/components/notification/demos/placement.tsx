import type { NotificationPlacement } from "@/components/ui/notification";
import { notification } from "@/components/ui/notification";
import { Button } from "@/components/ui/button";

const placements: NotificationPlacement[] = ["topLeft", "top", "topRight", "bottomLeft", "bottom", "bottomRight"];

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-2">
      {placements.map((placement) => (
        <Button
          key={placement}
          onClick={() =>
            notification.info({
              message: `Placement: ${placement}`,
              description: "top / bottom offsets come from notification.config().",
              placement,
            })
          }
        >
          {placement}
        </Button>
      ))}
    </div>
  );
}
