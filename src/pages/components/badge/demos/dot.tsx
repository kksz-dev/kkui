import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Badge dot>
        <Bell className="size-4 text-text-secondary" />
      </Badge>
      <Badge count={0} dot>
        <Bell className="size-4 text-text-secondary" />
      </Badge>
      <Badge dot>
        <a href="#" className="text-primary hover:text-primary-hover">
          Link something
        </a>
      </Badge>
    </div>
  );
}
