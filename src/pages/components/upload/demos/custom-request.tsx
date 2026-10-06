import { useState } from "react";
import { Upload, type UploadProps } from "@/components/ui/upload";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [log, setLog] = useState<string[]>([]);

  /** Replaces the built-in XHR: the request options are echoed instead of sent. */
  const customRequest: UploadProps["customRequest"] = ({
    file,
    filename,
    action,
    method,
    headers,
    data,
    withCredentials,
    onProgress,
    onSuccess,
    onError,
  }) => {
    setLog((prev) => [
      ...prev,
      `${method.toUpperCase()} ${action} · field=${filename} · auth=${headers.Authorization} · folder=${String(data.folder)} · credentials=${withCredentials}`,
    ]);

    let percent = 0;
    const timer = setInterval(() => {
      percent += 25;
      if (percent < 100) {
        onProgress({ percent });
        return;
      }
      clearInterval(timer);
      if (file.size === 0) onError(new Error("Empty file rejected"));
      else onSuccess({ id: file.uid });
    }, 220);

    return { abort: () => clearInterval(timer) };
  };

  return (
    <div className="space-y-3">
      <Upload
        multiple
        action="https://example.com/api/files"
        method="put"
        name="attachment"
        headers={{ Authorization: "Bearer demo-token" }}
        data={(file) => ({ folder: "invoices", originalName: file.name })}
        withCredentials
        customRequest={customRequest}
      >
        <Button>Upload with a custom transport</Button>
      </Upload>

      {log.length > 0 && (
        <pre className="overflow-x-auto rounded-md bg-fill-tertiary p-2 text-xs text-text-secondary">{log.join("\n")}</pre>
      )}
    </div>
  );
}
