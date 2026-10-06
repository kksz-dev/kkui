import { Image } from "@/components/ui/image";

export default function NoPreviewDemo() {
  return (
    <Image
      width={200}
      src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"
      alt="Coding on laptop"
      preview={false}
      className="rounded-md shadow-sm"
    />
  );
}
