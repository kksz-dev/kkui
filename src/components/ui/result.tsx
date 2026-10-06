import * as React from "react";
import { CircleCheck, CircleX, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Result — KKUI page-level feedback: a big status icon (or 403/404/500
 * illustration), title, subTitle, an `extra` actions row and optional content block.
 */
export type ResultStatus = "success" | "error" | "info" | "warning" | "404" | "403" | "500";

export interface ResultProps extends Omit<React.ComponentProps<"div">, "title"> {
  status?: ResultStatus;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  /** Custom icon (replaces the status icon) */
  icon?: React.ReactNode;
  /** Operating area, usually buttons */
  extra?: React.ReactNode;
  children?: React.ReactNode;
}

const statusIcons: Record<Exclude<ResultStatus, "404" | "403" | "500">, { Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; color: string }> = {
  success: { Icon: CircleCheck, color: "text-success" },
  error: { Icon: CircleX, color: "text-error" },
  info: { Icon: Info, color: "text-info" },
  warning: { Icon: TriangleAlert, color: "text-warning" },
};

/* --- simple line-art illustrations for the exception pages (tokens via currentColor) --- */

function IllustrationFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 252 200"
      className="h-[200px] w-[252px] max-w-full text-text-quaternary"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* ground */}
      <path d="M12 176h228" className="text-fill" stroke="currentColor" />
      <ellipse cx="126" cy="176" rx="96" ry="6" className="text-fill-secondary" fill="currentColor" stroke="none" />
      {children}
    </svg>
  );
}

function Illustration404() {
  return (
    <IllustrationFrame label="404">
      {/* window */}
      <rect x="66" y="42" width="120" height="86" rx="6" className="text-bg-container" fill="currentColor" stroke="none" />
      <rect x="66" y="42" width="120" height="86" rx="6" />
      <path d="M66 58h120" />
      <circle cx="76" cy="50" r="2" className="text-error" fill="currentColor" stroke="none" />
      <circle cx="84" cy="50" r="2" className="text-warning" fill="currentColor" stroke="none" />
      <circle cx="92" cy="50" r="2" className="text-success" fill="currentColor" stroke="none" />
      <text x="126" y="104" textAnchor="middle" fontSize="34" fontWeight="600" fill="currentColor" stroke="none" className="text-primary">
        404
      </text>
      {/* magnifier */}
      <circle cx="176" cy="126" r="16" className="text-primary" />
      <path d="M188 138l14 14" className="text-primary" strokeWidth={3} />
      {/* clouds */}
      <path d="M28 70h24M22 78h30M200 30h22M196 38h28" className="text-fill" />
      {/* plant */}
      <path d="M40 176v-22M40 158c-6-4-10-10-8-18 8 2 10 10 8 18ZM40 166c6-4 10-10 8-18-8 2-10 10-8 18Z" className="text-success" />
    </IllustrationFrame>
  );
}

function Illustration403() {
  return (
    <IllustrationFrame label="403">
      {/* door */}
      <rect x="86" y="46" width="80" height="130" rx="4" className="text-bg-container" fill="currentColor" stroke="none" />
      <rect x="86" y="46" width="80" height="130" rx="4" />
      <rect x="98" y="58" width="56" height="106" rx="2" className="text-fill-secondary" fill="currentColor" stroke="none" />
      <circle cx="146" cy="114" r="3" fill="currentColor" />
      {/* lock */}
      <rect x="112" y="98" width="28" height="22" rx="3" className="text-primary" />
      <path d="M118 98v-6a8 8 0 0 1 16 0v6" className="text-primary" />
      <circle cx="126" cy="109" r="2.5" className="text-primary" fill="currentColor" />
      {/* forbidden sign */}
      <circle cx="196" cy="70" r="18" className="text-error" strokeWidth={3} />
      <path d="M183 57l26 26" className="text-error" strokeWidth={3} />
      {/* clouds */}
      <path d="M28 60h24M22 68h30" className="text-fill" />
      {/* plant */}
      <path d="M52 176v-22M52 158c-6-4-10-10-8-18 8 2 10 10 8 18Z" className="text-success" />
    </IllustrationFrame>
  );
}

function Illustration500() {
  return (
    <IllustrationFrame label="500">
      {/* server */}
      <rect x="82" y="40" width="88" height="136" rx="6" className="text-bg-container" fill="currentColor" stroke="none" />
      <rect x="82" y="40" width="88" height="136" rx="6" />
      <path d="M82 76h88M82 112h88M82 148h88" />
      {[58, 94, 130].map((y) => (
        <g key={y}>
          <circle cx="98" cy={y} r="3" className={y === 94 ? "text-error" : "text-success"} fill="currentColor" stroke="none" />
          <path d={`M110 ${y}h44`} className="text-fill" />
        </g>
      ))}
      {/* warning */}
      <path d="M204 44l20 36h-40Z" className="text-warning" strokeWidth={2.5} />
      <path d="M204 56v12M204 73v1" className="text-warning" strokeWidth={2.5} />
      {/* smoke */}
      <path d="M40 74c8-8 8-16 0-24M52 82c8-8 8-16 0-24" className="text-fill" />
      {/* clouds */}
      <path d="M22 110h30M28 118h20" className="text-fill" />
    </IllustrationFrame>
  );
}

const illustrations: Record<"404" | "403" | "500", React.ComponentType> = {
  "404": Illustration404,
  "403": Illustration403,
  "500": Illustration500,
};

function isException(s: ResultStatus): s is "404" | "403" | "500" {
  return s === "404" || s === "403" || s === "500";
}

function Result({ className, status = "info", title, subTitle, icon, extra, children, ...props }: ResultProps) {
  let iconNode: React.ReactNode;
  if (icon != null) {
    iconNode = <span className="inline-flex [&_svg]:size-[72px]">{icon}</span>;
  } else if (isException(status)) {
    const Illu = illustrations[status];
    iconNode = <Illu />;
  } else {
    const { Icon, color } = statusIcons[status];
    iconNode = <Icon className={cn("size-[72px]", color)} strokeWidth={1.5} />;
  }

  return (
    <div data-slot="result" data-status={status} className={cn("px-8 py-12 text-center", className)} {...props}>
      <div data-slot="result-icon" className="mb-6 flex justify-center">
        {iconNode}
      </div>
      {title != null && (
        <div data-slot="result-title" className="text-h3 leading-[1.8] text-text-heading">
          {title}
        </div>
      )}
      {subTitle != null && (
        <div data-slot="result-subtitle" className="text-sm leading-[1.6] text-text-secondary">
          {subTitle}
        </div>
      )}
      {children != null && (
        <div data-slot="result-content" className="mt-6 rounded-lg bg-fill-alter p-6 text-left">
          {children}
        </div>
      )}
      {extra != null && (
        <div data-slot="result-extra" className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {extra}
        </div>
      )}
    </div>
  );
}

export { Result };
