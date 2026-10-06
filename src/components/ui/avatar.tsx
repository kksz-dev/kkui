import * as React from "react";
import { cn } from "@/lib/utils";
import { useBreakpoint, resolveResponsive } from "@/hooks/use-breakpoint";
import { Popover } from "@/components/ui/popover";

export type AvatarShape = "circle" | "square";
export type AvatarSize = "sm" | "md" | "lg" | "small" | "default" | "large" | number;

export interface ResponsiveSize {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
}

const SIZE_ALIAS: Record<string, "sm" | "md" | "lg"> = {
  small: "sm",
  sm: "sm",
  default: "md",
  md: "md",
  large: "lg",
  lg: "lg",
};

const SIZE_CLASSES = {
  sm: "size-control-sm text-xs [&_svg]:size-3.5",
  md: "size-control text-sm [&_svg]:size-4",
  lg: "size-control-lg text-base [&_svg]:size-5",
};

function isResponsive(size: AvatarSize | ResponsiveSize | undefined): size is ResponsiveSize {
  return typeof size === "object" && size !== null;
}

/** Resolve a responsive size object down to the pixel value for the current viewport. */
function useResponsiveSize(size: AvatarSize | ResponsiveSize | undefined): AvatarSize | undefined {
  const responsive = isResponsive(size) ? size : undefined;
  // shared breakpoint store: one set of media queries for the whole app
  const screens = useBreakpoint();

  if (!responsive) return size as AvatarSize | undefined;
  const resolved = resolveResponsive(responsive, screens);
  return resolved ?? responsive.md ?? responsive.sm ?? responsive.xs;
}

export interface AvatarProps extends Omit<React.ComponentProps<"span">, "size" | "onError"> {
  shape?: AvatarShape;
  size?: AvatarSize | ResponsiveSize;
  src?: string | React.ReactNode;
  srcSet?: string;
  alt?: string;
  icon?: React.ReactNode;
  /** Minimum horizontal gap (px) kept between text children and the avatar edge. */
  gap?: number;
  draggable?: boolean;
  crossOrigin?: "" | "anonymous" | "use-credentials";
  /** Return false to keep showing the broken image instead of falling back. */
  onError?: () => boolean;
  style?: React.CSSProperties;
}

interface GroupContextValue {
  size?: AvatarSize | ResponsiveSize;
  shape?: AvatarShape;
}
const GroupContext = React.createContext<GroupContextValue | null>(null);

function Avatar({
  shape: shapeProp,
  size: sizeProp,
  src,
  srcSet,
  alt,
  icon,
  gap = 4,
  draggable,
  crossOrigin,
  onError,
  className,
  style,
  children,
  ...props
}: AvatarProps) {
  const group = React.useContext(GroupContext);
  const shape = shapeProp ?? group?.shape ?? "circle";
  const size = useResponsiveSize(sizeProp ?? group?.size ?? "md");

  const [hasError, setHasError] = React.useState(false);
  const [scale, setScale] = React.useState(1);
  const rootRef = React.useRef<HTMLSpanElement>(null);
  const textRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    setHasError(false);
  }, [src]);

  // `gap` shrinks text children so they fit within (width - 2 * gap).
  React.useLayoutEffect(() => {
    const root = rootRef.current;
    const text = textRef.current;
    if (!root || !text) {
      setScale(1);
      return;
    }
    const measure = () => {
      const available = root.getBoundingClientRect().width - gap * 2;
      const textWidth = text.scrollWidth;
      setScale(textWidth > available && textWidth > 0 ? Math.max(0.3, available / textWidth) : 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    observer.observe(text);
    return () => observer.disconnect();
  }, [children, gap, size]);

  const handleImgError = () => {
    const prevent = onError?.();
    if (prevent !== false) setHasError(true);
  };

  const isNumeric = typeof size === "number";
  const sizeKey = !isNumeric && typeof size === "string" ? (SIZE_ALIAS[size] ?? "md") : "md";

  const customStyle: React.CSSProperties = {
    ...style,
    ...(isNumeric ? { width: size, height: size, fontSize: (size as number) / 2 } : {}),
  };

  const isImg = typeof src === "string" && !hasError;

  return (
    <span
      ref={rootRef}
      data-slot="avatar"
      style={customStyle}
      className={cn(
        "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden bg-text-quaternary align-middle font-normal text-white",
        shape === "circle" ? "rounded-full" : "rounded-md",
        !isNumeric && SIZE_CLASSES[sizeKey],
        className,
      )}
      {...props}
    >
      {isImg ? (
        <img
          src={src as string}
          srcSet={srcSet}
          alt={alt}
          crossOrigin={crossOrigin}
          draggable={draggable}
          onError={handleImgError}
          className="size-full object-cover"
        />
      ) : src ? (
        src
      ) : icon ? (
        icon
      ) : children ? (
        <span
          ref={textRef}
          className="origin-center whitespace-nowrap transition-transform duration-fast"
          style={scale === 1 ? undefined : { transform: `scale(${scale})` }}
        >
          {children}
        </span>
      ) : null}
    </span>
  );
}

export interface AvatarGroupProps extends React.ComponentProps<"div"> {
  /** @deprecated use `max={{ count }}` */
  maxCount?: number;
  max?:
    | {
        count?: number;
        style?: React.CSSProperties;
        /** Show the overflowed avatars in a popover. Set false to disable. */
        popover?: { placement?: "top" | "bottom" | "left" | "right"; trigger?: "hover" | "click" } | false;
      }
    | number;
  size?: AvatarSize | ResponsiveSize;
  shape?: AvatarShape;
  maxStyle?: React.CSSProperties;
}

function AvatarGroup({ children, maxCount, max, size, shape, maxStyle, className, ...props }: AvatarGroupProps) {
  const items = React.Children.toArray(children);
  const total = items.length;
  const resolvedMaxCount = typeof max === "number" ? max : (max?.count ?? maxCount);
  const resolvedMaxStyle = typeof max === "object" ? { ...maxStyle, ...max?.style } : maxStyle;
  const popoverConfig = typeof max === "object" ? max?.popover : undefined;

  const showCount = resolvedMaxCount != null && resolvedMaxCount < total ? resolvedMaxCount : total;
  const visible = items.slice(0, showCount);
  const overflow = items.slice(showCount);

  const overflowAvatar = (
    <Avatar className="bg-warning text-white" style={resolvedMaxStyle}>
      +{overflow.length}
    </Avatar>
  );

  return (
    <GroupContext.Provider value={{ size, shape }}>
      <div
        data-slot="avatar-group"
        className={cn(
          "inline-flex items-center -space-x-2 [&>[data-slot=avatar]]:ring-2 [&>[data-slot=avatar]]:ring-bg-container",
          className,
        )}
        {...props}
      >
        {visible}
        {overflow.length > 0 &&
          (popoverConfig === false ? (
            overflowAvatar
          ) : (
            <Popover
              placement={popoverConfig?.placement ?? "top"}
              trigger={popoverConfig?.trigger ?? "hover"}
              content={<div className="flex items-center gap-1">{overflow}</div>}
            >
              {overflowAvatar}
            </Popover>
          ))}
      </div>
    </GroupContext.Provider>
  );
}

Avatar.Group = AvatarGroup;

export { Avatar, AvatarGroup };
