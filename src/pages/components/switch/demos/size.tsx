import { Switch } from "@/components/ui/switch";

export default function Demo() {
  return (
    <div className="flex items-center gap-4">
      <Switch defaultChecked />
      <Switch size="small" defaultChecked />
    </div>
  );
}
