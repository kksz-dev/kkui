import { Row, Col } from "@/components/ui/grid";

const box = "rounded-none bg-primary py-4 text-center text-white";
const boxLight = "rounded-none bg-primary-hover py-4 text-center text-white";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-text-secondary">sub-element align left</p>
      <Row justify="start">
        <Col span={4}><div className={box}>col-4</div></Col>
        <Col span={4}><div className={boxLight}>col-4</div></Col>
        <Col span={4}><div className={box}>col-4</div></Col>
        <Col span={4}><div className={boxLight}>col-4</div></Col>
      </Row>
      <p className="text-text-secondary">sub-element align center</p>
      <Row justify="center">
        <Col span={4}><div className={box}>col-4</div></Col>
        <Col span={4}><div className={boxLight}>col-4</div></Col>
        <Col span={4}><div className={box}>col-4</div></Col>
        <Col span={4}><div className={boxLight}>col-4</div></Col>
      </Row>
      <p className="text-text-secondary">sub-element align right</p>
      <Row justify="end">
        <Col span={4}><div className={box}>col-4</div></Col>
        <Col span={4}><div className={boxLight}>col-4</div></Col>
        <Col span={4}><div className={box}>col-4</div></Col>
        <Col span={4}><div className={boxLight}>col-4</div></Col>
      </Row>
      <p className="text-text-secondary">sub-element monospaced arrangement</p>
      <Row justify="space-between">
        <Col span={4}><div className={box}>col-4</div></Col>
        <Col span={4}><div className={boxLight}>col-4</div></Col>
        <Col span={4}><div className={box}>col-4</div></Col>
        <Col span={4}><div className={boxLight}>col-4</div></Col>
      </Row>
      <p className="text-text-secondary">sub-element align full</p>
      <Row justify="space-around">
        <Col span={4}><div className={box}>col-4</div></Col>
        <Col span={4}><div className={boxLight}>col-4</div></Col>
        <Col span={4}><div className={box}>col-4</div></Col>
        <Col span={4}><div className={boxLight}>col-4</div></Col>
      </Row>
      <p className="text-text-secondary">sub-element align evenly</p>
      <Row justify="space-evenly">
        <Col span={4}><div className={box}>col-4</div></Col>
        <Col span={4}><div className={boxLight}>col-4</div></Col>
        <Col span={4}><div className={box}>col-4</div></Col>
        <Col span={4}><div className={boxLight}>col-4</div></Col>
      </Row>
    </div>
  );
}
