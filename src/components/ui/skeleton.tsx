import * as React from "react";
import { Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInjectedStyle } from "@/hooks/use-injected-style";

/**
 * Skeleton — KKUI placeholder loading skeleton:
 * Shimmer animation, avatar + title + paragraph composite,
 * and modular sub-components (Button, Avatar, Input, Image, Node).
 */

const shimmerStyle = `
@keyframes kk-skeleton-shimmer {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}
.kk-skeleton-active {
  background: linear-gradient(90deg, var(--kk-fill-secondary) 25%, var(--kk-fill) 37%, var(--kk-fill-secondary) 63%) !important;
  background-size: 400% 100% !important;
  animation: kk-skeleton-shimmer 1.4s ease infinite !important;
}
`;

function SkeletonStyleTag() {
  useInjectedStyle("skeleton-shimmer", shimmerStyle);
  return null;
}

// ------------------------------------------------------------------
// Sub-components
// ------------------------------------------------------------------

export interface SkeletonAvatarProps extends React.ComponentProps<"span"> {
  active?: boolean;
  shape?: "circle" | "square";
  size?: "small" | "default" | "large" | number;
}

function SkeletonAvatar({
  className,
  active = false,
  shape = "circle",
  size = "default",
  style,
  ...props
}: SkeletonAvatarProps) {
  const isNumeric = typeof size === "number";
  const sizeClasses: Record<string, string> = {
    small: "size-control-sm",
    default: "size-control",
    large: "size-control-lg",
  };

  const customStyle: React.CSSProperties = {
    ...(isNumeric ? { width: size, height: size, lineHeight: `${size}px` } : {}),
    ...style,
  };

  return (
    <>
      <SkeletonStyleTag />
      <span
        data-slot="skeleton-avatar"
        className={cn(
          "inline-block shrink-0 bg-fill-secondary align-middle",
          shape === "circle" ? "rounded-full" : "rounded-md",
          !isNumeric && (sizeClasses[size] ?? sizeClasses.default),
          active && "kk-skeleton-active",
          className,
        )}
        style={customStyle}
        {...props}
      />
    </>
  );
}

export interface SkeletonButtonProps extends React.ComponentProps<"span"> {
  active?: boolean;
  block?: boolean;
  shape?: "circle" | "round" | "square" | "default";
  size?: "small" | "default" | "large";
}

function SkeletonButton({
  className,
  active = false,
  block = false,
  shape = "default",
  size = "default",
  ...props
}: SkeletonButtonProps) {
  const sizeClasses: Record<string, string> = {
    small: "h-control-sm min-w-16",
    default: "h-control min-w-20",
    large: "h-control-lg min-w-24",
  };

  const shapeClasses: Record<string, string> = {
    default: "rounded-md",
    square: "rounded-none",
    round: "rounded-full",
    circle: "rounded-full !min-w-0 !w-control",
  };

  return (
    <>
      <SkeletonStyleTag />
      <span
        data-slot="skeleton-button"
        className={cn(
          "inline-block bg-fill-secondary align-middle",
          sizeClasses[size] ?? sizeClasses.default,
          shapeClasses[shape] ?? shapeClasses.default,
          shape === "circle" && size === "small" && "!w-control-sm",
          shape === "circle" && size === "large" && "!w-control-lg",
          block && "!w-full",
          active && "kk-skeleton-active",
          className,
        )}
        {...props}
      />
    </>
  );
}

export interface SkeletonInputProps extends React.ComponentProps<"span"> {
  active?: boolean;
  block?: boolean;
  size?: "small" | "default" | "large";
}

function SkeletonInput({
  className,
  active = false,
  block = false,
  size = "default",
  ...props
}: SkeletonInputProps) {
  const sizeClasses: Record<string, string> = {
    small: "h-control-sm w-36",
    default: "h-control w-48",
    large: "h-control-lg w-60",
  };

  return (
    <>
      <SkeletonStyleTag />
      <span
        data-slot="skeleton-input"
        className={cn(
          "inline-block rounded-md bg-fill-secondary align-middle",
          sizeClasses[size] ?? sizeClasses.default,
          block && "!w-full",
          active && "kk-skeleton-active",
          className,
        )}
        {...props}
      />
    </>
  );
}

export interface SkeletonImageProps extends React.ComponentProps<"span"> {
  active?: boolean;
}

function SkeletonImage({
  className,
  active = false,
  ...props
}: SkeletonImageProps) {
  return (
    <>
      <SkeletonStyleTag />
      <span
        data-slot="skeleton-image"
        className={cn(
          "inline-flex size-24 items-center justify-center rounded-md bg-fill-secondary text-text-quaternary align-middle",
          active && "kk-skeleton-active",
          className,
        )}
        {...props}
      >
        <ImageIcon className="size-10 stroke-1" />
      </span>
    </>
  );
}

export interface SkeletonNodeProps extends React.ComponentProps<"span"> {
  active?: boolean;
}

function SkeletonNode({
  className,
  active = false,
  children,
  ...props
}: SkeletonNodeProps) {
  return (
    <>
      <SkeletonStyleTag />
      <span
        data-slot="skeleton-node"
        className={cn(
          "inline-flex h-24 w-32 items-center justify-center rounded-md bg-fill-secondary text-text-tertiary align-middle",
          active && "kk-skeleton-active",
          className,
        )}
        {...props}
      >
        {children}
      </span>
    </>
  );
}

// ------------------------------------------------------------------
// Main Composite Skeleton
// ------------------------------------------------------------------

export interface SkeletonTitleProps {
  width?: number | string;
}

export interface SkeletonParagraphProps {
  rows?: number;
  width?: number | string | Array<number | string>;
}

export interface SkeletonProps extends Omit<React.ComponentProps<"div">, "title"> {
  /** Show shimmer animation */
  active?: boolean;
  /** Show avatar placeholder or avatar config */
  avatar?: boolean | SkeletonAvatarProps;
  /** Show title placeholder or title config */
  title?: boolean | SkeletonTitleProps;
  /** Show paragraph placeholder or paragraph config */
  paragraph?: boolean | SkeletonParagraphProps;
  /** Show rounded paragraph */
  round?: boolean;
  /** When false, renders children instead of skeleton */
  loading?: boolean;
}

function Skeleton({
  className,
  active = false,
  avatar = false,
  title = true,
  paragraph = true,
  round = false,
  loading = true,
  children,
  ...props
}: SkeletonProps) {
  if (!loading && children !== undefined) {
    return <>{children}</>;
  }

  const hasAvatar = Boolean(avatar);
  const avatarConfig: SkeletonAvatarProps = typeof avatar === "object" ? avatar : {};
  const hasTitle = title !== false;
  const titleConfig: SkeletonTitleProps = typeof title === "object" ? title : {};
  const hasParagraph = paragraph !== false;
  const paragraphConfig: SkeletonParagraphProps = typeof paragraph === "object" ? paragraph : {};

  const rows = paragraphConfig.rows ?? 3;
  const paragraphWidth = paragraphConfig.width;

  const getRowWidth = (index: number): string | number => {
    if (Array.isArray(paragraphWidth)) {
      return paragraphWidth[index] ?? "100%";
    }
    if (paragraphWidth !== undefined) {
      return paragraphWidth;
    }
    // KKUI default widths: last row 61%, others 100%
    return index === rows - 1 ? "61%" : "100%";
  };

  return (
    <>
      <SkeletonStyleTag />
      <div
        data-slot="skeleton"
        className={cn("flex w-full gap-4", className)}
        {...props}
      >
        {hasAvatar && (
          <div className="shrink-0 pt-1">
            <SkeletonAvatar
              active={active || avatarConfig.active}
              shape={avatarConfig.shape}
              size={avatarConfig.size}
            />
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-3">
          {hasTitle && (
            <div
              className={cn(
                "h-4 bg-fill-secondary",
                round ? "rounded-full" : "rounded-sm",
                active && "kk-skeleton-active",
              )}
              style={{ width: titleConfig.width ?? "38%" }}
            />
          )}
          {hasParagraph && (
            <div className="space-y-2.5 pt-1">
              {Array.from({ length: rows }, (_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-4 bg-fill-secondary",
                    round ? "rounded-full" : "rounded-sm",
                    active && "kk-skeleton-active",
                  )}
                  style={{ width: getRowWidth(i) }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

Skeleton.Avatar = SkeletonAvatar;
Skeleton.Button = SkeletonButton;
Skeleton.Input = SkeletonInput;
Skeleton.Image = SkeletonImage;
Skeleton.Node = SkeletonNode;

export {
  Skeleton,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonInput,
  SkeletonImage,
  SkeletonNode,
};
