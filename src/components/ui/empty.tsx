import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Empty — KKUI empty state: default & simple SVG illustrations,
 * custom image, custom description, action buttons (children), style / classNames.
 */

function DefaultImage({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      className={cn("h-full w-full select-none", className)}
      style={style}
      viewBox="0 0 184 152"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" fillRule="evenodd">
        <g transform="translate(24 31.5)">
          <ellipse
            cx="67.5"
            cy="116.5"
            rx="67.5"
            ry="4.5"
            fill="var(--kk-fill)"
          />
          <path
            d="M122 100.5l17.5-68.5L85 4.5l-63 21 16 75h84z"
            fill="var(--kk-bg-layout)"
          />
          <path
            d="M122 100.5l-84-1-16-74.5L85 4.5l37 96z"
            fill="var(--kk-fill-quaternary)"
          />
          <path
            d="M38 25l47-20.5 37 96-84-1L22 25.5 38 25z"
            fill="var(--kk-fill-tertiary)"
          />
          <path
            d="M122 100.5l-84-1-16-74.5 47-20.5 37 96z"
            fill="var(--kk-fill-secondary)"
          />
          <path
            d="M85 4.5l54.5 27.5-17.5 68.5-37-96z"
            fill="var(--kk-fill-content)"
          />
          <path
            d="M139.5 32L85 4.5 22 25.5l16 74.5 84 1 17.5-69z"
            stroke="var(--kk-border)"
            strokeWidth="1.2"
          />
          <path
            d="M85 4.5v95M139.5 32L85 99.5M22 25.5L85 99.5"
            stroke="var(--kk-border-secondary)"
            strokeWidth="1.2"
          />
        </g>
        <g transform="translate(62 48)">
          <rect
            x="0"
            y="0"
            width="60"
            height="44"
            rx="4"
            fill="var(--kk-bg-container)"
            stroke="var(--kk-border)"
            strokeWidth="1.2"
          />
          <path
            d="M12 14h36M12 22h24M12 30h16"
            stroke="var(--kk-border)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  );
}

function SimpleImage({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      className={cn("h-full w-full select-none", className)}
      style={style}
      viewBox="0 0 64 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(0 1)" fill="none" fillRule="evenodd">
        <ellipse
          cx="32"
          cy="33"
          rx="32"
          ry="7"
          fill="var(--kk-fill)"
        />
        <g fillRule="nonzero" stroke="var(--kk-border)" strokeWidth="1.2">
          <path
            d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.258L9 12.761V22h46v-9.24z"
            fill="var(--kk-bg-container)"
          />
          <path
            d="M41.613 15.9c-.444-.724-1.224-1.162-2.076-1.162H24.463c-.852 0-1.632.438-2.076 1.162L17 23.5V34c0 1.105.895 2 2 2h26c1.105 0 2-.895 2-2V23.5l-5.387-7.6z"
            fill="var(--kk-fill-secondary)"
          />
        </g>
      </g>
    </svg>
  );
}

export const EMPTY_IMAGE_DEFAULT = <DefaultImage />;
export const EMPTY_IMAGE_SIMPLE = <SimpleImage />;

export interface EmptyProps extends Omit<React.ComponentProps<"div">, "title"> {
  /** Empty state illustration or image URL */
  image?: React.ReactNode;
  /** Inline style for image wrapper */
  imageStyle?: React.CSSProperties;
  /** Description text or false to hide */
  description?: React.ReactNode | false;
  /** Custom classNames for inner elements */
  classNames?: { image?: string; root?: string; description?: string; footer?: string };
  /** Custom styles for inner elements */
  styles?: { image?: React.CSSProperties; root?: React.CSSProperties; description?: React.CSSProperties; footer?: React.CSSProperties };
}

function Empty({
  className,
  image = EMPTY_IMAGE_DEFAULT,
  imageStyle,
  description = "No data",
  classNames,
  styles,
  children,
  style,
  ...props
}: EmptyProps) {
  const isSimple = image === EMPTY_IMAGE_SIMPLE;
  const isImageString = typeof image === "string";

  return (
    <div
      data-slot="empty"
      className={cn(
        "flex flex-col items-center justify-center text-center my-8 text-sm",
        className,
        classNames?.root,
      )}
      style={{ ...style, ...styles?.root }}
      {...props}
    >
      <div
        data-slot="empty-image"
        className={cn(
          "flex items-center justify-center mb-2",
          isSimple ? "h-10" : "h-[100px]",
          classNames?.image,
        )}
        style={{ ...imageStyle, ...styles?.image }}
      >
        {isImageString ? (
          <img src={image} alt={typeof description === "string" ? description : "empty"} className="h-full object-contain" />
        ) : (
          image
        )}
      </div>

      {description !== false && (
        <div
          data-slot="empty-description"
          className={cn("text-text-description mb-4", classNames?.description)}
          style={styles?.description}
        >
          {description}
        </div>
      )}

      {children && (
        <div
          data-slot="empty-footer"
          className={cn("flex items-center justify-center gap-2", classNames?.footer)}
          style={styles?.footer}
        >
          {children}
        </div>
      )}
    </div>
  );
}

Empty.PRESENTED_IMAGE_DEFAULT = EMPTY_IMAGE_DEFAULT;
Empty.PRESENTED_IMAGE_SIMPLE = EMPTY_IMAGE_SIMPLE;

export { Empty };
