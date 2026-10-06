import * as React from "react";
import { Portal } from "@/components/ui/portal";
import {
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  RotateCcw as ResetIcon,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ImageTransform {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  flipX: boolean;
  flipY: boolean;
}

export interface ImageActions {
  onFlipY: () => void;
  onFlipX: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onReset: () => void;
  onClose: () => void;
  onActive?: (current: number) => void;
}

export interface ImagePreviewConfig {
  visible?: boolean;
  onVisibleChange?: (visible: boolean, prevVisible: boolean) => void;
  src?: string;
  mask?: React.ReactNode;
  maskClassName?: string;
  scaleStep?: number;
  minScale?: number;
  maxScale?: number;
  toolbarRender?: (
    originalNode: React.ReactNode,
    info: {
      transform: ImageTransform;
      actions: ImageActions;
      current: number;
      total: number;
      image: { url: string; alt?: string };
    },
  ) => React.ReactNode;
  imageRender?: (
    originalNode: React.ReactNode,
    info: {
      transform: ImageTransform;
      image: { url: string; alt?: string };
    },
  ) => React.ReactNode;
  movable?: boolean;
  closeIcon?: React.ReactNode;
  destroyOnHidden?: boolean;
  zIndex?: number;
  countRender?: (current: number, total: number) => React.ReactNode;
}

export interface ImageProps extends Omit<React.ComponentProps<"img">, "placeholder"> {
  /** Image source */
  src?: string;
  /** Image alt */
  alt?: string;
  /** Width of the image */
  width?: number | string;
  /** Height of the image */
  height?: number | string;
  /** Fallback image URL when src fails to load */
  fallback?: string;
  /** Placeholder node or boolean skeleton while loading */
  placeholder?: boolean | React.ReactNode;
  /** Preview config or boolean to enable/disable preview */
  preview?: boolean | ImagePreviewConfig;
  /** Wrapper container class */
  rootClassName?: string;
  /** Image element class */
  className?: string;
  /** Wrapper container style */
  rootStyle?: React.CSSProperties;
  /** Callback when image loads */
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
  /** Callback when image fails to load */
  onError?: React.ReactEventHandler<HTMLImageElement>;
}

export interface PreviewGroupItem {
  src: string;
  alt?: string;
  crossOrigin?: string;
}

export interface ImagePreviewGroupConfig extends ImagePreviewConfig {
  current?: number;
  onChange?: (current: number, prev: number) => void;
}

export interface ImagePreviewGroupProps {
  /** List of images to preview */
  items?: (string | PreviewGroupItem)[];
  /** Preview configuration */
  preview?: boolean | ImagePreviewGroupConfig;
  children?: React.ReactNode;
}

// Context for PreviewGroup
interface ImageGroupContextType {
  isPreviewGroup: boolean;
  registerImage: (id: string, data: { src: string; alt?: string }) => void;
  unregisterImage: (id: string) => void;
  openPreview: (id: string) => void;
}

const ImageGroupContext = React.createContext<ImageGroupContextType | null>(null);

const initialTransform: ImageTransform = {
  x: 0,
  y: 0,
  rotate: 0,
  scale: 1,
  flipX: false,
  flipY: false,
};

/**
 * Preview Modal Dialog Component
 */
interface PreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: { url: string; alt?: string }[];
  currentIndex: number;
  onIndexChange?: (index: number) => void;
  previewConfig?: ImagePreviewConfig;
}

function PreviewModal({
  open,
  onOpenChange,
  images,
  currentIndex,
  onIndexChange,
  previewConfig,
}: PreviewModalProps) {
  const [transform, setTransform] = React.useState<ImageTransform>(initialTransform);
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStartRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const scaleStep = previewConfig?.scaleStep ?? 0.5;
  const minScale = previewConfig?.minScale ?? 1;
  const maxScale = previewConfig?.maxScale ?? 50;
  const movable = previewConfig?.movable ?? true;
  const zIndex = previewConfig?.zIndex ?? 1050;

  // Reset transform when slide changes or modal opens
  React.useEffect(() => {
    if (open) {
      setTransform(initialTransform);
    }
  }, [open, currentIndex]);

  const currentImage = images[currentIndex] || { url: "", alt: "" };
  const total = images.length;

  const actions: ImageActions = React.useMemo(
    () => ({
      onFlipX: () => setTransform((t) => ({ ...t, flipX: !t.flipX })),
      onFlipY: () => setTransform((t) => ({ ...t, flipY: !t.flipY })),
      onRotateLeft: () => setTransform((t) => ({ ...t, rotate: t.rotate - 90 })),
      onRotateRight: () => setTransform((t) => ({ ...t, rotate: t.rotate + 90 })),
      onZoomIn: () =>
        setTransform((t) => ({ ...t, scale: Math.min(maxScale, t.scale + scaleStep) })),
      onZoomOut: () =>
        setTransform((t) => ({
          ...t,
          scale: Math.max(minScale, t.scale - scaleStep),
          x: t.scale - scaleStep <= 1 ? 0 : t.x,
          y: t.scale - scaleStep <= 1 ? 0 : t.y,
        })),
      onReset: () => setTransform(initialTransform),
      onClose: () => onOpenChange(false),
      onActive: (idx) => onIndexChange?.(idx),
    }),
    [maxScale, minScale, scaleStep, onOpenChange, onIndexChange],
  );

  const prevImage = () => {
    if (total <= 1) return;
    const prev = (currentIndex - 1 + total) % total;
    onIndexChange?.(prev);
  };

  const nextImage = () => {
    if (total <= 1) return;
    const next = (currentIndex + 1) % total;
    onIndexChange?.(next);
  };

  // Keyboard navigation & wheel zoom
  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevImage();
      } else if (e.key === "ArrowRight") {
        nextImage();
      } else if (e.key === "Escape") {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, currentIndex, total, onOpenChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!movable || transform.scale <= 1) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - transform.x,
      y: e.clientY - transform.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTransform((t) => ({
      ...t,
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      actions.onZoomIn();
    } else {
      actions.onZoomOut();
    }
  };

  const transformStyle: React.CSSProperties = {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale3d(${transform.scale * (transform.flipX ? -1 : 1)}, ${transform.scale * (transform.flipY ? -1 : 1)}, 1) rotate(${transform.rotate}deg)`,
    transition: isDragging ? "none" : "transform 0.2s cubic-bezier(0.2, 0, 0, 1)",
  };

  const defaultImageNode = (
    <img
      src={currentImage.url}
      alt={currentImage.alt ?? ""}
      className="max-h-[85vh] max-w-[85vw] object-contain select-none pointer-events-auto rounded-xs shadow-2xl"
      style={transformStyle}
      draggable={false}
      onMouseDown={handleMouseDown}
    />
  );

  const imageNode = previewConfig?.imageRender
    ? previewConfig.imageRender(defaultImageNode, {
        transform,
        image: currentImage,
      })
    : defaultImageNode;

  const defaultToolbarNode = (
    <div className="flex items-center gap-4 rounded-full bg-black/50 px-4 py-2 text-white/85 shadow-lg backdrop-blur-md transition-opacity">
      <button
        type="button"
        title="Flip Horizontal"
        onClick={actions.onFlipX}
        className="hover:text-white transition-colors cursor-pointer"
      >
        <FlipHorizontal className="size-4" />
      </button>
      <button
        type="button"
        title="Flip Vertical"
        onClick={actions.onFlipY}
        className="hover:text-white transition-colors cursor-pointer"
      >
        <FlipVertical className="size-4" />
      </button>
      <button
        type="button"
        title="Rotate Left"
        onClick={actions.onRotateLeft}
        className="hover:text-white transition-colors cursor-pointer"
      >
        <RotateCcw className="size-4" />
      </button>
      <button
        type="button"
        title="Rotate Right"
        onClick={actions.onRotateRight}
        className="hover:text-white transition-colors cursor-pointer"
      >
        <RotateCw className="size-4" />
      </button>
      <button
        type="button"
        title="Zoom Out"
        onClick={actions.onZoomOut}
        disabled={transform.scale <= minScale}
        className="disabled:opacity-40 hover:text-white transition-colors cursor-pointer"
      >
        <ZoomOut className="size-4" />
      </button>
      <button
        type="button"
        title="Zoom In"
        onClick={actions.onZoomIn}
        disabled={transform.scale >= maxScale}
        className="disabled:opacity-40 hover:text-white transition-colors cursor-pointer"
      >
        <ZoomIn className="size-4" />
      </button>
      <button
        type="button"
        title="Reset"
        onClick={actions.onReset}
        className="hover:text-white transition-colors cursor-pointer"
      >
        <ResetIcon className="size-4" />
      </button>
    </div>
  );

  const toolbarNode = previewConfig?.toolbarRender
    ? previewConfig.toolbarRender(defaultToolbarNode, {
        transform,
        actions,
        current: currentIndex + 1,
        total,
        image: currentImage,
      })
    : defaultToolbarNode;

  if (!open) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs animate-in fade-in-0 duration-200"
        style={{ zIndex }}
        onClick={() => onOpenChange(false)}
      />
      <div
        data-slot="image-preview"
        style={{ zIndex: zIndex + 1 }}
        className="fixed inset-0 flex flex-col items-center justify-center p-0 outline-none select-none animate-in fade-in-0 zoom-in-95 duration-200"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Top Bar (Count & Close) */}
        <div className="absolute top-4 inset-x-6 flex items-center justify-between text-white/85 z-30 pointer-events-none">
          <div className="text-sm font-medium tracking-wide">
            {total > 1
              ? previewConfig?.countRender
                ? previewConfig.countRender(currentIndex + 1, total)
                : `${currentIndex + 1} / ${total}`
              : null}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
            className="pointer-events-auto flex size-9 items-center justify-center rounded-full bg-black/40 text-white/80 hover:bg-black/60 hover:text-white transition-all cursor-pointer"
          >
            {previewConfig?.closeIcon ?? <X className="size-5" />}
          </button>
        </div>

        {/* Navigation Arrows for Group */}
        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous"
              onClick={prevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-30 flex size-10 items-center justify-center rounded-full bg-black/40 text-white/80 hover:bg-black/60 hover:text-white transition-all cursor-pointer"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={nextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex size-10 items-center justify-center rounded-full bg-black/40 text-white/80 hover:bg-black/60 hover:text-white transition-all cursor-pointer"
            >
              <ChevronRight className="size-6" />
            </button>
          </>
        )}

        {/* Centered Image */}
        <div
          className={cn(
            "relative flex size-full items-center justify-center overflow-hidden",
            transform.scale > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default",
          )}
        >
          {imageNode}
        </div>

        {/* Bottom Toolbar */}
        <div
          data-no-mask-close
          className="absolute bottom-8 z-30 pointer-events-auto"
        >
          {toolbarNode}
        </div>
      </div>
    </Portal>
  );
}

/**
 * Image Component
 */
export function Image({
  src,
  alt = "",
  width,
  height,
  fallback,
  placeholder,
  preview = true,
  rootClassName,
  className,
  rootStyle,
  style,
  onLoad,
  onError,
  ...props
}: ImageProps) {
  const imageId = React.useId();
  const groupContext = React.useContext(ImageGroupContext);

  const [imgSrc, setImgSrc] = React.useState<string | undefined>(src);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  // Sync src
  React.useEffect(() => {
    setImgSrc(src);
    setIsLoaded(false);
    setIsError(false);
  }, [src]);

  // Register image in group context if inside PreviewGroup
  React.useEffect(() => {
    if (groupContext && src) {
      groupContext.registerImage(imageId, { src, alt });
      return () => {
        groupContext.unregisterImage(imageId);
      };
    }
  }, [groupContext, imageId, src, alt]);

  // Preview state for standalone image
  const previewConfig: ImagePreviewConfig = typeof preview === "object" ? preview : {};
  const isPreviewEnabled = preview !== false;
  const [standaloneOpen, setStandaloneOpen] = React.useState(
    previewConfig.visible ?? false,
  );

  React.useEffect(() => {
    if (typeof preview === "object" && preview.visible !== undefined) {
      setStandaloneOpen(preview.visible);
    }
  }, [preview]);

  const handleOpenPreview = () => {
    if (!isPreviewEnabled || isError) return;
    if (groupContext) {
      groupContext.openPreview(imageId);
    } else {
      setStandaloneOpen(true);
      previewConfig.onVisibleChange?.(true, false);
    }
  };

  const handleClosePreview = (nextOpen: boolean) => {
    setStandaloneOpen(nextOpen);
    previewConfig.onVisibleChange?.(nextOpen, standaloneOpen);
  };

  const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsError(true);
    if (fallback && imgSrc !== fallback) {
      setImgSrc(fallback);
    }
    onError?.(e);
  };

  const showPlaceholder = !isLoaded && placeholder !== undefined && placeholder !== false;

  const defaultMask = (
    <div className="flex items-center gap-1.5 text-xs text-white">
      <Eye className="size-4" />
      <span>Preview</span>
    </div>
  );

  const maskContent =
    previewConfig.mask !== undefined ? previewConfig.mask : defaultMask;

  return (
    <>
      <div
        data-slot="image"
        className={cn(
          "group relative inline-block overflow-hidden rounded-xs align-middle",
          isPreviewEnabled && !isError && "cursor-pointer",
          rootClassName,
        )}
        style={{ width, height, ...rootStyle }}
        onClick={handleOpenPreview}
      >
        {/* Placeholder skeleton/blur */}
        {showPlaceholder && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-fill-tertiary animate-pulse">
            {typeof placeholder === "boolean" ? null : placeholder}
          </div>
        )}

        <img
          src={imgSrc}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleImgLoad}
          onError={handleImgError}
          className={cn(
            "size-full object-cover transition-opacity duration-mid",
            !isLoaded && placeholder ? "opacity-0" : "opacity-100",
            className,
          )}
          style={style}
          {...props}
        />

        {/* Hover preview mask */}
        {isPreviewEnabled && !isError && maskContent && (
          <div
            className={cn(
              "absolute inset-0 z-20 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-mid group-hover:opacity-100",
              previewConfig.maskClassName,
            )}
          >
            {maskContent}
          </div>
        )}
      </div>

      {/* Standalone Preview Dialog (when not in group) */}
      {!groupContext && isPreviewEnabled && (
        <PreviewModal
          open={standaloneOpen}
          onOpenChange={handleClosePreview}
          images={[{ url: previewConfig.src ?? imgSrc ?? "", alt }]}
          currentIndex={0}
          previewConfig={previewConfig}
        />
      )}
    </>
  );
}

/**
 * ImagePreviewGroup Component
 */
export function ImagePreviewGroup({
  items,
  preview = true,
  children,
}: ImagePreviewGroupProps) {
  const [registeredImages, setRegisteredImages] = React.useState<
    { id: string; src: string; alt?: string }[]
  >([]);

  // memoised: this object feeds the context value, and a fresh `{}` each render
  // would invalidate every consumer effect
  const previewConfig = React.useMemo<ImagePreviewGroupConfig>(
    () => (typeof preview === "object" ? preview : {}),
    [preview],
  );
  const [open, setOpen] = React.useState(previewConfig.visible ?? false);
  const [currentIndex, setCurrentIndex] = React.useState(previewConfig.current ?? 0);

  React.useEffect(() => {
    if (typeof preview === "object") {
      if (preview.visible !== undefined) setOpen(preview.visible);
      if (preview.current !== undefined) setCurrentIndex(preview.current);
    }
  }, [preview]);

  const registerImage = React.useCallback(
    (id: string, data: { src: string; alt?: string }) => {
      setRegisteredImages((prev) => {
        const idx = prev.findIndex((item) => item.id === id);
        if (idx >= 0) {
          const existing = prev[idx];
          // re-registering identical data must not produce a new array: the
          // context value would change and re-run every child's effect forever
          if (existing.src === data.src && existing.alt === data.alt) return prev;
          const updated = [...prev];
          updated[idx] = { id, ...data };
          return updated;
        }
        return [...prev, { id, ...data }];
      });
    },
    [],
  );

  const unregisterImage = React.useCallback((id: string) => {
    setRegisteredImages((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // read through a ref so the callback identity — and with it the context value —
  // stays put while images register
  const registeredRef = React.useRef(registeredImages);
  registeredRef.current = registeredImages;

  const openPreview = React.useCallback(
    (id: string) => {
      const idx = registeredRef.current.findIndex((item) => item.id === id);
      const targetIdx = idx >= 0 ? idx : 0;
      setCurrentIndex(targetIdx);
      setOpen(true);
      previewConfig.onVisibleChange?.(true, false);
    },
    [previewConfig],
  );

  const handleIndexChange = (nextIndex: number) => {
    previewConfig.onChange?.(nextIndex, currentIndex);
    setCurrentIndex(nextIndex);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    previewConfig.onVisibleChange?.(nextOpen, open);
  };

  // Compute final images array
  const images = React.useMemo(() => {
    if (items && items.length > 0) {
      return items.map((item) =>
        typeof item === "string" ? { url: item } : { url: item.src, alt: item.alt },
      );
    }
    return registeredImages.map((item) => ({ url: item.src, alt: item.alt }));
  }, [items, registeredImages]);

  const contextValue = React.useMemo(
    () => ({
      isPreviewGroup: true,
      registerImage,
      unregisterImage,
      openPreview,
    }),
    [registerImage, unregisterImage, openPreview],
  );

  return (
    <ImageGroupContext.Provider value={contextValue}>
      {children}
      {preview !== false && (
        <PreviewModal
          open={open}
          onOpenChange={handleOpenChange}
          images={images}
          currentIndex={currentIndex}
          onIndexChange={handleIndexChange}
          previewConfig={previewConfig}
        />
      )}
    </ImageGroupContext.Provider>
  );
}

// Attach subcomponent to Image
Image.PreviewGroup = ImagePreviewGroup;
