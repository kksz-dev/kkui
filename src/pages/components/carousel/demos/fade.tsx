import { Carousel } from "@/components/ui/carousel";

export default function FadeDemo() {
  return (
    <div className="w-full max-w-xl">
      <Carousel effect="fade" autoplay autoplaySpeed={3000}>
        <div className="flex h-40 items-center justify-center bg-primary text-white text-2xl font-semibold rounded-md">
          Fade 1
        </div>
        <div className="flex h-40 items-center justify-center bg-[#364d79] text-white text-2xl font-semibold rounded-md">
          Fade 2
        </div>
        <div className="flex h-40 items-center justify-center bg-[#13c2c2] text-white text-2xl font-semibold rounded-md">
          Fade 3
        </div>
        <div className="flex h-40 items-center justify-center bg-[#722ed1] text-white text-2xl font-semibold rounded-md">
          Fade 4
        </div>
      </Carousel>
    </div>
  );
}
