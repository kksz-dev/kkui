import { Carousel } from "@/components/ui/carousel";

export default function ArrowsDemo() {
  return (
    <div className="w-full max-w-xl">
      <Carousel arrows>
        <div className="flex h-40 items-center justify-center bg-[#364d79] text-white text-2xl font-semibold rounded-md">
          Slide 1
        </div>
        <div className="flex h-40 items-center justify-center bg-[#364d79] text-white text-2xl font-semibold rounded-md">
          Slide 2
        </div>
        <div className="flex h-40 items-center justify-center bg-[#364d79] text-white text-2xl font-semibold rounded-md">
          Slide 3
        </div>
        <div className="flex h-40 items-center justify-center bg-[#364d79] text-white text-2xl font-semibold rounded-md">
          Slide 4
        </div>
      </Carousel>
    </div>
  );
}
