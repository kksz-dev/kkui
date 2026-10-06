import { Carousel } from "@/components/ui/carousel";

export default function AutoplayDemo() {
  return (
    <div className="w-full max-w-xl">
      <Carousel autoplay={{ dotDuration: true }} autoplaySpeed={2500}>
        <div className="flex h-40 items-center justify-center bg-[#364d79] text-white text-2xl font-semibold rounded-md">
          Slide 1 (Autoplay)
        </div>
        <div className="flex h-40 items-center justify-center bg-[#364d79] text-white text-2xl font-semibold rounded-md">
          Slide 2 (Autoplay)
        </div>
        <div className="flex h-40 items-center justify-center bg-[#364d79] text-white text-2xl font-semibold rounded-md">
          Slide 3 (Autoplay)
        </div>
        <div className="flex h-40 items-center justify-center bg-[#364d79] text-white text-2xl font-semibold rounded-md">
          Slide 4 (Autoplay)
        </div>
      </Carousel>
    </div>
  );
}
