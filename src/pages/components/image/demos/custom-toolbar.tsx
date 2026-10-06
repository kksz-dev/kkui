import { Image } from "@/components/ui/image";
import { Download } from "lucide-react";

export default function CustomToolbarDemo() {
  return (
    <Image
      width={200}
      src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80"
      alt="Colorful paint"
      className="rounded-md shadow-sm"
      preview={{
        toolbarRender: (originalNode, { image }) => (
          <div className="flex items-center gap-3">
            {originalNode}
            <a
              href={image.url}
              download="preview-image.jpg"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs text-white shadow-lg hover:bg-primary-hover transition-colors"
            >
              <Download className="size-3.5" />
              <span>Download</span>
            </a>
          </div>
        ),
      }}
    />
  );
}
