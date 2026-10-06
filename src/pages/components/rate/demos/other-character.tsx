import { Rate } from "@/components/ui/rate";
import { Heart } from "lucide-react";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <Rate character={<Heart className="size-5 fill-current stroke-none" />} allowHalf defaultValue={2.5} />
      <Rate character="A" allowHalf defaultValue={2.5} className="text-lg font-bold" />
      <Rate character="好" defaultValue={2} />
    </div>
  );
}
