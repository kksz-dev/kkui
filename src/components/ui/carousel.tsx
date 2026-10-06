import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type DotPosition = "top" | "bottom" | "left" | "right";
export type CarouselEffect = "scrollx" | "fade";

export interface CarouselRef {
  goTo: (slide: number, dontAnimate?: boolean) => void;
  next: () => void;
  prev: () => void;
  autoPlay: (play?: boolean) => void;
}

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Autoplay slides automatically. If `{ dotDuration: true }`, active dot animates progress */
  autoplay?: boolean | { dotDuration?: boolean };
  /** Time in ms before next slide */
  autoplaySpeed?: number;
  /** Pause autoplay on hover (default true) */
  pauseOnHover?: boolean;
  /** Pause autoplay when hovering dots (default false) */
  pauseOnDotsHover?: boolean;
  /** Show navigation dots or customize class */
  dots?: boolean | { className?: string };
  /** Dot placement */
  dotPosition?: DotPosition;
  /** Transition effect: scrollx or fade */
  effect?: CarouselEffect;
  /** Show previous/next arrow overlay buttons or pass custom nodes */
  arrows?: boolean | { prevArrow?: React.ReactNode; nextArrow?: React.ReactNode };
  /** Infinite loop sliding */
  infinite?: boolean;
  /** Transition speed in ms (mapped onto embla's unitless duration) */
  speed?: number;
  /** Number of slides to show at once */
  slidesToShow?: number;
  /** Number of slides to scroll per step */
  slidesToScroll?: number;
  /** Allow mouse/touch drag */
  draggable?: boolean;
  /** Callback fired before slide transition */
  beforeChange?: (from: number, to: number) => void;
  /** Callback fired after slide transition finishes */
  afterChange?: (current: number) => void;
  /** Ref to access imperative methods (goTo, next, prev, autoPlay) */
  ref?: React.Ref<CarouselRef>;
}

export function Carousel({
  children,
  className,
  autoplay = false,
  autoplaySpeed = 3000,
  pauseOnHover = true,
  pauseOnDotsHover = false,
  dots = true,
  dotPosition = "bottom",
  effect = "scrollx",
  arrows = false,
  infinite = true,
  speed = 500,
  slidesToShow = 1,
  slidesToScroll = 1,
  draggable = true,
  beforeChange,
  afterChange,
  ref,
  style,
  ...props
}: CarouselProps) {
  const isVertical = dotPosition === "left" || dotPosition === "right";
  const isFade = effect === "fade";
  const dotDuration = typeof autoplay === "object" && autoplay.dotDuration;
  const isAutoplayEnabled = Boolean(autoplay);

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isDotsHovered, setIsDotsHovered] = React.useState(false);
  const [autoplayActive, setAutoplayActive] = React.useState(isAutoplayEnabled);

  // Turn React children into an array of slide elements
  const slides = React.useMemo(() => {
    return React.Children.toArray(children).filter(React.isValidElement);
  }, [children]);
  const slideCount = slides.length;

  // Embla instance for scrollx mode
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      axis: isVertical ? "y" : "x",
      loop: infinite,
      duration: speed / 10,
      watchDrag: draggable && !isFade,
      slidesToScroll,
      align: "start",
    },
    [],
  );

  const prevIndexRef = React.useRef(0);
  // Embla decides how many scroll snaps exist once slidesToShow/slidesToScroll are applied.
  const [snapCount, setSnapCount] = React.useState(0);

  React.useEffect(() => {
    if (!emblaApi) return;
    const sync = () => setSnapCount(emblaApi.scrollSnapList().length);
    sync();
    emblaApi.on("reInit", sync);
    return () => {
      emblaApi.off("reInit", sync);
    };
  }, [emblaApi]);

  const handleSelect = React.useCallback(() => {
    if (!emblaApi) return;
    const nextIdx = emblaApi.selectedScrollSnap();
    if (prevIndexRef.current !== nextIdx) {
      beforeChange?.(prevIndexRef.current, nextIdx);
      prevIndexRef.current = nextIdx;
    }
    setCurrentIndex(nextIdx);
    afterChange?.(nextIdx);
  }, [emblaApi, beforeChange, afterChange]);

  React.useEffect(() => {
    if (!emblaApi || isFade) return;
    emblaApi.on("select", handleSelect);
    emblaApi.on("reInit", handleSelect);
    return () => {
      emblaApi.off("select", handleSelect);
      emblaApi.off("reInit", handleSelect);
    };
  }, [emblaApi, isFade, handleSelect]);

  const goToSlide = React.useCallback(
    (index: number, dontAnimate = false) => {
      const target = (index + slideCount) % slideCount;
      if (isFade) {
        if (prevIndexRef.current !== target) {
          beforeChange?.(prevIndexRef.current, target);
          prevIndexRef.current = target;
        }
        setCurrentIndex(target);
        afterChange?.(target);
      } else if (emblaApi) {
        emblaApi.scrollTo(target, dontAnimate);
      }
    },
    [isFade, slideCount, beforeChange, afterChange, emblaApi],
  );

  const nextSlide = React.useCallback(() => {
    if (isFade) {
      goToSlide(currentIndex + 1);
    } else if (emblaApi) {
      if (infinite || emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      }
    }
  }, [isFade, currentIndex, goToSlide, emblaApi, infinite]);

  const prevSlide = React.useCallback(() => {
    if (isFade) {
      goToSlide(currentIndex - 1);
    } else if (emblaApi) {
      if (infinite || emblaApi.canScrollPrev()) {
        emblaApi.scrollPrev();
      }
    }
  }, [isFade, currentIndex, goToSlide, emblaApi, infinite]);

  // Imperative handle
  React.useImperativeHandle(
    ref,
    () => ({
      goTo: (slide: number, dontAnimate?: boolean) => goToSlide(slide, dontAnimate),
      next: () => nextSlide(),
      prev: () => prevSlide(),
      autoPlay: (play?: boolean) => setAutoplayActive(play ?? true),
    }),
    [goToSlide, nextSlide, prevSlide],
  );

  // Autoplay timer
  React.useEffect(() => {
    if (!autoplayActive || slideCount <= 1) return;
    if (pauseOnHover && isHovered) return;
    if (pauseOnDotsHover && isDotsHovered) return;

    const timer = window.setInterval(() => {
      nextSlide();
    }, autoplaySpeed);

    return () => window.clearInterval(timer);
  }, [autoplayActive, slideCount, pauseOnHover, isHovered, pauseOnDotsHover, isDotsHovered, autoplaySpeed, nextSlide]);

  const showDots = dots !== false && slideCount > 1;
  const dotsClassName = typeof dots === "object" ? dots.className : undefined;

  const showArrows = Boolean(arrows) && slideCount > 1;
  const customPrev = typeof arrows === "object" ? arrows.prevArrow : null;
  const customNext = typeof arrows === "object" ? arrows.nextArrow : null;

  return (
    <div
      data-slot="carousel"
      className={cn("group relative w-full overflow-hidden select-none", className)}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* Slides Container */}
      {isFade ? (
        <div className="relative w-full overflow-hidden" style={{ minHeight: "100%" }}>
          {slides.map((child, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={idx}
                className={cn(
                  "w-full transition-opacity ease-in-out",
                  isActive ? "relative z-10 opacity-100" : "absolute inset-0 z-0 opacity-0 pointer-events-none",
                )}
                style={{ transitionDuration: `${speed}ms` }}
              >
                {child}
              </div>
            );
          })}
        </div>
      ) : (
        <div ref={emblaRef} data-slot="carousel-viewport" className="w-full overflow-hidden">
          <div
            data-slot="carousel-track"
            className={cn(
              "flex",
              isVertical ? "flex-col" : "flex-row",
            )}
            style={{
              height: isVertical ? "100%" : undefined,
            }}
          >
            {slides.map((child, idx) => (
              <div
                key={idx}
                data-slot="carousel-slide"
                className="shrink-0 grow-0 min-w-0"
                style={{
                  flexBasis: `${100 / slidesToShow}%`,
                }}
              >
                {child}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Arrows */}
      {showArrows && (
        <>
          <div
            role="button"
            tabIndex={0}
            aria-label="Previous Slide"
            data-slot="carousel-prev"
            onClick={prevSlide}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                prevSlide();
              }
            }}
            className={cn(
              "absolute z-20 flex cursor-pointer items-center justify-center transition-all duration-mid",
              isVertical
                ? "top-3 left-1/2 -translate-x-1/2 rotate-90"
                : "left-3 top-1/2 -translate-y-1/2",
              "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
            )}
          >
            {customPrev ?? (
              <div className="flex size-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-xs hover:bg-black/50 active:scale-95 transition-all">
                <ChevronLeft className="size-4" />
              </div>
            )}
          </div>
          <div
            role="button"
            tabIndex={0}
            aria-label="Next Slide"
            data-slot="carousel-next"
            onClick={nextSlide}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                nextSlide();
              }
            }}
            className={cn(
              "absolute z-20 flex cursor-pointer items-center justify-center transition-all duration-mid",
              isVertical
                ? "bottom-3 left-1/2 -translate-x-1/2 rotate-90"
                : "right-3 top-1/2 -translate-y-1/2",
              "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
            )}
          >
            {customNext ?? (
              <div className="flex size-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-xs hover:bg-black/50 active:scale-95 transition-all">
                <ChevronRight className="size-4" />
              </div>
            )}
          </div>
        </>
      )}

      {/* Dot Indicators */}
      {showDots && (
        <ul
          role="tablist"
          aria-label="Carousel pagination"
          data-slot="carousel-dots"
          onMouseEnter={() => setIsDotsHovered(true)}
          onMouseLeave={() => setIsDotsHovered(false)}
          className={cn(
            "absolute z-20 flex items-center gap-1.5 p-0 m-0 list-none",
            dotPosition === "bottom" && "bottom-3 left-1/2 -translate-x-1/2 flex-row",
            dotPosition === "top" && "top-3 left-1/2 -translate-x-1/2 flex-row",
            dotPosition === "left" && "left-3 top-1/2 -translate-y-1/2 flex-col",
            dotPosition === "right" && "right-3 top-1/2 -translate-y-1/2 flex-col",
            dotsClassName,
          )}
        >
          {Array.from({ length: isFade ? slideCount : snapCount || slideCount }).map((_, idx) => {
            const isActive = idx === currentIndex;
            return (
              <li
                key={idx}
                role="tab"
                data-slot="carousel-dot"
                data-active={isActive || undefined}
                aria-selected={isActive}
                onClick={() => goToSlide(idx)}
                className="cursor-pointer py-1 px-0.5"
              >
                <div
                  className={cn(
                    "relative overflow-hidden rounded-xs transition-all duration-300",
                    isVertical
                      ? cn("w-[3px]", isActive ? "h-6 bg-white" : "h-4 bg-white/30 hover:bg-white/50")
                      : cn("h-[3px]", isActive ? "w-6 bg-white" : "w-4 bg-white/30 hover:bg-white/50"),
                  )}
                >
                  {isActive && dotDuration && autoplayActive && !isHovered && (
                    <span
                      key={currentIndex}
                      className={cn(
                        "absolute inset-0 bg-primary origin-left animate-in",
                        isVertical ? "origin-top" : "origin-left",
                      )}
                      style={{
                        animation: `${isVertical ? "carousel-progress-vertical" : "carousel-progress"} ${autoplaySpeed}ms linear infinite`,
                      }}
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
