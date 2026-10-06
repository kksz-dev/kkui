import { Spin } from "@/components/ui/spin";
import { LoaderCircle } from "lucide-react";

export default function Custom() {
  return (
    <div className="flex items-center gap-6">
      <Spin indicator={<LoaderCircle className="size-6 text-primary animate-spin" />} />
    </div>
  );
}
