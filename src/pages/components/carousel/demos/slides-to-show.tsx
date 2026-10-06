import { Carousel } from "@/components/ui/carousel";

export default function SlidesToShowDemo() {
  return (
    <div className="w-full max-w-xl">
      <Carousel slidesToShow={3} slidesToScroll={1} arrows>
        <div className="p-2">
          <div className="flex h-32 items-center justify-center bg-[#364d79] text-white text-xl font-semibold rounded-md">
            1
          </div>
        </div>
        <div className="p-2">
          <div className="flex h-32 items-center justify-center bg-[#13c2c2] text-white text-xl font-semibold rounded-md">
            2
          </div>
        </div>
        <div className="p-2">
          <div className="flex h-32 items-center justify-center bg-[#722ed1] text-white text-xl font-semibold rounded-md">
            3
          </div>
        </div>
        <div className="p-2">
          <div className="flex h-32 items-center justify-center bg-[#fa8c16] text-white text-xl font-semibold rounded-md">
            4
          </div>
        </div>
        <div className="p-2">
          <div className="flex h-32 items-center justify-center bg-[#52c41a] text-white text-xl font-semibold rounded-md">
            5
          </div>
        </div>
      </Carousel>
    </div>
  );
}
