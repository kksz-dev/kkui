import { InstallTabs } from "@/components/ui/install-tabs";

export default function ExecDemo() {
  return (
    <div className="space-y-4">
      <InstallTabs
        action="exec"
        packages="kkui@latest init"
      />
    </div>
  );
}
