import * as React from "react";
import {
  Upload as UploadIcon,
  Plus,
  Eye,
  Download,
  Trash2,
  Paperclip,
  FileImage,
  LoaderCircle,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress, type ProgressProps } from "@/components/ui/progress";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type UploadListType = "text" | "picture" | "picture-card" | "picture-circle";
/** Lifecycle of one file. `removed` is only ever seen in `onChange({ file })`. */
export type UploadFileStatus = "uploading" | "done" | "error" | "removed";
export type UploadType = "select" | "drag";

/** A native File decorated with the uid KKUI tracks it by. */
export type UploadRawFile = File & { uid: string };

export interface UploadFile<T = unknown> {
  uid: string;
  name: string;
  size?: number;
  type?: string;
  lastModified?: number;
  /** 0 - 100, kept up to date while `status === "uploading"` */
  percent?: number;
  status?: UploadFileStatus;
  /** Remote url of an already uploaded file */
  url?: string;
  /** Thumbnail url used by the picture list types */
  thumbUrl?: string;
  /** Error thrown by the transport */
  error?: unknown;
  /** Parsed response body */
  response?: T;
  /** The original File, present for files picked in this session */
  originFileObj?: UploadRawFile;
}

export interface UploadProgressEvent {
  percent: number;
}

export interface UploadRequestError extends Error {
  status?: number;
  method?: string;
  url?: string;
}

/** Everything a `customRequest` implementation receives. */
export interface UploadRequestOption<T = unknown> {
  file: UploadRawFile;
  /** form field name (the `name` prop) */
  filename: string;
  action: string;
  method: string;
  headers: Record<string, string>;
  data: Record<string, unknown>;
  withCredentials: boolean;
  onProgress: (event: UploadProgressEvent) => void;
  onSuccess: (body: T, xhr?: XMLHttpRequest) => void;
  onError: (error: UploadRequestError, body?: T) => void;
}

/** Returned by a request implementation so the upload can be aborted. */
export interface UploadRequestTask {
  abort: () => void;
}

export interface UploadChangeParam<T = UploadFile> {
  /** The file this event is about */
  file: T;
  /** The whole list after the change */
  fileList: T[];
  /** Present on progress events */
  event?: UploadProgressEvent;
}

/** Handed to `itemRender` so a custom row can still drive the built-in actions. */
export interface UploadListActions {
  preview: () => void;
  download: () => void;
  remove: () => void;
}

export type UploadIconSlot = React.ReactNode | ((file: UploadFile) => React.ReactNode);

export interface ShowUploadListInterface {
  showPreviewIcon?: boolean;
  showRemoveIcon?: boolean;
  showDownloadIcon?: boolean;
  previewIcon?: UploadIconSlot;
  removeIcon?: UploadIconSlot;
  downloadIcon?: UploadIconSlot;
  /** Extra node rendered after the file name */
  extra?: UploadIconSlot;
}

/** `false` skips the upload but keeps the file, `LIST_IGNORE` drops it entirely. */
export type BeforeUploadValue = boolean | string | File | Blob | void;

export interface UploadProps {
  /* ---- transport ---- */
  /** Upload url, or a resolver called per file */
  action?: string | ((file: UploadRawFile) => string | Promise<string>);
  method?: "POST" | "PUT" | "PATCH" | "post" | "put" | "patch";
  headers?: Record<string, string>;
  /** Extra form fields, or a resolver called per file */
  data?: Record<string, unknown> | ((file: UploadRawFile) => Record<string, unknown> | Promise<Record<string, unknown>>);
  /** Form field name of the file itself */
  name?: string;
  withCredentials?: boolean;
  /** Replace the built-in XHR transport */
  customRequest?: (option: UploadRequestOption) => void | UploadRequestTask;

  /* ---- data ---- */
  fileList?: UploadFile[];
  defaultFileList?: UploadFile[];
  onChange?: (info: UploadChangeParam) => void;
  beforeUpload?: (file: UploadRawFile, fileList: UploadRawFile[]) => BeforeUploadValue | Promise<BeforeUploadValue>;
  maxCount?: number;

  /* ---- list ---- */
  listType?: UploadListType;
  showUploadList?: boolean | ShowUploadListInterface;
  itemRender?: (
    originNode: React.ReactElement,
    file: UploadFile,
    fileList: UploadFile[],
    actions: UploadListActions,
  ) => React.ReactNode;
  iconRender?: (file: UploadFile, listType: UploadListType) => React.ReactNode;
  /** Build the thumbnail of a locally picked file */
  previewFile?: (file: File | Blob) => Promise<string>;
  /** Decide whether a file should render as an image */
  isImageUrl?: (file: UploadFile) => boolean;
  /** Config forwarded to the inline `Progress` */
  progress?: Omit<ProgressProps, "percent">;

  /* ---- trigger ---- */
  type?: UploadType;
  accept?: string;
  multiple?: boolean;
  /** Pick whole folders (input `webkitdirectory` + entry traversal on drop) */
  directory?: boolean;
  capture?: boolean | "user" | "environment";
  openFileDialogOnClick?: boolean;
  disabled?: boolean;
  id?: string;

  /* ---- events ---- */
  onPreview?: (file: UploadFile) => void;
  onDownload?: (file: UploadFile) => void;
  onRemove?: (file: UploadFile) => void | boolean | Promise<void | boolean>;
  onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;

  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export type UploadDraggerProps = Omit<UploadProps, "type">;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Return this from `beforeUpload` to drop a file without adding it to the list. */
export const LIST_IGNORE = "__KKUI_LIST_IGNORE__" as const;

let uidSeed = 0;
const genUid = () => `kk-upload-${Date.now().toString(36)}-${(uidSeed += 1)}`;

function withUid(file: File): UploadRawFile {
  const raw = file as UploadRawFile;
  if (!raw.uid) raw.uid = genUid();
  return raw;
}

function file2Obj(file: UploadRawFile): UploadFile {
  return {
    uid: file.uid,
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    percent: 0,
    originFileObj: file,
  };
}

/** `accept` matching for dropped files (the native input does its own filtering). */
export function attrAccept(file: File, accept?: string): boolean {
  if (!accept) return true;
  const types = accept.split(",").map((t) => t.trim()).filter(Boolean);
  if (!types.length) return true;
  const name = file.name || "";
  const mime = file.type || "";
  const baseMime = mime.replace(/\/.*$/, "");
  return types.some((type) => {
    if (type.startsWith(".")) return name.toLowerCase().endsWith(type.toLowerCase());
    if (/\/\*$/.test(type)) return baseMime === type.replace(/\/.*$/, "");
    if (/^[^/]+\/[^/]+$/.test(type)) return mime === type;
    return true;
  });
}

const IMAGE_EXT = /\.(webp|svg|png|gif|jpe?g|jfif|bmp|ico|heic|heif|avif|tiff?)$/i;

export function defaultIsImageUrl(file: UploadFile): boolean {
  if (file.type?.startsWith("image/")) return true;
  const url = file.thumbUrl || file.url;
  if (!url) return false;
  if (url.startsWith("data:image/")) return true;
  return IMAGE_EXT.test(url.split("?")[0] ?? "");
}

const defaultPreviewFile = (file: File | Blob): Promise<string> => Promise.resolve(URL.createObjectURL(file));

function parseXhrBody(xhr: XMLHttpRequest): unknown {
  const text: unknown = xhr.responseText || xhr.response;
  if (typeof text !== "string" || !text) return text;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/** The built-in transport: multipart XHR with upload progress. */
export function xhrRequest<T = unknown>(option: UploadRequestOption<T>): UploadRequestTask {
  const xhr = new XMLHttpRequest();

  if (xhr.upload) {
    xhr.upload.onprogress = (e: ProgressEvent) => {
      if (e.total > 0) option.onProgress({ percent: (e.loaded / e.total) * 100 });
    };
  }

  const formData = new FormData();
  for (const [key, value] of Object.entries(option.data)) {
    if (Array.isArray(value)) value.forEach((v) => formData.append(`${key}[]`, String(v)));
    else if (value instanceof Blob) formData.append(key, value);
    else if (value !== undefined && value !== null) formData.append(key, String(value));
  }
  formData.append(option.filename, option.file, option.file.name);

  const fail = (message: string, body?: T) => {
    const error = new Error(message) as UploadRequestError;
    error.status = xhr.status;
    error.method = option.method;
    error.url = option.action;
    option.onError(error, body);
  };

  xhr.onerror = () => fail(`Upload of "${option.file.name}" failed`);
  xhr.onabort = () => fail(`Upload of "${option.file.name}" was aborted`);
  xhr.onload = () => {
    const body = parseXhrBody(xhr) as T;
    if (xhr.status < 200 || xhr.status >= 300) {
      fail(`Upload failed with status ${xhr.status}`, body);
      return;
    }
    option.onSuccess(body, xhr);
  };

  xhr.open(option.method, option.action, true);
  if (option.withCredentials) xhr.withCredentials = true;
  for (const [key, value] of Object.entries(option.headers)) {
    if (value !== undefined && value !== null) xhr.setRequestHeader(key, value);
  }
  xhr.send(formData);

  return { abort: () => xhr.abort() };
}

/** Walk a dropped `FileSystemEntry` (used when `directory` is on). */
async function traverseEntry(entry: FileSystemEntry): Promise<File[]> {
  if (entry.isFile) {
    const file = await new Promise<File | null>((res) => {
      (entry as FileSystemFileEntry).file(
        (f) => res(f),
        () => res(null),
      );
    });
    return file ? [file] : [];
  }
  if (entry.isDirectory) {
    const reader = (entry as FileSystemDirectoryEntry).createReader();
    const children: FileSystemEntry[] = [];
    for (;;) {
      // readEntries yields at most 100 entries per call — keep reading until it is empty.
      const batch = await new Promise<FileSystemEntry[]>((res) => {
        reader.readEntries(
          (entries) => res(entries),
          () => res([]),
        );
      });
      if (!batch.length) break;
      children.push(...batch);
    }
    const nested = await Promise.all(children.map(traverseEntry));
    return nested.flat();
  }
  return [];
}

const slotNode = (slot: UploadIconSlot | undefined, file: UploadFile): React.ReactNode =>
  typeof slot === "function" ? slot(file) : slot;

/* ------------------------------------------------------------------ */
/* Upload                                                              */
/* ------------------------------------------------------------------ */

export function Upload({
  action,
  method = "post",
  headers,
  data,
  name = "file",
  withCredentials = false,
  customRequest,
  fileList: fileListProp,
  defaultFileList,
  onChange,
  beforeUpload,
  maxCount,
  listType = "text",
  showUploadList = true,
  itemRender,
  iconRender,
  previewFile,
  isImageUrl = defaultIsImageUrl,
  progress,
  type = "select",
  accept,
  multiple = false,
  directory = false,
  capture,
  openFileDialogOnClick = true,
  disabled = false,
  id,
  onPreview,
  onDownload,
  onRemove,
  onDrop,
  children,
  className,
  style,
}: UploadProps) {
  const [internalList, setInternalList] = React.useState<UploadFile[]>(() => defaultFileList ?? []);
  const isControlled = fileListProp !== undefined;
  const list = isControlled ? fileListProp : internalList;

  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<UploadFile[]>(list);
  const tasksRef = React.useRef<Record<string, UploadRequestTask>>({});
  const objectUrlsRef = React.useRef<string[]>([]);
  const thumbTriedRef = React.useRef<Set<string>>(new Set());
  const mountedRef = React.useRef(true);
  const dragDepth = React.useRef(0);
  const [thumbs, setThumbs] = React.useState<Record<string, string>>({});
  const [dragOver, setDragOver] = React.useState(false);

  listRef.current = list;

  // Async transport callbacks must always see the freshest handler / mode.
  const liveRef = React.useRef({ onChange, isControlled, maxCount });
  liveRef.current = { onChange, isControlled, maxCount };

  const previewFileRef = React.useRef(previewFile);
  previewFileRef.current = previewFile;
  const isImageUrlRef = React.useRef(isImageUrl);
  isImageUrlRef.current = isImageUrl;

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      Object.values(tasksRef.current).forEach((task) => task.abort());
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // `webkitdirectory` is not part of the React input typings — set it on the node.
  React.useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    if (directory) {
      el.setAttribute("webkitdirectory", "");
      el.setAttribute("directory", "");
    } else {
      el.removeAttribute("webkitdirectory");
      el.removeAttribute("directory");
    }
  }, [directory]);

  /* ---------------- list plumbing ---------------- */

  const trim = (arr: UploadFile[]) => {
    const limit = liveRef.current.maxCount;
    if (limit === 1) return arr.slice(-1);
    if (limit) return arr.slice(0, limit);
    return arr;
  };

  const triggerChange = (file: UploadFile, nextList: UploadFile[], event?: UploadProgressEvent) => {
    const trimmed = trim(nextList);
    // A file that left the list (trimmed by maxCount, filtered out by a controlled parent)
    // must not keep uploading in the background.
    const alive = new Set(trimmed.map((f) => f.uid));
    for (const uid of Object.keys(tasksRef.current)) {
      if (alive.has(uid)) continue;
      tasksRef.current[uid]?.abort();
      delete tasksRef.current[uid];
    }
    listRef.current = trimmed;
    if (!liveRef.current.isControlled) setInternalList(trimmed);
    liveRef.current.onChange?.({ file, fileList: trimmed, event });
  };

  const patchFile = (uid: string, patch: Partial<UploadFile>, event?: UploadProgressEvent) => {
    const target = listRef.current.find((f) => f.uid === uid);
    if (!target) return; // already removed — drop the late event
    const merged: UploadFile = { ...target, ...patch };
    triggerChange(
      merged,
      listRef.current.map((f) => (f.uid === uid ? merged : f)),
      event,
    );
  };

  /* ---------------- transport ---------------- */

  const hasTransport = Boolean(action || customRequest);

  const startUpload = async (file: UploadRawFile) => {
    const resolvedAction = typeof action === "function" ? await action(file) : action;
    const resolvedData = (typeof data === "function" ? await data(file) : data) ?? {};

    const option: UploadRequestOption = {
      file,
      filename: name,
      action: resolvedAction ?? "",
      method,
      headers: headers ?? {},
      data: resolvedData,
      withCredentials,
      onProgress: (event) => patchFile(file.uid, { status: "uploading", percent: event.percent }, event),
      onSuccess: (body) => {
        delete tasksRef.current[file.uid];
        patchFile(file.uid, { status: "done", percent: 100, response: body });
      },
      onError: (error, body) => {
        delete tasksRef.current[file.uid];
        patchFile(file.uid, { status: "error", error, response: body });
      },
    };

    const task = (customRequest ? customRequest(option) : xhrRequest(option)) as UploadRequestTask | undefined;
    if (task?.abort) tasksRef.current[file.uid] = task;
  };

  /* ---------------- picking files ---------------- */

  const handleFiles = async (raw: File[]) => {
    if (disabled || raw.length === 0) return;

    const candidates = raw.filter((f) => attrAccept(f, accept)).map(withUid);
    if (!candidates.length) return;

    /** `payload === null` → `beforeUpload` returned false: list it, never upload it. */
    const prepared: { entry: UploadRawFile; payload: UploadRawFile | null }[] = [];

    for (const file of candidates) {
      if (!beforeUpload) {
        prepared.push({ entry: file, payload: file });
        continue;
      }
      const result = await beforeUpload(file, candidates);
      if (result === LIST_IGNORE) continue;
      if (result === false) {
        prepared.push({ entry: file, payload: null });
        continue;
      }
      if (result instanceof File || result instanceof Blob) {
        const transformed = (
          result instanceof File ? result : new File([result], file.name, { type: result.type })
        ) as UploadRawFile;
        transformed.uid = file.uid;
        prepared.push({ entry: transformed, payload: transformed });
        continue;
      }
      prepared.push({ entry: file, payload: file });
    }

    if (!prepared.length) return;

    const added = prepared.map(({ entry, payload }) => ({
      ...file2Obj(entry),
      status: payload && hasTransport ? ("uploading" as const) : undefined,
    }));

    const nextList = [...listRef.current, ...added];
    added.forEach((item) => triggerChange(item, nextList));

    if (!hasTransport) return;
    const kept = new Set(listRef.current.map((f) => f.uid));
    for (const { payload } of prepared) {
      if (payload && kept.has(payload.uid)) void startUpload(payload);
    }
  };

  /* ---------------- item actions ---------------- */

  const thumbOf = (file: UploadFile) => file.thumbUrl || file.url || thumbs[file.uid];

  /** Hand handlers a file whose `thumbUrl` is filled in with the generated preview. */
  const withThumb = (file: UploadFile): UploadFile => {
    const url = thumbOf(file);
    return url && url !== file.thumbUrl ? { ...file, thumbUrl: url } : file;
  };

  const previewItem = (file: UploadFile) => {
    if (onPreview) {
      onPreview(withThumb(file));
      return;
    }
    const url = thumbOf(file);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  const downloadItem = (file: UploadFile) => {
    if (onDownload) {
      onDownload(withThumb(file));
      return;
    }
    const url = file.url ?? thumbOf(file);
    if (!url) return;
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = file.name;
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const removeItem = async (file: UploadFile) => {
    const result = await onRemove?.(file);
    if (result === false) return;
    tasksRef.current[file.uid]?.abort();
    delete tasksRef.current[file.uid];
    thumbTriedRef.current.delete(file.uid);
    triggerChange(
      { ...file, status: "removed" },
      listRef.current.filter((f) => f.uid !== file.uid),
    );
  };

  /* ---------------- thumbnails ---------------- */

  const isPictureList = listType === "picture" || listType === "picture-card" || listType === "picture-circle";

  React.useEffect(() => {
    if (!isPictureList) return;
    for (const file of list) {
      const origin = file.originFileObj;
      if (!origin || file.thumbUrl || file.url) continue;
      if (thumbTriedRef.current.has(file.uid)) continue;
      if (!isImageUrlRef.current(file)) continue;
      thumbTriedRef.current.add(file.uid);
      const generate = previewFileRef.current ?? defaultPreviewFile;
      void generate(origin).then((url) => {
        if (!mountedRef.current || !url) return;
        if (url.startsWith("blob:")) objectUrlsRef.current.push(url);
        setThumbs((prev) => ({ ...prev, [file.uid]: url }));
      });
    }
  }, [list, isPictureList]);

  /* ---------------- trigger ---------------- */

  const openFileDialog = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragDepth.current = 0;
    setDragOver(false);
    if (disabled) return;
    onDrop?.(event);

    const transfer = event.dataTransfer;
    let files: File[] = [];

    const entries =
      directory && transfer.items?.length
        ? Array.from(transfer.items)
            .map((item) => (typeof item.webkitGetAsEntry === "function" ? item.webkitGetAsEntry() : null))
            .filter((entry): entry is FileSystemEntry => entry !== null)
        : [];

    if (entries.length) {
      const nested = await Promise.all(entries.map(traverseEntry));
      files = nested.flat();
    } else {
      files = Array.from(transfer.files ?? []);
    }

    if (!multiple && !directory && files.length > 1) files = files.slice(0, 1);
    await handleFiles(files);
  };

  const dropHandlers = {
    onDragEnter: (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      dragDepth.current += 1;
      if (!disabled) setDragOver(true);
    },
    onDragOver: (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!disabled) event.dataTransfer.dropEffect = "copy";
    },
    onDragLeave: () => {
      dragDepth.current -= 1;
      if (dragDepth.current <= 0) {
        dragDepth.current = 0;
        setDragOver(false);
      }
    },
    onDrop: (event: React.DragEvent<HTMLDivElement>) => void handleDrop(event),
  };

  const triggerHandlers = {
    ...dropHandlers,
    onClick: openFileDialogOnClick ? openFileDialog : undefined,
    onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!openFileDialogOnClick) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openFileDialog();
      }
    },
    role: "button" as const,
    tabIndex: disabled ? -1 : 0,
    "aria-disabled": disabled || undefined,
  };

  /* ---------------- list config ---------------- */

  const showList = showUploadList !== false;
  const listConfig: ShowUploadListInterface = typeof showUploadList === "object" ? showUploadList : {};
  const showPreviewIcon = listConfig.showPreviewIcon ?? true;
  const showRemoveIcon = listConfig.showRemoveIcon ?? true;
  const showDownloadIcon = listConfig.showDownloadIcon ?? false;

  const items = showList ? list.filter((f) => f.status !== "removed") : [];
  const isCard = listType === "picture-card" || listType === "picture-circle";
  // Card tiles share the row with the trigger, so the trigger has to disappear at the limit.
  // Text/picture lists keep it: picking again replaces (maxCount 1) or is trimmed away.
  const showTrigger = !isCard || maxCount === undefined || items.length < maxCount;

  const renderIcon = (file: UploadFile): React.ReactNode => {
    if (iconRender) return iconRender(file, listType);
    if (file.status === "uploading") return <LoaderCircle className="size-4 animate-spin text-primary" />;
    if (isImageUrl(file)) return <FileImage className="size-4" />;
    return <Paperclip className="size-4" />;
  };

  const actionButton = (
    key: string,
    label: string,
    icon: React.ReactNode,
    onClick: () => void,
    tone?: "danger",
  ) => (
    <button
      key={key}
      type="button"
      title={label}
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={cn(
        "kk-press inline-flex size-6 items-center justify-center rounded-sm text-text-tertiary transition-colors duration-mid ease-kk-in-out hover:bg-fill-tertiary hover:text-text",
        tone === "danger" && "hover:text-error",
      )}
    >
      {icon}
    </button>
  );

  const rowActions = (file: UploadFile) => {
    const nodes: React.ReactNode[] = [];
    if (showPreviewIcon)
      nodes.push(
        actionButton(
          "preview",
          "Preview file",
          slotNode(listConfig.previewIcon, file) ?? <Eye className="size-4" />,
          () => previewItem(file),
        ),
      );
    if (showDownloadIcon)
      nodes.push(
        actionButton(
          "download",
          "Download file",
          slotNode(listConfig.downloadIcon, file) ?? <Download className="size-4" />,
          () => downloadItem(file),
        ),
      );
    if (showRemoveIcon)
      nodes.push(
        actionButton(
          "remove",
          "Remove file",
          slotNode(listConfig.removeIcon, file) ?? <Trash2 className="size-4" />,
          () => void removeItem(file),
          "danger",
        ),
      );
    return nodes;
  };

  const progressBar = (file: UploadFile) => (
    <Progress
      percent={Math.round(file.percent ?? 0)}
      showInfo={false}
      size="small"
      strokeWidth={2}
      status="normal"
      {...progress}
    />
  );

  const thumbBox = (file: UploadFile, size: string) => {
    const url = thumbOf(file);
    return url && isImageUrl(file) ? (
      <img src={url} alt={file.name} className={cn(size, "shrink-0 rounded-sm border border-border object-cover")} />
    ) : (
      <span
        className={cn(
          size,
          "flex shrink-0 items-center justify-center rounded-sm border border-border bg-fill-tertiary text-text-tertiary",
        )}
      >
        {renderIcon(file)}
      </span>
    );
  };

  /* ---------------- rows ---------------- */

  const textRow = (file: UploadFile) => (
    <div
      className={cn(
        "kk-in kk-in-up group/item flex flex-col gap-1 rounded-md px-2 py-1.5 transition-colors duration-mid ease-kk-in-out hover:bg-fill-quaternary",
        file.status === "error" && "bg-error-bg",
      )}
    >
      <div className="flex items-center gap-2">
        {listType === "picture" ? (
          thumbBox(file, "size-11")
        ) : (
          <span className={cn("shrink-0", file.status === "error" ? "text-error" : "text-text-tertiary")}>
            {renderIcon(file)}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => previewItem(file)}
            title={file.name}
            className={cn(
              "block max-w-full truncate text-left text-sm transition-colors duration-mid ease-kk-in-out hover:text-primary",
              file.status === "error" ? "text-error" : "text-text",
            )}
          >
            {file.name}
          </button>
          {listConfig.extra && (
            <span className="text-xs text-text-tertiary">{slotNode(listConfig.extra, file)}</span>
          )}
          {listType === "picture" && file.status === "uploading" && (
            <div className="mt-1">{progressBar(file)}</div>
          )}
        </div>
        <span className="flex shrink-0 items-center gap-0.5 opacity-60 transition-opacity duration-mid group-hover/item:opacity-100">
          {rowActions(file)}
        </span>
      </div>
      {listType === "text" && file.status === "uploading" && <div className="pl-6">{progressBar(file)}</div>}
    </div>
  );

  const cardTile = (file: UploadFile) => {
    const url = thumbOf(file);
    const uploading = file.status === "uploading";
    return (
      <div
        className={cn(
          "kk-in kk-in-zoom group/item relative flex size-26 flex-col items-center justify-center overflow-hidden border border-border bg-bg-container p-2 text-center transition-colors duration-mid ease-kk-in-out",
          listType === "picture-circle" ? "rounded-full" : "rounded-lg",
          file.status === "error" && "border-error-border bg-error-bg",
        )}
      >
        {uploading ? (
          <>
            <LoaderCircle className="size-5 animate-spin text-primary" />
            <span className="mt-1 w-full truncate text-[11px] text-text-tertiary">{file.name}</span>
            <div className="mt-1 w-full px-1">{progressBar(file)}</div>
          </>
        ) : url && isImageUrl(file) ? (
          <img src={url} alt={file.name} className="size-full object-cover" />
        ) : (
          <>
            <span className={cn(file.status === "error" ? "text-error" : "text-text-tertiary")}>
              {renderIcon(file)}
            </span>
            <span className="mt-1 w-full truncate text-[11px] text-text-secondary">{file.name}</span>
          </>
        )}

        {!uploading && (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center gap-1 bg-bg-mask opacity-0 transition-opacity duration-mid ease-kk-in-out group-hover/item:opacity-100",
              listType === "picture-circle" ? "rounded-full" : "rounded-lg",
            )}
          >
            {showPreviewIcon && (
              <button
                type="button"
                title="Preview file"
                aria-label="Preview file"
                onClick={() => previewItem(file)}
                className="kk-press inline-flex size-7 items-center justify-center rounded-sm text-white/85 transition-colors duration-mid hover:text-white"
              >
                {slotNode(listConfig.previewIcon, file) ?? <Eye className="size-4" />}
              </button>
            )}
            {showDownloadIcon && (
              <button
                type="button"
                title="Download file"
                aria-label="Download file"
                onClick={() => downloadItem(file)}
                className="kk-press inline-flex size-7 items-center justify-center rounded-sm text-white/85 transition-colors duration-mid hover:text-white"
              >
                {slotNode(listConfig.downloadIcon, file) ?? <Download className="size-4" />}
              </button>
            )}
            {showRemoveIcon && (
              <button
                type="button"
                title="Remove file"
                aria-label="Remove file"
                onClick={() => void removeItem(file)}
                className="kk-press inline-flex size-7 items-center justify-center rounded-sm text-white/85 transition-colors duration-mid hover:text-white"
              >
                {slotNode(listConfig.removeIcon, file) ?? <Trash2 className="size-4" />}
              </button>
            )}
            {listConfig.extra && (
              <span className="absolute inset-x-1 bottom-1 truncate text-[11px] text-white/80">
                {slotNode(listConfig.extra, file)}
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderItem = (file: UploadFile) => {
    const node = isCard ? cardTile(file) : textRow(file);
    if (!itemRender) return <React.Fragment key={file.uid}>{node}</React.Fragment>;
    return (
      <React.Fragment key={file.uid}>
        {itemRender(node, file, items, {
          preview: () => previewItem(file),
          download: () => downloadItem(file),
          remove: () => void removeItem(file),
        })}
      </React.Fragment>
    );
  };

  /* ---------------- trigger content ---------------- */

  const dragContent = children ?? (
    <>
      <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary-bg text-primary">
        <Inbox className="size-6" />
      </span>
      <span className="text-base text-text">Click or drag file to this area to upload</span>
      <span className="mt-1 text-sm text-text-secondary">
        Support for a single or bulk upload. Do not upload confidential data.
      </span>
    </>
  );

  const trigger =
    type === "drag" ? (
      <div
        {...triggerHandlers}
        className={cn(
          "kk-press flex min-h-40 w-full flex-col items-center justify-center rounded-lg border border-dashed border-border bg-fill-quaternary p-6 text-center transition-colors duration-mid ease-kk-in-out outline-none focus-visible:ring-[3px] focus-visible:ring-primary/30",
          !disabled && "cursor-pointer hover:border-primary",
          dragOver && "border-primary bg-primary-bg",
          disabled && "cursor-not-allowed bg-bg-container-disabled text-text-disabled",
        )}
      >
        {dragContent}
      </div>
    ) : isCard ? (
      <div
        {...triggerHandlers}
        className={cn(
          "kk-press flex size-26 flex-col items-center justify-center gap-1 border border-dashed border-border bg-fill-quaternary text-text-secondary transition-colors duration-mid ease-kk-in-out outline-none focus-visible:ring-[3px] focus-visible:ring-primary/30",
          listType === "picture-circle" ? "rounded-full" : "rounded-lg",
          !disabled && "cursor-pointer hover:border-primary hover:text-primary",
          dragOver && "border-primary bg-primary-bg text-primary",
          disabled && "cursor-not-allowed bg-bg-container-disabled text-text-disabled",
        )}
      >
        {children ?? (
          <>
            <Plus className="size-5" />
            <span className="text-xs">Upload</span>
          </>
        )}
      </div>
    ) : (
      <div
        {...triggerHandlers}
        className={cn(
          "inline-block outline-none",
          dragOver && "rounded-md ring-[3px] ring-primary/30",
          disabled && "cursor-not-allowed",
        )}
      >
        {children ?? (
          <Button icon={<UploadIcon className="size-4" />} disabled={disabled}>
            Click to Upload
          </Button>
        )}
      </div>
    );

  return (
    <div data-slot="upload" data-list-type={listType} className={cn("w-full", className)} style={style}>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple || directory}
        capture={capture}
        disabled={disabled}
        className="hidden"
        onChange={(event) => {
          const picked = Array.from(event.target.files ?? []);
          event.target.value = ""; // allow re-picking the same file
          void handleFiles(picked);
        }}
      />

      {isCard ? (
        <div className="flex flex-wrap gap-2">
          {items.map(renderItem)}
          {showTrigger && trigger}
        </div>
      ) : (
        <>
          {trigger}
          {items.length > 0 && <div className="mt-2 space-y-1">{items.map(renderItem)}</div>}
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Upload.Dragger                                                      */
/* ------------------------------------------------------------------ */

export function UploadDragger(props: UploadDraggerProps) {
  return <Upload {...props} type="drag" />;
}

Upload.Dragger = UploadDragger;
Upload.LIST_IGNORE = LIST_IGNORE;
