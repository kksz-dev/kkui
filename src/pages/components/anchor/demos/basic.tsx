import { Anchor } from "@/components/ui/anchor";
import { Row, Col } from "@/components/ui/grid";

const parts = [
  { id: "part-1", label: "Part 1", bg: "bg-primary-bg" },
  { id: "part-2", label: "Part 2", bg: "bg-success-bg" },
  { id: "part-3", label: "Part 3", bg: "bg-warning-bg" },
];

export default function Demo() {
  return (
    <Row>
      <Col span={16}>
        {parts.map((p) => (
          <div key={p.id} id={p.id} className={`flex h-[400px] items-center justify-center text-lg text-text-secondary ${p.bg}`}>
            {p.label}
          </div>
        ))}
      </Col>
      <Col span={8}>
        <Anchor
          className="pl-4"
          offsetTop={80}
          items={[
            { key: "part-1", href: "#part-1", title: "Part 1" },
            { key: "part-2", href: "#part-2", title: "Part 2" },
            { key: "part-3", href: "#part-3", title: "Part 3" },
          ]}
        />
      </Col>
    </Row>
  );
}
