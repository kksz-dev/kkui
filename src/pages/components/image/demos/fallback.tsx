import { Image } from "@/components/ui/image";

export default function FallbackDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <Image
        width={200}
        src="https://invalid-image-url-error.png"
        fallback="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80"
        alt="Fallback example"
        className="rounded-md shadow-sm"
      />
    </div>
  );
}
