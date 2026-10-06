import { Row, Col } from "@/components/ui/grid";

const box = "rounded-none bg-primary py-4 text-center text-white";
const boxLight = "rounded-none bg-primary-hover py-4 text-center text-white";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <Row>
        <Col span={24}><div className={box}>col</div></Col>
      </Row>
      <Row>
        <Col span={12}><div className={box}>col-12</div></Col>
        <Col span={12}><div className={boxLight}>col-12</div></Col>
      </Row>
      <Row>
        <Col span={8}><div className={box}>col-8</div></Col>
        <Col span={8}><div className={boxLight}>col-8</div></Col>
        <Col span={8}><div className={box}>col-8</div></Col>
      </Row>
      <Row>
        <Col span={6}><div className={box}>col-6</div></Col>
        <Col span={6}><div className={boxLight}>col-6</div></Col>
        <Col span={6}><div className={box}>col-6</div></Col>
        <Col span={6}><div className={boxLight}>col-6</div></Col>
      </Row>
    </div>
  );
}
