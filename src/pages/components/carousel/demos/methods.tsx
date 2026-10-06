import * as React from "react";
import { Carousel, type CarouselRef } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

export default function MethodsDemo() {
  const carouselRef = React.useRef<CarouselRef>(null);

  return (
    <div className="w-full max-w-xl space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => carouselRef.current?.prev()}>Previous</Button>
        <Button onClick={() => carouselRef.current?.next()}>Next</Button>
        <Button onClick={() => carouselRef.current?.goTo(2)}>Go to Slide 3</Button>
      </div>

      <Carousel ref={carouselRef} dots={{ className: "bottom-2" }}>
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
