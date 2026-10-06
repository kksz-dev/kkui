import * as React from "react";
import { CloudUpload, File as FileIcon, X, CircleCheck, CircleAlert, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { attrAccept } from "@/components/ui/upload";

/** Same status vocabulary as `UploadFile` so both components read alike. */
export type DropzoneFileStatus = "uploading" | "done" | "error";

export interface DropzoneFile {
  id: string;
  file: File;
  name: string;
  size: number;
  /** 0 - 100, driven by the `onProgress` callback handed to `onUpload` */
  percent: number;
  status: DropzoneFileStatus;
  previewUrl?: string;
  error?: string;
}

export interface DropzoneProps extends Omit<React.ComponentProps<"div">, "onChange" | "onDrop"> {
  /** Comma separated list of extensions / mime types, e.g. `image/*,.pdf` */
  accept?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  multiple?: boolean;
  disabled?: boolean;
  /** Fires whenever the queue changes (add, progress, remove) */
  onFilesChange?: (files: DropzoneFile[]) => void;
  /** Transport. Without it files are only staged (`done` immediately). */
  onUpload?: (file: File, onProgress: (percent: number) => void) => Promise<void>;
  /** Called with the native drop event before the files are queued */
  onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
  /** Files turned away by `accept`, `multiple` or `maxFiles`, with the reason. */
  onReject?: (rejected: { file: File; reason: "accept" | "maxFiles" | "multiple" }[]) => void;
  /** Every string the component prints, so it can speak another language. */
  locale?: Partial<DropzoneLocale>;
  className?: string;
}

export interface DropzoneLocale {
  hint: React.ReactNode;
  limits: (info: { maxFiles: number; maxSizeMB: number; accept?: string }) => React.ReactNode;
  tooLarge: (maxSizeMB: number) => string;
  uploadFailed: string;
  remove: string;
}

export const DEFAULT_DROPZONE_LOCALE: DropzoneLocale = {
  hint: "Click to upload or drag and drop files here",
  limits: ({ maxFiles, maxSizeMB, accept }) =>
    `Max ${maxFiles} files, up to ${maxSizeMB}MB each${accept ? ` (${accept})` : ""}`,
  tooLarge: (maxSizeMB) => `File exceeds ${maxSizeMB}MB`,
  uploadFailed: "Upload failed",
  remove: "Remove file",
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

let seed = 0;

export function Dropzone({
  accept,
  maxFiles = 5,
  maxSizeMB = 10,
  multiple = true,
  disabled = false,
  onFilesChange,
  onUpload,
  onDrop,
  onReject,
  locale: localeProp,
  className,
  ...props
}: DropzoneProps) {
  const locale = { ...DEFAULT_DROPZONE_LOCALE, ...localeProp };
  const [dragOver, setDragOver] = React.useState(false);
  const [files, setFiles] = React.useState<DropzoneFile[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const filesRef = React.useRef<DropzoneFile[]>(files);
  const dragDepth = React.useRef(0);
  const mountedRef = React.useRef(true);

  filesRef.current = files;

  const liveRef = React.useRef(onFilesChange);
  liveRef.current = onFilesChange;

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      filesRef.current.forEach((f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl));
    };
  }, []);

  const update = (next: DropzoneFile[]) => {
    filesRef.current = next;
    setFiles(next);
    liveRef.current?.(next);
  };

  const patch = (id: string, changes: Partial<DropzoneFile>) => {
    if (!mountedRef.current) return;
    update(filesRef.current.map((f) => (f.id === id ? { ...f, ...changes } : f)));
  };

  const addFiles = (incoming: File[]) => {
    if (disabled) return;
    const room = Math.max(0, maxFiles - filesRef.current.length);
    const rejected: { file: File; reason: "accept" | "maxFiles" | "multiple" }[] = [];

    const allowed = incoming.filter((f) => {
      const ok = attrAccept(f, accept);
      if (!ok) rejected.push({ file: f, reason: "accept" });
      return ok;
    });

    const limit = multiple ? room : Math.min(room, 1);
    const batch = allowed.slice(0, limit);
    for (const f of allowed.slice(limit)) {
      rejected.push({ file: f, reason: !multiple ? "multiple" : "maxFiles" });
    }
    if (rejected.length) onReject?.(rejected);
    if (!batch.length) return;

    const queued = batch.map<DropzoneFile>((file) => {
      const tooBig = file.size > maxSizeMB * 1024 * 1024;
      return {
        id: `kk-dropzone-${Date.now().toString(36)}-${(seed += 1)}`,
        file,
        name: file.name,
        size: file.size,
        percent: tooBig || onUpload ? 0 : 100,
        status: tooBig ? "error" : onUpload ? "uploading" : "done",
        error: tooBig ? locale.tooLarge(maxSizeMB) : undefined,
        previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      };
    });

    update([...filesRef.current, ...queued]);

    if (!onUpload) return;
    for (const item of queued) {
      if (item.status !== "uploading") continue;
      onUpload(item.file, (percent) =>
        patch(item.id, { percent: Math.max(0, Math.min(100, Math.round(percent))), status: "uploading" }),
      )
        .then(() => patch(item.id, { percent: 100, status: "done" }))
        .catch((err: unknown) =>
          patch(item.id, { status: "error", error: err instanceof Error ? err.message : locale.uploadFailed }),
        );
    }
  };

  const removeFile = (id: string) => {
    const target = filesRef.current.find((f) => f.id === id);
    if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
    update(filesRef.current.filter((f) => f.id !== id));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragDepth.current = 0;
    setDragOver(false);
    if (disabled) return;
    onDrop?.(event);
    addFiles(Array.from(event.dataTransfer.files ?? []));
  };

  return (
    <div className="w-full space-y-4">
      <div
        {...props}
        onDragEnter={(event) => {
          event.preventDefault();
          dragDepth.current += 1;
          if (!disabled) setDragOver(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) event.dataTransfer.dropEffect = "copy";
        }}
        onDragLeave={() => {
          dragDepth.current -= 1;
          if (dragDepth.current <= 0) {
            dragDepth.current = 0;
            setDragOver(false);
          }
        }}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (!disabled) inputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        data-slot="dropzone"
        className={cn(
          "kk-press relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-bg-container p-8 text-center transition-colors duration-mid ease-kk-in-out outline-none focus-visible:ring-[3px] focus-visible:ring-primary/30",
          !disabled && "cursor-pointer hover:border-primary",
          dragOver && "border-primary bg-primary-bg",
          disabled && "cursor-not-allowed bg-bg-container-disabled opacity-60",
          className,
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="sr-only"
          onChange={(event) => {
            const picked = Array.from(event.target.files ?? []);
            event.target.value = "";
            addFiles(picked);
          }}
        />

        <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary-bg text-primary">
          <CloudUpload className="size-6" />
        </span>

        <span className="text-sm font-semibold text-text-heading">{locale.hint}</span>
        <span className="mt-1 text-xs text-text-tertiary">{locale.limits({ maxFiles, maxSizeMB, accept })}</span>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((item) => (
            <div
              key={item.id}
              className="kk-in kk-in-up flex items-center gap-3 rounded-lg border border-border bg-bg-container p-3 shadow-kk-tertiary"
            >
              {item.previewUrl ? (
                <img
                  src={item.previewUrl}
                  alt={item.name}
                  className="size-10 shrink-0 rounded-sm border border-border object-cover"
                />
              ) : (
                <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-fill-tertiary text-text-tertiary">
                  <FileIcon className="size-5" />
                </span>
              )}

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                  <span className="truncate font-medium text-text">{item.name}</span>
                  <span className="shrink-0 font-mono text-text-quaternary">{formatSize(item.size)}</span>
                </div>

                {item.status === "uploading" ? (
                  <Progress percent={item.percent} showInfo={false} size="small" strokeWidth={2} status="normal" />
                ) : item.status === "error" ? (
                  <span className="flex items-center gap-1 text-[11px] text-error">
                    <CircleAlert className="size-3" />
                    {item.error ?? "Upload failed"}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] text-success">
                    <CircleCheck className="size-3" />
                    {onUpload ? "Uploaded" : "Ready"}
                  </span>
                )}
              </div>

              {item.status === "uploading" && <LoaderCircle className="size-4 shrink-0 animate-spin text-primary" />}

              <button
                type="button"
                aria-label={`Remove ${item.name}`}
                onClick={(event) => {
                  event.stopPropagation();
                  removeFile(item.id);
                }}
                className="kk-press flex size-7 shrink-0 items-center justify-center rounded-md text-text-tertiary transition-colors duration-mid ease-kk-in-out hover:bg-fill-tertiary hover:text-error"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
