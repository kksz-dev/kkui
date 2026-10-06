import { notification } from "@/components/ui/notification";
import { Button } from "@/components/ui/button";

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() =>
          notification.open({
            message: "Wider card",
            description: "className and style land on the card itself.",
            className: "border-primary-border bg-primary-bg",
            style: { width: 420 },
          })
        }
      >
        Custom style
      </Button>
      <Button
        onClick={() =>
          notification.open({
            message: "No close button",
            description: "closeIcon={false} hides it; the card closes on its own.",
            closeIcon: false,
          })
        }
      >
        Without close icon
      </Button>
    </div>
  );
}
