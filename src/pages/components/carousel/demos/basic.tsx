import { Carousel } from "@/components/ui/carousel";

export default function BasicDemo() {
  const onChange = (current: number) => {
    console.log("Carousel changed to slide:", current);
  };

  return (
    <div className="w-full max-w-xl">
      <Carousel afterChange={onChange}>
        <div className="flex h-40 items-center justify-center bg-[#364d79] text-white text-2xl font-semibold rounded-md">
          1
        </div>
        <div className="flex h-40 items-center justify-center bg-[#364d79] text-white text-2xl font-semibold rounded-md">
          2
        </div>
        <div className="flex h-40 items-center justify-center bg-[#364d79] text-white text-2xl font-semibold rounded-md">
          3
        </div>
        <div className="flex h-40 items-center justify-center bg-[#364d79] text-white text-2xl font-semibold rounded-md">
          4
        </div>
      </Carousel>
    </div>
  );
}
