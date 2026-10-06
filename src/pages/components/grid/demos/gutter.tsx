import { Row, Col } from "@/components/ui/grid";

const box = "rounded-none bg-primary py-4 text-center text-white";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-text-secondary">Horizontal</p>
      <Row gutter={16}>
        <Col span={6}><div className={box}>col-6</div></Col>
        <Col span={6}><div className={box}>col-6</div></Col>
        <Col span={6}><div className={box}>col-6</div></Col>
        <Col span={6}><div className={box}>col-6</div></Col>
      </Row>
      <p className="text-text-secondary">Responsive</p>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={6}><div className={box}>col-6</div></Col>
        <Col span={6}><div className={box}>col-6</div></Col>
        <Col span={6}><div className={box}>col-6</div></Col>
        <Col span={6}><div className={box}>col-6</div></Col>
      </Row>
      <p className="text-text-secondary">Vertical</p>
      <Row gutter={[16, 24]}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Col key={i} span={6}><div className={box}>col-6</div></Col>
        ))}
      </Row>
    </div>
  );
}
