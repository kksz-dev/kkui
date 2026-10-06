import { Image } from "@/components/ui/image";

export default function BasicDemo() {
  return (
    <Image
      width={200}
      src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80"
      alt="Scenic Landscape"
      className="rounded-md shadow-sm"
    />
  );
}
