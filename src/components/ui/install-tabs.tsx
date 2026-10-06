import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export type PackageManager = "bun" | "npm" | "pnpm" | "yarn";

export interface InstallTabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Package names, or the full command per manager via `commands`. */
  packages?: string | string[];
  /** Override the generated command for one or more managers. */
  commands?: Partial<Record<PackageManager, string>>;
  /** Which managers to offer, in order. */
  managers?: PackageManager[];
  value?: PackageManager;
  defaultValue?: PackageManager;
  onChange?: (manager: PackageManager) => void;
  /** `install` (default), `add`, `dlx`/`x` for one-off runs. */
  action?: "install" | "add" | "exec";
  dev?: boolean;
  /** Remember the choice under this key; false turns persistence off. */
  storageKey?: string | false;
  className?: string;
}

const DEFAULT_MANAGERS: PackageManager[] = ["bun", "npm", "pnpm", "yarn"];
const STORAGE_KEY = "kkui-package-manager";

function buildCommand(manager: PackageManager, names: string[], action: InstallTabsProps["action"], dev: boolean): string {
  const list = names.join(" ");
  if (action === "exec") {
    return {
      bun: `bunx ${list}`,
      npm: `npx ${list}`,
      pnpm: `pnpm dlx ${list}`,
      yarn: `yarn dlx ${list}`,
    }[manager];
  }
  const flag = dev ? (manager === "npm" ? " --save-dev" : " -D") : "";
  const verb = action === "add" || manager === "bun" || manager === "pnpm" || manager === "yarn" ? "add" : "install";
  return `${manager} ${verb} ${list}${flag}`;
}

function readStored(storageKey: string | false, managers: PackageManager[]): PackageManager | null {
  if (storageKey === false || typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(storageKey) as PackageManager | null;
    return saved && managers.includes(saved) ? saved : null;
  } catch {
    return null;
  }
}

const storageListeners = new Map<string, Set<(manager: PackageManager) => void>>();

function subscribeStorage(storageKey: string, callback: (manager: PackageManager) => void) {
  if (!storageListeners.has(storageKey)) {
    storageListeners.set(storageKey, new Set());
  }
  storageListeners.get(storageKey)!.add(callback);
  return () => {
    const set = storageListeners.get(storageKey);
    if (set) {
      set.delete(callback);
      if (set.size === 0) {
        storageListeners.delete(storageKey);
      }
    }
  };
}

function notifyStorageChange(storageKey: string, manager: PackageManager) {
  const set = storageListeners.get(storageKey);
  if (set) {
    set.forEach((callback) => callback(manager));
  }
}

/**
 * The install snippet, one tab per package manager. The choice is remembered,
 * so a reader who uses pnpm sees pnpm on every page after the first.
 */
export function InstallTabs({
  packages = [],
  commands,
  managers = DEFAULT_MANAGERS,
  value,
  defaultValue,
  onChange,
  action = "install",
  dev = false,
  storageKey = STORAGE_KEY,
  className,
  ...props
}: InstallTabsProps) {
  const names = React.useMemo(() => (Array.isArray(packages) ? packages : [packages]).filter(Boolean), [packages]);

  const [inner, setInner] = React.useState<PackageManager>(
    () => defaultValue ?? readStored(storageKey, managers) ?? managers[0],
  );
  const active = value ?? inner;
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (storageKey === false) return;
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === storageKey && event.newValue) {
        const manager = event.newValue as PackageManager;
        if (managers.includes(manager)) {
          setInner(manager);
        }
      }
    };
    window.addEventListener("storage", handleStorageEvent);
    const unsubscribe = subscribeStorage(storageKey, (manager) => {
      if (managers.includes(manager)) {
        setInner(manager);
      }
    });
    return () => {
      window.removeEventListener("storage", handleStorageEvent);
      unsubscribe();
    };
  }, [storageKey, managers]);

  const select = (manager: PackageManager) => {
    if (value === undefined) {
      setInner(manager);
      if (storageKey !== false) {
        notifyStorageChange(storageKey, manager);
      }
    }
    onChange?.(manager);
    if (storageKey !== false) {
      try {
        localStorage.setItem(storageKey, manager);
      } catch {
        /* private mode */
      }
    }
  };

  const command = commands?.[active] ?? buildCommand(active, names, action, dev);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div
      data-slot="install-tabs"
      className={cn("overflow-hidden rounded-lg border border-border bg-bg-container", className)}
      {...props}
    >
      <div role="tablist" aria-label="Package manager" className="flex items-center gap-1 border-b border-border-secondary px-2 pt-1.5">
        {managers.map((manager) => {
          const isActive = manager === active;
          return (
            <button
              key={manager}
              type="button"
              role="tab"
              data-slot="install-tab"
              aria-selected={isActive}
              onClick={() => select(manager)}
              className={cn(
                "relative rounded-t-md px-3 py-1.5 font-mono text-xs transition-colors duration-mid",
                isActive ? "font-medium text-primary" : "text-text-tertiary hover:text-text",
              )}
            >
              {manager}
              {isActive && <span aria-hidden className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />}
            </button>
          );
        })}

        <button
          type="button"
          aria-label={copied ? "Copied" : "Copy command"}
          onClick={copy}
          className="kk-press ml-auto mb-1 flex size-7 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-fill-tertiary hover:text-text"
        >
          {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
        </button>
      </div>

      <pre data-slot="install-command" className="kk-scrollbar overflow-x-auto px-4 py-3 font-mono text-sm text-text">
        <code>{command}</code>
      </pre>
    </div>
  );
}
