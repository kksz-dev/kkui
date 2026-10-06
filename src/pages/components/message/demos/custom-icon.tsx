import { Rocket, Bell } from "lucide-react";
import { message } from "@/components/ui/message";
import { Button } from "@/components/ui/button";

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() =>
          message.open({ content: "Deployment started", icon: <Rocket className="size-4 text-primary" /> })
        }
      >
        Rocket
      </Button>
      <Button
        onClick={() =>
          message.open({ content: "You have a new reminder", icon: <Bell className="size-4 text-warning" /> })
        }
      >
        Bell
      </Button>
    </div>
  );
}
