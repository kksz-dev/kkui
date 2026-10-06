import { notification } from "@/components/ui/notification";
import { Button } from "@/components/ui/button";

export default function Demo() {
  return (
    <Button
      onClick={() =>
        notification.info({
          message: "Timer bar",
          description: "showProgress draws the remaining time; hovering pauses it.",
          duration: 8,
          showProgress: true,
          pauseOnHover: true,
        })
      }
    >
      Show progress
    </Button>
  );
}
