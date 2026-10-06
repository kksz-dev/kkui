import * as React from "react";
import { Watermark } from "@/components/ui/watermark";

export default function Demo() {
  const [content, setContent] = React.useState("KKUI KKUI");
  const [color, setColor] = React.useState("rgba(22, 119, 255, 0.2)");
  const [fontSize, setFontSize] = React.useState(16);
  const [rotate, setRotate] = React.useState(-22);
  const [gapX, setGapX] = React.useState(100);
  const [gapY, setGapY] = React.useState(100);

  return (
    <div className="space-y-6">
      <Watermark
        content={content}
        rotate={rotate}
        gap={[gapX, gapY]}
        font={{ color, fontSize }}
      >
        <div className="h-72 rounded-lg border border-border-secondary bg-bg-container p-6">
          <h4 className="text-base font-semibold text-text-heading">Interactive Config Preview</h4>
          <p className="mt-2 text-sm text-text-secondary">
            Adjust the controls below to customize watermark text, angle, color, font size, and spacing.
          </p>
        </div>
      </Watermark>

      <div className="grid grid-cols-1 gap-4 rounded-lg border border-border-secondary bg-fill-quaternary p-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
        <div>
          <label className="mb-1 block text-xs text-text-secondary">Content:</label>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-control w-full rounded border border-border bg-bg-container px-2 text-sm text-text"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-secondary">Font Size ({fontSize}px):</label>
          <input
            type="range"
            min={12}
            max={32}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-secondary">Rotate Angle ({rotate}°):</label>
          <input
            type="range"
            min={-90}
            max={90}
            value={rotate}
            onChange={(e) => setRotate(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-secondary">Gap X ({gapX}px):</label>
          <input
            type="range"
            min={20}
            max={200}
            value={gapX}
            onChange={(e) => setGapX(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-secondary">Gap Y ({gapY}px):</label>
          <input
            type="range"
            min={20}
            max={200}
            value={gapY}
            onChange={(e) => setGapY(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-secondary">Color Preset:</label>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-control w-full rounded border border-border bg-bg-container px-2 text-sm text-text"
          >
            <option value="rgba(22, 119, 255, 0.2)">Blue (Primary)</option>
            <option value="rgba(255, 77, 79, 0.2)">Red (Danger)</option>
            <option value="rgba(82, 196, 26, 0.2)">Green (Success)</option>
            <option value="rgba(0, 0, 0, 0.15)">Neutral Gray</option>
          </select>
        </div>
      </div>
    </div>
  );
}
