import { useState } from "react";
import { Row, Col } from "@/components/ui/grid";

const gutters = [8, 16, 24, 32, 40, 48];
const vgutters = [8, 16, 24, 32, 40, 48];
const colCounts = [2, 3, 4, 6, 8, 12];

function Range({ label, values, value, onChange }: { label: string; values: number[]; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-text-secondary">{label}: {value}</span>
      <input
        type="range"
        min={0}
        max={values.length - 1}
        value={values.indexOf(value)}
        onChange={(e) => onChange(values[Number(e.target.value)])}
        className="w-full max-w-xs accent-primary"
      />
    </label>
  );
}

export default function Demo() {
  const [gutter, setGutter] = useState(16);
  const [vgutter, setVgutter] = useState(16);
  const [count, setCount] = useState(4);
  const span = 24 / count;
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Range label="Horizontal Gutter (px)" values={gutters} value={gutter} onChange={setGutter} />
        <Range label="Vertical Gutter (px)" values={vgutters} value={vgutter} onChange={setVgutter} />
        <Range label="Column Count" values={colCounts} value={count} onChange={setCount} />
      </div>
      <Row gutter={[gutter, vgutter]}>
        {Array.from({ length: count * 2 }).map((_, i) => (
          <Col key={i} span={span}>
            <div className="bg-primary py-2 text-center text-white">Column</div>
          </Col>
        ))}
      </Row>
      <pre className="rounded-md bg-fill-quaternary p-3 font-mono text-xs text-text-secondary">{`<Row gutter={[${gutter}, ${vgutter}]}>\n  <Col span={${span}} />\n  ...\n</Row>`}</pre>
    </div>
  );
}
