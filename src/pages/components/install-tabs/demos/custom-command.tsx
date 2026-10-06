import { InstallTabs } from "@/components/ui/install-tabs";

export default function CustomCommandDemo() {
  return (
    <div className="space-y-4">
      <InstallTabs
        packages={["clsx", "tailwind-merge", "lucide-react"]}
        dev
      />
    </div>
  );
}
