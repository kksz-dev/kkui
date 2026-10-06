import { Image } from "@/components/ui/image";
import { ZoomIn } from "lucide-react";

export default function CustomMaskDemo() {
  return (
    <Image
      width={200}
      src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80"
      alt="Neon lights"
      className="rounded-md shadow-sm"
      preview={{
        mask: (
          <div className="flex items-center gap-1.5 text-sm font-medium text-white">
            <ZoomIn className="size-4" />
            <span>Click to Enlarge</span>
          </div>
        ),
      }}
    />
  );
}
