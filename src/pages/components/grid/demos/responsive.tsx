import { Row, Col } from "@/components/ui/grid";

const box = "rounded-none bg-primary py-4 text-center text-white";
const boxLight = "rounded-none bg-primary-hover py-4 text-center text-white";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <Row>
        <Col xs={2} sm={4} md={6} lg={8} xl={10}><div className={box}>Col</div></Col>
        <Col xs={20} sm={16} md={12} lg={8} xl={4}><div className={boxLight}>Col</div></Col>
        <Col xs={2} sm={4} md={6} lg={8} xl={10}><div className={box}>Col</div></Col>
      </Row>
      <p className="text-text-secondary">span / offset per breakpoint (resize the window)</p>
      <Row>
        <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}><div className={box}>Col</div></Col>
        <Col xs={{ span: 11, offset: 1 }} lg={{ span: 6, offset: 2 }}><div className={boxLight}>Col</div></Col>
        <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}><div className={box}>Col</div></Col>
      </Row>
    </div>
  );
}
