import { Image, ImagePreviewGroup } from "@/components/ui/image";

export default function PreviewGroupDemo() {
  return (
    <ImagePreviewGroup>
      <div className="flex flex-wrap gap-3">
        <Image
          width={160}
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
          alt="Nature 1"
          className="rounded-md"
        />
        <Image
          width={160}
          src="https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=600&q=80"
          alt="Nature 2"
          className="rounded-md"
        />
        <Image
          width={160}
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80"
          alt="Nature 3"
          className="rounded-md"
        />
      </div>
    </ImagePreviewGroup>
  );
}
