import { Rocket } from "lucide-react";
import { notification } from "@/components/ui/notification";
import { Button } from "@/components/ui/button";

export default function Demo() {
  return (
    <Button
      onClick={() =>
        notification.open({
          message: "Deploy started",
          description: "Build #482 is on its way to production.",
          icon: <Rocket className="mt-0.5 size-5 text-primary" />,
        })
      }
    >
      Custom icon
    </Button>
  );
}
