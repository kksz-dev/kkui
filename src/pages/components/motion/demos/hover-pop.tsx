import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HoverPopDemo() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Button type="primary">Hover me</Button>
        <Button>Default</Button>
        <Button variant="outlined" color="danger">
          Danger
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {["Card", "Tile", "Panel"].map((label) => (
          <div key={label} className="kk-hover-pop kk-press cursor-pointer">
            <Card size="small" title={label}>
              <span className="text-xs text-text-secondary">Same spring, applied to a surface.</span>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
