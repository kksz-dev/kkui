import { Row, Col } from "@/components/ui/grid";

const box = "rounded-none bg-primary py-4 text-center text-white";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <Row>
        <Col span={8}><div className={box}>col-8</div></Col>
        <Col span={8} offset={8}><div className={box}>col-8</div></Col>
      </Row>
      <Row>
        <Col span={6} offset={6}><div className={box}>col-6 col-offset-6</div></Col>
        <Col span={6} offset={6}><div className={box}>col-6 col-offset-6</div></Col>
      </Row>
      <Row>
        <Col span={12} offset={6}><div className={box}>col-12 col-offset-6</div></Col>
      </Row>
    </div>
  );
}
