import { Carousel } from "@/components/ui/carousel";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";

export default function CustomArrowsDemo() {
  return (
    <div className="w-full max-w-xl">
      <Carousel
        arrows={{
          prevArrow: (
            <button className="flex size-9 items-center justify-center rounded-full bg-white/80 text-text shadow-kk hover:bg-white transition-all">
              <ArrowLeftCircle className="size-5 text-primary" />
            </button>
          ),
          nextArrow: (
            <button className="flex size-9 items-center justify-center rounded-full bg-white/80 text-text shadow-kk hover:bg-white transition-all">
              <ArrowRightCircle className="size-5 text-primary" />
            </button>
          ),
        }}
      >
        <div className="flex h-40 items-center justify-center bg-[#1677ff] text-white text-2xl font-semibold rounded-md">
          Custom Arrow 1
        </div>
        <div className="flex h-40 items-center justify-center bg-[#52c41a] text-white text-2xl font-semibold rounded-md">
          Custom Arrow 2
        </div>
        <div className="flex h-40 items-center justify-center bg-[#fa8c16] text-white text-2xl font-semibold rounded-md">
          Custom Arrow 3
        </div>
      </Carousel>
    </div>
  );
}
