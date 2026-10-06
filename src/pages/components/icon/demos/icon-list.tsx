import * as React from "react";
import {
  Search,
  Home,
  User,
  Settings,
  Trash2,
  Pencil,
  Plus,
  Minus,
  X,
  Check,
  Loader2,
  Download,
  Upload,
  Eye,
  EyeOff,
  Heart,
  Star,
  Bell,
  Mail,
  Phone,
  Calendar,
  Clock,
  Info,
  CheckCircle2,
  AlertCircle,
  XCircle,
  HelpCircle,
  Filter,
  ArrowUpNarrowWide,
  Folder,
  FileText,
  Copy,
  Share2,
  Link,
  Lock,
  Unlock,
  Tag,
  Tags,
  MessageSquare,
  Send,
  Power,
  RefreshCw,
  RotateCw,
  Menu,
  MoreHorizontal,
  ZoomIn,
  ZoomOut,
  Camera,
  Image as ImageIcon,
  Video,
  Volume2,
  Printer,
  Inbox,
  Code,
  Bug,
  Compass,
  Globe,
  ShoppingBag,
  ShoppingCart,
  CreditCard,
  DollarSign,
  BookOpen,
  Cloud,
  CloudUpload,
  CloudDownload,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Check as CopiedCheck,
} from "lucide-react";

interface IconItem {
  aliasName: string;
  lucideName: string;
  category: string;
  IconComponent: React.ComponentType<{ className?: string }>;
}

const ICON_REGISTRY: IconItem[] = [
  // Navigation & Directional
  { aliasName: "ArrowLeftOutlined", lucideName: "ArrowLeft", category: "Directional", IconComponent: ArrowLeft },
  { aliasName: "ArrowRightOutlined", lucideName: "ArrowRight", category: "Directional", IconComponent: ArrowRight },
  { aliasName: "ArrowUpOutlined", lucideName: "ArrowUp", category: "Directional", IconComponent: ArrowUp },
  { aliasName: "ArrowDownOutlined", lucideName: "ArrowDown", category: "Directional", IconComponent: ArrowDown },
  { aliasName: "LeftOutlined", lucideName: "ChevronLeft", category: "Directional", IconComponent: ChevronLeft },
  { aliasName: "RightOutlined", lucideName: "ChevronRight", category: "Directional", IconComponent: ChevronRight },
  { aliasName: "UpOutlined", lucideName: "ChevronUp", category: "Directional", IconComponent: ChevronUp },
  { aliasName: "DownOutlined", lucideName: "ChevronDown", category: "Directional", IconComponent: ChevronDown },

  // Common UI
  { aliasName: "SearchOutlined", lucideName: "Search", category: "General", IconComponent: Search },
  { aliasName: "HomeOutlined", lucideName: "Home", category: "General", IconComponent: Home },
  { aliasName: "UserOutlined", lucideName: "User", category: "General", IconComponent: User },
  { aliasName: "SettingOutlined", lucideName: "Settings", category: "General", IconComponent: Settings },
  { aliasName: "DeleteOutlined", lucideName: "Trash2", category: "General", IconComponent: Trash2 },
  { aliasName: "EditOutlined", lucideName: "Pencil", category: "General", IconComponent: Pencil },
  { aliasName: "PlusOutlined", lucideName: "Plus", category: "General", IconComponent: Plus },
  { aliasName: "MinusOutlined", lucideName: "Minus", category: "General", IconComponent: Minus },
  { aliasName: "CloseOutlined", lucideName: "X", category: "General", IconComponent: X },
  { aliasName: "CheckOutlined", lucideName: "Check", category: "General", IconComponent: Check },
  { aliasName: "LoadingOutlined", lucideName: "Loader2", category: "General", IconComponent: Loader2 },
  { aliasName: "MenuOutlined", lucideName: "Menu", category: "General", IconComponent: Menu },
  { aliasName: "EllipsisOutlined", lucideName: "MoreHorizontal", category: "General", IconComponent: MoreHorizontal },

  // Feedback & Status
  { aliasName: "InfoCircleOutlined", lucideName: "Info", category: "Feedback", IconComponent: Info },
  { aliasName: "CheckCircleOutlined", lucideName: "CheckCircle2", category: "Feedback", IconComponent: CheckCircle2 },
  { aliasName: "ExclamationCircleOutlined", lucideName: "AlertCircle", category: "Feedback", IconComponent: AlertCircle },
  { aliasName: "CloseCircleOutlined", lucideName: "XCircle", category: "Feedback", IconComponent: XCircle },
  { aliasName: "QuestionCircleOutlined", lucideName: "HelpCircle", category: "Feedback", IconComponent: HelpCircle },

  // Media & Devices
  { aliasName: "EyeOutlined", lucideName: "Eye", category: "Media", IconComponent: Eye },
  { aliasName: "EyeInvisibleOutlined", lucideName: "EyeOff", category: "Media", IconComponent: EyeOff },
  { aliasName: "ZoomInOutlined", lucideName: "ZoomIn", category: "Media", IconComponent: ZoomIn },
  { aliasName: "ZoomOutOutlined", lucideName: "ZoomOut", category: "Media", IconComponent: ZoomOut },
  { aliasName: "PictureOutlined", lucideName: "Image", category: "Media", IconComponent: ImageIcon },
  { aliasName: "CameraOutlined", lucideName: "Camera", category: "Media", IconComponent: Camera },
  { aliasName: "VideoCameraOutlined", lucideName: "Video", category: "Media", IconComponent: Video },
  { aliasName: "SoundOutlined", lucideName: "Volume2", category: "Media", IconComponent: Volume2 },
  { aliasName: "PrinterOutlined", lucideName: "Printer", category: "Media", IconComponent: Printer },

  // Data & Documents
  { aliasName: "FolderOutlined", lucideName: "Folder", category: "Data", IconComponent: Folder },
  { aliasName: "FileOutlined", lucideName: "FileText", category: "Data", IconComponent: FileText },
  { aliasName: "CopyOutlined", lucideName: "Copy", category: "Data", IconComponent: Copy },
  { aliasName: "CalendarOutlined", lucideName: "Calendar", category: "Data", IconComponent: Calendar },
  { aliasName: "ClockCircleOutlined", lucideName: "Clock", category: "Data", IconComponent: Clock },
  { aliasName: "FilterOutlined", lucideName: "Filter", category: "Data", IconComponent: Filter },
  { aliasName: "SortAscendingOutlined", lucideName: "ArrowUpNarrowWide", category: "Data", IconComponent: ArrowUpNarrowWide },

  // Actions & Utilities
  { aliasName: "DownloadOutlined", lucideName: "Download", category: "Actions", IconComponent: Download },
  { aliasName: "UploadOutlined", lucideName: "Upload", category: "Actions", IconComponent: Upload },
  { aliasName: "SyncOutlined", lucideName: "RefreshCw", category: "Actions", IconComponent: RefreshCw },
  { aliasName: "ReloadOutlined", lucideName: "RotateCw", category: "Actions", IconComponent: RotateCw },
  { aliasName: "ShareAltOutlined", lucideName: "Share2", category: "Actions", IconComponent: Share2 },
  { aliasName: "LinkOutlined", lucideName: "Link", category: "Actions", IconComponent: Link },
  { aliasName: "LockOutlined", lucideName: "Lock", category: "Actions", IconComponent: Lock },
  { aliasName: "UnlockOutlined", lucideName: "Unlock", category: "Actions", IconComponent: Unlock },
  { aliasName: "PoweroffOutlined", lucideName: "Power", category: "Actions", IconComponent: Power },

  // Commerce & Brand
  { aliasName: "ShoppingOutlined", lucideName: "ShoppingBag", category: "Commerce", IconComponent: ShoppingBag },
  { aliasName: "ShoppingCartOutlined", lucideName: "ShoppingCart", category: "Commerce", IconComponent: ShoppingCart },
  { aliasName: "CreditCardOutlined", lucideName: "CreditCard", category: "Commerce", IconComponent: CreditCard },
  { aliasName: "DollarOutlined", lucideName: "DollarSign", category: "Commerce", IconComponent: DollarSign },
  { aliasName: "TagOutlined", lucideName: "Tag", category: "Commerce", IconComponent: Tag },
  { aliasName: "TagsOutlined", lucideName: "Tags", category: "Commerce", IconComponent: Tags },

  // Social & Communication
  { aliasName: "HeartOutlined", lucideName: "Heart", category: "Social", IconComponent: Heart },
  { aliasName: "StarOutlined", lucideName: "Star", category: "Social", IconComponent: Star },
  { aliasName: "BellOutlined", lucideName: "Bell", category: "Social", IconComponent: Bell },
  { aliasName: "MailOutlined", lucideName: "Mail", category: "Social", IconComponent: Mail },
  { aliasName: "PhoneOutlined", lucideName: "Phone", category: "Social", IconComponent: Phone },
  { aliasName: "MessageOutlined", lucideName: "MessageSquare", category: "Social", IconComponent: MessageSquare },
  { aliasName: "SendOutlined", lucideName: "Send", category: "Social", IconComponent: Send },
  { aliasName: "GlobalOutlined", lucideName: "Globe", category: "Social", IconComponent: Globe },

  // Development & System
  { aliasName: "CodeOutlined", lucideName: "Code", category: "Dev", IconComponent: Code },
  { aliasName: "BugOutlined", lucideName: "Bug", category: "Dev", IconComponent: Bug },
  { aliasName: "CloudOutlined", lucideName: "Cloud", category: "Dev", IconComponent: Cloud },
  { aliasName: "CloudUploadOutlined", lucideName: "CloudUpload", category: "Dev", IconComponent: CloudUpload },
  { aliasName: "CloudDownloadOutlined", lucideName: "CloudDownload", category: "Dev", IconComponent: CloudDownload },
  { aliasName: "InboxOutlined", lucideName: "Inbox", category: "Dev", IconComponent: Inbox },
  { aliasName: "BookOutlined", lucideName: "BookOpen", category: "Dev", IconComponent: BookOpen },
  { aliasName: "CompassOutlined", lucideName: "Compass", category: "Dev", IconComponent: Compass },
];

export default function IconListDemo() {
  const [search, setSearch] = React.useState("");
  const [copiedName, setCopiedName] = React.useState<string | null>(null);
  const copyTimer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const filtered = ICON_REGISTRY.filter((item) => {
    const q = search.toLowerCase().trim();
    return (
      item.aliasName.toLowerCase().includes(q) ||
      item.lucideName.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleCopy = (item: IconItem) => {
    const importCode = `import { ${item.lucideName} } from "lucide-react";`;
    navigator.clipboard
      ?.writeText(importCode)
      .then(() => {
        setCopiedName(item.lucideName);
        window.clearTimeout(copyTimer.current);
        copyTimer.current = window.setTimeout(() => {
          setCopiedName(null);
        }, 2000);
      })
      .catch(() => {
        /* clipboard unavailable */
      });
  };

  return (
    <div className="w-full space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-tertiary" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search icons (e.g. Search, Home, Delete, Eye...)"
          className="h-control w-full rounded-md border border-border bg-bg-container pl-9 pr-4 text-sm text-text outline-none transition-all placeholder:text-text-placeholder focus:border-primary focus:ring-[3px] focus:ring-primary/20"
        />
      </div>

      {/* Copied alert toast banner */}
      {copiedName && (
        <div className="inline-flex items-center gap-2 rounded-md bg-primary-bg px-3 py-1.5 text-xs text-primary animate-in fade-in-0 duration-200">
          <CopiedCheck className="size-3.5" />
          <span>
            Copied <code>{`import { ${copiedName} } from "lucide-react";`}</code> to clipboard!
          </span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {filtered.map((item) => {
          const { IconComponent } = item;
          const isCopied = copiedName === item.lucideName;

          return (
            <button
              key={item.lucideName}
              type="button"
              onClick={() => handleCopy(item)}
              title={`Click to copy: import { ${item.lucideName} } from "lucide-react"`}
              className="group flex flex-col items-center justify-center gap-2 rounded-lg border border-border/60 bg-bg-container p-4 text-center outline-none transition-all duration-mid hover:-translate-y-0.5 hover:border-primary hover:shadow-kk focus-visible:ring-[3px] focus-visible:ring-primary/30 cursor-pointer"
            >
              <span className="flex size-10 items-center justify-center text-text transition-transform duration-mid group-hover:scale-110 group-hover:text-primary">
                {isCopied ? (
                  <CopiedCheck className="size-6 text-success animate-in zoom-in-50" />
                ) : (
                  <IconComponent className="size-6" />
                )}
              </span>
              <span className="w-full truncate text-xs font-medium text-text">
                {item.lucideName}
              </span>
              <span className="w-full truncate text-[11px] text-text-tertiary font-mono">
                {item.aliasName}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-sm text-text-tertiary">
          No matching icons found for &quot;{search}&quot;.
        </div>
      )}
    </div>
  );
}
