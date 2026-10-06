import { Row, Col } from "@/components/ui/grid";

const box = "rounded-none bg-primary py-4 text-center text-white";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-text-secondary">Normal</p>
      <Row>
        <Col span={6} order={4}><div className={box}>1 col-order-4</div></Col>
        <Col span={6} order={3}><div className={box}>2 col-order-3</div></Col>
        <Col span={6} order={2}><div className={box}>3 col-order-2</div></Col>
        <Col span={6} order={1}><div className={box}>4 col-order-1</div></Col>
      </Row>
      <p className="text-text-secondary">Responsive</p>
      <Row>
        <Col span={6} xs={{ order: 1 }} sm={{ order: 2 }} md={{ order: 3 }} lg={{ order: 4 }}><div className={box}>1 col-order-responsive</div></Col>
        <Col span={6} xs={{ order: 2 }} sm={{ order: 1 }} md={{ order: 4 }} lg={{ order: 3 }}><div className={box}>2 col-order-responsive</div></Col>
        <Col span={6} xs={{ order: 3 }} sm={{ order: 4 }} md={{ order: 2 }} lg={{ order: 1 }}><div className={box}>3 col-order-responsive</div></Col>
        <Col span={6} xs={{ order: 4 }} sm={{ order: 3 }} md={{ order: 1 }} lg={{ order: 2 }}><div className={box}>4 col-order-responsive</div></Col>
      </Row>
    </div>
  );
}
