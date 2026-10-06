import { Button } from "@/components/ui/button";
import { Tooltip, PRESET_COLORS } from "@/components/ui/tooltip";

const customColors = ["#f50", "#2db7f5", "#87d068", "#108ee9"];

export default function Demo() {
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 text-text-secondary">Presets:</div>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((color) => (
            <Tooltip key={color} title="prompt text" color={color}>
              <Button>{color}</Button>
            </Tooltip>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-2 text-text-secondary">Custom:</div>
        <div className="flex flex-wrap gap-2">
          {customColors.map((color) => (
            <Tooltip key={color} title="prompt text" color={color}>
              <Button>{color}</Button>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
}
