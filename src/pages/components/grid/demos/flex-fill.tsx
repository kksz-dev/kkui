import { Row, Col } from "@/components/ui/grid";

const box = "rounded-none bg-primary py-4 text-center text-white";
const boxLight = "rounded-none bg-primary-hover py-4 text-center text-white";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-text-secondary">Percentage columns</p>
      <Row>
        <Col flex={2}><div className={box}>2 / 5</div></Col>
        <Col flex={3}><div className={boxLight}>3 / 5</div></Col>
      </Row>
      <p className="text-text-secondary">Fill rest</p>
      <Row>
        <Col flex="100px"><div className={box}>100px</div></Col>
        <Col flex="auto"><div className={boxLight}>Fill Rest</div></Col>
      </Row>
      <p className="text-text-secondary">Raw flex style</p>
      <Row>
        <Col flex="1 1 200px"><div className={box}>1 1 200px</div></Col>
        <Col flex="0 1 300px"><div className={boxLight}>0 1 300px</div></Col>
      </Row>
      <Row wrap={false}>
        <Col flex="none"><div className={`${box} px-4`}>none</div></Col>
        <Col flex="auto"><div className={boxLight}>auto with no-wrap</div></Col>
      </Row>
    </div>
  );
}
