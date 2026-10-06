import { Badge, PRESET_BADGE_COLORS } from "@/components/ui/badge";

export default function Demo() {
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 text-sm text-text-secondary">Presets</div>
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
          {PRESET_BADGE_COLORS.map((color) => (
            <Badge key={color} color={color} text={color} />
          ))}
        </div>
      </div>
      <div>
        <div className="mb-2 text-sm text-text-secondary">Custom</div>
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
          {["#f50", "#2db7f5", "#87d068", "#108ee9"].map((color) => (
            <Badge key={color} color={color} text={color} />
          ))}
        </div>
      </div>
    </div>
  );
}
