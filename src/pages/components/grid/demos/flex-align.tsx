import { Row, Col } from "@/components/ui/grid";

const box = "rounded-none bg-primary text-center text-white";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-text-secondary">Align Top</p>
      <Row justify="center" align="top" className="bg-fill-quaternary">
        <Col span={4}><div className={`${box} py-8`}>col-4</div></Col>
        <Col span={4}><div className={`${box} py-4`}>col-4</div></Col>
        <Col span={4}><div className={`${box} py-12`}>col-4</div></Col>
        <Col span={4}><div className={`${box} py-4`}>col-4</div></Col>
      </Row>
      <p className="text-text-secondary">Align Middle</p>
      <Row justify="space-around" align="middle" className="bg-fill-quaternary">
        <Col span={4}><div className={`${box} py-8`}>col-4</div></Col>
        <Col span={4}><div className={`${box} py-4`}>col-4</div></Col>
        <Col span={4}><div className={`${box} py-12`}>col-4</div></Col>
        <Col span={4}><div className={`${box} py-4`}>col-4</div></Col>
      </Row>
      <p className="text-text-secondary">Align Bottom</p>
      <Row justify="space-between" align="bottom" className="bg-fill-quaternary">
        <Col span={4}><div className={`${box} py-8`}>col-4</div></Col>
        <Col span={4}><div className={`${box} py-4`}>col-4</div></Col>
        <Col span={4}><div className={`${box} py-12`}>col-4</div></Col>
        <Col span={4}><div className={`${box} py-4`}>col-4</div></Col>
      </Row>
    </div>
  );
}
