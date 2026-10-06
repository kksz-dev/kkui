import { Switch } from "@/components/ui/switch";

export default function Demo() {
  return (
    <div className="flex items-center gap-4">
      <Switch loading defaultChecked />
      <Switch size="small" loading />
    </div>
  );
}
