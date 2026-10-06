import { InstallTabs } from "@/components/ui/install-tabs";

export default function BasicDemo() {
  return (
    <div className="space-y-4">
      <InstallTabs packages="@kksz/kkui" />
      <InstallTabs packages={["dayjs", "lucide-react"]} dev />
      <InstallTabs packages="vite --version" action="exec" />
    </div>
  );
}
