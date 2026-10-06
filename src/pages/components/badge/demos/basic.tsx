import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Box = () => <span className="block size-10 rounded-md bg-fill-secondary" />;

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Badge count={5}>
        <Box />
      </Badge>
      <Badge count={0} showZero>
        <Box />
      </Badge>
      <Badge count={<Clock className="size-3.5 text-error" />}>
        <Box />
      </Badge>
    </div>
  );
}
